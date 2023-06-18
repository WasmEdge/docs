---
sidebar_position: 3
---

# OpenVINO

We will use [this example project](https://github.com/second-state/WasmEdge-WASINN-examples/tree/master/openvino-mobilenet-image) to show how to do AI inference with an OpenVINO model in WasmEdge and Rust.

## Prerequisite

Besides the [regular WasmEdge and Rust requirements](../../rust/setup), please make sure that you have the [Wasi-NN plugin with TensorFlow Lite installed](../../build-and-run/install#wasi-nn-plugin-with-openvino™-backend).

## Quick Start

Because the example already includes a compiled Wasm file from the Rust code, we could use WasmEdge CLI to execute the example directly.

First, git clone the `WasmEdge-WASINN-examples`.

```bash
git clone https://github.com/second-state/WasmEdge-WASINN-examples.git
cd WasmEdge-WASINN-examples
```

```bash
# download the fixture files (OpenVINO model files)
./download_mobilenet.sh
wasmedge --dir .:. wasmedge-wasinn-example-mobilenet-image.wasm mobilenet.xml mobilenet.bin input.jpg
```

If everything goes well, you should have the terminal output:

```bash
Read graph XML, size in bytes: 143525
Read graph weights, size in bytes: 13956476
Loaded graph into wasi-nn with ID: 0
Created wasi-nn execution context with ID: 0
Read input tensor, size in bytes: 602112
Executed graph inference
   1.) [954](0.9789)banana
   2.) [940](0.0074)spaghetti squash
   3.) [951](0.0014)lemon
   4.) [969](0.0005)eggnog
   5.) [942](0.0005)butternut squash
```

## Build and Run the example from Rust source code

Let's build the wasm file from the rust source code.

First, git clone the `WasmEdge-WASINN-examples`.

```bash
git clone https://github.com/second-state/WasmEdge-WASINN-examples.git
cd openvino-mobilenet-image/rust/
```

Second, use `cargo` to build the template project.

```bash
cargo build --target wasm32-wasi --release
```

The output Wasm file lies in `target/wasm32-wasi/release/wasmedge-wasinn-example-mobilenet-image.wasm`.

Next, download the OpenVINO model files and use WasmEdge to classify your own images.

```bash
./download_mobilenet.sh
wasmedge --dir .:. wasmedge-wasinn-example-mobilenet-image.wasm mobilenet.xml mobilenet.bin input.jpg
```

You can replace `input.jpg` with your own image file.

## Improve performance

For the AOT mode which is much more quickly, you can compile the WASM first:

```bash
wasmedgec wasmedge-wasinn-example-mobilenet.wasm out.wasm
wasmedge --dir .:. out.wasm mobilenet.xml mobilenet.bin input.jpg
```

## Understand the code

The [main.rs](https://github.com/second-state/WasmEdge-WASINN-examples/tree/master/openvino-mobilenet-image/rust/src/main.rs) is the full example Rust source.

First, read the model description and weights into memory:

```rust
let args: Vec<String> = env::args().collect();
let model_xml_name: &str = &args[1]; // File name for the model xml
let model_bin_name: &str = &args[2]; // File name for the weights
let image_name: &str = &args[3]; // File name for the input image

let xml = fs::read_to_string(model_xml_name).unwrap();
let weights = fs::read(model_bin_name).unwrap();
```

We should use a helper function to convert the input image into the tensor data (the tensor type is `F32`):

```rust
fn image_to_tensor(path: String, height: u32, width: u32) -> Vec<u8> {
  let pixels = Reader::open(path).unwrap().decode().unwrap();
  let dyn_img: DynamicImage = pixels.resize_exact(width, height, image::imageops::Triangle);
  let bgr_img = dyn_img.to_bgr8();
  // Get an array of the pixel values
  let raw_u8_arr: &[u8] = &bgr_img.as_raw()[..];
  // Create an array to hold the f32 value of those pixels
  let bytes_required = raw_u8_arr.len() * 4;
  let mut u8_f32_arr: Vec<u8> = vec![0; bytes_required];

  for i in 0..raw_u8_arr.len() {
    // Read the number as a f32 and break it into u8 bytes
    let u8_f32: f32 = raw_u8_arr[i] as f32;
    let u8_bytes = u8_f32.to_ne_bytes();

    for j in 0..4 {
      u8_f32_arr[(i * 4) + j] = u8_bytes[j];
    }
  }
  return u8_f32_arr;
}
```

And use this helper funcion to convert the input image:

```rust
let tensor_data = image_to_tensor(image_name.to_string(), 224, 224);
```

Now we can start our inference with WASI-NN:

```rust
// load model
let graph = unsafe {
  wasi_nn::load(
    &[&xml.into_bytes(), &weights],
    wasi_nn::GRAPH_ENCODING_OPENVINO,
    wasi_nn::EXECUTION_TARGET_CPU,
  )
  .unwrap()
};
// initialize the computation context
let context = unsafe { wasi_nn::init_execution_context(graph).unwrap() };
// initialize the input tensor
let tensor = wasi_nn::Tensor {
  dimensions: &[1, 3, 224, 224],
  type_: wasi_nn::TENSOR_TYPE_F32,
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

Where the `wasi_nn::GRAPH_ENCODING_OPENVINO` means using the OpenVINO™ backend, and `wasi_nn::EXECUTION_TARGET_CPU` means running the computation on CPU.

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

## More Examples

There are also an example that [using OpenVINO to do road segmentation ADAS](https://github.com/second-state/WasmEdge-WASINN-examples/tree/master/openvino-road-segmentation-adas/rust). Welcome to give it a try. You are also welcome to contribute your own examples.
