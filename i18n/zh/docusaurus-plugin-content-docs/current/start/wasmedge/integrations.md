---
sidebar_position: 2
---

# WasmEdge 集成

WasmEdge 是云原生和边缘计算应用的“无服务器”运行时。它允许开发人员安全地将第三方或“本地”函数嵌入主机应用程序或分布式计算框架中。

## 将 WasmEdge 嵌入到主机应用程序中

WasmEdge 的一个主要用例是从主机应用程序启动虚拟机实例。根据你的主机应用程序编程语言，您可以使用 WasmEdge SDK 来启动和调用 WasmEdge 函数。

- 使用 [WasmEdge C API](/category/c-sdk-for-embedding-wasmedge) 将 WasmEdge 函数嵌入到基于 `C` 的应用程序中。查看[快速入门指南](../../embed/c/intro.md)。
- 使用 [WasmEdge Go API](/category/go-sdk-for-embedding-wasmedge) 将 WasmEdge 函数嵌入到 `Go` 应用程序中。这里有一个[教程](https://www.secondstate.io/articles/extend-golang-app-with-webassembly-rust/) 和一些[示例](https://github.com/second-state/WasmEdge-go-examples)！
- 使用 [WasmEdge Rust crate](https://crates.io/crates/wasmedge-sdk) 将 WasmEdge 函数嵌入到 `Rust` 应用程序中。
- 使用 `NAPI` 将 WasmEdge 函数嵌入到 `Node.js` 应用程序中。这里有一个[教程](https://www.secondstate.io/articles/getting-started-with-rust-function/)。
- 通过生成一个新进程将 WasmEdge 函数嵌入到任何应用程序。查看 [Vercel 无服务器函数](https://www.secondstate.io/articles/vercel-wasmedge-webassembly-rust/) 和 [AWS Lambda](https://www.cncf.io/blog/2021/08/25/webassembly-serverless-functions-in-aws-lambda/) 的示例。

不过，WebAssembly 规范仅支持用于 WebAssembly 字节码函数的非常有限的输入参数和返回值的数据类型。要传递复杂数据类型（例如字符串或数组）作为来自 Rust 编译的 WebAssembly 的调用参数，你应该使用[`wasmedge-bindgen`](https://crates.io/crates/wasmedge-bindgen)提供的 `bindgen` 解决方案。我们目前在 [Rust](../../develop/rust/bindgen.md) 和 [Go](../../embed/go/bindgen.md) 中支持`wasmedge-bindgen`。

## 使用 WasmEdge 作为类似 Docker 的容器

WasmEdge 提供符合 OCI 规范的接口。你可以使用诸如 CRI-O、Docker Hub 和 Kubernetes 之类的容器工具来编排和管理 WasmEdge 运行时。

- [使用 CRI-O 和 Docker Hub 管理 WasmEdge](https://www.secondstate.io/articles/manage-webassembly-apps-in-wasmedge-using-docker-tools/)。

## 从 WasmEdge 调用本机主机函数

WasmEdge 的一个关键特性是其可扩展性。WasmEdge API 允许开发人员将来自主机编程语言的“主机函数”注册到 WasmEdge 实例中，并从 WebAssembly 程序中调用这些函数。

- WasmEdge C API 支持 [C 主机函数](../../embed/c/host_function.md)。
- WasmEdge Go API 支持 [Go 主机函数](https://github.com/second-state/WasmEdge-go-examples/tree/master/go_HostFunc#wasmedge-go-host-function-example)。
- WasmEdge Rust API 支持 [Rust 主机函数](https://github.com/second-state/wasmedge-rustsdk-examples/blob/main/README.md#host-functions)。

[这是一个示例](https://www.secondstate.io/articles/call-native-functions-from-javascript/)，演示了 WasmEdge 中的 JavaScript 程序调用底层操作系统中基于 C 的主机函数。

主机函数打破了 WASM 沙箱，以便访问底层操作系统或硬件。但这种沙箱破坏是经过系统操作者明确许可的。
