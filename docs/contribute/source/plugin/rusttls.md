---
sidebar_position: 8
---

# Build with Rustls Plug-in

The WasmEdge Rustls plug-in is a replacement for the OpenSSL plug-in in WasmEdge. It provides a Rust-friendly interface to the Rustls library, which is a modern, fast, and more secure alternative to OpenSSL.

Here's a step-by-step guide on how to build the WasmEdge Rustls plug-in:

# Building the WasmEdge Rustls Plug-in

The WasmEdge Rustls plug-in is a replacement for the OpenSSL plug-in in WasmEdge. It provides a Rust-friendly interface to the Rustls library, which is a modern, fast, and more secure alternative to OpenSSL.

Here's a step-by-step guide on how to build the WasmEdge Rustls plug-in:

## Prerequisites

Ensure the following dependencies are installed on your system:

- Rust: You can install it from the [official website](https://www.rust-lang.org/tools/install).
- CMake: Minimum version 3.12. Install it from the [official website](https://cmake.org/download/).

## Clone the WasmEdge Repository

First, clone the WasmEdge repository from GitHub:

```bash
git clone https://github.com/WasmEdge/WasmEdge.git
```

## Navigate to the Rustls Plug-in Directory

Navigate to the `wasmedge_rustls` directory within the cloned repository:

```bash
cd WasmEdge/plugins/wasmedge_rustls
```

## Build the Plug-in

Now you can build the Rustls plug-in. Run the following command:

```bash
cargo build --release
```

This command builds the plug-in in release mode. The compiled binary will be located in the `target/release` directory.

## Install the Plug-in

To install the plug-in, you can use the `cargo install` command:

```bash
cargo install --path .
```

This command will install the built plug-in into your Rust binary directory.

## Usage

To use the plug-in with WasmEdge, you need to specify it when starting the WasmEdge runtime:

```bash
wasmedge --dir .:. --reactor --rustls_plugin target/release/libwasmedge_rustls.so your_wasm_file.wasm
```

Replace `your_wasm_file.wasm` with the path to your WebAssembly file. The `--rustls_plugin` flag specifies the path to the Rustls plug-in.

That's it! You have successfully built and installed the WasmEdge Rustls plug-in. Please ensure to replace the OpenSSL plug-in with the Rustls plug-in in your WasmEdge runtime configuration if you were previously using OpenSSL. 

For more information, you can refer to the [GitHub repository](https://github.com/WasmEdge/WasmEdge/tree/master/plugins/wasmedge_rustls).
