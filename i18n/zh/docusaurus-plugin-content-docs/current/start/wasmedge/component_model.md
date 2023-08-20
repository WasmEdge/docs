---
sidebar_position: 4
---

# Component Model

The component model for WASM would dramatically improve WASM module’s reusability and composability. It will allow better access from one WASM module to other modules and systems, including the operating system APIs (e.g., networking).

WasmEdge is already committed to supporting and implementing [the component model proposal](https://github.com/WebAssembly/component-model). See the related issue [here](https://github.com/WasmEdge/WasmEdge/issues/1892).

After the support for the component model is done, WasmEdge could be integrated by Spin and Spiderlightning.
