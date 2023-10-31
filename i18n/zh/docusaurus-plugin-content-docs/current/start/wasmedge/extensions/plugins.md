---
sidebar_position: 2
---

# WasmEdge 插件

对于那些过于重而难以编译成 WebAssembly的工作负载，将它们构建成本机主机函数是更好的选择。为了满足 WebAssembly 运行时的可移植性，WasmEdge 引入了插件机制，使主机函数可以加载和传输。

WasmEdge 的插件机制是一种扩展主机模块的简便方法，用户可以通过插件从由 WasmEdge 官方发布或其他开发人员发布的共享库中加载和实例化主机函数。

## 官方插件

下面列出了 WasmEdge 官方发布的插件。用户可以通过安装程序轻松安装它们。

| 插件 | 描述 | 平台支持 | 语言支持 |
| --- | --- | --- | --- |
| WasmEdge-Process | 允许 WebAssembly 程序在主机操作系统中执行本机命令。它支持传递参数、环境变量、`STDIN`/`STDOUT` 管道以及主机访问的安全策略。 | `manylinux2014 x86_64`，`manylinux2014 aarch64` 和 `ubuntu 20.04 x86_64`（自`0.10.0`） | [Rust](https://crates.io/crates/wasmedge_process_interface) |
| [WASI-Crypto](https://github.com/WebAssembly/wasi-crypto) | 用于运行时向 WebAssembly 模块公开的 API，以执行加密操作和密钥管理。 | `manylinux2014 x86_64`，`manylinux2014 aarch64` 和 `ubuntu 20.04 x86_64`（自`0.10.1`） | [Rust](https://crates.io/crates/wasi-crypto) |
| [WASI-NN](https://github.com/WebAssembly/wasi-nn)（OpenVINO 后端） | 使用 OpenVINO 模型进行 AI 推理。 | `ubuntu 20.04 x86_64`（自`0.10.1`） | [Rust](https://crates.io/crates/wasi-nn)，JavaScript |
| [WASI-NN](https://github.com/WebAssembly/wasi-nn)（Pytorch 后端） | 使用 Pytorch 模型进行 AI 推理。 | `manylinux2014 x86_64` 和 `ubuntu 20.04 x86_64`（自`0.11.1`） | [Rust](https://crates.io/crates/wasi-nn)，JavaScript |
| [WASI-NN](https://github.com/WebAssembly/wasi-nn)（TensorFlow-Lite 后端） | 使用 TensorFlow-Lite 模型进行 AI 推理。 | `manylinux2014 x86_64`，`manylinux2014 aarch64` 和 `ubuntu 20.04 x86_64`（自`0.11.2`） | [Rust](https://crates.io/crates/wasi-nn)，JavaScript |
| WasmEdge-Image | 用于 AI 推理任务中处理图像的本机库。 | `manylinux2014 x86_64`，`manylinux2014 aarch64`，`ubuntu 20.04 x86_64`，`darwin x86_64` 和 `darwin arm64`（自`0.13.0`） | [Rust](https://crates.io/crates/wasmedge_tensorflow_interface)（0.3.0） |
| WasmEdge-Tensorflow | 用于推理 TensorFlow 模型的本机库。 | `manylinux2014 x86_64`，`manylinux2014 aarch64`，`ubuntu 20.04 x86_64`，`darwin x86_64` 和 `darwin arm64`（自`0.13.0`） | [Rust](https://crates.io/crates/wasmedge_tensorflow_interface)（0.3.0） |
| WasmEdge-TensorflowLite | 用于推理 TensorFlow-Lite 模型的本机库。 | `manylinux2014 x86_64`，`manylinux2014 aarch64`，`ubuntu 20.04 x86_64`，`darwin x86_64` 和 `darwin arm64`（自`0.13.0`） | [Rust](https://crates.io/crates/wasmedge_tensorflow_interface) |
| WasmEdge-OpenCV | 用于处理图像和视频以供 AI 输入/输出的非常流行的实用程序函数。 | 未发布 | Rust |
