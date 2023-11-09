---
sidebar_position: 4
---

# Frequently Asked Questions 

This FAQ page is designed to address the most common technical inquiries about WasmEdge. If your question is not directly answered here, please refer to the comprehensive WasmEdge documentation or engage with the active WasmEdge community.

## 1. How does WasmEdge handle memory sharing between modules?

WasmEdge follows the WebAssembly specification, which currently does not support shared memory between different modules. Each module has its own linear memory space.

## 2. Can WasmEdge support model training?

Currently, WasmEdge supports model inference. It uses the WASI-NN API to make predictions using pre-trained models. However, model training is not yet supported.

## 3. What is the internal flow of WasmEdge?

The WasmEdge runtime follows a general flow: parsing the Wasm file, validating the parsed Wasm file, compiling the validated Wasm file into native code, and then executing the compiled code. For more detailed information, please refer to the WasmEdge runtime architecture documentation.

## 4. Why is my plugin crashing?

If your plugin crashes, it might be due to several reasons. It could be related to incorrect use of the WasmEdge API, or the plugin may be incompatible with the WasmEdge version you're using. It's recommended to debug the plugin using a debugger tool to get more detailed error information.

## 5. How to create a VM to call `infer()` in a Wasm library?

You can use the WASI-NN API to call the `infer()` function in a Wasm library. First, you need to prepare the model, inputs, and outputs. Then, you can call the `infer()` function with these parameters.

## 6. Can WasmEdge support Tensorflow as its inference backend using WASI-NN?

Yes, WasmEdge can use Tensorflow as its inference backend through the WASI-NN API.

## 7. How to read a host file in WasmEdge runtime?

WasmEdge provides the WASI (WebAssembly System Interface) API for interacting with the host system, including file operations. You can use the WASI API to open and read files from the host system.

## 8. Does WasmEdge only support one backend at the same time?

WasmEdge can support multiple backends at the same time. For example, it can use both the interpreter and the AOT compiler as backends. However, only one backend can be active for a given Wasm module.

Remember, this FAQ page is not exhaustive, and the WasmEdge community is always ready to help with any questions or issues you may have. Don't hesitate to reach out if you need assistance in our [Discord server](https://discord.gg/h4KDyB8XTt).
