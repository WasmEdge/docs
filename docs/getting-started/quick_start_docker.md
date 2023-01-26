---
sidebar_position: 2
---

# Quick start with Docker

In this guide, we will walk you through how to quickly build and run WasmEdge apps in Docker Desktop. There is no additional dependencies as the entire development and runtime environments are managed by Docker Desktop.

> If you are not using Docker Desktop, [get started here](quick_start.md).

## Prerequisite

You must have Docker Desktop 4.15+ installed. 
Make sure you have turned on the containerd image store feature in your Docker Desktop. 

![](https://i.imgur.com/AH0ITnc.png)

## Run a standalone Wasm app

The Hello world example is a standalone Rust application. Its source code and build instructions are available [here](https://github.com/second-state/rust-examples/tree/main/hello).

Use Docker to run the containerized Wasm app. The Wasm container image is stored in Docker Hub, and its image size is only 500KB. This image can run on any OS and CPU platform Docker supports.

```bash
$ docker run --rm --runtime=io.containerd.wasmedge.v1 --platform=wasi/wasm secondstate/rust-example-hello:latest
Hello WasmEdge!
```

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

## Run a JavaScript-based server

This example is a standalone HTTP server written in JavaScript using the node.js API. It demonstrates WasmEdge as a lightweight runtime for node.js applications.

```bash
$ docker run -dp 8080:8080 --rm --runtime=io.containerd.wasmedge.v1 --platform=wasi/wasm secondstate/node-example-server:latest
... ...
```

From another terminal window, do the following.

```bash
$ curl http://localhost:8080/echo -X POST -d "Hello WasmEdge"
Hello WasmEdge
```

## Next steps

* [Rust developer guides](/docs/category/develop-wasm-apps-in-rust)
* [Rust examples for WasmEdge](https://github.com/second-state/rust-examples)
* Use Docker Compose to build and Rust-based microservices
  * [WasmEdge / MySQL / Nginx](https://github.com/docker/awesome-compose/tree/master/wasmedge-mysql-nginx) - Sample Wasm-based web application with a static HTML frontend, using a MySQL (MariaDB) database. The frontend connects to a Wasm microservice written in Rust, that runs using the WasmEdge runtime.
  * [WasmEdge / Kafka / MySQL](https://github.com/docker/awesome-compose/tree/master/wasmedge-kafka-mysql) - Sample Wasm-based microservice that subscribes to a Kafka (Redpanda) queue topic, and transforms and saves any incoming message into a MySQL (MariaDB) database.
* Write Wasm apps in your favorite languages, like [Rust](/docs/category/develop-wasm-apps-in-rust), [C/C++](/docs/category/develop-wasm-apps-in-cc), [JavaScript](/docs/category/developing-wasm-apps-in-javascript), [Go](/docs/category/develop-wasm-apps-in-go), and many other languages.
