---
sidebar_position: 1
---

# Quick start on Linux

In this guide, we will walk you through how to quickly install and run the WasmEdge Runtime on a generic Linux distribution (such as Ubuntu, Debian, Raspberry OS or WSL on Windows). Comprehensive and OS-specific installation instructions can be [found here](/docs/build-and-run/install.md).

> If you have Docker Desktop 4.15 and above, you can skip this and [get started here](quick_start_docker.md). For Fedora Linux / Red Hat Linux / OpenShift / Podman users, [get started here](quick_start_redhat.md).

We will cover the following examples.

* [Run a standalone Wasm app](#run-a-standalone-wasm-app)
* [Run an HTTP server](#run-an-http-server)
* [Run a JavaScript server (node.js)](#run-a-javascript-based-server)


## One-liner Installation of WasmEdge

The easiest way to install WasmEdge is to run the following command. You should have root or at least `sudo` privilege. Your system should have `git` and `curl` installed as prerequisites.

```bash
curl -sSf https://raw.githubusercontent.com/WasmEdge/WasmEdge/master/utils/install.sh | sudo bash -s -- -p /usr/local
```

> If you do not have root or `sudo` rights, use the following line to install WasmEdge in your `$HOME/.wasmedge` directory: `curl -sSf https://raw.githubusercontent.com/WasmEdge/WasmEdge/master/utils/install.sh | bash`


## Run a standalone Wasm app

The Hello world example is a standalone Rust application that can be executed by the [WasmEdge CLI](/docs/build-and-run/cli.md). Its source code and build instructions are available [here](https://github.com/second-state/rust-examples/tree/main/hello).

[Download the hello.wasm file here](/files/hello.wasm)

```bash
wget https://wasmedge.org/books/app-dev-guide/en/files/hello.wasm
```

Use the `wasmedge` command to run the program.

```bash
$ wasmedge hello.wasm
Hello WasmEdge!
```

Use the AoT compiler `wasmedgec` to get much better performance.

```
$ wasmedgec hello.wasm hello_aot.wasm
$ wasmedge hello_aot.wasm
Hello WasmEdge!
```

To learn more about how to create Wasm apps in Rust

* [Rust developer guides](/docs/category/develop-wasm-apps-in-rust)
  * AI inference with PyTorch and Tensorflow
  * HTTP and HTTPS client
  * MySQL database client
  * Redis client
  * Kafka client
* [Rust examples for WasmEdge](https://github.com/second-state/rust-examples)

## Run an HTTP server

This example is a standalone HTTP server written in Rust. It demonstrates that Rust + WasmEdge as a lightweight stack for microservices. Its source code and build instructions are available [here](https://github.com/second-state/rust-examples/tree/main/server).

[Download the server.wasm file here](/files/server.wasm)

```bash
wget https://wasmedge.org/books/app-dev-guide/en/files/server.wasm
```

Use the `wasmedge` command to run the program.

```bash
$ wasmedge server.wasm
Listening on http://0.0.0.0:8080
```

From another terminal window, do the following.

```bash
$ curl http://localhost:8080/
Try POSTing data to /echo such as: `curl localhost:8080/echo -XPOST -d 'hello world'`

$ curl http://localhost:8080/echo -X POST -d "Hello WasmEdge"
Hello WasmEdge
```

To learn more about how to create Wasm apps in Rust

* [Rust developer guides](/docs/category/develop-wasm-apps-in-rust)
* [HTTP application examples](https://github.com/WasmEdge/wasmedge_hyper_demo)
* [Database application examples](https://github.com/WasmEdge/wasmedge-db-examples)
* Lightweight microservices in Rust and WasmEdge
  * [WasmEdge + Nginx + MySQL](https://github.com/second-state/microservice-rust-mysql)
  * [WasmEdge + Kafka + MySQL](https://github.com/docker/awesome-compose/tree/master/wasmedge-kafka-mysql)
  * [Dapr + WasmEdge](https://github.com/second-state/dapr-wasm)


## Run a JavaScript-based server

This example is a standalone HTTP server written in JavaScript using the node.js API. It demonstrates WasmEdge as a lightweight runtime for node.js applications.

* [Download the wasmedge_quickjs.wasm file here](https://github.com/second-state/wasmedge-quickjs/releases/download/v0.5.0-alpha/wasmedge_quickjs.wasm)
* [Download the modules.zip file here](https://github.com/second-state/wasmedge-quickjs/releases/download/v0.5.0-alpha/modules.zip) and then unzip it into the current folder as `./modules/`
* [Download the server.js file here](https://raw.githubusercontent.com/second-state/wasmedge-quickjs/main/example_js/docker_wasm/server/server.js)

```bash
wget https://github.com/second-state/wasmedge-quickjs/releases/download/v0.5.0-alpha/wasmedge_quickjs.wasm
wget https://raw.githubusercontent.com/second-state/wasmedge-quickjs/main/example_js/docker_wasm/server/server.js
wget https://github.com/second-state/wasmedge-quickjs/releases/download/v0.5.0-alpha/modules.zip
unzip modules.zip
```

Use the `wasmedge` command to run the program.

```bash
$ wasmedge --dir .:. wasmedge_quickjs.wasm server.js
listen 8080 ...
```

From another terminal window, do the following.

```bash
$ curl http://localhost:8080/echo -X POST -d "Hello WasmEdge"
Hello WasmEdge
```

To learn more about how to run JavaScript apps in WasmEdge.

* [The WasmEdge QuickJS runtime](https://github.com/second-state/wasmedge-quickjs)
* [AI inference application examples](https://github.com/second-state/wasmedge-quickjs/tree/main/example_js/tensorflow_lite_demo)
* [Web service client examples with fetch()](https://github.com/second-state/wasmedge-quickjs/blob/main/example_js/wasi_http_fetch.js)


## Next steps

* Check out all available [WasmEdge CLI options](/docs/build-and-run/cli.md) to explore WasmEdge's features
* Write Wasm apps in your favorite languages, like [Rust](/docs/category/develop-wasm-apps-in-rust), [C/C++](/docs/category/develop-wasm-apps-in-cc), [JavaScript](/docs/category/developing-wasm-apps-in-javascript), [Go](/docs/category/develop-wasm-apps-in-go), and many other languages.
