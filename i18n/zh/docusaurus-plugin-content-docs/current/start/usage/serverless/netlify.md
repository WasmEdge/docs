---
sidebar_position: 2
---
# 在 Netlify 上的 WebAssembly 无服务器函数

在本文中，我们将展示在 Netlify 上部署的两个使用 Rust 和 WasmEdge 的无服务器函数。一个是图像处理功能，另一个是 TensorFlow 推理功能。

> 欲了解更多有关为何在 Netlify 上使用 WasmEdge，请参阅文章 [WebAssembly Serverless Functions in Netlify](https://www.secondstate.io/articles/netlify-wasmedge-webassembly-rust-serverless/)。

## 环境

由于我们的演示 WebAssembly 函数是用 Rust 编写的，你将需要一个 [Rust 编译器](https://www.rust-lang.org/tools/install)。确保按照以下步骤安装 `wasm32-wasi` 编译目标，以便生成 WebAssembly 字节码。

```bash
rustup target add wasm32-wasi
```

演示应用的前端是用 [Next.js](https://nextjs.org/) 编写的，并部署在 Netlify 上。我们假设你已经具备使用 Next.js 和 Netlify 的基本知识。

## 示例 1：图像处理

我们的第一个演示应用允许用户上传图像，然后调用无服务器函数将其转换为黑白。部署在 Netlify 上的 [实时演示](https://60fe22f9ff623f0007656040--reverent-hodgkin-dc1f51.netlify.app/) 可供使用。

首先请 fork [演示应用的 GitHub 存储库](https://github.com/second-state/netlify-wasm-runtime)。要在 Netlify 上部署该应用，只需[将你的 GitHub 存储库添加到 Netlify](https://www.netlify.com/blog/2016/09/29/a-step-by-step-guide-deploying-on-netlify/)。

该存储库是一个标准的 Netlify 平台 Next.js 应用程序。后端无服务器函数位于 [`api/functions/image_grayscale`](https://github.com/second-state/netlify-wasm-runtime/tree/main/api/functions/image-grayscale) 文件夹中。[`src/main.rs`](https://github.com/second-state/netlify-wasm-runtime/blob/main/api/functions/image-grayscale/src/main.rs) 文件包含了 Rust 程序的源代码。Rust 程序从 `STDIN` 读取图像数据，然后将黑白图像输出到 `STDOUT`。


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

将构建产物复制到 `api` 文件夹。

```bash
cp target/wasm32-wasi/release/grayscale.wasm ../../
```

> 在设置无服务器环境时，Netlify 函数会运行 [`api/pre.sh`](https://github.com/second-state/netlify-wasm-runtime/blob/main/api/pre.sh)。该脚本安装 WasmEdge 运行时，然后将每个 WebAssembly 字节码程序编译为本机 `so` 库，以实现更快的执行。

[`api/hello.js`](https://github.com/second-state/netlify-wasm-runtime/blob/main/api/hello.js) 脚本加载 WasmEdge 运行时，启动 WasmEdge 中编译的 WebAssembly 程序，并通过 `STDIN` 传递上传的图像数据。请注意，为了获得更好的性能，[`api/hello.js`](https://github.com/second-state/netlify-wasm-runtime/blob/main/api/hello.js) 运行的是由 [`api/pre.sh`](https://github.com/second-state/netlify-wasm-runtime/blob/main/api/pre.sh) 生成的编译后的 `grayscale.so` 文件。

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

准备就绪。现在[将存储库部署到 Netlify](https://www.netlify.com/blog/2016/09/29/a-step-by-step-guide-deploying-on-netlify/)，你就拥有了一个基于 Rust 和 WebAssembly 的高性能无服务器后端的 Netlify Jamstack 应用。

## 示例 2：AI 推理

[第二个演示](https://60ff7e2d10fe590008db70a9--reverent-hodgkin-dc1f51.netlify.app/) 应用允许用户上传图像，然后调用一个无服务器函数对图像中的主要主题进行分类。

它位于[与上一个示例相同的 GitHub 存储库](https://github.com/second-state/netlify-wasm-runtime/tree/tensorflow)中，但在 `tensorflow` 分支中。用于图像分类的后端无服务器函数位于 `tensorflow` 分支的 [`api/functions/image-classification`](https://github.com/second-state/netlify-wasm-runtime/tree/tensorflow/api/functions/image-classification) 文件夹中。[`src/main.rs`](https://github.com/second-state/netlify-wasm-runtime/blob/tensorflow/api/functions/image-classification/src/main.rs) 文件包含了 Rust 程序的源代码。Rust 程序从 `STDIN` 读取图像数据，然后将文本输出输出到 `STDOUT`。它利用 WasmEdge Tensorflow API 运行 AI 推理。

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

你可以使用 `cargo` 工具将 Rust 程序构建为 WebAssembly 字节码或本机代码。

```bash
cd api/functions/image-classification/
cargo build --release --target wasm32-wasi
```

将构建产物复制到 `api` 文件夹中。

```bash
cp target/wasm32-wasi/release/classify.wasm ../../
```

同样，[`api/pre.sh`](https://github.com/second-state/netlify-wasm-runtime/blob/tensorflow/api/pre.sh) 脚本在该应用程序中安装 WasmEdge 运行时及其 Tensorflow 依赖项。它还在部署时将 `classify.wasm` 字节码程序编译为 `classify.so` 本机共享库。

[`api/hello.js`](https://github.com/second-state/netlify-wasm-runtime/blob/tensorflow/api/hello.js) 脚本加载 WasmEdge 运行时，启动在 WasmEdge 中编译的 WebAssembly 程序，并通过 `STDIN` 传递上传的图像数据。请注意，[`api/hello.js`](https://github.com/second-state/netlify-wasm-runtime/blob/tensorflow/api/hello.js) 运行由 [`api/pre.sh`](https://github.com/second-state/netlify-wasm-runtime/blob/tensorflow/api/pre.sh) 生成的编译后的 `classify.so` 文件，以获得更好的性能。

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

现在，你可以[将你 Fork 的存储库部署到 Netlify](https://www.netlify.com/blog/2016/09/29/a-step-by-step-guide-deploying-on-netlify/)，获得一个用于主题分类的 Web 应用程序。

接下来，轮到你使用 [netlify-wasm-runtime 存储库](https://github.com/second-state/netlify-wasm-runtime) 作为模板在 Netlify 中开发 Rust 无服务器函数了。期待着你出色的工作。
