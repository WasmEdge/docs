---
sidebar_position: 6
---

# ES6 模組

WasmEdge QuickJS 執行環境支援 ES6 模組。我們在 [React SSR](ssr) 範例中所使用的 roll-up 命令會將 CommonJS 與 NPM 模組轉換並打包成 ES6 模組，以便在 WasmEdge QuickJS 中執行。本文將示範如何在 WasmEdge 中使用 ES6 模組。

## 先決條件

[請參閱此處](./hello_world#prerequisites)

## 執行範例

我們將以 [example_js/es6_module_demo](https://github.com/second-state/wasmedge-quickjs/tree/main/example_js/es6_module_demo) 資料夾中的範例為例。您可以在 CLI 上執行以下命令來執行範例。

```bash
$ wasmedge --dir .:. wasmedge_quickjs.wasm example_js/es6_module_demo/demo.js
hello from module_def.js
hello from module_def_async.js
./module_def_async.js `something` is  async thing
```

<!-- prettier-ignore -->
:::note
請確認您是在 `wasmedge-quickjs` 目錄下執行這些命令。[原因請見此處](./hello_world#prerequisites)
:::

## 程式碼說明

[module_def.js](https://github.com/second-state/wasmedge-quickjs/blob/main/example_js/es6_module_demo/module_def.js) 檔案定義並匯出一個簡單的 JS 函式。

```javascript
function hello() {
  console.log('hello from module_def.js');
}

export { hello };
```

[module_def_async.js](https://github.com/second-state/wasmedge-quickjs/blob/main/example_js/es6_module_demo/module_def_async.js) 檔案定義並匯出一個非同步函式與一個變數。

```javascript
export async function hello() {
  console.log('hello from module_def_async.js');
  return 'module_def_async.js : return value';
}

export var something = 'async thing';
```

[demo.js](https://github.com/second-state/wasmedge-quickjs/blob/main/example_js/es6_module_demo/demo.js) 檔案從上述模組匯入函式與變數，並執行它們。

```javascript
import { hello as module_def_hello } from './module_def.js';

module_def_hello();

var f = async () => {
  let { hello, something } = await import('./module_def_async.js');
  await hello();
  console.log('./module_def_async.js `something` is ', something);
};

f();
```
