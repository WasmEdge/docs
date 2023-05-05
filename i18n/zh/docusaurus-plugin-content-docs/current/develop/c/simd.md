---
sidebar_position: 4
---

# 6.4 SIMD

# WebAssembly SIMD Example in C

[128-bit packed Single Instruction Multiple Data (SIMD)](https://webassembly.github.io/simd/core/syntax/instructions.html#simd-instructions) instructions provide simultaneous computations over packed data in just one instruction. It's commonly used to improve performance for multimedia applications. With the SIMD proposal, the modules can benefit from using these commonly used instructions in modern hardware to gain more speedup.

If you are interested in enabling the SIMD proposal will improve how much performance of the applications, please refer to our [wasm32-wasi benchmark](https://github.com/second-state/wasm32-wasi-benchmark) for more information.
In our benchmark, the Mandelbrot Set application can have **2.65x** speedup.

We modified the Mandelbrot Set example from our [wasm32-wasi benchmark project](https://github.com/second-state/wasm32-wasi-benchmark/blob/master/src/mandelbrot.c). We will use this as an example in this article.


## Prerequisites

Before we started, make sure you have installed the following software:

1. [Install WasmEdge](../build-and-run/install)

2. Emscripten, a toolchain for compiling C/C++ to WebAssembly. Please refer to the [emcc official repository](https://github.com/emscripten-core/emsdk) for the detailed instructions.

```bash
git clone --depth 1 https://github.com/emscripten-core/emsdk.git
cd emsdk
./emsdk install latest
./emsdk activate latest
source ./emsdk_env.sh
```

## Compile the C-SIMD application to Wasm-SIMD binary with emcc


```bash
emcc -g -Oz --llvm-lto 1 -s STANDALONE_WASM -s INITIAL_MEMORY=32MB -s MAXIMUM_MEMORY=4GB \
  -mmutable-globals \
  -mnontrapping-fptoint \
  -msign-ext \
  mandelbrot-simd.c -o mandelbrot-simd.wasm
```

## Run with WasmEdge


```bash
wasmedge mandelbrot-simd.wasm 15000
```

## Ahead-of-Time mode

With WasmEdge's AoT compiler, you will get higher performance.

```bash
# Compile wasm-simd with wasmedge aot compiler
$ wasmedgec mandelbrot-simd.wasm mandelbrot-simd-out.wasm
# Run the native binary with wasmedge
$ wasmedge mandelbrot-simd-out.wasm 15000
```
