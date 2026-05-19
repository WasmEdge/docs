---
sidebar_position: 7
---

# 內建模組

WasmEdge QuickJS 執行環境為應用程式開發者支援 [ES6](es6) 與 [NPM](npm) 模組。然而，這些方式對系統開發者可能更為方便。他們需要一種更簡單的方式，能在不使用 rollup.js 等建置工具的情況下，將多個 JavaScript 模組與 API 加入執行環境。WasmEdge QuickJS 模組系統允許開發者將 JavaScript 檔案放入 `modules` 資料夾中，使檔案中定義的 JavaScript 函式立即可供執行環境內所有的 JavaScript 程式使用。這個模組系統的一個良好應用情境是用來在 WasmEdge 中支援 [Node.js](nodejs) API。

本文將以 [wasmedge-quickjs/modules](https://github.com/second-state/wasmedge-quickjs/tree/main/modules) 為例，示範如何匯入 NodeJS API 或第三方模組。

## 先決條件

[請參閱此處](./hello_world#prerequisites)

## 模組系統

模組系統會收集 WasmEdge QuickJS 發行版中 `modules` 目錄下的 JavaScript 檔案。要使用這些模組中定義的 JavaScript 函式與 API，您需要將此目錄對應到 WasmEdge Runtime 實例內部的 `/modules` 目錄。以下範例示範如何在 WasmEdge CLI 上進行此操作。您也可以透過任何支援嵌入式 WasmEdge 的主機語言 SDK 來達成。

```bash
wasmedge --dir /modules:/host/os/path/to/modules wasmedge_quickjs.wasm example_js/hello.js WasmEdge Runtime
```

## 加入您自己的 JavaScript 模組

[module_demo](https://github.com/second-state/wasmedge-quickjs/tree/main/example_js/module_demo) 示範如何使用模組系統加入您自己的 JavaScript API。要執行此範例，請先將範例 [modules](https://github.com/second-state/wasmedge-quickjs/tree/main/example_js/module_demo/modules) 目錄中的兩個檔案複製到您 WasmEdge QuickJS 的 `modules` 目錄中。

```bash
cp example_js/module_demo/modules/* modules/
```

`modules` 目錄中的兩個 JavaScript 檔案提供了兩個簡單的函式。以下是 [modules/my_mod_1.js](https://github.com/second-state/wasmedge-quickjs/blob/main/example_js/module_demo/modules/my_mod_1.js) 檔案。

```javascript
export function hello_mod_1() {
  console.log('hello from "my_mod_1.js"');
}
```

接著是 [modules/my_mod_2.js](https://github.com/second-state/wasmedge-quickjs/blob/main/example_js/module_demo/modules/my_mod_2.js) 檔案。

```javascript
export function hello_mod_2() {
  console.log('hello from "my_mod_2.js"');
}
```

接著，只需執行 [demo.js](https://github.com/second-state/wasmedge-quickjs/blob/main/example_js/module_demo/demo.js) 檔案，即可呼叫從模組匯出的兩個函式。

```javascript
import { hello_mod_1 } from 'my_mod_1';
import { hello_mod_2 } from 'my_mod_2';

hello_mod_1();
hello_mod_2();
```

以下是執行範例的命令與輸出。

```bash
$ wasmedge --dir .:. wasmedge_quickjs.wasm example_js/module_demo/demo.js
hello from "my_mod_1.js"
hello from "my_mod_2.js"
```

依照上述教學，您可以輕鬆地將第三方 JavaScript 函式與 API 加入您的 WasmEdge QuickJS 執行環境。

我們已將 JavaScript 檔案納入官方發行版以支援 [Node.js API](nodejs)。您可以參考[這些檔案](https://github.com/second-state/wasmedge-quickjs/tree/main/modules)作為進一步的範例。
