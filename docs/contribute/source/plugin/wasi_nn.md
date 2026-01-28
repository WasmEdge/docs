---
sidebar_position: 2
---

# Build with WASI-NN Plug-in

The WASI-NN plug-in is a proposed WebAssembly System Interface (WASI) API for machine learning. It allows WebAssembly programs to access host-provided machine learning functions.

## Prerequisites

Currently, WasmEdge supports following backends for WASI-NN proposal:

| Backend | Dependency | CMake Option |
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

Developers can [build the WasmEdge from source](../os/linux.md) with the cmake option `WASMEDGE_PLUGIN_WASI_NN_BACKEND` to enable the backends. For supporting multiple backends, developers can assign the option such as `-DWASMEDGE_PLUGIN_WASI_NN_BACKEND="GGML;Whisper;TensorFlowLite"`.

After building, you will have the WASI-NN with specified backend(s) plug-in shared library under `<YOUR_BUILD_FOLDER>/plugins/wasi_nn/libwasmedgePluginWasiNN.so` (or `.dylib` extension on MacOS).

<!-- prettier-ignore -->
:::note
If the `wasmedge` CLI tool cannot find the WASI-NN plug-in, you can set the `WASMEDGE_PLUGIN_PATH` environment variable to the plug-in installation path (such as `/usr/local/lib/wasmedge/`, or the built plug-in path `build/plugins/wasi_nn/`) to try to fix this issue.
:::

For the `Burn.rs` backend, please use the cmake option `WASMEDGE_PLUGIN_WASI_NN_BURNRS_MODEL` to assign the model.

| Model for `Burn.rs` backend | CMake Option |
|-------|--------------|
| Squeezenet | `-WASMEDGE_PLUGIN_WASI_NN_BURNRS_MODEL=Squeezenet` |
| Whisper | `-WASMEDGE_PLUGIN_WASI_NN_BURNRS_MODEL=Whisper` |

After building, you will have the WASI-NN with specified backend(s) plug-in shared library under `<YOUR_BUILD_FOLDER>/plugins/wasi_nn_burnrs/libwasmedgePluginWasiNN.so` (or `.dylib` extension on MacOS).

<!-- prettier-ignore -->
:::note
The `WASI-NN Burn.rs` backend cannot build with other backends.
:::

## Build WasmEdge with WASI-NN OpenVINO Backend

For choosing and installing OpenVINO™ on `Ubuntu 20.04` for the backend, we recommend the following commands:

```bash
wget https://apt.repos.intel.com/intel-gpg-keys/GPG-PUB-KEY-INTEL-SW-PRODUCTS.PUB
sudo apt-key add GPG-PUB-KEY-INTEL-SW-PRODUCTS.PUB
echo "deb https://apt.repos.intel.com/openvino/2023 ubuntu20 main" | sudo tee /etc/apt/sources.list.d/intel-openvino-2023.list
sudo apt update
sudo apt-get -y install openvino
ldconfig
```

Then build and install WasmEdge from source:

```bash
cd <path/to/your/wasmedge/source/folder>
cmake -GNinja -Bbuild -DCMAKE_BUILD_TYPE=Release -DWASMEDGE_PLUGIN_WASI_NN_BACKEND="OpenVINO"
cmake --build build
```

## Build WasmEdge with WASI-NN PyTorch Backend

For choosing and installing PyTorch on `Ubuntu 20.04` for the backend, we recommend the following commands:

```bash
export PYTORCH_VERSION="1.8.2"
curl -s -L -O --remote-name-all https://download.pytorch.org/libtorch/lts/1.8/cpu/libtorch-cxx11-abi-shared-with-deps-${PYTORCH_VERSION}%2Bcpu.zip
unzip -q "libtorch-cxx11-abi-shared-with-deps-${PYTORCH_VERSION}%2Bcpu.zip"
rm -f "libtorch-cxx11-abi-shared-with-deps-${PYTORCH_VERSION}%2Bcpu.zip"
export LD_LIBRARY_PATH=$(pwd)/libtorch/lib:${LD_LIBRARY_PATH}
export Torch_DIR=$(pwd)/libtorch
```

For the legacy operating system such as `CentOS 7.6`, please use the `pre-cxx11-abi` version of `libtorch` instead:

```bash
export PYTORCH_VERSION="1.8.2"
curl -s -L -O --remote-name-all https://download.pytorch.org/libtorch/lts/1.8/cpu/libtorch-shared-with-deps-${PYTORCH_VERSION}%2Bcpu.zip
unzip -q "libtorch-shared-with-deps-${PYTORCH_VERSION}%2Bcpu.zip"
rm -f "libtorch-shared-with-deps-${PYTORCH_VERSION}%2Bcpu.zip"
export LD_LIBRARY_PATH=$(pwd)/libtorch/lib:${LD_LIBRARY_PATH}
export Torch_DIR=$(pwd)/libtorch
```

