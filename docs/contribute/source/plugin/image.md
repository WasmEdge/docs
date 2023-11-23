---
sidebar_position: 4
---

# Build WasmEdge With WasmEdge-Image Plug-in

## Prerequisites

The prerequisites of the WasmEdge-Image plug-in is the same as the WasmEdge building environment on the [Linux platforms](../os/linux.md) or [MacOS platforms](../os/macos.md).

If developers build with their own environment, please ensure the `zlib` are installed.

```bash
sudo apt update
sudo apt install zlib1g-dev
```

On MacOS platforms, the `libjpeg` and `libpng` are required.

```bash
brew install jpeg-turbo libpng
```

## Build WasmEdge with WasmEdge-Image Plug-in

To enable the WasmEdge WasmEdge-Image, developers need to [building the WasmEdge from source](../build_from_src.md) with the cmake option `-DWASMEDGE_PLUGIN_IMAGE=On`.

```bash
cd <path/to/your/wasmedge/source/folder>
cmake -GNinja -Bbuild -DCMAKE_BUILD_TYPE=Release -DWASMEDGE_PLUGIN_IMAGE=On
cmake --build build
# For the WasmEdge-Image plug-in, you should install this project.
cmake --install build
```

<!-- prettier-ignore -->
:::note
If the built `wasmedge` CLI tool cannot find the WasmEdge-Image plug-in, you can set the `WASMEDGE_PLUGIN_PATH` environment variable to the plug-in installation path (such as `/usr/local/lib/wasmedge/`, or the built plug-in path `build/plugins/wasmedge_image/`) to try to fix this issue.
:::

Then you will have an executable `wasmedge` runtime under `/usr/local/bin` and the WasmEdge-Image plug-in under `/usr/local/lib/wasmedge/libwasmedgePluginWasmEdgeImage.so` after installation.
