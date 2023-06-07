---
sidebar_position: 3
---

# Networking

The QuickJS WasmEdge Runtime supports Node.js's `http` and `fetch` APIs via the WasmEdge [networking socket extension](https://github.com/second-state/wasmedge_wasi_socket). That enables WasmEdge developers to create HTTP server and client, as well as TCP/IP server and client, applications in JavaScript.

The networking API in WasmEdge is non-blocking and hence supports asynchronous I/O intensive applications. With this API, the JavaScript program can open multiple connections concurrently. It polls those connections, or registers async callback functions, to process data whenever data comes in, without waiting for any one connection to complete its data transfer. That allows the single-threaded application to handle multiple multiple concurrent requests.

- [Fetch client](#fetch-client)
- [HTTP server](#http-server)
- [TCP server and client](#tcp-server-and-client)

## Prerequisites

[See here](./hello_world#prerequisites)

## Fetch client

The `fetch` API is widely used in browser and node-based JavaScript applications to fetch content over the network. Building on top of its non-blocking async network socket API, the WasmEdge QuickJS runtime supports the `fetch` API. That makes a lot of JS APIs and modules reusable out of the box.

The [example_js/wasi_http_fetch.js](https://github.com/second-state/wasmedge-quickjs/blob/main/example_js/wasi_http_fetch.js) example demonstrates how to use the `fetch` API in WasmEdge.

```bash
wasmedge --dir .:. wasmedge_quickjs.wasm example_js/wasi_http_fetch.js
```

It takes a few seconds to completes all the HTTP requests in the program. You will see the HTTP responses printed to the console once they are done. Now, let's look into how the `wasi_http_fetch.js` JavaScript program works.

The code snippet below shows an async HTTP GET from the `httpbin.org` test server. While the program waits for and processes the GET content, it can start another request.

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

The code snippet below shows how to do an sync HTTP POST to a remote server.

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

An async HTTP PUT request is as follows.

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

## HTTP server

If you want to run microservices in the WasmEdge runtime, you will need to create a HTTP server with it. The [example_js/wasi_http_echo.js](https://github.com/second-state/wasmedge-quickjs/blob/main/example_js/wasi_http_server.js) example shows you how to create an HTTP server listening on port 8001 using Node.js compatible APIs.

```bash
wasmedge --dir .:. wasmedge_quickjs.wasm example_js/wasi_http_server.js
```

Use the following `curl` command to send an HTTP POST request to the server. It prepends "echo:" to any incoming request and sends it back as the response.

```bash
$ curl -d "WasmEdge" -X POST http://localhost:8001/
echo:WasmEdge
```

The JavaScript source code of the HTTP server is as follows.

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

## TCP server and client

The WasmEdge runtime goes beyond the Node.js API. With the `WasiTcpServer` API, it can create a server that accepts non-HTTP requests. The [example_js/wasi_net_echo.js](https://github.com/second-state/wasmedge-quickjs/blob/main/example_js/wasi_net_echo.js) example shows you how to create a TCP server and then create a TCP client to send a request to it.

```bash
$ wasmedge --dir .:. wasmedge_quickjs.wasm example_js/wasi_net_echo.js
listen 8000 ...
server accept: 127.0.0.1:49040
server recv: hello
client recv: echo:hello
```

The TCP server in `wasi_net_echo.js` is as follows.

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

The `handle_client()` function contains the logic on how to process and respond to the incoming request. You will need to read and parse the data stream in the request yourself in this function. In this example, it simply echoes the data back with a prefix.

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

The TCP client uses WasmEdge's `WasiTcpConn` API to send in a request and receive the echoed response.

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

With async HTTP networking, developers can create I/O intensive applications, such as database-driven microservices, in JavaScript and run them safely and efficiently in WasmEdge.
