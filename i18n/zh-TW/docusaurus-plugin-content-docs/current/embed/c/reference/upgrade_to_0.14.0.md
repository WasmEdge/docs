---
sidebar_position: 8
---

# 升級至 WasmEdge 0.14.0

由於 WasmEdge C API 有破壞性變更，本文件說明使用 WasmEdge C API 從 `0.13.5` 升級到 `0.14.0` 版本的程式設計指引。

## 概念

1. 引入了 `WasmEdge_ValType` 結構的新 API，並與 WASM 值整合。

   `WasmEdge_ValType` 改為結構，以支援 [typed function reference 提案](https://github.com/WebAssembly/function-references)以及 [GC 提案](https://github.com/WebAssembly/gc)。

   列舉 `enum WasmEdge_ValType` 與 `enum WasmEdge_RefType` 分別重新命名為 `enum WasmEdge_ValTypeCode` 與 `enum WasmEdge_RefTypeCode`。開發者應使用下列 API 來產生 `WasmEdge_ValType` 結構：

   - `WasmEdge_ValTypeGenI32()`
   - `WasmEdge_ValTypeGenI64()`
   - `WasmEdge_ValTypeGenF32()`
   - `WasmEdge_ValTypeGenF64()`
   - `WasmEdge_ValTypeGenV128()`
   - `WasmEdge_ValTypeGenFuncRef()`
   - `WasmEdge_ValTypeGenExternRef()`

   並且還有新的 API 可從 `WasmEdge_ValType` 結構檢查值型別：

   - `WasmEdge_ValTypeIsEqual()`
   - `WasmEdge_ValTypeIsI32()`
   - `WasmEdge_ValTypeIsI64()`
   - `WasmEdge_ValTypeIsF32()`
   - `WasmEdge_ValTypeIsF64()`
   - `WasmEdge_ValTypeIsV128()`
   - `WasmEdge_ValTypeIsFuncRef()`：檢查型別是否為可空或不可空的函式參考。
   - `WasmEdge_ValTypeIsExternRef()`：檢查型別是否為可空或不可空的外部參考。
   - `WasmEdge_ValTypeIsRef()`：檢查型別是否為可空或不可空的參考。
   - `WasmEdge_ValTypeIsRefNull()`：檢查型別是否為可空的參考。

   下列以值型別作為參數與回傳值的 API 受到影響：

   - `WasmEdge_FunctionTypeCreate()`
   - `WasmEdge_FunctionTypeGetParameters()`
   - `WasmEdge_FunctionTypeGetReturns()`
   - `WasmEdge_TableTypeCreate()`
   - `WasmEdge_TableTypeGetRefType()`：回傳一個 `WasmEdge_ValType`，保證是參考型別。
   - `WasmEdge_GlobalTypeCreate()`
   - `WasmEdge_GlobalTypeGetValType()`

   下列 API 已被刪除：

   - `WasmEdge_ValueGenNullRef()`：請改用 `WasmEdge_ValueGenFuncRef()` 或 `WasmEdge_ValueGenExternRef()`。

2. 引入了用於載入與序列化的 `WasmEdge_Bytes`。

   我們建議開發者使用 `WasmEdge_Bytes` 與相關 API，而非原始緩衝區，來管理載入與序列化 WASM 二進位檔案時的輸入與輸出緩衝區。

   - `WasmEdge_BytesCreate()`：建立 `WasmEdge_Bytes` 並從帶有大小的緩衝區複製。
   - `WasmEdge_BytesWrap()`：將 `WasmEdge_Bytes` 包裝在帶有大小的緩衝區上。
   - `WasmEdge_BytesDelete()`：刪除已分配的 `WasmEdge_Bytes`。

   針對舊有 API，我們也引入了 `WasmEdge_Bytes` 版本。舊有 API 未來會被棄用。

   - `WasmEdge_CompilerCompileFromBytes()`：此 API 的行為與 `WasmEdge_CompilerCompileFromBuffer()` 相同。
   - `WasmEdge_LoaderParseFromBytes()`：此 API 的行為與 `WasmEdge_LoaderParseFromBuffer()` 相同。
   - `WasmEdge_LoaderSerializeASTModule()`：此 API 輸出一個 `WasmEdge_Bytes`，其結果應由呼叫者刪除。
   - `WasmEdge_VMRegisterModuleFromBytes()`：此 API 的行為與 `WasmEdge_VMRegisterModuleFromBuffer()` 相同。
   - `WasmEdge_VMRunWasmFromBytes()`：此 API 的行為與 `WasmEdge_VMRunWasmFromBuffer()` 相同。
   - `WasmEdge_VMAsyncRunWasmFromBytes()`：此 API 的行為與 `WasmEdge_VMAsyncRunWasmFromBuffer()` 相同。
   - `WasmEdge_VMLoadWasmFromBytes()`：此 API 的行為與 `WasmEdge_VMLoadWasmFromBuffer()` 相同。

3. 實例的 API 因應新提案而變更。

   為了支援 [typed function reference 提案](https://github.com/WebAssembly/function-references)以及 [GC 提案](https://github.com/WebAssembly/gc)，需要新的表格實例 API 來支援可預設的參考值。

   - `WasmEdge_TableInstanceCreateWithInit()`：開發者可以使用此 API 來建立帶有預設值的表格實例。

   此外，為了型別比對與可變性檢查，需要回報結果錯誤。

   - `WasmEdge_GlobalInstanceSetValue()`：回傳 `WasmEdge_Result` 作為結果，當型別不符或可變性失敗時會發生錯誤。

## 值型別建立與檢查

在 `0.13.5` 之前的版本中，`WasmEdge_ValType` 是一個 `enum`：

```c
enum WasmEdge_ValType ParamList[2] = {WasmEdge_ValType_I32,
                                      WasmEdge_ValType_I32};
enum WasmEdge_ValType ReturnList[1] = {WasmEdge_ValType_I32};
/* Create a function type: {i32, i32} -> {i32}. */
WasmEdge_FunctionTypeContext *HostFType =
    WasmEdge_FunctionTypeCreate(ParamList, 2, ReturnList, 1);

WasmEdge_FunctionTypeDelete(HostType);
```

在 `0.14.0` 之後，開發者應使用 API 來產生 `WasmEdge_ValType`。這會影響上方列出的 API 清單。

```c
WasmEdge_ValType ParamList[2] = {WasmEdge_ValTypeGenI32(), WasmEdge_ValTypeGenI32()};
WasmEdge_ValType ReturnList[1] = {WasmEdge_ValTypeGenI32()};
/* Create a function type: {i32, i32} -> {i32}. */
WasmEdge_FunctionTypeContext *HostFType =
    WasmEdge_FunctionTypeCreate(ParamList, 2, ReturnList, 1);

WasmEdge_FunctionTypeDelete(HostType);
```

## 使用封裝後的緩衝區進行載入

在 `0.13.5` 之前的版本中，開發者可以使用原始緩衝區來載入 WASM 二進位檔案：

```c
uint8_t WASM[] = {/* WASM header */
                  0x00, 0x61, 0x73, 0x6D, 0x01, 0x00, 0x00, 0x00,
                  /* Type section */
                  0x01, 0x07, 0x01,
                  /* function type {i32, i32} -> {i32} */
                  0x60, 0x02, 0x7F, 0x7F, 0x01, 0x7F,
                  /* Import section */
                  0x02, 0x13, 0x01,
                  /* module name: "extern" */
                  0x06, 0x65, 0x78, 0x74, 0x65, 0x72, 0x6E,
                  /* extern name: "func-add" */
                  0x08, 0x66, 0x75, 0x6E, 0x63, 0x2D, 0x61, 0x64, 0x64,
                  /* import desc: func 0 */
                  0x00, 0x00,
                  /* Function section */
                  0x03, 0x02, 0x01, 0x00,
                  /* Export section */
                  0x07, 0x0A, 0x01,
                  /* export name: "addTwo" */
                  0x06, 0x61, 0x64, 0x64, 0x54, 0x77, 0x6F,
                  /* export desc: func 0 */
                  0x00, 0x01,
                  /* Code section */
                  0x0A, 0x0A, 0x01,
                  /* code body */
                  0x08, 0x00, 0x20, 0x00, 0x20, 0x01, 0x10, 0x00, 0x0B};

WasmEdge_LoaderContext *LoadCxt = WasmEdge_LoaderCreate(NULL);
WasmEdge_ASTModuleContext *ASTCxt = NULL;
WasmEdge_Result Res;

/* Load WASM or compiled-WASM from the buffer. */
Res = WasmEdge_LoaderParseFromBuffer(LoadCxt, &ASTCxt, WASM, sizeof(WASM));
if (!WasmEdge_ResultOK(Res)) {
  printf("Loading phase failed: %s\n", WasmEdge_ResultGetMessage(Res));
}
/* The output AST module context should be destroyed. */
WasmEdge_ASTModuleDelete(ASTCxt);

WasmEdge_LoaderDelete(LoadCxt);
```

在 `0.14.0` 之後，我們建議開發者改為使用 `WasmEdge_Bytes` 相關的 API。舊有的 API 仍可運作，但未來會被棄用。

```c
uint8_t WASM[] = {/* WASM header */
                  0x00, 0x61, 0x73, 0x6D, 0x01, 0x00, 0x00, 0x00,
                  /* Type section */
                  0x01, 0x07, 0x01,
                  /* function type {i32, i32} -> {i32} */
                  0x60, 0x02, 0x7F, 0x7F, 0x01, 0x7F,
                  /* Import section */
                  0x02, 0x13, 0x01,
                  /* module name: "extern" */
                  0x06, 0x65, 0x78, 0x74, 0x65, 0x72, 0x6E,
                  /* extern name: "func-add" */
                  0x08, 0x66, 0x75, 0x6E, 0x63, 0x2D, 0x61, 0x64, 0x64,
                  /* import desc: func 0 */
                  0x00, 0x00,
                  /* Function section */
                  0x03, 0x02, 0x01, 0x00,
                  /* Export section */
                  0x07, 0x0A, 0x01,
                  /* export name: "addTwo" */
                  0x06, 0x61, 0x64, 0x64, 0x54, 0x77, 0x6F,
                  /* export desc: func 0 */
                  0x00, 0x01,
                  /* Code section */
                  0x0A, 0x0A, 0x01,
                  /* code body */
                  0x08, 0x00, 0x20, 0x00, 0x20, 0x01, 0x10, 0x00, 0x0B};

WasmEdge_LoaderContext *LoadCxt = WasmEdge_LoaderCreate(NULL);
WasmEdge_ASTModuleContext *ASTCxt = NULL;
WasmEdge_Result Res;
/* Wrap onto the `WASM`. */
WasmEdge_Bytes Bytes = WasmEdge_BytesWrap(WASM, sizeof(WASM));
/*
 * If developers want to copy from buffer, use the `WasmEdge_BytesCreate()`
 * instead. The created `WasmEdge_Bytes` should be destroyed.
 */

/* Load WASM or compiled-WASM from the buffer. */
Res = WasmEdge_LoaderParseFromBytes(LoadCxt, &ASTCxt, Bytes);
if (!WasmEdge_ResultOK(Res)) {
  printf("Loading phase failed: %s\n", WasmEdge_ResultGetMessage(Res));
}
/* The output AST module context should be destroyed. */
WasmEdge_ASTModuleDelete(ASTCxt);

WasmEdge_LoaderDelete(LoadCxt);
```
