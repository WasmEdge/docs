---
sidebar_position: 1
---

# WasmEdge 特色

WasmEdge ([CNCF 旗下的 sandbox 專案](https://www.cncf.io/projects/wasmedge/)) 是一個安全、快速、輕量、可攜且可擴充的 WebAssembly 執行環境。

## 高效能

藉由 [基於 LLVM 的 AoT 編譯器](../build-and-run/aot) 的優勢,WasmEdge 是市場上速度最快的 WebAssembly 執行環境。

- [A Lightweight Design for High-performance Serverless Computing](https://arxiv.org/abs/2010.07115),刊載於 IEEE Software,2021 年 1 月。[https://arxiv.org/abs/2010.07115](https://arxiv.org/abs/2010.07115)
- [Performance Analysis for Arm vs. x86 CPUs in the Cloud](https://www.infoq.com/articles/arm-vs-x86-cloud-performance/),刊載於 infoQ.com,2021 年 1 月。[https://www.infoq.com/articles/arm-vs-x86-cloud-performance/](https://www.infoq.com/articles/arm-vs-x86-cloud-performance/)
- [WasmEdge is the fastest WebAssembly Runtime in Suborbital Reactr test suite](https://blog.suborbital.dev/suborbital-wasmedge),2021 年 12 月

## 雲原生擴充功能

除了 WASI 與標準的 WebAssembly 提案之外,WasmEdge 還具備一些雲原生擴充功能。

- 支援 Rust、C 與 JavaScript SDK 的非阻塞網路 socket 與 Web 服務
- 基於 MySQL 的資料庫驅動程式
- Key value store
- 用於資源限制的 gas 計量器
- 用於複雜參數傳遞的 WasmEdge-bindgen
- 搭配 TensorFlow、TensorFlow Lite、Pytorch 與 OpenVINO 的 AI 推論

## JavaScript 支援

透過 [WasmEdge-Quickjs](https://github.com/second-state/wasmedge-quickjs) 專案,WasmEdge 可以執行 JavaScript 程式,降低開發 WASM 應用程式的門檻。

- ES6 模組與 std API 支援
- NPM 模組支援
- 以 Rust 撰寫的原生 JS API
- Node.js API 支援
- 非同步網路
- Fetch API
- React SSR

## 雲原生協調

WasmEdge 可以無縫整合至現有的雲原生基礎架構中。

若要將 WasmEdge 與您現有的雲原生基礎架構整合,有多種選項可用來將 WASM 應用程式作為 Kubernetes 下的「容器」管理。這些選項讓您可以在 Kubernetes 叢集內同時執行 Linux 容器與 WASM 容器。

**選項 #1**:[使用 OCI 執行環境 crun](../../develop/deploy/oci-runtime/crun.md)(runc 的 C 版本 — 主要由 Red Hat 支援)。crun 會根據映像檔註解判斷 OCI 映像檔是 WASM 還是 Linux。如果映像檔被註解為 wasm32,crun 會略過 Linux 容器設定,直接使用 WasmEdge 執行映像檔。透過 crun,您可以讓整個 Kubernetes 堆疊(包括 CRI-O、containerd、Podman、kind、micro k8s 與 k8s)與 WASM 映像檔協同運作。

選項 #2 是 [使用 containerd-shim 透過 runwasi 啟動 WASM「容器」](../../develop/deploy/cri-runtime/containerd.md)。基本上,containerd 可以查看映像檔的目標平台。如果映像檔是 wasm32,則使用 runwasi;如果是 x86 / arm,則使用 runc。這也是 Docker + Wasm 採用的方式。

## 跨平台

WASM 是可攜的。編譯後的 WASM 檔案可以在不同的硬體與平台上執行,而無需任何變更。

WasmEdge 支援廣泛的作業系統與硬體平台,讓 WebAssembly 應用程式可以真正跨平台地可攜。它能在類 Linux 系統以及如 `seL4` 即時系統等微核心上執行。

WasmEdge 現在支援:

- [Linux (x86_64 與 aarch64)](../../contribute/source/os/linux.md)
- [MacOS (x86_64 與 M1)](../../contribute/source/os/macos.md)
- [Windows 10](../../contribute/source/os/windows.md)
- [Android](/category/build-and-run-wasmedge-on-android)
- [seL4 RTOS](../../contribute/source/os/sel4.md)
- [OpenWrt](../../contribute/source/os/openwrt.md)
- [OpenHarmony](../../contribute/source/os/openharmony.md)
- [Raspberry Pi](../../contribute/source/os/raspberrypi.md)
- [RISC-V (進行中)](../../contribute/source/os/riscv64.md)
- [S390x](../../contribute/source/os/s390x.md)

## 易於擴充

使用 C、Go 與 Rust 為 WasmEdge 建置具備原生主機函式的客製化執行環境很容易。

或者您可以使用以下語言為 WasmEdge 建置自己的外掛:

- [Rust](../../contribute/plugin/develop_plugin_rustsdk)
- [C](../../contribute/plugin/develop_plugin_c)
- [C++](../../contribute/plugin/develop_plugin_cpp)

## 易於嵌入主機應用程式

[嵌入式執行環境](https://wasmedge.org/docs/embed/overview) 是 WasmEdge 的經典使用情境。您可以將 WasmEdge 函式嵌入 C、Go、Rust、Node.js、Java(進行中)與 Python(進行中)的主機應用程式中。
