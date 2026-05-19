---
sidebar_position: 5
---

# 在 Docker 中使用 WasmEdge

## 什麼是 WasmEdge DockerSlim

在 Docker 生態系中執行 WebAssembly 應用程式的簡易方式之一,是將 WebAssembly 位元組碼檔案嵌入 Linux 容器映像檔中。準確來說,我們將容器內部的 Linux 作業系統精簡到剛好足以支援 `wasmedge` 執行環境的程度。這種方法有許多優點。

- 由於 WebAssembly 應用程式包裝在常規容器中,因此可與任何 Docker 或容器生態系工具無縫協作。
- 整個 Linux 作業系統與 WasmEdge 映像檔的記憶體佔用可降低至最低 4MB。
- 精簡後的 Linux 作業系統攻擊面比一般 Linux 作業系統大幅減少。
- 整體應用程式安全性由 WebAssembly 沙箱管理。由於 WebAssembly 沙箱僅能存取明確宣告的功能,因此軟體供應鏈攻擊風險大幅降低。
- 若應用程式較為複雜,上述三項優點將被放大。例如,WasmEdge AI 推論應用程式不需要安裝 Python,WasmEdge node.js 應用程式不需要安裝 Node.js 與 v8。

不過,此方法仍需要啟動 Linux 容器。容器化的 Linux 作業系統雖然精簡,仍佔據整個映像檔大小的 80%。仍有許多最佳化空間。此方法的效能與安全性將不如直接在 [crun](/develop/deploy/oci-runtime/crun.md) 或 [containerd shim](/develop/deploy/cri-runtime/containerd.md) 中執行 WebAssembly 應用程式那麼出色。

## WasmEdge DockerSlim

