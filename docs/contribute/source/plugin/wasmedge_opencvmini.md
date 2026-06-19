---
sidebar_position: 6
---

# Build with WasmEdge-OpenCVMini Plug-in

The WasmEdge-OpenCVMini plug-in exposes a subset of [OpenCV](https://opencv.org/) image processing functions to WebAssembly applications running on WasmEdge. It is designed for AI input/output pre- and post-processing tasks such as image resizing, color conversion, and basic transformations.

## Prerequisites

Install OpenCV 4 on your system.

For Ubuntu 20.04:

```bash
sudo apt update
sudo apt install -y libopencv-dev
```

For macOS:

```bash
brew install opencv
```

## Build WasmEdge with WasmEdge-OpenCVMini Plug-in

To enable the WasmEdge-OpenCVMini plug-in, developers need to [build WasmEdge from source](../os/linux.md) with the cmake option `-DWASMEDGE_PLUGIN_OPENCVMINI=ON`.

```bash
cd <path/to/your/wasmedge/source/folder>
cmake -GNinja -Bbuild -DCMAKE_BUILD_TYPE=Release -DWASMEDGE_PLUGIN_OPENCVMINI=ON
cmake --build build
cmake --install build
```

:::note
If the built `wasmedge` CLI tool cannot find the WasmEdge-OpenCVMini plug-in, you can set the `WASMEDGE_PLUGIN_PATH` environment variable to the plug-in installation path (such as `/usr/local/lib/wasmedge/`, or the built plug-in path `build/plugins/wasmedge_opencvmini/`) to try to fix this issue.
:::

Then you will have an executable `wasmedge` runtime under `/usr/local/bin` and the WasmEdge-OpenCVMini plug-in under `/usr/local/lib/wasmedge/libwasmedgePluginWasmEdgeOpenCVMini.so` after installation.

For more information, you can refer to the [GitHub repository](https://github.com/WasmEdge/WasmEdge/tree/master/plugins/wasmedge_opencvmini).
