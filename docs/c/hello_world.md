---
sidebar_position: 1
---

# 6.1 Hello World

This chapter will take Hello World as an example to show how to compile a C program to Wasm bytecode and run in WasmEdge.


## Prerequisites

Before we started, make sure you have installed the following software:

1. [Install WasmEdge](docs/quick-start/install.md)

2. Emscripten, a toolchain for compiling C/C++ to WebAssembly. Please refer to the [emcc official repository](https://github.com/emscripten-core/emsdk) for the detailed instructions.

```bash
git clone --depth 1 https://github.com/emscripten-core/emsdk.git
cd emsdk
./emsdk install latest
./emsdk activate latest
source ./emsdk_env.sh
```

## Compile the C code into Wasm


The Hello world example is simple, and save the program to a file called hello.c.

```
#include <stdio.h>

int main(void) {
    printf("Hello, world!\n");
    return 0;
}
```

Use `emcc` to compile the C code into Wasm. This will generate a file called hello.wasm which contains the WASI bytecode for the program.

```
emcc hello.c -o hello.wasm
```


## Run in WasmEdge

Run the compiled wasm with WasmEdge CLI and you will get the hello world output.


```
$ wasmedge hello.wasm
Hello, world!
```

## AoT mode

With WasmEdge's AoT compiler, you will get higher performance.
```bash
# Compile the wasm file with wasmedge aot compiler
$ wasmedgec hello.wasm hello.wasm
# Run the native binary with wasmedge
$ wasmedge hello.wasm
```