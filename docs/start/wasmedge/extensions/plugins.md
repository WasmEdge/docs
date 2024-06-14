---
sidebar_position: 2
---

# WasmEdge Plug-ins

For those workloads which are too heavy to compile into WebAssembly, it would be more appropriate to build them into native host functions. To satisfy the portability of WebAssembly runtime, WasmEdge introduced the plug-in mechanism to make the host functions loadable and portable.

The plug-in mechanism for WasmEdge is an easy way to extend the host modules from loadable shared libraries. With the plug-ins, users can load and instantiate the host functions from the shared libraries released by WasmEdge official or even by other developers.

## Official Released Plug-ins

The following lists are the WasmEdge official released plug-ins. Users can install them easily by the installer.

| Plug-in | Description | Platform Support | Guest Language Support | Build From Source |
|---------|-------------|------------------|------------------------|-------------------|
| [WasmEdge-Process](../../../contribute/source/plugin/process.md) | Allows WebAssembly programs to execute native commands in the host operating system. It supports passing arguments, environment variables, `STDIN`/`STDOUT` pipes, and security policies for host access. | `manylinux2014 (x86_64, aarch64)`<br/>`ubuntu 20.04 (x86_64)`<br/>(since `0.10.0`) | [Rust](https://crates.io/crates/wasmedge_process_interface) | [Steps](../../../contribute/source/plugin/process.md) |
| [WASI-Crypto](https://github.com/WebAssembly/wasi-crypto) | APIs that a runtime can expose to WebAssembly modules in order to perform cryptographic operations and key management. | `manylinux2014 (x86_64, aarch64)`<br/>`ubuntu 20.04 (x86_64)`<br/>(since `0.10.1`) | [Rust](https://crates.io/crates/wasi-crypto) | [Steps](../../../contribute/source/plugin/wasi_crypto.md) |
| [WASI-NN](https://github.com/WebAssembly/wasi-nn) [(OpenVINO backend)](../../../develop/rust/wasinn/openvino.md) | AI inference using OpenVINO models. | `ubuntu 20.04 (x86_64)`<br/>(since `0.10.1`) | [Rust](https://crates.io/crates/wasi-nn), JavaScript | [Steps](../../../contribute/source/plugin/wasi_nn.md#build-wasmedge-with-wasi-nn-openvino-backend) |
| [WASI-NN](https://github.com/WebAssembly/wasi-nn) [(Pytorch backend)](../../../develop/rust/wasinn/pytorch.md) | AI inference using Pytorch models. | `manylinux2014 (x86_64)`<br/>`ubuntu 20.04 (x86_64)`<br/>(since `0.11.1`) | [Rust](https://crates.io/crates/wasi-nn), JavaScript | [Steps](../../../contribute/source/plugin/wasi_nn.md#build-wasmedge-with-wasi-nn-pytorch-backend) |
| [WASI-NN](https://github.com/WebAssembly/wasi-nn) [(TensorFlow-Lite backend)](../../../develop/rust/wasinn/tensorflow_lite.md) | AI inference using TensorFlow-Lite models. | `manylinux2014 (x86_64, aarch64)`<br/>`ubuntu 20.04 (x86_64)`<br/>(since `0.11.2`) | [Rust](https://crates.io/crates/wasi-nn), JavaScript | [Steps](../../../contribute/source/plugin/wasi_nn.md#build-wasmedge-with-wasi-nn-tensorflow-lite-backend) |
| [WASI-NN](https://github.com/WebAssembly/wasi-nn) [(Ggml backend)](../../../develop/rust/wasinn/llm_inference.md) | AI inference using LLM interfaces. | `manylinux2014 (x86_64, aarch64)`<br/>`ubuntu 20.04 (x86_64)`<br/>`darwin (x86_64, arm64)`<br/>(since `0.13.4`) | [Rust](https://github.com/second-state/wasmedge-wasi-nn) | [Steps](../../../contribute/source/plugin/wasi_nn.md#build-wasmedge-with-wasi-nn-llamacpp-backend) |
| [WASI-Logging](https://github.com/WebAssembly/wasi-logging) | Logging API for WebAssembly program to log messages. | `manylinux2014 (x86_64, aarch64)`<br/>`ubuntu 20.04 (x86_64)`<br/>`darwin (x86_64, arm64)`<br/>(since `0.13.0`) | Rust | [Steps](../../../contribute/source/plugin/wasi_logging.md) |
| [WasmEdge-Image](../../../contribute/source/plugin/image.md) | A native library to manipulate images for AI inference tasks. | `manylinux2014 (x86_64, aarch64)`<br/>`ubuntu 20.04 (x86_64)`<br/>`darwin (x86_64, arm64)`<br/>(since `0.13.0`) | [Rust](https://crates.io/crates/wasmedge_tensorflow_interface) (0.3.0) | [Steps](../../../contribute/source/plugin/image.md) |
| [WasmEdge-Tensorflow](../../../contribute/source/plugin/tensorflow.md) | A native library for inferring TensorFlow models.| `manylinux2014 (x86_64, aarch64)`<br/>`ubuntu 20.04 (x86_64)`<br/>`darwin (x86_64, arm64)`<br/>(since `0.13.0`) | [Rust](https://crates.io/crates/wasmedge_tensorflow_interface) (0.3.0) | [Steps](../../../contribute/source/plugin/tensorflow.md) |
| [WasmEdge-TensorflowLite](../../../contribute/source/plugin/tensorflowlite.md)| A native library for inferring TensorFlow-Lite models. | `manylinux2014 (x86_64, aarch64)`<br/>`ubuntu 20.04 (x86_64)`<br/>`darwin (x86_64, arm64)`<br/>(since `0.13.0`) | [Rust](https://crates.io/crates/wasmedge_tensorflow_interface) (0.3.0) | [Steps](../../../contribute/source/plugin/tensorflowlite.md) |
| WasmEdge-OpenCV | Very popular utility functions to process images and videos for AI input/output. | `manylinux2014 (x86_64, aarch64)`<br/>`ubuntu 20.04 (x86_64)`<br/>`darwin (x86_64, arm64)`<br/>(since `0.13.3`) | Rust | |
| [WasmEdge-eBPF](../../../contribute/source/plugin/ebpf.md) | A native library for inferring eBPF applications | `manylinux2014 (x86_64,  aarch64)`<br/>`ubuntu 20.04 (x86_64)`<br/>(since `0.13.2`) | Rust | [Steps](../../../contribute/source/plugin/ebpf.md) |
| [WasmEdge-rustls](../../../contribute/source/plugin/rusttls.md) (DEPRECATED) | A native library for inferring Rust and TLS Library | `manylinux2014 (x86_64, aarch64)`<br/>`ubuntu 20.04 (x86_64)`<br/>`darwin (x86_64, arm64)`<br/>(since `0.13.0`, until `0.13.5`) | [Rust](https://crates.io/crates/wasmedge_rustls_api) | [Steps](../../../contribute/source/plugin/rusttls.md) |

## Old WasmEdge Extensions

Besides the plug-ins, WasmEdge provides the extensions before the `0.13.0` versions. Noticed that the extensions are replaced by the corresponding plug-ins after the `0.13.0` version.

The latest version supporting the extensions is `0.12.1`. This chapter will be deprecated when the `0.12.x` versions are no longer supported by the WasmEdge installer.

| Extension | Description | Platform Support | Language support |
| --- | --- | --- | --- |
| [Image processing](https://github.com/second-state/WasmEdge-image) | A native library to manipulate images for AI inference tasks. Migrated into the plug-in after WasmEdge `0.13.0`. | `manylinux2014 x86_64`, `manylinux2014 aarch64`, `android aarch64`, `ubuntu 20.04 x86_64`, and `darwin x86_64` | [Rust](https://crates.io/crates/wasmedge_tensorflow_interface) (0.2.2) |
| [TensorFlow and Tensorflow-Lite](https://github.com/second-state/WasmEdge-tensorflow) | A native library to inferring TensorFlow and TensorFlow-Lite models. Migrated into the plug-in after WasmEdge `0.13.0`. | `manylinux2014 x86_64`, `manylinux2014 aarch64` (TensorFlow-Lite only), `android aarch64` (TensorFlow-Lite only), `ubuntu 20.04 x86_64`, and `darwin x86_64` | [Rust](https://crates.io/crates/wasmedge_tensorflow_interface) (0.2.2) |
