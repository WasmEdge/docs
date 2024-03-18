---
sidebar_position: 4
---

# Frequently Asked Questions

This FAQ page is designed to address the most common technical questions about WasmEdge. If your question is not directly answered here, please refer to the WasmEdge [documentation](https://wasmedge.org/docs/) or engage with the WasmEdge community via discord.

## 1. How does WasmEdge handle memory sharing between modules?

WasmEdge follows the WebAssembly specification, which currently does not support shared memory between different modules. Each module has its own linear memory space. This is because WebAssembly modules are isolated and cannot directly access each other's memory 1. However, it is possible to manually copy data from one module to another using host functions

## 2. Can WasmEdge support model training?

As of now, WasmEdge supports [model inference](https://www.secondstate.io/articles/fast-llm-inference/). It uses the WASI-NN API to make predictions using pre-trained models. However, model training is not yet supported. It only allows for the execution of pre-trained models.

## 3. What is the internal flow of WasmEdge?

The WasmEdge runtime follows a general flow: parsing the Wasm file, validating the parsed Wasm file, compiling the validated Wasm file into native code, and then executing the compiled code. For more detailed information, please refer to the WasmEdge runtime [documentation](https://wasmedge.org/docs/).

## 4. Why is my plugin crashing?

If your plugin crashes, it might be due to several reasons. It could be related to incorrect use of the WasmEdge API, or the plugin may be incompatible with the WasmEdge version you're using. It's recommended to debug the plugin using a debugger tool to get more detailed error information. Also it you should check the [plug-in documentation](https://wasmedge.org/docs/contribute/plugin/test_plugin)

## 5. How to create a VM to call `infer()` in a Wasm library?

You can use the WASI-NN API to call the `infer()` function in a Wasm library. First, you need to prepare the model, inputs, and outputs. Then, you can call the `infer()` function with these parameters.

## 6. Can WasmEdge support Tensorflow as its inference backend using WASI-NN?

Yes, WasmEdge can use Tensorflow as its [inference](https://wasmedge.org/docs/embed/go/ai/) backend through the WASI-NN API.

## 7. How to read a host file in WasmEdge runtime?

WasmEdge provides the WASI (WebAssembly System Interface) API for interacting with the host system, including file operations. You can use the [WASI API](https://wasmedge.org/docs/embed/go/reference/0.11.x?_highlight=wasi&_highlight=api#preregistrations) to open and read files from the host system.

Please remember, this FAQ page is not exhaustive, and the WasmEdge community is always ready to help with any questions or issues you may have. Don't hesitate to reach out if you need assistance in our [Discord server](https://discord.gg/h4KDyB8XTt).
