---
sidebar_position: 1
---

# 使用案例

由于 WasmEdge 具备 AOT（Ahead of Time）编译器优化，是当今市场上最快的 WebAssembly 运行时之一。因此，在边缘计算、汽车行业、Jamstack、无服务器架构、SaaS、服务网格，甚至区块链应用中广泛使用。

- 现代 Web 应用程序具有丰富的用户界面，这些界面在浏览器和/或边缘云上渲染。WasmEdge 与流行的 Web UI 框架（如 React、Vue、Yew 和 Percy）合作，支持边缘服务器上的同构 [服务器端渲染（SSR）](../../embed/use-case/ssr-modern-ui.md) 功能。它还可以支持在边缘云上为 Unity3D 动画和 AI 生成的交互式视频进行服务器端渲染，用于 Web 应用程序。

- WasmEdge 为微服务提供了一个轻量级、安全且高性能的运行时。它与 Dapr 等应用服务框架以及 Kubernetes 等服务编排器完全兼容。WasmEdge 微服务可以在边缘服务器上运行，并且可以访问分布式缓存，以支持现代 Web 应用程序的无状态和有状态业务逻辑功能。另外相关的有：公共云中的无服务器函数即服务。

- [无服务器 SaaS（软件即服务）](/category/serverless-platforms) 函数使用户可以在不运营自己的 API 回调服务器的情况下扩展和自定义其 SaaS 体验。无服务器函数可以嵌入到 SaaS 中，或者驻留在与 SaaS 服务器相邻的边缘服务器上。开发人员可以简单地上传函数来响应 SaaS 事件或连接 SaaS API。

- [智能设备应用](./wasm-smart-devices.md) 可以将 WasmEdge 嵌入为中间件运行时，用于在 UI 上呈现交互式内容、连接原生设备驱动程序，并访问专门的硬件功能（例如，用于 AI 推断的 GPU）。与本地编译的机器码相比，WasmEdge 运行时的优势包括安全性、安全性、可移植性、可管理性和开发者生产力。WasmEdge 可在 Android、OpenHarmony 和 seL4 RTOS 设备上运行。

- WasmEdge 可以支持高性能的领域特定语言（DSL），或者作为一个云原生的 JavaScript 运行时，通过嵌入 JS 执行引擎或解释器。

- 开发人员可以利用诸如 [Kubernetes](../../develop/deploy/kubernetes/kubernetes-containerd-crun.md)、Docker 和 CRI-O 等容器工具来部署、管理和运行轻量级的 WebAssembly 应用程序。

- WasmEdge 应用程序可以插入到现有的应用程序框架或平台中。

如果你对 WasmEdge 有任何好的想法，请毫不犹豫地开启一个 GitHub 问题，我们一起讨论。
