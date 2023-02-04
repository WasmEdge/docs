---
sidebar_position: 1
---

# 3.1 WasmEdge Plug-in System Introduction


WasmEdge adopts the plug-in system to custom WasmEdge according to their own needs. The plug-in system makes creating a new host function for WasmEdge easier because developers don't need to care about the internal structure and details of WasmEdge since the plug-in interface is abstracted.

## WasmEdge Currently Released Plug-ins

There are several plug-in releases with the WasmEdge official releases.
Please check the following table to check the release status and how to build from source with the plug-ins.

> The `WasmEdge-Process` plug-in is attached in the WasmEdge release tarballs.

| Plug-in                                                                                                                     | Rust Crate                     | Released Platforms                                                                          | Build Steps                                                                                                           |
| --------------------------------------------------------------------------------------------------------------------------- | ------------------------------ | ------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| WasmEdge-Process                                                                                                            | [wasmedge_process_interface][] | `manylinux2014 x86_64`, `manylinux2014 aarch64`, and `ubuntu 20.04 x86_64` (since `0.10.0`) | [Default](/docs/contribute/source/os/linux.md)                                                                         |
| [WASI-Crypto]                                                                 | [wasi-crypto][]                | `manylinux2014 x86_64`, `manylinux2014 aarch64`, and `ubuntu 20.04 x86_64` (since `0.10.1`) | [Build With WASI-Crypto](/docs/contribute/source/plugin/wasi_crypto.md)                                             |
| [WASI-NN with OpenVINO backend](/docs/develop-guide/rust/ai_inference/openvino.md)               | [wasi-nn][]                    | `ubuntu 20.04 x86_64` (since `0.10.1`)                                                      | [Build With WASI-NN](/docs/contribute/source/plugin/was_nn.md#get-wasmedge-with-wasi-nn-plug-in-openvino-backend)        |
| [WASI-NN with PyTorch backend](/docs/develop-guide/rust/ai_inference/pytorch.md)                 | [wasi-nn][]                    | `ubuntu 20.04 x86_64` (since `0.11.1`)                                                      | [Build With WASI-NN](/docs/contribute/source/plugin/was_nn.md#build-wasmedge-with-wasi-nn-pytorch-backend)         |
| [WASI-NN with TensorFlow-Lite backend](/docs/develop-guide/rust/ai_inference/pytorch.md) | [wasi-nn][]                    | `manylinux2014 x86_64`, `manylinux2014 aarch64`, and `ubuntu 20.04 x86_64` (since `0.11.2`) | [Build With WASI-NN](/docs/contribute/source/plugin/was_nn.md#build-wasmedge-with-wasi-nn-tensorflow-lite-backend) |
| [WasmEdge-HttpsReq]                                                    | [wasmedge_http_req][]          | `manylinux2014 x86_64`, and `manylinux2014 aarch64` (since `0.11.1`)                        | [Build With WasmEdge-HttpsReq](/docs/contribute/source/plugin/httpsreq.md)                                 |

> Due to the `OpenVINO` and `PyTorch` dependencies, we only release the WASI-NN plug-in on `Ubuntu 20.04 x86_64` now. We'll work with `manylinux2014` versions in the future.

[wasmedge_process_interface]: https://crates.io/crates/wasmedge_process_interface
[wasi-crypto]: https://crates.io/crates/wasi-crypto
[wasi-nn]: https://crates.io/crates/wasi-nn
[wasmedge_http_req]: https://crates.io/crates/wasmedge_http_req
