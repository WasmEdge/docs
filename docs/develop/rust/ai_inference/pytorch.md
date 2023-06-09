---
sidebar_position: 1
---

# PyTorch

We will use [this example project](https://github.com/second-state/WasmEdge-WASINN-examples/tree/master/pytorch-mobilenet-image) to show how to do AI inference with a PyTorch model in WasmEdge and Rust.

## Prerequisite

Besides the [regular WasmEdge and Rust requirements](../../rust/setup), please make sure that you have the [Wasi-NN plugin with PyTorch installed](../../build-and-run/install#wasi-nn-plugin-with-pytorch-backend).

## Quick Start

Because the example already includes a compiled Wasm file from the Rust code, we could use WasmEdge CLI to execute the example directly.

First, git clone the `WasmEdge-WASINN-examples`.

```bash
git clone https://github.com/second-state/WasmEdge-WASINN-examples.git
cd WasmEdge-WASINN-examples
```

```bash
# Please check that you've already install the libtorch and set the `LD_LIBRARY_PATH`.
wasmedge --dir .:. wasmedge-wasinn-example-mobilenet-image.wasm mobilenet.pt input.jpg
# If you didn't install the project, you should give the `WASMEDGE_PLUGIN_PATH` environment variable for specifying the WASI-NN plugin path.
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

## Build and Run the example from Rust source code

Let's build the wasm file from the rust source code.

First, git clone the `WasmEdge-WASINN-examples`.

```bash
git clone https://github.com/second-state/WasmEdge-WASINN-examples.git
cd pytorch-mobilenet-image/rust
```

Second, use `cargo` to build the template project.

```bash
cargo build --target wasm32-wasi --release
```

The output Wasm file lies in `target/wasm32-wasi/release/wasmedge-wasinn-example-mobilenet-image.wasm`.

Next let's use WasmEdge to identify your own images.

```bash
wasmedge --dir .:. wasmedge-wasinn-example-mobilenet-image.wasm mobilenet.pt input.jpg
```

You can replace `input.jpg` with your own image file.

## Improve performance

For the AOT mode which is much more quickly, you can compile the WASM first:

```bash
wasmedgec wasmedge-wasinn-example-mobilenet.wasm out.wasm
wasmedge --dir .:. out.wasm mobilenet.pt input.jpg
```

## Understand the code

The [main.rs](https://github.com/second-state/WasmEdge-WASINN-examples/tree/master/pytorch-mobilenet-image/rust/src/main.rs) is the full example Rust source.

First, read the model description and weights into memory:

```rust
let args: Vec<String> = env::args().collect();
let model_bin_name: &str = &args[1]; // File name for the pytorch model
let image_name: &str = &args[2]; // File name for the input image

let weights = fs::read(model_bin_name).unwrap();
```

We should use a helper function to convert the input image into the tensor data (the tensor type is `F32`):

```rust
fn image_to_tensor(path: String, height: u32, width: u32) -> Vec<u8> {
  let mut file_img = File::open(path).unwrap();
  let mut img_buf = Vec::new();
  file_img.read_to_end(&mut img_buf).unwrap();
  let img = image::load_from_memory(&img_buf).unwrap().to_rgb8();
  let resized =
      image::imageops::resize(&img, height, width, ::image::imageops::FilterType::Triangle);
  let mut flat_img: Vec<f32> = Vec::new();
  for rgb in resized.pixels() {
    flat_img.push((rgb[0] as f32 / 255. - 0.485) / 0.229);
    flat_img.push((rgb[1] as f32 / 255. - 0.456) / 0.224);
    flat_img.push((rgb[2] as f32 / 255. - 0.406) / 0.225);
  }
  let bytes_required = flat_img.len() * 4;
  let mut u8_f32_arr: Vec<u8> = vec![0; bytes_required];

  for c in 0..3 {
    for i in 0..(flat_img.len() / 3) {
      // Read the number as a f32 and break it into u8 bytes
      let u8_f32: f32 = flat_img[i * 3 + c] as f32;
      let u8_bytes = u8_f32.to_ne_bytes();

      for j in 0..4 {
        u8_f32_arr[((flat_img.len() / 3 * c + i) * 4) + j] = u8_bytes[j];
      }
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
    &[&weights],
    wasi_nn::GRAPH_ENCODING_PYTORCH,
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

Where the `wasi_nn::GRAPH_ENCODING_PYTORCH` means using the PyTorch backend, and `wasi_nn::EXECUTION_TARGET_CPU` means running the computation on CPU.

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
