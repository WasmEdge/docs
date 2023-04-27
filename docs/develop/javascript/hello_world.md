---
sidebar_position: 2
---

# 5.2 Quick Start with JavaScript on WasmEdge

## Prerequisites

* [WasmEdge installed](../build-and-run/install)
* Download the WasmEdge QuickJS Runtime
    * Run `curl -OL https://github.com/second-state/wasmedge-quickjs/releases/download/v0.4.0-alpha/wasmedge_quickjs.wasm` to download 
* Optional: [Rust](https://www.rust-lang.org/tools/install) installed, if you want to build the program yourself
* Optional: `wasm32-wasi` target of the Rust toolchain added, if you want to build the program yourself
    * Run `rustup target add wasm32-wasi` after installed Rust. 


## Quick start


First, download the WebAssembly-based JavaScript interpreter program for WasmEdge. It is based on [QuickJS](https://bellard.org/quickjs/). See the [build it yourself section](#build-it-yourself) to learn how to compile it from Rust source code.

```
curl -OL https://github.com/second-state/wasmedge-quickjs/releases/download/v0.4.0-alpha/wasmedge_quickjs.wasm
```
You can now try a simple "hello world" JavaScript program ([example_js/hello.js](https://github.com/second-state/wasmedge-quickjs/blob/main/example_js/hello.js)), which prints out the command line arguments to the console.

```javascript
import * as os from 'os';
import * as std from 'std';

args = args.slice(1);
print('Hello', ...args);
setTimeout(() => {
  print('timeout 2s');
}, 2000);
```

Next, Run the `hello.js` file in WasmEdge’s QuickJS runtime as follows. Make sure you have installed [WasmEdge](../build-and-run/install).

```bash
$ wasmedge --dir .:. wasmedge_quickjs.wasm example_js/hello.js WasmEdge Runtime
Hello WasmEdge Runtime
```

> Note: the `--dir .:.` on the command line is to give `wasmedge` permission to read the local directory in the file system for the `hello.js` file.

## Build it yourself 

This section is optional. Read on if you are interested in [adding custom built-in JavaScript APIs](rust) to the runtime.


Following the instructions, you will be able to build a JavaScript interpreter for WasmEdge. Make sure you have installed GCC. If you don't, run the following command line.

```bash
# Install GCC
sudo apt update
sudo apt install build-essential
```
Then, we could build the WasmEdge-Quickjs runtime.

Fork or clone [the wasmedge-quickjs Github repository](https://github.com/second-state/wasmedge-quickjs).

```bash
# get the source code
git clone https://github.com/second-state/wasmedge-quickjs

# Build the QuickJS JavaScript interpreter
cargo build --target wasm32-wasi --release
```

The WebAssembly-based JavaScript interpreter program is located in the build `target` directory.

WasmEdge provides a `wasmedgec` utility to compile and add a native machine code section to the `wasm` file. You can use `wasmedge` to run the natively instrumented `wasm` file to get much faster performance.

```bash
wasmedgec target/wasm32-wasi/release/wasmedge_quickjs.wasm wasmedge_quickjs.wasm
wasmedge --dir .:. wasmedge_quickjs.wasm example_js/hello.js
```

Next, we will discuss more advanced use case for JavaScript in WasmEdge.
