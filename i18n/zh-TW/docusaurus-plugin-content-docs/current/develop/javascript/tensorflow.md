---
sidebar_position: 4
---

# AI 推論

WasmEdge-QuickJs 支援 WasmEdge WASI-NN 外掛，因此您的 JavaScript 可以對 AI 模型執行推論。

## 先決條件

安裝包含 WASI-NN 外掛的 WasmEdge。

- [搭配 Tensorflow Lite 後端](../../start/install.md#wasi-nn-plug-in-with-tensorflow-lite-backend)
- [搭配 PyTorch 後端](../../start/install.md#wasi-nn-plug-in-with-pytorch-backend)

與[標準](hello_world.md#prerequisites) QuickJS 的設定不同，您需要取得內建 WASI NN 支援的 WasmEdge QuickJS 執行環境。複製 wasmedge-quickjs 儲存庫並以該目錄作為目前的目錄。

```bash
git clone https://github.com/second-state/wasmedge-quickjs
cd wasmedge-quickjs
```

接著下載預先建置好的 [WasmEdge QuickJS + WASI NN 執行環境程式](#build-it-yourself)，並可選擇對其進行 AOT 編譯以獲得更佳效能。

```bash
curl -OL https://github.com/second-state/wasmedge-quickjs/releases/download/v0.5.0-alpha/wasmedge_quickjs_nn.wasm
wasmedgec wasmedge_quickjs_nn.wasm wasmedge_quickjs_nn.wasm
```

## Tensorflow Lite 範例

以下是 JavaScript 範例。您可以在 [example_js/tensorflow_lite_demo/wasi_nn_main.js](https://github.com/second-state/wasmedge-quickjs/tree/main/example_js/tensorflow_lite_demo/wasi_nn_main.js) 找到完整的程式碼。

```javascript
import { Image } from 'image';
import * as fs from 'fs';
import { NnGraph, NnContext, TENSOR_TYPE_U8 } from 'wasi_nn';

let img = new Image(__dirname + '/food.jpg');
let img_rgb = img.to_rgb().resize(192, 192);
let rgb_pix = img_rgb.pixels();

let data = fs.readFileSync(
  __dirname + '/lite-model_aiy_vision_classifier_food_V1_1.tflite',
);
let graph = new NnGraph([data.buffer], 'tensorflowlite', 'cpu');
let context = new NnContext(graph);
context.setInput(0, rgb_pix, [1, 192, 192, 3], TENSOR_TYPE_U8);
context.compute();

let output_view = new Uint8Array(2024);
context.getOutput(0, output_view.buffer);

let max = 0;
let max_idx = 0;
for (var i in output_view) {
  let v = output_view[i];
  if (v > max) {
    max = v;
    max_idx = i;
  }
}

let label_file = fs.readFileSync(
  __dirname + '/aiy_food_V1_labelmap.txt',
  'utf-8',
);
let lables = label_file.split(/\r?\n/);

let label = lables[max_idx];

print('label:');
print(label);
print('confidence:');
print(max / 255);
```

要在 WasmEdge 執行環境中執行此 JavaScript，請確認您已[隨 WasmEdge 安裝 WASI-NN 外掛與 Tensorflow Lite 相依函式庫](../../start/install.md#wasi-nn-plug-in-with-tensorflow-lite-backend)。您應該會看到 TensorFlow Lite ImageNet 模型辨識出的食物名稱。

```bash
$ wasmedge --dir .:. wasmedge_quickjs_nn.wasm example_js/tensorflow_lite_demo/wasi_nn_main.js
label:
Hot dog
confidence:
0.8941176470588236
```

## 自行建置

依照下列步驟，您可以為 WasmEdge 建置一個啟用 WASI-NN 的 JavaScript 直譯器。請先確認已安裝 GCC。如果尚未安裝，請執行以下命令列。

```bash
# 安裝 GCC
sudo apt update
sudo apt install build-essential
```

接著，我們便可建置 WasmEdge-Quickjs 執行環境。Fork 或複製 [wasmedge-quickjs 的 Github 儲存庫](https://github.com/second-state/wasmedge-quickjs)。

```bash
# 取得原始碼
git clone https://github.com/second-state/wasmedge-quickjs
cd wasmedge-quickjs

# 建置具有 WASI NN 的 QuickJS JavaScript 直譯器
cargo build --target wasm32-wasip1 --release --features=wasi_nn
```

基於 WebAssembly 的 JavaScript 直譯器程式位於建置的 `target` 目錄中。

WasmEdge 提供 `wasmedge compile` 工具，可將原生機器碼區段編譯並加入 wasm 檔案中。您可以使用 wasmedge 執行經原生指令化的 wasm 檔案，以獲得更快的效能。

```bash
wasmedge compile target/wasm32-wasip1/release/wasmedge_quickjs.wasm wasmedge_quickjs_nn.wasm
```
