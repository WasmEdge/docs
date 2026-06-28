---
sidebar_position: 12
---

# Build with WasmEdge zlib Plug-in

The WasmEdge zlib plug-in provides zlib compression and decompression functionality to WebAssembly applications running on WasmEdge. It allows Wasm modules that depend on zlib (such as those compiled from C/C++ with zlib linkage) to use the host system's zlib implementation directly.

## Prerequisites

Install zlib development headers on your system.

For Ubuntu:

```bash
sudo apt update
sudo apt install -y zlib1g-dev
```

For macOS:

```bash
brew install zlib
```

## Build WasmEdge with the zlib Plug-in

To enable the WasmEdge zlib plug-in, developers need to [build WasmEdge from source](../build_from_src.md) with the cmake option `-DWASMEDGE_PLUGIN_ZLIB=ON`.

```bash
cd <path/to/your/wasmedge/source/folder>
cmake -GNinja -Bbuild -DCMAKE_BUILD_TYPE=Release -DWASMEDGE_PLUGIN_ZLIB=ON
cmake --build build
cmake --install build
```

<!-- prettier-ignore -->
:::note
If the built `wasmedge` CLI tool cannot find the zlib plug-in, you can set the `WASMEDGE_PLUGIN_PATH` environment variable to the plug-in installation path (such as `/usr/local/lib/wasmedge/`, or the built plug-in path `build/plugins/wasmedge_zlib/`) to try to fix this issue.
:::

Then you will have an executable `wasmedge` runtime under `/usr/local/bin` and the zlib plug-in under `/usr/local/lib/wasmedge/libwasmedgePluginWasmEdgeZlib.so` after installation.

For more information, you can refer to the [GitHub repository](https://github.com/WasmEdge/WasmEdge/tree/master/plugins/wasmedge_zlib).
