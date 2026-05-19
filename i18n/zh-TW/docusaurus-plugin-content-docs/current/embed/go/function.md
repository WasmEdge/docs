---
sidebar_position: 3
---

# 嵌入 WASM 函式

在[這個範例](https://github.com/second-state/WasmEdge-go-examples/tree/master/wasmedge-bindgen/go_BindgenFuncs)中,我們會示範如何從 Go 應用程式呼叫幾個簡單的 WebAssembly 函式。[這些函式](https://github.com/second-state/WasmEdge-go-examples/blob/master/wasmedge-bindgen/go_BindgenFuncs/rust_bindgen_funcs/src/lib.rs)是以 Rust 撰寫,且需要複雜的呼叫參數與回傳值。`#[wasmedge_bindgen]` 巨集可讓編譯器工具自動產生正確的程式碼,將呼叫參數從 Go 傳遞到 WebAssembly。

## 以 Rust 撰寫的 WASM 應用程式

如同我們[這裡所述](../data/intro.md),WebAssembly 規格原生只支援少數簡單的資料型別。它[並不支援](https://medium.com/wasm/strings-in-webassembly-wasm-57a05c1ea333)字串或陣列等型別。要將 Go 中的豐富型別傳給 WebAssembly,編譯器需要將它們轉換成簡單的整數。例如,它會將字串轉換成一個整數記憶體位址加上一個整數長度。`wasmedge_bindgen` 工具會自動進行這項轉換。

```rust
use num_integer::lcm;
use serde::{Deserialize, Serialize};
use sha3::{Digest, Keccak256, Sha3_256};
#[allow(unused_imports)]
use wasmedge_bindgen::*;
use wasmedge_bindgen_macro::*;

#[derive(Serialize, Deserialize, Debug)]
struct Point {
    x: f32,
    y: f32,
}

#[derive(Serialize, Deserialize, Debug)]
struct Line {
    points: Vec<Point>,
    valid: bool,
    length: f32,
    desc: String,
}

#[wasmedge_bindgen]
pub fn create_line(p1: String, p2: String, desc: String) -> String {
    let point1: Point = serde_json::from_str(&p1).unwrap();
    let point2: Point = serde_json::from_str(&p2).unwrap();
    let length = ((point1.x - point2.x) * (point1.x - point2.x)
        + (point1.y - point2.y) * (point1.y - point2.y))
        .sqrt();

    let valid = if length == 0.0 { false } else { true };

    let line = Line {
        points: vec![point1, point2],
        valid: valid,
        length: length,
        desc: desc,
    };

    return serde_json::to_string(&line).unwrap();
}

#[wasmedge_bindgen]
pub fn say(s: String) -> String {
    let r = String::from("hello ");
    return r + &s;
}

#[wasmedge_bindgen]
pub fn obfusticate(s: String) -> String {
    (&s).chars()
        .map(|c| match c {
            'A'..='M' | 'a'..='m' => ((c as u8) + 13) as char,
            'N'..='Z' | 'n'..='z' => ((c as u8) - 13) as char,
            _ => c,
        })
        .collect()
}

#[wasmedge_bindgen]
pub fn lowest_common_multiple(a: i32, b: i32) -> i32 {
    let r = lcm(a, b);
    return r;
}

#[wasmedge_bindgen]
pub fn sha3_digest(v: Vec<u8>) -> Vec<u8> {
    return Sha3_256::digest(&v).as_slice().to_vec();
}

#[wasmedge_bindgen]
pub fn keccak_digest(s: Vec<u8>) -> Vec<u8> {
    return Keccak256::digest(&s).as_slice().to_vec();
}
```

## 將 Rust 程式碼編譯為 Wasm

首先,我們會把 Rust 原始碼編譯成 WebAssembly 位元組碼函式。

```bash
git clone https://github.com/second-state/WasmEdge-go-examples.git
cd rust_bindgen_funcs
cargo build --release --target wasm32-wasip1
# The output WASM will be target/wasm32-wasip1/release/rust_bindgen_funcs_lib.wasm
```

## Go 主機應用程式

用來在 WasmEdge 中執行 WebAssembly 函式的 [Go 原始碼](https://github.com/second-state/WasmEdge-go-examples/blob/master/go_BindgenFuncs/bindgen_funcs.go)如下。`Execute()` 函式會呼叫 WebAssembly 函式,並依 `#[wasmedge_bindgen]` 慣例傳遞呼叫參數。

```go
package main

import (
  "fmt"
  "os"

  "github.com/second-state/WasmEdge-go/wasmedge"
  bindgen "github.com/second-state/wasmedge-bindgen/host/go"
)

func main() {
  // Expected Args[0]: program name (./bindgen_funcs)
  // Expected Args[1]: wasm or wasm-so file (rust_bindgen_funcs_lib.wasm))

  // Set not to print debug info
  wasmedge.SetLogErrorLevel()

  // Create configure
  var conf = wasmedge.NewConfigure(wasmedge.WASI)

  // Create VM with configure
  var vm = wasmedge.NewVMWithConfig(conf)

  // Init WASI
  var wasi = vm.GetImportModule(wasmedge.WASI)
  wasi.InitWasi(
    os.Args[1:],     // The args
    os.Environ(),    // The envs
    []string{".:."}, // The mapping preopens
  )

  vm.LoadWasmFile(os.Args[1])
  vm.Validate()
  // Instantiate the bindgen and vm
  bg := bindgen.New(vm)
  bg.Instantiate()

  // Run bindgen functions
  var res []interface{}
  var err error
  // create_line: array, array, array -> array (inputs are JSON stringified)
  res, _, err = bg.Execute("create_line", "{\"x\":1.5,\"y\":3.8}", "{\"x\":2.5,\"y\":5.8}", "A thin red line")
  if err == nil {
    fmt.Println("Run bindgen -- create_line:", res[0].(string))
  } else {
    fmt.Println("Run bindgen -- create_line FAILED")
  }
  // say: array -> array
  res, _, err = bg.Execute("say", "bindgen funcs test")
  if err == nil {
    fmt.Println("Run bindgen -- say:", res[0].(string))
  } else {
    fmt.Println("Run bindgen -- say FAILED")
  }
  // obfusticate: array -> array
  res, _, err = bg.Execute("obfusticate", "A quick brown fox jumps over the lazy dog")
  if err == nil {
    fmt.Println("Run bindgen -- obfusticate:", res[0].(string))
  } else {
    fmt.Println("Run bindgen -- obfusticate FAILED")
  }
  // lowest_common_multiple: i32, i32 -> i32
  res, _, err = bg.Execute("lowest_common_multiple", int32(123), int32(2))
  if err == nil {
    fmt.Println("Run bindgen -- lowest_common_multiple:", res[0].(int32))
  } else {
    fmt.Println("Run bindgen -- lowest_common_multiple FAILED")
  }
  // sha3_digest: array -> array
  res, _, err = bg.Execute("sha3_digest", []byte("This is an important message"))
  if err == nil {
    fmt.Println("Run bindgen -- sha3_digest:", res[0].([]byte))
  } else {
    fmt.Println("Run bindgen -- sha3_digest FAILED")
  }
  // keccak_digest: array -> array
  res, _, err = bg.Execute("keccak_digest", []byte("This is an important message"))
  if err == nil {
    fmt.Println("Run bindgen -- keccak_digest:", res[0].([]byte))
  } else {
    fmt.Println("Run bindgen -- keccak_digest FAILED")
  }

  bg.Release()
  conf.Release()
}
```

## 從你的 Go 主機應用程式建置並執行 WASM 應用程式

::note 請確認你已安裝 [Go、WasmEdge 與 WasmEdge Go SDK](intro.md)。 ::

接下來,讓我們用 WasmEdge Go SDK 建置 Go 應用程式。

```bash
go build
```

執行這個 Go 應用程式,它會執行嵌入在 WasmEdge 執行環境中的 WebAssembly 函式。

```bash
$ ./bindgen_funcs rust_bindgen_funcs/target/wasm32-wasip1/release/rust_bindgen_funcs_lib.wasm
Run bindgen -- create_line: {"points":[{"x":1.5,"y":3.8},{"x":2.5,"y":5.8}],"valid":true,"length":2.2360682,"desc":"A thin red line"}
Run bindgen -- say: hello bindgen funcs test
Run bindgen -- obfusticate: N dhvpx oebja sbk whzcf bire gur ynml qbt
Run bindgen -- lowest_common_multiple: 246
Run bindgen -- sha3_digest: [87 27 231 209 189 105 251 49 159 10 211 250 15 159 154 181 43 218 26 141 56 199 25 45 60 10 20 163 54 211 195 203]
Run bindgen -- keccak_digest: [126 194 241 200 151 116 227 33 216 99 159 22 107 3 177 169 216 191 114 156 174 193 32 159 246 228 245 133 52 75 55 27]
```
