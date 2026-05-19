---
sidebar_position: 7
---

# 建置具有 eBPF 外掛的版本

eBPF (extended Berkeley Packet Filter) 外掛提供介面以在 WasmEdge 中執行 eBPF 程式。它允許 WasmEdge 執行編譯為 WebAssembly 格式的 eBPF 程式碼。本指南將引導您完成建置具有 eBPF 外掛的 WasmEdge 之步驟。

## 建置 eBPF 外掛

### 先決條件

在建置 eBPF 外掛之前,請確認您已安裝下列項目:

* WasmEdge - 如果尚未安裝,請依照[從原始碼建置的指南](../os/linux.md)。
* libbpf - 此外掛需要 `libbpf >= 1.2`。詳情請參閱 [Building libbpf](https://github.com/libbpf/libbpf#building-libbpf)。

### 建置步驟

要建置 eBPF 外掛,在 WasmEdge 專案的根目錄執行下列指令:

```bash
cmake -DWASMEDGE_PLUGIN_WASM_BPF:BOOL=TRUE -B ./build -G "Unix Makefiles"
cmake --build ./build
```

請務必在命令列中將 `WASMEDGE_PLUGIN_WASM_BPF` 設為 `TRUE`。此切換選項控制 `wasm_bpf` 外掛的建置。

## 使用 eBPF 外掛

### 下載範例

您可以從這裡下載 wasm-bpf 程式範例:

```bash
wget https://eunomia-bpf.github.io/wasm-bpf/examples/runqlat/runqlat.wasm
```

### 建置範例

您也可以從 `wasm-bpf` 儲存庫建置 wasm-bpf 程式範例:

1. 如果您尚未安裝 wasi-sdk,請先安裝:

   ```bash
   wget https://github.com/WebAssembly/wasi-sdk/releases/download/wasi-sdk-17/wasi-sdk-17.0-linux.tar.gz
   tar -zxf wasi-sdk-17.0-linux.tar.gz
   sudo mkdir -p /opt/wasi-sdk/ && sudo mv wasi-sdk-17.0/* /opt/wasi-sdk/
   ```

2. 建置範例:

   ```bash
   git clone https://github.com/eunomia-bpf/wasm-bpf
   cd wasm-bpf/examples
   git submodule update --init --recursive
   ```

3. 例如,要建置 execve 範例:

```bash
cd execve && make
```

可用的範例如下:

```bash
bootstrap  execve  go-execve  go-lsm  lsm   opensnoop runqlat  rust-bootstrap  sockfilter  sockops
```

### 執行範例

建置完成後,您可以在 `./build/plugins/wasm_bpf/libwasmedgePluginWasmBpf.so` 找到外掛,並在 `./build/tools/wasmedge/wasmedge` 找到 WasmEdge CLI 工具。

要執行範例,設定 `WASMEDGE_PLUGIN_PATH=./build/plugins/wasm_bpf/` 並執行 wasmedge:

```bash
WASMEDGE_PLUGIN_PATH=./build/plugins/wasm_bpf/ ./build/tools/wasmedge/wasmedge execve.wasm
```

請根據您外掛的建置目錄調整 `WASMEDGE_PLUGIN_PATH`。

## 主機函式

如果您載入了此外掛,則會新增六個主機函式,讓您的 Wasm 應用程式可以存取 eBPF。所有這些函式皆位於 `wasm_bpf` 模組中:

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

如需更多資訊,您可以參閱 [GitHub 儲存庫](https://github.com/WasmEdge/WasmEdge/tree/master/plugins/wasmedge_bpf)。
