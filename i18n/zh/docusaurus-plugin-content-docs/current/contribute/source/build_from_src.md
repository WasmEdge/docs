---
sidebar_position: 1
---

# Build Guide

Please follow this guide to build and test WasmEdge from the source code.

- [Linux](os/linux.md)
- [MacOS](os/macos.md)
- [Windows](os/windows.md)
- [Android](/category/build-and-run-wasmedge-on-android)
- [OpenWrt](os/openwrt.md)
- [RISC-V](os/riscv64.md)
- [OpenHarmony](os/openharmony.md)
- [seL4](os/sel4)
- [Raspberry Pi](os/raspberrypi.md)

<!-- prettier-ignore -->
:::note
If you just want the latest builds from the `HEAD` of the `master` branch, and do not want to build it yourself, you can download the release package directly from our Github Action's CI artifact. [Here is an example](https://github.com/WasmEdge/WasmEdge/actions/runs/1521549504#artifacts).
:::

## What Will Be Built

WasmEdge provides various tools for enabling different runtime environments for optimal performance. You can find that there are several wasmedge related tools:

1. `wasmedge` is the general wasm runtime.
   - `wasmedge` executes a `WASM` file in the interpreter mode or a compiled `WASM` file in the ahead-of-time compilation mode.
   - To disable building all tools, you can set the CMake option `WASMEDGE_BUILD_TOOLS` to `OFF`.
2. `wasmedgec` is the ahead-of-time `WASM` compiler.

   - `wasmedgec` compiles a general `WASM` file into a compiled `WASM` file.
   - To disable building the ahead-of-time compiler only, you can set the CMake option `WASMEDGE_BUILD_AOT_RUNTIME` to `OFF`.

   <!-- prettier-ignore -->
   :::note
   The usage of `wasmedgec` is equal to `wasmedge compile`. We decide to deprecate `wasmedgec` in the future.
   :::

3. `libwasmedge.so` is the WasmEdge C API shared library. (`libwasmedge.dylib` on MacOS and `wasmedge.dll` on Windows)
   - `libwasmedge.so`, `libwasmedge.dylib`, or `wasmedge.dll` provides the C API for the ahead-of-time compiler and the WASM runtime.
   - The APIs related to the ahead-of-time compiler will always fail if the CMake option `WASMEDGE_BUILD_AOT_RUNTIME` is set as `OFF`.
   - To disable building just the shared library, you can set the CMake option `WASMEDGE_BUILD_SHARED_LIB` to `OFF`.
