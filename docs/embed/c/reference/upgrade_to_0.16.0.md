---
sidebar_position: 2
---

# Upgrade to WasmEdge 0.16.0

Due to the WasmEdge C API breaking changes, this document shows the guideline for programming with WasmEdge C API to upgrade from the `0.15.1` to the `0.16.0` version.

## Concepts

1. Introduced new APIs for quickly assigning the WASM standards.

   Developers can use the `WasmEdge_ConfigureSetWASMStandard()` to quickly configure the WASM standard in the `Configure` context.

## Set the WASM standards and proposals

With the `WasmEdge_ConfigureSetWASMStandard()` API, the following WASM standards can be used for quickly configuration:

```c
enum WasmEdge_Standard {
  WasmEdge_Standard_WASM_1, // WASM 1.0
  WasmEdge_Standard_WASM_2, // WASM 2.0
  WasmEdge_Standard_WASM_3, // WASM 3.0, default
}
```

The `WASM 1.0` contains the basic WASM spec and the following proposal:

* Import/Export of mutable globals

The `WASM 2.0` contains the `WASM 1.0` and the following proposals:

* Non-trapping float-to-int conversions
* Sign-extension operators
* Multi-value returns
* Bulk memory operations
* Reference types
* Fixed-width SIMD

The `WASM 3.0` contains the `WASM 2.0` and the following proposals:

* Tail-call
* Extended-const
* Typed-function references
* GC
* Multiple memories
* Relaxed SIMD
* Exception handling (interpreter only)
* Memory64 (not supported in WasmEdge yet)

After assigning the WASM standard, the corresponding WASM proposals will be enabled or disabled, and all of the proposal settings will be overwritten.

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
