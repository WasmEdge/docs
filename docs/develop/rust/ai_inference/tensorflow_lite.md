---
sidebar_position: 2
---

# TensorFlow Lite

We will use [this example project](https://github.com/second-state/WasmEdge-WASINN-examples/tree/master/tflite-birds_v1-image) to show how to do AI inference with a TensorFlow Lite model in WasmEdge and Rust.

## Prerequisite

Besides the [regular WasmEdge and Rust requirements](../../rust/setup), please make sure that you have the [Wasi-NN plugin with TensorFlow Lite installed](../../build-and-run/install#wasi-nn-plugin-with-tensorflow-lite).

## Quick Start

Because the example already includes a compiled Wasm file from the Rust code, we could use WasmEdge CLI to execute the example directly.

First, git clone the `WasmEdge-WASINN-examples`.

```bash
git clone https://github.com/second-state/WasmEdge-WASINN-examples.git
cd WasmEdge-WASINN-examples
```

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

## Build and Run the example from Rust source code

Let's build the wasm file from the rust source code.

First, git clone the `WasmEdge-WASINN-examples`.

```bash
git clone https://github.com/second-state/WasmEdge-WASINN-examples.git
cd tflite-birds_v1-image/rust/
```

Second, use `cargo` to build the template project.

```bash
cargo build --target wasm32-wasi --release
```

The output Wasm file lies in `target/wasm32-wasi/release/wasmedge-wasinn-example-tflite-bird-image.wasm`.

Next let's use WasmEdge to identify your own images.

```bash
wasmedge --dir .:. wasmedge-wasinn-example-mobilenet-image.wasm mobilenet.xml mobilenet.bin input.jpg
```

You can replace `input.jpg` with your own image file.

## Improve performance

For the AOT mode which is much more quickly, you can compile the WASM first:

```bash
wasmedgec rust/tflite-bird/target/wasm32-wasi/release/wasmedge-wasinn-example-tflite-bird-image.wasm wasmedge-wasinn-example-tflite-bird-image.wasm
wasmedge --dir .:. wasmedge-wasinn-example-tflite-bird-image.wasm lite-model_aiy_vision_classifier_birds_V1_3.tflite bird.jpg
```

## Understand the code

The [main.rs](https://github.com/second-state/WasmEdge-WASINN-examples/blob/master/tflite-birds_v1-image/rust/tflite-bird/src/main.rs) is the full example Rust source.

First, read the model description and weights into memory:

```rust
let args: Vec<String> = env::args().collect();
let model_bin_name: &str = &args[1]; // File name for the tflite model
let image_name: &str = &args[2]; // File name for the input image

let weights = fs::read(model_bin_name).unwrap();
```

We should use a helper function to convert the input image into the tensor data (the tensor type is `U8`):

```rust
fn image_to_tensor(path: String, height: u32, width: u32) -> Vec<u8> {
    let pixels = Reader::open(path).unwrap().decode().unwrap();
    let dyn_img: DynamicImage = pixels.resize_exact(width, height, image::imageops::Triangle);
    let bgr_img = dyn_img.to_rgb8();
    // Get an array of the pixel values
    let raw_u8_arr: &[u8] = &bgr_img.as_raw()[..];
    return raw_u8_arr.to_vec();
}
```

And use this helper function to convert the input image:

```rust
let tensor_data = image_to_tensor(image_name.to_string(), 224, 224);
```

Now we can start our inference with WASI-NN:

```rust
// load model
let graph = unsafe {
  wasi_nn::load(
    &[&weights],
    4, //wasi_nn::GRAPH_ENCODING_TENSORFLOWLITE
    wasi_nn::EXECUTION_TARGET_CPU,
  )
  .unwrap()
};
// initialize the computation context
let context = unsafe { wasi_nn::init_execution_context(graph).unwrap() };
// initialize the input tensor
let tensor = wasi_nn::Tensor {
  dimensions: &[1, 3, 224, 224],
  r#type: wasi_nn::TENSOR_TYPE_F32,
  data: &tensor_data,
};
// set_input
unsafe {
  wasi_nn::set_input(context, 0, tensor).unwrap();
}
// Execute the inference.
unsafe {
  wasi_nn::compute(context).unwrap();
}
// retrieve output
let mut output_buffer = vec![0f32; 1001];
unsafe {
  wasi_nn::get_output(
    context,
    0,
    &mut output_buffer[..] as *mut [f32] as *mut u8,
    (output_buffer.len() * 4).try_into().unwrap(),
  )
  .unwrap();
}
```

Where the `wasi_nn::GRAPH_ENCODING_TENSORFLOWLITE` means using the PyTorch backend (now use the value `4` instead), and `wasi_nn::EXECUTION_TARGET_CPU` means running the computation on CPU.

> Note: Here we use the `wasi-nn 0.1.0` in current. After the `TENSORFLOWLITE` added into the graph encoding, we'll update this example to use the newer version.

Finally, we sort the output and then print the top-5 classification result:

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
