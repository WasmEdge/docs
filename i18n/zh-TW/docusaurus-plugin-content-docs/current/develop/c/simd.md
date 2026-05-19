---
sidebar_position: 4
---

# 在 C 中使用 WebAssembly SIMD 範例

[128 位元的封裝單一指令多重資料（Single Instruction Multiple Data，SIMD）](https://webassembly.github.io/simd/core/syntax/instructions.html#simd-instructions) 指令能夠在單一指令中同時對封裝資料進行運算。它常用於提升多媒體應用程式的效能。透過 SIMD 提案，模組可以受益於這些在現代硬體上常用的指令，獲得更大的加速效果。

如果您想了解啟用 SIMD 提案能為應用程式效能帶來多少提升，請參閱我們的 [wasm32-wasip1 效能測試](https://github.com/second-state/wasm32-wasi-benchmark)。在我們的測試中，曼德博集合（Mandelbrot Set）應用程式可獲得 **2.65 倍** 的加速。

我們修改了 [wasm32-wasip1 效能測試專案](https://github.com/second-state/wasm32-wasi-benchmark/blob/master/src/mandelbrot.c)中的曼德博集合範例。本文將以此為範例進行說明。

## 先決條件

開始之前，請確認您已安裝以下軟體：

1. [安裝 WasmEdge](../../start/install.md#install)

2. Emscripten，一個用於將 C/C++ 編譯成 WebAssembly 的工具鏈。詳細說明請參閱 [emcc 官方儲存庫](https://github.com/emscripten-core/emsdk)。

```bash
git clone --depth 1 https://github.com/emscripten-core/emsdk.git
cd emsdk
./emsdk install latest
./emsdk activate latest
source ./emsdk_env.sh
```

## 使用 emcc 將 C-SIMD 應用程式編譯成 Wasm-SIMD 二進位檔

```bash
emcc -g -Oz --llvm-lto 1 -s STANDALONE_WASM -s INITIAL_MEMORY=32MB -s MAXIMUM_MEMORY=4GB \
  -mmutable-globals \
  -mnontrapping-fptoint \
  -msign-ext \
  mandelbrot-simd.c -o mandelbrot-simd.wasm
```

## 使用 WasmEdge 執行

```bash
wasmedge mandelbrot-simd.wasm 15000
```

## Ahead-of-Time 模式

透過 WasmEdge 的 AoT 編譯器，您可以獲得更高的效能。

```bash
# 使用 wasmedge aot 編譯器編譯 wasm-simd
$ wasmedge compile mandelbrot-simd.wasm mandelbrot-simd-out.wasm
# 使用 wasmedge 執行原生二進位檔
$ wasmedge mandelbrot-simd-out.wasm 15000
```
