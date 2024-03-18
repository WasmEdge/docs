---
sidebar_position: 2
---

# Upgrade to WasmEdge 0.14.0

Due to the WasmEdge C API breaking changes, this document shows the guideline for programming with WasmEdge C API to upgrade from the `0.13.5` to the `0.14.0` version.

## Concepts

1. Introduced new APIs for `WasmEdge_ValType` struct.

   The `WasmEdge_ValType` becomes a struct for supporting the [typed function reference proposal](https://github.com/WebAssembly/function-references).

   The enumerations `enum WasmEdge_ValType` and `enum WasmEdge_RefType` are renamed as `enum WasmEdge_ValTypeCode` and `enum WasmEdge_RefTypeCode`. Developers should use the following APIs to generate the `WasmEdge_ValType` structures:

   - `WasmEdge_ValTypeGenI32()`
   - `WasmEdge_ValTypeGenI64()`
   - `WasmEdge_ValTypeGenF32()`
   - `WasmEdge_ValTypeGenF64()`
   - `WasmEdge_ValTypeGenV128()`
   - `WasmEdge_ValTypeGenFuncRef()`
   - `WasmEdge_ValTypeGenExternRef()`

   And there's new APIs for checking the value types from the `WasmEdge_ValType` struct:

   - `WasmEdge_ValTypeIsEqual()`
   - `WasmEdge_ValTypeIsI32()`
   - `WasmEdge_ValTypeIsI64()`
   - `WasmEdge_ValTypeIsF32()`
   - `WasmEdge_ValTypeIsF64()`
   - `WasmEdge_ValTypeIsV128()`
   - `WasmEdge_ValTypeIsFuncRef()` for checking whether a type as a nullable or non-nullable function reference
   - `WasmEdge_ValTypeIsExternRef()` for checking whether a type as a nullable or non-nullable external reference
   - `WasmEdge_ValTypeIsRef()` for checking whether a type as a nullable or non-nullable reference
   - `WasmEdge_ValTypeIsRefNull()` for checking whether a type as a nullable reference

2. Integration of reference type WASM values.
