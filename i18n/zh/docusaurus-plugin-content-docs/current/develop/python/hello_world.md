---
sidebar_position: 1
---

# Python

Several different language implementations of the Python runtime exist, and some of them support WebAssembly. This document will describe how to run [RustPython](https://github.com/RustPython/RustPython) on WasmEdge to execute Python programs.

## Compile RustPython

To compile RustPython, you should install the Rust toolchain on your machine. And `wasm32-wasip1` platform support should be enabled.

```bash
rustup target add wasm32-wasip1
```

Then you could use the following command to clone and compile RustPython:

```bash
git clone https://github.com/RustPython/RustPython.git
cd RustPython
cargo build --release --target wasm32-wasip1 --features="freeze-stdlib"
```

`freeze-stdlib` feature is enabled for including Python standard library inside the binary file. The output file should be at `target/wasm32-wasip1/release/rustpython.wasm`.

## AOT Compile

WasmEdge supports compiling WebAssembly bytecode programs into native machine code for better performance. It is highly recommended to compile the RustPython to native machine code before running.

```bash
wasmedge compile ./target/wasm32-wasip1/release/rustpython.wasm ./target/wasm32-wasip1/release/rustpython.wasm
```

## Run

```bash
wasmedge ./target/wasm32-wasip1/release/rustpython.wasm
```

Then you could get a Python shell in WebAssembly!

## Grant file system access

You can pre-open directories to let WASI programs have permission to read and write files stored on the real machine. The following command mounted the current working directory to the WASI virtual file system.

```bash
wasmedge --dir .:. ./target/wasm32-wasip1/release/rustpython.wasm
```
