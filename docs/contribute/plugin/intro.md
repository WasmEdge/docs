---
sidebar_position: 1
---

# 3.1 WasmEdge Plug-in System Introduction

While the WasmEdge language SDKs allow registering host functions from a host (wrapping) application, developers should implement the host functions before compilation. However, for more flexible and dynamic extension of the host functions, WasmEdge provides a plug-in architecture to load the plug-in shared library.

A WasmEdge plugin is a software component that extends the functionality of the WasmEdge runtime. Currently, developers can follow the guides to implement the plug-ins in [C API](develop_plugin_c.md) (recommended) or [C++](develop_plugin_cpp.md). With the help of the WasmEdge SDKs in the supported languages, developers can load and register the host functions from the plug-in shared libraries, allowing them to seamlessly integrate the plugins into the WasmEdge runtime as if they were part of the core runtime.

<div style="text-align: center;">
  <div class="mermaid">
graph LR
    A((Host Application)) -- Loads --> B((Plugin Shared Library))
    B -- Registers --> C((Wasmedge Runtime))
  </div>
</div>


In this diagram, the *Host Application* represents the application or environment where the Wasmedge runtime is embedded or used. The *Plugin Shared Library* refers to the library containing the plugin code and functions that extend the functionality of the Wasmedge runtime. The *Wasmedge Runtime* represents the runtime environment that executes WebAssembly modules, including the core runtime and any registered plugins.

## Usages of WasmEdge Plugin

WasmEdge plugins can be used in a variety of ways, depending on the specific needs of a project. Plugins can be used to add new functionality to the WasmEdge runtime, or to customize the runtime to suit the specific needs of a project. Plugins can also be used to improve performance by offloading compute-intensive tasks to edge devices, or to improve security by running code in a sandboxed environment.

## Benefits of Using WasmEdge Plugin

WasmEdge plugins are designed to extend the functionality of the WasmEdge runtime, and can be useful for developers and end-users in several ways:

* **Versatility:** WasmEdge plugins can be developed in multiple programming languages that can compile to WebAssembly, allowing developers to write plugins in the language they're most comfortable with.

* **Customization:** WasmEdge plugins can be customized to suit the specific needs of a project. Developers can create plugins that integrate with other systems or tools, or that provide unique functionality that's not available in the core WasmEdge runtime.

* **Performance:** WasmEdge plugins are designed to work seamlessly with the core runtime, minimizing overhead and maximizing performance. This means that they can provide additional functionality without sacrificing performance.

* **Ease of use:** WasmEdge plugins are easy to use and integrate with the WasmEdge runtime. Developers can simply load the plugin into the runtime and use its functions as if they were part of the core runtime.

* **Scalability:** WasmEdge plugins can be used to scale applications by offloading compute-intensive tasks to edge devices. This can reduce the load on central servers and improve performance.

* **Security:** WasmEdge plugins run in a sandboxed environment, which helps to reduce the risk of security vulnerabilities. Additionally, plugins can be digitally signed to ensure authenticity and integrity.

WasmEdge plugins can provide developers and users with a versatile, customizable, high-performance, and secure way to extend the functionality of the WasmEdge runtime. WasmEdge plugins can also improve scalability and ease of use, making it easier to build and deploy complex applications on edge devices.

## Loadable Plug-in

Loadable plugin is a standalone `.so`/`.dylib`/`.dll` file that WasmEdge can load during runtime environment, and provide modules to be imported.

Please [refer to the plugin example code](https://github.com/WasmEdge/WasmEdge/tree/master/examples/plugin/get-string).

## WasmEdge Currently Released Plug-ins

There are several plug-in releases with the WasmEdge official releases.
Please check the following table to check the release status and how to build from source with the plug-ins.

> The `WasmEdge-Process` plug-in is attached in the WasmEdge release tarballs.

| Plug-in                                                                                                                     | Rust Crate                     | Released Platforms                                                                          | Build Steps                                                                                                     |
| --------------------------------------------------------------------------------------------------------------------------- | ------------------------------ | ------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| WasmEdge-Process                                                                                                            | [wasmedge_process_interface][] | `manylinux2014 x86_64`, `manylinux2014 aarch64`, and `ubuntu 20.04 x86_64` (since `0.10.0`) | [Default](/contribute/source/os/linux)                                                                      |
| [WASI-Crypto]                                                                 | [wasi-crypto][]                | `manylinux2014 x86_64`, `manylinux2014 aarch64`, and `ubuntu 20.04 x86_64` (since `0.10.1`) | [Build With WASI-Crypto](/contribute/source/plugin/wasi_crypto)                                          |
| [WASI-NN with OpenVINO backend](/develop/rust/ai_inference/openvino)               | [wasi-nn][]                    | `ubuntu 20.04 x86_64` (since `0.10.1`)                                                      | [Build With WASI-NN](/contribute/source/plugin/was_nn#get-wasmedge-with-wasi-nn-plug-in-openvino-backend)  |
| [WASI-NN with PyTorch backend](/develop/rust/ai_inference/pytorch)                 | [wasi-nn][]                    | `ubuntu 20.04 x86_64` (since `0.11.1`)                                                      | [Build With WASI-NN](/contribute/source/plugin/was_nn#build-wasmedge-with-wasi-nn-pytorch-backend)   |
| [WASI-NN with TensorFlow-Lite backend](/develop/rust/ai_inference/pytorch) | [wasi-nn][]                    | `manylinux2014 x86_64`, `manylinux2014 aarch64`, and `ubuntu 20.04 x86_64` (since `0.11.2`) | [Build With WASI-NN](/contribute/source/plugin/was_nn#build-wasmedge-with-wasi-nn-tensorflow-lite-backend) |
| [WasmEdge-HttpsReq]                                                    | [wasmedge_http_req][]          | `manylinux2014 x86_64`, and `manylinux2014 aarch64` (since `0.11.1`)                        | [Build With WasmEdge-HttpsReq](/contribute/source/plugin/httpsreq)                               |

> Due to the `OpenVINO` and `PyTorch` dependencies, we only release the WASI-NN plug-in on `Ubuntu 20.04 x86_64` now. We'll work with `manylinux2014` versions in the future.

[wasmedge_process_interface]: https://crates.io/crates/wasmedge_process_interface
[wasi-crypto]: https://crates.io/crates/wasi-crypto
[wasi-nn]: https://crates.io/crates/wasi-nn
[wasmedge_http_req]: https://crates.io/crates/wasmedge_http_req