The PyTorch library will be extracted in the current directory `./libtorch`.

Then build and install WasmEdge from source:

```bash
cd <path/to/your/wasmedge/source/folder>
cmake -GNinja -Bbuild -DCMAKE_BUILD_TYPE=Release -DWASMEDGE_PLUGIN_WASI_NN_BACKEND="PyTorch"
cmake --build build
```

## Build WasmEdge with WASI-NN TensorFlow-Lite Backend

You can build and install WasmEdge from source directly (on `Linux x86_64`, `Linux aarch64`, `MacOS x86_64`, or `MacOS arm64` platforms):

```bash
cd <path/to/your/wasmedge/source/folder>
cmake -GNinja -Bbuild -DCMAKE_BUILD_TYPE=Release -DWASMEDGE_PLUGIN_WASI_NN_BACKEND="TensorflowLite"
cmake --build build
```

Installing the necessary `libtensorflowlite_c.so` and `libtensorflowlite_flex.so` on both `Ubuntu 20.04` and `manylinux2014` for the backend, we recommend the following commands:

```bash
curl -s -L -O --remote-name-all https://github.com/second-state/WasmEdge-tensorflow-deps/releases/download/TF-2.12.0-CC/WasmEdge-tensorflow-deps-TFLite-TF-2.12.0-CC-manylinux2014_x86_64.tar.gz
tar -zxf WasmEdge-tensorflow-deps-TFLite-TF-2.12.0-CC-manylinux2014_x86_64.tar.gz
rm -f WasmEdge-tensorflow-deps-TFLite-TF-2.12.0-CC-manylinux2014_x86_64.tar.gz
```

The shared library will be extracted in the current directory `./libtensorflowlite_c.so` and `./libtensorflowlite_flex.so`.

Then you can move the library to the installation path:

```bash
mv libtensorflowlite_c.so /usr/local/lib
mv libtensorflowlite_flex.so /usr/local/lib
```

Or set the environment variable `export LD_LIBRARY_PATH=$(pwd):${LD_LIBRARY_PATH}`.

<!-- prettier-ignore -->
:::note
We also provided the `darwin_x86_64`, `darwin_arm64`, and `manylinux_aarch64` versions of the TensorFlow-Lite pre-built shared libraries.
:::

