---
sidebar_position: 3
---

# Build WasmEdge With WasmEdge-Process Plug-in

The WasmEdge Process plug-in provides a sandboxed environment to execute system processes in a secured manner. This guide will walk you through the steps to build the WasmEdge Process plug-in.

## Prerequisites

The prerequisites of the WasmEdge-Process plug-in is the same as the [WasmEdge building environment on the Linux platforms](../os/linux.md).

## Build WasmEdge with WasmEdge-Process Plug-in

To enable the WasmEdge WasmEdge-Process, developers need to [building the WasmEdge from source](../build_from_src.md) with the cmake option `-DWASMEDGE_PLUGIN_PROCESS=On`.

```bash
cd <path/to/your/wasmedge/source/folder>
cmake -GNinja -Bbuild -DCMAKE_BUILD_TYPE=Release -DWASMEDGE_PLUGIN_PROCESS=On
cmake --build build
# For the WasmEdge-Process plug-in, you should install this project.
cmake --install build
```

<!-- prettier-ignore -->
:::note
If the built `wasmedge` CLI tool cannot find the WasmEdge-Process plug-in, you can set the `WASMEDGE_PLUGIN_PATH` environment variable to the plug-in installation path (such as `/usr/local/lib/wasmedge/`, or the built plug-in path `build/plugins/wasmedge_process/`) to try to fix this issue.
:::

Then you will have an executable `wasmedge` runtime under `/usr/local/bin` and the WasmEdge-Process plug-in under `/usr/local/lib/wasmedge/libwasmedgePluginWasmEdgeProcess.so` after installation.

## Usage

To use the plug-in with WasmEdge, you need to specify it when starting the WasmEdge runtime:

```bash
wasmedge --dir .:. --reactor --process_plugin target/release/libwasmedge_process.so your_wasm_file.wasm
```

Replace `your_wasm_file.wasm` with the path to your WebAssembly file. The `--process_plugin`flag specifies the path to the Process plug-in.

That's it! You have successfully built and installed the WasmEdge Process plug-in.

For more information, you can refer to the [GitHub repository](https://github.com/WasmEdge/WasmEdge/tree/master/plugins/wasmedge_process).
