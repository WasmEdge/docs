---
sidebar_position: 2
---

# Build with WASI-nn Plug-in

## Prerequisites

Currently, WasmEdge used OpenVINO™ or PyTorch as the WASI-NN backend implementation. For using WASI-NN on WasmEdge, you need to install [OpenVINO™](https://docs.openvino.ai/2023.0/openvino_docs_install_guides_installing_openvino_apt.html)(2023) or [PyTorch 1.8.2 LTS](https://pytorch.org/get-started/locally/) for the backend.

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
