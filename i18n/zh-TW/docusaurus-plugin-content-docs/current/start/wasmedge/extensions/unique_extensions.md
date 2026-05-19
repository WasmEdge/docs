---
sidebar_position: 3
---

# 其他擴充功能

在伺服器端執行 WASM 應用程式所面臨的挑戰之一,是缺乏對 Linux API 與常見應用程式函式庫的支援。WasmEdge 透過為 WASM 應用程式新增許多平台 API 的支援來解決此問題。開發者通常可以直接將其 Linux 應用程式編譯為 WASM,並期望其能在 WasmEdge 中執行。WasmEdge 提供了簡易的擴充機制,讓社群得以新增這些 API。例如,

透過支援網路 socket 與相關 API,WasmEdge 可以執行以下 Rust 應用程式

- [提供 HTTP 服務](https://github.com/WasmEdge/wasmedge_hyper_demo)
- [存取外部 Web 服務](https://github.com/WasmEdge/wasmedge_reqwest_demo)
- [連線資料庫](https://github.com/WasmEdge/wasmedge-db-examples)
- [連線訊息佇列](https://github.com/docker/awesome-compose/tree/master/wasmedge-kafka-mysql)
- [支援資料庫驅動的微服務](https://github.com/second-state/microservice-rust-mysql)
- [支援搭配 Dapr sidecar 的微服務](https://github.com/second-state/dapr-wasm)

此外,網路 socket API 也讓我們能夠在 WasmEdge 的 JavaScript 執行環境中支援 node.js API,包括 `server` 與 `fetch()`。

透過 WASI-NN API 的支援,WasmEdge 可以支援用於 AI 推論的 Rust 與 JavaScript 應用程式。熱門 AI 框架(例如 Tensorflow、PyTorch 與 OpenVINO)的模型 [皆受到支援](https://github.com/second-state/WasmEdge-WASINN-examples)。

## 可用的擴充功能

這些擴充功能可以透過 WasmEdge 安裝程式輕鬆安裝。它們也可以納入 Docker、Podman 與 Kubernetes 應用程式的 WASM 容器映像檔中。

| 名稱 | 說明 | 平台支援 | 語言支援 | 備註 |
| --- | --- | --- | --- | --- |
| 網路 sockets | 支援非同步(非阻塞)POSIX 網路 sockets | Linux | Rust、JavaScript、C | 支援熱門函式庫例如 tokio (Rust) 與 node (JavaScript) |
| DNS | 在網路 sockets 中支援 DNS 網域名稱 | Linux | Rust、JavaScript、C | 支援熱門函式庫例如 tokio (Rust) 與 node (JavaScript) |
| Domain sockets | 支援行程間的高效能資料交換 | Linux | Rust、JavaScript、C |  |
| TLS | 從網路 sockets 支援 TLS 與 HTTPS 連線 | Linux | Rust、JavaScript、C |  |
| KV Storage | 讓 WebAssembly 程式得以讀寫 key value store | Linux | Rust |  |
| [Ethereum](https://github.com/second-state/wasmedge-evmc) | 支援編譯為 WebAssembly 的 Ethereum 智慧合約。 | Linux | 無 | 它是 Ethereum 風味 WebAssembly (Ewasm) 的領先實作。 |
| [Substrate](https://github.com/second-state/substrate-ssvm-node) | [Pallet](https://github.com/second-state/pallet-ssvm) 讓 WasmEdge 在任何基於 Substrate 的區塊鏈上作為 Ethereum 智慧合約執行引擎。 | Linux | 無 |  |
