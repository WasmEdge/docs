---
sidebar_position: 5
---

# Build WasmEdge With WasmEdge-Tensorflow Plug-in

## Prerequisites

The prerequisites of the WasmEdge-Tensorflow plug-in is the same as the WasmEdge building environment on the [Linux platforms](../os/linux.md) or [MacOS platforms](../os/macos.md).

## Build WasmEdge with WasmEdge-Tensorflow Plug-in

To enable the WasmEdge WasmEdge-Tensorflow, developers need to [building the WasmEdge from source](../build_from_src.md) with the cmake option `-DWASMEDGE_PLUGIN_TENSORFLOW=On`.

```bash
cd <path/to/your/wasmedge/source/folder>
cmake -GNinja -Bbuild -DCMAKE_BUILD_TYPE=Release -DWASMEDGE_PLUGIN_TENSORFLOW=On
cmake --build build
# For the WasmEdge-Tensorflow plug-in, you should install this project.
cmake --install build
```

<!-- prettier-ignore -->
:::note
If the built `wasmedge` CLI tool cannot find the WasmEdge-Tensorflow plug-in, you can set the `WASMEDGE_PLUGIN_PATH` environment variable to the plug-in installation path (such as `/usr/local/lib/wasmedge/`, or the built plug-in path `build/plugins/wasmedge_tensorflow/`) to try to fix this issue.
:::

Then you will have an executable `wasmedge` runtime under `/usr/local/bin` and the WasmEdge-Tensorflow plug-in under `/usr/local/lib/wasmedge/libwasmedgePluginWasmEdgeTensorflow.so` after installation.

## Install the TensorFlow Dependency

Installing the necessary `libtensorflow_cc.so` and `libtensorflow_framework.so` on both `Linux` and `MacOS` platforms, we recommend the following commands:

```bash
curl -s -L -O --remote-name-all https://github.com/second-state/WasmEdge-tensorflow-deps/releases/download/TF-2.12.0-CC/WasmEdge-tensorflow-deps-TF-TF-2.12.0-CC-manylinux2014_x86_64.tar.gz
# For the Linux aarch64 platforms, please use the `WasmEdge-tensorflow-deps-TF-TF-2.12.0-CC-manylinux2014_aarch64.tar.gz`.
# For the MacOS x86_64 platforms, please use the `WasmEdge-tensorflow-deps-TF-TF-2.12.0-CC-darwin_x86_64.tar.gz`.
# For the MacOS arm64 platforms, please use the `WasmEdge-tensorflow-deps-TF-TF-2.12.0-CC-darwin_arm64.tar.gz`.
tar -zxf WasmEdge-tensorflow-deps-TF-TF-2.12.0-CC-manylinux2014_x86_64.tar.gz
rm -f WasmEdge-tensorflow-deps-TF-TF-2.12.0-CC-manylinux2014_x86_64.tar.gz
```

The shared library will be extracted in the current directory `./libtensorflow_cc.so.2.12.0` and `./libtensorflow_framework.so.2.12.0` on `Linux` platforms, or `./libtensorflow_cc.2.12.0.dylib` and `./libtensorflow_framework.2.12.0.dylib` on `MacOS` platforms.

<!-- prettier-ignore -->
:::note
After building the plug-in, you can also find these shared libraries under the `build/_deps/wasmedge_tensorflow_lib_tf-src/` directory.
:::

Then you can move the library to the installation path and create the symbolic link:

```bash
mv libtensorflow_cc.so.2.12.0 /usr/local/lib
mv libtensorflow_framework.so.2.12.0 /usr/local/lib
ln -s libtensorflow_cc.so.2.12.0 /usr/local/lib/libtensorflow_cc.so.2
ln -s libtensorflow_cc.so.2 /usr/local/lib/libtensorflow_cc.so
ln -s libtensorflow_framework.so.2.12.0 /usr/local/lib/libtensorflow_framework.so.2
ln -s libtensorflow_framework.so.2 /usr/local/lib/libtensorflow_framework.so
```

If on `MacOS` platforms:

```bash
mv libtensorflow_cc.2.12.0.dylib /usr/local/lib
mv libtensorflow_framework.2.12.0.dylib /usr/local/lib
ln -s libtensorflow_cc.2.12.0.dylib /usr/local/lib/libtensorflow_cc.2.dylib
ln -s libtensorflow_cc.2.dylib /usr/local/lib/libtensorflow_cc.dylib
ln -s libtensorflow_framework.2.12.0.dylib /usr/local/lib/libtensorflow_framework.2.dylib
ln -s libtensorflow_framework.2.dylib /usr/local/lib/libtensorflow_framework.dylib
```

Or create the symbolic link in the current directory and set the environment variable `export LD_LIBRARY_PATH=$(pwd):${LD_LIBRARY_PATH}`.
