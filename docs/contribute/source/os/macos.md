---
sidebar_position: 2
---

# Build on macOS

Currently, WasmEdge project on MacOS supports both Intel and M1 models. However, we only test and develop on `Catalina`, `Big Sur`, and `Monterey`.

- Model:
  - Intel (x86_64)
  - M1, M2 (arm64)
- Operating System
  - Ventura
  - Monterey
  - Big Sur
  - Catalina

If you want to develop WasmEdge on MacOS, please follow this guide to build and test from source code.

## Get Source Code

```bash
git clone https://github.com/WasmEdge/WasmEdge.git
cd WasmEdge
```

## Requirements and Dependencies

WasmEdge will try to use the latest LLVM release to create our nightly build. If you want to build from source, you may need to install these dependencies yourself.

- LLVM 18.1.8 (>= 10.0.0)

```bash
# Tools and libraries
brew install cmake ninja llvm@18
export LLVM_DIR="$(brew --prefix)/opt/llvm@18/lib/cmake"
export CC=clang
export CXX=clang++
```

## Build WasmEdge

Please refer to [here](../build_from_src.md#cmake-building-options) for the descriptions of all CMake options.

```bash
cmake -Bbuild -GNinja -DWASMEDGE_BUILD_TESTS=ON .
cmake --build build
```

If you don't want to link LLVM on MacOS dynamically, you can set the option `WASMEDGE_LINK_LLVM_STATIC` to `ON`.

## Run Tests

The following tests are available only when the build option `WASMEDGE_BUILD_TESTS` is set to `ON`.

Users can use these tests to verify the correctness of WasmEdge binaries.

```bash
cd build
DYLD_LIBRARY_PATH=$(pwd)/lib/api ctest
```
