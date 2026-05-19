---
sidebar_position: 4
---

# 升級至 WasmEdge 0.16.0

由於 WasmEdge C API 有破壞性變更，本文件說明使用 WasmEdge C API 從 `0.15.1` 升級到 `0.16.0` 版本的程式設計指引。

## 概念

1. 引入了可快速指定 WASM 標準的全新 API。

   開發者可以使用 `WasmEdge_ConfigureSetWASMStandard()`，在 `Configure` 情境中快速設定 WASM 標準。

## 設定 WASM 標準與提案

透過 `WasmEdge_ConfigureSetWASMStandard()` API，可以快速設定以下的 WASM 標準：

```c
enum WasmEdge_Standard {
  WasmEdge_Standard_WASM_1, // WASM 1.0
  WasmEdge_Standard_WASM_2, // WASM 2.0
  WasmEdge_Standard_WASM_3, // WASM 3.0, default
}
```

`WASM 1.0` 包含基本的 WASM 規範以及以下提案：

* Import/Export of mutable globals

`WASM 2.0` 包含 `WASM 1.0` 以及以下提案：

* Non-trapping float-to-int conversions
* Sign-extension operators
* Multi-value returns
* Bulk memory operations
* Reference types
* Fixed-width SIMD

`WASM 3.0` 包含 `WASM 2.0` 以及以下提案：

* Tail-call
* Extended-const
* Typed-function references
* GC
* Multiple memories
* Relaxed SIMD
* Exception handling (interpreter only)
* Memory64 (not supported in WasmEdge yet)

指定 WASM 標準之後，對應的 WASM 提案會被啟用或停用，並且所有提案的設定都會被覆寫。

```c
/* By default, the standard is WASM 3.0. */
WasmEdge_ConfigureContext *ConfCxt = WasmEdge_ConfigureCreate();

/* The `IsMultiRet` will be `TRUE`. */
bool IsMultiRet =
    WasmEdge_ConfigureHasProposal(ConfCxt, WasmEdge_Proposal_MultiValue);

/* Remove the Multi-value returns proposal, which is in WASM 2.0. */
WasmEdge_ConfigureRemoveProposal(ConfCxt, WasmEdge_Proposal_MultiValue);

/* The `IsMultiRet` will be `FALSE`. */
IsMultiRet =
    WasmEdge_ConfigureHasProposal(ConfCxt, WasmEdge_Proposal_MultiValue);

/* Set the standard to WASM 2.0. All proposal settings is reset. */
WasmEdge_ConfigureSetWASMStandard(ConfCxt, WasmEdge_Standard_WASM_2);

/* The `IsMultiRet` will be `TRUE`. */
IsMultiRet =
    WasmEdge_ConfigureHasProposal(ConfCxt, WasmEdge_Proposal_MultiValue);

/* Set the standard to WASM 1.0. All proposal settings is reset. */
WasmEdge_ConfigureSetWASMStandard(ConfCxt, WasmEdge_Standard_WASM_1);

/* The `IsMultiRet` will be `FALSE`. */
IsMultiRet =
    WasmEdge_ConfigureHasProposal(ConfCxt, WasmEdge_Proposal_MultiValue);

WasmEdge_ConfigureDelete(ConfCxt);
```
