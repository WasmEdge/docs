---
sidebar_position: 7
---

# Build with eBPF Plug-in

The eBPF (extended Berkeley Packet Filter) plug-in provides an interface to execute eBPF programs in WasmEdge. It allows WasmEdge to execute eBPF code that is compiled into WebAssembly format. This guide will walk you through the steps to build WasmEdge with the eBPF plug-in.

## Build the eBPF Plug-in

### Prerequisites

Before building the eBPF plug-in, ensure that you have the following installed:

* WasmEdge - If you haven't installed it, follow the [follow the guide to build from source](../os/linux.md).
* libbpf - This plug-in requires `libbpf >= 1.2`. See [Building libbpf](https://github.com/libbpf/libbpf#building-libbpf) for details.

### Build steps

To build the eBPF plug-in, run the following commands at the root of the WasmEdge project:

```bash
cmake -DWASMEDGE_PLUGIN_WASM_BPF:BOOL=TRUE -B ./build -G "Unix Makefiles"
cmake --build ./build
```

Make sure to set `WASMEDGE_PLUGIN_WASM_BPF` to `TRUE` in the command line. This toggle controls the build of the `wasm_bpf` plug-in.

## Use the eBPF Plug-in

### Download Examples

You can download examples of wasm-bpf programs from here:

```bash
wget https://eunomia-bpf.github.io/wasm-bpf/examples/runqlat/runqlat.wasm
```

### Build Examples
You can also build examples of wasm-bpf programs from the `wasm-bpf` repository:

1. Install the wasi-sdk if you don't have it:

```bash
wget https://github.com/WebAssembly/wasi-sdk/releases/download/wasi-sdk-17/wasi-sdk-17.0-linux.tar.gz
tar -zxf wasi-sdk-17.0-linux.tar.gz
sudo mkdir -p /opt/wasi-sdk/ && sudo mv wasi-sdk-17.0/* /opt/wasi-sdk/
```

2. Build the examples:
```bash
git clone https://github.com/eunomia-bpf/wasm-bpf
cd wasm-bpf/examples
git submodule update --init --recursive
```

3. For example, to build the execve example:
```bash
cd execve && make
```

The available examples are:

```bash
bootstrap  execve  go-execve  go-lsm  lsm   opensnoop runqlat  rust-bootstrap  sockfilter  sockops
```

### Run Examples

After building, you can find the plug-in at `./build/plugins/wasm_bpf/libwasmedgePluginWasmBpf.so` and the WasmEdge CLI tool at `./build/tools/wasmedge/wasmedge`.

To run the examples, set `WASMEDGE_PLUGIN_PATH=./build/plugins/wasm_bpf/` and run wasmedge:

```bash
WASMEDGE_PLUGIN_PATH=./build/plugins/wasm_bpf/ ./build/tools/wasmedge/wasmedge execve.wasm
```

Adjust `WASMEDGE_PLUGIN_PATH` according to your build directory of the plug-in.

## Host Functions

This plug-in adds six host functions that give your Wasm application access to eBPF. All of these functions are in the module `wasm_bpf`, if you loaded this plug-in:

```c
/// lookup a bpf map fd by name.
i32 wasm_bpf_map_fd_by_name(u64 obj, u32 name);
/// detach and close a bpf program.
i32 wasm_close_bpf_object(u64 obj);
/// CO-RE load a bpf object into the kernel.
u64 wasm_load_bpf_object(u32 obj_buf, u32 obj_buf_sz);
/// attach a bpf program to a kernel hook.
i32 wasm_attach_bpf_program(u64 obj, u32 name,
                            u32 attach_target);
/// poll a bpf buffer, and call a wasm callback indicated by sample_func.
/// the first time to call this function will open and create a bpf buffer.
i32 wasm_bpf_buffer_poll(u64 program, i32 fd, u32 sample_func,
                         u32 ctx, u32 data, i32 max_size,
                         i32 timeout_ms);
/// lookup, update, delete, and get_next_key operations on a bpf map.
i32 wasm_bpf_map_operate(u64 fd, i32 cmd, u32 key, u32 value,
                         u32 next_key, u64 flags);
```

For more information, you can refer to the [GitHub repository](https://github.com/WasmEdge/WasmEdge/tree/master/plugins/wasmedge_bpf).