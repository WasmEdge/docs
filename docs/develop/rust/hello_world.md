---
sidebar_position: 2
---

# Hello world

Before we start, ensure [you have Rust and WasmEdge installed](setup.md).

## A simple main app

The Hello World example is a standalone Rust application that can be executed by the [WasmEdge CLI](../../start/build-and-run/cli.md). The full source code for the Rust [main.rs](https://github.com/second-state/rust-examples/tree/main/hello) file is as follows. It echoes the command line arguments passed to this program at runtime.

```rust
fn main() {
  let s : &str = "Hello WasmEdge!";
  println!("{}", s);
}
```

Build the WASM bytecode:

```bash
cargo build --target wasm32-wasi --release
```

We will use the `wasmedge` command to run the program.

```bash
$ wasmedge target/wasm32-wasi/release/hello.wasm
Hello WasmEdge
```

## A simple function

### The code

The [add example](https://github.com/second-state/wasm-learning/tree/master/cli/add) is a Rust library function that can be executed by the [WasmEdge CLI](../../start/build-and-run/cli.md) in the reactor mode.

The full source code for the Rust [lib.rs](https://github.com/second-state/wasm-learning/blob/master/cli/add/src/lib.rs) file is as follows. It provides a simple `add()` function.

```rust
#[no_mangle]
pub fn add(a: i32, b: i32) -> i32 {
  return a + b;
}
```

### Build the WASM bytecode

```bash
cargo build --target wasm32-wasi --release
```

### Run the application from command line

We will use `wasmedge` in reactor mode to run the program. We pass the function name and its input parameters as command line arguments.

```bash
$ wasmedge --reactor target/wasm32-wasi/release/add.wasm add 2 2
4
```

## Pass parameters with complex data types

Of course, in most cases, you will not call functions using CLI arguments. Instead, you will probably need to use a [language SDK from WasmEdge] to call the function, pass call parameters, and receive return values. Below are some SDK examples for complex call parameters and return values.

- [Use wasmedge-bindgen in a Go host app](../../embed/go/bindgen.md)
- [Use direct memory passing in a Go host app](../../embed/go/passing_data.md)

## Improve the performance

If we don't have extra notes for AoT, all the WASM file will be executed in the interpreter mode, which is much slower. To achieve native Rust performance for those applications, you could use the `wasmedge compile` command to AOT compile the `wasm` program and then run it with the `wasmedge` command.

```bash
$ wasmedge compile hello.wasm hello_aot.wasm

$ wasmedge hello_aot.wasm second state
hello
second
state
```

For the `--reactor` mode,

```bash
$ wasmedge compile add.wasm add_aot.wasm

$ wasmedge --reactor add_aot.wasm add 2 2
4
```
