---
sidebar_position: 1
---

# WasmEdge 功能

WasmEdge（[CNCF 旗下的沙盒项目](https://www.cncf.io/projects/wasmedge/)）是一个安全、快速、轻量、可移植且可扩展的 WebAssembly 运行时。

## 高性能

利用[基于 LLVM 的 AoT 编译器](../build-and-run/aot)，WasmEdge 是市场上速度最快的 WebAssembly 运行时。

- [高性能轻量设计用于无服务器计算](https://arxiv.org/abs/2010.07115)，发表于 2021 年 1 月 IEEE 软件。[https://arxiv.org/abs/2010.07115](https://arxiv.org/abs/2010.07115)
- [云端性能分析：Arm 与 x86 CPU 的比较](https://www.infoq.com/articles/arm-vs-x86-cloud-performance/)，发表于 2021 年 1 月的 infoQ.com。[https://www.infoq.com/articles/arm-vs-x86-cloud-performance/](https://www.infoq.com/articles/arm-vs-x86-cloud-performance/)
- [WasmEdge 在 Suborbital Reactr 测试套件中是最快的 WebAssembly 运行时](https://blog.suborbital.dev/suborbital-wasmedge)，2021 年 12 月

## 云原生扩展

除了 WASI 和标准的 WebAssembly 提案，WasmEdge 还有一些云原生扩展。

- 使用 Rust、C 和 JavaScript SDK 实现的非阻塞网络套接字和 Web 服务
- 基于 MySQL 的数据库驱动程序
- 键值存储
- 用于资源限制的 Gas 计量器
- 用于复杂参数传递的 WasmEdge-bindgen
- 使用 TensorFlow、TensorFlow Lite、PyTorch 和 OpenVINO 进行 AI 推理

## JavaScript 支持

通过 [WasmEdge-Quickjs](https://github.com/second-state/wasmedge-quickjs) 项目，WasmEdge 可以运行 JavaScript 程序，降低开发 WASM 应用的门槛。

- ES6 模块和 std API 支持
- NPM 模块支持
- Rust 中的原生 JS API
- Node.js API 支持
- 异步网络
- Fetch API
- React SSR

## 云原生编排

WasmEdge 可以与现有的云原生基础设施无缝集成。

要将 WasmEdge 与你现有的云原生基础架构集成，有几种管理 WASM 应用程序作为 Kubernetes 下的“容器”的选项。这些选项使你能够在 Kubernetes 集群中同时运行 Linux 容器和 WASM 容器。

**选项 #1：**[使用 OCI 运行时 crun](../../develop/deploy/oci-runtime/crun.md)（runc 的 C 版本，主要由 Red Hat 支持）。crun 根据镜像注释决定 OCI 镜像是 WASM 还是基于 Linux 的。如果镜像被注释为 wasm32，则 crun 将绕过 Linux 容器设置，直接使用 WasmEdge 运行镜像。通过使用 crun，你可以让整个 Kubernetes 栈（包括 CRI-O、containerd、Podman、kind、micro k8s 和 k8s）与 WASM 镜像一起工作。

选项 #2：[使用 containerd-shim 通过 runwasi 启动 WASM“容器”](../../develop/deploy/cri-runtime/containerd.md)。基本上，containerd 可以查看镜像的目标平台。如果镜像是 wasm32，则使用 runwasi；如果是 x86 / arm，则使用 runc。这是 Docker + Wasm 使用的方法。

## 跨平台

WASM 具有可移植性。编译后的 wasm 文件可以在不同的硬件和平台上运行，而无需任何更改。

WasmEdge 支持多种操作系统和硬件平台。它允许 WebAssembly 应用程序在各个平台上实现真正的可移植性。它可以在类似 Linux 的系统和微内核（例如实时系统 `seL4`）上运行。

WasmEdge 目前支持：

- [Linux（x86_64 和 aarch64）](../../contribute/source/os/linux.md)
- [MacOS（x86_64 和 M1）](../../contribute/source/os/macos.md)
- [Windows 10](../../contribute/source/os/windows.md)
- [Android](/category/build-and-run-wasmedge-on-android)
- [seL4 RTOS](../../contribute/source/os/sel4.md)
- [OpenWrt](../../contribute/source/os/openwrt.md)
- [OpenHarmony](../../contribute/source/os/openharmony.md)
- [Raspberry Pi](../../contribute/source/os/raspberrypi.md)
- [RISC-V(WIP)](../../contribute/source/os/riscv64.md)

## 易于扩展

使用 C、Go 和 Rust 中的原生宿主函数很容易构建自定义的 WasmEdge 运行时。

或者，你可以为 WasmEdge 构建自己的插件，

- [Rust](../../contribute/plugin/develop_plugin_rustsdk)
- [C](../../contribute/plugin/develop_plugin_c)
- [C++](../../contribute/plugin/develop_plugin_cpp)

## 易于嵌入到主机应用程序中

嵌入式运行时是 WasmEdge 的经典用例。你可以将 WasmEdge 函数嵌入到 C、Go、Rust、Node.js、Java(WIP) 和 Python(WIP) 主机应用程序中。
