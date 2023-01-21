---
sidebar_position: 2
---

# Quick start with Docker

In this guide, we will walk you through how to quickly build and run WasmEdge apps in Docker Desktop. There is no additional dependencies as the entire development and runtime environments are managed by Docker Desktop.

> If you are not using Docker Desktop, [get started here](quick_start.md).

## Prerequisite

You must have Docker Desktop 4.15+ installed. Go to the `Settings -> Features in development` tab, and enable `Use containerd for pulling and storing images`.

## Build and run a Wasm app from Rust

The Hello world example is a standalone Rust application that can be executed by the [WasmEdge CLI](/docs/build-and-run/cli.md). Its source code and build instructions are available [here](https://github.com/second-state/rust-examples/tree/main/hello).

The example uses the [Dockerfile](https://github.com/second-state/rust-examples/blob/main/hello/Dockerfile) to build the Wasm app and package it into an empty OCI container as follows. The total size of the container image of the application is around 500KB, and it is completely portable across OSes and platforms.

```bash
docker buildx build --platform wasi/wasm -t secondstate/rust-example-hello .
```

Next, use Docker to run the containerized Wasm app.

```bash
$ docker run --rm --runtime=io.containerd.wasmedge.v1 --platform=wasi/wasm secondstate/rust-example-hello:latest
Hello WasmEdge!
```

## Next steps

* [Rust developer guides](/docs/category/develop-wasm-apps-in-rust)
* [Rust examples for WasmEdge](https://github.com/second-state/rust-examples)
* Use Docker Compose to build and Rust-based microservices
  * [WasmEdge / MySQL / Nginx](https://github.com/docker/awesome-compose/tree/master/wasmedge-mysql-nginx) - Sample Wasm-based web application with a static HTML frontend, using a MySQL (MariaDB) database. The frontend connects to a Wasm microservice written in Rust, that runs using the WasmEdge runtime.
  * [WasmEdge / Kafka / MySQL](https://github.com/docker/awesome-compose/tree/master/wasmedge-kafka-mysql) - Sample Wasm-based microservice that subscribes to a Kafka (Redpanda) queue topic, and transforms and saves any incoming message into a MySQL (MariaDB) database.
* Write Wasm apps in your favorite languages, like [Rust](/docs/category/develop-wasm-apps-in-rust), [C/C++](/docs/category/develop-wasm-apps-in-cc), [JavaScript](/docs/category/developing-wasm-apps-in-javascript), [Go](/docs/category/develop-wasm-apps-in-go), and many other languages.
