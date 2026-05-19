---
sidebar_position: 1
---

# 在 Linux 上快速入門

在本指南中,我們將引導您快速地在一般 Linux 發行版(例如 Ubuntu、Debian、Raspberry OS 或 Windows 上的 WSL)安裝並執行 WasmEdge Runtime。完整且各作業系統專屬的安裝說明請參考 [此處](../install.md#install)。

<!-- prettier-ignore -->
:::note
如果您有 Docker Desktop 4.15 以上版本,可以略過本節,改從 [這裡開始](quick_start_docker.md)。對於 Fedora Linux / Red Hat Linux / OpenShift / Podman 使用者,請從 [這裡開始](quick_start_redhat.md)。
:::

我們將涵蓋以下範例:

- [如何執行獨立的 WASM 應用程式](#how-to-run-a-standalone-wasm-app)
- [如何執行 HTTP 伺服器](#how-to-run-an-http-server)
- [如何執行 JavaScript 伺服器 (node.js)](#how-to-run-a-javascript-based-server)

## 一行指令安裝 WasmEdge

安裝 WasmEdge 最簡單的方式是執行以下指令。您應有 root 或至少 `sudo` 權限。您的系統需要先安裝 `git` 與 `curl` 作為先決條件。

```bash
curl -sSf https://raw.githubusercontent.com/WasmEdge/WasmEdge/master/utils/install.sh | sudo bash -s -- -p /usr/local
```

如果您沒有 root 或 `sudo` 權限,請使用以下指令將 WasmEdge 安裝到您的 `$HOME/.wasmedge` 目錄:

```bash
curl -sSf https://raw.githubusercontent.com/WasmEdge/WasmEdge/master/utils/install.sh | bash
```

## 如何執行獨立的 WASM 應用程式

Hello world 範例是一個獨立的 Rust 應用程式,可以透過 [WasmEdge CLI](../build-and-run/cli.md) 執行。其原始碼與建置說明請參考 [此處](https://github.com/second-state/rust-examples/tree/main/hello)。

從 [此處](https://github.com/second-state/rust-examples/releases/latest/download/hello.wasm) 下載 hello.wasm 檔案,或執行以下指令:

```bash
wget https://github.com/second-state/rust-examples/releases/latest/download/hello.wasm
```

使用 `wasmedge` 指令執行程式。

```bash
$ wasmedge hello.wasm
Hello WasmEdge!
```

使用 AoT 編譯器 `wasmedgec` 取得更佳效能。

```bash
$ wasmedgec hello.wasm hello_aot.wasm
$ wasmedge hello_aot.wasm
Hello WasmEdge!
```

了解更多以 Rust 建立 WASM 應用程式的方式

- [WasmEdge 的基本 Rust 範例](https://github.com/second-state/rust-examples)
- [Rust 開發者指南](/category/develop-wasm-apps-in-rust)
  - WASI-NN 搭配 [PyTorch](../../develop/rust/wasinn/pytorch.md)、[OpenVINO](../../develop/rust/wasinn/openvino.md) 或 [Tensorflow Lite](../../develop/rust/wasinn/tensorflow_lite.md) 後端
  - [HTTP 與 HTTPS 用戶端](../../develop/rust/http_service/client.md)
  - [MySQL 資料庫用戶端](../../develop/rust/database/my_sql_driver.md)
  - Redis 用戶端
  - Kafka 用戶端

## 如何執行 HTTP 伺服器

此範例是一個以 Rust 撰寫的獨立 HTTP 伺服器。它展示了 Rust + WasmEdge 作為微服務輕量堆疊的能力。其原始碼與建置說明請參考 [此處](https://github.com/second-state/rust-examples/tree/main/server)。

從 [此處](https://github.com/second-state/rust-examples/releases/latest/download/server.wasm) 下載 server.wasm 檔案,或執行以下指令:

```bash
wget https://github.com/second-state/rust-examples/releases/latest/download/server.wasm
```

使用 `wasmedge` 指令執行程式。

```bash
$ wasmedge server.wasm
Listening on http://0.0.0.0:8080
```

從另一個終端機視窗,執行以下指令。

```bash
$ curl http://localhost:8080/
Try POSTing data to /echo such as: `curl localhost:8080/echo -XPOST -d 'hello world'`

$ curl http://localhost:8080/echo -X POST -d "Hello WasmEdge"
Hello WasmEdge
```

了解更多以 Rust 建立 WASM 服務的方式

- [Rust 開發者指南](/category/develop-wasm-apps-in-rust)
- [HTTP 應用程式範例](https://github.com/WasmEdge/wasmedge_hyper_demo)
- [資料庫應用程式範例](https://github.com/WasmEdge/wasmedge-db-examples)
- 以 Rust 與 WasmEdge 建立的輕量微服務
  - [WasmEdge + Nginx + MySQL](https://github.com/second-state/microservice-rust-mysql)
  - [WasmEdge + Kafka + MySQL](https://github.com/docker/awesome-compose/tree/master/wasmedge-kafka-mysql)
  - [Dapr + WasmEdge](https://github.com/second-state/dapr-wasm)

## 如何執行基於 JavaScript 的伺服器

此範例是一個使用 node.js API 以 JavaScript 撰寫的獨立 HTTP 伺服器。它展示了 WasmEdge 作為 node.js 應用程式輕量執行環境的能力。其原始碼請參考 [此處](https://github.com/second-state/wasmedge-quickjs/tree/main/example_js/docker_wasm/server)。

- 從 [此處](https://github.com/second-state/wasmedge-quickjs/releases/download/v0.5.0-alpha/wasmedge_quickjs.wasm) 下載 wasmedge_quickjs.wasm 檔案,或執行以下指令:

```bash
wget https://github.com/second-state/wasmedge-quickjs/releases/download/v0.5.0-alpha/wasmedge_quickjs.wasm
```

- 從 [此處](https://github.com/second-state/wasmedge-quickjs/releases/download/v0.5.0-alpha/modules.zip) 下載 modules.zip 檔案,或執行以下指令:

```bash
wget https://github.com/second-state/wasmedge-quickjs/releases/download/v0.5.0-alpha/modules.zip
```

將 modules.zip 檔案解壓縮到目前資料夾中作為 `./modules/`。

```bash
unzip modules.zip
```

- 從 [此處](https://raw.githubusercontent.com/second-state/wasmedge-quickjs/main/example_js/docker_wasm/server/server.js) 下載 server.js 檔案。

```bash
wget https://raw.githubusercontent.com/second-state/wasmedge-quickjs/main/example_js/docker_wasm/server/server.js
```

使用 `wasmedge` 指令執行程式。

```bash
$ wasmedge --dir .:. wasmedge_quickjs.wasm server.js
listen 8080 ...
```

從另一個終端機視窗,執行以下指令。

```bash
$ curl http://localhost:8080/echo -X POST -d "Hello WasmEdge"
Hello WasmEdge
```

了解更多在 WasmEdge 中執行 JavaScript 應用程式的方式。

- [WasmEdge QuickJS 執行環境](https://github.com/second-state/wasmedge-quickjs)
- [AI 推論應用程式範例](https://github.com/second-state/wasmedge-quickjs/tree/main/example_js/tensorflow_lite_demo)
- [使用 fetch() 的 Web 服務用戶端範例](https://github.com/second-state/wasmedge-quickjs/blob/main/example_js/wasi_http_fetch.js)

## 下一步

- 查看所有可用的 [WasmEdge CLI 選項](../build-and-run/cli.md),探索 WasmEdge 的功能。
- 以您慣用的語言撰寫 WASM 應用程式,例如 [Rust](/category/develop-wasm-apps-in-rust)、[C/C++](/category/develop-wasm-apps-in-cc)、[JavaScript](/category/develop-wasm-apps-in-javascript)、[Go](/category/develop-wasm-apps-in-go) 等多種語言。
