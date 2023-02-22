---
sidebar_position: 1
---

# 5.3.1 Client


The `fetch` API is widely used in browser and node-based JavaScript applications to fetch content over the network. Building on top of its non-blocking async network socket API, the WasmEdge QuickJS runtime supports the `fetch` API. That makes a lot of JS APIs and modules reusable out of the box.

## Prerequisites

* [WasmEdge installed](../../build-and-run/install)
* Download the WasmEdge QuickJS Runtime

```bash
curl -OL https://github.com/second-state/wasmedge-quickjs/releases/download/v0.4.0-alpha/wasmedge_quickjs.wasm
```


## Run the example

We take the [example_js/wasi_http_fetch.js](https://github.com/second-state/wasmedge-quickjs/blob/main/example_js/wasi_http_fetch.js) example demonstrates how to use the `fetch` API in WasmEdge. 

First, git clone or fork the [wasmedge-quickjs](https://github.com/second-state/wasmedge-quickjs/) Github repo.

```bash
git clone https://github.com/second-state/wasmedge-quickjs
```

To run this example, use the following WasmEdge CLI command.

```bash
wasmedge --dir .:. /path/to/wasmedge_quickjs.wasm example_js/wasi_http_fetch.js
```

You can see the HTTP responses printed to the console.

## Code explanation

The [example_js/wasi_http_fetch.js](https://github.com/second-state/wasmedge-quickjs/blob/main/example_js/wasi_http_fetch.js) example demonstrates how to use the `fetch` API in WasmEdge. The code snippet below shows an async HTTP GET from the `httpbin.org` test server. While the program waits for and processes the GET content, it can start another request.

```javascript
async function test_fetch() {
  try {
    let r = await fetch('http://httpbin.org/get?id=1')
    print('test_fetch\n', await r.text())
  } catch (e) {
    print(e)
  }
}
test_fetch()
```

The code snippet below shows how to do an sync HTTP POST to a remote server.

```javascript
async function test_fetch_post() {
  try {
    let r = await fetch("http://httpbin.org/post", { method: 'post', 'body': 'post_body' })
    print('test_fetch_post\n', await r.text())
  } catch (e) {
    print(e)
  }
}
test_fetch_post()
```

An async HTTP PUT request is as follows.

```javascript
async function test_fetch_put() {
  try {
    let r = await fetch("http://httpbin.org/put",
      {
        method: "put",
        body: JSON.stringify({ a: 1 }),
        headers: { 'Context-type': 'application/json' }
      })
    print('test_fetch_put\n', await r.text())
  } catch (e) {
    print(e)
  }
}
test_fetch_put()
```

## Beyond the `fetch` API

The WasmEdge runtime goes beyond the Node.js API. With the `WasiTcpServer` API, it can create a server that accepts non-HTTP requests. The [example_js/wasi_net_echo.js](https://github.com/second-state/wasmedge-quickjs/blob/main/example_js/wasi_net_echo.js) example shows you how to this.

The TCP client uses WasmEdge's `WasiTcpConn` API to send in a request and receive the echoed response.

```javascript
async function connect_test() {
  try {
    let ss = await net.WasiTcpConn.connect('127.0.0.1:8000')
    ss.write('hello');
    let msg = await ss.read() || "";
    print('client recv:', new TextDecoder().decode(msg));
  } catch (e) {
    print('client catch:', e);
  } finally {
    nextTick(() => {
      exit(0)
    })
  }
}

connect_test();
```

To run this example, use the following WasmEdge CLI command.

```bash
wasmedge --dir .:. /path/to/wasmedge_quickjs.wasm example_js/wasi_net_echo.js
```
