---
sidebar_position: 2
---

# Upgrade to WasmEdge 0.14.0

Due to the WasmEdge C API breaking changes, this document shows the guideline for programming with WasmEdge C API to upgrade from the `0.13.5` to the `0.14.0` version.

## Concepts

1. Introduced new APIs for `WasmEdge_ValType` struct and integrated with WASM values.

   The `WasmEdge_ValType` becomes a struct for supporting the [typed function reference proposal](https://github.com/WebAssembly/function-references) and [GC proposal](https://github.com/WebAssembly/gc).

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
   - `WasmEdge_ValTypeIsFuncRef()` for checking whether a type is a nullable or non-nullable function reference.
   - `WasmEdge_ValTypeIsExternRef()` for checking whether a type is a nullable or non-nullable external reference.
   - `WasmEdge_ValTypeIsRef()` for checking whether a type is a nullable or non-nullable reference.
   - `WasmEdge_ValTypeIsRefNull()` for checking whether a type is a nullable reference.

   The following APIs using value types as parameters and return values are affected:

   - `WasmEdge_FunctionTypeCreate()`
   - `WasmEdge_FunctionTypeGetParameters()`
   - `WasmEdge_FunctionTypeGetReturns()`
   - `WasmEdge_TableTypeCreate()`
   - `WasmEdge_TableTypeGetRefType()`: returns a `WasmEdge_ValType`, which is guaranteed as a reference type.
   - `WasmEdge_GlobalTypeCreate()`
   - `WasmEdge_GlobalTypeGetValType()`

   The following API is deleted:

   - `WasmEdge_ValueGenNullRef()`: please use `WasmEdge_ValueGenFuncRef()` or `WasmEdge_ValueGenExternRef()` instead.

2. Introduced `WasmEdge_Bytes` for loading and serialization.

   Rathar than the raw buffer, we recommand developers to use `WasmEdge_Bytes` and related APIs to manage the input and output buffer for loading and serializing a WASM binary.

   - `WasmEdge_BytesCreate()`: create a `WasmEdge_Bytes` and copy from buffer with size.
   - `WasmEdge_BytesWrap()`: wrap a `WasmEdge_Bytes` onto a buffer with size.
   - `WasmEdge_BytesDelete()`: delete a allocated `WasmEdge_Bytes`.

   For the old APIs, we also introduced the `WasmEdge_Bytes` version. The old APIs will be deprecated in the future.

   - `WasmEdge_CompilerCompileFromBytes()`: this API has the same behavior as `WasmEdge_CompilerCompileFromBuffer()`.
   - `WasmEdge_LoaderParseFromBytes()`: this API has the same behavior as `WasmEdge_LoaderParseFromBuffer()`.
   - `WasmEdge_LoaderSerializeASTModule()`: this API outputs a `WasmEdge_Bytes`, and the result should be deleted by the caller.
   - `WasmEdge_VMRegisterModuleFromBytes()`: this API has the same behavior as `WasmEdge_VMRegisterModuleFromBuffer()`.
   - `WasmEdge_VMRunWasmFromBytes()`: this API has the same behavior as `WasmEdge_VMRunWasmFromBuffer()`.
   - `WasmEdge_VMAsyncRunWasmFromBytes()`: this API has the same behavior as `WasmEdge_VMAsyncRunWasmFromBuffer()`.
   - `WasmEdge_VMLoadWasmFromBytes()`: this API has the same behavior as `WasmEdge_VMLoadWasmFromBuffer()`.

3. APIs of instances changed for the new proposal.

   For supporting the [typed function reference proposal](https://github.com/WebAssembly/function-references) and [GC proposal](https://github.com/WebAssembly/gc) proposal, the new API of table instance is needed for the defaultable reference values.

   - `WasmEdge_TableInstanceCreateWithInit()`: developers can use this API to create a table instance with default value.

   Furthermore, for type matching and mutation checking, the result error is needed.

   - `WasmEdge_GlobalInstanceSetValue()`: returns `WasmEdge_Result` for result, and error occurs when type not matched or mutation failed.

## Value type creation and checking

Before the version `0.13.5`, the `WasmEdge_ValType` is an `enum`:

```c
enum WasmEdge_ValType ParamList[2] = {WasmEdge_ValType_I32,
                                      WasmEdge_ValType_I32};
enum WasmEdge_ValType ReturnList[1] = {WasmEdge_ValType_I32};
/* Create a function type: {i32, i32} -> {i32}. */
WasmEdge_FunctionTypeContext *HostFType =
    WasmEdge_FunctionTypeCreate(ParamList, 2, ReturnList, 1);

WasmEdge_FunctionTypeDelete(HostType);
```

After `0.14.0`, developers should use the APIs to generate the `WasmEdge_ValType`. This affects the APIs list above.

```c
WasmEdge_ValType ParamList[2] = {WasmEdge_ValTypeGenI32(), WasmEdge_ValTypeGenI32()};
WasmEdge_ValType ReturnList[1] = {WasmEdge_ValTypeGenI32()};
/* Create a function type: {i32, i32} -> {i32}. */
WasmEdge_FunctionTypeContext *HostFType =
    WasmEdge_FunctionTypeCreate(ParamList, 2, ReturnList, 1);

WasmEdge_FunctionTypeDelete(HostType);
```

## Use packaged buffer for loading

Before the version `0.13.5`, developers can use the raw buffer to load WASM binary:

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

After `0.14.0`, we recommanded developers use the `WasmEdge_Bytes` related APIs instead. The old APIs still work, but will be deprecated in the future.

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
