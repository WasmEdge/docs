---
sidebar_position: 2
---

# 使用 Rust 與 wasmedge-bindgen 建立 WASM 應用程式

在上一章中,我們學習了如何安裝 WasmEdge 與 WasmEdge Go SDK。本章將教我們如何使用 Rust 與 `wasmedge-bindgen` 工具建立 WASM 應用程式。

<!-- prettier-ignore -->
:::note
[wasmedge-bindgen](https://github.com/second-state/wasmedge-bindgen) 專案提供 Rust 巨集,讓函式能接收與回傳複雜的資料型別,並讓 Go 函式能呼叫這些在 WasmEdge 中執行的 Rust 函式。
:::

## 前置需求

我們需要安裝 [Rust 並為 Rust 加入 `wasm32-wasip1` 目標](../../develop/rust/setup.md)。

我們也需要安裝 `wasmedge-bindgen`。

```bash
# 安裝 WasmEdge-bindgen 工具,協助我們處理複雜資料的傳遞
$ go get github.com/second-state/wasmedge-bindgen@v0.4.1
```

## Rust 函式

本章示範的完整原始碼可在[這裡取得](https://github.com/second-state/WasmEdge-go-examples/tree/master/wasmedge-bindgen/go_BindgenFuncs)。

在 [Rust 專案](https://github.com/second-state/WasmEdge-go-examples/tree/master/wasmedge-bindgen/go_BindgenFuncs/rust_bindgen_funcs)中,你只需在[函式](https://github.com/second-state/WasmEdge-go-examples/blob/master/wasmedge-bindgen/go_BindgenFuncs/rust_bindgen_funcs/src/lib.rs)上加上 `[wasmedge_bindgen]` 巨集進行標註。

這些標註過的函式會被 Rust 編譯器自動加以處理,轉變成可被 WasmEdge GO SDK 中與 bindgen 相關的函式呼叫的 WebAssembly 函式。

下面的範例展示了幾個接收複雜呼叫參數並回傳複雜值的 Rust 函式。

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

## 將 Rust 程式碼編譯為 Wasm

現在 Rust 函式已經準備好了。讓我們把 Rust 程式碼編譯成 WASM。

首先,fork 或 git clone 範例專案以取得原始碼。

```bash
git clone https://github.com/second-state/WasmEdge-go-examples.git
```

接著,使用標準的 `Cargo` 命令建置 WebAssembly 位元組碼檔案。

```bash
cd rust_bindgen_funcs
cargo build --target wasm32-wasip1 --release
# 輸出的 WASM 會位於 target/wasm32-wasip1/release/rust_bindgen_funcs_lib.wasm。
cp target/wasm32-wasip1/release/rust_bindgen_funcs_lib.wasm ../
cd ../
```

現在我們有了一個 WASM 函式。接下來,看看如何將這個 WASM 函式嵌入到 Go 主機應用程式中。
