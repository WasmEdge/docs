---
sidebar_position: 3
---

# Other Extensions

A challenge for running WASM apps on the server side is the lack of support for Linux APIs and common application libraries. WasmEdge fixes this by adding support for many platform APIs for WASM apps. Developers can often simply compile their Linux apps to WASM and expect it run in WasmEdge. WasmEdge provides an easy extension mechanism for the community to add these APIs. For example,

Through its support for networking socket and related APIs, WasmEdge can run Rust applications that

- [provide HTTP services](https://github.com/WasmEdge/wasmedge_hyper_demo)
- [access external web services](https://github.com/WasmEdge/wasmedge_reqwest_demo)
- [connect to databases](https://github.com/WasmEdge/wasmedge-db-examples)
- [connect to messging queues](https://github.com/docker/awesome-compose/tree/master/wasmedge-kafka-mysql)
- [support database driven microservices](https://github.com/second-state/microservice-rust-mysql)
- [support microservices with Dapr sidecars](https://github.com/second-state/dapr-wasm)

Furthermore, the networking socket APIs also allow us to support the node.js API, including both the `server` and `fetch()`, in WasmEdge's JavaScript runtime.

Through its support for WASI-NN APIs, WasmEdge can support Rust and JavaScript applications for AI inference. Models from popular AI frameworks such as Tensorflow, PyTorch and OpenVINO [are all supported](https://github.com/second-state/WasmEdge-WASINN-examples).

## Available extensions

The extensions can be easily installed by the WasmEdge installer. They can also be included in WASM container images for Docker, Podman, and Kubernetes applications.

| Name | Description | Platform Support | Language support | Note |
| --- | --- | --- | --- | --- |
| Networking sockets | Supports async (non-blocking) POSIX networking sockets | Linux | Rust, JavaScript, C | Supports popular libraries such as tokio (Rust) and node (JavaScript) |
| DNS | Supports DNS domain names in networking sockets | Linux | Rust, JavaScript, C | Supports popular libraries such as tokio (Rust) and node (JavaScript) |
| Domain sockets | Supports high-performance data exchange between processes | Linux | Rust, JavaScript, C |  |
| TLS | Supports TLS and HTTPS connections from the networking sockets | Linux | Rust, JavaScript, C |  |
| KV Storage | Allows WebAssembly programs to read and write a key value store | Linux | Rust |  |
| [Ethereum](https://github.com/second-state/wasmedge-evmc) | supports Ethereum smart contracts compiled to WebAssembly. | Linux | none | It is a leading implementation for Ethereum flavored WebAssembly (Ewasm). |
| [Substrate](https://github.com/second-state/substrate-ssvm-node) | The [Pallet](https://github.com/second-state/pallet-ssvm) allows WasmEdge to act as an Ethereum smart contract execution engine on any Substrate based blockchains. | Linux | none |  |
