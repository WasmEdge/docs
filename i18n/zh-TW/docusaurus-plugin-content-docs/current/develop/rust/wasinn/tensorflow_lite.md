---
sidebar_position: 4
---

# TensorFlow Lite 後端

我們將以[這個範例專案](https://github.com/second-state/WasmEdge-WASINN-examples/tree/master/tflite-birds_v1-image)示範如何在 WasmEdge 與 Rust 中使用 TensorFlow Lite 模型進行 AI 推論。

## 必要條件

除了[一般的 WasmEdge 與 Rust 需求](../../rust/setup.md)之外，請確認您已[安裝具有 TensorFlow Lite 的 WASI-NN 外掛](../../../start/install.md#wasi-nn-plug-in-with-tensorflow-lite-backend)。

## 快速開始

由於此範例已內含由 Rust 程式編譯而成的 WASM 檔案，因此我們可以直接使用 WasmEdge CLI 來執行它。首先，git clone `WasmEdge-WASINN-examples` 儲存庫。

```bash
git clone https://github.com/second-state/WasmEdge-WASINN-examples.git
cd WasmEdge-WASINN-examples/tflite-birds_v1-image/
```

在 WasmEdge 中執行推論應用程式。

```bash
wasmedge --dir .:. wasmedge-wasinn-example-tflite-bird-image.wasm lite-model_aiy_vision_classifier_birds_V1_3.tflite bird.jpg
```

如果一切順利，您應該會在終端機看到下列輸出：

```bash
Read graph weights, size in bytes: 3561598
Loaded graph into wasi-nn with ID: 0
Created wasi-nn execution context with ID: 0
Read input tensor, size in bytes: 150528
Executed graph inference
   1.) [166](198)Aix galericulata
   2.) [158](2)Coccothraustes coccothraustes
   3.) [34](1)Gallus gallus domesticus
   4.) [778](1)Sitta europaea
   5.) [819](1)Anas platyrhynchos
```

## 建置與執行

讓我們從 Rust 原始碼建置 wasm 檔案。首先，git clone `WasmEdge-WASINN-examples` 儲存庫。

```bash
git clone https://github.com/second-state/WasmEdge-WASINN-examples.git
cd WasmEdge-WASINN-examples/tflite-birds_v1-image/rust/
```

接著，使用 `cargo` 建置範例專案。

```bash
cargo build --target wasm32-wasip1 --release
```

輸出的 WASM 檔案為 `target/wasm32-wasip1/release/wasmedge-wasinn-example-tflite-bird-image.wasm`。接下來，讓我們使用 WasmEdge 載入 TensorFlow Lite 模型，並使用該模型對影像中的物件進行分類。

```bash
wasmedge --dir .:. wasmedge-wasinn-example-tflite-bird-image.wasm lite-model_aiy_vision_classifier_birds_V1_3.tflite bird.jpg
```

您可以將 `bird.jpg` 換成您自己的影像檔案。

## 提升效能

您可以先對 `wasm` 檔案進行 AOT 編譯，讓推論程式執行得更快。

```bash
wasmedge compile wasmedge-wasinn-example-tflite-bird-image.wasm out.wasm
wasmedge --dir .:. out.wasm lite-model_aiy_vision_classifier_birds_V1_3.tflite bird.jpg
```

## 了解程式碼

[main.rs](https://github.com/second-state/WasmEdge-WASINN-examples/blob/master/tflite-birds_v1-image/rust/tflite-bird/src/main.rs) 是完整的範例 Rust 原始碼。首先，從命令列讀取影像檔案與 TensorFlow Lite（tflite）模型檔案的名稱。

```rust
let args: Vec<String> = env::args().collect();
let model_bin_name: &str = &args[1]; // File name for the TFLite model
let image_name: &str = &args[2]; // File name for the input image
```

我們使用一個名為 `image_to_tensor()` 的輔助函式將輸入影像轉換為張量資料（張量類型為 `U8`）。現在我們可以載入模型、將影像產生的張量陣列餵入模型，並取得推論輸出張量陣列。

```rust
// load model
let weights = fs::read(model_bin_name)?;
let graph = GraphBuilder::new(
    GraphEncoding::TensorflowLite,
    ExecutionTarget::CPU,
).build_from_bytes(&[&weights])?;
let mut ctx = graph.init_execution_context()?;

// Load a tensor that precisely matches the graph input tensor
let tensor_data = image_to_tensor(image_name.to_string(), 224, 224);
ctx.set_input(0, TensorType::U8, &[1, 224, 224, 3], &tensor_data)?;

// Execute the inference.
ctx.compute().unwrap();

// Retrieve the output.
let mut output_buffer = vec![0u8; imagenet_classes::AIY_BIRDS_V1.len()];
_ = ctx.get_output(0, &mut output_buffer)?;
```

在上述程式碼中，`GraphEncoding::TensorflowLite` 代表使用 PyTorch 後端，而 `ExecutionTarget::CPU` 則代表在 CPU 上執行運算。最後，我們會對輸出進行排序，並印出前 5 名的分類結果。最後，我們會對輸出進行排序，並印出前 5 名的分類結果：

```rust
let results = sort_results(&output_buffer);
for i in 0..5 {
    println!(
        "   {}.) [{}]({:.4}){}",
        i + 1,
        results[i].0,
        results[i].1,
        imagenet_classes::AIY_BIRDS_V1[results[i].0]
    );
}
```
