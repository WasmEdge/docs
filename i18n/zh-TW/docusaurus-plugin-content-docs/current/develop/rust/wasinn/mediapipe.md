---
sidebar_position: 2
---

# Mediapipe 解決方案

Mediapipe 是由 Google 所開發、相當熱門的 AI 模型集合，著重於對媒體檔案與串流的智慧處理。`mediapipe-rs` crate 是一個 Rust 函式庫，可使用 Mediapipe 套組的模型進行資料處理。此 crate 提供 Rust API，可對媒體檔案或串流中的資料進行前處理、執行 AI 模型推論以分析資料，再根據 AI 輸出對媒體資料進行後處理或加工。

## 必要條件

除了[一般的 WasmEdge 與 Rust 需求](../../rust/setup.md)之外，請確認您已[安裝具有 TensorFlow Lite 的 WASI-NN 外掛](../../../start/install.md#wasi-nn-plug-in-with-tensorflow-lite-backend)。

## 快速開始

將下列範例專案 clone 到您的本機電腦或開發環境。

```bash
git clone https://github.com/juntao/demo-object-detection
cd demo-object-detection/
```

使用 Mediapipe 物件偵測模型建置推論應用程式。

```bash
cargo build --target wasm32-wasip1 --release
wasmedge compile target/wasm32-wasip1/release/demo-object-detection.wasm demo-object-detection.wasm
```

對影像執行推論應用程式。輸入的 `example.jpg` 影像如下所示。

![The input image](https://raw.githubusercontent.com/juntao/demo-object-detection/main/example.jpg)

```bash
wasmedge --dir .:. demo-object-detection.wasm example.jpg output.jpg
```

推論結果 `output.jpg` 影像如下所示。

![The output image](https://raw.githubusercontent.com/WasmEdge/mediapipe-rs/main/assets/doc/cat_and_dog_detection.jpg)

上方推論命令的主控台輸出會顯示偵測到的物件與其邊界。

```bash
DetectionResult:
  Detection #0:
    Box: (left: 0.47665566, top: 0.05484602, right: 0.87270254, bottom: 0.87143743)
    Category #0:
      Category name: "dog"
      Display name:  None
      Score:         0.7421875
      Index:         18
  Detection #1:
    Box: (left: 0.12402746, top: 0.37931007, right: 0.5297544, bottom: 0.8517805)
    Category #0:
      Category name: "cat"
      Display name:  None
      Score:         0.7421875
      Index:         17
```

## 了解程式碼

[main.rs](https://github.com/juntao/demo-object-detection/blob/main/src/main.rs) 是完整的範例 Rust 原始碼。所有 `mediapipe-rs` API 都遵循一個共同的模式。會設計一個 Rust struct 來搭配模型運作，該 struct 包含對模型資料進行前處理與後處理所需的函式。例如，我們可以使用 builder 模式建立 `detector` 實例，並可從 Mediapipe 模型庫的任意「物件偵測」模型來建構。

```rust
let model_data: &[u8] = include_bytes!("mobilenetv2_ssd_256_uint8.tflite");
let detector = ObjectDetectorBuilder::new()
        .max_results(2)
        .build_from_buffer(model_data)?;
```

`detect()` 函式接收一張影像，將其前處理成張量陣列，於 mediapipe 物件偵測模型上執行推論，再將傳回的張量陣列後處理為易讀的格式，並儲存在 `detection_result` 中。

```rust
let mut input_img = image::open(img_path)?;
let detection_result = detector.detect(&input_img)?;
println!("{}", detection_result);
```

此外，`mediapipe-rs` crate 還提供額外的工具函式，用於對資料進行後處理。例如 `draw_detection()` 工具函式會將 `detection_result` 中的資料繪製到輸入影像上。

```rust
draw_detection(&mut input_img, &detection_result);
input_img.save(output_path)?;
```

## 可用的 mediapipe 模型

`AudioClassifierBuilder` 可從音訊分類模型建構，並使用 `classify()` 處理音訊資料。[請參考範例](https://github.com/WasmEdge/mediapipe-rs/blob/main/examples/audio_classification.rs)。

`GestureRecognizerBuilder` 可從手勢辨識模型建構，並使用 `recognize()` 處理影像資料。[請參考範例](https://github.com/WasmEdge/mediapipe-rs/blob/main/examples/gesture_recognition.rs)。

`ImageClassifierBuilder` 可從影像分類模型建構，並使用 `classify()` 處理影像資料。[請參考範例](https://github.com/WasmEdge/mediapipe-rs/blob/main/examples/image_classification.rs)。

`ImageEmbedderBuilder` 可從影像嵌入模型建構，並使用 `embed()` 為輸入影像計算向量表示（嵌入）。[請參考範例](https://github.com/WasmEdge/mediapipe-rs/blob/main/examples/image_embedding.rs)。

`ObjectDetectorBuilder` 可從物件偵測模型建構，並使用 `detect()` 處理影像資料。[請參考範例](https://github.com/WasmEdge/mediapipe-rs/blob/main/examples/object_detection.rs)。

`TextClassifierBuilder` 可從文字分類模型建構，並使用 `classify()` 處理文字資料。[請參考範例](https://github.com/WasmEdge/mediapipe-rs/blob/main/examples/text_classification.rs)。
