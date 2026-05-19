---
sidebar_position: 10
---

# 範例：SSR

[React](https://reactjs.org/) 是一個非常受歡迎的 JavaScript Web UI 框架。React 應用程式會「編譯」成 HTML 與 JavaScript 的靜態網站，Web UI 透過產生的 JavaScript 程式碼進行繪製。然而，要完全在瀏覽器中執行這些複雜的產生 JavaScript 來建構互動式的 HTML DOM 物件，通常太過緩慢且消耗資源。[React 伺服器端繪製（Server Side Rendering，SSR）](https://medium.com/jspoint/a-beginners-guide-to-react-server-side-rendering-ssr-bf3853841d55)將 JavaScript UI 繪製工作委派給伺服器，讓伺服器將繪製好的 HTML DOM 物件串流給瀏覽器。WasmEdge JavaScript 執行環境提供了一個輕量且高效能的容器，可在邊緣伺服器上執行 React SSR 函式。

伺服器端繪製（SSR）是一種常見的技術，將原本在用戶端執行的單頁應用程式（SPA）改在伺服器端繪製，然後將完全繪製好的頁面傳送至用戶端，讓動態元件能以靜態 HTML 標記的形式提供。當索引服務無法正確處理 JavaScript 時，這對搜尋引擎最佳化（SEO）相當有用。在網路速度緩慢、下載大型 JavaScript bundle 受到影響時，這也可能帶來好處。-- [來自 Digital Ocean](https://www.digitalocean.com/community/tutorials/react-server-side-rendering)。

本文將示範如何使用 WasmEdge QuickJS 執行環境實作 React SSR 函式。相較於 Docker + Linux + nodejs + v8 的方式，WasmEdge 更安全（適合多租戶環境），而且更為輕量（僅 1% 的佔用量），同時具備相近的效能。

我們將從一個完整的教學開始，建立並部署一個簡單的 React 串流 SSR Web 應用程式，接著再進入完整的 React 18 範例。

- [React 串流 SSR 入門](#getting-started)
- [完整的 React 18 應用程式](#a-full-react-18-app)
- [附錄：create-react-app 範本](#appendix-the-create-react-app-template)

## 入門

GitHub 儲存庫中的 [example_js/react_ssr_stream](https://github.com/second-state/wasmedge-quickjs/tree/main/example_js/react_ssr_stream) 資料夾包含此範例的原始碼。它示範如何在 WasmEdge 中的 JavaScript 應用程式裡，從範本繪製 HTML 字串。

[component/LazyHome.jsx](https://github.com/second-state/wasmedge-quickjs/blob/main/example_js/react_ssr_stream/component/LazyHome.jsx) 檔案是 React 中的主要頁面範本。當外層 HTML 已繪製並回傳給使用者後，它會「延遲」載入內層頁面範本，並延遲 2 秒。

```javascript
import React, { Suspense } from 'react';
import * as LazyPage from './LazyPage.jsx';

async function sleep(ms) {
  return new Promise((r, _) => {
    setTimeout(() => r(), ms);
  });
}

async function loadLazyPage() {
  await sleep(2000);
  return LazyPage;
}

class LazyHome extends React.Component {
  render() {
    let LazyPage1 = React.lazy(() => loadLazyPage());
    return (
      <html lang="en">
        <head>
          <meta charSet="utf-8" />
          <title>Title</title>
        </head>
        <body>
          <div>
            <div> This is LazyHome </div>
            <Suspense fallback={<div> loading... </div>}>
              <LazyPage1 />
            </Suspense>
          </div>
        </body>
      </html>
    );
  }
}

export default LazyHome;
```

[LazyPage.jsx](https://github.com/second-state/wasmedge-quickjs/blob/main/example_js/react_ssr_stream/component/LazyPage.jsx) 是內層頁面範本。它會在外層頁面已經回傳給使用者 2 秒後才被繪製。

```javascript
import React from 'react';

class LazyPage extends React.Component {
  render() {
    return (
      <div>
        <div>This is lazy page</div>
      </div>
    );
  }
}

export default LazyPage;
```

[main.mjs](https://github.com/second-state/wasmedge-quickjs/blob/main/example_js/react_ssr_stream/main.mjs) 檔案使用標準的 Node.js API 啟動一個非阻塞的 HTTP 伺服器，並以多個區塊（chunks）的方式將 HTML 頁面繪製到回應中。

```javascript
import * as React from 'react';
import { renderToPipeableStream } from 'react-dom/server';
import { createServer } from 'http';

import LazyHome from './component/LazyHome.jsx';

createServer((req, res) => {
  res.setHeader('Content-type', 'text/html; charset=utf-8');
  renderToPipeableStream(<LazyHome />).pipe(res);
}).listen(8001, () => {
  print('listen 8001...');
});
```

[rollup.config.js](https://github.com/second-state/wasmedge-quickjs/blob/main/example_js/react_ssr_stream/rollup.config.js) 與 [package.json](https://github.com/second-state/wasmedge-quickjs/blob/main/example_js/react_ssr_stream/package.json) 檔案的用途是將 React SSR 的相依套件與元件建置成單一打包的 JavaScript 檔案，供 WasmEdge 執行。您應該使用 `npm` 命令來建置它。輸出檔案位於 `dist/main.mjs`。

```bash
npm install
npm run build
```

如[此處所述](nodejs.md)，將系統的 `modules` 複製到工作目錄以支援 Node.js API。

```bash
cp -r ../../modules .
```

要執行此範例，請在 CLI 上執行以下命令來啟動伺服器。

```bash
nohup wasmedge --dir .:. /path/to/wasmedge_quickjs.wasm dist/main.mjs &
```

透過 `curl` 或瀏覽器向伺服器發送 HTTP 請求。

```bash
curl http://localhost:8001
```

結果如下。服務先回傳一個內層區段為空（即 `loading` 區段）的 HTML 頁面，2 秒後再回傳內層區段的 HTML 內容以及用於顯示的 JavaScript。

```bash
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed

  0     0    0     0    0     0      0      0 --:--:-- --:--:-- --:--:--     0
100   211    0   211    0     0   1029      0 --:--:-- --:--:-- --:--:--  1024
100   275    0   275    0     0    221      0 --:--:--  0:00:01 --:--:--   220
100   547    0   547    0     0    245      0 --:--:--  0:00:02 --:--:--   245
100  1020    0  1020    0     0    413      0 --:--:--  0:00:02 --:--:--   413

<!DOCTYPE html><html lang="en"><head><meta charSet="utf-8"/><title>Title</title></head><body><div><div> This is LazyHome </div><!--$?--><template id="B:0"></template><div> loading... </div><!--/$--></div></body></html><div hidden id="S:0"><template id="P:1"></template></div><div hidden id="S:1"><div><div>This is lazy page</div></div></div><script>function $RS(a,b){a=document.getElementById(a);b=document.getElementById(b);for(a.parentNode.removeChild(a);a.firstChild;)b.parentNode.insertBefore(a.firstChild,b);b.parentNode.removeChild(b)};$RS("S:1","P:1")</script><script>function $RC(a,b){a=document.getElementById(a);b=document.getElementById(b);b.parentNode.removeChild(b);if(a){a=a.previousSibling;var f=a.parentNode,c=a.nextSibling,e=0;do{if(c&&8===c.nodeType){var d=c.data;if("/$"===d)if(0===e)break;else e--;else"$"!==d&&"$?"!==d&&"$!"!==d||e++}d=c.nextSibling;f.removeChild(c);c=d}while(c);for(;b.firstChild;)f.insertBefore(b.firstChild,c);a.data="$";a._reactRetry&&a._reactRetry()}};$RC("B:0","S:0")</script>
```

## 完整的 React 18 應用程式

本節將示範一個完整的 React 18 SSR 應用程式。它透過串流 SSR 繪製 Web UI。GitHub 儲存庫中的 [example_js/react18_ssr](https://github.com/second-state/wasmedge-quickjs/tree/main/example_js/react18_ssr) 資料夾包含此範例的原始碼。[component](https://github.com/second-state/wasmedge-quickjs/tree/main/example_js/react18_ssr/component) 資料夾包含整個 React 18 應用程式的原始碼，[public](https://github.com/second-state/wasmedge-quickjs/tree/main/example_js/react18_ssr/public) 資料夾則包含 Web 應用程式的公開資源（CSS 與圖片）。此應用程式同時也示範了一個為 UI 提供資料的 data provider。

[main.mjs](https://github.com/second-state/wasmedge-quickjs/blob/main/example_js/react18_ssr/main.mjs) 檔案啟動一個非阻塞的 HTTP 伺服器、從 data provider 取得資料、將 `public` 資料夾中的 `main.css` 與 `main.js` 檔案對應到網址，並在 `renderToPipeableStream()` 中為每個請求繪製 HTML 頁面。

```javascript
import * as React from 'react';
import { renderToPipeableStream } from 'react-dom/server';
import { createServer } from 'http';
import * as std from 'std';

import App from './component/App.js';
import { DataProvider } from './component/data.js';

let assets = {
  'main.js': '/main.js',
  'main.css': '/main.css',
};

const css = std.loadFile('./public/main.css');

function createServerData() {
  let done = false;
  let promise = null;
  return {
    read() {
      if (done) {
        return;
      }
      if (promise) {
        throw promise;
      }
      promise = new Promise((resolve) => {
        setTimeout(() => {
          done = true;
          promise = null;
          resolve();
        }, 2000);
      });
      throw promise;
    },
  };
}

createServer((req, res) => {
  print(req.url);
  if (req.url == '/main.css') {
    res.setHeader('Content-Type', 'text/css; charset=utf-8');
    res.end(css);
  } else if (req.url == '/favicon.ico') {
    res.end();
  } else {
    res.setHeader('Content-type', 'text/html');

    res.on('error', (e) => {
      print('res error', e);
    });
    let data = createServerData();
    print('createServerData');

    const stream = renderToPipeableStream(
      <DataProvider data={data}>
        <App assets={assets} />
      </DataProvider>,
      {
        onShellReady: () => {
          stream.pipe(res);
        },
        onShellError: (e) => {
          print('onShellError:', e);
        },
      },
    );
  }
}).listen(8002, () => {
  print('listen 8002...');
});
```

[rollup.config.js](https://github.com/second-state/wasmedge-quickjs/blob/main/example_js/react18_ssr/rollup.config.js) 與 [package.json](https://github.com/second-state/wasmedge-quickjs/blob/main/example_js/react18_ssr/package.json) 檔案的用途是將 React 18 SSR 的相依套件與元件建置成單一打包的 JavaScript 檔案，供 WasmEdge 執行。您應該使用 `npm` 命令來建置它。輸出檔案位於 `dist/main.mjs`。

```bash
npm install
npm run build
```

如[此處所述](nodejs)，將系統的 `modules` 複製到工作目錄以支援 Node.js API。

```bash
cp -r ../../modules .
```

要執行此範例，請在 CLI 上執行以下命令來啟動伺服器。

```bash
nohup wasmedge --dir .:. /path/to/wasmedge_quickjs.wasm dist/main.mjs &
```

透過 `curl` 或瀏覽器向伺服器發送 HTTP 請求。

```bash
curl http://localhost:8002
```

結果如下。服務先回傳一個內層區段為空（即 `loading` 區段）的 HTML 頁面，2 秒後再回傳內層區段的 HTML 內容以及用於顯示的 JavaScript。

```bash
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed

  0     0    0     0    0     0      0      0 --:--:-- --:--:-- --:--:--     0
100   439    0   439    0     0   1202      0 --:--:-- --:--:-- --:--:--  1199
100  2556    0  2556    0     0   1150      0 --:--:--  0:00:02 --:--:--  1150
100  2556    0  2556    0     0    926      0 --:--:--  0:00:02 --:--:--   926
100  2806    0  2806    0     0    984      0 --:--:--  0:00:02 --:--:--   984
<!DOCTYPE html><html lang="en"><head><meta charSet="utf-8"/><meta name="viewport
" content="width=device-width, initial-scale=1"/><link rel="stylesheet" href="/m
ain.css"/><title>Hello</title></head><body><noscript><b>Enable JavaScript to run
 this app.</b></noscript><!--$--><main><nav><a href="/">Home</a></nav><aside cla
ss="sidebar"><!--$?--><template id="B:0"></template><div class="spinner spinner-
-active" role="progressbar" aria-busy="true"></div><!--/$--></aside><article cla
ss="post"><!--$?--><template id="B:1"></template><div class="spinner spinner--ac
tive" role="progressbar" aria-busy="true"></div><!--/$--><section class="comment
s"><h2>Comments</h2><!--$?--><template id="B:2"></template><div class="spinner s
pinner--active" role="progressbar" aria-busy="true"></div><!--/$--></section><h2
>Thanks for reading!</h2></article></main><!--/$--><script>assetManifest = {"mai
n.js":"/main.js","main.css":"/main.css"};</script></body></html><div hidden id="
S:0"><template id="P:3"></template></div><div hidden id="S:1"><template id="P:4"
></template></div><div hidden id="S:2"><template id="P:5"></template></div><div
hidden id="S:3"><h1>Archive</h1><ul><li>May 2021</li><li>April 2021</li><li>Marc
h 2021</li><li>February 2021</li><li>January 2021</li><li>December 2020</li><li>
November 2020</li><li>October 2020</li><li>September 2020</li></ul></div><script
>function $RS(a,b){a=document.getElementById(a);b=document.getElementById(b);for
(a.parentNode.removeChild(a);a.firstChild;)b.parentNode.insertBefore(a.firstChil
d,b);b.parentNode.removeChild(b)};$RS("S:3","P:3")</script><script>function $RC(
a,b){a=document.getElementById(a);b=document.getElementById(b);b.parentNode.remo
veChild(b);if(a){a=a.previousSibling;var f=a.parentNode,c=a.nextSibling,e=0;do{i
f(c&&8===c.nodeType){var d=c.data;if("/$"===d)if(0===e)break;else e--;else"$"!==
d&&"$?"!==d&&"$!"!==d||e++}d=c.nextSibling;f.removeChild(c);c=d}while(c);for(;b.
firstChild;)f.insertBefore(b.firstChild,c);a.data="$";a._reactRetry&&a._reactRet
ry()}};$RC("B:0","S:0")</script><div hidden id="S:4"><h1>Hello world</h1><p>This
 demo is <!-- --><b>artificially slowed down</b>. Open<!-- --> <!-- --><code>ser
ver/delays.js</code> to adjust how much different things are slowed down.<!-- --
></p><p>Notice how HTML for comments &quot;streams in&quot; before the JS (or Re
act) has loaded on the page.</p><p>Also notice that the JS for comments and side
bar has been code-split, but HTML for it is still included in the server output.
</p></div><script>$RS("S:4","P:4")</script><script>$RC("B:1","S:1")</script><div
 hidden id="S:5"><p class="comment">Wait, it doesn&#x27;t wait for React to load
?</p><p class="comment">How does this even work?</p><p class="comment">I like ma
rshmallows</p></div><script>$RS("S:5","P:5")</script><script>$RC("B:2","S:2")</s
cript>
```

這些串流 SSR 範例善用了 WasmEdge 獨特的非同步網路能力與 ES6 模組支援（也就是說，roll-up 打包後的 JS 檔案包含 ES6 模組）。您可以在本書中進一步瞭解[非同步網路](networking.md)與 [ES6](es6.md)。

## 附錄 create-react-app 範本

`create-react-app` 範本是許多開發者建立 React 應用程式時常用的起點。在本教學中，我們將提供逐步指南，說明如何使用它建立可在 WasmEdge 上執行的 React 串流 SSR 應用程式。

### 步驟 1 — 建立 React 應用程式

首先，使用 `npx` 建立新的 React 應用程式。我們將應用程式命名為 `react-ssr-example`。

```bash
npx create-react-app react-ssr-example
```

接著 `cd` 進入新建立應用程式的目錄。

```bash
cd react-ssr-example
```

啟動新的應用程式以驗證安裝。

```bash
npm start
```

您應該會在瀏覽器視窗中看到範例 React 應用程式。在此階段，應用程式是在瀏覽器中繪製的。瀏覽器執行產生的 React JavaScript 來建構 HTML DOM UI。

接下來為了準備 SSR，您需要對應用程式的 `index.js` 檔案做一些調整。將 ReactDOM 的 `render` 方法改為 `hydrate`，以告訴 DOM 繪製器您打算在伺服器繪製後對應用程式進行 rehydrate。將 `index.js` 檔案的內容替換為以下程式碼。

```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
ReactDOM.hydrate(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root'),
);
```

<!-- prettier-ignore -->
:::note
您應該在 `src/App.js` 中冗餘地匯入 `React`，以便伺服器能識別它。
:::

```js
import React from 'react';
//...
```

至此完成了應用程式的設定。您可以繼續進行伺服器端繪製函式的設定。

### 步驟 2 — 建立 WasmEdge QuickJS 伺服器並繪製 App 元件

現在應用程式已就位，讓我們設定一個伺服器，藉由執行 React JavaScript 來繪製 HTML DOM，然後將繪製好的元素傳送至瀏覽器。我們將使用 WasmEdge 作為安全、高效能、輕量的容器來執行 React JavaScript。

在專案的根目錄中建立新的 `server` 目錄。

```bash
mkdir server
```

接著，在 `server` 目錄內建立一個新的 `index.js` 檔案，並寫入伺服器程式碼。

```javascript
import * as React from 'react';
import ReactDOMServer from 'react-dom/server';
import * as std from 'std';
import * as http from 'wasi_http';
import * as net from 'wasi_net';

import App from '../src/App.js';

async function handle_client(cs) {
  print('open:', cs.peer());
  let buffer = new http.Buffer();

  while (true) {
    try {
      let d = await cs.read();
      if (d == undefined || d.byteLength <= 0) {
        return;
      }
      buffer.append(d);
      let req = buffer.parseRequest();
      if (req instanceof http.WasiRequest) {
        handle_req(cs, req);
        break;
      }
    } catch (e) {
      print(e);
    }
  }
  print('end:', cs.peer());
}

function enlargeArray(oldArr, newLength) {
  let newArr = new Uint8Array(newLength);
  oldArr && newArr.set(oldArr, 0);
  return newArr;
}

async function handle_req(s, req) {
  print('uri:', req.uri);

  let resp = new http.WasiResponse();
  let content = '';
  if (req.uri == '/') {
    const app = ReactDOMServer.renderToString(<App />);
    content = std.loadFile('./build/index.html');
    content = content.replace(
      '<div id="root"></div>',
      `<div id="root">${app}</div>`,
    );
  } else {
    let chunk = 1000; // 每次讀取的區塊大小
    let length = 0; // 檔案的整體長度
    let byteArray = null; // 以 Uint8Array 表示的檔案內容

    // 依區塊將檔案讀入 byteArray
    let file = std.open('./build' + req.uri, 'r');
    while (true) {
      byteArray = enlargeArray(byteArray, length + chunk);
      let readLen = file.read(byteArray.buffer, length, chunk);
      length += readLen;
      if (readLen < chunk) {
        break;
      }
    }
    content = byteArray.slice(0, length).buffer;
    file.close();
  }
  let contentType = 'text/html; charset=utf-8';
  if (req.uri.endsWith('.css')) {
    contentType = 'text/css; charset=utf-8';
  } else if (req.uri.endsWith('.js')) {
    contentType = 'text/javascript; charset=utf-8';
  } else if (req.uri.endsWith('.json')) {
    contentType = 'text/json; charset=utf-8';
  } else if (req.uri.endsWith('.ico')) {
    contentType = 'image/vnd.microsoft.icon';
  } else if (req.uri.endsWith('.png')) {
    contentType = 'image/png';
  }
  resp.headers = {
    'Content-Type': contentType,
  };

  let r = resp.encode(content);
  s.write(r);
}

async function server_start() {
  print('listen 8002...');
  try {
    let s = new net.WasiTcpServer(8002);
    for (var i = 0; ; i++) {
      let cs = await s.accept();
      handle_client(cs);
    }
  } catch (e) {
    print(e);
  }
}

server_start();
```

伺服器會繪製 `<App>` 元件，然後將繪製好的 HTML 字串送回瀏覽器。這裡發生了三件重要的事。

- 使用 ReactDOMServer 的 `renderToString` 將 `<App/>` 繪製成 HTML 字串。
- 應用程式 `build` 輸出目錄中的 `index.html` 檔案被當作範本載入。應用程式的內容會被注入到 id 為 `"root"` 的 `<div>` 元素中。接著作為 HTTP 回應傳送回去。
- `build` 目錄中的其他檔案會在瀏覽器請求時被讀取並提供。

### 步驟 3 — 建置與部署

要讓伺服器程式碼運作，您需要對它進行打包與轉譯。本節將示範如何使用 Webpack 與 Babel。接下來的下一節將示範另一種（可能更簡單的）使用 rollup.js 的方式。

在專案根目錄中建立一個名為 `.babelrc.json` 的 Babel 設定檔，並加入 `env` 與 `react-app` 預設組合。

```json
{
  "presets": ["@babel/preset-env", "@babel/preset-react"]
}
```

為伺服器建立使用 Babel Loader 轉譯程式碼的 webpack 設定檔。在專案根目錄中建立 `webpack.server.js` 檔案。

```js
const path = require('path');
module.exports = {
  entry: './server/index.js',
  externals: [
    { wasi_http: 'wasi_http' },
    { wasi_net: 'wasi_net' },
    { std: 'std' },
  ],
  output: {
    path: path.resolve('server-build'),
    filename: 'index.js',
    chunkFormat: 'module',
    library: {
      type: 'module',
    },
  },
  experiments: {
    outputModule: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader',
      },
      {
        test: /\.css$/,
        use: ['css-loader'],
      },
      {
        test: /\.svg$/,
        use: ['svg-url-loader'],
      },
    ],
  },
};
```

透過此設定，轉譯後的伺服器 bundle 會輸出到 `server-build` 資料夾，檔名為 `index.js`。

接著，在您的終端機中輸入以下命令來加入 `svg-url-loader` 套件。

```bash
npm install svg-url-loader --save-dev
```

至此完成了相依套件安裝、webpack 與 Babel 的設定。

現在，請回到 `package.json`，加入輔助的 npm 腳本。將 `dev:build-server`、`dev:start-server` 腳本加入 `package.json` 檔案，用於建置並提供 SSR 應用程式。

```json
"scripts": {
  "dev:build-server": "NODE_ENV=development webpack --config webpack.server.js --mode=development",
  "dev:start-server": "wasmedge --dir .:. wasmedge_quickjs.wasm ./server-build/index.js",
  // ...
},
```

- `dev:build-server` 腳本將環境設為 `"development"`，並使用先前建立的設定檔呼叫 webpack。
- `dev:start-server` 腳本從 `wasmedge` CLI 工具執行 WasmEdge 伺服器，以提供建置後的輸出。`wasmedge_quickjs.wasm` 程式包含 QuickJS 執行環境。[深入瞭解](hello_world.md)

現在您可以執行以下命令來建置用戶端應用程式、打包與轉譯伺服器程式碼，並於 `:8002` 啟動伺服器。

```bash
npm run build
npm run dev:build-server
npm run dev:start-server
```

在您的網頁瀏覽器中開啟 `http://localhost:8002/`，觀察您的伺服器端繪製應用程式。

先前，瀏覽器中的 HTML 原始碼只是含有 SSR 預留位置的範本。

```html
Output
<div id="root"></div>
```

現在，由於伺服器上正在執行 SSR 函式，瀏覽器中的 HTML 原始碼如下。

```html
Output
<div id="root"><div class="App" data-reactroot="">...</div></div>
```

### 步驟 4（替代方案）-- 使用 rollup.js 建置與部署

或者，您也可以使用 [rollup.js](https://rollupjs.org/guide/en/) 工具，將[所有應用程式元件與函式庫模組打包](npm.md)成單一檔案，供 WasmEdge 執行。

為伺服器建立使用 Babel Loader 轉譯程式碼的 rollup 設定檔。在專案根目錄中建立 `rollup.config.js` 檔案。

```js
const { babel } = require('@rollup/plugin-babel');
const nodeResolve = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');
const replace = require('@rollup/plugin-replace');

const globals = require('rollup-plugin-node-globals');
const builtins = require('rollup-plugin-node-builtins');
const plugin_async = require('rollup-plugin-async');
const css = require('rollup-plugin-import-css');
const svg = require('rollup-plugin-svg');

const babelOptions = {
  babelrc: false,
  presets: ['@babel/preset-react'],
  babelHelpers: 'bundled',
};

module.exports = [
  {
    input: './server/index.js',
    output: {
      file: 'server-build/index.js',
      format: 'esm',
    },
    external: ['std', 'wasi_net', 'wasi_http'],
    plugins: [
      plugin_async(),
      babel(babelOptions),
      nodeResolve({ preferBuiltins: true }),
      commonjs({ ignoreDynamicRequires: false }),
      css(),
      svg({ base64: true }),
      globals(),
      builtins(),
      replace({
        preventAssignment: true,
        'process.env.NODE_ENV': JSON.stringify('production'),
        'process.env.NODE_DEBUG': JSON.stringify(''),
      }),
    ],
  },
];
```

透過此設定，轉譯後的伺服器 bundle 會輸出到 `server-build` 資料夾，檔名為 `index.js`。

接著，將相依套件加入 `package.json`，再使用 `npm` 安裝。

```json
  "devDependencies": {
    //...
    "@rollup/plugin-babel": "^5.3.0",
    "@rollup/plugin-commonjs": "^21.0.1",
    "@rollup/plugin-node-resolve": "^7.1.3",
    "@rollup/plugin-replace": "^3.0.0",
    "rollup": "^2.60.1",
    "rollup-plugin-async": "^1.2.0",
    "rollup-plugin-import-css": "^3.0.3",
    "rollup-plugin-node-builtins": "^2.1.2",
    "rollup-plugin-node-globals": "^1.4.0",
    "rollup-plugin-svg": "^2.0.0"
  }
```

```bash
npm install
```

至此完成了相依套件安裝與 rollup 的設定。

現在，請回到 `package.json`，加入輔助的 npm 腳本。將 `dev:build-server`、`dev:start-server` 腳本加入 `package.json` 檔案，用於建置並提供 SSR 應用程式。

```json
"scripts": {
  "dev:build-server": "rollup -c rollup.config.js",
  "dev:start-server": "wasmedge --dir .:. wasmedge_quickjs.wasm ./server-build/index.js",
  // ...
},
```

- `dev:build-server` 腳本將環境設為 `"development"`，並使用先前建立的設定檔呼叫 webpack。
- `dev:start-server` 腳本從 `wasmedge` CLI 工具執行 WasmEdge 伺服器，以提供建置後的輸出。`wasmedge_quickjs.wasm` 程式包含 QuickJS 執行環境。[深入瞭解](hello_world.md)

現在您可以執行以下命令來建置用戶端應用程式、打包與轉譯伺服器程式碼，並於 `:8002` 啟動伺服器。

```bash
npm run build
npm run dev:build-server
npm run dev:start-server
```

在您的網頁瀏覽器中開啟 `http://localhost:8002/`，觀察您的伺服器端繪製應用程式。

先前，瀏覽器中的 HTML 原始碼只是含有 SSR 預留位置的範本。

```html
Output
<div id="root"></div>
```

現在，由於伺服器上正在執行 SSR 函式，瀏覽器中的 HTML 原始碼如下。

```html
Output
<div id="root"><div class="App" data-reactroot="">...</div></div>
```
