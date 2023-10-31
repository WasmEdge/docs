---
sidebar_position: 4
---

# 组件模型

WASM 的组件模型将大幅改善 WASM 模块的可重用性和可组合性。它将允许一个 WASM 模块更好地访问其他模块和系统，包括操作系统的 API（例如网络功能）。

WasmEdge 已经致力于支持和实现 [组件模型提案](https://github.com/WebAssembly/component-model)。请在[此处](https://github.com/WasmEdge/WasmEdge/issues/1892)查看相关问题。

在支持组件模型之后，WasmEdge 将能够被 Spin 和 Spiderlightning 集成。
