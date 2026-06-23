---
sidebar_position: 1
---

# Build with WASI-HTTP Plug-in

The WASI-HTTP plug-in provides an implementation of the [WASI HTTP proposal](https://github.com/WebAssembly/wasi-http), enabling WebAssembly modules to make outbound HTTP requests and handle inbound HTTP connections. It is built on top of [libcpr](https://github.com/libcpr/cpr), a modern C++ HTTP client library.

## Build WasmEdge with WASI-HTTP Plug-in

To enable the WasmEdge WASI-HTTP plug-in, developers need to [build WasmEdge from source](../os/linux.md) with the cmake option `-DWASMEDGE_PLUGIN_WASI_HTTP=ON`.

The build system will automatically fetch and build `libcpr` via CMake's `FetchContent`, so no manual installation of dependencies is required.

```bash
cd <path/to/your/wasmedge/source/folder>
cmake -GNinja -Bbuild -DCMAKE_BUILD_TYPE=Release -DWASMEDGE_PLUGIN_WASI_HTTP=ON
cmake --build build
cmake --install build
```

<!-- prettier-ignore -->
:::note
If the built `wasmedge` CLI tool cannot find the WASI-HTTP plug-in, you can set the `WASMEDGE_PLUGIN_PATH` environment variable to the plug-in installation path (such as `/usr/local/lib/wasmedge/`, or the built plug-in path `build/plugins/wasi_http/`) to try to fix this issue.
:::

Then you will have an executable `wasmedge` runtime under `/usr/local/bin` and the WASI-HTTP plug-in under `/usr/local/lib/wasmedge/libwasmedgePluginWasiHttp.so` after installation.

For more information, you can refer to the [GitHub repository](https://github.com/WasmEdge/WasmEdge/tree/master/plugins/wasi_http).
