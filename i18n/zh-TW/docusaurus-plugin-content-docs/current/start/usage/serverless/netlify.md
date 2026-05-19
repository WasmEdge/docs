---
sidebar_position: 2
---

# Netlify 中的 WebAssembly 無伺服器函式

在本文中,我們將展示兩個以 Rust 與 WasmEdge 撰寫並部署在 Netlify 上的無伺服器函式。一個是影像處理函式,另一個則是 TensorFlow 推論函式。

> 關於為何要在 Netlify 上使用 WasmEdge 的更多洞察,請參考文章 [WebAssembly Serverless Functions in Netlify](https://www.secondstate.io/articles/netlify-wasmedge-webassembly-rust-serverless/)。

## 先決條件

由於我們的展示 WebAssembly 函式是以 Rust 撰寫,因此您需要 [Rust 編譯器](https://www.rust-lang.org/tools/install)。請確認您依下列方式安裝 `wasm32-wasip1` 編譯器目標,以便產生 WebAssembly 位元組碼。

```bash
rustup target add wasm32-wasip1
```

展示應用程式的前端以 [Next.js](https://nextjs.org/) 撰寫,並部署在 Netlify 上。我們假設您已具備使用 Next.js 與 Netlify 的基本知識。

## 範例 1:影像處理

我們的第一個展示應用程式讓使用者上傳影像,然後呼叫無伺服器函式將其轉換為黑白。部署在 Netlify 上的 [線上展示](https://60fe22f9ff623f0007656040--reverent-hodgkin-dc1f51.netlify.app/) 已可使用。

fork [展示應用程式的 GitHub 儲存庫](https://github.com/second-state/netlify-wasm-runtime) 即可開始。若要將應用程式部署到 Netlify,只需 [將您的 github 儲存庫加入 Netlify](https://www.netlify.com/blog/2016/09/29/a-step-by-step-guide-deploying-on-netlify/)。

此儲存庫是適用於 Netlify 平台的標準 Next.js 應用程式。後端無伺服器函式位於 [`api/functions/image_grayscale`](https://github.com/second-state/netlify-wasm-runtime/tree/main/api/functions/image-grayscale) 資料夾中。[`src/main.rs`](https://github.com/second-state/netlify-wasm-runtime/blob/main/api/functions/image-grayscale/src/main.rs) 檔案包含 Rust 程式的原始碼。Rust 程式從 `STDIN` 讀取影像資料,然後將黑白影像輸出至 `STDOUT`。

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

您可以使用 Rust 的 `cargo` 工具將 Rust 程式建置為 WebAssembly 位元組碼或原生程式碼。

```bash
cd api/functions/image-grayscale/
cargo build --release --target wasm32-wasip1
```

將建置產物複製到 `api` 資料夾。

```bash
cp target/wasm32-wasip1/release/grayscale.wasm ../../
```

> Netlify 函式會在設定無伺服器環境時執行 [`api/pre.sh`](https://github.com/second-state/netlify-wasm-runtime/blob/main/api/pre.sh)。它安裝 WasmEdge 執行環境,然後將每個 WebAssembly 位元組碼程式編譯為原生 `so` 函式庫,以便更快執行。

[`api/hello.js`](https://github.com/second-state/netlify-wasm-runtime/blob/main/api/hello.js) 腳本載入 WasmEdge 執行環境、在 WasmEdge 中啟動已編譯的 WebAssembly 程式,並透過 `STDIN` 傳遞上傳的影像資料。請注意,[`api/hello.js`](https://github.com/second-state/netlify-wasm-runtime/blob/main/api/hello.js) 會執行由 [`api/pre.sh`](https://github.com/second-state/netlify-wasm-runtime/blob/main/api/pre.sh) 產生的 `grayscale.so` 編譯檔案,以取得更佳效能。

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

就是這樣。[將儲存庫部署到 Netlify](https://www.netlify.com/blog/2016/09/29/a-step-by-step-guide-deploying-on-netlify/),現在您就擁有一個由高效能的 Rust 與 WebAssembly 無伺服器後端支援的 Netlify Jamstack 應用程式。

## 範例 2:AI 推論

[第二個展示](https://60ff7e2d10fe590008db70a9--reverent-hodgkin-dc1f51.netlify.app/) 應用程式讓使用者上傳影像,然後呼叫無伺服器函式分類影像中的主要主題。

它位於 [相同的 GitHub 儲存庫](https://github.com/second-state/netlify-wasm-runtime/tree/tensorflow) 中,但在 `tensorflow` 分支。用於影像分類的後端無伺服器函式位於 `tensorflow` 分支的 [`api/functions/image-classification`](https://github.com/second-state/netlify-wasm-runtime/tree/tensorflow/api/functions/image-classification) 資料夾中。[`src/main.rs`](https://github.com/second-state/netlify-wasm-runtime/blob/tensorflow/api/functions/image-classification/src/main.rs) 檔案包含 Rust 程式的原始碼。Rust 程式從 `STDIN` 讀取影像資料,然後將文字輸出至 `STDOUT`。它使用 WasmEdge Tensorflow API 執行 AI 推論。

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

您可以使用 `cargo` 工具將 Rust 程式建置為 WebAssembly 位元組碼或原生程式碼。

```bash
cd api/functions/image-classification/
cargo build --release --target wasm32-wasip1
```

將建置產物複製到 `api` 資料夾。

```bash
cp target/wasm32-wasip1/release/classify.wasm ../../
```

同樣地,[`api/pre.sh`](https://github.com/second-state/netlify-wasm-runtime/blob/tensorflow/api/pre.sh) 腳本會在此應用程式中安裝 WasmEdge 執行環境與其 Tensorflow 相依套件。它也會在部署時將 `classify.wasm` 位元組碼程式編譯為 `classify.so` 原生共用函式庫。

[`api/hello.js`](https://github.com/second-state/netlify-wasm-runtime/blob/tensorflow/api/hello.js) 腳本載入 WasmEdge 執行環境、在 WasmEdge 中啟動已編譯的 WebAssembly 程式,並透過 `STDIN` 傳遞上傳的影像資料。請注意,[`api/hello.js`](https://github.com/second-state/netlify-wasm-runtime/blob/tensorflow/api/hello.js) 會執行由 [`api/pre.sh`](https://github.com/second-state/netlify-wasm-runtime/blob/tensorflow/api/pre.sh) 產生的 `classify.so` 編譯檔案,以取得更佳效能。

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

您現在可以 [將您 fork 的儲存庫部署到 Netlify](https://www.netlify.com/blog/2016/09/29/a-step-by-step-guide-deploying-on-netlify/),並擁有一個用於主題分類的網頁應用程式。

接著,輪到您使用 [netlify-wasm-runtime 儲存庫](https://github.com/second-state/netlify-wasm-runtime) 作為範本,於 Netlify 中開發 Rust 無伺服器函式。期待您的優秀作品。
