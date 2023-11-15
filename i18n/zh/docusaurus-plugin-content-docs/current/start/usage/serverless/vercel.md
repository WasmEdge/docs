---
sidebar_position: 5
---

# 运行在 Vercel 上的 Rust 和 WebAssembly 无服务器函数

在本文中，我们将展示在 Vercel 上部署的两个使用 Rust 和 WasmEdge 编写的无服务器函数。一个是图像处理函数，另一个是 TensorFlow 推理函数。

> 欲了解更多关于为何在 Vercel 上使用 WasmEdge，请参阅文章 [Rust and WebAssembly Serverless Functions in Vercel](https://www.secondstate.io/articles/vercel-wasmedge-webassembly-rust/)。

## 环境

由于我们的演示 WebAssembly 函数是用 Rust 编写的，你将需要 [Rust 编译器](https://www.rust-lang.org/tools/install)。确保你按照以下方式安装 `wasm32-wasi` 编译目标，以生成 WebAssembly 字节码。

```bash
rustup target add wasm32-wasi
```

演示应用的前端是用 [Next.js](https://nextjs.org/) 编写的，并部署在 Vercel 上。我们假设你对如何使用 Vercel 已经有基本的了解。

## 示例1：图像处理

我们的第一个演示应用允许用户上传图像，然后调用一个无服务器函数将其转换为黑白图像。在 Vercel 上部署的[实时演示](https://vercel-wasm-runtime.vercel.app/)可以直接使用。

首先 Fork [演示应用的 GitHub 存储库](https://github.com/second-state/vercel-wasm-runtime)。要在 Vercel 上部署应用程序，只需从 [Vercel for Github](https://vercel.com/docs/git/vercel-for-github) 网页中[导入 Github 存储库](https://vercel.com/docs/git#deploying-a-git-repository)。

该存储库是一个标准的适用于 Vercel 平台的 Next.js 应用程序。后端无服务器函数位于 [`api/functions/image_grayscale`](https://github.com/second-state/vercel-wasm-runtime/tree/main/api/functions/image-grayscale) 文件夹中。[`src/main.rs`](https://github.com/second-state/vercel-wasm-runtime/blob/main/api/functions/image-grayscale/src/main.rs) 文件包含了 Rust 程序的源代码。Rust 程序从 `STDIN` 读取图像数据，然后将黑白图像输出到 `STDOUT`。

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
cargo build --release --target wasm32-wasi
```

将构建出结果复制到 `api` 文件夹。

```bash
cp target/wasm32-wasi/release/grayscale.wasm ../../
```

> 在构建 Docker 镜像时，将执行 `api/pre.sh`。`pre.sh` 安装 WasmEdge 运行时，然后将每个 WebAssembly 字节码程序编译成本地 `so` 库，以实现更快的执行。

### 创建服务脚本以加载函数

[`api/hello.js`](https://github.com/second-state/vercel-wasm-runtime/blob/main/api/hello.js) 脚本加载 WasmEdge 运行时，在 WasmEdge 中启动编译后的 WebAssembly 程序，并通过 `STDIN` 传递上传的图像数据。请注意，为了实现更好的性能，[`api/hello.js`](https://github.com/second-state/vercel-wasm-runtime/blob/main/api/hello.js) 运行的是由 [`api/pre.sh`](https://github.com/second-state/vercel-wasm-runtime/blob/main/api/pre.sh) 生成的编译后的 `grayscale.so` 文件。

```javascript
const fs = require('fs');
const { spawn } = require('child_process');
const path = require('path');

module.exports = (req, res) => {
  const wasmedge = spawn(path.join(__dirname, 'wasmedge'), [
    path.join(__dirname, 'grayscale.so'),
  ]);

  let d = [];
  wasmedge.stdout.on('data', (data) => {
    d.push(data);
  });

  wasmedge.on('close', (code) => {
    let buf = Buffer.concat(d);

    res.setHeader('Content-Type', req.headers['image-type']);
    res.send(buf);
  });

  wasmedge.stdin.write(req.body);
  wasmedge.stdin.end('');
};
```

如上所示。现在[将存储库部署到 Vercel](https://vercel.com/docs/git#deploying-a-git-repository)，你现在拥有了一个使用高性能 Rust 和 WebAssembly 构建的无服务器后端的 Vercel Jamstack 应用程序。

## 示例 2：AI 推理

[第二个演示](https://vercel-wasm-runtime.vercel.app/) 应用允许用户上传图像，然后调用一个无服务器函数对图像的主要对象进行分类。

这个示例位于[与之前示例相同的 GitHub 存储库](https://github.com/second-state/vercel-wasm-runtime)，但在 `tensorflow` 分支中。注意：当你[在 Vercel 网站上导入此 GitHub 存储库](https://vercel.com/docs/git#deploying-a-git-repository)时，它会为每个分支创建一个[预览 URL](https://vercel.com/docs/platform/deployments#preview)。`tensorflow` 分支将有其自己的部署URL。

用于图像分类的后端无服务器函数位于 `tensorflow` 分支中的 [`api/functions/image-classification`](https://github.com/second-state/vercel-wasm-runtime/tree/tensorflow/api/functions/image-classification) 文件夹中。[`src/main.rs`](https://github.com/second-state/vercel-wasm-runtime/blob/tensorflow/api/functions/image-classification/src/main.rs) 文件包含了 Rust 程序的源代码。Rust 程序从 `STDIN` 读取图像数据，然后将文本输出到 `STDOUT`。它利用了 WasmEdge Tensorflow API 来进行AI 推理。

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
cargo build --release --target wasm32-wasi
```

将构建产物复制到 `api` 文件夹。

```bash
cp target/wasm32-wasi/release/classify.wasm ../../
```

同样，`api/pre.sh` 脚本在此应用程序中安装了 WasmEdge 运行时及其 TensorFlow 依赖项。它还在部署时将 `classify.wasm` 字节码程序编译为 `classify.so` 本机共享库。

[`api/hello.js`](https://github.com/second-state/vercel-wasm-runtime/blob/tensorflow/api/hello.js) 文件符合 Vercel 无服务器规范。它加载 WasmEdge 运行时，在 WasmEdge 中启动已编译的 WebAssembly 程序，并通过 `STDIN` 传递上传的图像数据。请注意，[`api/hello.js`](https://github.com/second-state/vercel-wasm-runtime/blob/tensorflow/api/hello.js) 运行由 [`api/pre.sh`](https://github.com/second-state/vercel-wasm-runtime/blob/tensorflow/api/pre.sh) 生成的已编译 `classify.so` 文件，以获得更佳的性能。

```javascript
const fs = require('fs');
const { spawn } = require('child_process');
const path = require('path');

module.exports = (req, res) => {
  const wasmedge = spawn(
    path.join(__dirname, 'wasmedge-tensorflow-lite'),
    [path.join(__dirname, 'classify.so')],
    { env: { LD_LIBRARY_PATH: __dirname } },
  );

  let d = [];
  wasmedge.stdout.on('data', (data) => {
    d.push(data);
  });

  wasmedge.on('close', (code) => {
    res.setHeader('Content-Type', `text/plain`);
    res.send(d.join(''));
  });

  wasmedge.stdin.write(req.body);
  wasmedge.stdin.end('');
};
```

现在，你可以[将你 Fork 的存储库部署到 Vercel](https://vercel.com/docs/git#deploying-a-git-repository)，获得一个用于主题分类的 Web 应用。

接下来，轮到你使用 [vercel-wasm-runtime 存储库](https://github.com/second-state/vercel-wasm-runtime) 作为模板，在 Vercel 中开发你自己的 Rust 无服务器函数了。期待着您出色的工作。
