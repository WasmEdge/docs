---
sidebar_position: 2
---

# Upgrade to WasmEdge-Go v0.14.0

Due to the WasmEdge-Go API breaking changes, this document shows the guideline of programming with WasmEdge-Go API to upgrade from the `v0.13.5` to the `v0.14.0` version.

## Concepts

1. `wasmedge.ValType` and `wasmedge.RefType` const values are replaced by the `wasmedge.ValType` struct.

   Removed `wasmedge.ValType` and `wasmedge.RefType` const values, and introduced the `wasmedge.ValType` struct.

   * Added the `wasmedge.NewValTypeI32()` API to replace the `wasmedge.ValType_I32` const value.
   * Added the `wasmedge.NewValTypeI64()` API to replace the `wasmedge.ValType_I64` const value.
   * Added the `wasmedge.NewValTypeF32()` API to replace the `wasmedge.ValType_F32` const value.
   * Added the `wasmedge.NewValTypeF64()` API to replace the `wasmedge.ValType_F64` const value.
   * Added the `wasmedge.NewValTypeV128()` API to replace the `wasmedge.ValType_V128` const value.
   * Added the `wasmedge.NewValTypeFuncRef()` API to replace the `wasmedge.ValType_FuncRef` const value.
   * Added the `wasmedge.NewValTypeExternRef()` API to replace the `wasmedge.ValType_ExterunRef` const value.

   The `wasmedge.ValType` struct provides the series member functions to check the value type.

   Besides, the APIs related to the value types are also updated:

   * `wasmedge.NewFunctionType()` accepts the new `[]*wasmedge.ValType` for parameters now.
   * `(*wasmedge.FunctionType).GetParameters()` returns the new `[]*wasmedge.ValType` now.
   * `(*wasmedge.FunctionType).GetReturns()` returns the new `[]*wasmedge.ValType` now.
   * `wasmedge.NewTableType()` accepts the new `*wasmedge.ValType` instead of `wasmedge.RefType` for parameters now.
   * `(*wasmedge.TableType).GetRefType()` returns the new `*wasmedge.ValType` now.
   * `wasmedge.NewGlobalType()` accepts the new `*wasmedge.ValType` for parameters now.
   * `(*wasmedge.GlobalType).GetValType()` returns the new `*wasmedge.ValType` now.

   For the examples of the new `wasmedge.ValType` struct and affacted APIs, please refer to [the example below](#new-wasmedgevaltype-struct-appied-for-all-related-apis).

2. Developers should handle the error when calling `(*wasmedge.Global).SetValue()` API.

   With the GC and typed-function references proposals, there are new reference types that accepts non-nullable values.
   Therefore, when setting value into a global instance, the error occurs if developers set a null value into a non-nullable value type global.
   Developers should detect and handle the error when setting value into a global instance now.

## New `wasmedge.ValType` struct appied for all related APIs

Before the version `v0.13.5`, developers can use the const value of value types with function type APIs, and reference types with table type APIs:

```go
// Create a function type: {i32, i64, funcref} -> {f32}
functype := wasmedge.NewFunctionType(
    []wasmedge.ValType{
        wasmedge.ValType_I32,
        wasmedge.ValType_I64,
        wasmedge.ValType_FuncRef,
    },
    []wasmedge.ValType{
        wasmedge.ValType_F32,
    })

// Get the parameter types
var ptypes []wasmedge.ValType = functype.GetParameters()
if ptypes[0] == wasmedge.ValType_I32 {
    // This will be true here.
    // ...
} 
functype.Release()

// Create a table type: {min: 1}, externref
lim := wasmedge.NewLimit(1)
tabtype := wasmedge.NewTableType(wasmedge.RefType_ExternRef, lim)

// Get the reference type
if tabtype.GetRefType() == wasmedge.RefType_ExternRef {
    // This will be true here.
    // ...
}
tabtype.Release()
```

After `v0.14.0`, developers should use the `wasmedge.ValType` related APIs to create the value types.

```go
// Create a function type: {i32, i64, funcref} -> {f32}
functype := wasmedge.NewFunctionType(
    []*wasmedge.ValType{
        wasmedge.NewValTypeI32(),
        wasmedge.NewValTypeI64(),
        wasmedge.NewValTypeFuncRef(),
    },
    []*wasmedge.ValType{
        wasmedge.NewValTypeF32,
    })

// Get the parameter types
var ptypes []*wasmedge.ValType = functype.GetParameters()
if ptypes[0].IsI32() {
    // This will be true here.
    // ...
} 
functype.Release()

// Create a table type: {min: 1}, externref
lim := wasmedge.NewLimit(1)
tabtype := wasmedge.NewTableType(wasmedge.NewValTypeExternRef(), lim)

// Get the reference type
if tabtype.GetRefType().IsExternRef() {
    // This will be true here.
    // ...
}
tabtype.Release()
```
