---
sidebar_position: 4
---

# Running simple apps

In this chapter, you will learn how to use WasmEdge CLI to run wasm bytecode from Rust in two ways in 5 minutes.

One example is running a simple main app, a standalone Wasm file. The other example is running a simple function, exported as `lib`. Usually, the simple function is associated with a Host app. Go to Guide for Embedding Wasm Functions for more details.

Both examples in this chapter are written in Rust and compiled into Wasm bytecode.

## Prerequisites

* [WasmEdge installed](./install.md)
* [Rust](https://www.rust-lang.org/tools/install) installed
* `wasm32-wasi` target of the Rust toolchain added
    * Run `rustup target add wasm32-wasi` after installed Rust. 

## A simple main app

The Hello world example is a standalone Rust application that can be executed by the [WasmEdge CLI](/docs/build-and-run/cli.md). Its source code is available [here](https://github.com/second-state/wasm-learning/blob/master/cli/hello/src/main.rs).

### The code

The full source code for the Rust [main.rs](https://github.com/second-state/wasm-learning/blob/master/cli/hello/src/main.rs) file is as follows. It echoes the command line arguments passed to this program at runtime.

```
use std::env;

fn main() {
  println!("hello");
  for argument in env::args().skip(1) {
    println!("{}", argument);
  }
}
```

### Build the Wasm bytecode
```
cargo build --target wasm32-wasi --release
```

### Run the compiled application from WasmEdge CLI

We will use the `wasmedge` command to run the program.

```
$ wasmedge target/wasm32-wasi/release/hello.wasm second state
hello
second
state
```

Use the AoT compiler `wasmedgec` to get much better performance.

```
$ wasmedgec target/wasm32-wasi/release/hello.wasm target/wasm32-wasi/release/hello.wasm
$ wasmedge target/wasm32-wasi/release/hello.wasm second state
hello
second
state
```

## A simple function

### The code

The [add](https://github.com/second-state/wasm-learning/tree/master/cli/add) example is a Rust library function that can be executed by **the [WasmEdge CLI](/docs/build-and-run/cli.md) in the reactor mode**.

The full source code for the Rust [lib.rs file](https://github.com/second-state/wasm-learning/blob/master/cli/add/src/lib.rs) is as follows. It provides a simple `add()` function.

```
#[no_mangle]
pub fn add(a: i32, b: i32) -> i32 {
  return a + b;
}
```
### build the Wasm Bytecode

```
cargo build --target wasm32-wasi --release
```
### Run the function

We will use `wasmedge` in reactor mode to run the program. We pass the function name and its input parameters as command line arguments.

```
$ wasmedge --reactor target/wasm32-wasi/release/add.wasm add 2 2
4
```

Use the AoT compiler `wasmedgec` to get much better performance.

```
$ wasmedgec target/wasm32-wasi/release/add.wasm target/wasm32-wasi/release/add.wasm
$ wasmedge target/wasm32-wasi/release/add.wasm add 2 2
4
```

Now you have the basic knowledge for running apps with WasmEdge.

Next, you can

* check out all available [WasmEdge CLI options](/docs/build-and-run/cli.md) to explore WasmEdge's features
* write Wasm apps in your favorite languages, like [Rust](/docs/category/develop-wasm-apps-in-rust), [C/C++](/docs/category/develop-wasm-apps-in-cc), [JavaScript](/docs/category/developing-wasm-apps-in-javascript), [Go](/docs/category/develop-wasm-apps-in-go), and many other languages.
