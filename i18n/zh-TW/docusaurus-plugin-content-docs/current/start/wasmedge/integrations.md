---
sidebar_position: 2
---

# WasmEdge 整合

WasmEdge 是用於雲原生與邊緣運算應用程式的「無伺服器」執行環境。它讓開發者能夠安全地將第三方或「原生」函式嵌入主機應用程式或分散式運算框架中。

## 將 WasmEdge 嵌入主機應用程式

WasmEdge 的一項主要使用情境是從主機應用程式啟動 VM 實體。視您的主機應用程式所使用的程式語言而定,您可以使用 WasmEdge SDK 來啟動並呼叫 WasmEdge 函式。

- 使用 [WasmEdge C API](/category/c-sdk-for-embedding-wasmedge) 將 WasmEdge 函式嵌入基於 `C` 的應用程式。請參考 [快速入門指南](../../embed/c/intro.md)。
- 使用 [WasmEdge Go API](/category/go-sdk-for-embedding-wasmedge) 將 WasmEdge 函式嵌入 `Go` 應用程式。這裡有一個 [教學文件](https://www.secondstate.io/articles/extend-golang-app-with-webassembly-rust/) 以及一些 [範例](https://github.com/second-state/WasmEdge-go-examples)!
- 使用 [WasmEdge Rust crate](https://crates.io/crates/wasmedge-sdk) 將 WasmEdge 函式嵌入 `Rust` 應用程式。
- 使用 `NAPI` 將 WasmEdge 函式嵌入 `Node.js` 應用程式。這裡有一個 [教學文件](https://www.secondstate.io/articles/getting-started-with-rust-function/)。
- 透過 spawn 新行程的方式,將 WasmEdge 函式嵌入任何應用程式。請參考 [Vercel Serverless Functions](https://www.secondstate.io/articles/vercel-wasmedge-webassembly-rust/) 與 [AWS Lambda](https://www.cncf.io/blog/2021/08/25/webassembly-serverless-functions-in-aws-lambda/) 範例。

然而,WebAssembly 規範只支援非常有限的資料型別作為 WebAssembly 位元組碼函式的輸入參數與回傳值。若要將複雜的資料型別(例如陣列的字串)作為呼叫引數傳入由 Rust 編譯而成的 WebAssembly,您應該使用 [`wasmedge-bindgen`](https://crates.io/crates/wasmedge-bindgen) 提供的 `bindgen` 解決方案。目前我們在 [Rust](../../develop/rust/bindgen.md) 與 [Go](../../embed/go/bindgen.md) 中皆支援 `wasmedge-bindgen`。

## 將 WasmEdge 作為類 Docker 容器使用

WasmEdge 提供符合 OCI 規範的介面。您可以使用 CRI-O、Docker Hub 與 Kubernetes 等容器工具來協調並管理 WasmEdge 執行環境。

- [使用 CRI-O 與 Docker Hub 管理 WasmEdge](https://www.secondstate.io/articles/manage-webassembly-apps-in-wasmedge-using-docker-tools/)。

## 從 WasmEdge 呼叫原生主機函式

WasmEdge 的一項關鍵特性是可擴充性。WasmEdge API 讓開發者能夠將主機程式語言中的「主機函式」註冊到 WasmEdge 實體中,並從 WebAssembly 程式呼叫這些函式。

- WasmEdge C API 支援 [C 主機函式](../../embed/c/host_function.md)。
- WasmEdge Go API 支援 [Go 主機函式](https://github.com/second-state/WasmEdge-go-examples/tree/master/go_HostFunc#wasmedge-go-host-function-example)。
- WasmEdge Rust API 支援 [Rust 主機函式](https://github.com/second-state/wasmedge-rustsdk-examples/blob/main/README.md#host-functions)。

[這裡有一個範例](https://www.secondstate.io/articles/call-native-functions-from-javascript/),展示 WasmEdge 中的 JavaScript 程式呼叫底層 OS 中基於 C 的主機函式。

主機函式打破了 WASM 沙箱,以存取底層 OS 或硬體。但這種突破沙箱的行為,是在系統操作者的明確授權下進行的。