4. `ssvm-qitc` is for AI applications and supports the ONNC runtime for AI models in the ONNX format.
   - If you want to try `ssvm-qitc`, please refer to [ONNC-Wasm](https://github.com/ONNC/onnc-wasm) project to set up the working environment and tryout several examples.
   - And here is our [tutorial for ONNC-WASM project(YouTube Video)](https://www.youtube.com/watch?v=cbiPuHMS-iQ).

## CMake Building Options

Developers can set the CMake options to customize the WasmEdge building.

1. `WASMEDGE_BUILD_TESTS`: build the WasmEdge tests. Default is `OFF`.
2. `WASMEDGE_BUILD_AOT_RUNTIME`: build with the Ahead-of-Time compiler supporting. Default is `ON`.
3. `WASMEDGE_BUILD_SHARED_LIB`: build the WasmEdge shared library (`libwasmedge.so`, `libwasmedge.dylib`, or `wasmedge.dll`). Default is `ON`.
   - By default, the WasmEdge shared library will link to the LLVM shared library.
4. `WASMEDGE_BUILD_STATIC_LIB`: build the WasmEdge static library (`libwasmedge.a`, Linux and MacOS platforms, experimental). Default is `OFF`.
   - If this option is set as `ON`, the option `WASMEDGE_FORCE_DISABLE_LTO` will forcefully be set as `ON`.
   - If this option is set as `ON`, the `libz` and `libtinfo` on Linux platforms will be statically linked.
   - For linking with `libwasmedge.a`, developers should also add the `-ldl`, `-pthread`, `-lm`, and `-lstdc++` linker options on both Linux and MacOS platforms, and `-lrt` on Linux platforms.
5. `WASMEDGE_BUILD_TOOLS`: build the `wasmedge` and `wasmedgec` tools. Default is `ON`.
   - The `wasmedge` and `wasmedgec` tools will link to the WasmEdge shared library by default.
   - If this option is set as `ON` and `WASMEDGE_BUILD_AOT_RUNTIME` is set as `OFF`, the `wasmedgec` tool for the AOT compiler will not be built.
   - If this option is set as `ON` but the option `WASMEDGE_LINK_TOOLS_STATIC` is set as `OFF`, the option `WASMEDGE_BUILD_SHARED_LIB` will forcefully be set as `ON`.
   - If this option and the option `WASMEDGE_LINK_TOOLS_STATIC` are both set as `ON`, the `WASMEDGE_LINK_LLVM_STATIC` and `WASMEDGE_BUILD_STATIC_LIB` will both be set as `ON`, and the `wasmedge` and `wasmedgec` tools will link to the WasmEdge static library instead. In this case, the plug-ins will not work in tools.
6. `WASMEDGE_BUILD_PLUGINS`: build the WasmEdge plug-ins. Default is `ON`.
7. `WASMEDGE_BUILD_EXAMPLE`: build the WasmEdge examples. Default is `OFF`.
8. `WASMEDGE_FORCE_DISABLE_LTO`: forcefully turn off the link time optimization. Default is `OFF`.
9. `WASMEDGE_LINK_LLVM_STATIC`: link the LLVM and lld libraries statically (Linux and MacOS platforms only). Default is `OFF`.
10. `WASMEDGE_LINK_TOOLS_STATIC`: make the `wasmedge` and `wasmedgec` tools to link the WasmEdge library and LLVM libraries statically (Linux and MacOS platforms only). Default is `OFF`.
    - If the option `WASMEDGE_BUILD_TOOLS` and this option are both set as `ON`, the `WASMEDGE_LINK_LLVM_STATIC` will be set as `ON`.
11. `WASMEDGE_ENABLE_UB_SANITIZER`: enable the undefined behavior sanitizer. Default is `OFF`.
12. `WASMEDGE_PLUGIN_WASI_NN_BACKEND`: build the WasmEdge WASI-NN plug-in (Linux platforms only). Default is empty.
    - This option is useless if the option `WASMEDGE_BUILD_PLUGINS` is set as `OFF`.
    - To build the WASI-NN plug-in with backend, please use `-DWASMEDGE_PLUGIN_WASI_NN_BACKEND=<backend_name>`.
    - To build the WASI-NN plug-in with multiple backends, please use `-DWASMEDGE_PLUGIN_WASI_NN_BACKEND=<backend_name1>,<backend_name2>`.
13. `WASMEDGE_PLUGIN_WASI_CRYPTO`: build the WasmEdge WASI-Crypto plug-in (Linux and MacOS platforms only). Default is `OFF`.
    - This option is useless if the option `WASMEDGE_BUILD_PLUGINS` is set as `OFF`.
14. `WASMEDGE_PLUGIN_WASI_LOGGING`: build the WasmEdge WASI-Logging plug-in (Linux and MacOS platforms only). Default is `OFF`.
    - This option is useless if the option `WASMEDGE_BUILD_PLUGINS` is set as `OFF`.
15. `WASMEDGE_PLUGIN_WASM_BPF`: build the WasmEdge wasm_bpf plugin (Linux platforms only). Default is `OFF`.
    - This option is useless if the option `WASMEDGE_BUILD_PLUGINS` is set as `OFF`.
16. `WASMEDGE_PLUGIN_IMAGE`: build the WasmEdge image plugin (Linux and MacOS platforms only). Default is `OFF`.
    - This option is useless if the option `WASMEDGE_BUILD_PLUGINS` is set as `OFF`.
17. `WASMEDGE_PLUGIN_TENSORFLOW`: build the WasmEdge TensorFlow plugin (Linux and MacOS platforms only). Default is `OFF`.
    - This option is useless if the option `WASMEDGE_BUILD_PLUGINS` is set as `OFF`.
18. `WASMEDGE_PLUGIN_TENSORFLOWLITE`: build the WasmEdge TensorFlow-Lite plug-in (Linux and MacOS platforms only). Default is `OFF`.
    - This option is useless if the option `WASMEDGE_BUILD_PLUGINS` is set as `OFF`.

## Build WasmEdge with Plug-ins

Developers can follow the steps to build WasmEdge with plug-ins from source.

- [WASI-NN (OpenVINO, PyTorch, or TensorFlow-Lite backends)](plugin/wasi_nn.md)
- [WASI-Crypto](plugin/wasi_crypto.md)
- [WasmEdge-Image](plugin/image.md)
- [WasmEdge-TensorFlow](plugin/tensorflow.md)
- [WasmEdge-TensorFlowLite](plugin/tensorflowlite.md)
- [WASI-Logging](plugin/wasi_logging.md)

## Run Tests

The tests are only available when the build option `WASMEDGE_BUILD_TESTS` is set to `ON`.

Users can use these tests to verify the correctness of WasmEdge binaries built.

```bash
cd <path/to/wasmedge/build_folder>
LD_LIBRARY_PATH=$(pwd)/lib/api ctest
```
