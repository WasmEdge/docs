---
sidebar_position: 5
---

# 6.5 Bpf

# Bpf userspace program example with wasm_bpf plugin

Currently there is a WasmEdge plugin called `wasm_bpf` which provided APIs to perform operations on eBPF program, such ad loading, attaching and polling.

The detailed description could be found at [https://github.com/WasmEdge/WasmEdge/blob/master/plugins/wasm_bpf/README.md](https://github.com/WasmEdge/WasmEdge/blob/master/plugins/wasm_bpf/README.md).

Here we will provide several examples to demonstrate the `wasm_bpf` plugin

## Prerequisites

For simplicity, we will just reuse the `Makefile`s of [wasm-bpf](https://github.com/eunomia-bpf/wasm-bpf), since `wasmEdge_bpfPlugin` has the exactly same API as `wasm-bpf`

1. Clone the [`wasm-bpf`](https://github.com/eunomia-bpf/wasm-bpf) repo.
2. Run `make install-deps` and `make /opt/wasi-sdk` at the root of the project. This will install the build prerequisites.
3. [Install WasmEdge](../build-and-run/install)
4. Build and install the `wasm_bpf` plugin. Currently we have to build `wasm_bpf` plugin manually. The building instructions could be found at [https://github.com/WasmEdge/WasmEdge/tree/master/plugins/wasm_bpf#build-wasm_bpf-plug-in](https://github.com/WasmEdge/WasmEdge/tree/master/plugins/wasm_bpf#build-wasm_bpf-plug-in)

## The bootstrap example

`bootstrap` is a simple ebpf program to track the entry and exit of all processes. It will print a line of message when there is an entry of exiting event of a process. 

Run `make` in `wasm-bpf/examples/bootstrap`, and you will find the `bootstrap.wasm`, which can be executed by `WasmEdge`.

```bash
WASMEDGE_PLUGIN_PATH=./build/plugins/wasm_bpf/ wasmedge bootstrap.wasm 
```

`WASMEDGE_PLUGIN_PATH` should be changed due to your build directory of the plugin.

Example output:

```

TIME     EVENT COMM             PID     PPID    FILENAME/EXIT CODE
13:38:00 EXEC  bash             121487  40189   /usr/bin/bash
13:38:00 EXEC  groups           121489  121487  /usr/bin/groups
13:38:00 EXIT  groups           121489  121487  [0] (3ms)
13:38:00 EXEC  lesspipe         121490  121487  /usr/bin/lesspipe
13:38:00 EXEC  basename         121491  121490  /usr/bin/basename
13:38:00 EXIT  basename         121491  121490  [0] (8ms)
13:38:00 EXEC  dirname          121493  121492  /usr/bin/dirname
13:38:00 EXIT  dirname          121493  121492  [0] (1ms)
13:38:00 EXIT  lesspipe         121492  121490  [0]
```
