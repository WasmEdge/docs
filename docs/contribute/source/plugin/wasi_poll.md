---
sidebar_position: 2
---

# Build with WASI-Poll Plug-in

The WASI-Poll plug-in provides an implementation of the [WASI Poll proposal](https://github.com/WebAssembly/wasi-poll), which enables WebAssembly modules to perform I/O multiplexing — waiting on multiple I/O events simultaneously. This is essential for building efficient, event-driven WebAssembly applications on the WasmEdge runtime.

## Build WasmEdge with WASI-Poll Plug-in

To enable the WasmEdge WASI-Poll plug-in, developers need to [build WasmEdge from source](../os/linux.md) with the cmake option `-DWASMEDGE_PLUGIN_WASI_POLL=ON`.

The WASI-Poll plug-in has no external dependencies beyond the WasmEdge runtime itself.

```bash
cd <path/to/your/wasmedge/source/folder>
cmake -GNinja -Bbuild -DCMAKE_BUILD_TYPE=Release -DWASMEDGE_PLUGIN_WASI_POLL=ON
cmake --build build
cmake --install build
```

<!-- prettier-ignore -->
:::note
If the built `wasmedge` CLI tool cannot find the WASI-Poll plug-in, you can set the `WASMEDGE_PLUGIN_PATH` environment variable to the plug-in installation path (such as `/usr/local/lib/wasmedge/`, or the built plug-in path `build/plugins/wasi_poll/`) to try to fix this issue.
:::

Then you will have an executable `wasmedge` runtime under `/usr/local/bin` and the WASI-Poll plug-in under `/usr/local/lib/wasmedge/libwasmedgePluginWasiPoll.so` after installation.

For more information, you can refer to the [GitHub repository](https://github.com/WasmEdge/WasmEdge/tree/master/plugins/wasi_poll).
