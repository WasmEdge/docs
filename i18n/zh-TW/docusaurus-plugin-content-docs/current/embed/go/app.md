---
sidebar_position: 2
---

# 嵌入獨立的 WASM 應用程式

WasmEdge Go SDK 可以[嵌入獨立的 WebAssembly 應用程式](https://github.com/second-state/WasmEdge-go-examples/tree/master/go_ReadFile),也就是一個包含 `main()` 函式並編譯成 WebAssembly 的 Rust 應用程式。

## 以 Rust 撰寫的 WASM 應用程式

我們的[示範 Rust 應用程式](https://github.com/second-state/WasmEdge-go-examples/tree/master/go_ReadFile/rust_readfile)會讀取一個檔案。請注意,這個 WebAssembly 程式的輸入與輸出資料現在是透過 STDIN 與 STDOUT 傳遞。

```rust
use std::env;
use std::fs::File;
use std::io::{self, BufRead};

fn main() {
  // Get the argv.
  let args: Vec<String> = env::args().collect();
  if args.len() <= 1 {
    println!("Rust: ERROR - No input file name.");
    return;
  }

  // Open the file.
  println!("Rust: Opening input file \"{}\"...", args[1]);
  let file = match File::open(&args[1]) {
    Err(why) => {
      println!("Rust: ERROR - Open file \"{}\" failed: {}", args[1], why);
      return;
    },
    Ok(file) => file,
  };

  // Read lines.
  let reader = io::BufReader::new(file);
  let mut texts:Vec<String> = Vec::new();
  for line in reader.lines() {
    if let Ok(text) = line {
      texts.push(text);
    }
  }
  println!("Rust: Read input file \"{}\" succeeded.", args[1]);

  // Get stdin to print lines.
  println!("Rust: Please input the line number to print the line of file.");
  let stdin = io::stdin();
  for line in stdin.lock().lines() {
    let input = line.unwrap();
    match input.parse::<usize>() {
      Ok(n) => if n > 0 && n <= texts.len() {
        println!("{}", texts[n - 1]);
      } else {
        println!("Rust: ERROR - Line \"{}\" is out of range.", n);
      },
      Err(e) => println!("Rust: ERROR - Input \"{}\" is not an integer: {}", input, e),
    }
  }
  println!("Rust: Process end.");
}
```

## 將 Rust 程式碼編譯為 Wasm

接著,讓我們把應用程式編譯成 WebAssembly。

```bash
git clone https://github.com/second-state/WasmEdge-go-examples.git
cd rust_readfile
cargo build --target wasm32-wasip1
# The output file will be target/wasm32-wasip1/debug/rust_readfile.wasm
```

## Go 主機應用程式

用來在 WasmEdge 中執行 WebAssembly 函式的 Go 原始碼如下。

```go
package main

import (
  "os"
  "github.com/second-state/WasmEdge-go/wasmedge"
)

func main() {
  wasmedge.SetLogErrorLevel()

  var conf = wasmedge.NewConfigure(wasmedge.REFERENCE_TYPES)
  conf.AddConfig(wasmedge.WASI)
  var vm = wasmedge.NewVMWithConfig(conf)
  var wasi = vm.GetImportModule(wasmedge.WASI)
  wasi.InitWasi(
    os.Args[1:],     // The args
    os.Environ(),    // The envs
    []string{".:."}, // The mapping directories
  )

  // Instantiate wasm. _start refers to the main() function
  vm.RunWasmFile(os.Args[1], "_start")

  vm.Release()
  conf.Release()
}
```

## 從 Go 主機執行已編譯的 WASM 檔案

::note 請確認你已安裝 [Go、WasmEdge 與 WasmEdge Go SDK](intro.md)。 ::

接下來,讓我們用 WasmEdge Go SDK 建置 Go 應用程式。

```bash
go build
```

執行 Golang 應用程式。

```bash
$ ./read_file rust_readfile/target/wasm32-wasip1/debug/rust_readfile.wasm file.txt
Rust: Opening input file "file.txt"...
Rust: Read input file "file.txt" succeeded.
Rust: Please input the line number to print the line of file.
# Input "5" and press Enter.
5
# The output will be the 5th line of `file.txt`:
abcDEF___!@#$%^
# To terminate the program, send the EOF (Ctrl + D).
^D
# The output will print the terminate message:
Rust: Process end.
```

更多範例可以在 [WasmEdge-go-examples GitHub 儲存庫](https://github.com/second-state/WasmEdge-go-examples)中找到。
