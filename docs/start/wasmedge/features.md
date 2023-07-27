---
sidebar_position: 1
---

# WasmEdge Features

WasmEdge ([a sandbox project under CNCF](https://www.cncf.io/projects/wasmedge/)) is a safe, fast, lightweight, portable, and extensible WebAssembly runtime.

## High Performance

Taking advantage of [the LLVM-based AoT compiler](../build-and-run/aot), WasmEdge is the fastest WebAssembly runtime on the market.

- [A Lightweight Design for High-performance Serverless Computing](https://arxiv.org/abs/2010.07115), published on IEEE Software, Jan 2021. [https://arxiv.org/abs/2010.07115](https://arxiv.org/abs/2010.07115)
- [Performance Analysis for Arm vs. x86 CPUs in the Cloud](https://www.infoq.com/articles/arm-vs-x86-cloud-performance/), published on infoQ.com, Jan 2021. [https://www.infoq.com/articles/arm-vs-x86-cloud-performance/](https://www.infoq.com/articles/arm-vs-x86-cloud-performance/)
- [WasmEdge is the fastest WebAssembly Runtime in Suborbital Reactr test suite](https://blog.suborbital.dev/suborbital-wasmedge), Dec 2021

## Cloud-native Extensions

Besides WASI and the standard WebAssembly proposal, WasmEdge has some cloud-native extensions.

- Non-blocking network sockets and web services with Rust, C, and JavaScript SDK
- MySQL-based database driver
- Key value store
- Gas meter for resource limitation
- WasmEdge-bindgen for complex para passing
- AI inference with TensorFlow, TensorFlow Lite, Pytorch, and OpenVINO

## JavaScript Support

Through the [WasmEdge-Quickjs](https://github.com/second-state/wasmedge-quickjs) project, WasmEdge could run a JavaScript program, lowering the bar for developing a WASM app.

- ES6 module and std API support
- NPM module support
- Native JS API in Rust
- Node.js API Support
- Async networking
- Fetch API
- React SSR

## Cloud Native orchestration

WasmEdge could be seamlessly integrated with the existing cloud-native infra.

To integrate WasmEdge with your existing cloud-native infrastructure, there are several options available for managing WASM applications as "containers" under Kubernetes. These options enables you to run Linux containers and WASM containers side by side within a Kubernetes cluster.

**Option #1:** is to [use an OCI runtime crun](../../develop/deploy/oci-runtime/crun.md) (the C version of runc — mainly supported by Red Hat). crun decides whether an OCI image is WASM or Linux based on image annotations. If the image is annotated as wasm32, crun will bypass the Linux container setup and just use WasmEdge to run the image. By using crun, you can get the entire Kubernetes stack - including CRI-O, containerd, Podman, kind, micro k8s, and k8s - to work with WASM images.

Option #2 is to [use a containerd-shim to start WASM "containers" via runwasi](../../develop/deploy/cri-runtime/containerd.md). Basically, containerd could look at the image's target platform. It uses runwasi if the image is wasm32 and runc if it is x86 / arm. This is the approach used by Docker + Wasm.

## Cross Platform

WASM is Portable. The compiled wasm file could run on different hardware and platforms without any changes.

WasmEdge supports a wide range of operating systems and hardware platforms. It allows WebAssembly applications to be truly portable across platforms. It runs on Linux-like systems and microkernels such as the `seL4` real-time system.

WasmEdge now supports:

- [Linux (x86_64 and aarch64)](../../contribute/source/os/linux.md)
- [MacOS (x86_64 and M1)](../../contribute/source/os/macos.md)
- [Windows 10](../../contribute/source/os/windows.md)
- [Android](/category/build-and-run-wasmedge-on-android)
- [seL4 RTOS](../../contribute/source/os/sel4.md)
- [OpenWrt](../../contribute/source/os/openwrt.md)
- [OpenHarmony](../../contribute/source/os/openharmony.md)
- [Raspberry Pi](../../contribute/source/os/raspberrypi.md)
- [RISC-V (WIP)](../../contribute/source/os/riscv64.md)

## Easy extensible

It is easy to build customized WasmEdge runtime with native host functions in C, Go, and Rust.

Or you could build your own plug-ins for WasmEdge in,

- [Rust](../../contribute/plugin/develop_plugin_rustsdk)
- [C](../../contribute/plugin/develop_plugin_c)
- [C++](../../contribute/plugin/develop_plugin_cpp)

## Easy to Embed into a Host Application

Embedded runtime is the classical use case for WasmEdge. You could embed WasmEdge functions in C, Go, Rust, Node.js, Java (WIP), and Python (WIP) host applications.