For more information, you can refer to the [GitHub repository](https://github.com/WasmEdge/WasmEdge/tree/master/plugins/wasi_nn).

## Build WasmEdge with WASI-NN llama.cpp Backend

You don't need to install any llama.cpp libraries. WasmEdge will download it during the building period.

Due to the acceleration frameworks being various, you will need to use different compilation options to build this plugin. Please make sure you are following the same OS section to do this.

### Build with llama.cpp Backend on MacOS

#### Intel Model

If you are using the Intel Model macOS, we won't enable any acceleration framework. It is a pure CPU mode plugin.

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

#### Apple Silicon Model

You can build and install WasmEdge from source directly on the macOS arm64 platform. It will use the built-in GPU by default.

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

### Build with llama.cpp Backend on Linux

#### Ubuntu/Debian with CUDA 12

Please follow the official guide provided by NVIDIA for installing the CUDA framework: <https://developer.nvidia.com/cuda-12-2-0-download-archive>

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

#### Ubuntu on NVIDIA Jetson AGX Orin

You should use the pre-built OS image from the NVIDIA official site.

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

#### Ubuntu/Debian with OpenBLAS

Please install OpenBLAS before building the plugin.

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

#### General Linux without any acceleration framework

```bash
cd <path/to/your/wasmedge/source/folder>

cmake -GNinja -Bbuild -DCMAKE_BUILD_TYPE=Release \
  -DWASMEDGE_PLUGIN_WASI_NN_BACKEND="GGML" \
  -DWASMEDGE_PLUGIN_WASI_NN_GGML_LLAMA_BLAS=OFF \
  .

cmake --build build
```

### Build with llama.cpp Backend on Windows

#### Install Dependencies for llama.cpp And Build on Windows

Developers can follow the steps for installing the requested dependencies.

1. (Optional, skip this deps if you don't need to use GPU) Download and install CUDA toolkit
    - We use CUDA Toolkit 12 for the release assets
    - Link: <https://developer.nvidia.com/cuda-downloads?target_os=Windows&target_arch=x86_64&target_version=11&target_type=exe_local>

2. Download and install Visual Studio 2022 Community Edition
    - Link: <https://visualstudio.microsoft.com/vs/community/>
    - Select the following components in the installer:
        - msvc v143 - vs 2022 c++ x64/x86 build tools (latest)
        - windows 11 sdk (10.0.22621.0)
        - C++ ATL for v143 build tools (x86 & x64)

3. Download and install cmake
    - We use cmake 3.29.3 for the release assets
    - Link: <https://github.com/Kitware/CMake/releases/download/v3.29.3/cmake-3.29.3-windows-x86_64.msi>

4. Download and install git
    - We use git 2.45.1
    - Link: <https://github.com/git-for-windows/git/releases/download/v2.45.1.windows.1/Git-2.45.1-64-bit.exe>

5. Download and install ninja-build
    - We use ninja-build 1.12.1
    - Link: <https://github.com/ninja-build/ninja/releases/download/v1.12.1/ninja-win.zip>
    - Installation: just unzip it to a custom folder

Then developers can build by following the steps.

1. Open Developer PowerShell for VS 2022
    - Start -> Visual Studio 2022 -> Visual Studio Tools -> Developer PowerShell for VS 2022

2. Inside the PowerShell, use git to download wasmedge repo

    ```console
    cd $HOME
    git clone https://github.com/WasmEdge/WasmEdge.git
    cd WasmEdge
    ```

3. Compile wasmedge with enabling the `wasi_nn_ggml` related options, please use the following commands. To build the plugin, you don't need to enable AOT/LLVM related features, so set them to OFF.

   - If you want to enable CUDA:

      ```console
      # CUDA ENABLE:
      & "C:\Program files\CMake\bin\cmake.exe" -Bbuild -GNinja -DCMAKE_BUILD_TYPE=Release -DWASMEDGE_PLUGIN_WASI_NN_BACKEND=ggml -DWASMEDGE_PLUGIN_WASI_NN_GGML_LLAMA_CUBLAS=ON -DWASMEDGE_USE_LLVM=OFF .
      & "<the ninja-build folder>\ninja.exe" -C build
      ```

   - If you want to disable CUDA:

      ```console
      # CUDA DISABLE:
      & "C:\Program files\CMake\bin\cmake.exe" -Bbuild -GNinja -DCMAKE_BUILD_TYPE=Release -DWASMEDGE_PLUGIN_WASI_NN_BACKEND=ggml -DWASMEDGE_USE_LLVM=OFF .
      & "<the ninja-build folder>\ninja.exe" -C build
      ```

   - If you want to enable HIP (AMD GPU):

      ```console
      # HIP ENABLE:
      & "C:\Program files\CMake\bin\cmake.exe" -Bbuild -GNinja -DCMAKE_BUILD_TYPE=Release -DWASMEDGE_PLUGIN_WASI_NN_BACKEND=ggml -DWASMEDGE_PLUGIN_WASI_NN_GGML_LLAMA_HIP=ON -DWASMEDGE_USE_LLVM=OFF .
      & "<the ninja-build folder>\ninja.exe" -C build
      ```

#### Execute the WASI-NN plugin with the llama example on Windows

1. Set the environment variables

    ```console
    $env:PATH += ";$pwd\build\lib\api"
    $env:WASMEDGE_PLUGIN_PATH = "$pwd\build\plugins"
    ```

2. Download the wasm and run

    ```console
    wget https://github.com/second-state/WasmEdge-WASINN-examples/raw/master/wasmedge-ggml/llama/wasmedge-ggml-llama.wasm
    wget https://huggingface.co/QuantFactory/Meta-Llama-3-8B-Instruct-GGUF/blob/main/Meta-Llama-3-8B-Instruct.Q5_K_M.gguf
    wasmedge --dir .:. --env llama3=true --env n_gpu_layers=100 --nn-preload default:GGML:AUTO:Meta-Llama-3-8B-Instruct.Q5_K_M.gguf wasmedge-ggml-llama.wasm default
    ```

#### Troubleshooting: AMD Radeon Integrated Graphics (Windows)

If you are building the GGML backend on Windows with an integrated AMD GPU (e.g., Radeon 780M / gfx1103) and encounter `rocBLAS` or initialization errors, you may need the following workarounds:

1. **Set the Architecture Override:**
   The RDNA 3 integrated graphics require an override to match the available ROCm kernels.
   ```console
   $env:HSA_OVERRIDE_GFX_VERSION = "11.0.0"
   ```

2. **Manual Library Linking (ROCm 6.x):** The ROCm installer on Windows may not create the necessary symlinks for `gfx1103`. If you see errors related to missing `TensileLibrary` files:

   * Navigate to your ROCm installation folder (e.g., `C:\Program Files\AMD\ROCm\6.x\bin\rocblas\library`).
   * Copy the `gfx1100` files and rename them to `gfx1103`.
     * Example: Copy `TensileLibrary_lazy_gfx1100.dat` -> `TensileLibrary_lazy_gfx1103.dat`

### Appendix for llama.cpp backend

We also provided the pre-built ggml plugins on the following platforms:

- darwin\_x86\_64: Intel Model macOS
- darwin\_arm64: Apple Silicon Model macOS
- ubuntu20.04\_x86\_64: x86\_64 Linux (the glibc is using Ubuntu20.04 one)
- ubuntu20.04\_aarch64: aarch64 Linux (the glibc is using Ubuntu20.04 one)
- ubuntu20.04\_cuda\_x86\_64: x86\_64 Linux with CUDA 12 support (the glibc is using Ubuntu20.04 one)
- ubuntu20.04\_cuda\_aarch64: aarch64 Linux with CUDA 11 support (the glibc is using Ubuntu20.04 one), for NVIDIA Jetson AGX Orin
- manylinux2014\_x86\_64: x86\_64 Linux (the glibc is using CentOS 7 one)
- manylinux2014\_aarch64: aarch64 Linux (the glibc is using CentOS 7 one)

## Build WasmEdge with WASI-NN Piper Backend

Build and install WasmEdge from source:

```bash
cd <path/to/your/wasmedge/source/folder>
cmake -GNinja -Bbuild -DCMAKE_BUILD_TYPE=Release -DWASMEDGE_PLUGIN_WASI_NN_BACKEND="Piper"
cmake --build build
```

## Build WasmEdge with WASI-NN Whisper Backend

Build and install WasmEdge from source:

```bash
cd <path/to/your/wasmedge/source/folder>
cmake -GNinja -Bbuild -DCMAKE_BUILD_TYPE=Release -DWASMEDGE_PLUGIN_WASI_NN_BACKEND="Whisper"
cmake --build build
```

## Build WasmEdge with WASI-NN ChatTTS Backend

The ChatTTS backend relies on ChatTTS and Python library, we recommend the following commands to install dependencies.

```bash
sudo apt update
sudo apt upgrade
sudo apt install python3-dev
pip install chattts==0.1.1
```

Then build and install WasmEdge from source:

``` bash
cd <path/to/your/wasmedge/source/folder>

cmake -GNinja -Bbuild -DCMAKE_BUILD_TYPE=Release -DWASMEDGE_PLUGIN_WASI_NN_BACKEND="chatTTS"
cmake --build build
```

## Build WasmEdge with WASI-NN MLX Backend

You can directly build and install WasmEdge from source or custom install mlx and set `CMAKE_INSTALL_PREFIX` variable.

Build and install WasmEdge from source:

``` bash
cd <path/to/your/wasmedge/source/folder>

cmake -GNinja -Bbuild -DCMAKE_BUILD_TYPE=Release -DWASMEDGE_PLUGIN_WASI_NN_BACKEND="mlx"
cmake --build build
```

## Build WasmEdge with WASI-NN BitNet Backend

To build this backend, exactly one of the following target-level (TL) optimization flags must be enabled. Enabling both flags simultaneously is not supported and will result in a build failure. If these specific optimizations are not required, we recommend using the `GGML` backend with `llama.cpp` for broader compatibility.


### Build for ARM with TL1 Optimization

For ARM-based systems, use the `WASMEDGE_PLUGIN_WASI_NN_BITNET_ARM_TL1` flag. 

```bash
cd <path/to/your/wasmedge/source/folder>
cmake -GNinja -Bbuild -DCMAKE_BUILD_TYPE=Release \
  -DWASMEDGE_PLUGIN_WASI_NN_BACKEND="BitNet" \
  -DWASMEDGE_PLUGIN_WASI_NN_BITNET_ARM_TL1=ON
cmake --build build
```

### Build for x86 with TL2 Optimization

For x86-based systems, use the `WASMEDGE_PLUGIN_WASI_NN_BITNET_X86_TL2` flag.

```bash
cd <path/to/your/wasmedge/source/folder>
cmake -GNinja -Bbuild -DCMAKE_BUILD_TYPE=Release \
  -DWASMEDGE_PLUGIN_WASI_NN_BACKEND="BitNet" \
  -DWASMEDGE_PLUGIN_WASI_NN_BITNET_X86_TL2=ON
cmake --build build
```