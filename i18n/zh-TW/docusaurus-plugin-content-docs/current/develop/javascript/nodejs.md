---
sidebar_position: 5
---

# Node.js 支援

許多既有的 JavaScript 應用程式使用 Node.js 的內建 API。為了支援並重用這些 JavaScript 應用程式，我們正在為 WasmEdge QuickJS 實作許多 Node.js API。目標是讓未經修改的 Node.js 程式可在 WasmEdge QuickJS 中執行。

要在 WasmEdge 中使用 Node.js API，您必須讓 [wasmedge-quickjs](https://github.com/second-state/wasmedge-quickjs) 中的 `modules` 目錄可供 WasmEdge Runtime 存取。最直接的方式是複製 [wasmedge-quickjs](https://github.com/second-state/wasmedge-quickjs) 儲存庫，並從儲存庫的最上層目錄執行 Node.js 應用程式。

```bash
# 複製 wasmedge-quickjs
git clone https://github.com/second-state/wasmedge-quickjs
# 使用 wasmedge-quickjs 目錄作為工作目錄以便存取 modules
cd wasmedge-quickjs
# 下載已釋出的 WasmEdge QuickJS 執行環境
curl -OL https://github.com/second-state/wasmedge-quickjs/releases/download/v0.5.0-alpha/wasmedge_quickjs.wasm
# 將 nodejs 專案複製到目前的工作目錄並執行該 nodejs 應用程式
cp -r /path/to/my_node_app .
wasmedge --dir .:. wasmedge_quickjs.wasm my_node_app/index.js
```

<!-- prettier-ignore -->
:::note
如果您想從儲存庫外部的目錄執行 `wasmedge`，您需要使用 `--dir` 選項告訴它 `modules` 目錄的位置。典型的命令如下：`wasmedge --dir .:. --dir ./modules:/path/to/modules wasmedge_quickjs.wasm app.js`
:::

WasmEdge QuickJS 對 Node.js 的支援進度**[在這個 issue 中追蹤](https://github.com/WasmEdge/WasmEdge/issues/1535)**。在 WasmEdge QuickJS 中支援 Node.js API 有兩種方式。

## JavaScript 模組

某些 Node.js 函式可以使用[模組](modules)的方式以純 JavaScript 實作。例如，

- [querystring](https://github.com/second-state/wasmedge-quickjs/blob/main/modules/querystring.js) 函式只執行字串操作。
- [buffer](https://github.com/second-state/wasmedge-quickjs/blob/main/modules/buffer.js) 函式管理並編碼陣列與記憶體結構。
- [encoding](https://github.com/second-state/wasmedge-quickjs/blob/main/modules/encoding.js) 與 [http](https://github.com/second-state/wasmedge-quickjs/blob/main/modules/http.js) 函式則透過包裝 [Rust 內部模組](rust)來支援對應的 Node.js API。

## Rust 內部模組

其他的 Node.js 函式必須在 Rust 中以 [internal_module](rust) 方式實作。這有兩個原因。首先，某些 Node.js API 函式屬於 CPU 密集型（例如編碼），用 Rust 實作效率最佳。其次，某些 Node.js API 函式需要透過原生主機函式存取底層系統（例如網路與檔案系統）。

- [core](https://github.com/second-state/wasmedge-quickjs/blob/main/src/internal_module/core.rs) 模組提供作業系統層級的函式，例如 `timeout`。
- [encoding](https://github.com/second-state/wasmedge-quickjs/blob/main/src/internal_module/encoding.rs) 模組提供高效能的編碼與解碼函式，然後[被包裝成 Node.js 編碼 API](https://github.com/second-state/wasmedge-quickjs/blob/main/modules/encoding.js)。
- [wasi_net_module](https://github.com/second-state/wasmedge-quickjs/blob/main/src/internal_module/wasi_net_module.rs) 透過基於 Rust 的 WasmEdge WASI socket API 提供 JavaScript 網路函式。它接著被包裝成 [Node.js http 模組](https://github.com/second-state/wasmedge-quickjs/blob/main/modules/http.js)。

WasmEdge QuickJS 對 Node.js 的相容性支援仍在持續開發中。對新進開發者而言，這是熟悉 WasmEdge QuickJS 的絕佳途徑。歡迎加入我們！
