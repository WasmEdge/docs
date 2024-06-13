---
sidebar_position: 1
---

# Build WasmEdge With WASI-Logging Plug-in

WASI-Logging allows WebAssembly applications to log messages in a standardized way. This becomes particularly helpful when debugging applications or understanding the flow of execution within them. The WASI-Logging plug-in is designed to be straightforward to use, enabling developers to focus more on their application logic and less on logging mechanics.

## Prerequisites

The prerequisite of the Wasi-Logging plug-in is the same as the WasmEdge building environment on the [Linux](../os/linux.md) and [MacOS](../os/macos.md) platforms.

## Build WasmEdge with WASI-Logging Plug-in

To enable the WASI-Logging Plug-in, developers need to build the WasmEdge from source with the cmake option `-DWASMEDGE_PLUGIN_WASI_LOGGING=ON`.

```bash
cd <path/to/your/wasmedge/source/folder>
mkdir -p build && cd build
cmake -DCMAKE_BUILD_TYPE=Release -DWASMEDGE_PLUGIN_WASI_LOGGING=ON .. && make -j
# For the WASI-Logging plug-in, you should install this project.
cmake --install .
```

<!-- prettier-ignore -->
:::note
If the built `wasmedge` CLI tool cannot find the WASI-Logging plug-in, you can set the `WASMEDGE_PLUGIN_PATH` environment variable to the plug-in installation path (`/usr/local/lib/wasmedge`, or the built plug-in path `build/plugins/wasi_logging`) to try to fix this issue. You should find `libwasmedgePluginWasiLogging.so` in your `WASMEDGE_PLUGIN_PATH`
:::

Then you will have an executable `wasmedge` runtime under `/usr/local/bin` and the WASI-Logging plugin under `/usr/local/lib/wasmedge/libwasmedgePluginWasiLogging.so` after installation.

## Loading WASI-Logging Plug-in

If the built `wasmedge` CLI tool cannot find the WASI-Logging plug-in, set the `WASMEDGE_PLUGIN_PATH` environment variable to the plug-in installation path (such as `/usr/local/lib/wasmedge/`, or the built plug-in path `build/plugins/wasi_logging/`) to resolve this issue 1.

After installation, the `wasmedge` runtime will be located under `/usr/local/bin` and the WASI-Logging plug-in under `/usr/local/lib/wasmedge/libwasmedgePluginWasiLogging.so`.

## Using WASI-Logging in Your Applications

You can use the WASI-Logging plug-in in your WebAssembly applications to log messages in a standardized way.

For more information, you can refer to the [GitHub repository](https://github.com/WasmEdge/WasmEdge/tree/master/examples/plugin/wasi-logging).
