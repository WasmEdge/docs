---
sidebar_position: 3
---

# TensorFlow Lite Backend

We will use [this example project](https://github.com/second-state/WasmEdge-WASINN-examples/tree/master/tflite-birds_v1-image) to show how to make AI inference with a TensorFlow Lite model in WasmEdge and Rust.

## Prerequisite

Besides the [regular WasmEdge and Rust requirements](../../rust/setup.md), please make sure that you have the [WASI-NN plugin with TensorFlow Lite installed](../../../start/install.md#wasi-nn-plug-in-with-tensorflow-lite-backend).

## Quick start

Because the example already includes a compiled WASM file from the Rust code, we could use WasmEdge CLI to execute the example directly. First, git clone the `WasmEdge-WASINN-examples` repo.

```bash
git clone https://github.com/second-state/WasmEdge-WASINN-examples.git
cd WasmEdge-WASINN-examples/tflite-birds_v1-image/
```

Run the inference application in WasmEdge.

```bash
wasmedge --dir .:. wasmedge-wasinn-example-tflite-bird-image.wasm lite-model_aiy_vision_classifier_birds_V1_3.tflite bird.jpg
```

If everything goes well, you should have the terminal output:

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

## Build and run

Let's build the wasm file from the rust source code. First, git clone the `WasmEdge-WASINN-examples` repo.

```bash
git clone https://github.com/second-state/WasmEdge-WASINN-examples.git
cd WasmEdge-WASINN-examples/tflite-birds_v1-image/rust/
```

Second, use `cargo` to build the example project.

```bash
cargo build --target wasm32-wasi --release
```

The output WASM file is `target/wasm32-wasi/release/wasmedge-wasinn-example-tflite-bird-image.wasm`. Next, let's use WasmEdge to load the Tensorflow Lite model and then use it to classify objects in your image.

```bash
wasmedge --dir .:. wasmedge-wasinn-example-tflite-bird-image.wasm lite-model_aiy_vision_classifier_birds_V1_3.tflite bird.jpg
```

You can replace `bird.jpg` with your image file.

## Improve performance

You can make the inference program run faster by AOT compiling the `wasm` file first.

```bash
wasmedge compile wasmedge-wasinn-example-tflite-bird-image.wasm out.wasm
wasmedge --dir .:. out.wasm lite-model_aiy_vision_classifier_birds_V1_3.tflite bird.jpg
```

## Understand the code

The [main.rs](https://github.com/second-state/WasmEdge-WASINN-examples/blob/master/tflite-birds_v1-image/rust/tflite-bird/src/main.rs) is the complete example Rust source. First, read the image file and Tensorflow Lite (tflite) model file names from the command line.

```rust
let args: Vec<String> = env::args().collect();
let model_bin_name: &str = &args[1]; // File name for the TFLite model
let image_name: &str = &args[2]; // File name for the input image
```

We use a helper function called `image_to_tensor()` to convert the input image into tensor data (the tensor type is `U8`). Now we can load the model, feed the tensor array from the image to the model, and get the inference output tensor array.

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

In the above code, `GraphEncoding::TensorflowLite` means using the PyTorch backend, and `ExecutionTarget::CPU` means running the computation on the CPU. Finally, we sort the output and then print the top-5 classification results. Finally, we sort the output and then print the top-5 classification results:

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
