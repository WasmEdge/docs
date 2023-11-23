---
sidebar_position: 2
---

# WasmEdge Integrations

WasmEdge is a "serverless" runtime for cloud-native and edge computing applications. It allows developers safely embed third-party or "native" functions into a host application or a distributed computing framework.

## Embed WasmEdge Into A Host Application

A major use case of WasmEdge is to start a VM instance from a host application. Depending on your host application's programming language, you can use WasmEdge SDKs to start and invoke WasmEdge functions.

- Embed WasmEdge functions into a `C`-based application using the [WasmEdge C API](/category/c-sdk-for-embedding-wasmedge). Checkout the [quick start guide](../../embed/c/intro.md).
- Embed WasmEdge functions into a `Go` application using the [WasmEdge Go API](/category/go-sdk-for-embedding-wasmedge). Here is a [tutorial](https://www.secondstate.io/articles/extend-golang-app-with-webassembly-rust/) and are some [examples](https://github.com/second-state/WasmEdge-go-examples)!
- Embed WasmEdge functions into a `Rust` application using the [WasmEdge Rust crate](https://crates.io/crates/wasmedge-sdk).
- Embed WasmEdge functions into a `Node.js` application using the `NAPI`. Here is a [tutorial](https://www.secondstate.io/articles/getting-started-with-rust-function/).
- Embed WasmEdge functions into any application by spawning a new process. See examples for [Vercel Serverless Functions](https://www.secondstate.io/articles/vercel-wasmedge-webassembly-rust/) and [AWS Lambda](https://www.cncf.io/blog/2021/08/25/webassembly-serverless-functions-in-aws-lambda/).

However, the WebAssembly spec only supports very limited data types as input parameters and return values for the WebAssembly bytecode functions. To pass complex data types, such as a string of an array, as call arguments into WebAssembly compiled from Rust, you should use the `bindgen` solution provided by the [`wasmedge-bindgen`](https://crates.io/crates/wasmedge-bindgen). We currently support the `wasmedge-bindgen` in the [Rust](../../develop/rust/bindgen.md) and in [Go](../../embed/go/bindgen.md).

## Use WasmEdge As A Docker-Like Container

WasmEdge provides an OCI-compliant interface. You can use container tools like CRI-O, Docker Hub, and Kubernetes to orchestrate and manage WasmEdge runtimes.

- [Manage WasmEdge with CRI-O and Docker Hub](https://www.secondstate.io/articles/manage-webassembly-apps-in-wasmedge-using-docker-tools/).

## Call Native Host Functions From WasmEdge

A key feature of WasmEdge is its extensibility. WasmEdge APIs allow developers to register "host functions" from the host programming languages into a WasmEdge instance and invoke these functions from the WebAssembly program.

- The WasmEdge C API supports the [C host functions](../../embed/c/host_function.md).
- The WasmEdge Go API supports the [Go host functions](https://github.com/second-state/WasmEdge-go-examples/tree/master/go_HostFunc#wasmedge-go-host-function-example).
- The WasmEdge Rust API supports the [Rust host functions](https://github.com/second-state/wasmedge-rustsdk-examples/blob/main/README.md#host-functions).

[Here is an example](https://www.secondstate.io/articles/call-native-functions-from-javascript/) of a JavaScript program in WasmEdge calling a C-based host function in the underlying OS.

The host functions break the WASM sandbox to access the underly OS or hardware. But the sandbox breaking is done with explicit permission from the system’s operator.
