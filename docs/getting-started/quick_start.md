---
sidebar_position: 1
---

# Quick start on Linux

In this guide, we will walk you through how to quickly install and run the WasmEdge Runtime on a generic Linux distribution (such as Ubuntu, Debian, Raspberry OS or WSL on Windows). Comprehensive and OS-specific installation instructions can be [found here](install.md).

> If you have Docker Desktop 4.15 and above, you can skip this and [get started here](quick_start_docker.md).

We will cover the following examples.

* [Run a standalone Wasm app](xxx)
* [Run an HTTP server](xxx)
* [Run a JavaScript server (node.js)](xxx)


## One-liner Installation of WasmEdge

The easiest way to install WasmEdge is to run the following command. You should have root or at least `sudo` privilege. Your system should have `git` and `curl` installed as prerequisites.

```bash
curl -sSf https://raw.githubusercontent.com/WasmEdge/WasmEdge/master/utils/install.sh | sudo bash -s -- -p /usr/local
```

> If you do not have root or `sudo` rights, use the following line to install WasmEdge in your `$HOME/.wasmedge` directory: `curl -sSf https://raw.githubusercontent.com/WasmEdge/WasmEdge/master/utils/install.sh | bash`


## Run a standalone Wasm app

The Hello world example is a standalone Rust application that can be executed by the [WasmEdge CLI](/docs/build-and-run/cli.md). Its source code and build instructions are available [here](https://github.com/second-state/rust-examples/tree/main/hello).

[Download the hello.wasm file here](/static/files/hello.wasm)

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

[Download the server.wasm file here](/static/files/server.wasm)

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
* [HTTP application examples](xxx)
* [Database application examples](xxx)
* Lightweight microservices in Rust and WasmEdge
  * WasmEdge + Nginx + MySQL
  * WasmEdge + Kafka + MySQL
  * Dapr


## Run a JavaScript-based server

This example is a standalone HTTP server written in JavaScript using the node.js API. It demonstrates WasmEdge as a lightweight runtime for node.js applications. Its source code and build instructions are available [here](xxx).

* [Download the qjs.wasm file here](/static/files/qjs.wasm)
* [Download the server.js file here](/static/files/server.js)

Use the `wasmedge` command to run the program.

```bash
$ wasmedge --dir .:. qjs.wasm server.js 
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

* [Rust developer guides](xxx)
* [AI inference application examples](xxx)
* [Web service client examples](xxx)


## Next steps

* Check out all available [WasmEdge CLI options](/docs/build-and-run/cli.md) to explore WasmEdge's features
* Write Wasm apps in your favorite languages, like [Rust](/docs/category/develop-wasm-apps-in-rust), [C/C++](/docs/category/develop-wasm-apps-in-cc), [JavaScript](/docs/category/developing-wasm-apps-in-javascript), [Go](/docs/category/develop-wasm-apps-in-go), and many other languages.
