---
sidebar_position: 1
---

# AWS Lambda 中的 WebAssembly 無伺服器函式

在本文中,我們將展示兩個以 Rust 與 WasmEdge 撰寫並部署在 AWS Lambda 上的無伺服器函式。一個是影像處理函式,另一個則是 TensorFlow 推論函式。

> 關於為何要在 AWS Lambda 上使用 WasmEdge 的洞察,請參考文章 [WebAssembly Serverless Functions in AWS Lambda](https://www.secondstate.io/articles/webassembly-serverless-functions-in-aws-lambda/)

## 先決條件

由於我們的展示 WebAssembly 函式是以 Rust 撰寫,因此您需要 [Rust 編譯器](https://www.rust-lang.org/tools/install)。請確認您依下列方式安裝 `wasm32-wasip1` 編譯器目標,以便產生 WebAssembly 位元組碼。

```bash
rustup target add wasm32-wasip1
```

展示應用程式的前端以 [Next.js](https://nextjs.org/) 撰寫,並部署在 AWS Lambda 上。我們假設您已具備使用 Next.js 與 Lambda 的基本知識。

## 範例 1:影像處理

我們的第一個展示應用程式讓使用者上傳影像,然後呼叫無伺服器函式將其轉換為黑白。透過 GitHub Pages 部署的 [線上展示](https://second-state.github.io/aws-lambda-wasm-runtime/) 已可使用。

fork [展示應用程式的 GitHub 儲存庫](https://github.com/second-state/aws-lambda-wasm-runtime) 即可開始。若要將應用程式部署到 AWS Lambda,請依照儲存庫的 [README](https://github.com/second-state/aws-lambda-wasm-runtime/blob/tensorflow/README.md) 中的指南操作。

### 建立函式

此儲存庫是一個標準的 Next.js 應用程式。後端無伺服器函式位於 `api/functions/image_grayscale` 資料夾中。`src/main.rs` 檔案包含 Rust 程式的原始碼。Rust 程式從 `STDIN` 讀取影像資料,然後將黑白影像輸出到 `STDOUT`。

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

> 當我們建置 docker 映像檔時,會執行 `api/pre.sh`。`pre.sh` 安裝 WasmEdge 執行環境,然後將每個 WebAssembly 位元組碼程式編譯為原生 `so` 函式庫,以便更快執行。

### 建立載入函式的服務腳本

[`api/hello.js`](https://github.com/second-state/aws-lambda-wasm-runtime/blob/main/api/hello.js) 腳本載入 WasmEdge 執行環境、在 WasmEdge 中啟動已編譯的 WebAssembly 程式,並透過 `STDIN` 傳遞上傳的影像資料。請注意,[`api/hello.js`](https://github.com/second-state/aws-lambda-wasm-runtime/blob/main/api/hello.js) 會執行由 [`api/pre.sh`](https://github.com/second-state/aws-lambda-wasm-runtime/blob/main/api/pre.sh) 產生的 `grayscale.so` 編譯檔案,以取得更佳效能。

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

`hello.js` 的 `exports.handler` 部分匯出一個非同步函式 handler,用來處理每次呼叫無伺服器函式時的不同事件。在此範例中,我們僅透過呼叫上述函式來處理影像並回傳結果,但根據您的需求可定義更複雜的事件處理行為。我們也需要回傳一些 `Access-Control-Allow` 標頭,以避免從瀏覽器呼叫無伺服器函式時出現 [Cross-Origin Resource Sharing (CORS)](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) 錯誤。如果您在重現此範例時遇到 CORS 錯誤,可以閱讀 [此處](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS/Errors) 進一步了解。

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

### 建置 Lambda 部署的 Docker 映像檔

現在我們有了 WebAssembly 位元組碼函式以及載入與連接到網頁請求的腳本。為了將它們部署為 AWS Lambda 上的函式服務,您仍需要將整個內容打包成 Docker 映像檔。

我們不會詳細說明如何建置 Docker 映像檔並部署到 AWS Lambda,因為儲存庫 [README 中的 Deploy 章節](https://github.com/second-state/aws-lambda-wasm-runtime/blob/tensorflow/README.md#deploy) 中已有詳細步驟。然而,我們將強調 [`Dockerfile`](https://github.com/second-state/aws-lambda-wasm-runtime/blob/tensorflow/api/Dockerfile) 中的某些行,以幫助您避免某些陷阱。

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

首先,我們從 [AWS Lambda 的 Node.js 基礎映像檔](https://hub.docker.com/r/amazon/aws-lambda-nodejs) 建置映像檔。使用 AWS Lambda 基礎映像檔的優勢在於它包含 [Lambda Runtime Interface Client (RIC)](https://github.com/aws/aws-lambda-nodejs-runtime-interface-client),這是 AWS Lambda 所必需的,我們需要在 Docker 映像檔中實作。Amazon Linux 使用 `yum` 作為套件管理員。

> 這些基礎映像檔包含 Amazon Linux 基礎作業系統、指定語言的執行環境、相依套件以及實作 Lambda [Runtime API](https://docs.aws.amazon.com/lambda/latest/dg/runtimes-api.html) 的 Lambda Runtime Interface Client (RIC)。Lambda Runtime Interface Client 讓您的執行環境可以從 Lambda 服務接收請求並向其傳送請求。

第二,我們需要將函式及其所有相依檔案放在 `/var/task` 目錄中。其他資料夾中的檔案不會被 AWS Lambda 執行。

第三,我們需要定義啟動容器時的預設指令。`CMD [ "hello.handler" ]` 代表每次呼叫無伺服器函式時,我們會呼叫 `hello.js` 中的 `handler` 函式。回想一下,我們已在前面步驟中透過 `hello.js` 中的 `exports.handler = ...` 定義並匯出 handler 函式。

### 選擇性:於本機測試 Docker 映像檔

從 AWS Lambda 基礎映像檔建置的 Docker 映像檔可依照 [此指南](https://docs.aws.amazon.com/lambda/latest/dg/images-test.html) 進行本機測試。本機測試需要 [AWS Lambda Runtime Interface Emulator (RIE)](https://github.com/aws/aws-lambda-runtime-interface-emulator),該工具已安裝在所有 AWS Lambda 基礎映像檔中。若要測試您的映像檔,首先請執行下列指令啟動 Docker 容器:

```bash
docker run -p 9000:8080  myfunction:latest
```

此指令會在您的本機 `http://localhost:9000/2015-03-31/functions/function/invocations` 上設定函式端點。

然後,在另一個終端機視窗中,執行:

```bash
curl -XPOST "http://localhost:9000/2015-03-31/functions/function/invocations" -d '{}'
```

您應該會在終端機中得到預期的輸出結果。

如果您不想使用 AWS Lambda 的基礎映像檔,也可以在建置 Docker 映像檔時使用自己的基礎映像檔並安裝 RIC 與/或 RIE。只要依照 [此指南](https://docs.aws.amazon.com/lambda/latest/dg/images-create.html) 的「**Create an image from an alternative base image**」章節操作即可。

就是這樣!建置 Docker 映像檔之後,您可以依照儲存庫 [README](https://github.com/second-state/aws-lambda-wasm-runtime/blob/tensorflow/README.md#deploy) 中的步驟,將它部署到 AWS Lambda。現在您的無伺服器函式就準備好大展身手了!

## 範例 2:AI 推論

[第二個展示](https://github.com/second-state/aws-lambda-wasm-runtime/tree/tensorflow) 應用程式讓使用者上傳影像,然後呼叫無伺服器函式分類影像中的主要主題。

它位於 [相同的 GitHub 儲存庫](https://github.com/second-state/aws-lambda-wasm-runtime/tree/tensorflow) 中,但在 `tensorflow` 分支。用於影像分類的後端無伺服器函式位於 `tensorflow` 分支的 `api/functions/image-classification` 資料夾中。`src/main.rs` 檔案包含 Rust 程式的原始碼。Rust 程式從 `STDIN` 讀取影像資料,然後將文字輸出至 `STDOUT`。它使用 WasmEdge Tensorflow API 執行 AI 推論。

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

同樣地,`api/pre.sh` 腳本會在此應用程式中安裝 WasmEdge 執行環境與其 Tensorflow 相依套件。它也會在部署時將 `classify.wasm` 位元組碼程式編譯為 `classify.so` 原生共用函式庫。

[`api/hello.js`](https://github.com/second-state/aws-lambda-wasm-runtime/blob/tensorflow/api/hello.js) 腳本載入 WasmEdge 執行環境、在 WasmEdge 中啟動已編譯的 WebAssembly 程式,並透過 `STDIN` 傳遞上傳的影像資料。請注意,[`api/hello.js`](https://github.com/second-state/aws-lambda-wasm-runtime/blob/tensorflow/api/hello.js) 會執行由 [`api/pre.sh`](https://github.com/second-state/aws-lambda-wasm-runtime/blob/tensorflow/api/pre.sh) 產生的 `classify.so` 編譯檔案,以取得更佳效能。handler 函式與我們先前的範例類似,此處省略。

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

您可以用先前範例所述的相同方式建置 Docker 映像檔並部署函式。現在您已建立一個用於主題分類的網頁應用程式!

接著,輪到您使用 [aws-lambda-wasm-runtime 儲存庫](https://github.com/second-state/aws-lambda-wasm-runtime/tree/main) 作為範本,於 AWS Lambda 上開發 Rust 無伺服器函式。期待您的優秀作品。
