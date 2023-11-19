---
sidebar_position: 1
---

# Linux 下的快速入门

在本指南中，我们将介绍如何快速地在常规 Linux 发行版（例如 Ubuntu、Debian、Raspberry OS 或 Windows 上的 WSL）上安装和运行 WasmEdge 运行时。你可以在[此处](../install.md#install)找到更全面和其他特定操作系统的安装说明。

<!-- prettier-ignore -->
:::note
如果你使用 Docker Desktop 4.15 及以上版本，则可以跳过这一部分，可以[在此开始](quick_start_docker.md)。对于 Fedora Linux / Red Hat Linux / OpenShift / Podman 用户，可以[在此开始](quick_start_redhat.md)。
:::

我们将涵盖以下示例：

- [如何运行一个独立的 WASM 应用](#how-to-run-a-standalone-wasm-app)
- [如何运行一个 HTTP 服务器](#how-to-run-an-http-server)
- [如何运行一个 JavaScript 服务器 (node.js)](#how-to-run-a-javascript-based-server)

## 使用一行指令安装 WasmEdge

安装 WasmEdge 的最简单方式是运行以下命令。你应该具有 root 或至少 `sudo` 权限。在运行此命令之前，你的系统应该已经安装了 `git` 和 `curl`。

```bash
curl -sSf https://raw.githubusercontent.com/WasmEdge/WasmEdge/master/utils/install.sh | sudo bash -s -- -p /usr/local
```

如果你没有 root 或 `sudo` 权限，则可以使用以下命令在 `$HOME/.wasmedge` 目录中安装 WasmEdge：

```bash
curl -sSf https://raw.githubusercontent.com/WasmEdge/WasmEdge/master/utils/install.sh | bash
```

## 如何运行一个独立的 WASM 应用

Hello World 示例是一个独立的 Rust 应用程序，可由[WasmEdge CLI](../build-and-run/cli.md)执行。其源代码和构建说明可在[此处](https://github.com/second-state/rust-examples/tree/main/hello)找到。

在[此处](https://github.com/second-state/rust-examples/releases/latest/download/hello.wasm)下载 hello.wasm 文件，或运行以下命令：

```bash
wget https://github.com/second-state/rust-examples/releases/latest/download/hello.wasm
```

使用 `wasmedge` 命令来运行程序。

```bash
$ wasmedge hello.wasm
Hello WasmEdge!
```

使用 AoT 编译器 `wasmedgec` 可获得更好的性能。

```bash
$ wasmedgec hello.wasm hello_aot.wasm
$ wasmedge hello_aot.wasm
Hello WasmEdge!
```

了解更多如何在 Rust 中创建 WASM 应用

- [WasmEdge 的基本 Rust 示例](https://github.com/second-state/rust-examples)
- [Rust 开发指南](/category/develop-wasm-apps-in-rust)
  - 使用 [PyTorch](../../develop/rust/wasinn/pytorch.md), [OpenVINO](../../develop/rust/wasinn/openvino.md) 或 [Tensorflow Lite](../../develop/rust/wasinn/tensorflow_lite.md) 后端的 WASI-NN
  - [HTTP 和 HTTPS 客户端](../../develop/rust/http_service/client.md)
  - [MySQL 数据库客户端](../../develop/rust/database/my_sql_driver.md)
  - Redis 客户端
  - Kafka 客户端

## 如何运行一个 HTTP 服务器

此示例是一个使用 Rust 编写的独立 HTTP 服务器。它展示了将 Rust + WasmEdge 作为微服务的轻量级技术栈。其源代码和构建说明可在[此处](https://github.com/second-state/rust-examples/tree/main/server)找到。

在[此处](https://github.com/second-state/rust-examples/releases/latest/download/server.wasm)下载 server.wasm 文件，或运行以下命令：

```bash
wget https://github.com/second-state/rust-examples/releases/latest/download/server.wasm
```

使用 `wasmedge` 命令来运行该程序。

```bash
$ wasmedge server.wasm
Listening on http://0.0.0.0:8080
```

从另一个终端窗口执行以下步骤。

```bash
$ curl http://localhost:8080/
Try POSTing data to /echo such as: `curl localhost:8080/echo -XPOST -d 'hello world'`

$ curl http://localhost:8080/echo -X POST -d "Hello WasmEdge"
Hello WasmEdge
```

了解如何在 Rust 中创建 WASM 服务

- [Rust 开发指南](/category/develop-wasm-apps-in-rust)
- [HTTP 应用程序示例](https://github.com/WasmEdge/wasmedge_hyper_demo)
- [数据库应用程序示例](https://github.com/WasmEdge/wasmedge-db-examples)
- Rust 和 WasmEdge 中的轻量级微服务
  - [WasmEdge + Nginx + MySQL](https://github.com/second-state/microservice-rust-mysql)
  - [WasmEdge + Kafka + MySQL](https://github.com/docker/awesome-compose/tree/master/wasmedge-kafka-mysql)
  - [Dapr + WasmEdge](https://github.com/second-state/dapr-wasm)

## 如何运行基于 JavaScript 的服务器

该示例是基于 Node.js API 并使用 JavaScript 编写的独立 HTTP 服务器。它展示了如何将 WasmEdge 作为 Node.js 应用程序的轻量级运行时。其源代码可在[此处](https://github.com/second-state/wasmedge-quickjs/tree/main/example_js/docker_wasm/server)找到。

- 在[此处](https://github.com/second-state/wasmedge-quickjs/releases/download/v0.5.0-alpha/wasmedge_quickjs.wasm)下载 wasmedge_quickjs.wasm 文件，或运行以下命令：

```bash
wget https://github.com/second-state/wasmedge-quickjs/releases/download/v0.5.0-alpha/wasmedge_quickjs.wasm
```

- 在[此处](https://github.com/second-state/wasmedge-quickjs/releases/download/v0.5.0-alpha/modules.zip)下载 modules.zip 文件，或运行以下命令：

```bash
wget https://github.com/second-state/wasmedge-quickjs/releases/download/v0.5.0-alpha/modules.zip
```

将 modules.zip 文件解压到当前文件夹，保存为 `./modules/`。

```bash
unzip modules.zip
```

- 在[此处](https://raw.githubusercontent.com/second-state/wasmedge-quickjs/main/example_js/docker_wasm/server/server.js)下载 server.js 文件。

```bash
wget https://raw.githubusercontent.com/second-state/wasmedge-quickjs/main/example_js/docker_wasm/server/server.js
```

使用 `wasmedge` 命令来运行该程序。

```bash
$ wasmedge --dir .:. wasmedge_quickjs.wasm server.js
Listening on 8080 ...
```

从另一个终端窗口执行以下步骤。

```bash
$ curl http://localhost:8080/echo -X POST -d "Hello WasmEdge"
Hello WasmEdge
```

了解如何在 WasmEdge 中运行 JavaScript 应用程序。

- [WasmEdge QuickJS runtime](https://github.com/second-state/wasmedge-quickjs)
- [AI 推理应用示例](https://github.com/second-state/wasmedge-quickjs/tree/main/example_js/tensorflow_lite_demo)
- [使用 fetch() 的 Web 服务客户端示例](https://github.com/second-state/wasmedge-quickjs/blob/main/example_js/wasi_http_fetch.js)

## 下一步

- 查看所有可用的[WasmEdge CLI选项](../build-and-run/cli.md)以探索 WasmEdge 的功能。
- 用你喜欢的语言编写 WASM 应用，如 [Rust](/category/develop-wasm-apps-in-rust)、[C/C++](/category/develop-wasm-apps-in-cc)、[JavaScript](/category/develop-wasm-apps-in-javascript)、[Go](/category/develop-wasm-apps-in-go) 等其他语言。
