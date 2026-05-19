---
sidebar_position: 1
---

# 建置具有 WASI-Logging 外掛的 WasmEdge

WASI-Logging 讓 WebAssembly 應用程式能以標準化的方式記錄訊息。這在對應用程式除錯或了解其執行流程時特別有用。WASI-Logging 外掛設計為易於使用,讓開發者能更專注於應用程式邏輯,而非記錄機制。

<!-- prettier-ignore -->
:::note
在 WasmEdge `0.14.1` 版中,此外掛已整合至 WasmEdge 函式庫中,不會產生外掛共用函式庫。
外掛建置架構將在未來重構。因此,我們保留此頁面以記錄 `0.14.0` 版之前的文件。
:::

## 先決條件

WASI-Logging 外掛的先決條件與 [Linux](../os/linux.md) 與 [MacOS](../os/macos.md) 平台上的 WasmEdge 建置環境相同。

## 建置具有 WASI-Logging 外掛的 WasmEdge

要啟用 WASI-Logging 外掛,開發者需要從原始碼建置 WasmEdge 並加上 cmake 選項 `-DWASMEDGE_PLUGIN_WASI_LOGGING=ON`。

```bash
cd <path/to/your/wasmedge/source/folder>
mkdir -p build && cd build
cmake -DCMAKE_BUILD_TYPE=Release -DWASMEDGE_PLUGIN_WASI_LOGGING=ON .. && make -j
# For the WASI-Logging plug-in, you should install this project.
cmake --install .
```

<!-- prettier-ignore -->
:::note
如果建置出的 `wasmedge` CLI 工具找不到 WASI-Logging 外掛,您可以將 `WASMEDGE_PLUGIN_PATH` 環境變數設為外掛安裝路徑 (`/usr/local/lib/wasmedge`,或建置出的外掛路徑 `build/plugins/wasi_logging`) 以嘗試解決此問題。您應該會在 `WASMEDGE_PLUGIN_PATH` 中找到 `libwasmedgePluginWasiLogging.so`
:::

然後,安裝完成後,您將在 `/usr/local/bin` 下擁有可執行的 `wasmedge` 執行環境,並在 `/usr/local/lib/wasmedge/libwasmedgePluginWasiLogging.so` 下擁有 WASI-Logging 外掛。

## 載入 WASI-Logging 外掛

如果建置出的 `wasmedge` CLI 工具找不到 WASI-Logging 外掛,將 `WASMEDGE_PLUGIN_PATH` 環境變數設為外掛安裝路徑 (例如 `/usr/local/lib/wasmedge/`,或建置出的外掛路徑 `build/plugins/wasi_logging/`) 以解決此問題 1。

安裝後,`wasmedge` 執行環境將位於 `/usr/local/bin` 下,而 WASI-Logging 外掛將位於 `/usr/local/lib/wasmedge/libwasmedgePluginWasiLogging.so` 下。

## 在您的應用程式中使用 WASI-Logging

您可以在您的 WebAssembly 應用程式中使用 WASI-Logging 外掛以標準化的方式記錄訊息。

如需更多資訊,您可以參閱 [GitHub 儲存庫](https://github.com/WasmEdge/WasmEdge/tree/master/examples/plugin/wasi-logging)。
