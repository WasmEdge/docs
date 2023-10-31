---
sidebar_position: 3
---

# 其他扩展

在服务器端运行 WASM 应用的挑战之一是缺乏对 Linux API 和常用应用程序库的支持。WasmEdge 通过为 WASM 应用程序添加许多平台 API 的支持来解决这个问题。开发人员通常可以简单地将他们的 Linux 应用编译成 WASM，并期望在 WasmEdge 中运行。WasmEdge 为社区提供了一种简单的扩展机制来添加这些 API。例如，

通过其对网络套接字和相关 API 的支持，WasmEdge 可以运行 Rust 应用程序，实现以下功能：

- [提供HTTP服务](https://github.com/WasmEdge/wasmedge_hyper_demo)
- [访问外部网络服务](https://github.com/WasmEdge/wasmedge_reqwest_demo)
- [连接到数据库](https://github.com/WasmEdge/wasmedge-db-examples)
- [连接到消息队列](https://github.com/docker/awesome-compose/tree/master/wasmedge-kafka-mysql)
- [支持基于数据库的微服务](https://github.com/second-state/microservice-rust-mysql)
- [支持具有Dapr边车的微服务](https://github.com/second-state/dapr-wasm)

此外，网络套接字 API 还允许我们在 WasmEdge 的 JavaScript 运行时中支持 Node.js API，包括 `server` 和 `fetch()`。

通过其对 WASI-NN API 的支持，WasmEdge 可以支持用于 AI 推理的 Rust 和 JavaScript 应用程序。来自流行 AI 框架（如 Tensorflow、PyTorch 和 OpenVINO）的模型[都已经得到了支持](https://github.com/second-state/WasmEdge-WASINN-examples)。

## 可用扩展

这些扩展可以通过 WasmEdge 安装程序轻松安装。它们也可以包含在用于 Docker、Podman 和 Kubernetes 应用程序的 WASM 容器映像中。

| 名称 | 描述 | 平台支持 | 语言支持 | 备注 |
| --- | --- | --- | --- | --- |
| 网络套接字 | 支持异步（非阻塞）的 POSIX 网络套接字 | Linux | Rust、JavaScript、C | 支持诸如 tokio（Rust）和 node（JavaScript）等流行库 |
| DNS | 支持网络套接字中的 DNS 域名 | Linux | Rust、JavaScript、C | 支持诸如 tokio（Rust）和 node（JavaScript）等流行库 |
| 域套接字 | 支持进程之间的高性能数据交换 | Linux | Rust、JavaScript、C |  |
| TLS | 支持从网络套接字进行 TLS 和 HTTPS 连接 | Linux | Rust、JavaScript、C |  |
| KV 存储 | 允许 WebAssembly 程序读写键值存储 | Linux | Rust |  |
| [以太坊](https://github.com/second-state/wasmedge-evmc) | 支持编译为 WebAssembly 的以太坊智能合约。 | Linux | 无 | 它是以太坊风格的 WebAssembly（Ewasm）的主要实现。 |
| [Substrate](https://github.com/second-state/substrate-ssvm-node) | [Pallet](https://github.com/second-state/pallet-ssvm) 允许 WasmEdge 在任何基于 Substrate 的区块链上作为以太坊智能合约执行引擎。 | Linux | 无 |  |
