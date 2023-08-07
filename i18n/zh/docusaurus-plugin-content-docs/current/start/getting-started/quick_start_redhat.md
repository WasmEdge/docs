---
sidebar_position: 3
---

# Quick start with Red Hat

In this guide, we will walk you through how to quickly run WasmEdge apps in Fedora / CentOS / Red Hat Linux / OpenShift systems. There is no additional dependencies as the entire development and runtime environments are managed by OpenSift / Podman.

<!-- prettier-ignore -->
:::note
If you are not using OpenShift / Podman, [get started here](quick_start.md).
:::

We will cover the following examples.

- [Run a standalone WASM app](#run-a-standalone-wasm-app)
- [Run an HTTP server](#run-an-http-server)
- [Run a JavaScript server (node.js)](#run-a-javascript-based-server)

## Install

You can use an one-liner `dnf` command to install WasmEdge, [crun](https://github.com/containers/crun) and [Podman](https://www.redhat.com/en/topics/containers/what-is-podman) on your Fedora / CentOS / Red Hat Linux system. The WasmEdge Runtime is available as an [officially maintained upstream package](https://packages.fedoraproject.org/pkgs/wasmedge/wasmedge/index.html) for Fedora 37 and Red Hat REPL 8 and 9.

```bash
dnf install wasmedge crun-wasm podman
```

## Run a standalone WASM app

The Hello world example is a standalone Rust application. Its source code and build instructions are available [here](https://github.com/second-state/rust-examples/tree/main/hello).

Use Podman to run the containerized WASM app. The WASM container image is stored in Docker Hub, and its image size is only 500KB. This image can run on any OS and CPU platform Red Hat supports.

```bash
$ podman --runtime /usr/bin/crun-wasm run --platform=wasi/wasm -t --rm docker.io/secondstate/rust-example-hello:latest
Hello WasmEdge!
```

To learn more about how to create WASM apps in Rust

- [Basic Rust examples for WasmEdge](https://github.com/second-state/rust-examples)
- [Rust developer guides](/category/develop-wasm-apps-in-rust)
  - WASI-NN with [PyTorch](../../develop/rust/wasinn/pytorch.md), [OpenVINO](../../develop/rust/wasinn/openvino.md), or [Tensorflow Lite](../../develop/rust/wasinn/tensorflow_lite.md) backends
  - [HTTP and HTTPS client](../../develop/rust/http_service/client.md)
  - [MySQL database client](../../develop/rust/database/my_sql_driver.md)
  - Redis client
  - Kafka client

## Run an HTTP server

This example is a standalone HTTP server written in Rust. It demonstrates Rust + WasmEdge as a lightweight stack for microservices. Its source code and build instructions are available [here](https://github.com/second-state/rust-examples/tree/main/server).

Use Podman to pull the container image (around 800KB) from Docker Hub and then run it in a WasmEdge container. The container starts as a server. Note how we map the container's port 8080 to the local host's port 8080 so that the server becomes accessible from outside of the WASM container.

```bash
$ podman --runtime /usr/bin/crun-wasm run -dp 8080:8080 --platform=wasi/wasm -t --rm docker.io/secondstate/rust-example-server:latest
Listening on http://0.0.0.0:8080
```

From another terminal window, do the following.

```bash
$ curl http://localhost:8080/
Try POSTing data to /echo such as: `curl localhost:8080/echo -XPOST -d 'hello world'`

$ curl http://localhost:8080/echo -X POST -d "Hello WasmEdge"
Hello WasmEdge
```

To learn more about how to create WASM services in Rust

- [Rust developer guides](/category/develop-wasm-apps-in-rust)
- [HTTP application examples](https://github.com/WasmEdge/wasmedge_hyper_demo)
- [Database application examples](https://github.com/WasmEdge/wasmedge-db-examples)
- Lightweight microservices in Rust and WasmEdge
  - [WasmEdge + Nginx + MySQL](https://github.com/second-state/microservice-rust-mysql)
  - [WasmEdge + Kafka + MySQL](https://github.com/docker/awesome-compose/tree/master/wasmedge-kafka-mysql)
  - [Dapr + WasmEdge](https://github.com/second-state/dapr-wasm)

## Run a JavaScript-based server

This example is a standalone HTTP server written in JavaScript using the node.js API. It demonstrates WasmEdge as a lightweight runtime for zero-dependency and portable node.js applications. Its source code is available [here](https://github.com/second-state/wasmedge-quickjs/tree/main/example_js/docker_wasm/server).

```bash
$ podman --runtime /usr/bin/crun-wasm run -dp 8080:8080 --platform=wasi/wasm -t --rm docker.io/secondstate/node-example-server:latest
... ...
```

From another terminal window, do the following.

```bash
$ curl http://localhost:8080/echo -X POST -d "Hello WasmEdge"
Hello WasmEdge
```

To learn more about how to run JavaScript apps in WasmEdge.

- [The WasmEdge QuickJS runtime](https://github.com/second-state/wasmedge-quickjs)
- [AI inference application examples](https://github.com/second-state/wasmedge-quickjs/tree/main/example_js/tensorflow_lite_demo)
- [Web service client examples with fetch()](https://github.com/second-state/wasmedge-quickjs/blob/main/example_js/wasi_http_fetch.js)

## Next steps

- [Basic Rust examples for WasmEdge](https://github.com/second-state/rust-examples)
- Write WASM apps in your favorite languages, like [Rust](/category/develop-wasm-apps-in-rust), [C/C++](/category/develop-wasm-apps-in-cc), [JavaScript](/category/develop-wasm-apps-in-javascript), [Go](/category/develop-wasm-apps-in-go), and many other languages.
