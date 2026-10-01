---
sidebar_position: 2
---

# Upgrade to WasmEdge 0.18.0

Due to the WasmEdge C API breaking changes, this document shows the guideline for programming with WasmEdge C API to upgrade from the `0.17.2` to the `0.18.0` version.

## Concepts

1. The `WasmEdge_ModuleInstanceAdd*` APIs return `WasmEdge_Result`.

   The module instances are finalized after their first use in execution, which removes the locks from the hot path of execution. Therefore, the following APIs return `WasmEdge_Result` instead of `void`:

   - `WasmEdge_ModuleInstanceAddFunction()`
   - `WasmEdge_ModuleInstanceAddTable()`
   - `WasmEdge_ModuleInstanceAddMemory()`
   - `WasmEdge_ModuleInstanceAddGlobal()`

   These APIs fail with the `WasmEdge_ErrCode_WrongVMWorkflow` error after the module instance is first used in execution, and do **NOT** take the ownership of the added instance on failure.

2. Deprecated the `WasmEdge_VMForceDeleteRegisteredModule()` API.

   WasmEdge now tracks the dependencies between the registered modules. The new `WasmEdge_VMDeleteRegisteredModule()` API unregisters a module from the VM, and the module is destroyed only when no other module depends on it.

   The `WasmEdge_VMForceDeleteRegisteredModule()` API is deprecated and moved into the `wasmedge_deprecated.h` header. It still works but will be removed in the future.

3. Removed the `wasmedge_process` plug-in.

   The `wasmedge_process` plug-in is removed. The `WasmEdge_ModuleInstanceInitWasmEdgeProcess()` API is deprecated and moved into the `wasmedge_deprecated.h` header. It has no effect unless an external plug-in named `wasmedge_process` is loaded, and will be removed in the future.

4. Introduced the stack size limit.

   The execution now traps with the new `WasmEdge_ErrCode_CallStackExhausted` error when the call stack exceeds the limit, instead of crashing on the deep recursion. The limit defaults to 8 MiB in the interpreter mode and 512 KiB in the AOT and JIT modes. The new APIs are:

   - `WasmEdge_ConfigureSetMaxStackSize()`: set the stack size limit in the configure context.
   - `WasmEdge_ConfigureGetMaxStackSize()`: get the stack size limit from the configure context.

5. Introduced the lazy JIT run mode.

   The new `WasmEdge_RunMode_LazyJIT` value is added into the `WasmEdge_RunMode` enumeration. In the lazy JIT mode, each function is compiled on its first call.

## Add instances into module instances

Before the version `0.17.2`, the `WasmEdge_ModuleInstanceAdd*` APIs returned `void`, and the module instance always took the ownership of the added instance.

```c
WasmEdge_String ModName = WasmEdge_StringCreateByCString("module");
WasmEdge_ModuleInstanceContext *HostMod = WasmEdge_ModuleInstanceCreate(ModName);
WasmEdge_StringDelete(ModName);

WasmEdge_FunctionInstanceContext *HostFunc =
    WasmEdge_FunctionInstanceCreate(/* ... ignored ... */);
WasmEdge_String FuncName = WasmEdge_StringCreateByCString("add");
WasmEdge_ModuleInstanceAddFunction(HostMod, FuncName, HostFunc);
WasmEdge_StringDelete(FuncName);

WasmEdge_ModuleInstanceDelete(HostMod);
```

After `0.18.0`, these APIs return `WasmEdge_Result`. Developers should add all the instances before the module instance is first used in execution, and should destroy the instance by themselves if the API fails.

```c
WasmEdge_String ModName = WasmEdge_StringCreateByCString("module");
WasmEdge_ModuleInstanceContext *HostMod = WasmEdge_ModuleInstanceCreate(ModName);
WasmEdge_StringDelete(ModName);

WasmEdge_FunctionInstanceContext *HostFunc =
    WasmEdge_FunctionInstanceCreate(/* ... ignored ... */);
WasmEdge_String FuncName = WasmEdge_StringCreateByCString("add");
WasmEdge_Result Res =
    WasmEdge_ModuleInstanceAddFunction(HostMod, FuncName, HostFunc);
WasmEdge_StringDelete(FuncName);
if (!WasmEdge_ResultOK(Res)) {
  /* The module instance does not take the ownership on failure. */
  WasmEdge_FunctionInstanceDelete(HostFunc);
}

WasmEdge_ModuleInstanceDelete(HostMod);
```

## Delete the registered modules in VM

Before the version `0.17.2`, developers could only forcibly delete a registered module from the VM context, and should guarantee the module dependencies by themselves.

```c
WasmEdge_VMContext *VMCxt = WasmEdge_VMCreate(NULL, NULL);
WasmEdge_String ModName = WasmEdge_StringCreateByCString("mod");
WasmEdge_VMRegisterModuleFromFile(VMCxt, ModName, "fibonacci.wasm");

WasmEdge_VMForceDeleteRegisteredModule(VMCxt, ModName);

WasmEdge_StringDelete(ModName);
WasmEdge_VMDelete(VMCxt);
```

After `0.18.0`, developers should use the `WasmEdge_VMDeleteRegisteredModule()` API. The module is unregistered from the VM, and is destroyed only when there are no remaining dependencies from other modules.

```c
WasmEdge_VMContext *VMCxt = WasmEdge_VMCreate(NULL, NULL);
WasmEdge_String ModName = WasmEdge_StringCreateByCString("mod");
WasmEdge_VMRegisterModuleFromFile(VMCxt, ModName, "fibonacci.wasm");

WasmEdge_VMDeleteRegisteredModule(VMCxt, ModName);

WasmEdge_StringDelete(ModName);
WasmEdge_VMDelete(VMCxt);
```

## Stack size limit configuration

After `0.18.0`, developers can limit the call stack size of one execution in the configure context. The value `0` (default) selects the engine default, which is 8 MiB in the interpreter mode and 512 KiB in the AOT and JIT modes, and the value `UINT64_MAX` removes the limit.

```c
WasmEdge_ConfigureContext *ConfCxt = WasmEdge_ConfigureCreate();
WasmEdge_ConfigureSetMaxStackSize(ConfCxt, 1024 * 1024);
uint64_t StackSize = WasmEdge_ConfigureGetMaxStackSize(ConfCxt);
/* The `StackSize` will be 1048576. */
WasmEdge_ConfigureDelete(ConfCxt);
```

When the call stack exceeds the limit, the execution fails with the `WasmEdge_ErrCode_CallStackExhausted` error.

## Run AOT-compiled WASM

Only the `WasmEdge_RunMode_AOT` run mode loads the AOT-compiled code. In the other run modes, the AOT custom sections in universal WASM are ignored, and the AOT-compiled shared libraries (`.so`, `.dylib`, or `.dll`) are rejected with the `WasmEdge_ErrCode_MalformedMagic` error.

```c
WasmEdge_ConfigureContext *ConfCxt = WasmEdge_ConfigureCreate();
WasmEdge_ConfigureSetRunMode(ConfCxt, WasmEdge_RunMode_AOT);
WasmEdge_VMContext *VMCxt = WasmEdge_VMCreate(ConfCxt, NULL);
/* ... Run the AOT-compiled WASM with the VM context. */
WasmEdge_VMDelete(VMCxt);
WasmEdge_ConfigureDelete(ConfCxt);
```
