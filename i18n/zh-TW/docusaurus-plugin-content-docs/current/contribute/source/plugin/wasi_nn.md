---
sidebar_position: 2
---

# 建置具有 WASI-NN 外掛的版本

WASI-NN 外掛是 WebAssembly System Interface (WASI) 為機器學習提出的 API 提案。它讓 WebAssembly 程式可以存取主機提供的機器學習函式。

## 先決條件

目前,WasmEdge 為 WASI-NN 提案支援下列後端:

| 後端 | 相依套件 | CMake 選項 |
|---------|------------|--------------|
| [OpenVINO](#build-wasmedge-with-wasi-nn-openvino-backend) | [OpenVINO™ (2023)](https://docs.openvino.ai/2023.0/openvino_docs_install_guides_installing_openvino_apt.html) | `-DWASMEDGE_PLUGIN_WASI_NN_BACKEND=OpenVINO` |
| [TensorFlow-Lite](#build-wasmedge-with-wasi-nn-tensorflow-lite-backend) | [TensorFlow Lite](https://www.tensorflow.org/install/lang_c) | `-DWASMEDGE_PLUGIN_WASI_NN_BACKEND=TensorFlowLite` |
| [PyTorch](#build-wasmedge-with-wasi-nn-pytorch-backend) | [PyTorch 1.8.2 LTS](https://pytorch.org/get-started/locally/) | `-DWASMEDGE_PLUGIN_WASI_NN_BACKEND=PyTorch` |
| [GGML](#build-wasmedge-with-wasi-nn-pytorch-backend) | [llama.cpp](https://github.com/ggerganov/llama.cpp) | `-DWASMEDGE_PLUGIN_WASI_NN_BACKEND=GGML` |
| [Piper](#build-wasmedge-with-wasi-nn-piper-backend) | [Piper](https://github.com/rhasspy/piper) | `-DWASMEDGE_PLUGIN_WASI_NN_BACKEND=Piper` |
| [Whisper](#build-wasmedge-with-wasi-nn-whisper-backend) | [whisper.cpp](https://github.com/ggerganov/whisper.cpp) | `-DWASMEDGE_PLUGIN_WASI_NN_BACKEND=Whisper` |
| [ChatTTS](#build-wasmedge-with-wasi-nn-chattts-backend) | [ChatTTS](https://github.com/2noise/ChatTTS) | `-DWASMEDGE_PLUGIN_WASI_NN_BACKEND=ChatTTS` |
| [MLX](#build-wasmedge-with-wasi-nn-mlx-backend) | [MLX](https://github.com/ml-explore/mlx) | `-DWASMEDGE_PLUGIN_WASI_NN_BACKEND=MLX` |
| [BitNet](#build-wasmedge-with-wasi-nn-bitnet-backend) | [BitNet.cpp](https://github.com/microsoft/BitNet) | `-DWASMEDGE_PLUGIN_WASI_NN_BACKEND=BitNet` |

開發者可[從原始碼建置 WasmEdge](../os/linux.md) 並加上 cmake 選項 `WASMEDGE_PLUGIN_WASI_NN_BACKEND` 來啟用這些後端。要支援多個後端,開發者可以指定例如 `-DWASMEDGE_PLUGIN_WASI_NN_BACKEND="GGML;Whisper;TensorFlowLite"` 之類的選項。

建置完成後,您將在 `<YOUR_BUILD_FOLDER>/plugins/wasi_nn/libwasmedgePluginWasiNN.so` (在 MacOS 上副檔名為 `.dylib`) 下擁有指定後端的 WASI-NN 外掛共用函式庫。

<!-- prettier-ignore -->
:::note
如果 `wasmedge` CLI 工具找不到 WASI-NN 外掛,您可以將 `WASMEDGE_PLUGIN_PATH` 環境變數設為外掛安裝路徑 (例如 `/usr/local/lib/wasmedge/`,或建置出的外掛路徑 `build/plugins/wasi_nn/`) 以嘗試解決此問題。
:::

對於 `Burn.rs` 後端,請使用 cmake 選項 `WASMEDGE_PLUGIN_WASI_NN_BURNRS_MODEL` 來指定模型。

| `Burn.rs` 後端的模型 | CMake 選項 |
|-------|--------------|
| Squeezenet | `-WASMEDGE_PLUGIN_WASI_NN_BURNRS_MODEL=Squeezenet` |
| Whisper | `-WASMEDGE_PLUGIN_WASI_NN_BURNRS_MODEL=Whisper` |

建置完成後,您將在 `<YOUR_BUILD_FOLDER>/plugins/wasi_nn_burnrs/libwasmedgePluginWasiNN.so` (在 MacOS 上副檔名為 `.dylib`) 下擁有指定後端的 WASI-NN 外掛共用函式庫。

<!-- prettier-ignore -->
:::note
`WASI-NN Burn.rs` 後端無法與其他後端一同建置。
:::

## 使用 WASI-NN OpenVINO 後端建置 WasmEdge

要在 `Ubuntu 20.04` 上選擇並安裝後端的 OpenVINO™,我們建議使用下列指令:

```bash
wget https://apt.repos.intel.com/intel-gpg-keys/GPG-PUB-KEY-INTEL-SW-PRODUCTS.PUB
sudo apt-key add GPG-PUB-KEY-INTEL-SW-PRODUCTS.PUB
echo "deb https://apt.repos.intel.com/openvino/2023 ubuntu20 main" | sudo tee /etc/apt/sources.list.d/intel-openvino-2023.list
sudo apt update
sudo apt-get -y install openvino
ldconfig
```

然後從原始碼建置並安裝 WasmEdge:

```bash
cd <path/to/your/wasmedge/source/folder>
cmake -GNinja -Bbuild -DCMAKE_BUILD_TYPE=Release -DWASMEDGE_PLUGIN_WASI_NN_BACKEND="OpenVINO"
cmake --build build
```

## 使用 WASI-NN PyTorch 後端建置 WasmEdge

要在 `Ubuntu 20.04` 上選擇並安裝後端的 PyTorch,我們建議使用下列指令:

```bash
export PYTORCH_VERSION="1.8.2"
curl -s -L -O --remote-name-all https://download.pytorch.org/libtorch/lts/1.8/cpu/libtorch-cxx11-abi-shared-with-deps-${PYTORCH_VERSION}%2Bcpu.zip
unzip -q "libtorch-cxx11-abi-shared-with-deps-${PYTORCH_VERSION}%2Bcpu.zip"
rm -f "libtorch-cxx11-abi-shared-with-deps-${PYTORCH_VERSION}%2Bcpu.zip"
export LD_LIBRARY_PATH=$(pwd)/libtorch/lib:${LD_LIBRARY_PATH}
export Torch_DIR=$(pwd)/libtorch
```

對於舊版作業系統 (例如 `CentOS 7.6`),請改用 `pre-cxx11-abi` 版本的 `libtorch`:

```bash
export PYTORCH_VERSION="1.8.2"
curl -s -L -O --remote-name-all https://download.pytorch.org/libtorch/lts/1.8/cpu/libtorch-shared-with-deps-${PYTORCH_VERSION}%2Bcpu.zip
unzip -q "libtorch-shared-with-deps-${PYTORCH_VERSION}%2Bcpu.zip"
rm -f "libtorch-shared-with-deps-${PYTORCH_VERSION}%2Bcpu.zip"
export LD_LIBRARY_PATH=$(pwd)/libtorch/lib:${LD_LIBRARY_PATH}
export Torch_DIR=$(pwd)/libtorch
```

PyTorch 函式庫將會解壓縮至目前目錄的 `./libtorch`。

然後從原始碼建置並安裝 WasmEdge:

```bash
cd <path/to/your/wasmedge/source/folder>
cmake -GNinja -Bbuild -DCMAKE_BUILD_TYPE=Release -DWASMEDGE_PLUGIN_WASI_NN_BACKEND="PyTorch"
cmake --build build
```

## 使用 WASI-NN TensorFlow-Lite 後端建置 WasmEdge

您可以直接從原始碼建置並安裝 WasmEdge (在 `Linux x86_64`、`Linux aarch64`、`MacOS x86_64` 或 `MacOS arm64` 平台上):

```bash
cd <path/to/your/wasmedge/source/folder>
cmake -GNinja -Bbuild -DCMAKE_BUILD_TYPE=Release -DWASMEDGE_PLUGIN_WASI_NN_BACKEND="TensorflowLite"
cmake --build build
```

要在 `Ubuntu 20.04` 與 `manylinux2014` 上為此後端安裝必要的 `libtensorflowlite_c.so` 與 `libtensorflowlite_flex.so`,我們建議使用下列指令:

```bash
curl -s -L -O --remote-name-all https://github.com/second-state/WasmEdge-tensorflow-deps/releases/download/TF-2.12.0-CC/WasmEdge-tensorflow-deps-TFLite-TF-2.12.0-CC-manylinux2014_x86_64.tar.gz
tar -zxf WasmEdge-tensorflow-deps-TFLite-TF-2.12.0-CC-manylinux2014_x86_64.tar.gz
rm -f WasmEdge-tensorflow-deps-TFLite-TF-2.12.0-CC-manylinux2014_x86_64.tar.gz
```

共用函式庫將會解壓縮至目前目錄的 `./libtensorflowlite_c.so` 與 `./libtensorflowlite_flex.so`。

接著您可以將函式庫移動到安裝路徑:

```bash
mv libtensorflowlite_c.so /usr/local/lib
mv libtensorflowlite_flex.so /usr/local/lib
```

或設定環境變數 `export LD_LIBRARY_PATH=$(pwd):${LD_LIBRARY_PATH}`。

<!-- prettier-ignore -->
:::note
我們也提供了 `darwin_x86_64`、`darwin_arm64` 與 `manylinux_aarch64` 版本的 TensorFlow-Lite 預建共用函式庫。
:::

如需更多資訊,您可以參閱 [GitHub 儲存庫](https://github.com/WasmEdge/WasmEdge/tree/master/plugins/wasi_nn)。

## 使用 WASI-NN llama.cpp 後端建置 WasmEdge

您不需要安裝任何 llama.cpp 函式庫。WasmEdge 將在建置期間自動下載它。

由於加速框架各異,您將需要使用不同的編譯選項來建置此外掛。請確保依照您所在的作業系統章節進行操作。

### 在 MacOS 上使用 llama.cpp 後端建置

#### Intel 機型

如果您使用 Intel 機型的 macOS,我們不會啟用任何加速框架。這是純 CPU 模式的外掛。

```bash
cd <path/to/your/wasmedge/source/folder>
# Disable BLAS and METAL on x86_64 macOS.
cmake -GNinja -Bbuild -DCMAKE_BUILD_TYPE=Release \
  -DWASMEDGE_PLUGIN_WASI_NN_BACKEND="GGML" \
  -DWASMEDGE_PLUGIN_WASI_NN_GGML_LLAMA_METAL=OFF \
  -DWASMEDGE_PLUGIN_WASI_NN_GGML_LLAMA_BLAS=OFF \
  .
cmake --build build
```

#### Apple Silicon 機型

您可以直接在 macOS arm64 平台上從原始碼建置並安裝 WasmEdge。它會預設使用內建的 GPU。

```bash
cd <path/to/your/wasmedge/source/folder>
# Enable METAL on arm64 macOS.
cmake -GNinja -Bbuild -DCMAKE_BUILD_TYPE=Release \
  -DWASMEDGE_PLUGIN_WASI_NN_BACKEND="GGML" \
  -DWASMEDGE_PLUGIN_WASI_NN_GGML_LLAMA_METAL=ON \
  -DWASMEDGE_PLUGIN_WASI_NN_GGML_LLAMA_BLAS=OFF \
  .
cmake --build build
```

### 在 Linux 上使用 llama.cpp 後端建置

#### Ubuntu/Debian 搭配 CUDA 12

請依照 NVIDIA 提供的官方指南安裝 CUDA 框架:<https://developer.nvidia.com/cuda-12-2-0-download-archive>

```bash
cd <path/to/your/wasmedge/source/folder>

# You may need to install dependencies
apt update
apt install -y software-properties-common lsb-release \
  cmake unzip pkg-config

# Due to cuda-related files, it will produce some warning.
# Disable the warning as an error to avoid failures.
export CXXFLAGS="-Wno-error"
# Please make sure you set up the correct CUDAARCHS.
# We use `60;61;70` for maximum compatibility.
export CUDAARCHS="60;61;70"

# BLAS cannot work with CUBLAS
cmake -GNinja -Bbuild -DCMAKE_BUILD_TYPE=Release \
  -DCMAKE_CUDA_ARCHITECTURES="60;61;70" \
  -DCMAKE_CUDA_COMPILER=/usr/local/cuda/bin/nvcc \
  -DWASMEDGE_PLUGIN_WASI_NN_BACKEND="GGML" \
  -DWASMEDGE_PLUGIN_WASI_NN_GGML_LLAMA_BLAS=OFF \
  -DWASMEDGE_PLUGIN_WASI_NN_GGML_LLAMA_CUBLAS=ON \
  .

cmake --build build
```

#### NVIDIA Jetson AGX Orin 上的 Ubuntu

您應使用 NVIDIA 官方網站提供的預建作業系統映像檔。

```bash
cd <path/to/your/wasmedge/source/folder>

# Due to cuda-related files, it will produce some warning.
# Disable the warning as an error to avoid failures.
export CXXFLAGS="-Wno-error"
# Please make sure you set up the correct CUDAARCHS.
# 72 is for NVIDIA Jetson AGX Orin
export CUDAARCHS=72

# BLAS cannot work with CUBLAS
cmake -GNinja -Bbuild -DCMAKE_BUILD_TYPE=Release \
  -DCMAKE_CUDA_COMPILER=/usr/local/cuda/bin/nvcc \
  -DWASMEDGE_PLUGIN_WASI_NN_BACKEND="GGML" \
  -DWASMEDGE_PLUGIN_WASI_NN_GGML_LLAMA_BLAS=OFF \
  -DWASMEDGE_PLUGIN_WASI_NN_GGML_LLAMA_CUBLAS=ON \
  .

cmake --build build
```

#### Ubuntu/Debian 搭配 OpenBLAS

請在建置外掛之前先安裝 OpenBLAS。

```bash
cd <path/to/your/wasmedge/source/folder>

# You may need to install dependencies
apt update
apt install -y software-properties-common lsb-release \
  cmake unzip pkg-config
# You must install OpenBLAS
apt install libopenblas-dev

cmake -GNinja -Bbuild -DCMAKE_BUILD_TYPE=Release \
  -DWASMEDGE_PLUGIN_WASI_NN_BACKEND="GGML" \
  -DWASMEDGE_PLUGIN_WASI_NN_GGML_LLAMA_BLAS=ON \
  .

cmake --build build
```

#### 一般 Linux,無任何加速框架

```bash
cd <path/to/your/wasmedge/source/folder>

cmake -GNinja -Bbuild -DCMAKE_BUILD_TYPE=Release \
  -DWASMEDGE_PLUGIN_WASI_NN_BACKEND="GGML" \
  -DWASMEDGE_PLUGIN_WASI_NN_GGML_LLAMA_BLAS=OFF \
  .

cmake --build build
```

### 在 Windows 上使用 llama.cpp 後端建置

#### 為 llama.cpp 安裝相依套件並在 Windows 上建置

開發者可依照下列步驟安裝所需的相依套件。

1. (選擇性,若您不需使用 GPU 可跳過此相依套件) 下載並安裝 CUDA 工具組
    - 我們在發行版本中使用 CUDA Toolkit 12
    - 連結:<https://developer.nvidia.com/cuda-downloads?target_os=Windows&target_arch=x86_64&target_version=11&target_type=exe_local>

2. 下載並安裝 Visual Studio 2022 社群版
    - 連結:<https://visualstudio.microsoft.com/vs/community/>
    - 在安裝程式中選擇下列元件:
        - msvc v143 - vs 2022 c++ x64/x86 build tools (latest)
        - windows 11 sdk (10.0.22621.0)
        - C++ ATL for v143 build tools (x86 & x64)

3. 下載並安裝 cmake
    - 我們在發行版本中使用 cmake 3.29.3
    - 連結:<https://github.com/Kitware/CMake/releases/download/v3.29.3/cmake-3.29.3-windows-x86_64.msi>

4. 下載並安裝 git
    - 我們使用 git 2.45.1
    - 連結:<https://github.com/git-for-windows/git/releases/download/v2.45.1.windows.1/Git-2.45.1-64-bit.exe>

5. 下載並安裝 ninja-build
    - 我們使用 ninja-build 1.12.1
    - 連結:<https://github.com/ninja-build/ninja/releases/download/v1.12.1/ninja-win.zip>
    - 安裝:只需將其解壓縮至自訂資料夾即可

接著開發者可依照下列步驟建置。

1. 開啟 VS 2022 的 Developer PowerShell
    - 開始 -> Visual Studio 2022 -> Visual Studio Tools -> Developer PowerShell for VS 2022

2. 在 PowerShell 中,使用 git 下載 wasmedge 儲存庫

    ```console
    cd $HOME
    git clone https://github.com/WasmEdge/WasmEdge.git
    cd WasmEdge
    ```

3. 編譯 wasmedge 並啟用 `wasi_nn_ggml` 相關選項,請使用下列指令。要建置外掛,您不需要啟用 AOT/LLVM 相關功能,因此將它們設為 OFF。

   - 如果您想啟用 CUDA:

      ```console
      # CUDA ENABLE:
      & "C:\Program files\CMake\bin\cmake.exe" -Bbuild -GNinja -DCMAKE_BUILD_TYPE=Release -DWASMEDGE_PLUGIN_WASI_NN_BACKEND=ggml -DWASMEDGE_PLUGIN_WASI_NN_GGML_LLAMA_CUBLAS=ON -DWASMEDGE_USE_LLVM=OFF .
      & "<the ninja-build folder>\ninja.exe" -C build
      ```

   - 如果您想停用 CUDA:

      ```console
      # CUDA DISABLE:
      & "C:\Program files\CMake\bin\cmake.exe" -Bbuild -GNinja -DCMAKE_BUILD_TYPE=Release -DWASMEDGE_PLUGIN_WASI_NN_BACKEND=ggml -DWASMEDGE_USE_LLVM=OFF .
      & "<the ninja-build folder>\ninja.exe" -C build
      ```

   - 如果您想啟用 HIP (AMD GPU):

      ```console
      # HIP ENABLE:
      & "C:\Program files\CMake\bin\cmake.exe" -Bbuild -GNinja -DCMAKE_BUILD_TYPE=Release -DWASMEDGE_PLUGIN_WASI_NN_BACKEND=ggml -DWASMEDGE_PLUGIN_WASI_NN_GGML_LLAMA_HIP=ON -DWASMEDGE_USE_LLVM=OFF .
      & "<the ninja-build folder>\ninja.exe" -C build
      ```

#### 在 Windows 上以 llama 範例執行 WASI-NN 外掛

1. 設定環境變數

    ```console
    $env:PATH += ";$pwd\build\lib\api"
    $env:WASMEDGE_PLUGIN_PATH = "$pwd\build\plugins"
    ```

2. 下載 wasm 並執行

    ```console
    wget https://github.com/second-state/WasmEdge-WASINN-examples/raw/master/wasmedge-ggml/llama/wasmedge-ggml-llama.wasm
    wget https://huggingface.co/QuantFactory/Meta-Llama-3-8B-Instruct-GGUF/blob/main/Meta-Llama-3-8B-Instruct.Q5_K_M.gguf
    wasmedge --dir .:. --env llama3=true --env n_gpu_layers=100 --nn-preload default:GGML:AUTO:Meta-Llama-3-8B-Instruct.Q5_K_M.gguf wasmedge-ggml-llama.wasm default
    ```

#### 疑難排解:AMD Radeon 整合式顯示卡 (Windows)

如果您在 Windows 上使用整合式 AMD GPU (例如 Radeon 780M / gfx1103) 建置 GGML 後端時遇到 `rocBLAS` 或初始化錯誤,您可能需要下列暫時性解決方法:

1. **設定架構覆寫:**
   RDNA 3 整合式顯示卡需要覆寫設定以符合可用的 ROCm kernel。
   ```console
   $env:HSA_OVERRIDE_GFX_VERSION = "11.0.0"
   ```

2. **手動連結函式庫 (ROCm 6.x):** Windows 上的 ROCm 安裝程式可能不會為 `gfx1103` 建立必要的符號連結。如果您看到與遺失的 `TensileLibrary` 檔案相關的錯誤:

   * 進入您的 ROCm 安裝資料夾 (例如 `C:\Program Files\AMD\ROCm\6.x\bin\rocblas\library`)。
   * 複製 `gfx1100` 檔案並將其重新命名為 `gfx1103`。
     * 範例:複製 `TensileLibrary_lazy_gfx1100.dat` -> `TensileLibrary_lazy_gfx1103.dat`

### llama.cpp 後端附錄

我們也為下列平台提供預建的 ggml 外掛:

- darwin\_x86\_64:Intel 機型的 macOS
- darwin\_arm64:Apple Silicon 機型的 macOS
- ubuntu20.04\_x86\_64:x86\_64 Linux (glibc 使用 Ubuntu20.04 的版本)
- ubuntu20.04\_aarch64:aarch64 Linux (glibc 使用 Ubuntu20.04 的版本)
- ubuntu20.04\_cuda\_x86\_64:支援 CUDA 12 的 x86\_64 Linux (glibc 使用 Ubuntu20.04 的版本)
- ubuntu20.04\_cuda\_aarch64:支援 CUDA 11 的 aarch64 Linux (glibc 使用 Ubuntu20.04 的版本),適用於 NVIDIA Jetson AGX Orin
- manylinux2014\_x86\_64:x86\_64 Linux (glibc 使用 CentOS 7 的版本)
- manylinux2014\_aarch64:aarch64 Linux (glibc 使用 CentOS 7 的版本)

## 使用 WASI-NN Piper 後端建置 WasmEdge

從原始碼建置並安裝 WasmEdge:

```bash
cd <path/to/your/wasmedge/source/folder>
cmake -GNinja -Bbuild -DCMAKE_BUILD_TYPE=Release -DWASMEDGE_PLUGIN_WASI_NN_BACKEND="Piper"
cmake --build build
```

## 使用 WASI-NN Whisper 後端建置 WasmEdge

從原始碼建置並安裝 WasmEdge:

```bash
cd <path/to/your/wasmedge/source/folder>
cmake -GNinja -Bbuild -DCMAKE_BUILD_TYPE=Release -DWASMEDGE_PLUGIN_WASI_NN_BACKEND="Whisper"
cmake --build build
```

## 使用 WASI-NN ChatTTS 後端建置 WasmEdge

ChatTTS 後端仰賴 ChatTTS 與 Python 函式庫,我們建議使用下列指令安裝相依套件。

```bash
sudo apt update
sudo apt upgrade
sudo apt install python3-dev
pip install chattts==0.1.1
```

然後從原始碼建置並安裝 WasmEdge:

``` bash
cd <path/to/your/wasmedge/source/folder>

cmake -GNinja -Bbuild -DCMAKE_BUILD_TYPE=Release -DWASMEDGE_PLUGIN_WASI_NN_BACKEND="chatTTS"
cmake --build build
```

## 使用 WASI-NN MLX 後端建置 WasmEdge

您可以直接從原始碼建置並安裝 WasmEdge,或者自訂安裝 mlx 並設定 `CMAKE_INSTALL_PREFIX` 變數。

從原始碼建置並安裝 WasmEdge:

``` bash
cd <path/to/your/wasmedge/source/folder>

cmake -GNinja -Bbuild -DCMAKE_BUILD_TYPE=Release -DWASMEDGE_PLUGIN_WASI_NN_BACKEND="mlx"
cmake --build build
```

## 使用 WASI-NN BitNet 後端建置 WasmEdge

要建置此後端,下列其中一個目標層級 (TL) 最佳化旗標必須恰好啟用一個。同時啟用兩個旗標並不支援,且會導致建置失敗。如果不需要這些特定的最佳化,我們建議改用 `llama.cpp` 的 `GGML` 後端,以取得更廣泛的相容性。


### 在 ARM 上以 TL1 最佳化建置

對於 ARM 系統,使用 `WASMEDGE_PLUGIN_WASI_NN_BITNET_ARM_TL1` 旗標。

```bash
cd <path/to/your/wasmedge/source/folder>
cmake -GNinja -Bbuild -DCMAKE_BUILD_TYPE=Release \
  -DWASMEDGE_PLUGIN_WASI_NN_BACKEND="BitNet" \
  -DWASMEDGE_PLUGIN_WASI_NN_BITNET_ARM_TL1=ON
cmake --build build
```

### 在 x86 上以 TL2 最佳化建置

對於 x86 系統,使用 `WASMEDGE_PLUGIN_WASI_NN_BITNET_X86_TL2` 旗標。

```bash
cd <path/to/your/wasmedge/source/folder>
cmake -GNinja -Bbuild -DCMAKE_BUILD_TYPE=Release \
  -DWASMEDGE_PLUGIN_WASI_NN_BACKEND="BitNet" \
  -DWASMEDGE_PLUGIN_WASI_NN_BITNET_X86_TL2=ON
cmake --build build
```