`wasmedge/slim:{version}` Docker 映像檔在每次發佈時都會提供使用 [DockerSlim](https://dockersl.im) 建置的精簡 WasmEdge 映像檔。

- 映像檔 `wasmedge/slim-runtime:{version}` 僅包含 WasmEdge 執行環境與 `wasmedge` 命令。
- 映像檔 `wasmedge/slim:{version}` 包含下列命令列工具:
  - `wasmedge`
  - `wasmedgec`
- 映像檔 `wasmedge/slim-tf:{version}` 包含下列命令列工具:
  - `wasmedge`
  - `wasmedgec`
  - `wasmedge-tensorflow-lite`
  - `wasmedge-tensorflow`
  - `show-tflite-tensor`
- 發佈版 docker 映像檔的工作目錄為 `/app`。

## 執行一個簡單的 WebAssembly 應用程式

我們可以使用 Docker 執行一個簡單的 WebAssembly 程式。安裝了 WasmEdge 的精簡 Linux 映像檔僅 4MB,而一般用於原生編譯應用程式的 Linux 映像檔則為 30MB。Linux + WasmEdge 映像檔類似 unikernel 作業系統映像檔。它將 WebAssembly 應用程式的佔用空間、效能負擔與潛在攻擊面降到最低。

[範例應用程式在此](https://github.com/second-state/wasm-learning/tree/master/cli/wasi)。首先,根據我們發佈的映像檔建立 `Dockerfile`。將 [wasm 應用程式檔案](https://github.com/second-state/wasm-learning/raw/master/cli/wasi/wasi_example_main.wasm)納入新的映像檔,並於啟動時執行 `wasmedge` 命令。

```shell
FROM wasmedge/slim-runtime:0.10.1
ADD wasi_example_main.wasm /
CMD ["wasmedge", "--dir", ".:/", "/wasi_example_main.wasm"]
```

在 Docker CLI 中執行 WebAssembly 應用程式的方式如下。

```shell
$ docker build -t wasmedge/myapp -f Dockerfile ./
... ...
Successfully tagged wasmedge/myapp:latest

$ docker run --rm wasmedge/myapp
Random number: -807910034
Random bytes: [113, 123, 78, 85, 63, 124, 68, 66, 151, 71, 91, 249, 242, 160, 164, 133, 35, 209, 106, 143, 202, 87, 147, 87, 236, 49, 238, 165, 125, 175, 172, 114, 136, 205, 200, 176, 30, 122, 149, 21, 39, 58, 221, 102, 165, 179, 124, 13, 60, 166, 188, 127, 83, 95, 145, 0, 25, 209, 226, 190, 10, 184, 139, 191, 243, 149, 197, 85, 186, 160, 162, 156, 181, 74, 255, 99, 203, 161, 108, 153, 90, 155, 247, 183, 106, 79, 48, 255, 172, 17, 193, 36, 245, 195, 170, 202, 119, 238, 104, 254, 214, 227, 149, 20, 8, 147, 105, 227, 114, 146, 246, 153, 251, 139, 130, 1, 219, 56, 228, 154, 146, 203, 205, 56, 27, 115, 79, 254]
Printed from wasi: This is from a main function
This is from a main function
The env vars are as follows.
The args are as follows.
wasi_example_main.wasm
File content is This is in a file
```

## 執行一個 HTTP 伺服器應用程式

我們可以使用 Docker CLI 執行一個簡單的 WebAssembly 微服務 HTTP 伺服器。[範例應用程式在此](https://github.com/second-state/wasmedge_wasi_socket/tree/main/examples/http_server)。請依照說明編譯並建置 `http_server.wasm` 檔案。

根據我們發佈的映像檔建立 `Dockerfile`。將 `http_server.wasm` 應用程式檔案納入新的映像檔中,並在啟動時執行 `wasmedge` 命令。

```shell
FROM wasmedge/slim-runtime:0.10.1
ADD http_server.wasm /
CMD ["wasmedge", "--dir", ".:/", "/http_server.wasm"]
```

在 Docker CLI 中執行 WebAssembly 伺服器應用程式的方式如下。請注意,我們將容器的伺服器連接埠對應到主機。

```shell
$ docker build -t wasmedge/myapp -f Dockerfile ./
... ...
Successfully tagged wasmedge/myapp:latest

$ docker run --rm -p 1234:1234 wasmedge/myapp
new connection at 1234
```

現在你可以從另一個終端機存取此伺服器。

```shell
$ curl -X POST http://127.0.0.1:1234 -d "name=WasmEdge"
echo: name=WasmEdge
```

## 執行一個輕量化的 Node.js 伺服器

藉由 WasmEdge QuickJS 對 Node.js API 的支援,我們可以從 Docker CLI 執行一個輕量且安全的 node.js 伺服器。精簡的 Linux + WasmEdge + Node.js 支援映像檔大小不到 15MB,而標準 Node.js 映像檔則超過 350MB。你需要進行以下操作。

- 從這裡[下載 WasmEdge QuickJS 執行環境](https://github.com/second-state/wasmedge-quickjs/releases/download/v0.4.0-alpha/wasmedge_quickjs.wasm)。你將取得 `wasmedge_quickjs.wasm` 檔案。
- 從 WasmEdge QuickJS 儲存庫下載 [modules](https://github.com/second-state/wasmedge-quickjs/tree/main/modules) 目錄。
- 為伺服器建立一個 JavaScript 檔案。下方為你可以使用的 `http_echo.js` 範例檔案。

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

將這些檔案加入 Docker 映像檔,並於啟動時執行 JavaScript 檔案。

```shell
FROM wasmedge/slim-runtime:0.10.1
ADD wasmedge_quickjs.wasm /
ADD http_echo.js /
ADD modules /modules
CMD ["wasmedge", "--dir", ".:/", "/wasmedge_quickjs.wasm", "http_echo.js"]
```

從 Docker CLI 啟動伺服器。

```shell
$ docker build -t wasmedge/myapp -f Dockerfile ./
... ...
Successfully tagged wasmedge/myapp:latest

$ docker run --rm -p 8001:8001 wasmedge/myapp
listen 8001 ...
```

現在你可以從另一個終端機存取此伺服器。

```shell
$ curl -X POST http://127.0.0.1:8001 -d "WasmEdge"
echo:WasmEdge
```

## 執行一個輕量化的 Tensorflow 推論應用程式

WasmEdge 執行環境的一項獨特而強大的特性是其對 AI 框架的支援。在此範例中,我們將示範如何從 Docker CLI 執行影像辨識服務。[範例應用程式在此](https://github.com/WasmEdge/wasmedge_hyper_demo/tree/main/server-tflite)。首先,根據我們的 `tensorflow` 發佈版映像檔建立 `Dockerfile`。將 [wasm 應用程式檔案](https://github.com/WasmEdge/wasmedge_hyper_demo/raw/main/server-tflite/wasmedge_hyper_server_tflite.wasm)納入新的映像檔中,並於啟動時執行 `wasmedge-tensorflow-lite` 命令。

Dockerfile 如下。整個套件為 115MB。少於一般 Linux + Python + Tensorflow 安裝的 1/4。

```shell
FROM wasmedge/slim-tf:0.10.1
ADD wasmedge_hyper_server_tflite.wasm /
CMD ["wasmedge-tensorflow-lite", "--dir", ".:/", "/wasmedge_hyper_server_tflite.wasm"]
```

從 Docker CLI 啟動伺服器。

```shell
$ docker build -t wasmedge/myapp -f Dockerfile ./
... ...
Successfully tagged wasmedge/myapp:latest

$ docker run --rm -p 3000:3000 wasmedge/myapp
listen 3000 ...
```

現在你可以從另一個終端機存取此伺服器。

```shell
$ curl http://localhost:3000/classify -X POST --data-binary "@grace_hopper.jpg"
military uniform is detected with 206/255 confidence
```
