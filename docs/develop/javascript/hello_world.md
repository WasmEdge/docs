---
sidebar_position: 2
---

# 5.2 Quick Start with JavaScript on WasmEdge

## Prerequisites

[Install WasmEdge](../build-and-run/install)

Clone the `wasmedge-quickjs` repo and use it as the current directory.
Then download the pre-built WasmEdge QuickJS Runtime program, and AOT compile it for better performance.

```bash
git clone https://github.com/second-state/wasmedge-quickjs
cd wasmedge-quickjs
curl -OL https://github.com/second-state/wasmedge-quickjs/releases/download/v0.5.0-alpha/wasmedge_quickjs.wasm
wasmedgec wasmedge_quickjs.wasm wasmedge_quickjs.wasm
```

:::note
The reason to use `wasmedge-quickjs` as the current working directory is that `modules` in the repo is required for the QuickJS runtime.
:::

Optional: Install the [Rust toolchain for WasmEdge](../rust/setup), if you want to build the WasmEdge QuickJS runtime yourself.

## Quick start

You can try a simple "hello world" JavaScript program ([example_js/hello.js](https://github.com/second-state/wasmedge-quickjs/blob/main/example_js/hello.js)), which prints out the command line arguments to the console.

```bash
$ wasmedge --dir .:. wasmedge_quickjs.wasm example_js/hello.js WasmEdge Runtime
Hello WasmEdge Runtime
```

:::note
The `--dir .:.` on the command line is to give `wasmedge` permission to read the local directory in the file system for the `hello.js` file.
:::

The JavaScript source code for the `hello.js` program is as follows.

```javascript
import * as os from 'os';
import * as std from 'std';

args = args.slice(1);
print('Hello', ...args);
setTimeout(() => {
  print('timeout 2s');
}, 2000);
```

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
