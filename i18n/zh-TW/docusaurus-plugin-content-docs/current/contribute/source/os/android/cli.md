---
sidebar_position: 2
---

# CLI 工具

在本節中,我們將示範如何在 Android 裝置上使用 WasmEdge CLI 工具。我們將展示完整的 WasmEdge 示範,在 Android 裝置上執行影像分類 (以 Tensorflow 為基礎的 AI 推論)。

<!-- prettier-ignore -->
:::note
`WasmEdge-tensorflow-tools` 在 0.12.1 版之後已棄用。我們未來將更新為使用 WasmEdge 外掛。
:::

## 安裝 Android 版本的 WasmEdge-TensorFlow-Tools

首先,在您的 Android 裝置上安裝 WasmEdge-TensorFlow-Tools 預先發行版。它與 Android 版本的 TensorFlow-Lite 動態共用函式庫搭配運作。

### 準備工作

#### Android 開發者選項

目前,WasmEdge 在 Android 裝置上僅支援 arm64-v8a 架構。您需要一台 arm64-v8a Android 模擬器或一台[已開啟開發者選項](https://developer.android.com/studio/debug/dev-options) 的實體裝置。WasmEdge 需要 Android 6.0 以上版本。

#### Android 開發 CLI

在 Ubuntu Linux 中,您可以使用 `apt-get` 指令安裝 Android 偵錯與測試工具 `adb`。在 Ubuntu 開發機器上使用 `adb shell` 指令,您可以開啟 CLI shell 以在連接的 Android 裝置上執行指令。

```bash
$ sudo apt-get install adb
$ adb devices
* daemon not running; starting now at tcp:5037
* daemon started successfully
List of devices attached
c657c643 device
$ adb shell
sirius:/ $
```

### 安裝 WasmEdge-TensorFlow-Tools 套件

在您的 Ubuntu 開發機器上使用下列指令下載 WasmEdge-TensorFlow-Tools 預先發行套件。

```bash
$ wget https://github.com/second-state/WasmEdge-tensorflow-tools/releases/download/0.12.1/WasmEdge-tensorflow-tools-0.12.1-android_aarch64.tar.gz
$ mkdir WasmEdge-tensorflow-tools && tar zxvf WasmEdge-tensorflow-tools-0.12.1-android_aarch64.tar.gz -C WasmEdge-tensorflow-tools
show-tflite-tensor
wasmedge-tensorflow-lite
```

### 安裝 Android 版本的 TensorFlow-Lite 共用函式庫

我們在 WasmEdge-Tensorflow-deps 套件中提供 Android 相容版本的 TensorFlow-Lite 動態共用函式庫。將套件下載至您的 Ubuntu 開發機器,如下所示。

```bash
$ wget https://github.com/second-state/WasmEdge-tensorflow-deps/releases/download/0.12.1/WasmEdge-tensorflow-deps-TFLite-0.12.1-android_aarch64.tar.gz
$ tar zxvf WasmEdge-tensorflow-deps-TFLite-0.12.1-android_aarch64.tar.gz -C WasmEdge-tensorflow-tools
libtensorflowlite_c.so
```

接著使用 `adb` 工具將下載的 WasmEdge-TensorFlow 套件推送至連接的 Android 裝置上。

```bash
adb push WasmEdge-tensorflow-tools /data/local/tmp
```

## 嘗試看看

### 範例應用程式

在此範例中,我們將示範一個標準的 [WasmEdge Tensorflow-Lite 範例應用程式](https://github.com/second-state/wasm-learning/tree/master/rust/birds_v1)。它可以從鳥類的 JPG 或 PNG 圖片辨識並分類鳥的種類。原始碼說明[請見此處](/develop/rust/wasinn/tensorflow_lite)。

```bash
git clone https://github.com/second-state/wasm-learning.git
cd wasm-learning/rust/birds_v1
```

使用 `cargo` 指令從 Rust 原始碼建置 WASM 位元組碼檔案。WASM 檔案位於 `target/wasm32-wasip1/release/birds_v1.wasm`。

```bash
rustup target add wasm32-wasip1
cargo build --release --target=wasm32-wasip1
```

使用 `adb` 將 WASM 位元組碼檔案、tensorflow lite 模型檔案與測試鳥類圖片檔案推送至 Android 裝置上。

```bash
adb push target/wasm32-wasip1/release/birds_v1.wasm /data/local/tmp/WasmEdge-tensorflow-tools
adb push lite-model_aiy_vision_classifier_birds_V1_3.tflite /data/local/tmp/WasmEdge-tensorflow-tools
adb push bird.jpg /data/local/tmp/WasmEdge-tensorflow-tools
```

### 執行 WasmEdge-TensorFlow-Tools

從 Ubuntu CLI 輸入 `adb shell` 以開啟連接的 Android 裝置的命令 shell。確認工具、程式與測試影像在 Android 裝置上的 `/data/local/tmp/WasmEdge-tensorflow-tools` 資料夾下皆可用。

```bash
$ adb shell
sirius:/ $ cd /data/local/tmp/WasmEdge-tensorflow-tools
sirius:/data/local/tmp/WasmEdge-tensorflow-tools $ ls
bird.jpg               lite-model_aiy_vision_classifier_birds_V1_3.tflite
birds_v1.wasm          show-tflite-tensor
libtensorflowlite_c.so wasmedge-tensorflow-lite
```

載入 TensorFlow-Lite 動態共用函式庫,並使用 `show-tflite-tensor` CLI 工具檢查 Tensorflow Lite 模型檔案。

```bash
sirius:/data/local/tmp/WasmEdge-tensorflow-tools $ export LD_LIBRARY_PATH=.:$LD_LIBRARY_PATH
sirius:/data/local/tmp/WasmEdge-tensorflow-tools $ chmod 777 show-tflite-tensor
sirius:/data/local/tmp/WasmEdge-tensorflow-tools $ ./show-tflite-tensor lite-model_aiy_vision_classifier_birds_V1_3.tflite
INFO: Initialized TensorFlow Lite runtime.
Input tensor nums: 1
    Input tensor name: module/hub_input/images_uint8
        dimensions: [1 , 224 , 224 , 3]
        data type: UInt8
        tensor byte size: 150528
Output tensor nums: 1
    Output tensor name: module/prediction
        dimensions: [1 , 965]
        data type: UInt8
        tensor byte size: 965
```

在 `wasmedge-tensorflow-lite` 中使用擴充的 WasmEdge 執行環境,在 Android 裝置上執行已編譯的 WASM 程式。它會載入 Tensorflow Lite 模型與鳥類圖片,並輸出鳥類分類與其信心值。

```bash
sirius:/data/local/tmp/WasmEdge-tensorflow-tools $ chmod 777 wasmedge-tensorflow-lite
sirius:/data/local/tmp/WasmEdge-tensorflow-tools $ ./wasmedge-tensorflow-lite --dir .:. birds_v1.wasm lite-model_aiy_vision_classifier_birds_V1_3.tflite bird.jpg
INFO: Initialized TensorFlow Lite runtime.
166 : 0.84705883
```

結果顯示鳥類類型位於[標籤檔案的第 166 行](https://github.com/second-state/wasm-learning/blob/master/rust/birds_v1/aiy_birds_V1_labels.txt#L166) (Sicalis flaveola),信心值為 84.7%。
