---
sidebar_position: 2
---

# Upgrade to WasmEdge 0.17.0

Due to the WasmEdge C API breaking changes, this document shows the guideline for programming with WasmEdge C API to upgrade from the `0.16.3` to the `0.17.0` version.

## Concepts

1. Refactored the `WasmEdge_Limit` struct into the `WasmEdge_LimitContext`.

   For supporting the [Memory64 proposal](https://github.com/WebAssembly/memory64), the `WasmEdge_Limit` struct is replaced by the new `WasmEdge_LimitContext` opaque type, which carries an additional 64-bit address flag and uses the 64-bit minimum and maximum values internally.

   Developers should use the following APIs to create, query, and destroy the `WasmEdge_LimitContext`:

   - `WasmEdge_LimitCreate()`: create a limit context without the maximum value.
   - `WasmEdge_LimitCreateWithMax()`: create a limit context with the maximum value.
   - `WasmEdge_LimitGetMin()`: get the minimum value of the limit context.
   - `WasmEdge_LimitGetMax()`: get the maximum value of the limit context.
   - `WasmEdge_LimitHasMax()`: get the has-maximum option of the limit context.
   - `WasmEdge_LimitIsShared()`: get the shareable option of the limit context.
   - `WasmEdge_LimitIs64Bit()`: get the 64-bit address type option of the limit context.
   - `WasmEdge_LimitDelete()`: destroy the limit context.

   The signature of `WasmEdge_LimitIsEqual()` is updated to take two `const WasmEdge_LimitContext *` arguments instead of two `WasmEdge_Limit` structs.

   The following APIs are also updated to accept or return the `WasmEdge_LimitContext`:

   - `WasmEdge_TableTypeCreate()`
   - `WasmEdge_TableTypeGetLimit()`
   - `WasmEdge_MemoryTypeCreate()`
   - `WasmEdge_MemoryTypeGetLimit()`

2. Introduced the `WasmEdge_RunMode` enumeration and the related APIs.

   Instead of the boolean flag for forcing the interpreter mode, the new tri-state `WasmEdge_RunMode` enumeration is introduced to select the WASM execution engine: interpreter (default), JIT, or AOT. The new APIs are:

   - `WasmEdge_ConfigureSetRunMode()`: set the run mode in the configure context.
   - `WasmEdge_ConfigureGetRunMode()`: get the run mode from the configure context.

   The following APIs are deprecated and moved into the `wasmedge_deprecated.h` header. They still work but will be removed in the future:

   - `WasmEdge_ConfigureSetForceInterpreter()`: please use `WasmEdge_ConfigureSetRunMode()` with `WasmEdge_RunMode_Interpreter` instead.
   - `WasmEdge_ConfigureIsForceInterpreter()`: please use `WasmEdge_ConfigureGetRunMode()` and compare with `WasmEdge_RunMode_Interpreter` instead.

3. Introduced new APIs for registering module instances with alias names.

   The following APIs are added to register a module instance under a given name instead of its own module name. This is useful for the shared modules must be accessible under different import namespace names.

   - `WasmEdge_ExecutorRegisterImportWithAlias()`: register a module instance into a store with an alias name.
   - `WasmEdge_VMRegisterModuleFromImportWithAlias()`: register a module instance into a VM with an alias name.

4. Supported the [Memory64 proposal](https://github.com/WebAssembly/memory64).

   Memory64 is supported in both the interpreter and the AOT/JIT compiler. As part of the WASM 3.0 standard, the proposal is enabled by default. Developers can create a 64-bit memory type by passing `true` as the `Is64Bit` parameter to `WasmEdge_LimitCreate()` or `WasmEdge_LimitCreateWithMax()`.

## Limit context for table type and memory type

Before the version `0.16.3`, the `WasmEdge_Limit` was a plain struct, and developers passed it by value to the table type and memory type creation APIs.

```c
WasmEdge_Limit TabLim = {
    .HasMax = true, .Shared = false, .Min = 10, .Max = 20};
WasmEdge_TableTypeContext *TabType =
    WasmEdge_TableTypeCreate(WasmEdge_ValTypeGenFuncRef(), TabLim);

WasmEdge_Limit GotTabLim = WasmEdge_TableTypeGetLimit(TabType);
uint32_t Min = GotTabLim.Min;
uint32_t Max = GotTabLim.Max;
WasmEdge_TableTypeDelete(TabType);

WasmEdge_Limit MemLim = {
    .HasMax = true, .Shared = false, .Min = 1, .Max = 5};
WasmEdge_MemoryTypeContext *MemType = WasmEdge_MemoryTypeCreate(MemLim);
WasmEdge_MemoryTypeDelete(MemType);
```

After `0.17.0`, the `WasmEdge_LimitContext` is an opaque object. Developers should create it through `WasmEdge_LimitCreate()` or `WasmEdge_LimitCreateWithMax()`, pass the pointer to the type creation APIs, and destroy it through `WasmEdge_LimitDelete()` when no longer needed.

```c
/* Create a limit context with min=10, max=20, 32-bit address, non-shared. */
WasmEdge_LimitContext *TabLim = WasmEdge_LimitCreateWithMax(10, 20, false, false);
WasmEdge_TableTypeContext *TabType =
    WasmEdge_TableTypeCreate(WasmEdge_ValTypeGenFuncRef(), TabLim);
/* The limit context can be deleted after the type creation. */
WasmEdge_LimitDelete(TabLim);

/*
 * The limit context returned from `WasmEdge_TableTypeGetLimit()` or
 * `WasmEdge_MemoryTypeGetLimit()` is owned by the type context and should
 * __NOT__ be deleted by developers.
 */
const WasmEdge_LimitContext *GotTabLim = WasmEdge_TableTypeGetLimit(TabType);
uint64_t Min = WasmEdge_LimitGetMin(GotTabLim);
uint64_t Max = WasmEdge_LimitGetMax(GotTabLim);
WasmEdge_TableTypeDelete(TabType);

WasmEdge_LimitContext *MemLim = WasmEdge_LimitCreateWithMax(1, 5, false, false);
WasmEdge_MemoryTypeContext *MemType = WasmEdge_MemoryTypeCreate(MemLim);
WasmEdge_LimitDelete(MemLim);
WasmEdge_MemoryTypeDelete(MemType);
```

## Run mode configuration

Before the version `0.16.3`, the only execution-engine switch in the configure context was the boolean `ForceInterpreter` flag.

```c
WasmEdge_ConfigureContext *ConfCxt = WasmEdge_ConfigureCreate();
WasmEdge_ConfigureSetForceInterpreter(ConfCxt, true);
bool IsForceInterp = WasmEdge_ConfigureIsForceInterpreter(ConfCxt);
WasmEdge_ConfigureDelete(ConfCxt);
```

After `0.17.0`, the tri-state `WasmEdge_RunMode` enumeration replaces the boolean flag.

```c
enum WasmEdge_RunMode {
  WasmEdge_RunMode_Interpreter = 0, // Default, interpreter mode.
  WasmEdge_RunMode_JIT,             // JIT mode.
  WasmEdge_RunMode_AOT,             // AOT mode.
};
```

Only `WasmEdge_RunMode_AOT` loads AOT custom sections from universal WASM, or `dlopen`s shared-library WASM artifacts. In the other modes, AOT data is ignored, and shared-library inputs are re-loaded as plain WASM after extracting their embedded bytes.

```c
WasmEdge_ConfigureContext *ConfCxt = WasmEdge_ConfigureCreate();
WasmEdge_ConfigureSetRunMode(ConfCxt, WasmEdge_RunMode_AOT);
enum WasmEdge_RunMode Mode = WasmEdge_ConfigureGetRunMode(ConfCxt);
WasmEdge_ConfigureDelete(ConfCxt);
```

<!-- prettier-ignore -->
:::note
The `WasmEdge_ConfigureSetForceInterpreter()` and `WasmEdge_ConfigureIsForceInterpreter()` APIs are kept for backward compatibility but are moved into the `wasmedge_deprecated.h` header. They translate to the new run-mode field internally and will be removed in the future.
:::

## Register module instance with alias name

Before the version `0.16.3`, a module instance could only be registered into a store or VM with its own module name, set when the module instance was created.

```c
WasmEdge_VMContext *VMCxt = WasmEdge_VMCreate(NULL, NULL);
WasmEdge_ModuleInstanceContext *HostMod =
    WasmEdge_ModuleInstanceCreate(/* ... ignored ... */);
WasmEdge_Result Res = WasmEdge_VMRegisterModuleFromImport(VMCxt, HostMod);

WasmEdge_ModuleInstanceDelete(HostMod);
WasmEdge_VMDelete(VMCxt);
```

After `0.17.0`, developers can register a module instance under an arbitrary alias name through the new `WasmEdge_ExecutorRegisterImportWithAlias()` and `WasmEdge_VMRegisterModuleFromImportWithAlias()` APIs. The same module instance can now be registered under multiple alias names in the same store or VM.

```c
WasmEdge_VMContext *VMCxt = WasmEdge_VMCreate(NULL, NULL);
WasmEdge_ModuleInstanceContext *HostMod =
    WasmEdge_ModuleInstanceCreate(/* ... ignored ... */);
WasmEdge_String AliasName = WasmEdge_StringCreateByCString("alias_name");

WasmEdge_Result Res =
    WasmEdge_VMRegisterModuleFromImportWithAlias(VMCxt, AliasName, HostMod);

WasmEdge_StringDelete(AliasName);
WasmEdge_ModuleInstanceDelete(HostMod);
WasmEdge_VMDelete(VMCxt);
```

## Memory64 proposal

Since the `0.17.0` release, WasmEdge supports the [Memory64 proposal](https://github.com/WebAssembly/memory64) in both the interpreter and the AOT/JIT compiler. As part of the WASM 3.0 standard, the proposal is enabled by default, and developers do not need to turn it on in the configure context.

To create a 64-bit memory type, pass `true` as the `Is64Bit` parameter when constructing the limit context.

```c
/* Create a 64-bit memory type with min=1 page, no max. */
WasmEdge_LimitContext *Mem64Lim = WasmEdge_LimitCreate(1, /* Is64Bit */ true);
WasmEdge_MemoryTypeContext *Mem64Type = WasmEdge_MemoryTypeCreate(Mem64Lim);
WasmEdge_LimitDelete(Mem64Lim);

/* ... */

WasmEdge_MemoryTypeDelete(Mem64Type);
```
