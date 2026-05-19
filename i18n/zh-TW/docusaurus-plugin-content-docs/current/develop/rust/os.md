---
sidebar_position: 3
---

# 存取作業系統服務

WASI（WebAssembly Systems Interface）標準的設計目標是讓 WebAssembly 應用程式能夠存取作業系統的服務。Rust 編譯器中的 `wasm32-wasip1` 目標支援 WASI。本節將透過[一個範例專案](https://github.com/second-state/rust-examples/tree/main/wasi)示範如何使用 Rust 標準 API 來存取作業系統服務。

<!-- prettier-ignore -->
:::note
開始之前，請確認[您已安裝 Rust 與 WasmEdge](setup.md)。
:::

## 亂數

WebAssembly VM 是純軟體的結構，並沒有硬體熵源可以產生亂數。這就是為何 WASI 為 WebAssembly 程式定義了一個函式，可呼叫其主機作業系統以取得亂數種子。身為 Rust 開發者，您只需要使用相當熱門（實質上是業界標準）的 `rand` 與（或）`getrandom` crate。透過 `wasm32-wasip1` 編譯器後端，這些 crate 會在 WebAssembly 位元組碼中產生正確的 WASI 呼叫。`Cargo.toml` 的相依性如下所示。

```toml
[dependencies]
rand = "0.7.3"
getrandom = "0.1.14"
```

在 WebAssembly 中取得亂數的 Rust 程式碼如下。

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

## 從 Rust 進行列印與偵錯

Rust 的 `println!` 巨集在 WASI 中可正常運作。這些敘述會將內容輸出至執行 WasmEdge 的行程的 `STDOUT`。

```rust
pub fn echo(content: &str) -> String {
  println!("Printed from wasi: {}", content);
  return content.to_string();
}
```

## 引數與環境變數

在 WasmEdge 應用程式中可以傳遞 CLI 引數，也可以存取作業系統的環境變數。它們在 Rust 中就是 `env::args()` 與 `env::vars()` 陣列。

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

## 讀取與寫入檔案

WASI 讓您的 Rust 函式能夠透過標準的 Rust `std::fs` API 存取主機電腦的檔案系統。在 Rust 程式中，您是以相對路徑來操作檔案。相對路徑的根目錄會在啟動 WasmEdge 執行環境時指定。

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

## main() 應用程式

有了 `main()` 函式，Rust 程式就可以被編譯成獨立的 WebAssembly 程式。

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

使用下列命令編譯 [Rust 專案](https://github.com/second-state/rust-examples/blob/main/wasi/)。

```bash
cargo build --target wasm32-wasip1 --release
```

若要在 `wasmedge` 中執行，請依下方步驟操作。`--dir` 選項會將命令列殼層的目前資料夾對應到 WebAssembly 應用程式檔案系統內的目前資料夾。

```bash
$ wasmedge --dir .:. target/wasm32-wasip1/release/wasi.wasm
Random number: -1157533356
Random bytes: [159, 159, 9, 119, 106, 172, 207, 82, 173, 145, 233, 214, 104, 35, 23, 53, 155, 12, 102, 231, 117, 67, 192, 215, 207, 202, 128, 198, 213, 41, 235, 57, 89, 223, 138, 70, 185, 137, 74, 162, 42, 20, 226, 177, 114, 170, 172, 39, 149, 99, 122, 68, 115, 205, 155, 202, 4, 48, 178, 224, 124, 42, 24, 56, 215, 90, 203, 150, 106, 128, 127, 201, 177, 187, 20, 195, 172, 56, 72, 28, 53, 163, 59, 36, 129, 160, 69, 203, 196, 72, 113, 61, 46, 249, 81, 134, 94, 134, 159, 51, 233, 247, 253, 116, 202, 210, 100, 75, 74, 95, 197, 44, 81, 87, 89, 115, 20, 226, 143, 139, 50, 60, 196, 59, 206, 105, 161, 226]
Printed from wasi: This is from a main function
This is from a main function
The env vars are as follows.
The args are as follows.
wasi.wasm
File content is This is in a file
```

## 函式

正如[先前所介紹的](hello_world.md#a-simple-function)，您可以在 Rust 的 `lib.rs` 專案中建立 WebAssembly 函式。您也可以在這些函式中使用 WASI 函式。然而，有一個重要的注意事項是：在沒有 `main()` 函式的情況下，您必須明確呼叫一個輔助函式，以初始化讓 WASI 函式得以正常運作的環境。

在 Rust 程式的 Cargo.toml 中加入一個輔助 crate，以便將 WASI 的初始化程式碼套用至您所匯出的公開函式庫函式。

```toml
[dependencies]
... ...
wasmedge-wasi-helper = "=0.2.0"
```

在 Rust 函式中，我們必須在存取任何引數、環境變數或操作任何檔案之前先呼叫 `_initialize()`。

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
