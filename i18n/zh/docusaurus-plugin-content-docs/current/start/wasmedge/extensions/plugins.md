---
sidebar_position: 2
---

# WasmEdge 插件

对于那些过于重而难以编译成 WebAssembly的工作负载，将它们构建成本机主机函数是更好的选择。为了满足 WebAssembly 运行时的可移植性，WasmEdge 引入了插件机制，使主机函数可以加载和传输。

WasmEdge 的插件机制是一种扩展主机模块的简便方法，用户可以通过插件从由 WasmEdge 官方发布或其他开发人员发布的共享库中加载和实例化主机函数。

## 官方插件

下面列出了 WasmEdge 官方发布的插件。用户可以通过安装程序轻松安装它们。

| Plug-in | Description | Platform Support | Guest Language Support | Build From Source |
|---------|-------------|------------------|------------------------|-------------------|
| [WASI-Logging](https://github.com/WebAssembly/wasi-logging) | Logging API for WebAssembly program to log messages. | `manylinux2014 (x86_64, aarch64)`<br/>`ubuntu 20.04 (x86_64)`<br/>`darwin (x86_64, arm64)`<br/>(since `0.13.0`) | Rust | [Steps](../../../contribute/source/plugin/wasi_logging.md) |
| [WASI-Crypto](https://github.com/WebAssembly/wasi-crypto) | APIs that a runtime can expose to WebAssembly modules in order to perform cryptographic operations and key management. | `manylinux2014 (x86_64, aarch64)`<br/>`ubuntu 20.04 (x86_64)`<br/>(since `0.10.1`) | [Rust](https://crates.io/crates/wasi-crypto) | [Steps](../../../contribute/source/plugin/wasi_crypto.md) |
| [WASI-NN](https://github.com/WebAssembly/wasi-nn) [(OpenVINO backend)](../../../develop/rust/wasinn/openvino.md) | AI inference using OpenVINO models. | `ubuntu 20.04 (x86_64)`<br/>(since `0.10.1`) | [Rust](https://crates.io/crates/wasi-nn), JavaScript | [Steps](../../../contribute/source/plugin/wasi_nn.md#build-wasmedge-with-wasi-nn-openvino-backend) |
| [WASI-NN](https://github.com/WebAssembly/wasi-nn) [(Pytorch backend)](../../../develop/rust/wasinn/pytorch.md) | AI inference using Pytorch models. | `manylinux2014 (x86_64)`<br/>`ubuntu 20.04 (x86_64)`<br/>(since `0.11.1`) | [Rust](https://crates.io/crates/wasi-nn), JavaScript | [Steps](../../../contribute/source/plugin/wasi_nn.md#build-wasmedge-with-wasi-nn-pytorch-backend) |
| [WASI-NN](https://github.com/WebAssembly/wasi-nn) [(TensorFlow-Lite backend)](../../../develop/rust/wasinn/tensorflow_lite.md) | AI inference using TensorFlow-Lite models. | `manylinux2014 (x86_64, aarch64)`<br/>`ubuntu 20.04 (x86_64)`<br/>(since `0.11.2`) | [Rust](https://crates.io/crates/wasi-nn), JavaScript | [Steps](../../../contribute/source/plugin/wasi_nn.md#build-wasmedge-with-wasi-nn-tensorflow-lite-backend) |
| [WASI-NN](https://github.com/WebAssembly/wasi-nn) [(Ggml backend)](../../../develop/rust/wasinn/llm_inference.md) | AI inference using LLM interfaces. | `manylinux2014 (x86_64, aarch64)`<br/>`ubuntu 20.04 (x86_64)`<br/>`darwin (x86_64, arm64)`<br/>(since `0.13.4`) | [Rust](https://github.com/second-state/wasmedge-wasi-nn) | [Steps](../../../contribute/source/plugin/wasi_nn.md#build-wasmedge-with-wasi-nn-llamacpp-backend) |
| [WASI-NN](https://github.com/WebAssembly/wasi-nn) [(Piper backend)](../../../develop/rust/wasinn/piper.md) | AI inference using Piper models. | `manylinux_2_28 (x86_64, aarch64)`<br/>`ubuntu 20.04 (x86_64)`<br/>(since `0.14.1`) | [Rust](https://github.com/second-state/wasmedge-wasi-nn) | [Steps](../../../contribute/source/plugin/wasi_nn.md#build-wasmedge-with-wasi-nn-piper-backend) |
| [WASI-NN](https://github.com/WebAssembly/wasi-nn) [(Whisper backend)](../../../develop/rust/wasinn/whisper.md) | AI inference using Whisper models. | `manylinux2014 (x86_64, aarch64)`<br/>`ubuntu 20.04 (x86_64)`<br/>`darwin (x86_64, arm64)`<br/>(since `0.14.1`) | [Rust](https://github.com/second-state/wasmedge-wasi-nn) | [Steps](../../../contribute/source/plugin/wasi_nn.md#build-wasmedge-with-wasi-nn-whisper-backend) |
| [WASI-NN](https://github.com/WebAssembly/wasi-nn) Burn.rs backend (Squeezenet) | AI inference using Squeezenet models in Burn.rs. | `ubuntu 20.04 (x86_64)`<br/>(since `0.14.1`) | [Rust](https://github.com/second-state/wasmedge-wasi-nn) | |
| [WASI-NN](https://github.com/WebAssembly/wasi-nn) Burn.rs backend (Whisper) | AI inference using Whisper models in Burn.rs. | `ubuntu 20.04 (x86_64)`<br/>(since `0.14.1`) | [Rust](https://github.com/second-state/wasmedge-wasi-nn) | |
| WasmEdge-ffmpeg | | `manylinux2014 (x86_64, aarch64)`<br/>`ubuntu 20.04 (x86_64)`<br/>`darwin (x86_64, arm64)`<br/>(since `0.14.0`) | | |
| [WasmEdge-Image](../../../contribute/source/plugin/image.md) | A native library to manipulate images for AI inference tasks. | `manylinux2014 (x86_64, aarch64)`<br/>`ubuntu 20.04 (x86_64)`<br/>`darwin (x86_64, arm64)`<br/>(since `0.13.0`) | [Rust](https://crates.io/crates/wasmedge_tensorflow_interface) (0.3.0) | [Steps](../../../contribute/source/plugin/image.md) |
| WasmEdge-LLMC | | `manylinux2014 (x86_64, aarch64)`<br/>`ubuntu 20.04 (x86_64)`<br/>(since `0.14.1`) | | |
| WasmEdge-OpenCV | Very popular utility functions to process images and videos for AI input/output. | `manylinux2014 (x86_64, aarch64)`<br/>`ubuntu 20.04 (x86_64)`<br/>`darwin (x86_64, arm64)`<br/>(since `0.13.3`) | | |
| [WasmEdge-Process](../../../contribute/source/plugin/process.md) | Allows WebAssembly programs to execute native commands in the host operating system. It supports passing arguments, environment variables, `STDIN`/`STDOUT` pipes, and security policies for host access. | `manylinux2014 (x86_64, aarch64)`<br/>`ubuntu 20.04 (x86_64)`<br/>(since `0.10.0`) | [Rust](https://crates.io/crates/wasmedge_process_interface) | [Steps](../../../contribute/source/plugin/process.md) |
| WasmEdge-StableDiffusion | | `manylinux2014 (x86_64, aarch64)`<br/>`ubuntu 20.04 (x86_64)`<br/>`darwin (x86_64, arm64)`<br/>(since `0.14.1`) | | |
| [WasmEdge-Tensorflow](../../../contribute/source/plugin/tensorflow.md) | A native library for inferring TensorFlow models.| `manylinux2014 (x86_64, aarch64)`<br/>`ubuntu 20.04 (x86_64)`<br/>`darwin (x86_64, arm64)`<br/>(since `0.13.0`) | [Rust](https://crates.io/crates/wasmedge_tensorflow_interface) (0.3.0) | [Steps](../../../contribute/source/plugin/tensorflow.md) |
| [WasmEdge-TensorflowLite](../../../contribute/source/plugin/tensorflowlite.md)| A native library for inferring TensorFlow-Lite models. | `manylinux2014 (x86_64, aarch64)`<br/>`ubuntu 20.04 (x86_64)`<br/>`darwin (x86_64, arm64)`<br/>(since `0.13.0`) | [Rust](https://crates.io/crates/wasmedge_tensorflow_interface) (0.3.0) | [Steps](../../../contribute/source/plugin/tensorflowlite.md) |
| WasmEdge-zlib | ??? | `manylinux2014 (x86_64, aarch64)`<br/>`ubuntu 20.04 (x86_64)`<br/>`darwin (x86_64, arm64)`<br/>(since `0.13.5`) | | |
| [WasmEdge-eBPF](../../../contribute/source/plugin/ebpf.md) | A native library for inferring eBPF applications | `manylinux2014 (x86_64,  aarch64)`<br/>`ubuntu 20.04 (x86_64)`<br/>(since `0.13.2`) | Rust | [Steps](../../../contribute/source/plugin/ebpf.md) |
| [WasmEdge-rustls](../../../contribute/source/plugin/rusttls.md) (DEPRECATED) | A native library for inferring Rust and TLS Library | `manylinux2014 (x86_64, aarch64)`<br/>`ubuntu 20.04 (x86_64)`<br/>`darwin (x86_64, arm64)`<br/>(since `0.13.0`, until `0.13.5`) | [Rust](https://crates.io/crates/wasmedge_rustls_api) | [Steps](../../../contribute/source/plugin/rusttls.md) |
