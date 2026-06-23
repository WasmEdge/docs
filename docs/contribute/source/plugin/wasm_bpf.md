---
sidebar_position: 3
---

# Build with Wasm-BPF Plug-in

The Wasm-BPF plug-in allows WebAssembly programs to interact with [eBPF](https://ebpf.io/) programs running in the Linux kernel. This enables use cases such as network monitoring, performance tracing, and security enforcement from within a WebAssembly module running on WasmEdge.

## Prerequisites

The Wasm-BPF plug-in requires `libbpf >= 1.2.0`, `libelf`, and `zlib`. On Ubuntu 20.04:

```bash
sudo apt update
sudo apt install -y libbpf-dev libelf-dev zlib1g-dev
```

<!-- prettier-ignore -->
:::note
If `libbpf >= 1.2.0` is not available through your package manager, the build system will automatically download and build it from source via `FetchContent`. In that case, you still need `libelf` and `zlib` installed.
:::

## Build WasmEdge with Wasm-BPF Plug-in

To enable the WasmEdge Wasm-BPF plug-in, developers need to [build WasmEdge from source](../os/linux.md) with the cmake option `-DWASMEDGE_PLUGIN_WASM_BPF=ON`.

```bash
cd <path/to/your/wasmedge/source/folder>
cmake -GNinja -Bbuild -DCMAKE_BUILD_TYPE=Release -DWASMEDGE_PLUGIN_WASM_BPF=ON
cmake --build build
cmake --install build
```

<!-- prettier-ignore -->
:::note
If the built `wasmedge` CLI tool cannot find the Wasm-BPF plug-in, you can set the `WASMEDGE_PLUGIN_PATH` environment variable to the plug-in installation path (such as `/usr/local/lib/wasmedge/`, or the built plug-in path `build/plugins/wasm_bpf/`) to try to fix this issue.
:::

Then you will have an executable `wasmedge` runtime under `/usr/local/bin` and the Wasm-BPF plug-in under `/usr/local/lib/wasmedge/libwasmedgePluginWasmBpf.so` after installation.

For more information, you can refer to the [GitHub repository](https://github.com/WasmEdge/WasmEdge/tree/master/plugins/wasm_bpf).
