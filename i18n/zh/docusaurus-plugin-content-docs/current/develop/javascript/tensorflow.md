---
sidebar_position: 4
---

# AI inference

The WasmEdge-QuickJs supports the WasmEdge WASI-NN plug-ins so your JavaScript can run inference on AI models.

## Prerequisites

Install WasmEdge with WASI-NN plug-in.

- [with the Tensorflow Lite backend](../../start/install.md#wasi-nn-plug-in-with-tensorflow-lite-backend)
- [with the PyTorch backend](../../start/install.md#wasi-nn-plug-in-with-pytorch-backend)

Instead of a [standard](hello_world.md#prerequisites) QuickJS setup, you need to get the WasmEdge QuickJS runtime with WASI NN support built-in. Clone the wasmedge-quickjs repo and use it as the current directory.

```bash
git clone https://github.com/second-state/wasmedge-quickjs
cd wasmedge-quickjs
```

Then download the pre-built [WasmEdge QuickJS + WASI NN Runtime program](#build-it-yourself), and optionally, AOT compiles it for better performance.

```bash
curl -OL https://github.com/second-state/wasmedge-quickjs/releases/download/v0.5.0-alpha/wasmedge_quickjs_nn.wasm
wasmedgec wasmedge_quickjs_nn.wasm wasmedge_quickjs_nn.wasm
```

## A Tensorflow Lite example

Here is an example of JavaScript. You could find the full code from [example_js/tensorflow_lite_demo/wasi_nn_main.js](https://github.com/second-state/wasmedge-quickjs/tree/main/example_js/tensorflow_lite_demo/wasi_nn_main.js).

```javascript
import { Image } from 'image';
import * as fs from 'fs';
import { NnGraph, NnContext, TENSOR_TYPE_U8 } from 'wasi_nn';

let img = new Image(__dirname + '/food.jpg');
let img_rgb = img.to_rgb().resize(192, 192);
let rgb_pix = img_rgb.pixels();

let data = fs.readFileSync(
  __dirname + '/lite-model_aiy_vision_classifier_food_V1_1.tflite',
);
let graph = new NnGraph([data.buffer], 'tensorflowlite', 'cpu');
let context = new NnContext(graph);
context.setInput(0, rgb_pix, [1, 192, 192, 3], TENSOR_TYPE_U8);
context.compute();

let output_view = new Uint8Array(2024);
context.getOutput(0, output_view.buffer);

let max = 0;
let max_idx = 0;
for (var i in output_view) {
  let v = output_view[i];
  if (v > max) {
    max = v;
    max_idx = i;
  }
}

let label_file = fs.readFileSync(
  __dirname + '/aiy_food_V1_labelmap.txt',
  'utf-8',
);
let lables = label_file.split(/\r?\n/);

let label = lables[max_idx];

print('label:');
print(label);
print('confidence:');
print(max / 255);
```

To run the JavaScript in the WasmEdge runtime, make sure that you have the [WASI-NN plug-in and Tensorflow Lite dependency libraries installed with WasmEdge](../../start/install.md#wasi-nn-plug-in-with-tensorflow-lite-backend). You should see the food item's name recognized by the TensorFlow lite ImageNet model.

```bash
$ wasmedge --dir .:. wasmedge_quickjs_nn.wasm example_js/tensorflow_lite_demo/wasi_nn_main.js
label:
Hot dog
confidence:
0.8941176470588236
```

## Build it yourself

Following the instructions, you can build a WASI-NN enabled JavaScript interpreter for WasmEdge. Make sure you have installed GCC. If you don't, run the following command line.

```bash
# Install GCC
sudo apt update
sudo apt install build-essential
```

Then, we could build the WasmEdge-Quickjs runtime. Fork or clone the [wasmedge-quickjs Github repository](https://github.com/second-state/wasmedge-quickjs).

```bash
# get the source code
git clone https://github.com/second-state/wasmedge-quickjs
cd wasmedge-quickjs

# Build the QuickJS JavaScript interpreter with WASI NN
cargo build --target wasm32-wasi --release --features=wasi_nn
```

The WebAssembly-based JavaScript interpreter program is located in the build `target` directory.

WasmEdge provides a `wasmedge compile` utility to compile and add a native machine code section to the wasm file. You can use wasmedge to run the natively instrumented wasm file to get much faster performance.

```bash
wasmedge compile target/wasm32-wasi/release/wasmedge_quickjs.wasm wasmedge_quickjs_nn.wasm
```
