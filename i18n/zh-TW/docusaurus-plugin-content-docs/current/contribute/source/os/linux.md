---
sidebar_position: 1
---

# 在 Linux 上建置

## 取得原始碼

```bash
git clone https://github.com/WasmEdge/WasmEdge.git
cd WasmEdge
```

## 準備環境

### Docker 映像檔

設定環境最簡單的方式是使用 WasmEdge docker 映像檔。

您可以使用下列指令從 [dockerhub](https://hub.docker.com/search?q=wasmedge) 取得我們最新的 docker 映像檔:

```bash
docker pull wasmedge/wasmedge # Pulls the latest - wasmedge/wasmedge:latest
```

或者您也可以使用[可用的標籤](../docker.md#docker-images-for-building-wasmedge) 拉取映像檔。

### 在 Ubuntu 上手動安裝相依套件

對於不想使用 docker 的開發者,他們可以在 Ubuntu 上手動設定環境。

請確認下列相依套件已滿足。

- LLVM 12.0.0 (>= 10.0.0)
- _(選擇性)_ GCC 11.1.0 (>= 9.4.0),若您偏好使用 GCC 工具鏈請安裝。

在 `WasmEdge 0.13.0` 之後,已不再需要 `boost` 相依套件。

#### 適用於 Ubuntu 22.04

```bash
# Tools and libraries
sudo apt install -y \
   software-properties-common \
   cmake

# And you will need to install llvm for the AOT runtime
sudo apt install -y \
   llvm-14-dev \
   liblld-14-dev

# WasmEdge supports both clang++ and g++ compilers.
# You can choose one of them to build this project.
# If you prefer GCC, then:
sudo apt install -y gcc g++
# Or if you prefer clang, then:
sudo apt install -y clang-14
```

#### 適用於 Ubuntu 20.04

```bash
# Tools and libraries
sudo apt install -y \
   software-properties-common \
   cmake

# And you will need to install llvm for the AOT runtime
sudo apt install -y \
   llvm-12-dev \
   liblld-12-dev

# WasmEdge supports both clang++ and g++ compilers.
# You can choose one of them to build this project.
# If you prefer GCC, then:
sudo apt install -y gcc g++
# Or if you prefer clang, then:
sudo apt install -y clang-12
```

### 支援舊版作業系統

我們的開發環境需要 `libLLVM-12` 與 `>=GLIBCXX_3.4.33`。

如果使用者使用比 Ubuntu 20.04 更舊的作業系統,請使用我們特定的 docker 映像檔來建置 WasmEdge。如果您要尋找適用於較舊作業系統的預建執行檔,我們也提供多個以 `manylinux*` 發行版為基礎的預建執行檔。

| Docker 映像檔 | 基礎映像檔 | 提供的需求 |
| --- | --- | --- |
| `wasmedge/wasmedge:manylinux2014_x86_64` | CentOS 7.9 | GLIBC <= 2.17<br/>CXXABI <= 1.3.7<br/>GLIBCXX <= 3.4.19<br/>GCC <= 4.8.0 |
| `wasmedge/wasmedge:manylinux2014_aarch64` | CentOS 7.9 | GLIBC <= 2.17<br/>CXXABI <= 1.3.7<br/>GLIBCXX <= 3.4.19<br/>GCC <= 4.8.0 |

## 建置 WasmEdge

關於所有 CMake 選項的描述,請參閱[此處](../build_from_src.md#cmake-building-options)。

```bash
# After pulling our wasmedge docker image
docker run -it --rm \
    -v <path/to/your/wasmedge/source/folder>:/root/wasmedge \
    wasmedge/wasmedge:latest
# In docker
cd /root/wasmedge
# If you don't use docker then you need to run only the following commands in the cloned repository root
mkdir -p build && cd build
cmake -DCMAKE_BUILD_TYPE=Release -DWASMEDGE_BUILD_TESTS=ON .. && make -j
```

## 執行測試

下列測試僅在建置選項 `WASMEDGE_BUILD_TESTS` 設為 `ON` 時可用。

使用者可使用這些測試來驗證 WasmEdge 執行檔的正確性。

```bash
# In docker
cd <path/to/wasmedge/build_folder>
LD_LIBRARY_PATH=$(pwd)/lib/api ctest
```
