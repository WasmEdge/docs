---
sidebar_position: 1
---

# WasmEdge-Bindgen Introduction

Passing complex data like string is difficult for WebAssembly since Wasm does not have a string data type. That's why we have the [WasmEdge-Bindgen](https://github.com/second-state/wasmedge-bindgen) project. The Wasmedge-Bindgen project provides Rust macros for functions to accept and return complex data types, and then for functions in the host to call such Rust functions running in WasmEdge.

Now WasmEdge-bindgen supports WasmEdge Go SDK and Rust SDK. I will walk you through how to pass complex data from GO and Rust host to an embedded Wasm functions.

- [Passing complex data from WasmEdge Go SDK](go.md)
- [Passing complex data from WasmEdge Rust SDK](rust.md)
