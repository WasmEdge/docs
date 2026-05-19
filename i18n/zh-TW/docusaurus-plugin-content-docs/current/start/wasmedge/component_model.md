---
sidebar_position: 4
---

# 元件模型

WASM 的元件模型將大幅改善 WASM 模組的可重用性與可組合性。它讓 WASM 模組能夠更好地存取其他模組與系統,包括作業系統 API(例如:網路)。

WasmEdge 已承諾將支援並實作 [元件模型提案](https://github.com/WebAssembly/component-model)。請參考 [此處](https://github.com/WasmEdge/WasmEdge/issues/4236) 的相關 issue。

在完成對元件模型的支援之後,WasmEdge 將可以由 Spin 與 Spiderlightning 整合。
