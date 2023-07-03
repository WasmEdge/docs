---
sidebar_position: 2
---

# Quick start with Docker

In this guide, we will walk you through how to quickly run WasmEdge apps in Docker Desktop. There is no additional dependencies as the entire development and runtime environments are managed by Docker Desktop.

<!-- prettier-ignore -->
:::note
If you are not using Docker Desktop, [get started here](quick_start).
:::

We will cover the following examples.

- [Run a standalone Wasm app](#run-a-standalone-wasm-app)
- [Run an HTTP server](#run-an-http-server)
- [Run a JavaScript server (node.js)](#run-a-javascript-based-server)
- [Using WasmEdge DockerSlim](#wasmedge-dockerslim)
- [Docker Images for Building WasmEdge](/docs/contribute/source/docker.md)

In this quick start guide, we cover how to run Wasm container apps using Docker commands. If you are interested in how to build, publish, and compose Wasm container apps from source code, check out the [Docker + wasm chapter](../build-and-run/docker_wasm).

## Prerequisite

You must have Docker Desktop 4.15+ installed. Make sure you have turned on the containerd image store feature in your Docker Desktop.

![Docker config](docker_config.png)

## Run a standalone Wasm app

The Hello world example is a standalone Rust application. Its source code and build instructions are available [here](https://github.com/second-state/rust-examples/tree/main/hello).

Use Docker to run the containerized Wasm app. The Wasm container image is stored in Docker Hub, and its image size is only 500KB. This image can run on any OS and CPU platform Docker supports.

```bash
$ docker run --rm --runtime=io.containerd.wasmedge.v1 --platform=wasi/wasm secondstate/rust-example-hello:latest
Hello WasmEdge!
```

To learn more about how to create Wasm apps in Rust

- [Basic Rust examples for WasmEdge](https://github.com/second-state/rust-examples)
- [Rust developer guides](../../category/develop-wasm-apps-in-rust)
  - AI inference with PyTorch and Tensorflow
  - HTTP and HTTPS client
  - MySQL database client
  - Redis client
  - Kafka client

## Run an HTTP server

This example is a standalone HTTP server written in Rust. It demonstrates that Rust + WasmEdge as a lightweight stack for microservices. Its source code and build instructions are available [here](https://github.com/second-state/rust-examples/tree/main/server).

Use Docker to pull the container image (around 800KB) from Docker Hub and then run it in a WasmEdge container. The container starts as a server. Note how we map the container's port 8080 to the local host's port 8080 so that the server becomes accessible from outside of the Wasm container.

```bash
$ docker run -dp 8080:8080 --rm --runtime=io.containerd.wasmedge.v1 --platform=wasi/wasm secondstate/rust-example-server:latest
Listening on http://0.0.0.0:8080
```

From another terminal window, do the following.

```bash
$ curl http://localhost:8080/
Try POSTing data to /echo such as: `curl localhost:8080/echo -XPOST -d 'hello world'`

$ curl http://localhost:8080/echo -X POST -d "Hello WasmEdge"
Hello WasmEdge
```

To learn more about how to create Wasm services in Rust

- [Rust developer guides](../../category/develop-wasm-apps-in-rust)
- [HTTP application examples](https://github.com/WasmEdge/wasmedge_hyper_demo)
- [Database application examples](https://github.com/WasmEdge/wasmedge-db-examples)
- Lightweight microservices in Rust and WasmEdge
  - [WasmEdge + Nginx + MySQL](https://github.com/second-state/microservice-rust-mysql)
  - [WasmEdge + Kafka + MySQL](https://github.com/docker/awesome-compose/tree/master/wasmedge-kafka-mysql)
  - [Dapr + WasmEdge](https://github.com/second-state/dapr-wasm)

## Run a JavaScript-based server

This example is a standalone HTTP server written in JavaScript using the node.js API. It demonstrates WasmEdge as a lightweight runtime for zero-dependency and portable node.js applications. Its source code is available [here](https://github.com/second-state/wasmedge-quickjs/tree/main/example_js/docker_wasm/server).

```bash
$ docker run -dp 8080:8080 --rm --runtime=io.containerd.wasmedge.v1 --platform=wasi/wasm secondstate/node-example-server:latest
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

## WasmEdge DockerSlim

The `wasmedge/slim:{version}` Docker images provide a slim WasmEdge images built with [DockerSlim](https://dockersl.im) every releases.

- Image `wasmedge/slim-runtime:{version}` includes only WasmEdge runtime with `wasmedge` command.
- Image `wasmedge/slim:{version}` includes the following command line utilities:
  - `wasmedge`
  - `wasmedgec`
- Image `wasmedge/slim-tf:{version}` includes the following command line utilities:
  - `wasmedge`
  - `wasmedgec`
  - `wasmedge-tensorflow-lite`
  - `wasmedge-tensorflow`
  - `show-tflite-tensor`
- The working directory of the release docker image is `/app`.

<!-- prettier-ignore -->
:::note
The usage of `wasmedgec` is equal to `wasmedge compile`. We decide to deprecate `wasmedgec` in the future.
:::

### Examples

Use `wasmedge compile` and `wasmedge` ([link](https://github.com/WasmEdge/WasmEdge/tree/master/examples/wasm)):

```bash
$ docker pull wasmedge/slim:{{ wasmedge_version }}

$ docker run -it --rm -v $PWD:/app wasmedge/slim:{{ wasmedge_version }} wasmedge compile hello.wasm hello.aot.wasm
[2022-07-07 08:15:49.154] [info] compile start
[2022-07-07 08:15:49.163] [info] verify start
[2022-07-07 08:15:49.169] [info] optimize start
[2022-07-07 08:15:49.808] [info] codegen start
[2022-07-07 08:15:50.419] [info] output start
[2022-07-07 08:15:50.421] [info] compile done
[2022-07-07 08:15:50.422] [info] output start

$ docker run -it --rm -v $PWD:/app wasmedge/slim:{{ wasmedge_version }} wasmedge hello.aot.wasm world
hello
world
```

Use `wasmedge-tensorflow-lite` ([link](https://github.com/WasmEdge/WasmEdge/tree/master/examples/js)):

```bash
$ docker pull wasmedge/slim-tf:{{ wasmedge_version }}
$ wget https://raw.githubusercontent.com/second-state/wasmedge-quickjs/main/example_js/tensorflow_lite_demo/aiy_food_V1_labelmap.txt
$ wget https://raw.githubusercontent.com/second-state/wasmedge-quickjs/main/example_js/tensorflow_lite_demo/food.jpg
$ wget https://raw.githubusercontent.com/second-state/wasmedge-quickjs/main/example_js/tensorflow_lite_demo/lite-model_aiy_vision_classifier_food_V1_1.tflite
$ wget https://raw.githubusercontent.com/second-state/wasmedge-quickjs/main/example_js/tensorflow_lite_demo/main.js

$ docker run -it --rm -v $PWD:/app wasmedge/slim-tf:{{ wasmedge_version }} wasmedge-tensorflow-lite --dir .:. qjs_tf.wasm main.js
label:
Hot dog
confidence:
0.8941176470588236
```

## Next steps

- [Learn more about building and managing Wasm containers in Docker](../build-and-run/docker_wasm)
- [Basic Rust examples for WasmEdge](https://github.com/second-state/rust-examples)
- [Rust developer guides](../../category/develop-wasm-apps-in-rust)
- Use Docker Compose to build and Rust-based microservices
  - [WasmEdge / MySQL / Nginx](https://github.com/docker/awesome-compose/tree/master/wasmedge-mysql-nginx) - Sample Wasm-based web application with a static HTML frontend, using a MySQL (MariaDB) database. The frontend connects to a Wasm microservice written in Rust, that runs using the WasmEdge runtime.
  - [WasmEdge / Kafka / MySQL](https://github.com/docker/awesome-compose/tree/master/wasmedge-kafka-mysql) - Sample Wasm-based microservice that subscribes to a Kafka (Redpanda) queue topic, and transforms and saves any incoming message into a MySQL (MariaDB) database.
- Write Wasm apps in your favorite languages, like [Rust](../../category/develop-wasm-apps-in-rust), [C/C++](../../category/develop-wasm-apps-in-cc), [JavaScript](../../category/develop-wasm-apps-in-javascript), [Go](../../category/develop-wasm-apps-in-go), and many other languages.
