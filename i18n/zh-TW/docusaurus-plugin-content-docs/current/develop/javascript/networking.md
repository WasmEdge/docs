---
sidebar_position: 3
---

# 網路

QuickJS WasmEdge Runtime 透過 WasmEdge 的[網路 socket 擴充功能](https://github.com/second-state/wasmedge_wasi_socket)支援 Node.js 的 `http` 與 `fetch` API。這讓 WasmEdge 開發者能夠在 JavaScript 中建立 HTTP 伺服器與用戶端，以及 TCP/IP 伺服器與用戶端應用程式。

WasmEdge 中的網路 API 為非阻塞式，因此可支援非同步的 I/O 密集型應用程式。透過此 API，JavaScript 程式可以同時開啟多個連線，並對這些連線進行輪詢，或註冊非同步回呼函式以在資料到達時處理資料，而無需等待任何單一連線完成其資料傳輸。這讓單一執行緒的應用程式得以處理多個並行請求。

- [先決條件](#prerequisites)
- [Fetch 用戶端](#fetch-client)
- [HTTP 伺服器](#http-server)
- [TCP 伺服器與用戶端](#tcp-server-and-client)

## 先決條件

[安裝 WasmEdge](../../start/install.md)。若要發送 HTTPS 請求，請安裝 [WasmEdge TLS 外掛](../../start/install.md#install-wasmedge-with-plug-ins)。

[安裝 WasmEdge-QuickJS](./hello_world#prerequisites)。請確認 `modules` 目錄位於您打算執行 `wasmedge` 命令的本機目錄中。

## Fetch 用戶端

`fetch` API 廣泛用於瀏覽器及基於 node 的 JavaScript 應用程式，用以透過網路取得內容。WasmEdge QuickJS 執行環境建立在其非阻塞、非同步的網路 socket API 之上，並支援 `fetch` API。這使得許多 JS API 與模組可以開箱即用。

[example_js/wasi_http_fetch.js](https://github.com/second-state/wasmedge-quickjs/blob/main/example_js/wasi_http_fetch.js) 範例示範如何在 WasmEdge 中使用 `fetch` API。

```bash
wasmedge --dir .:. wasmedge_quickjs.wasm example_js/wasi_http_fetch.js
```

完成程式中所有的 HTTP 請求需要幾秒鐘的時間。一旦完成，您會看到 HTTP 回應被列印到主控台。讓我們來看看 `wasi_http_fetch.js` JavaScript 程式是如何運作的。

下方的程式碼片段示範對 `httpbin.org` 測試伺服器進行非同步 HTTP GET。當程式在等待並處理 GET 內容時，可以開始另一個請求。

```javascript
async function test_fetch() {
  try {
    let r = await fetch('http://httpbin.org/get?id=1');
    print('test_fetch\n', await r.text());
  } catch (e) {
    print(e);
  }
}
test_fetch();
```

下方的程式碼片段示範如何向遠端伺服器發送非同步的 HTTP POST。

```javascript
async function test_fetch_post() {
  try {
    let r = await fetch('http://httpbin.org/post', {
      method: 'post',
      body: 'post_body',
    });
    print('test_fetch_post\n', await r.text());
  } catch (e) {
    print(e);
  }
}
test_fetch_post();
```

非同步的 HTTP PUT 請求範例如下。

```javascript
async function test_fetch_put() {
  try {
    let r = await fetch('http://httpbin.org/put', {
      method: 'put',
      body: JSON.stringify({ a: 1 }),
      headers: { 'Context-type': 'application/json' },
    });
    print('test_fetch_put\n', await r.text());
  } catch (e) {
    print(e);
  }
}
test_fetch_put();
```

## HTTP 伺服器

如果您想在 WasmEdge 執行環境中執行微服務，就必須以它建立 HTTP 伺服器。[example_js/wasi_http_echo.js](https://github.com/second-state/wasmedge-quickjs/blob/main/example_js/wasi_http_server.js) 範例示範如何使用相容於 Node.js 的 API 建立一個監聽 8001 連接埠的 HTTP 伺服器。

```bash
wasmedge --dir .:. wasmedge_quickjs.wasm example_js/wasi_http_server.js
```

使用以下 `curl` 命令向伺服器發送 HTTP POST 請求。它會在任何傳入的請求前方加上「echo:」，並將其作為回應送回。

```bash
$ curl -d "WasmEdge" -X POST http://localhost:8001/
echo:WasmEdge
```

HTTP 伺服器的 JavaScript 原始碼如下。

```javascript
import { createServer, request, fetch } from 'http';

createServer((req, resp) => {
  req.on('data', (body) => {
    resp.write('echo:');
    resp.end(body);
  });
}).listen(8001, () => {
  print('listen 8001 ...\n');
});
```

## TCP 伺服器與用戶端

WasmEdge 執行環境超越了 Node.js API。`WasiTcpServer` API 可以建立一個接受非 HTTP 請求的伺服器。[example_js/wasi_net_echo.js](https://github.com/second-state/wasmedge-quickjs/blob/main/example_js/wasi_net_echo.js) 範例示範如何建立 TCP 伺服器，並接著建立 TCP 用戶端向其發送請求。

```bash
$ wasmedge --dir .:. wasmedge_quickjs.wasm example_js/wasi_net_echo.js
listen 8000 ...
server accept: 127.0.0.1:49040
server recv: hello
client recv: echo:hello
```

`wasi_net_echo.js` 中的 TCP 伺服器如下。

```javascript
import * as net from 'wasi_net';
import { TextDecoder } from 'util';

async function server_start() {
  print('listen 8000 ...');
  try {
    let s = new net.WasiTcpServer(8000);
    for (var i = 0; i < 100; i++) {
      let cs = await s.accept();
      handle_client(cs);
    }
  } catch (e) {
    print('server accept error:', e);
  }
}

server_start();
```

`handle_client()` 函式包含了處理並回應傳入請求的邏輯。在此函式中，您需要自行讀取並解析請求中的資料串流。在此範例中，它只是將資料加上前綴後回送。

```javascript
async function handle_client(cs) {
  print('server accept:', cs.peer());
  try {
    while (true) {
      let d = await cs.read();
      if (d == undefined || d.byteLength <= 0) {
        break;
      }
      let s = new TextDecoder().decode(d);
      print('server recv:', s);
      cs.write('echo:' + s);
    }
  } catch (e) {
    print('server handle_client error:', e);
  }
  print('server: conn close');
}
```

TCP 用戶端使用 WasmEdge 的 `WasiTcpConn` API 傳送請求並接收回送的回應。

```javascript
async function connect_test() {
  try {
    let ss = await net.WasiTcpConn.connect('127.0.0.1:8000');
    ss.write('hello');
    let msg = (await ss.read()) || '';
    print('client recv:', new TextDecoder().decode(msg));
  } catch (e) {
    print('client catch:', e);
  } finally {
    nextTick(() => {
      exit(0);
    });
  }
}

connect_test();
```

藉由非同步的 HTTP 網路功能，開發者可以使用 JavaScript 建立 I/O 密集型應用程式（例如資料庫驅動的微服務），並安全、有效率地在 WasmEdge 中執行它們。
