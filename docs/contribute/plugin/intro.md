---
sidebar_position: 1
---

# WasmEdge Plug-in System Introduction

While the WasmEdge language SDKs allow registering host functions from a host (wrapping) application, developers should implement the host functions before compilation.

For the other solutions, WasmEdge provides the plug-in architecture to load the plug-in shared library for easier extending of the host functions.

With developing the plug-ins, WasmEdge SDKs in the supported languages can load and register the host functions from the plug-in shared libraries.

In current, developers can follow the guides to implement the plug-ins in [C API (recommended)](develop_plugin_c.md) or [C++](develop_plugin_cpp.md).

## Loadable Plug-in

Loadable plugins are standalone shared libraries (`.so`/`.dylib`/`.dll` files) that can be loaded by the WasmEdge runtime environment at runtime. These plugins can provide additional functionality to the WasmEdge runtime environment, such as new modules that can be imported by WebAssembly modules.

To create a loadable plugin for WasmEdge, developers can use the WasmEdge Plugin SDK, which provides a set of Rust, C and C++ APIs for creating and registering plugins. The SDK also includes [example code](https://github.com/WasmEdge/WasmEdge/tree/master/examples/plugin/get-string) that demonstrates how to create a simple plugin that returns a string.

Once a loadable plugin has been created, it can be loaded by the WasmEdge runtime environment using the `WasmEdge_LoadWasmFromFile` or `WasmEdge_LoadWasmFromBuffer` API. The plugin can then be used to provide functionality to WebAssembly modules, such as access to system resources or specialized hardware.

### Load plug-ins from paths

To make use of the plug-ins, developers should first load them from specific paths.

```c
WasmEdge_PluginLoadWithDefaultPaths();
```

After calling this API, the plug-ins located in the default paths will be loaded. The default paths include:

1. The path given in the environment variable `WASMEDGE_PLUGIN_PATH`.
2. The `../plugin/` directory related to the WasmEdge installation path.
3. The `./wasmedge/` directory under the library path if the WasmEdge is installed in the system directory (such as `/usr` and `/usr/local`).

To load the plug-ins from a specific path or under a specific directory, developers can use the following API:

```c
WasmEdge_PluginLoadFromPath("PATH_TO_PLUGIN/plugin.so");
```

Here's a flowchart that shows the basic steps involved in creating and using a loadable plugin in WasmEdge:

<div style="text-align: center;">
  <div class="mermaid">
    graph TD
    A[Create Plugin]
    B[Compile Plugin]
    C[Load Plugin]
    D[Register Plugin]
    E[Load WebAssembly Module]
    F[Import Plugin Module]
    G[Execute WebAssembly Module]
    A --> B
    B --> C
    C --> D
    D --> E
    E --> F
    F --> G
  </div>
</div>

This flowchart shows the basic steps involved in creating and using a loadable plugin in WasmEdge. The first step is to create the plugin, which involves writing the code for the plugin functions and compiling the code into a shared library.

The WasmEdge runtime loads the plugin from specific paths, including the environment variable *WASMEDGE_PLUGIN_PATH*, the  `../plugin/` directory related to the WasmEdge installation path, and the `./wasmedge/` directory if WasmEdge is installed in a system directory. The plugin can then be registered with the runtime environment for subsequent usage using the `WasmEdge_RegisterImport` API.

After the plugin has been registered, a WebAssembly module can be loaded using the `WasmEdge_LoadWasmFromFile` or `WasmEdge_LoadWasmFromBuffer` API. The module can then import the plugin module using the `WasmEdge_VMRegisterModule` API.

Finally, the WebAssembly module can execute its functions, which may call the functions provided by the plugin module. The plugin functions can then perform their specific tasks, such as accessing system resources or specialized hardware.

## WasmEdge Currently Released Plug-ins

There are several plug-in releases with the WasmEdge official releases. Please check the following table to check the release status and how to build from source with the plug-ins.

> The `WasmEdge-Process` plug-in is attached in the WasmEdge release tarballs.

| Plug-in | Rust Crate | Released Platforms | Build Steps |
| --- | --- | --- | --- |
| WasmEdge-Process | [wasmedge_process_interface][] | `manylinux2014 x86_64`, `manylinux2014 aarch64`, and `ubuntu 20.04 x86_64` (since `0.10.0`) | [Default](/contribute/source/os/linux) |
| [WASI-Crypto] | [wasi-crypto][] | `manylinux2014 x86_64`, `manylinux2014 aarch64`, and `ubuntu 20.04 x86_64` (since `0.10.1`) | [Build With WASI-Crypto](/contribute/source/plugin/wasi_crypto) |
| [WASI-NN with OpenVINO backend](/develop/rust/ai_inference/openvino) | [wasi-nn][] | `ubuntu 20.04 x86_64` (since `0.10.1`) | [Build With WASI-NN](/contribute/source/plugin/was_nn#get-wasmedge-with-wasi-nn-plug-in-openvino-backend) |
| [WASI-NN with PyTorch backend](/develop/rust/ai_inference/pytorch) | [wasi-nn][] | `ubuntu 20.04 x86_64` (since `0.11.1`) | [Build With WASI-NN](/contribute/source/plugin/was_nn#build-wasmedge-with-wasi-nn-pytorch-backend) |
| [WASI-NN with TensorFlow-Lite backend](/develop/rust/ai_inference/pytorch) | [wasi-nn][] | `manylinux2014 x86_64`, `manylinux2014 aarch64`, and `ubuntu 20.04 x86_64` (since `0.11.2`) | [Build With WASI-NN](/contribute/source/plugin/was_nn#build-wasmedge-with-wasi-nn-tensorflow-lite-backend) |
| [WasmEdge-HttpsReq] | [wasmedge_http_req][] | `manylinux2014 x86_64`, and `manylinux2014 aarch64` (since `0.11.1`) | [Build With WasmEdge-HttpsReq](/contribute/source/plugin/httpsreq) |

> Due to the `OpenVINO` and `PyTorch` dependencies, we only release the WASI-NN plug-in on `Ubuntu 20.04 x86_64` now. We'll work with `manylinux2014` versions in the future.

[wasmedge_process_interface]: https://crates.io/crates/wasmedge_process_interface
[wasi-crypto]: https://crates.io/crates/wasi-crypto
[wasi-nn]: https://crates.io/crates/wasi-nn
[wasmedge_http_req]: https://crates.io/crates/wasmedge_http_req
