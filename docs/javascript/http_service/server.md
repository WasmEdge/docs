---
sidebar_position: 2
---

# 5.3.2 Server


## Work in progress

If you want to run microservices in the WasmEdge runtime, you will need to create a HTTP server with it. The [example_js/wasi_http_echo.js](https://github.com/second-state/wasmedge-quickjs/blob/main/example_js/wasi_http_echo.js) example shows you how to create an HTTP server listening on port 8001 using Node.js compatible APIs. It prepends "echo:" to any incoming request and sends it back as the response.

```javascript
import { createServer, request, fetch } from 'http';

createServer((req, resp) => {
  req.on('data', (body) => {
    resp.write('echo:')
    resp.end(body)
  })
}).listen(8001, () => {
  print('listen 8001 ...\n');
})
```