---
sidebar_position: 4
---

# WasmEdge 在智能设备上

智能设备应用可以将 WasmEdge 嵌入为中间件运行时，以在用户界面上呈现交互式内容，连接原生设备驱动程序，并访问专门的硬件功能（例如，用于 AI 推断的 GPU）。WasmEdge 运行时相对于本地编译的机器码的优势包括安全性、安全性、可移植性、可管理性、OTA 升级能力和开发者生产力。WasmEdge 可在以下设备操作系统上运行。

- [Android](/category/build-and-run-wasmedge-on-android)
- [OpenHarmony](../../contribute/source/os/openharmony.md)
- [Raspberry Pi](../../contribute/source/os/raspberrypi.md)
- [The seL4 RTOS](../../contribute/source/os/sel4.md)

通过在设备和边缘服务器上使用 WasmEdge，我们可以为丰富的客户端移动应用程序提供支持，实现[同构的服务器端渲染（SSR）](../../develop/rust/ssr.md)和[微服务](../../start/build-and-run/docker_wasm.md#deploy-the-microservice-example)，使其具备可移植性和可升级性。
