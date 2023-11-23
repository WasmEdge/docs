---
sidebar_position: 4
---

# OpenVINO Backend

We will use [this example project](https://github.com/second-state/WasmEdge-WASINN-examples/tree/master/openvino-mobilenet-image) to show how to make AI inference with an OpenVINO model in WasmEdge and Rust.

## Prerequisite

Besides the [regular WasmEdge and Rust requirements](../../rust/setup.md), please make sure that you have the [Wasi-NN plugin with OpenVINO installed](../../../start/install.md#wasi-nn-plug-in-with-openvino-backend).

## Quick start

Because the example already includes a compiled WASM file from the Rust code, we could use WasmEdge CLI to execute the example directly. First, git clone the `WasmEdge-WASINN-examples` repo.

```bash
git clone https://github.com/second-state/WasmEdge-WASINN-examples.git
cd WasmEdge-WASINN-examples/openvino-mobilenet-image/
```

Download the model files in OpenVINO format and then run the inference application in WasmEdge.

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

## Build and run

Let's build the wasm file from the rust source code. First, git clone the `WasmEdge-WASINN-examples` repo.

```bash
git clone https://github.com/second-state/WasmEdge-WASINN-examples.git
cd WasmEdge-WASINN-examples/openvino-mobilenet-image/rust/
```

Second, use `cargo` to build the template project.

```bash
cargo build --target wasm32-wasi --release
```

The output WASM file is `target/wasm32-wasi/release/wasmedge-wasinn-example-mobilenet-image.wasm`. Download the OpenVINO model files. Next, use WasmEdge to load the OpenVINO model and then use it to classify objects in your image.

```bash
./download_mobilenet.sh
wasmedge --dir .:. wasmedge-wasinn-example-mobilenet-image.wasm mobilenet.xml mobilenet.bin input.jpg
```

You can replace `input.jpg` with your image file.

## Improve performance

You can make the inference program run faster by AOT compiling the `wasm` file first.

```bash
wasmedge compile wasmedge-wasinn-example-mobilenet.wasm out.wasm
wasmedge --dir .:. out.wasm mobilenet.xml mobilenet.bin input.jpg
```

## Understand the code

The [main.rs](https://github.com/second-state/WasmEdge-WASINN-examples/tree/master/openvino-mobilenet-image/rust/src/main.rs) is the full example Rust source. First, read the image file and OpenVINO model file names from the command line.

```rust
let args: Vec<String> = env::args().collect();
let model_xml_name: &str = &args[1]; // File name for the model xml
let model_bin_name: &str = &args[2]; // File name for the weights
let image_name: &str = &args[3]; // File name for the input image
```

We use a helper function called `image_to_tensor()` to convert the input image into tensor data (the tensor type is `F32`). Now we can load the model, feed the tensor array from the image to the model, and get the inference output tensor array.

```rust
// load model
let graph = GraphBuilder::new(
    GraphEncoding::Openvino,
    ExecutionTarget::CPU
).build_from_files([model_xml_path, model_bin_path])?;
let mut context = graph.init_execution_context()?;

// Load a tensor that precisely matches the graph input tensor
let input_dims = vec![1, 3, 224, 224];
let tensor_data = image_to_tensor(image_name.to_string(), 224, 224);
context.set_input(0, TensorType::F32, &input_dims, tensor_data)?;

// Execute the inference.
context.compute()?;

// Retrieve the output.
let mut output_buffer = vec![0f32; 1001];
let size_in_bytes = context.get_output(0, &mut output_buffer)?;
```

In the above code, `GraphEncoding::Openvino` means using the OpenVINO backend, and `ExecutionTarget::CPU` means running the computation on the CPU. Finally, we sort the output and then print the top-5 classification results.

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

There is also an example that [using OpenVINO to do road segmentation ADAS](https://github.com/second-state/WasmEdge-WASINN-examples/tree/master/openvino-road-segmentation-adas/rust). Welcome to give it a try. You are also welcome to contribute your own examples.
