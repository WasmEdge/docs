---
sidebar_position: 3
---

# 建置具有 WasmEdge-Process 外掛的 WasmEdge

WasmEdge Process 外掛提供沙箱化的環境,以安全的方式執行系統行程。本指南將引導您完成建置 WasmEdge Process 外掛的步驟。

## 先決條件

WasmEdge-Process 外掛的先決條件與 [Linux 平台上的 WasmEdge 建置環境](../os/linux.md) 相同。

## 建置具有 WasmEdge-Process 外掛的 WasmEdge

要啟用 WasmEdge WasmEdge-Process,開發者需要[從原始碼建置 WasmEdge](../build_from_src.md) 並加上 cmake 選項 `-DWASMEDGE_PLUGIN_PROCESS=On`。

```bash
cd <path/to/your/wasmedge/source/folder>
cmake -GNinja -Bbuild -DCMAKE_BUILD_TYPE=Release -DWASMEDGE_PLUGIN_PROCESS=On
cmake --build build
# For the WasmEdge-Process plug-in, you should install this project.
cmake --install build
```

<!-- prettier-ignore -->
:::note
如果建置出的 `wasmedge` CLI 工具找不到 WasmEdge-Process 外掛,您可以將 `WASMEDGE_PLUGIN_PATH` 環境變數設為外掛安裝路徑 (例如 `/usr/local/lib/wasmedge/`,或建置出的外掛路徑 `build/plugins/wasmedge_process/`) 以嘗試解決此問題。
:::

然後,安裝完成後,您將在 `/usr/local/bin` 下擁有可執行的 `wasmedge` 執行環境,並在 `/usr/local/lib/wasmedge/libwasmedgePluginWasmEdgeProcess.so` 下擁有 WasmEdge-Process 外掛。

## 用法

要在 WasmEdge 中使用此外掛,您需要在啟動 WasmEdge 執行環境時指定它:

```bash
wasmedge --dir .:. --reactor --process_plugin target/release/libwasmedge_process.so your_wasm_file.wasm
```

將 `your_wasm_file.wasm` 替換為您的 WebAssembly 檔案路徑。`--process_plugin` 旗標指定 Process 外掛的路徑。

就這樣!您已成功建置並安裝 WasmEdge Process 外掛。

如需更多資訊,您可以參閱 [GitHub 儲存庫](https://github.com/WasmEdge/WasmEdge/tree/master/plugins/wasmedge_process)。
