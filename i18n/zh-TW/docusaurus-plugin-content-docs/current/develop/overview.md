---
sidebar_position: 1
displayed_sidebar: developSidebar
---

# 開發 WASM 應用程式

WebAssembly 的基本價值主張之一在於它支援多種程式語言。WebAssembly 是許多程式語言的「託管執行環境（managed runtime）」，包括 [C/C++](/category/develop-wasm-apps-in-cc)、[Rust](/category/develop-wasm-apps-in-rust)、[Go](/category/develop-wasm-apps-in-go)，甚至是 [JavaScript](/category/develop-wasm-apps-in-javascript) 與 [Python](/category/develop-wasm-apps-in-python)。

- 對於編譯式語言（例如 C 與 Rust），WasmEdge WebAssembly 提供安全、隔離且容器化的執行環境，作為 Native Client（NaCl）的替代方案。
- 對於直譯式或託管式語言（例如 JavaScript 與 Python），WasmEdge WebAssembly 提供安全、快速、輕量且容器化的執行環境，取代 Docker + 客體作業系統 + 原生直譯器的組合。

本章將討論如何以不同語言將原始碼編譯成 WebAssembly，並在 WasmEdge 中執行。

- 使用您熟悉的程式語言開發 WebAssembly 應用程式，例如 [Rust](/category/develop-wasm-apps-in-rust)、[C/C++](/category/develop-wasm-apps-in-cc)、[JavaScript](/category/develop-wasm-apps-in-javascript)、[Go](/category/develop-wasm-apps-in-go) 以及其他多種語言。
- [使用現有的容器工具部署 WASM 應用程式](/category/deploy-wasmedge-apps-in-kubernetes)

除此之外，我們還提供另外兩份指南，分別介紹[嵌入 WASM 函式](../embed/overview.md)以及如何[參與貢獻](../contribute/overview.md) WasmEdge。
