---
sidebar_position: 10
---

# Rust 函式的 Bindgen

如果您的 Rust 程式有 `main()` 函式，您可以將其編譯為 WebAssembly，然後使用 `wasmedge` CLI 工具作為獨立應用程式執行。然而，更常見的使用情境是將 Rust 函式編譯成 WebAssembly，再從主機應用程式呼叫它，這就是所謂的內嵌式 WASM 函式。主機應用程式會使用 WasmEdge 的各種語言 SDK（例如 [Go](/category/go-sdk-for-embedding-wasmedge)、[Rust](/category/rust-sdk-for-embedding-wasmedge)、[C](/category/c-sdk-for-embedding-wasmedge)、Python（開發中）以及 Java（開發中））來呼叫那些由 Rust 原始碼編譯而來的 WASM 函式。在本章中，我們會稍微介紹 WasmEdge-bindgen，更多相關資訊可以參考[這裡](/category/passing-complex-data)。

WasmEdge 所有的主機端語言 SDK 都支援簡易的函式呼叫。然而，WASM 規格只支援像 `i32`、`i64`、`f32`、`f64` 與 `v128` 這類簡易資料型別作為呼叫參數與回傳值。當 Rust 函式被編譯為 WASM 時，`wasmedge-bindgen` 這個 crate 會把 Rust 函式的參數與回傳值轉換成簡易的整數型別。舉例來說，字串會自動被轉換為兩個整數，分別代表記憶體位址與長度，這樣標準的 WASM 規格才能處理。在 Rust 原始碼中要做到這件事非常容易，只要用 `#[wasmedge-bindgen]` 巨集為您的函式加上註解即可。您可以使用標準的 Rust 編譯器工具鏈（例如最新的 `Cargo`）來編譯加上註解的 Rust 程式碼。

```rust
use wasmedge_bindgen::*;
use wasmedge_bindgen_macro::*;

#[wasmedge_bindgen]
pub fn say(s: String) -> Result<Vec<u8>, String> {
  let r = String::from("hello ");
  return Ok((r + s.as_str()).as_bytes().to_vec());
}
```

當然，一旦上述 Rust 程式碼被編譯為 WASM 之後，`say()` 函式就不再接受 `String` 參數，也不會回傳 `Vec<u8>`。因此，呼叫者（也就是主機應用程式）必須在呼叫之前先將呼叫參數拆解為記憶體指標，並在呼叫之後再由記憶體指標組裝出回傳值。這些動作都可以由 WasmEdge 語言 SDK 自動處理。若想看完整範例（包含 Rust WASM 函式與 Go 主機應用程式），請參考 Go SDK 文件中的教學。

[一個完整的 wasmedge-bindgen 範例：Rust（WASM）與 Go（主機）](../../embed/go/function.md)

當然，開發者也可以自行處理 `wasmedge-bindgen` 的工作，並直接傳遞記憶體指標。如果您對這種方式呼叫 Rust 編譯出的 WASM 函式感興趣，請參考我們的 [Go SDK 範例](../../embed/go/passing_data.md)。
