---
sidebar_position: 2
---

# Hello world

開始之前，請確認[您已安裝 Rust 與 WasmEdge](setup.md)。

## 簡易 main 應用程式

Hello World 範例是一個獨立的 Rust 應用程式，可以由 [WasmEdge CLI](../../start/build-and-run/cli.md) 執行。Rust [main.rs](https://github.com/second-state/rust-examples/tree/main/hello) 檔案的完整原始碼如下。它會在執行階段將傳遞給此程式的命令列參數印出。

```rust
fn main() {
  let s : &str = "Hello WasmEdge!";
  println!("{}", s);
}
```

建置 WASM 位元組碼：

```bash
cargo build --target wasm32-wasip1 --release
```

我們將使用 `wasmedge` 命令來執行該程式。

```bash
wasmedge target/wasm32-wasip1/release/hello.wasm
```

## 簡易函式

### 程式碼

[add 範例](https://github.com/second-state/wasm-learning/tree/master/cli/add)是一個 Rust 函式庫函式，可以由 [WasmEdge CLI](../../start/build-and-run/cli.md) 以 reactor 模式執行。

Rust [lib.rs](https://github.com/second-state/wasm-learning/blob/master/cli/add/src/lib.rs) 檔案的完整原始碼如下。它提供一個簡易的 `add()` 函式。

```rust
#[no_mangle]
pub fn add(a: i32, b: i32) -> i32 {
  return a + b;
}
```

### 建置 WASM 位元組碼

```bash
cargo build --target wasm32-wasip1 --release
```

### 從命令列執行應用程式

我們將使用 reactor 模式的 `wasmedge` 來執行程式。我們會將函式名稱及其輸入參數作為命令列參數傳入。

```bash
wasmedge --reactor target/wasm32-wasip1/release/add.wasm add 2 2
```

## 以複雜資料型別傳遞參數

當然，在大多數情況下，您不會使用 CLI 參數去呼叫函式。相反地，您可能會需要使用[來自 WasmEdge 的語言 SDK]來呼叫函式、傳遞呼叫參數並接收回傳值。下方是針對複雜呼叫參數與回傳值的一些 SDK 範例。

- [在 Go 主機應用程式中使用 wasmedge-bindgen](../../embed/go/bindgen.md)
- [在 Go 主機應用程式中使用直接記憶體傳遞](../../embed/go/passing_data.md)

## 提升效能

如果我們沒有對 AoT 額外設定，所有的 WASM 檔案都會以直譯模式執行，速度會慢得多。若要讓這類應用程式達到 Rust 原生的效能，您可以使用 `wasmedge compile` 命令對 `wasm` 程式進行 AOT 編譯，然後再以 `wasmedge` 命令執行。

```bash
wasmedge compile hello.wasm hello_aot.wasm
wasmedge hello_aot.wasm second state
```

對於 `--reactor` 模式：

```bash
wasmedge compile add.wasm add_aot.wasm
wasmedge --reactor add_aot.wasm add 2 2
```
