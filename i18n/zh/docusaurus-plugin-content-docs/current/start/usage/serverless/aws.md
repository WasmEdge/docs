---
sidebar_position: 1
---

# 在 AWS Lambda 中使用 WebAssembly Serverless Functions

在本文中，我们将展示在 AWS Lambda 上部署的两个使用 Rust 和 WasmEdge 编写的无服务器函数。一个是图像处理函数，另一个是 TensorFlow 推理函数。

> 想了解为什么要在 AWS Lambda 上使用 WasmEdge，请参阅文章 [WebAssembly Serverless Functions in AWS Lambda](https://www.secondstate.io/articles/webassembly-serverless-functions-in-aws-lambda/)。

## 环境

由于我们的演示 WebAssembly 函数是用 Rust 编写的，你需要安装 [Rust 编译器](https://www.rust-lang.org/tools/install)。确保你按照以下方式安装 `wasm32-wasip1` 编译目标，以生成 WebAssembly 字节码。

```bash
rustup target add wasm32-wasip1
```

演示应用的前端是用 [Next.js](https://nextjs.org/) 编写的，并部署在 AWS Lambda 上。我们假设你已经对如何使用 Next.js 和 Lambda 有基本的了解。

## 示例1：图像处理

我们的第一个演示应用允许用户上传图像，然后调用一个无服务器函数将其转换为黑白图像。通过 GitHub Pages 部署了一个[实时演示](https://second-state.github.io/aws-lambda-wasm-runtime/)。

首先 Fork [demo 应用的 GitHub 存储库](https://github.com/second-state/aws-lambda-wasm-runtime)。要在 AWS Lambda 上部署应用程序，请按照存储库 [README](https://github.com/second-state/aws-lambda-wasm-runtime/blob/tensorflow/README.md)中的指南进行操作。

### 创建函数

此存储库是一个标准的 Next.js 应用程序。后端无服务器函数位于 `api/functions/image_grayscale` 文件夹中。`src/main.rs` 文件包含了 Rust 程序的源代码。Rust 程序从 `STDIN` 读取图像数据，然后将黑白图像输出到 `STDOUT`。

```rust
use hex;
use std::io::{self, Read};
use image::{ImageOutputFormat, ImageFormat};

fn main() {
  let mut buf = Vec::new();
  io::stdin().read_to_end(&mut buf).unwrap();

  let image_format_detected: ImageFormat = image::guess_format(&buf).unwrap();
  let img = image::load_from_memory(&buf).unwrap();
  let filtered = img.grayscale();
  let mut buf = vec![];
  match image_format_detected {
    ImageFormat::Gif => {
      filtered.write_to(&mut buf, ImageOutputFormat::Gif).unwrap();
    },
    _ => {
      filtered.write_to(&mut buf, ImageOutputFormat::Png).unwrap();
    },
  };
  io::stdout().write_all(&buf).unwrap();
  io::stdout().flush().unwrap();
}
```

你可以使用 Rust 的 `cargo` 工具将 Rust 程序构建成 WebAssembly 字节码或本机代码。

```bash
cd api/functions/image-grayscale/
cargo build --release --target wasm32-wasip1
```

将构建出结果复制到 `api` 文件夹。

```bash
cp target/wasm32-wasip1/release/grayscale.wasm ../../
```

> 在构建 Docker 镜像时，将执行 `api/pre.sh`。`pre.sh` 安装 WasmEdge 运行时，然后将每个 WebAssembly 字节码程序编译成本地 `so` 库，以实现更快的执行。

### 创建服务脚本以加载函数

[`api/hello.js`](https://github.com/second-state/aws-lambda-wasm-runtime/blob/main/api/hello.js) 脚本加载 WasmEdge 运行时，在 WasmEdge 中启动编译后的 WebAssembly 程序，并通过 `STDIN` 传递上传的图像数据。请注意，为了实现更好的性能，[`api/hello.js`](https://github.com/second-state/aws-lambda-wasm-runtime/blob/main/api/hello.js) 运行的由 [`api/pre.sh`](https://github.com/second-state/aws-lambda-wasm-runtime/blob/main/api/pre.sh) 生成的编译后的 `grayscale.so` 文件。

```javascript
const { spawn } = require('child_process');
const path = require('path');

function _runWasm(reqBody) {
  return new Promise((resolve) => {
    const wasmedge = spawn(path.join(__dirname, 'wasmedge'), [
      path.join(__dirname, 'grayscale.so'),
    ]);

    let d = [];
    wasmedge.stdout.on('data', (data) => {
      d.push(data);
    });

    wasmedge.on('close', (code) => {
      let buf = Buffer.concat(d);
      resolve(buf);
    });

    wasmedge.stdin.write(reqBody);
    wasmedge.stdin.end('');
  });
}
```

`hello.js` 中的 `exports.handler` 部分导出了一个异步函数处理程序，用于处理每次调用无服务器函数时的不同事件。在本例中，我们简单地通过调用上述函数处理图像并返回结果，但可以根据你的需求定义更复杂的事件处理行为。此外，我们还需要返回一些 `Access-Control-Allow` 标头以避免在从浏览器调用无服务器函数时出现 [跨源资源共享（CORS）](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/CORS) 错误。如果你在复制我们的示例时遇到 CORS 错误，可以在[这里](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/CORS/Errors)了解更多关于 CORS 错误的信息。

```javascript
exports.handler = async function (event, context) {
  var typedArray = new Uint8Array(
    event.body.match(/[\da-f]{2}/gi).map(function (h) {
      return parseInt(h, 16);
    }),
  );
  let buf = await _runWasm(typedArray);
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Headers':
        'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods':
        'DELETE, GET, HEAD, OPTIONS, PATCH, POST, PUT',
    },
    body: buf.toString('hex'),
  };
};
```

### 构建用于 Lambda 部署的 Docker 镜像

现在我们拥有了 WebAssembly 字节码函数以及加载和连接到网络请求的脚本。为了将它们部署为 AWS Lambda 上的函数服务，你仍然需要将整个内容打包成一个 Docker 镜像。

我们不会详细介绍如何构建 Docker 镜像并在 AWS Lambda 上部署，因为在[存储库 README 的部署部分](https://github.com/second-state/aws-lambda-wasm-runtime/blob/tensorflow/README.md#deploy)中有详细的步骤。然而，我们将为你突出显示 [`Dockerfile`](https://github.com/second-state/aws-lambda-wasm-runtime/blob/tensorflow/api/Dockerfile) 中的一些行，以避免一些问题。

```dockerfile
FROM public.ecr.aws/lambda/nodejs:14

# Change directory to /var/task
WORKDIR /var/task

RUN yum update -y && yum install -y curl tar gzip

# Bundle and pre-compile the wasm files
COPY *.wasm ./
COPY pre.sh ./
RUN chmod +x pre.sh
RUN ./pre.sh

# Bundle the JS files
COPY *.js ./

CMD [ "hello.handler" ]
```

首先，我们是从 [AWS Lambda 的 Node.js 基础镜像](https://hub.docker.com/r/amazon/aws-lambda-nodejs)构建镜像。使用 AWS Lambda 基础镜像的优势在于它包含了[Lambda Runtime Interface Client (RIC)](https://github.com/aws/aws-lambda-nodejs-runtime-interface-client)，这是 Lambda 运行环境中所需的依赖。Amazon Linux 使用 `yum` 作为包管理器。

> 这些基础镜像包含了 Amazon Linux Base 操作系统、特定语言的运行时、依赖项和 Lambda Runtime Interface Client (RIC)，该客户端实现了 Lambda [运行时 API](https://docs.aws.amazon.com/lambda/latest/dg/runtimes-api.html)。Lambda Runtime Interface Client 允许你的运行时接收来自 Lambda 服务的请求并发送请求。

其次，我们需要将我们的函数及其所有依赖项放在 `/var/task` 目录中。其他文件夹中的文件将不会被AWS Lambda执行。

第三，我们需要定义启动容器时的默认命令。`CMD [ "hello.handler" ]` 表示在调用无服务器函数时，我们将调用 `hello.js` 中的 `handler` 函数。请回想我们在之前的步骤中通过 `exports.handler = ...` 在 `hello.js` 中定义并导出了处理程序函数。

### 可选：本地测试 Docker 镜像

从 AWS Lambda 的基础镜像构建的 Docker 镜像可以按照[此指南](https://docs.aws.amazon.com/lambda/latest/dg/images-test.html)在本地进行测试。本地测试需要 [AWS Lambda Runtime Interface Emulator (RIE)](https://github.com/aws/aws-lambda-runtime-interface-emulator)，它已经安装在所有 AWS Lambda 的基础镜像中。要测试你的镜像，首先运行以下命令启动 Docker 容器：

```bash
docker run -p 9000:8080  myfunction:latest
```

此命令在本地机器上设置一个函数接口，地址为 `http://localhost:9000/2015-03-31/functions/function/invocations`。

然后，从另一个终端窗口运行：

```bash
curl -XPOST "http://localhost:9000/2015-03-31/functions/function/invocations" -d '{}'
```

你应该在终端中获得你期望的输出。

如果你不想使用 AWS Lambda 的基础镜像，你也可以使用自己的基础镜像，并在构建 Docker 镜像时安装 RIC 和/或 RIE。只需按照[此指南](https://docs.aws.amazon.com/lambda/latest/dg/images-create.html)中的 **Create an image from an alternative base image** 部分进行操作。

准备就绪！在构建完 Docker 镜像后，可以参考存储库 [README](https://github.com/second-state/aws-lambda-wasm-runtime/blob/tensorflow/README.md#deploy)中简述的步骤将其部署到 AWS Lambda。然后你的无服务器函数就可以开始工作了！

## 示例 2：AI 推理

[第二个演示](https://github.com/second-state/aws-lambda-wasm-runtime/tree/tensorflow) 应用允许用户上传图像，然后调用一个无服务器函数对图像的主要对象进行分类。

它位于与之前示例相同的 [GitHub 存储库](https://github.com/second-state/aws-lambda-wasm-runtime/tree/tensorflow)，但在 `tensorflow` 分支中。用于图像分类的后端无服务器函数位于 `tensorflow` 分支中的 `api/functions/image-classification` 文件夹中。`src/main.rs` 文件包含了 Rust 程序的源代码。Rust 程序从 `STDIN` 读取图像数据，然后将文本输出到 `STDOUT`。它利用了 WasmEdge Tensorflow API 来运行AI推理。

```rust
pub fn main() {
  // Step 1: Load the TFLite model
  let model_data: &[u8] = include_bytes!("models/mobilenet_v1_1.0_224/mobilenet_v1_1.0_224_quant.tflite");
  let labels = include_str!("models/mobilenet_v1_1.0_224/labels_mobilenet_quant_v1_224.txt");

  // Step 2: Read image from STDIN
  let mut buf = Vec::new();
  io::stdin().read_to_end(&mut buf).unwrap();

  // Step 3: Resize the input image for the tensorflow model
  let flat_img = wasmedge_tensorflow_interface::load_jpg_image_to_rgb8(&buf, 224, 224);

  // Step 4: AI inference
  let mut session = wasmedge_tensorflow_interface::Session::new(&model_data, wasmedge_tensorflow_interface::ModelType::TensorFlowLite);
  session.add_input("input", &flat_img, &[1, 224, 224, 3])
         .run();
  let res_vec: Vec<u8> = session.get_output("MobilenetV1/Predictions/Reshape_1");

  // Step 5: Find the food label that responds to the highest probability in res_vec
  // ... ...
  let mut label_lines = labels.lines();
  for _i in 0..max_index {
    label_lines.next();
  }

  // Step 6: Generate the output text
  let class_name = label_lines.next().unwrap().to_string();
  if max_value > 50 {
    println!("It {} a <a href='https://www.google.com/search?q={}'>{}</a> in the picture", confidence.to_string(), class_name, class_name);
  } else {
    println!("It does not appears to be any food item in the picture.");
  }
}
```

你可以使用 `cargo` 工具将 Rust 程序构建成 WebAssembly 字节码或本机代码。

```bash
cd api/functions/image-classification/
cargo build --release --target wasm32-wasip1
```

将构建产物复制到 `api` 文件夹。

```bash
cp target/wasm32-wasip1/release/classify.wasm ../../
```

同样，`api/pre.sh` 脚本在此应用程序中安装了 WasmEdge 运行时及其 TensorFlow 依赖项。它还在部署时将 `classify.wasm` 字节码程序编译为 `classify.so` 本机共享库。

[`api/hello.js`](https://github.com/second-state/aws-lambda-wasm-runtime/blob/tensorflow/api/hello.js) 脚本加载 WasmEdge 运行时，在 WasmEdge 中启动编译后的 WebAssembly 程序，并通过 `STDIN` 传递上传的图像数据。请注意，[`api/hello.js`](https://github.com/second-state/aws-lambda-wasm-runtime/blob/tensorflow/api/hello.js) 运行由 [`api/pre.sh`](https://github.com/second-state/aws-lambda-wasm-runtime/blob/tensorflow/api/pre.sh) 生成的编译后的 `classify.so` 文件，以获得更好的性能。处理函数类似于我们之前的示例，在此省略。

```javascript
const { spawn } = require('child_process');
const path = require('path');

function _runWasm(reqBody) {
  return new Promise(resolve => {
    const wasmedge = spawn(
      path.join(__dirname, 'wasmedge-tensorflow-lite'),
      [path.join(__dirname, 'classify.so')],
      {env: {'LD_LIBRARY_PATH': __dirname}}
    );

    let d = [];
    wasmedge.stdout.on('data', (data) => {
      d.push(data);
    });

    wasmedge.on('close', (code) => {
      resolve(d.join(''));
    });

    wasmedge.stdin.write(reqBody);
    wasmedge.stdin.end('');
  });
}

exports.handler = ... // _runWasm(reqBody) is called in the handler
```

你可以按照之前的示例中概述的方式构建你的 Docker 镜像并部署函数。现在你已经创建了一个用于主题分类的 Web 应用！

接下来，轮到你使用 [aws-lambda-wasm-runtime 存储库](https://github.com/second-state/aws-lambda-wasm-runtime/tree/main) 作为模板，在 AWS Lambda 上开发 Rust 无服务器函数了。期待着你的出色工作。
