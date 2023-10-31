---
sidebar_position: 3
---

# Red Hat 快速入门

在本指南中，我们将指导你如何在 Fedora / CentOS / Red Hat Linux / OpenShift 系统中快速运行 WasmEdge 应用程序。整个开发和运行环境由 OpenSift / Podman 管理，因此不需要额外的依赖。

<!-- prettier-ignore -->
:::note
如果你不使用 OpenShift / Podman，请[从这里开始](quick_start.md)。
:::

我们将涵盖以下示例。

- [运行独立的 WASM 应用](#运行独立的-wasm-应用)
- [运行 HTTP 服务器](#运行一个 HTTP 服务器)
- [运行基于 JavaScript 的服务器 (node.js)](#运行一个基于 JavaScript 的服务器)

## 安装

你可以使用一行 `dnf` 命令在 Fedora / CentOS / Red Hat Linux 系统上安装 WasmEdge，[crun](https://github.com/containers/crun) 和 [Podman](https://www.redhat.com/en/topics/containers/what-is-podman)。WasmEdge 运行时是 Fedora 37 和 Red Hat REPL 8、9 的[官方维护上游包](https://packages.fedoraproject.org/pkgs/wasmedge/wasmedge/index.html)。

```bash
dnf install wasmedge crun-wasm podman
```

## 运行独立的 WASM 应用程序

Hello world 示例是一个独立的 Rust 应用程序。其源代码和构建说明可在[此处](https://github.com/second-state/rust-examples/tree/main/hello)找到。

使用 Podman 运行容器化的 WASM 应用。WASM 容器镜像存储在 Docker Hub 中，其镜像大小仅为 500KB。该镜像可在 Red Hat 支持的任何 OS 和 CPU 平台上运行。

```bash
$ podman --runtime /usr/bin/crun-wasm run --platform=wasi/wasm -t --rm docker.io/secondstate/rust-example-hello:latest
Hello WasmEdge!
```

了解如何在 Rust 中创建 WASM 应用的更多信息

- [WasmEdge 的基本 Rust 示例](https://github.com/second-state/rust-examples)
- [Rust 开发人员指南](/category/develop-wasm-apps-in-rust)
  - 使用 [PyTorch](../../develop/rust/wasinn/pytorch.md)、[OpenVINO](../../develop/rust/wasinn/openvino.md) 或 [Tensorflow Lite](../../develop/rust/wasinn/tensorflow_lite.md) 后端的 WASI-NN
  - [HTTP 和 HTTPS 客户端](../../develop/rust/http_service/client.md)
  - [MySQL 数据库客户端](../../develop/rust/database/my_sql_driver.md)
  - Redis 客户端
  - Kafka 客户端

## 运行 HTTP 服务器

该示例是一个独立的用 Rust 编写的 HTTP 服务器。它演示了 Rust + WasmEdge 作为微服务的轻量级技术栈。其源代码和构建说明可在[此处](https://github.com/second-state/rust-examples/tree/main/server)找到。

使用 Podman 从 Docker Hub 拉取容器镜像（大约 800KB），然后在 WasmEdge 容器中运行它。容器作为服务器启动。请注意，我们将容器的端口 8080 映射到本地主机的端口 8080，以使服务器从 WASM 容器外部访问。

```bash
$ podman --runtime /usr/bin/crun-wasm run -dp 8080:8080 --platform=wasi/wasm -t --rm docker.io/secondstate/rust-example-server:latest
Listening on http://0.0.0.0:8080
```

从另一个终端窗口执行以下命令。

```bash
$ curl http://localhost:8080/
Try POSTing data to /echo such as: `curl localhost:8080/echo -XPOST -d 'hello world'`

$ curl http://localhost:8080/echo -X POST -d "Hello WasmEdge"
Hello WasmEdge
```

了解如何在 Rust 中创建 WASM 服务的更多信息

- [Rust 开发者指南](/category/develop-wasm-apps-in-rust)
- [HTTP 应用示例](https://github.com/WasmEdge/wasmedge_hyper_demo)
- [数据库应用示例](https://github.com/WasmEdge/wasmedge-db-examples)
- Rust 和 WasmEdge 中的轻量级微服务
  - [WasmEdge + Nginx + MySQL](https://github.com/second-state/microservice-rust-mysql)
  - [WasmEdge + Kafka + MySQL](https://github.com/docker/awesome-compose/tree/master/wasmedge-kafka-mysql)
  - [Dapr + WasmEdge](https://github.com/second-state/dapr-wasm)

## 运行基于 JavaScript 的服务器

此示例是使用 Node.js API 编写的独立 HTTP 服务器，演示了 WasmEdge 作为零依赖和可移动的 Node.js 应用的轻量级运行时。其源代码可在[此处](https://github.com/second-state/wasmedge-quickjs/tree/main/example_js/docker_wasm/server)找到。

```bash
$ podman --runtime /usr/bin/crun-wasm run -dp 8080:8080 --platform=wasi/wasm -t --rm docker.io/secondstate/node-example-server:latest
... ...
```

从另一个终端窗口执行以下命令。

```bash
$ curl http://localhost:8080/echo -X POST -d "Hello WasmEdge"
Hello WasmEdge
```

了解如何在 WasmEdge 中运行 JavaScript 应用的更多信息。

- [WasmEdge QuickJS 运行时](https://github.com/second-state/wasmedge-quickjs)
- [AI 推理应用示例](https://github.com/second-state/wasmedge-quickjs/tree/main/example_js/tensorflow_lite_demo)
- [使用 fetch() 的 Web 服务客户端示例](https://github.com/second-state/wasmedge-quickjs/blob/main/example_js/wasi_http_fetch.js)

## 下一步

- [WasmEdge 的基本 Rust 示例](https://github.com/second-state/rust-examples)
- 用你喜欢的语言编写 WASM 应用，如 [Rust](/category/develop-wasm-apps-in-rust), [C/C++](/category/develop-wasm-apps-in-cc), [JavaScript](/category/develop-wasm-apps-in-javascript), [Go](/category/develop-wasm-apps-in-go) 以及其他许多语言。
