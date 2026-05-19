---
sidebar_position: 2
---

# 升級至 WasmEdge-Go v0.14.0

由於 WasmEdge-Go API 有破壞性變更，本文件說明使用 WasmEdge-Go API 從 `v0.13.5` 升級到 `v0.14.0` 版本的程式設計指引。

## 概念

1. `wasmedge.ValType` 與 `wasmedge.RefType` 常數值由 `wasmedge.ValType` 結構取代。

   移除了 `wasmedge.ValType` 與 `wasmedge.RefType` 常數值，並引入了 `wasmedge.ValType` 結構。

   * 新增 `wasmedge.NewValTypeI32()` API 以取代 `wasmedge.ValType_I32` 常數值。
   * 新增 `wasmedge.NewValTypeI64()` API 以取代 `wasmedge.ValType_I64` 常數值。
   * 新增 `wasmedge.NewValTypeF32()` API 以取代 `wasmedge.ValType_F32` 常數值。
   * 新增 `wasmedge.NewValTypeF64()` API 以取代 `wasmedge.ValType_F64` 常數值。
   * 新增 `wasmedge.NewValTypeV128()` API 以取代 `wasmedge.ValType_V128` 常數值。
   * 新增 `wasmedge.NewValTypeFuncRef()` API 以取代 `wasmedge.ValType_FuncRef` 常數值。
   * 新增 `wasmedge.NewValTypeExternRef()` API 以取代 `wasmedge.ValType_ExterunRef` 常數值。

   `wasmedge.ValType` 結構提供一系列的成員函式以檢查值型別。

   此外，與值型別相關的 API 也已更新：

   * `wasmedge.NewFunctionType()` 現在接受新的 `[]*wasmedge.ValType` 作為參數。
   * `(*wasmedge.FunctionType).GetParameters()` 現在回傳新的 `[]*wasmedge.ValType`。
   * `(*wasmedge.FunctionType).GetReturns()` 現在回傳新的 `[]*wasmedge.ValType`。
   * `wasmedge.NewTableType()` 現在接受新的 `*wasmedge.ValType` 作為參數，而非 `wasmedge.RefType`。
   * `(*wasmedge.TableType).GetRefType()` 現在回傳新的 `*wasmedge.ValType`。
   * `wasmedge.NewGlobalType()` 現在接受新的 `*wasmedge.ValType` 作為參數。
   * `(*wasmedge.GlobalType).GetValType()` 現在回傳新的 `*wasmedge.ValType`。

   關於新的 `wasmedge.ValType` 結構與受影響 API 的範例，請參閱[下方範例](#new-wasmedgevaltype-struct-appied-for-all-related-apis)。

2. 開發者在呼叫 `(*wasmedge.Global).SetValue()` API 時應處理錯誤。

   隨著 GC 與 typed-function references 提案的加入，新增了接受不可空值的參考型別。
   因此，將值設定到全域實例時，若開發者將空值設定到不可空值型別的全域變數，會發生錯誤。
   現在開發者應該偵測並處理將值設定到全域實例時的錯誤。

## 新的 `wasmedge.ValType` 結構套用於所有相關 API

在 `v0.13.5` 之前的版本中，開發者可以使用值型別的常數值搭配函式型別 API，以及使用參考型別搭配表格型別 API：

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

在 `v0.14.0` 之後，開發者應使用 `wasmedge.ValType` 相關的 API 來建立值型別。

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
