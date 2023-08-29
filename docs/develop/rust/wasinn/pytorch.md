---
sidebar_position: 2
---

# PyTorch Backend

We will use [this example project](https://github.com/second-state/WasmEdge-WASINN-examples/tree/master/pytorch-mobilenet-image) to show how to make AI inference with a PyTorch model in WasmEdge and Rust.

## Prerequisite

Besides the [regular WasmEdge and Rust requirements](../../rust/setup.md), please make sure that you have the [Wasi-NN plugin with PyTorch installed](../../../start/install.md#wasi-nn-plug-in-with-pytorch-backend).

## Quick start

Because the example already includes a compiled WASM file from the Rust code, we could use WasmEdge CLI to execute the example directly. First, git clone the `WasmEdge-WASINN-examples` repo.

```bash
git clone https://github.com/second-state/WasmEdge-WASINN-examples.git
cd WasmEdge-WASINN-examples/pytorch-mobilenet-image/
```

Run the inference application in WasmEdge.

```bash
wasmedge --dir .:. wasmedge-wasinn-example-mobilenet-image.wasm mobilenet.pt input.jpg
```

If everything goes well, you should have the terminal output:

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

## Build and run

Let's build the wasm file from the rust source code. First, git clone the `WasmEdge-WASINN-examples` repo.

```bash
git clone https://github.com/second-state/WasmEdge-WASINN-examples.git
cd WasmEdge-WASINN-examples/pytorch-mobilenet-image/rust
```

Second, use `cargo` to build the example project.

```bash
cargo build --target wasm32-wasi --release
```

The output WASM file is `target/wasm32-wasi/release/wasmedge-wasinn-example-mobilenet-image.wasm`. Next, use WasmEdge to load the PyTorch model and then use it to classify objects in your image.

```bash
wasmedge --dir .:. wasmedge-wasinn-example-mobilenet-image.wasm mobilenet.pt input.jpg
```

You can replace `input.jpg` with your image file.

## Improve performance

You can make the inference program run faster by AOT compiling the `wasm` file first.

```bash
wasmedge compile wasmedge-wasinn-example-mobilenet.wasm out.wasm
wasmedge --dir .:. out.wasm mobilenet.pt input.jpg
```

## Understand the code

The [main.rs](https://github.com/second-state/WasmEdge-WASINN-examples/tree/master/pytorch-mobilenet-image/rust/src/main.rs) is the complete example Rust source. First, read the image file and PyTorch model file names from the command line.

```rust
let args: Vec<String> = env::args().collect();
let model_bin_name: &str = &args[1]; // File name for the PyTorch model
let image_name: &str = &args[2]; // File name for the input image
```

We use a helper function called `image_to_tensor()` to convert the input image into tensor data (the tensor type is `F32`). Now we can load the model, feed the tensor array from the image to the model, and get the inference output tensor array.

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

In the above code, `wasi_nn::GraphEncoding::Pytorch` means using the PyTorch backend, and `wasi_nn::ExecutionTarget::CPU` means running the computation on the CPU. Finally, we sort the output and then print the top-5 classification results.

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
