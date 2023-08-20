---
sidebar_position: 3
---

# Access OS services

The WASI (WebAssembly Systems Interface) standard is designed to allow WebAssembly applications to access operating system services. The `wasm32-wasi` target in the Rust compiler supports WASI. This section will use [an example project](https://github.com/second-state/rust-examples/tree/main/wasi) to show how to use Rust standard APIs to access operating system services.

<!-- prettier-ignore -->
:::note
Before we start, ensure [you have Rust and WasmEdge installed](setup.md).
:::

## Random numbers

The WebAssembly VM is a pure software construct. It does not have a hardware entropy source for random numbers. That's why WASI defines a function for WebAssembly programs to call its host operating system to get a random seed. As a Rust developer, you only need to use the popular (de facto standard) `rand` and/or `getrandom` crates. With the `wasm32-wasi` compiler backend, these crates generate the correct WASI calls in the WebAssembly bytecode. The `Cargo.toml` dependencies are as follows.

```toml
[dependencies]
rand = "0.7.3"
getrandom = "0.1.14"
```

The Rust code to get random numbers from WebAssembly is this.

```rust
use rand::prelude::*;

pub fn get_random_i32() -> i32 {
  let x: i32 = random();
  return x;
}

pub fn get_random_bytes() -> Vec<u8> {
  let mut rng = thread_rng();
  let mut arr = [0u8; 128];
  rng.fill(&mut arr[..]);
  return arr.to_vec();
}
```

## Printing and debugging from Rust

The Rust `println!` marco works in WASI. The statements print to the `STDOUT` of the process that runs the WasmEdge.

```rust
pub fn echo(content: &str) -> String {
  println!("Printed from wasi: {}", content);
  return content.to_string();
}
```

## Arguments and environment variables

Passing CLI arguments to and accessing OS environment variables in a WasmEdge application is possible. They are just `env::args()` and `env::vars()` arrays in Rust.

```rust
use std::env;

pub fn print_env() {
  println!("The env vars are as follows.");
  for (key, value) in env::vars() {
    println!("{}: {}", key, value);
  }

  println!("The args are as follows.");
  for argument in env::args() {
    println!("{}", argument);
  }
}
```

## Reading and writing files

WASI allows your Rust functions to access the host computer's file system through the standard Rust `std::fs` API. In the Rust program, you operate on files through a relative path. The relative path's root is specified when you start the WasmEdge runtime.

```rust
use std::fs;
use std::fs::File;
use std::io::{Write, Read};

pub fn create_file(path: &str, content: &str) {
  let mut output = File::create(path).unwrap();
  output.write_all(content.as_bytes()).unwrap();
}

pub fn read_file(path: &str) -> String {
  let mut f = File::open(path).unwrap();
  let mut s = String::new();
  match f.read_to_string(&mut s) {
    Ok(_) => s,
    Err(e) => e.to_string(),
  }
}

pub fn del_file(path: &str) {
  fs::remove_file(path).expect("Unable to delete");
}
```

## A main() app

With a `main()` function, the Rust program can be compiled into a standalone WebAssembly program.

```rust
fn main() {
  println!("Random number: {}", get_random_i32());
  println!("Random bytes: {:?}", get_random_bytes());
  println!("{}", echo("This is from a main function"));
  print_env();
  create_file("tmp.txt", "This is in a file");
  println!("File content is {}", read_file("tmp.txt"));
  del_file("tmp.txt");
}
```

Use the command below to compile [the Rust project](https://github.com/second-state/rust-examples/blob/main/wasi/).

```bash
cargo build --target wasm32-wasi --release
```

To run it in `wasmedge`, do the following. The `--dir` option maps the current directory of the command shell to the file system's current directory inside the WebAssembly app.

```bash
$ wasmedge --dir .:. target/wasm32-wasi/release/wasi.wasm
Random number: -1157533356
Random bytes: [159, 159, 9, 119, 106, 172, 207, 82, 173, 145, 233, 214, 104, 35, 23, 53, 155, 12, 102, 231, 117, 67, 192, 215, 207, 202, 128, 198, 213, 41, 235, 57, 89, 223, 138, 70, 185, 137, 74, 162, 42, 20, 226, 177, 114, 170, 172, 39, 149, 99, 122, 68, 115, 205, 155, 202, 4, 48, 178, 224, 124, 42, 24, 56, 215, 90, 203, 150, 106, 128, 127, 201, 177, 187, 20, 195, 172, 56, 72, 28, 53, 163, 59, 36, 129, 160, 69, 203, 196, 72, 113, 61, 46, 249, 81, 134, 94, 134, 159, 51, 233, 247, 253, 116, 202, 210, 100, 75, 74, 95, 197, 44, 81, 87, 89, 115, 20, 226, 143, 139, 50, 60, 196, 59, 206, 105, 161, 226]
Printed from wasi: This is from a main function
This is from a main function
The env vars are as follows.
The args are as follows.
wasi.wasm
File content is This is in a file
```

## Functions

As [we have seen](hello_world.md#a-simple-function), you can create WebAssembly functions in a Rust `lib.rs` project. You can also use WASI functions in those functions. However, an important caveat is that, without a `main()` function, you will need to explicitly call a helper function to initialize the environment for WASI functions to work properly.

Add a helper crate in Cargo.toml in the Rust program so that the WASI initialization code can be applied to your exported public library functions.

```toml
[dependencies]
... ...
wasmedge-wasi-helper = "=0.2.0"
```

In the Rust function, we need to call `_initialize()` before we access any arguments and environment variables or operate any files.

```rust
pub fn print_env() -> i32 {
  _initialize();
  ... ...
}

pub fn create_file(path: &str, content: &str) -> String {
  _initialize();
  ... ...
}

pub fn read_file(path: &str) -> String {
  _initialize();
  ... ...
}

pub fn del_file(path: &str) -> String {
  _initialize();
  ... ...
}
```
