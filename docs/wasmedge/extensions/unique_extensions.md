---
sidebar_position: 2
---

# 2.2.2 WasmEdge extensions

A key differentiator of WasmEdge from other WebAssembly runtimes is its support for non-standard extensions. The WebAssembly System Interface (WASI) provides a mechanism for developers to extend WebAssembly efficiently and securely. The WasmEdge team created the following WASI-like extensions based on real-world customer demands.

| Name | Description | Platform Support| Language support | Note |
| -------- | -------- | -------- |-------- |
| Networking   |  Open and manage non-blocking socket connections from inside Wasm apps | Linux |Rust, JavaScript, C    | Supports popular libraries such as tokio (Rust) and node (JavaScript) |
| MySQL-based Database Driver   |  A connector for the MySQL-based database running in WasmEdge  |  Linux | Rust   | Applies to all MySQL compatible with Database, like MariaDB and TiDB |
| WASI-NN with Pytorch backend  |  AI inference in WasmEdge |  Linux |Rust   |  |
| WASI-NN with TensorFlow backend  |  AI inference in WasmEdge | Linux | Rust   |  |
| [Image processing](https://github.com/second-state/WasmEdge-image)  |  A native libraries to manipulate images for computer vision tasks |  Linux | Rust   |  |
| KV Storage |  Allows WebAssembly programs to read and write a key value store |  Linux |Rust   |  |
| Command interface |  Allows WebAssembly programs to execute native commands in the host operating system |  Linux |Rust   | It supports passing arguments, environment variables, `STDIN`/`STDOUT` pipes, and security policies for host access. |
| [Ethereum](https://github.com/second-state/wasmedge-evmc)  | supports Ethereum smart contracts compiled to WebAssembly. | none   | It is a leading implementation for Ethereum flavored WebAssembly (Ewasm). |
| [Substrate](https://github.com/second-state/substrate-ssvm-node)  |  The [Pallet](https://github.com/second-state/pallet-ssvm) allows WasmEdge to act as an Ethereum smart contract execution engine on any Substrate based blockchains. |  Linux | none   |  |
