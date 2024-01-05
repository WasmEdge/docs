---
sidebar_position: 2
---

# Build with WASI-nn Plug-in

The WASI-NN plug-in is a proposed WebAssembly System Interface (WASI) API for machine learning. It allows WebAssembly programs to access host-provided machine learning functions.

## Prerequisites

Currently, WasmEdge used OpenVINO™, PyTorch, TensorFlow Lite, or llama.cpp as the WASI-NN backend implementation. For using WASI-NN on WasmEdge, you need to install [OpenVINO™](https://docs.openvino.ai/2023.0/openvino_docs_install_guides_installing_openvino_apt.html)(2023), [TensorFlow Lite](https://www.tensorflow.org/install/lang_c), or [PyTorch 1.8.2 LTS](https://pytorch.org/get-started/locally/) for the backend.

By default, we don't enable any WASI-NN backend in WasmEdge. Therefore developers should [build the WasmEdge from source](../os/linux.md) with the cmake option `WASMEDGE_PLUGIN_WASI_NN_BACKEND` to enable the backends.

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
# For the WASI-NN plug-in, you should install this project.
cmake --install build
```

<!-- prettier-ignore -->
:::note
If the built `wasmedge` CLI tool cannot find the WASI-NN plug-in, you can set the `WASMEDGE_PLUGIN_PATH` environment variable to the plug-in installation path (such as `/usr/local/lib/wasmedge/`, or the built plug-in path `build/plugins/wasi_nn/`) to try to fix this issue.
:::

Then you will have an executable `wasmedge` runtime under `/usr/local/bin` and the WASI-NN with OpenVINO backend plug-in under `/usr/local/lib/wasmedge/libwasmedgePluginWasiNN.so` after installation.

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
# For the WASI-NN plug-in, you should install this project.
cmake --install build
```

<!-- prettier-ignore -->
:::note
If the built `wasmedge` CLI tool cannot find the WASI-NN plug-in, you can set the `WASMEDGE_PLUGIN_PATH` environment variable to the plug-in installation path (such as `/usr/local/lib/wasmedge/`, or the built plug-in path `build/plugins/wasi_nn/`) to try to fix this issue.
:::

Then you will have an executable `wasmedge` runtime under `/usr/local/bin` and the WASI-NN with PyTorch backend plug-in under `/usr/local/lib/wasmedge/libwasmedgePluginWasiNN.so` after installation.

## Build WasmEdge with WASI-NN TensorFlow-Lite Backend

You can build and install WasmEdge from source directly (on `Linux x86_64`, `Linux aarch64`, `MacOS x86_64`, or `MacOS arm64` platforms):

```bash
cd <path/to/your/wasmedge/source/folder>
cmake -GNinja -Bbuild -DCMAKE_BUILD_TYPE=Release -DWASMEDGE_PLUGIN_WASI_NN_BACKEND="TensorflowLite"
cmake --build build
# For the WASI-NN plug-in, you should install this project.
cmake --install build
```

<!-- prettier-ignore -->
:::note
If the built `wasmedge` CLI tool cannot find the WASI-NN plug-in, you can set the `WASMEDGE_PLUGIN_PATH` environment variable to the plug-in installation path (such as `/usr/local/lib/wasmedge/`, or the built plug-in path `build/plugins/wasi_nn/`) to try to fix this issue.
:::

Then you will have an executable `wasmedge` runtime under `/usr/local/bin` and the WASI-NN with TensorFlow-lite backend plug-in under `/usr/local/lib/wasmedge/libwasmedgePluginWasiNN.so` after installation.

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

### macOS

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
# For the WASI-NN plugin, you should install this project.
cmake --install build
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
# For the WASI-NN plugin, you should install this project.
cmake --install build
```

### Linux

#### Ubuntu/Debian with CUDA 12

Please follow the official guide provided by NVIDIA for installing the CUDA framework: https://developer.nvidia.com/cuda-12-2-0-download-archive

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

# For the WASI-NN plugin, you should install this project.
cmake --install build
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

# For the WASI-NN plugin, you should install this project.
cmake --install build
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

# For the WASI-NN plugin, you should install this project.
cmake --install build
```

#### General Linux without any acceleration framework

```bash
cd <path/to/your/wasmedge/source/folder>

cmake -GNinja -Bbuild -DCMAKE_BUILD_TYPE=Release \
  -DWASMEDGE_PLUGIN_WASI_NN_BACKEND="GGML" \
  -DWASMEDGE_PLUGIN_WASI_NN_GGML_LLAMA_BLAS=OFF \
  .

cmake --build build

# For the WASI-NN plugin, you should install this project.
cmake --install build
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
# For the WASI-NN plugin, you should install this project.
cmake --install build
```

### Appendix

<!-- prettier-ignore -->
:::note
If the built `wasmedge` CLI tool cannot find the WASI-NN plugin, you can set the `WASMEDGE_PLUGIN_PATH` environment variable to the plugin installation path (such as `/usr/local/lib/wasmedge/` or the built plugin path `build/plugins/wasi_nn/`) to try to fix this issue.
:::

<!-- prettier-ignore -->
:::note
We also provided the pre-built ggml plugins on the following platforms:
- darwin\_x86\_64: Intel Model macOS
- darwin\_arm64: Apple Silicon Model macOS
- ubuntu20.04\_x86\_64: x86\_64 Linux (the glibc is using Ubuntu20.04 one)
- ubuntu20.04\_aarch64: aarch64 Linux (the glibc is using Ubuntu20.04 one)
- ubuntu20.04\_blas\_x86\_64: x86\_64 Linux with OpenBLAS support (the glibc is using Ubuntu20.04 one)
- ubuntu20.04\_blas\_aarch64: aarch64 Linux with OpenBLAS support (the glibc is using Ubuntu20.04 one)
- ubuntu20.04\_cuda\_x86\_64: x86\_64 Linux with CUDA 12 support (the glibc is using Ubuntu20.04 one)
- ubuntu20.04\_cuda\_aarch64: aarch64 Linux with CUDA 11 support (the glibc is using Ubuntu20.04 one), for NVIDIA Jetson AGX Orin
- manylinux2014\_x86\_64: x86\_64 Linux (the glibc is using CentOS 7 one)
- manylinux2014\_aarch64: aarch64 Linux (the glibc is using CentOS 7 one)
:::
