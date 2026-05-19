---
sidebar_position: 1
---

# WasmEdge-Bindgen 介紹

對 WebAssembly 而言,傳遞像字串這樣的複雜資料相當困難,因為 WASM 並沒有字串資料型別。這也是我們有 [WasmEdge-Bindgen](https://github.com/second-state/wasmedge-bindgen) 專案的原因。Wasmedge-Bindgen 專案提供 Rust 巨集,讓函式能接收與回傳複雜的資料型別,並讓主機端的函式能夠呼叫這些在 WasmEdge 中執行的 Rust 函式。

目前 WasmEdge-bindgen 支援 WasmEdge Go SDK 與 Rust SDK。我會帶你了解如何從 GO 與 Rust 主機傳遞複雜資料到一個嵌入的 WASM 函式。

- [從 WasmEdge Go SDK 傳遞複雜資料](go.md)
- [從 WasmEdge Rust SDK 傳遞複雜資料](rust.md)
