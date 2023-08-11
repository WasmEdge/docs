---
sidebar_position: 6
---

# Build WasmEdge With WasmEdge-TensorflowLite Plug-in

## Prerequisites

The prerequisites of the WasmEdge-TensorflowLite plug-in is the same as the WasmEdge building environment on the [Linux platforms](../os/linux.md) or [MacOS platforms](../os/macos.md).

## Build WasmEdge with WasmEdge-TensorflowLite Plug-in

To enable the WasmEdge WasmEdge-TensorflowLite, developers need to [building the WasmEdge from source](../build_from_src.md) with the cmake option `-DWASMEDGE_PLUGIN_TENSORFLOWLITE=On`.

```bash
cd <path/to/your/wasmedge/source/folder>
cmake -GNinja -Bbuild -DCMAKE_BUILD_TYPE=Release -DWASMEDGE_PLUGIN_TENSORFLOWLITE=On
cmake --build build
# For the WasmEdge-TensorflowLite plug-in, you should install this project.
cmake --install build
```

<!-- prettier-ignore -->
:::note
If the built `wasmedge` CLI tool cannot find the WasmEdge-TensorflowLite plug-in, you can set the `WASMEDGE_PLUGIN_PATH` environment variable to the plug-in installation path (such as `/usr/local/lib/wasmedge/`, or the built plug-in path `build/plugins/wasmedge_tensorflowlite/`) to try to fix this issue.
:::

Then you will have an executable `wasmedge` runtime under `/usr/local/bin` and the WasmEdge-TensorflowLite plug-in under `/usr/local/lib/wasmedge/libwasmedgePluginWasmEdgeTensorflowLite.so` after installation.

## Install the TensorFlowLite Dependency

Installing the necessary `libtensorflowlite_c.so` and `libtensorflowlite_flex.so` on both `Linux` and `MacOS` platforms, we recommend the following commands:

```bash
curl -s -L -O --remote-name-all https://github.com/second-state/WasmEdge-tensorflow-deps/releases/download/TF-2.12.0-CC/WasmEdge-tensorflow-deps-TFLite-TF-2.12.0-CC-manylinux2014_x86_64.tar.gz
# For the Linux aarch64 platforms, please use the `WasmEdge-tensorflow-deps-TFLite-TF-2.12.0-CC-manylinux2014_aarch64.tar.gz`.
# For the MacOS x86_64 platforms, please use the `WasmEdge-tensorflow-deps-TFLite-TF-2.12.0-CC-darwin_x86_64.tar.gz`.
# For the MacOS arm64 platforms, please use the `WasmEdge-tensorflow-deps-TFLite-TF-2.12.0-CC-darwin_arm64.tar.gz`.
tar -zxf WasmEdge-tensorflow-deps-TFLite-TF-2.12.0-CC-manylinux2014_x86_64.tar.gz
rm -f WasmEdge-tensorflow-deps-TFLite-TF-2.12.0-CC-manylinux2014_x86_64.tar.gz
```

The shared library will be extracted in the current directory `./libtensorflowlite_c.so` and `./libtensorflowlite_flex.so` on `Linux` platforms, or `./libtensorflowlite_c.dylib` and `./libtensorflowlite_flex.dylib` on `MacOS` platforms.

<!-- prettier-ignore -->
:::note
After building the plug-in, you can also find these shared libraries under the `build/_deps/wasmedge_tensorflow_lib_tflite-src/` directory.
:::

Then you can move the library to the installation path:

```bash
mv libtensorflowlite_c.so /usr/local/lib
mv libtensorflowlite_flex.so /usr/local/lib
```

If on `MacOS` platforms:

```bash
mv libtensorflowlite_c.dylib /usr/local/lib
mv libtensorflowlite_flex.dylib /usr/local/lib
```

Or set the environment variable `export LD_LIBRARY_PATH=$(pwd):${LD_LIBRARY_PATH}`.
