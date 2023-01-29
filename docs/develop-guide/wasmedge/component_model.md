---
sidebar_position: 3
---

# 2.3 Component Model and Third Party Extensions

The component model for Wasm would dramatically improve Wasm module’s reusability and composability. It will allow better access from one Wasm module to other modules and systems, including the operating system APIs (eg, networking). 

WasmEdge is already committed to supporting and implementing [the component model proposal](https://github.com/WebAssembly/component-model). See the related issue [here](https://github.com/WasmEdge/WasmEdge/issues/1892).

After the support for component model is done, WasmEdge could be integrated by Spin and Spiderlightning.