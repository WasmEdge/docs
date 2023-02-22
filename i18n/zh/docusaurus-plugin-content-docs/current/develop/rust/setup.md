---
sidebar_position: 1
---

# 4.0 Set up Software for Building and Compiling Rust Programs

In the following chapters, we will show how to build and compile Rust programs into Wasm bytecode and then run them in WasmEdge.

Before we start, let's set up the software we need.

## Install WasmEdge

Use the following command line to install WasmEdge on your machine. If you are using Windows or other non-Unix-like platforms, please refer to the [WasmEdge installation instruction](../build-and-run/install).

```
curl -sSf https://raw.githubusercontent.com/WasmEdge/WasmEdge/master/utils/install.sh | bash
```

## Install Rust

Use the following command line to install Rust on your machine. If you are using Windows or other non-Unix-like platforms, please refer to the [Rust installation instruction](https://www.rust-lang.org/tools/install).

```
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

## Set up the Rust compiler's target

To build a Wasm file running in server-side WebAssembly like WasmEdge, we need to add the `wasm32-wasi` target for the Rust compiler after Rust is installed.

```
rustup target add wasm32-wasi
```

That's it. Go to the following chapters to build and compile Rust programs in action.


Besides this, if you want to explore AI inference with WasmEdge, you also need to build the Wasi-nn plugin from source.

* [Install the WASI-NN plugin with OpenVINO backend](../build-and-run/install#wasi-nn-plugin-with-openvino-backend)
* [Install the WASI-NN plugin with Pytorch backend](../build-and-run/install#wasi-nn-plugin-with-pytorch-backend)
* [Install the WASI-NN plugin with TensorFlow Lite backend](../build-and-run/install#wasi-nn-plugin-with-pwith-tensorflow-lite)

