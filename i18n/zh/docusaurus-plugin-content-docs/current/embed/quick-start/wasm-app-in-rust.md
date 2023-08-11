---
sidebar_position: 2
---

# Create a WASM app using Rust and wasmedge-bindgen

In the previous chapter, we learned how to install WasmEdge and WasmEdge Go SDK. This chapter will teach us how to create a WASM app using Rust and `wasmedge-bindgen` tool.

<!-- prettier-ignore -->
:::note
The [wasmedge-bindgen](https://github.com/second-state/wasmedge-bindgen) project provides Rust macros for functions to accept and return complex data types and then for Go functions to call such Rust functions running in WasmEdge.
:::

## Prerequisites

We need to install [Rust and add `wasm32-wasi` target for Rust](../../develop/rust/setup.md)

We also need to install `wasmedge-bindgen`.

```bash
# Install the WasmEdge-bindgen tool, which help us handle complex data passing
$ go get github.com/second-state/wasmedge-bindgen@v0.4.1
```

## Rust function

The complete source code for the demo in this chapter is [available here](https://github.com/second-state/WasmEdge-go-examples/tree/master/wasmedge-bindgen/go_BindgenFuncs).

In the [Rust project](https://github.com/second-state/WasmEdge-go-examples/tree/master/wasmedge-bindgen/go_BindgenFuncs/rust_bindgen_funcs), all you need is to annotate [your functions](https://github.com/second-state/WasmEdge-go-examples/blob/master/wasmedge-bindgen/go_BindgenFuncs/rust_bindgen_funcs/src/lib.rs) with a `[wasmedge_bindgen]` macro.

Those annotated functions will be automatically instrumented by the Rust compiler and turned into WebAssembly functions that can be called from the bindgen related functions of WasmEdge GO SDK.

The example below shows several Rust functions that take complex call parameters and return complex values.

```rust
use wasmedge_bindgen::*;
use wasmedge_bindgen_macro::*;
use num_integer::lcm;
use sha3::{Digest, Sha3_256, Keccak256};
use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize, Debug)]
struct Point {
  x: f32,
  y: f32
}

#[derive(Serialize, Deserialize, Debug)]
struct Line {
  points: Vec<Point>,
  valid: bool,
  length: f32,
  desc: String
}

#[wasmedge_bindgen]
pub fn create_line(p1: String, p2: String, desc: String) -> Result<Vec<u8>, String> {
  let point1: Point = serde_json::from_str(p1.as_str()).unwrap();
  let point2: Point = serde_json::from_str(p2.as_str()).unwrap();
  let length = ((point1.x - point2.x) * (point1.x - point2.x) + (point1.y - point2.y) * (point1.y - point2.y)).sqrt();

  let valid = if length == 0.0 { false } else { true };

  let line = Line { points: vec![point1, point2], valid: valid, length: length, desc: desc };

  return Ok(serde_json::to_vec(&line).unwrap());
}

#[wasmedge_bindgen]
pub fn say(s: String) -> Result<Vec<u8>, String> {
  let r = String::from("hello ");
  return Ok((r + s.as_str()).as_bytes().to_vec());
}

#[wasmedge_bindgen]
pub fn obfusticate(s: String) -> Result<Vec<u8>, String> {
  let r: String = (&s).chars().map(|c| {
    match c {
      'A' ..= 'M' | 'a' ..= 'm' => ((c as u8) + 13) as char,
      'N' ..= 'Z' | 'n' ..= 'z' => ((c as u8) - 13) as char,
      _ => c
    }
  }).collect();
  Ok(r.as_bytes().to_vec())
}

#[wasmedge_bindgen]
pub fn lowest_common_multiple(a: i32, b: i32) -> Result<Vec<u8>, String> {
  let r = lcm(a, b);
  return Ok(r.to_string().as_bytes().to_vec());
}

#[wasmedge_bindgen]
pub fn sha3_digest(v: Vec<u8>) -> Result<Vec<u8>, String> {
  return Ok(Sha3_256::digest(&v).as_slice().to_vec());
}

#[wasmedge_bindgen]
pub fn keccak_digest(s: Vec<u8>) -> Result<Vec<u8>, String> {
  return Ok(Keccak256::digest(&s).as_slice().to_vec());
}
```

## Compile the Rust code into Wasm

Now the rust function is ready. Let's compile the Rust code to WASM.

First， fork or git clone the demo project to get the source code.

```bash
git clone https://github.com/second-state/WasmEdge-go-examples.git
```

Next, build the WebAssembly bytecode file using standard `Cargo` commands.

```bash
cd rust_bindgen_funcs
cargo build --target wasm32-wasi --release
# The output WASM will be target/wasm32-wasi/release/rust_bindgen_funcs_lib.wasm.
cp target/wasm32-wasi/release/rust_bindgen_funcs_lib.wasm ../
cd ../
```

Now we have a WASM function. Next, how to embed the WASM function into a Go Host application.
