---
sidebar_position: 6
---

# 在 RISC-V 64 上建置

## 準備環境

本教學以 Ubuntu 22.04 主機為基礎,WasmEdge 使用 [RISCV-Lab](https://gitee.com/tinylab/riscv-lab),它提供 riscv64 架構的 Ubuntu 22.04 系統。在此使用者可以使用自己的 riscv64 環境。

### 安裝並執行 RISCV-Lab

```bash
git clone https://gitee.com/tinylab/cloud-lab.git
cd cloud-lab
LOGIN=bash tools/docker/run riscv-lab
```

請注意,在此拉取映像檔需要花費較長時間。

## 建置 WasmEdge

### 取得原始碼

```bash
ubuntu@riscv-lab:/labs/riscv-lab$ git clone https://github.com/WasmEdge/WasmEdge.git
ubuntu@riscv-lab:/labs/riscv-lab$ cd WasmEdge
```

### 相依套件

WasmEdge 至少需要 LLVM 12,您可能需要自行安裝下列相依套件。

```bash
ubuntu@riscv-lab:/labs/riscv-lab$ sudo apt-get update
ubuntu@riscv-lab:/labs/riscv-lab$ sudo apt install -y software-properties-common cmake
ubuntu@riscv-lab:/labs/riscv-lab$ sudo apt install -y llvm-12-dev liblld-12-dev
```

### 編譯

關於所有 CMake 選項的描述,請參閱[此處](../build_from_src.md#cmake-building-options)。

```bash
ubuntu@riscv-lab:/labs/riscv-lab$ cd WasmEdge
ubuntu@riscv-lab:/labs/riscv-lab/WasmEdge$ mkdir -p build && cd build
ubuntu@riscv-lab:/labs/riscv-lab/WasmEdge/build$ cmake -DCMAKE_BUILD_TYPE=Release .. && make -j
```

## 測試

### 執行 wasmedge 工具

對於純 WebAssembly,`wasmedge` CLI 工具將以直譯器模式執行。

```bash
ubuntu@riscv-lab:/labs/riscv-lab/WasmEdge/build$ sudo make install
ubuntu@riscv-lab:/labs/riscv-lab/WasmEdge/build$ cd ../examples/wasm
ubuntu@riscv-lab:/labs/riscv-lab/WasmEdge/examples/wasm$ wasmedge -v
wasmedge version 0.12.0-alpha.1-13-g610cc21f
ubuntu@riscv-lab:/labs/riscv-lab/WasmEdge/examples/wasm$ wasmedge --reactor fibonacci.wasm fib 10
89
ubuntu@riscv-lab:/labs/riscv-lab/WasmEdge/examples/wasm$ wasmedge --reactor add.wasm add 2 2
4
```

### 執行 wasmedge compile

為了改善效能,`wasmedge compile` 可以將 WebAssembly 編譯成原生機器碼。以 `wasmedge compile` AOT 編譯器編譯後,wasmedge 工具可以 AOT 模式執行 WASM,速度會快得多。

```bash
ubuntu@riscv-lab:/labs/riscv-lab/WasmEdge/examples/wasm$ wasmedge compile fibonacci.wasm fibonacci_aot.wasm
[2023-02-01 22:39:15.807] [info] compile start
[2023-02-01 22:39:15.857] [info] verify start
[2023-02-01 22:39:15.866] [info] optimize start
[2023-02-01 22:39:16.188] [info] codegen start
[2023-02-01 22:39:16.403] [info] output start
[2023-02-01 22:39:16.559] [info] compile done
[2023-02-01 22:39:16.565] [info] output start
ubuntu@riscv-lab:/labs/riscv-lab/WasmEdge/examples/wasm$ time wasmedge --reactor fibonacci_aot.wasm fib 30
1346269
real    0m0.284s
user    0m0.282s
sys     0m0.005s
ubuntu@riscv-lab:/labs/riscv-lab/WasmEdge/examples/wasm$ time wasmedge --reactor fibonacci.wasm fib 30
1346269
real    0m1.814s
user    0m1.776s
sys     0m0.016s
```
