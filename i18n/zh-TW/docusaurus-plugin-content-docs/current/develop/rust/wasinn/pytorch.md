---
sidebar_position: 5
---

# PyTorch 後端

我們將以[這個範例專案](https://github.com/second-state/WasmEdge-WASINN-examples/tree/master/pytorch-mobilenet-image)示範如何在 WasmEdge 與 Rust 中使用 PyTorch 模型進行 AI 推論。

## 必要條件

除了[一般的 WasmEdge 與 Rust 需求](../../rust/setup.md)之外，請確認您已[安裝具有 PyTorch 的 Wasi-NN 外掛](../../../start/install.md#wasi-nn-plug-in-with-pytorch-backend)。

## 快速開始

由於此範例已內含由 Rust 程式編譯而成的 WASM 檔案，因此我們可以直接使用 WasmEdge CLI 來執行它。首先，git clone `WasmEdge-WASINN-examples` 儲存庫。

```bash
git clone https://github.com/second-state/WasmEdge-WASINN-examples.git
cd WasmEdge-WASINN-examples/pytorch-mobilenet-image/
```

在 WasmEdge 中執行推論應用程式。

```bash
wasmedge --dir .:. wasmedge-wasinn-example-mobilenet-image.wasm mobilenet.pt input.jpg
```

如果一切順利，您應該會在終端機看到下列輸出：

```bash
Read torchscript binaries, size in bytes: 14376924
Loaded graph into wasi-nn with ID: 0
Created wasi-nn execution context with ID: 0
Read input tensor, size in bytes: 602112
Executed graph inference
   1.) [954](20.6681)banana
   2.) [940](12.1483)spaghetti squash
   3.) [951](11.5748)lemon
   4.) [950](10.4899)orange
   5.) [953](9.4834)pineapple, ananas
```

## 建置與執行

讓我們從 Rust 原始碼建置 wasm 檔案。首先，git clone `WasmEdge-WASINN-examples` 儲存庫。

```bash
git clone https://github.com/second-state/WasmEdge-WASINN-examples.git
cd WasmEdge-WASINN-examples/pytorch-mobilenet-image/rust
```

接著，使用 `cargo` 建置範例專案。

```bash
cargo build --target wasm32-wasip1 --release
```

輸出的 WASM 檔案為 `target/wasm32-wasip1/release/wasmedge-wasinn-example-mobilenet-image.wasm`。接著使用 WasmEdge 載入 PyTorch 模型，並使用該模型對影像中的物件進行分類。

```bash
wasmedge --dir .:. wasmedge-wasinn-example-mobilenet-image.wasm mobilenet.pt input.jpg
```

您可以將 `input.jpg` 換成您自己的影像檔案。

## 提升效能

您可以先對 `wasm` 檔案進行 AOT 編譯，讓推論程式執行得更快。

```bash
wasmedge compile wasmedge-wasinn-example-mobilenet.wasm out.wasm
wasmedge --dir .:. out.wasm mobilenet.pt input.jpg
```

## 了解程式碼

[main.rs](https://github.com/second-state/WasmEdge-WASINN-examples/tree/master/pytorch-mobilenet-image/rust/src/main.rs) 是完整的範例 Rust 原始碼。首先，從命令列讀取影像檔案與 PyTorch 模型檔案的名稱。

```rust
let args: Vec<String> = env::args().collect();
let model_bin_name: &str = &args[1]; // File name for the PyTorch model
let image_name: &str = &args[2]; // File name for the input image
```

我們使用一個名為 `image_to_tensor()` 的輔助函式將輸入影像轉換為張量資料（張量類型為 `F32`）。現在我們可以載入模型、將影像產生的張量陣列餵入模型，並取得推論輸出張量陣列。

```rust
// load model
let graph = wasi_nn::GraphBuilder::new(
    wasi_nn::GraphEncoding::Pytorch,
    wasi_nn::ExecutionTarget::CPU,
).build_from_files([model_bin_name]).unwrap();
let mut context = graph.init_execution_context().unwrap();

// Load a tensor that precisely matches the graph input tensor
let tensor_data = image_to_tensor(image_name.to_string(), 224, 224);
context.set_input(0, wasi_nn::TensorType::F32, &[1, 3, 224, 224], &tensor_data).unwrap();

// Execute the inference.
context.compute().unwrap();

// Retrieve the output.
let mut output_buffer = vec![0f32; 1000];
context.get_output(0, &mut output_buffer).unwrap();
```

在上述程式碼中，`wasi_nn::GraphEncoding::Pytorch` 代表使用 PyTorch 後端，而 `wasi_nn::ExecutionTarget::CPU` 則代表在 CPU 上執行運算。最後，我們會對輸出進行排序，並印出前 5 名的分類結果。

```rust
let results = sort_results(&output_buffer);
for i in 0..5 {
  println!(
    "   {}.) [{}]({:.4}){}",
    i + 1,
    results[i].0,
    results[i].1,
    imagenet_classes::IMAGENET_CLASSES[results[i].0]
  );
}
```
