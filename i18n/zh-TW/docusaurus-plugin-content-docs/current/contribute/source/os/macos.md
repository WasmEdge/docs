---
sidebar_position: 2
---

# 在 macOS 上建置

目前,WasmEdge 在 MacOS 上的專案同時支援 Intel 與 M1 機型。然而,我們僅在 `Catalina`、`Big Sur` 與 `Monterey` 上進行測試與開發。

- 機型:
  - Intel (x86_64)
  - M1、M2 (arm64)
- 作業系統
  - Ventura
  - Monterey
  - Big Sur
  - Catalina

如果您想在 MacOS 上開發 WasmEdge,請依照本指南從原始碼建置並測試。

## 取得原始碼

```bash
git clone https://github.com/WasmEdge/WasmEdge.git
cd WasmEdge
```

## 需求與相依套件

WasmEdge 會嘗試使用最新的 LLVM 發行版來建立我們的每夜建置。如果您想從原始碼建置,可能需要自行安裝這些相依套件。

- LLVM 18.1.8 (>= 10.0.0)

```bash
# Tools and libraries
brew install cmake ninja llvm@18
export LLVM_DIR="$(brew --prefix)/opt/llvm@18/lib/cmake"
export CC=clang
export CXX=clang++
```

## 建置 WasmEdge

關於所有 CMake 選項的描述,請參閱[此處](../build_from_src.md#cmake-building-options)。

```bash
cmake -Bbuild -GNinja -DWASMEDGE_BUILD_TESTS=ON .
cmake --build build
```

如果您不想在 MacOS 上動態連結 LLVM,可以將選項 `WASMEDGE_LINK_LLVM_STATIC` 設為 `ON`。

## 執行測試

下列測試僅在建置選項 `WASMEDGE_BUILD_TESTS` 設為 `ON` 時可用。

使用者可使用這些測試來驗證 WasmEdge 執行檔的正確性。

```bash
cd build
DYLD_LIBRARY_PATH=$(pwd)/lib/api ctest
```
