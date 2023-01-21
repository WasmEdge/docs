---
sidebar_position: 1
---

# Quick start on Linux

In this guide, we will walk you through how to quickly install and run the WasmEdge Runtime on a generic Linux distribution (such as Ubuntu, Debian, Raspberry OS or WSL on Windows). Comprehensive and OS-specific installation instructions can be [found here](install.md).

> If you have Docker Desktop 4.15 and above, you can skip this and [get started here](quick_start_docker.md).

## One-liner Installation of WasmEdge

The easiest way to install WasmEdge is to run the following command. You should have root or at least `sudo` privilege. Your system should have `git` and `curl` installed as prerequisites.

```bash
curl -sSf https://raw.githubusercontent.com/WasmEdge/WasmEdge/master/utils/install.sh | sudo bash -s -- -p /usr/local
```

> If you do not have root or `sudo` rights, use the following line to install WasmEdge in your `$HOME/.wasmedge` directory: `curl -sSf https://raw.githubusercontent.com/WasmEdge/WasmEdge/master/utils/install.sh | bash`


## Build and run a Wasm app from Rust

The Hello world example is a standalone Rust application that can be executed by the [WasmEdge CLI](/docs/build-and-run/cli.md). Its source code and build instructions are available [here](https://github.com/second-state/rust-examples/tree/main/hello).

You will need to have the [Rust compiler installed](https://github.com/second-state/rust-examples/blob/main/README.md#prerequisites), and then use the following command to build the Wasm bytecode file from the Rust source code.

```bash
cargo build --target wasm32-wasi --release
```

We will use the `wasmedge` command to run the program.

```bash
$ wasmedge target/wasm32-wasi/release/hello.wasm
Hello WasmEdge!
```

Use the AoT compiler `wasmedgec` to get much better performance.

```
$ wasmedgec target/wasm32-wasi/release/hello.wasm hello.wasm
$ wasmedge hello.wasm
Hello WasmEdge!
```

To learn more about how to create Wasm apps in Rust

* [Rust developer guides](/docs/category/develop-wasm-apps-in-rust)
* [Rust examples for WasmEdge](https://github.com/second-state/rust-examples)

## Run a JavaScript app

TBD TBD TBD


## Next steps

* Check out all available [WasmEdge CLI options](/docs/build-and-run/cli.md) to explore WasmEdge's features
* Write Wasm apps in your favorite languages, like [Rust](/docs/category/develop-wasm-apps-in-rust), [C/C++](/docs/category/develop-wasm-apps-in-cc), [JavaScript](/docs/category/developing-wasm-apps-in-javascript), [Go](/docs/category/develop-wasm-apps-in-go), and many other languages.
