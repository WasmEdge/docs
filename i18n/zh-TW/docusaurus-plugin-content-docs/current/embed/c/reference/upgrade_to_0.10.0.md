---
sidebar_position: 16
---

# 升級至 WasmEdge 0.10.0

由於 WasmEdge C API 有破壞性變更，本文件說明使用 WasmEdge C API 從 `0.9.1` 升級到 `0.10.0` 版本的程式設計指引。

## 概念

1. 將 `WasmEdge_ImportObjectContext` 合併到 `WasmEdge_ModuleInstanceContext` 中。

   用於主機函式的 `WasmEdge_ImportObjectContext` 已合併到 `WasmEdge_ModuleInstanceContext`。開發者可以使用相關的 API 來建構主機模組。

   - `WasmEdge_ImportObjectCreate()` 變更為 `WasmEdge_ModuleInstanceCreate()`。
   - `WasmEdge_ImportObjectDelete()` 變更為 `WasmEdge_ModuleInstanceDelete()`。
   - `WasmEdge_ImportObjectAddFunction()` 變更為 `WasmEdge_ModuleInstanceAddFunction()`。
   - `WasmEdge_ImportObjectAddTable()` 變更為 `WasmEdge_ModuleInstanceAddTable()`。
   - `WasmEdge_ImportObjectAddMemory()` 變更為 `WasmEdge_ModuleInstanceAddMemory()`。
   - `WasmEdge_ImportObjectAddGlobal()` 變更為 `WasmEdge_ModuleInstanceAddGlobal()`。
   - `WasmEdge_ImportObjectCreateWASI()` 變更為 `WasmEdge_ModuleInstanceCreateWASI()`。
   - `WasmEdge_ImportObjectCreateWasmEdgeProcess()` 變更為 `WasmEdge_ModuleInstanceCreateWasmEdgeProcess()`。
   - `WasmEdge_ImportObjectInitWASI()` 變更為 `WasmEdge_ModuleInstanceInitWASI()`。
   - `WasmEdge_ImportObjectInitWasmEdgeProcess()` 變更為 `WasmEdge_ModuleInstanceInitWasmEdgeProcess()`。

   關於新的主機函式範例，請參閱[下方範例](#host-functions)。

2. 在 `FuncRef` 值型別中改用指向 `WasmEdge_FunctionInstanceContext` 的指標，而非索引。

   為了更好的效能與安全性，`FuncRef` 相關的 API 改用 `const WasmEdge_FunctionInstanceContext *` 作為參數與回傳值。

   - `WasmEdge_ValueGenFuncRef()` 變更為使用 `const WasmEdge_FunctionInstanceContext *` 作為其引數。
   - `WasmEdge_ValueGetFuncRef()` 變更為回傳 `const WasmEdge_FunctionInstanceContext *`。

3. 支援多個匿名 WASM 模組的實例化。

   在 `0.9.1` 之前的版本中，WasmEdge 一次只支援實例化 1 個匿名 WASM 模組。如果開發者實例化新的 WASM 模組，舊的模組就會被取代。在 `0.10.0` 版本之後，開發者可以透過 `Executor` 實例化多個匿名 WASM 模組並取得 `Module` 實例。但對於使用 `VM` API 的原始碼而言，行為並未變更。關於實例化多個匿名 WASM 模組的新範例，請參閱[下方範例](#wasmedge-executor-changes)。

4. `WasmEdge_StoreContext` 的行為變更。

   `Function`、`Table`、`Memory` 與 `Global` 實例從 `Store` 中擷取的功能，已移至 `Module` 實例中。在 `0.10.0` 版本之後，`Store` 僅負責管理實例化時的模組連結，以及具名模組的搜尋。

   - `WasmEdge_StoreListFunctionLength()` 與 `WasmEdge_StoreListFunctionRegisteredLength()` 由 `WasmEdge_ModuleInstanceListFunctionLength()` 取代。
   - `WasmEdge_StoreListTableLength()` 與 `WasmEdge_StoreListTableRegisteredLength()` 由 `WasmEdge_ModuleInstanceListTableLength()` 取代。
   - `WasmEdge_StoreListMemoryLength()` 與 `WasmEdge_StoreListMemoryRegisteredLength()` 由 `WasmEdge_ModuleInstanceListMemoryLength()` 取代。
   - `WasmEdge_StoreListGlobalLength()` 與 `WasmEdge_StoreListGlobalRegisteredLength()` 由 `WasmEdge_ModuleInstanceListGlobalLength()` 取代。
   - `WasmEdge_StoreListFunction()` 與 `WasmEdge_StoreListFunctionRegistered()` 由 `WasmEdge_ModuleInstanceListFunction()` 取代。
   - `WasmEdge_StoreListTable()` 與 `WasmEdge_StoreListTableRegistered()` 由 `WasmEdge_ModuleInstanceListTable()` 取代。
   - `WasmEdge_StoreListMemory()` 與 `WasmEdge_StoreListMemoryRegistered()` 由 `WasmEdge_ModuleInstanceListMemory()` 取代。
   - `WasmEdge_StoreListGlobal()` 與 `WasmEdge_StoreListGlobalRegistered()` 由 `WasmEdge_ModuleInstanceListGlobal()` 取代。
   - `WasmEdge_StoreFindFunction()` 與 `WasmEdge_StoreFindFunctionRegistered()` 由 `WasmEdge_ModuleInstanceFindFunction()` 取代。
   - `WasmEdge_StoreFindTable()` 與 `WasmEdge_StoreFindTableRegistered()` 由 `WasmEdge_ModuleInstanceFindTable()` 取代。
   - `WasmEdge_StoreFindMemory()` 與 `WasmEdge_StoreFindMemoryRegistered()` 由 `WasmEdge_ModuleInstanceFindMemory()` 取代。
   - `WasmEdge_StoreFindGlobal()` 與 `WasmEdge_StoreFindGlobalRegistered()` 由 `WasmEdge_ModuleInstanceFindGlobal()` 取代。

   關於擷取實例的新範例，請參閱[下方範例](#instances-retrievement)。

5. 以 `WasmEdge_ModuleInstanceContext` 為基礎的資源管理。

   除了為主機函式建立 `Module` 實例之外，`Executor` 在實例化後也會輸出一個 `Module` 實例。無論是匿名或具名模組，開發者都有責任透過 `WasmEdge_ModuleInstanceDelete()` API 來銷毀它們。`Store` 在註冊後會連結到具名 `Module` 實例。當 `Module` 實例被銷毀時，`Store` 會自動取消連結；當 `Store` 被銷毀時，所有連結到此 `Store` 的 `Module` 實例會自動取消連結。

## WasmEdge VM 變更

`VM` API 基本上沒有變更，除了 `ImportObject` 相關的 API。

以下是 WasmEdge `0.9.1` C API 中 WASI 初始化的範例：

```c
WasmEdge_ConfigureContext *ConfCxt = WasmEdge_ConfigureCreate();
WasmEdge_ConfigureAddHostRegistration(ConfCxt, WasmEdge_HostRegistration_Wasi);
WasmEdge_VMContext *VMCxt = WasmEdge_VMCreate(ConfCxt, NULL);
/* The following API can retrieve the pre-registration import objects from the VM context. */
/* This API will return `NULL` if the corresponding pre-registration is not set into the configuration. */
WasmEdge_ImportObjectContext *WasiObject =
    WasmEdge_VMGetImportModuleContext(VMCxt, WasmEdge_HostRegistration_Wasi);
/* Initialize the WASI. */
WasmEdge_ImportObjectInitWASI(WasiObject, /* ... ignored */ );

/* ... */

WasmEdge_VMDelete(VMCxt);
WasmEdge_ConfigureDelete(ConfCxt);
```

開發者只要將 `WasmEdge_ImportObjectContext` 替換為 `WasmEdge_ModuleInstanceContext`，就能變更為使用 WasmEdge `0.10.0` C API：

```c
WasmEdge_ConfigureContext *ConfCxt = WasmEdge_ConfigureCreate();
WasmEdge_ConfigureAddHostRegistration(ConfCxt, WasmEdge_HostRegistration_Wasi);
WasmEdge_VMContext *VMCxt = WasmEdge_VMCreate(ConfCxt, NULL);
/* The following API can retrieve the pre-registration module instances from the VM context. */
/* This API will return `NULL` if the corresponding pre-registration is not set into the configuration. */
WasmEdge_ModuleInstanceContext *WasiModule =
    WasmEdge_VMGetImportModuleContext(VMCxt, WasmEdge_HostRegistration_Wasi);
/* Initialize the WASI. */
WasmEdge_ModuleInstanceInitWASI(WasiModule, /* ... ignored */ );

/* ... */

WasmEdge_VMDelete(VMCxt);
WasmEdge_ConfigureDelete(ConfCxt);
```

`VM` 提供了取得目前已實例化匿名 `Module` 實例的全新 API。舉例來說，如果開發者想取得匯出的 `Global` 實例：

```c
/* Assume that a WASM module is instantiated in `VMCxt`, and exports the "global_i32". */
WasmEdge_StoreContext *StoreCxt = WasmEdge_VMGetStoreContext(VMCxt);
WasmEdge_String GlobName = WasmEdge_StringCreateByCString("global_i32");
WasmEdge_GlobalInstanceContext *GlobCxt = WasmEdge_StoreFindGlobal(StoreCxt, GlobName);
WasmEdge_StringDelete(GlobName);
```

在 WasmEdge `0.10.0` C API 之後，開發者可以使用 `WasmEdge_VMGetActiveModule()` 取得模組實例：

```c
/* Assume that a WASM module is instantiated in `VMCxt`, and exports the "global_i32". */
const WasmEdge_ModuleInstanceContext *ModCxt = WasmEdge_VMGetActiveModule(VMCxt);
/* The example of retrieving the global instance. */
WasmEdge_String GlobName = WasmEdge_StringCreateByCString("global_i32");
WasmEdge_GlobalInstanceContext *GlobCxt = WasmEdge_ModuleInstanceFindGlobal(ModCxt, GlobName);
WasmEdge_StringDelete(GlobName);
```

## WasmEdge Executor 變更

`Executor` 用於協助實例化 WASM 模組、以模組名稱將 WASM 模組註冊到 `Store`、註冊含主機函式的主機模組，或呼叫函式。

1. WASM 模組實例化

   在 WasmEdge `0.9.1` 版本中，開發者可以透過 `Executor` API 來實例化 WASM 模組：

   ```c
   WasmEdge_ASTModuleContext *ASTCxt;
   /*
    * Assume that `ASTCxt` is a loaded WASM from file or buffer and has passed the validation.
    * Assume that `ExecCxt` is a `WasmEdge_ExecutorContext`.
    * Assume that `StoreCxt` is a `WasmEdge_StoreContext`.
    */
   WasmEdge_Result Res = WasmEdge_ExecutorInstantiate(ExecCxt, StoreCxt, ASTCxt);
   if (!WasmEdge_ResultOK(Res)) {
     printf("Instantiation phase failed: %s\n", WasmEdge_ResultGetMessage(Res));
   }
   ```

   然後 WASM 模組會被實例化為匿名模組實例並由 `Store` 處理。如果透過此 API 實例化新的 WASM 模組，舊的已實例化模組實例會被清除。在 WasmEdge `0.10.0` 版本之後，已實例化的匿名模組會被輸出並由呼叫者處理，且不再僅限於 1 個匿名模組實例。開發者有責任銷毀輸出的模組實例。

   ```c
   WasmEdge_ASTModuleContext *ASTCxt1, *ASTCxt2;
   /*
    * Assume that `ASTCxt1` and `ASTCxt2` are loaded WASMs from different files or buffers,
    * and have both passed the validation.
    * Assume that `ExecCxt` is a `WasmEdge_ExecutorContext`.
    * Assume that `StoreCxt` is a `WasmEdge_StoreContext`.
    */
   WasmEdge_ModuleInstanceContext *ModCxt1 = NULL;
   WasmEdge_ModuleInstanceContext *ModCxt2 = NULL;
   WasmEdge_Result Res = WasmEdge_ExecutorInstantiate(ExecCxt, &ModCxt1, StoreCxt, ASTCxt1);
   if (!WasmEdge_ResultOK(Res)) {
     printf("Instantiation phase failed: %s\n", WasmEdge_ResultGetMessage(Res));
   }
   Res = WasmEdge_ExecutorInstantiate(ExecCxt, &ModCxt2, StoreCxt, ASTCxt2);
   if (!WasmEdge_ResultOK(Res)) {
     printf("Instantiation phase failed: %s\n", WasmEdge_ResultGetMessage(Res));
   }
   ```

2. 以模組名稱註冊 WASM 模組

   在實例化並以模組名稱註冊 WASM 模組時，開發者可以在 WasmEdge `0.9.1` 之前使用 `WasmEdge_ExecutorRegisterModule()` API。

   ```c
   WasmEdge_ASTModuleContext *ASTCxt;
   /*
    * Assume that `ASTCxt` is a loaded WASM from file or buffer and has passed the validation.
    * Assume that `ExecCxt` is a `WasmEdge_ExecutorContext`.
    * Assume that `StoreCxt` is a `WasmEdge_StoreContext`.
    */

   /* Register the WASM module into store with the export module name "mod". */
   WasmEdge_String ModName = WasmEdge_StringCreateByCString("mod");
   Res = WasmEdge_ExecutorRegisterModule(ExecCxt, StoreCxt, ASTCxt, ModName);
   WasmEdge_StringDelete(ModName);
   if (!WasmEdge_ResultOK(Res)) {
     printf("WASM registration failed: %s\n", WasmEdge_ResultGetMessage(Res));
   }
   ```

   WasmEdge `0.10.0` 實作了相同功能，但使用不同的 API `WasmEdge_ExecutorRegister()`：

   ```c
   WasmEdge_ASTModuleContext *ASTCxt;
   /*
    * Assume that `ASTCxt` is a loaded WASM from file or buffer and has passed the validation.
    * Assume that `ExecCxt` is a `WasmEdge_ExecutorContext`.
    * Assume that `StoreCxt` is a `WasmEdge_StoreContext`.
    */

   /* Register the WASM module into store with the export module name "mod". */
   WasmEdge_String ModName = WasmEdge_StringCreateByCString("mod");
   /* The output module instance. */
   WasmEdge_ModuleInstanceContext *ModCxt = NULL;
   Res = WasmEdge_ExecutorRegister(ExecCxt, &ModCxt, StoreCxt, ASTCxt, ModName);
   WasmEdge_StringDelete(ModName);
   if (!WasmEdge_ResultOK(Res)) {
     printf("WASM registration failed: %s\n", WasmEdge_ResultGetMessage(Res));
   }
   ```

   開發者有責任銷毀輸出的模組實例。

3. 主機模組註冊

   在 WasmEdge `0.9.1` 中，開發者可以建立 `WasmEdge_ImportObjectContext` 並註冊到 `Store` 中。

   ```c
   /* Create the import object with the export module name. */
   WasmEdge_String ModName = WasmEdge_StringCreateByCString("module");
   WasmEdge_ImportObjectContext *ImpObj = WasmEdge_ImportObjectCreate(ModName);
   WasmEdge_StringDelete(ModName);
   /*
    * ...
    * Add the host functions, tables, memories, and globals into the import object.
    */
   /* The import module context has already contained the export module name. */
   Res = WasmEdge_ExecutorRegisterImport(ExecCxt, StoreCxt, ImpObj);
   if (!WasmEdge_ResultOK(Res)) {
     printf("Import object registration failed: %s\n", WasmEdge_ResultGetMessage(Res));
   }
   ```

   在 WasmEdge `0.10.0` 之後，開發者應改為使用 `WasmEdge_ModuleInstanceContext`：

   ```c
   /* Create the module instance with the export module name. */
   WasmEdge_String ModName = WasmEdge_StringCreateByCString("module");
   WasmEdge_ModuleInstanceContext *ModCxt = WasmEdge_ModuleInstanceCreate(ModName);
   WasmEdge_StringDelete(ModName);
   /*
    * ...
    * Add the host functions, tables, memories, and globals into the module instance.
    */
   /* The module instance context has already contained the export module name. */
   Res = WasmEdge_ExecutorRegisterImport(ExecCxt, StoreCxt, ModCxt);
   if (!WasmEdge_ResultOK(Res)) {
     printf("Module instance registration failed: %s\n", WasmEdge_ResultGetMessage(Res));
   }
   ```

   開發者有責任銷毀已建立的模組實例。

4. WASM 函式呼叫

   此範例使用從文字格式 [fibonacci.wat](https://raw.githubusercontent.com/WasmEdge/WasmEdge/master/examples/wasm/fibonacci.wat) 轉換而來的 WASM 檔案 `fibonacci.wasm`。在 WasmEdge `0.9.1` 版本中，開發者可以使用匯出函式名稱來呼叫 WASM 函式：

   ```c
   /* Create the store context. The store context holds the instances. */
   WasmEdge_StoreContext *StoreCxt = WasmEdge_StoreCreate();
   /* Result. */
   WasmEdge_Result Res;

   /* Create the loader context. The configure context can be NULL. */
   WasmEdge_LoaderContext *LoadCxt = WasmEdge_LoaderCreate(NULL);
   /* Create the validator context. The configure context can be NULL. */
   WasmEdge_ValidatorContext *ValidCxt = WasmEdge_ValidatorCreate(NULL);
   /* Create the executor context. The configure context and the statistics context can be NULL. */
   WasmEdge_ExecutorContext *ExecCxt = WasmEdge_ExecutorCreate(NULL, NULL);

   /* Load the WASM file or the compiled-WASM file and convert into the AST module context. */
   WasmEdge_ASTModuleContext *ASTCxt = NULL;
   Res = WasmEdge_LoaderParseFromFile(LoadCxt, &ASTCxt, "fibonacci.wasm");
   if (!WasmEdge_ResultOK(Res)) {
     printf("Loading phase failed: %s\n", WasmEdge_ResultGetMessage(Res));
     return -1;
   }
   /* Validate the WASM module. */
   Res = WasmEdge_ValidatorValidate(ValidCxt, ASTCxt);
   if (!WasmEdge_ResultOK(Res)) {
     printf("Validation phase failed: %s\n", WasmEdge_ResultGetMessage(Res));
     return -1;
   }
   /* Instantiate the WASM module into the store context. */
   Res = WasmEdge_ExecutorInstantiate(ExecCxt, StoreCxt, ASTCxt);
   if (!WasmEdge_ResultOK(Res)) {
     printf("Instantiation phase failed: %s\n", WasmEdge_ResultGetMessage(Res));
     return -1;
   }
   /* Invoke the function which is exported with the function name "fib". */
   WasmEdge_String FuncName = WasmEdge_StringCreateByCString("fib");
   WasmEdge_Value Params[1] = { WasmEdge_ValueGenI32(18) };
   WasmEdge_Value Returns[1];
   Res = WasmEdge_ExecutorInvoke(ExecCxt, StoreCxt, FuncName, Params, 1, Returns, 1);
   if (WasmEdge_ResultOK(Res)) {
     printf("Get the result: %d\n", WasmEdge_ValueGetI32(Returns[0]));
   } else {
     printf("Execution phase failed: %s\n", WasmEdge_ResultGetMessage(Res));
     return -1;
   }

   WasmEdge_ASTModuleDelete(ASTCxt);
   WasmEdge_LoaderDelete(LoadCxt);
   WasmEdge_ValidatorDelete(ValidCxt);
   WasmEdge_ExecutorDelete(ExecCxt);
   WasmEdge_StoreDelete(StoreCxt);
   ```

   在 WasmEdge `0.10.0` 之後，開發者應先依函式名稱擷取 `Function` 實例。

   ```c
   /*
    * ...
    * Ignore the unchanged steps before validation. Please refer to the sample code above.
    */
   WasmEdge_ModuleInstanceContext *ModCxt = NULL;
   /* Instantiate the WASM module. */
   Res = WasmEdge_ExecutorInstantiate(ExecCxt, &ModCxt1, StoreCxt, ASTCxt);
   if (!WasmEdge_ResultOK(Res)) {
     printf("Instantiation phase failed: %s\n", WasmEdge_ResultGetMessage(Res));
     return -1;
   }
   /* Retrieve the function instance by name. */
   WasmEdge_String FuncName = WasmEdge_StringCreateByCString("fib");
   WasmEdge_FunctionInstanceContext *FuncCxt = WasmEdge_ModuleInstanceFindFunction(ModCxt, FuncName);
   WasmEdge_StringDelete(FuncName);
   /* Invoke the function. */
   WasmEdge_Value Params[1] = { WasmEdge_ValueGenI32(18) };
   WasmEdge_Value Returns[1];
   Res = WasmEdge_ExecutorInvoke(ExecCxt, FuncCxt, Params, 1, Returns, 1);
   if (WasmEdge_ResultOK(Res)) {
     printf("Get the result: %d\n", WasmEdge_ValueGetI32(Returns[0]));
   } else {
     printf("Execution phase failed: %s\n", WasmEdge_ResultGetMessage(Res));
     return -1;
   }

   WasmEdge_ModuleInstanceDelete(ModCxt);
   WasmEdge_ASTModuleDelete(ASTCxt);
   WasmEdge_LoaderDelete(LoadCxt);
   WasmEdge_ValidatorDelete(ValidCxt);
   WasmEdge_ExecutorDelete(ExecCxt);
   WasmEdge_StoreDelete(StoreCxt);
   ```

## 實例擷取

此範例使用從文字格式 [fibonacci.wat](https://raw.githubusercontent.com/WasmEdge/WasmEdge/master/examples/wasm/fibonacci.wat) 轉換而來的 WASM 檔案 `fibonacci.wasm`。

在 WasmEdge `0.9.1` 之前的版本中，開發者可以從 `Store` 中擷取具名或匿名模組所有匯出的實例：

```c
/* Create the store context. The store context holds the instances. */
WasmEdge_StoreContext *StoreCxt = WasmEdge_StoreCreate();
/* Result. */
WasmEdge_Result Res;

/* Create the loader context. The configure context can be NULL. */
WasmEdge_LoaderContext *LoadCxt = WasmEdge_LoaderCreate(NULL);
/* Create the validator context. The configure context can be NULL. */
WasmEdge_ValidatorContext *ValidCxt = WasmEdge_ValidatorCreate(NULL);
/* Create the executor context. The configure context and the statistics context can be NULL. */
WasmEdge_ExecutorContext *ExecCxt = WasmEdge_ExecutorCreate(NULL, NULL);

/* Load the WASM file or the compiled-WASM file and convert into the AST module context. */
WasmEdge_ASTModuleContext *ASTCxt = NULL;
Res = WasmEdge_LoaderParseFromFile(LoadCxt, &ASTCxt, "fibonacci.wasm");
if (!WasmEdge_ResultOK(Res)) {
  printf("Loading phase failed: %s\n", WasmEdge_ResultGetMessage(Res));
  return -1;
}
/* Validate the WASM module. */
Res = WasmEdge_ValidatorValidate(ValidCxt, ASTCxt);
if (!WasmEdge_ResultOK(Res)) {
  printf("Validation phase failed: %s\n", WasmEdge_ResultGetMessage(Res));
  return -1;
}
/* Example: register and instantiate the WASM module with the module name "module_fib". */
WasmEdge_String ModName = WasmEdge_StringCreateByCString("module_fib");
Res = WasmEdge_ExecutorRegisterModule(ExecCxt, StoreCxt, ASTCxt, ModName);
if (!WasmEdge_ResultOK(Res)) {
  printf("Instantiation phase failed: %s\n", WasmEdge_ResultGetMessage(Res));
  return -1;
}
/* Example: Instantiate the WASM module into the store context. */
Res = WasmEdge_ExecutorInstantiate(ExecCxt, StoreCxt, ASTCxt);
if (!WasmEdge_ResultOK(Res)) {
  printf("Instantiation phase failed: %s\n", WasmEdge_ResultGetMessage(Res));
  return -1;
}
WasmEdge_StringDelete(ModName);

/* Now, developers can retrieve the exported instances from the store. */
/* Take the exported functions as example. This WASM exports the function "fib". */
WasmEdge_String FuncName = WasmEdge_StringCreateByCString("fib");
WasmEdge_FunctionInstanceContext *FoundFuncCxt;
/* Find the function "fib" from the instantiated anonymous module. */
FoundFuncCxt = WasmEdge_StoreFindFunction(StoreCxt, FuncName);
/* Find the function "fib" from the registered module "module_fib". */
ModName = WasmEdge_StringCreateByCString("module_fib");
FoundFuncCxt = WasmEdge_StoreFindFunctionRegistered(StoreCxt, ModName, FuncName);
WasmEdge_StringDelete(ModName);
WasmEdge_StringDelete(FuncName);

WasmEdge_ASTModuleDelete(ASTCxt);
WasmEdge_LoaderDelete(LoadCxt);
WasmEdge_ValidatorDelete(ValidCxt);
WasmEdge_ExecutorDelete(ExecCxt);
WasmEdge_StoreDelete(StoreCxt);
```

在 WasmEdge `0.10.0` 之後，開發者可以實例化多個匿名 `Module` 實例，並應從具名或匿名 `Module` 實例中擷取匯出的實例：

```c
/* Create the store context. The store context is the object to link the modules for imports and exports. */
WasmEdge_StoreContext *StoreCxt = WasmEdge_StoreCreate();
/* Result. */
WasmEdge_Result Res;

/* Create the loader context. The configure context can be NULL. */
WasmEdge_LoaderContext *LoadCxt = WasmEdge_LoaderCreate(NULL);
/* Create the validator context. The configure context can be NULL. */
WasmEdge_ValidatorContext *ValidCxt = WasmEdge_ValidatorCreate(NULL);
/* Create the executor context. The configure context and the statistics context can be NULL. */
WasmEdge_ExecutorContext *ExecCxt = WasmEdge_ExecutorCreate(NULL, NULL);

/* Load the WASM file or the compiled-WASM file and convert into the AST module context. */
WasmEdge_ASTModuleContext *ASTCxt = NULL;
Res = WasmEdge_LoaderParseFromFile(LoadCxt, &ASTCxt, "fibonacci.wasm");
if (!WasmEdge_ResultOK(Res)) {
  printf("Loading phase failed: %s\n", WasmEdge_ResultGetMessage(Res));
  return -1;
}
/* Validate the WASM module. */
Res = WasmEdge_ValidatorValidate(ValidCxt, ASTCxt);
if (!WasmEdge_ResultOK(Res)) {
  printf("Validation phase failed: %s\n", WasmEdge_ResultGetMessage(Res));
  return -1;
}
/* Example: register and instantiate the WASM module with the module name "module_fib". */
WasmEdge_ModuleInstanceContext *NamedModCxt = NULL;
WasmEdge_String ModName = WasmEdge_StringCreateByCString("module_fib");
Res = WasmEdge_ExecutorRegister(ExecCxt, &NamedModCxt, StoreCxt, ASTCxt, ModName);
if (!WasmEdge_ResultOK(Res)) {
  printf("Instantiation phase failed: %s\n", WasmEdge_ResultGetMessage(Res));
  return -1;
}
/* Example: Instantiate the WASM module and get the output module instance. */
WasmEdge_ModuleInstanceContext *ModCxt = NULL;
Res = WasmEdge_ExecutorInstantiate(ExecCxt, &ModCxt, StoreCxt, ASTCxt);
if (!WasmEdge_ResultOK(Res)) {
  printf("Instantiation phase failed: %s\n", WasmEdge_ResultGetMessage(Res));
  return -1;
}
WasmEdge_StringDelete(ModName);

/* Now, developers can retrieve the exported instances from the module instances. */
/* Take the exported functions as example. This WASM exports the function "fib". */
WasmEdge_String FuncName = WasmEdge_StringCreateByCString("fib");
WasmEdge_FunctionInstanceContext *FoundFuncCxt;
/* Find the function "fib" from the instantiated anonymous module. */
FoundFuncCxt = WasmEdge_ModuleInstanceFindFunction(ModCxt, FuncName);
/* Find the function "fib" from the registered module "module_fib". */
FoundFuncCxt = WasmEdge_ModuleInstanceFindFunction(NamedModCxt, FuncName);
/* Or developers can get the named module instance from the store: */
ModName = WasmEdge_StringCreateByCString("module_fib");
const WasmEdge_ModuleInstanceContext *ModCxtGot = WasmEdge_StoreFindModule(StoreCxt, ModName);
WasmEdge_StringDelete(ModName);
FoundFuncCxt = WasmEdge_ModuleInstanceFindFunction(ModCxtGot, FuncName);
WasmEdge_StringDelete(FuncName);

WasmEdge_ModuleInstanceDelete(NamedModCxt);
WasmEdge_ModuleInstanceDelete(ModCxt);
WasmEdge_ASTModuleDelete(ASTCxt);
WasmEdge_LoaderDelete(LoadCxt);
WasmEdge_ValidatorDelete(ValidCxt);
WasmEdge_ExecutorDelete(ExecCxt);
WasmEdge_StoreDelete(StoreCxt);
```

## 主機函式

主機函式的差異在於替換了 `WasmEdge_ImportObjectContext`。

```c
/* Host function body definition. */
WasmEdge_Result Add(void *Data, WasmEdge_MemoryInstanceContext *MemCxt,
                    const WasmEdge_Value *In, WasmEdge_Value *Out) {
  int32_t Val1 = WasmEdge_ValueGetI32(In[0]);
  int32_t Val2 = WasmEdge_ValueGetI32(In[1]);
  Out[0] = WasmEdge_ValueGenI32(Val1 + Val2);
  return WasmEdge_Result_Success;
}

/* Create the import object. */
WasmEdge_String ExportName = WasmEdge_StringCreateByCString("module");
WasmEdge_ImportObjectContext *ImpObj = WasmEdge_ImportObjectCreate(ExportName);
WasmEdge_StringDelete(ExportName);

/* Create and add a function instance into the import object. */
enum WasmEdge_ValType ParamList[2] = { WasmEdge_ValType_I32, WasmEdge_ValType_I32 };
enum WasmEdge_ValType ReturnList[1] = { WasmEdge_ValType_I32 };
WasmEdge_FunctionTypeContext *HostFType =
    WasmEdge_FunctionTypeCreate(ParamList, 2, ReturnList, 1);
WasmEdge_FunctionInstanceContext *HostFunc =
    WasmEdge_FunctionInstanceCreate(HostFType, Add, NULL, 0);
/*
 * The third parameter is the pointer to the additional data object.
 * Developers should guarantee the life cycle of the data, and it can be
 * `NULL` if the external data is not needed.
 */
WasmEdge_FunctionTypeDelete(HostFType);
WasmEdge_String FuncName = WasmEdge_StringCreateByCString("add");
WasmEdge_ImportObjectAddFunction(ImpObj, FuncName, HostFunc);
WasmEdge_StringDelete(FuncName);

/*
 * The import objects should be deleted.
 * Developers should __NOT__ destroy the instances added into the import object contexts.
 */
WasmEdge_ImportObjectDelete(ImpObj);
```

開發者可以使用 `WasmEdge_ModuleInstanceContext` 輕鬆升級到 WasmEdge `0.10.0`。

```c
/* Host function body definition. */
WasmEdge_Result Add(void *Data, WasmEdge_MemoryInstanceContext *MemCxt,
                    const WasmEdge_Value *In, WasmEdge_Value *Out) {
  int32_t Val1 = WasmEdge_ValueGetI32(In[0]);
  int32_t Val2 = WasmEdge_ValueGetI32(In[1]);
  Out[0] = WasmEdge_ValueGenI32(Val1 + Val2);
  return WasmEdge_Result_Success;
}

/* Create a module instance. */
WasmEdge_String ExportName = WasmEdge_StringCreateByCString("module");
WasmEdge_ModuleInstanceContext *HostModCxt = WasmEdge_ModuleInstanceCreate(ExportName);
WasmEdge_StringDelete(ExportName);

/* Create and add a function instance into the module instance. */
enum WasmEdge_ValType ParamList[2] = { WasmEdge_ValType_I32, WasmEdge_ValType_I32 };
enum WasmEdge_ValType ReturnList[1] = { WasmEdge_ValType_I32 };
WasmEdge_FunctionTypeContext *HostFType =
    WasmEdge_FunctionTypeCreate(ParamList, 2, ReturnList, 1);
WasmEdge_FunctionInstanceContext *HostFunc =
    WasmEdge_FunctionInstanceCreate(HostFType, Add, NULL, 0);
/*
 * The third parameter is the pointer to the additional data object.
 * Developers should guarantee the life cycle of the data, and it can be
 * `NULL` if the external data is not needed.
 */
WasmEdge_FunctionTypeDelete(HostFType);
WasmEdge_String FuncName = WasmEdge_StringCreateByCString("add");
WasmEdge_ModuleInstanceAddFunction(HostModCxt, FuncName, HostFunc);
WasmEdge_StringDelete(FuncName);

/*
 * The module instance should be deleted.
 * Developers should __NOT__ destroy the instances added into the module instance contexts.
 */
WasmEdge_ModuleInstanceDelete(HostModCxt);
```
