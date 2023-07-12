---
sidebar_position: 1
---

# Set up Rust toolchain

In the following chapters, we will show how to build and compile Rust programs into Wasm bytecode and then run them in WasmEdge.

Before we start, let's set up the software we need.

## Install WasmEdge

Use the following command line to install WasmEdge on your machine. If you are using Windows or other non-Unix-like platforms, please refer to the [WasmEdge installation instruction](../build-and-run/install).

```bash
curl -sSf https://raw.githubusercontent.com/WasmEdge/WasmEdge/master/utils/install.sh | bash
```

## Install Rust

Use the following command line to install Rust on your machine. If you are using Windows or other non-Unix-like platforms, please refer to the [Rust installation instruction](https://www.rust-lang.org/tools/install).

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

## Set up the Rust compiler's target

To build a Wasm file running in server-side WebAssembly like WasmEdge, we need to add the `wasm32-wasi` target for the Rust compiler after Rust is installed.

```bash
rustup target add wasm32-wasi
```

That's it. Go to the following chapters to build and compile Rust programs in action.
