---
sidebar_position: 5
---

# TensorFlow Plug-in For WasmEdge

Developers can use [WASI-NN](https://github.com/WebAssembly/wasi-nn) to inference the models. However, for the TensorFlow and TensorFlow-Lite users, the WASI-NN APIs could be more friendly to retrieve the input and output tensors. Therefore WasmEdge provides the TensorFlow-related plug-in and rust SDK for inferencing models in WASM.

<!-- prettier-ignore -->
:::info
This is not a WASI-NN compatible plug-in. If you are finding the plug-ins working with the [WASI-NN crate](https://crates.io/crates/wasi-nn), please follow the [tensorflow-lite backend](tensorflow_lite.md) instead.
:::

## Prerequisite

Please ensure that you [Rust and WasmEdge installed](../setup.md).

Developers will add the [`wasmedge_tensorflow_interface` crate](https://crates.io/crates/wasmedge_tensorflow_interface) as a dependency to their `Rust -> Wasm` applications. For example, add the following line to the application's `Cargo.toml` file.

```toml
[dependencies]
wasmedge_tensorflow_interface = "0.3.0"
```

Developers will bring the functions of `wasmedge_tensorflow_interface` into scope within their `Rust -> Wasm` application's code. For example, adding the following code to the top of their `main.rs`.

```rust
use wasmedge_tensorflow_interface;
```

## Image Loading And Conversion

In this crate, we provide several functions to decode and convert images into tensors using the `WasmEdge-Image` host functions.

To use these functions in WASM and execute in WasmEdge, users should [install WasmEdge with WasmEdge-Image plug-in](../../../start/install.md#wasmedge-image-plug-in).

For decoding the `JPEG` images, there are:

```rust
// Function to decode JPEG from buffer and resize to RGB8 format.
pub fn load_jpg_image_to_rgb8(img_buf: &[u8], w: u32, h: u32) -> Vec<u8>
// Function to decode JPEG from buffer and resize to BGR8 format.
pub fn load_jpg_image_to_bgr8(img_buf: &[u8], w: u32, h: u32) -> Vec<u8>
// Function to decode JPEG from buffer and resize to RGB32F format.
pub fn load_jpg_image_to_rgb32f(img_buf: &[u8], w: u32, h: u32) -> Vec<f32>
// Function to decode JPEG from buffer and resize to BGR32F format.
pub fn load_jpg_image_to_rgb32f(img_buf: &[u8], w: u32, h: u32) -> Vec<f32>
```

For decoding the `PNG` images, there are:

```rust
// Function to decode PNG from buffer and resize to RGB8 format.
pub fn load_png_image_to_rgb8(img_buf: &[u8], w: u32, h: u32) -> Vec<u8>
// Function to decode PNG from buffer and resize to BGR8 format.
pub fn load_png_image_to_bgr8(img_buf: &[u8], w: u32, h: u32) -> Vec<u8>
// Function to decode PNG from buffer and resize to RGB32F format.
pub fn load_png_image_to_rgb32f(img_buf: &[u8], w: u32, h: u32) -> Vec<f32>
// Function to decode PNG from buffer and resize to BGR32F format.
pub fn load_png_image_to_rgb32f(img_buf: &[u8], w: u32, h: u32) -> Vec<f32>
```

Developers can load, decode, and resize image as following:

```rust
let mut file_img = File::open("sample.jpg").unwrap();
let mut img_buf = Vec::new();
file_img.read_to_end(&mut img_buf).unwrap();
let flat_img = wasmedge_tensorflow_interface::load_jpg_image_to_rgb32f(&img_buf, 224, 224);
// The flat_img is a vec<f32> which contains normalized image in rgb32f format and resized to 224x224.
```

## Inferring TensorFlow And TensorFlow-Lite Models

For using the `TFSession` struct to inference the TensorFlow models and executing in WasmEdge, users should install the [WasmEdge-TensorFlow plug-in with dependencies](../../../start/install.md#wasmedge-tensorflow-plug-in).

For using the `TFLiteSession` struct and to inference the TensorFlow-Lite models executing in WasmEdge, users should install the [WasmEdge-TensorFlowLite plug-in with dependencies](../../../start/install.md#wasmedge-tensorflow-lite-plug-in).

### Create Session

First, developers should create a session to load the TensorFlow or TensorFlow-Lite model.

```rust
// The mod_buf is a vec<u8> which contains the model data.
let mut session = wasmedge_tensorflow_interface::TFSession::new(&mod_buf);
```

The above function creates the session for TensorFlow frozen models. Developers can use the `new_from_saved_model` function to create from saved-models:

```rust
// The mod_path is a &str which is the path to saved-model directory.
// The second argument is the list of tags.
let mut session = wasmedge_tensorflow_interface::TFSession::new_from_saved_model(model_path, &["serve"]);
```

Or use the `TFLiteSession` to create a session for inferring the `tflite` models.

```rust
// The mod_buf is a vec<u8> which contains the model data.
let mut session = wasmedge_tensorflow_interface::TFLiteSession::new(&mod_buf);
```

### Prepare Input Tensors

```rust
// The flat_img is a vec<f32> which contains normalized image in rgb32f format.
session.add_input("input", &flat_img, &[1, 224, 224, 3])
       .add_output("MobilenetV2/Predictions/Softmax");
```

### Run TensorFlow Models

```rust
session.run();
```

### Convert Output Tensors

```rust
let res_vec: Vec<f32> = session.get_output("MobilenetV2/Predictions/Softmax");
```

## Build And Execution

After completing your code, you can follow the command to compile into WASM.

```bash
cargo build --target=wasm32-wasi
```

The output WASM file will be at `target/wasm32-wasi/debug/` or `target/wasm32-wasi/release`.

Please refer to [WasmEdge CLI](../../../start/build-and-run/cli.md) for WASM execution.

## Examples

<!-- prettier-ignore -->
:::info
Work in Progress
:::

## Old WasmEdge TensorFlow extension

<!-- prettier-ignore -->
:::info
Work in Progress
:::
