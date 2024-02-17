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
| [WasmEdge-Process](../../../contribute/source/plugin/process.md) | 允许 WebAssembly 程序在主机操作系统中执行本机命令。它支持传递参数、环境变量、`STDIN`/`STDOUT` 管道以及主机访问的安全策略。 | `manylinux2014 x86_64`，`manylinux2014 aarch64` 和 `ubuntu 20.04 x86_64`（自`0.10.0`） | [Rust](https://crates.io/crates/wasmedge_process_interface) |
| [WASI-Crypto](https://github.com/WebAssembly/wasi-crypto) | 用于运行时向 WebAssembly 模块公开的 API，以执行加密操作和密钥管理。 | `manylinux2014 x86_64`，`manylinux2014 aarch64` 和 `ubuntu 20.04 x86_64`（自`0.10.1`） | [Rust](https://crates.io/crates/wasi-crypto) |
| [WASI-NN](https://github.com/WebAssembly/wasi-nn)[（OpenVINO 后端）](../../../develop/rust/wasinn/openvino.md) | 使用 OpenVINO 模型进行 AI 推理。 | `ubuntu 20.04 x86_64`（自`0.10.1`） | [Rust](https://crates.io/crates/wasi-nn)，JavaScript |
| [WASI-NN](https://github.com/WebAssembly/wasi-nn)[（Pytorch 后端）](../../../develop/rust/wasinn/pytorch.md)   | 使用 Pytorch 模型进行 AI 推理。 | `manylinux2014 x86_64` 和 `ubuntu 20.04 x86_64`（自`0.11.1`） | [Rust](https://crates.io/crates/wasi-nn)，JavaScript |
| [WASI-NN](https://github.com/WebAssembly/wasi-nn)[（TensorFlow-Lite 后端）](../../../develop/rust/wasinn/tensorflow_lite.md)  | 使用 TensorFlow-Lite 模型进行 AI 推理。 | `manylinux2014 x86_64`，`manylinux2014 aarch64` 和 `ubuntu 20.04 x86_64`（自`0.11.2`） | [Rust](https://crates.io/crates/wasi-nn)，JavaScript |
| [WasmEdge-Image](../../../contribute/source/plugin/image.md) | 用于 AI 推理任务中处理图像的本机库。 | `manylinux2014 x86_64`，`manylinux2014 aarch64`，`ubuntu 20.04 x86_64`，`darwin x86_64` 和 `darwin arm64`（自`0.13.0`） | [Rust](https://crates.io/crates/wasmedge_tensorflow_interface)（0.3.0） |
| [WasmEdge-Tensorflow](../../../contribute/source/plugin/tensorflow.md) | 用于推理 TensorFlow 模型的本机库。 | `manylinux2014 x86_64`，`manylinux2014 aarch64`，`ubuntu 20.04 x86_64`，`darwin x86_64` 和 `darwin arm64`（自`0.13.0`） | [Rust](https://crates.io/crates/wasmedge_tensorflow_interface)（0.3.0） |
| [WasmEdge-TensorflowLite](../../../contribute/source/plugin/tensorflowlite.md)  | 用于推理 TensorFlow-Lite 模型的本机库。 | `manylinux2014 x86_64`，`manylinux2014 aarch64`，`ubuntu 20.04 x86_64`，`darwin x86_64` 和 `darwin arm64`（自`0.13.0`） | [Rust](https://crates.io/crates/wasmedge_tensorflow_interface) |
| WasmEdge-OpenCV  | 一个非常流行的常用于处理图像和视频以供 AI 输入/输出函数库。      | 未发布                                       | Rust |
| WasmEdge-eBPF    | 一个用于进行 eBPF 应用推理的原生库                           | `manylinux2014 x86_64`, `manylinux2014 aarch64`, `ubuntu 20.04 x86_64`, `darwin x86_64`, and `darwin arm64` (since `0.13.0`) | Rust                                                                   |
| WasmEdge-rustls | 一个用于进行 Rust 和 TLS 推理的原生库                        | `manylinux2014 x86_64`, `manylinux2014 aarch64`, `ubuntu 20.04 x86_64`, `darwin x86_64`, and `darwin arm64` (since `0.13.0`) | [Rust](https://crates.io/crates/wasmedge_rustls_api)                   |

## （过去的）WasmEdge 拓展

除了插件，WasmEdge 在 `0.13.0` 版本之前还提供了扩展功能。请注意，在 `0.13.0` 版本之后，这些扩展已经被相应的插件所取代。

支持这些扩展的最新版本是 `0.12.1`。当 WasmEdge 安装程序不再支持安装 `0.12.x` 版本时，本段将被废弃。

| 扩展 | 描述 | 平台支持 | 语言支持 |
| --- | --- | --- | --- |
| [图像处理](https://github.com/second-state/WasmEdge-image) | 用于处理人工智能推推理任务中的图像的本地库。在 WasmEdge `0.13.0` 版本后迁移到插件中。 | `manylinux2014 x86_64`，`manylinux2014 aarch64`，`android aarch64`，`ubuntu 20.04 x86_64` 和 `darwin x86_64` | [Rust](https://crates.io/crates/wasmedge_tensorflow_interface) (0.2.2) |
| [TensorFlow 和 Tensorflow-Lite](https://github.com/second-state/WasmEdge-tensorflow) | 用于 TensorFlow 和 TensorFlow-Lite 模型推理的本地库。在 WasmEdge `0.13.0` 版本后迁移到插件中。 | `manylinux2014 x86_64`，`manylinux2014 aarch64`（仅限TensorFlow-Lite），`android aarch64`（仅限TensorFlow-Lite），`ubuntu 20.04 x86_64` 和 `darwin x86_64` | [Rust](https://crates.io/crates/wasmedge_tensorflow_interface) (0.2.2) |
