---
sidebar_position: 2
---

# JavaScript 快速入門

## 先決條件

[安裝 WasmEdge](../../start/install.md#install)

複製 [wasmedge-quickjs](https://github.com/second-state/wasmedge-quickjs) 儲存庫，並以該目錄作為目前的工作目錄。

```bash
git clone https://github.com/second-state/wasmedge-quickjs
cd wasmedge-quickjs
```

接著下載預先建置好的 WasmEdge QuickJS Runtime 程式，並可選擇對其進行 AOT 編譯以獲得更佳效能。

```bash
curl -OL https://github.com/second-state/wasmedge-quickjs/releases/download/v0.5.0-alpha/wasmedge_quickjs.wasm
wasmedge compile wasmedge_quickjs.wasm wasmedge_quickjs.wasm
```

<!-- prettier-ignore -->
:::note
使用 `wasmedge-quickjs` 作為目前工作目錄的原因是，儲存庫中的 `modules` 是 QuickJS 執行環境所需要的。
:::

## 快速入門

您可以嘗試一個簡單的「hello world」JavaScript 程式（[example_js/hello.js](https://github.com/second-state/wasmedge-quickjs/blob/main/example_js/hello.js)），它會將命令列引數列印到主控台。

```bash
$ wasmedge --dir .:. wasmedge_quickjs.wasm example_js/hello.js WasmEdge Runtime
Hello WasmEdge Runtime
```

<!-- prettier-ignore -->
:::note
命令列中的 `--dir .:.` 是為了授予 `wasmedge` 讀取檔案系統中本機目錄裡 `hello.js` 檔案的權限。
:::

`hello.js` 程式的 JavaScript 原始碼如下。

```javascript
import * as os from 'os';
import * as std from 'std';

args = args.slice(1);
print('Hello', ...args);
setTimeout(() => {
  print('timeout 2s');
}, 2000);
```

## 自行建置

本節為選讀。如果您有興趣[為執行環境加入自訂的內建 JavaScript API](rust)，請繼續閱讀。

依照下列步驟，您可以為 WasmEdge 建置一個 JavaScript 直譯器。請先確認已安裝 GCC。如果尚未安裝，請執行以下命令列。

```bash
# 安裝 GCC
sudo apt update
sudo apt install build-essential
```

接著，我們便可建置 WasmEdge-Quickjs 執行環境。

Fork 或複製 [wasmedge-quickjs 的 Github 儲存庫](https://github.com/second-state/wasmedge-quickjs)。

```bash
# 取得原始碼
git clone https://github.com/second-state/wasmedge-quickjs
cd wasmedge-quickjs

# 建置 QuickJS JavaScript 直譯器
cargo build --target wasm32-wasip1 --release
```

基於 WebAssembly 的 JavaScript 直譯器程式位於建置的 `target` 目錄中。

WasmEdge 提供 `wasmedgec` 工具，可將原生機器碼區段編譯並加入 `wasm` 檔案中。您可以使用 `wasmedge` 執行經原生指令化的 `wasm` 檔案，以獲得更快的效能。

```bash
wasmedge compile target/wasm32-wasip1/release/wasmedge_quickjs.wasm wasmedge_quickjs.wasm
wasmedge --dir .:. wasmedge_quickjs.wasm example_js/hello.js
```

接下來，我們將討論 JavaScript 在 WasmEdge 中更進階的應用情境。
