---
sidebar_position: 10
---

# 升級至 WasmEdge-Go v0.10.0

由於 WasmEdge-Go API 有破壞性變更，本文件說明使用 WasmEdge-Go API 從 `v0.9.2` 升級到 `v0.10.0` 版本的程式設計指引。

**由於 `v0.9.1` 已被撤回，我們在此使用 `v0.9.2` 版本。**

## 概念

1. 將 `ImportObject` 合併到 `Module` 中。

   用於主機函式的 `ImportObject` 結構已合併到 `Module`。開發者可以使用相關的 API 來建構主機模組。

   - `wasmedge.NewImportObject()` 變更為 `wasmedge.NewModule()`。
   - `(*wasmedge.ImportObject).Release()` 變更為 `(*wasmedge.Module).Release()`。
   - `(*wasmedge.ImportObject).AddFunction()` 變更為 `(*wasmedge.Module).AddFunction()`。
   - `(*wasmedge.ImportObject).AddTable()` 變更為 `(*wasmedge.Module).AddTable()`。
   - `(*wasmedge.ImportObject).AddMemory()` 變更為 `(*wasmedge.Module).AddMemory()`。
   - `(*wasmedge.ImportObject).AddGlobal()` 變更為 `(*wasmedge.Module).AddGlobal()`。
   - `(*wasmedge.ImportObject).NewWasiImportObject()` 變更為 `(*wasmedge.Module).NewWasiModule()`。
   - `(*wasmedge.ImportObject).NewWasmEdgeProcessImportObject()` 變更為 `(*wasmedge.Module).NewWasmEdgeProcessModule()`。
   - `(*wasmedge.ImportObject).InitWASI()` 變更為 `(*wasmedge.Module).InitWASI()`。
   - `(*wasmedge.ImportObject).InitWasmEdgeProcess()` 變更為 `(*wasmedge.Module).InitWasmEdgeProcess()`。
   - `(*wasmedge.ImportObject).WasiGetExitCode()` 變更為 `(*wasmedge.Module).WasiGetExitCode`。
   - `(*wasmedge.VM).RegisterImport()` 變更為 `(*wasmedge.VM).RegisterModule()`。
   - `(*wasmedge.VM).GetImportObject()` 變更為 `(*wasmedge.VM).GetImportModule()`。

   關於新的主機函式範例，請參閱[下方範例](#host-functions)。

2. 在 `FuncRef` 值型別中改用指向 `Function` 的指標，而非索引。

   為了更好的效能與安全性，`FuncRef` 相關的 API 改用 `*wasmedge.Function` 作為參數與回傳值。

   - `wasmedge.NewFuncRef()` 變更為使用 `*Function` 作為其引數。
   - 新增 `(wasmedge.FuncRef).GetRef()` 以擷取 `*Function`。

3. 支援多個匿名 WASM 模組的實例化。

   在 `v0.9.2` 之前的版本中，WasmEdge 一次只支援實例化 1 個匿名 WASM 模組。如果開發者實例化新的 WASM 模組，舊的模組就會被取代。在 `v0.10.0` 版本之後，開發者可以透過 `Executor` 實例化多個匿名 WASM 模組並取得 `Module` 實例。但對於使用 `VM` API 的原始碼而言，行為並未變更。關於實例化多個匿名 WASM 模組的新範例，請參閱[下方範例](#wasmedge-executor-changes)。

4. `Store` 的行為變更。

   `Function`、`Table`、`Memory` 與 `Global` 實例從 `Store` 中擷取的功能，已移至 `Module` 實例中。在 `v0.10.0` 版本之後，`Store` 僅負責管理實例化時的模組連結，以及具名模組的搜尋。

   - `(*wasmedge.Store).ListFunction()` 與 `(*wasmedge.Store).ListFunctionRegistered()` 由 `(*wasmedge.Module).ListFunction()` 取代。
   - `(*wasmedge.Store).ListTable()` 與 `(*wasmedge.Store).ListTableRegistered()` 由 `(*wasmedge.Module).ListTable()` 取代。
   - `(*wasmedge.Store).ListMemory()` 與 `(*wasmedge.Store).ListMemoryRegistered()` 由 `(*wasmedge.Module).ListMemory()` 取代。
   - `(*wasmedge.Store).ListGlobal()` 與 `(*wasmedge.Store).ListGlobalRegistered()` 由 `(*wasmedge.Module).ListGlobal()` 取代。
   - `(*wasmedge.Store).FindFunction()` 與 `(*wasmedge.Store).FindFunctionRegistered()` 由 `(*wasmedge.Module).FindFunction()` 取代。
   - `(*wasmedge.Store).FindTable()` 與 `(*wasmedge.Store).FindTableRegistered()` 由 `(*wasmedge.Module).FindTable()` 取代。
   - `(*wasmedge.Store).FindMemory()` 與 `(*wasmedge.Store).FindMemoryRegistered()` 由 `(*wasmedge.Module).FindMemory()` 取代。
   - `(*wasmedge.Store).FindGlobal()` 與 `(*wasmedge.Store).FindGlobalRegistered()` 由 `(*wasmedge.Module).FindGlobal()` 取代。

   關於擷取實例的新範例，請參閱[下方範例](#instances-retrievement)。

5. 以 `Module` 為基礎的資源管理。

   除了為主機函式建立 `Module` 實例之外，`Executor` 在實例化後也會輸出一個 `Module` 實例。無論是匿名或具名模組，開發者都有責任透過 `(*wasmedge.Module).Release()` API 來銷毀它們。`Store` 在註冊後會連結到具名 `Module` 實例。當 `Module` 實例被銷毀時，`Store` 會自動取消連結；當 `Store` 被銷毀時，所有連結到此 `Store` 的 `Module` 實例會自動取消連結。

## WasmEdge-Go VM 變更

`VM` API 基本上沒有變更，除了 `ImportObject` 相關的 API。

以下是 WasmEdge-Go `v0.9.2` 中 WASI 初始化的範例：

```go
conf := wasmedge.NewConfigure(wasmedge.WASI)
vm := wasmedge.NewVMWithConfig(conf)

// The following API can retrieve the pre-registration import objects from the VM object.
// This API will return `nil` if the corresponding pre-registration is not set into the configuration.
wasiobj := vm.GetImportObject(wasmedge.WASI)
// Initialize the WASI.
wasiobj.InitWasi(
  os.Args[1:],     // The args
  os.Environ(),    // The envs
  []string{".:."}, // The mapping preopens
)

// ...

vm.Release()
conf.Release()
```

開發者只要將 `ImportObject` 替換為 `Module`，就能變更為使用 WasmEdge-Go `v0.10.0`：

```go
conf := wasmedge.NewConfigure(wasmedge.WASI)
vm := wasmedge.NewVMWithConfig(conf)

// The following API can retrieve the pre-registration module instances from the VM object.
// This API will return `nil` if the corresponding pre-registration is not set into the configuration.
wasiobj := vm.GetImportModule(wasmedge.WASI)
// Initialize the WASI.
wasiobj.InitWasi(
  os.Args[1:],     // The args
  os.Environ(),    // The envs
  []string{".:."}, // The mapping preopens
)

// ...

vm.Release()
conf.Release()
```

`VM` 提供了取得目前已實例化匿名 `Module` 實例的全新 API。舉例來說，如果開發者想取得匯出的 `Global` 實例：

```go
// Assume that a WASM module is instantiated in `vm`, and exports the "global_i32".
store := vm.GetStore()

globinst := store.FindGlobal("global_i32")
```

在 WasmEdge-Go `v0.10.0` 之後，開發者可以使用 `(*wasmedge.VM).GetActiveModule()` 取得模組實例：

```go
// Assume that a WASM module is instantiated in `vm`, and exports the "global_i32".
mod := vm.GetActiveModule()

// The example of retrieving the global instance.
globinst := mod.FindGlobal("global_i32")
```

## WasmEdge Executor 變更

`Executor` 用於協助實例化 WASM 模組、以模組名稱將 WASM 模組註冊到 `Store`、註冊含主機函式的主機模組，或呼叫函式。

1. WASM 模組實例化

   在 WasmEdge-Go `v0.9.2` 版本中，開發者可以透過 `Executor` API 來實例化 WASM 模組：

   ```go
   var ast *wasmedge.AST
   // Assume that `ast` is a loaded WASM from file or buffer and has passed the validation.
   // Assume that `executor` is a `*wasmedge.Executor`.
   // Assume that `store` is a `*wasmedge.Store`.
   err := executor.Instantiate(store, ast)
   if err != nil {
     fmt.Println("Instantiation FAILED:", err.Error())
   }
   ```

   然後 WASM 模組會被實例化為匿名模組實例並由 `Store` 處理。如果透過此 API 實例化新的 WASM 模組，舊的已實例化模組實例會被清除。在 WasmEdge-Go `v0.10.0` 版本之後，已實例化的匿名模組會被輸出並由呼叫者處理，且不再僅限於 1 個匿名模組實例。開發者有責任釋放輸出的模組實例。

   ```go
   var ast1 *wasmedge.AST
   var ast2 *wasmedge.AST
   // Assume that `ast1` and `ast2` are loaded WASMs from different files or buffers,
   // and have both passed the validation.
   // Assume that `executor` is a `*wasmedge.Executor`.
   // Assume that `store` is a `*wasmedge.Store`.
   mod1, err1 := executor.Instantiate(store, ast1)
   if err1 != nil {
     fmt.Println("Instantiation FAILED:", err1.Error())
   }
   mod2, err2 := executor.Instantiate(store, ast2)
   if err2 != nil {
     fmt.Println("Instantiation FAILED:", err2.Error())
   }
   mod1.Release()
   mod2.Release()
   ```

2. 以模組名稱註冊 WASM 模組

   在實例化並以模組名稱註冊 WASM 模組時，開發者可以在 WasmEdge-Go `v0.9.2` 之前使用 `(*wasmedge.Executor).RegisterModule()` API。

   ```go
   var ast *wasmedge.AST
   // Assume that `ast` is a loaded WASM from file or buffer and has passed the validation.
   // Assume that `executor` is a `*wasmedge.Executor`.
   // Assume that `store` is a `*wasmedge.Store`.

   // Register the WASM module into store with the export module name "mod".
   err := executor.RegisterModule(store, ast, "mod")
   if err != nil {
     fmt.Println("WASM registration FAILED:", err.Error())
   }
   ```

   WasmEdge-Go `v0.10.0` 實作了相同功能，但使用不同的 API `(*wasmedge.Executor).Register()`：

   ```go
   var ast *wasmedge.AST
   // Assume that `ast` is a loaded WASM from file or buffer and has passed the validation.
   // Assume that `executor` is a `*wasmedge.Executor`.
   // Assume that `store` is a `*wasmedge.Store`.

   // Register the WASM module into store with the export module name "mod".
   mod, err := executor.Register(store, ast, "mod")
   if err != nil {
     fmt.Println("WASM registration FAILED:", err.Error())
   }
   mod.Release()
   ```

   開發者有責任釋放輸出的模組實例。

3. 主機模組註冊

   在 WasmEdge-Go `v0.9.2` 中，開發者可以建立 `ImportObject` 並註冊到 `Store` 中。

   ```go
   // Create the import object with the export module name.
   impobj := wasmedge.NewImportObject("module")

   // ...
   // Add the host functions, tables, memories, and globals into the import object.

   // The import object has already contained the export module name.
   err := executor.RegisterImport(store, impobj)
   if err != nil {
     fmt.Println("Import object registration FAILED:", err.Error())
   }
   ```

   在 WasmEdge-Go `v0.10.0` 之後，開發者應改為使用 `Module` 實例：

   ```go
   // Create the module instance with the export module name.
   impmod := wasmedge.NewModule("module")

   // ...
   // Add the host functions, tables, memories, and globals into the module instance.

   // The module instance has already contained the export module name.
   err := executor.RegisterImport(store, impmod)
   if err != nil {
     fmt.Println("Module instance registration FAILED:", err.Error())
   }
   ```

   開發者有責任釋放已建立的模組實例。

4. WASM 函式呼叫

   此範例使用從文字格式 [fibonacci.wat](https://raw.githubusercontent.com/WasmEdge/WasmEdge/master/examples/wasm/fibonacci.wat) 轉換而來的 WASM 檔案 `fibonacci.wasm`。在 WasmEdge-Go `v0.9.2` 版本中，開發者可以使用匯出函式名稱來呼叫 WASM 函式：

   ```go
   // Create the store object. The store object holds the instances.
   store := wasmedge.NewStore()
   // Error.
   var err error
   // AST object.
   var ast *wasmedge.AST
   // Return values.
   var res []interface{}

   // Create the loader object.
   loader := wasmedge.NewLoader()
   // Create the validator object.
   validator := wasmedge.NewValidator()
   // Create the executor object.
   executor := wasmedge.NewExecutor()

   // Load the WASM file or the compiled-WASM file and convert into the AST object.
   ast, err = loader.LoadFile("fibonacci.wasm")
   if err != nil {
     fmt.Println("Load WASM from file FAILED:", err.Error())
     return
   }
   // Validate the WASM module.
   err = validator.Validate(ast)
   if err != nil {
     fmt.Println("Validation FAILED:", err.Error())
     return
   }
   // Instantiate the WASM module into the Store object.
   err = executor.Instantiate(store, ast)
   if err != nil {
     fmt.Println("Instantiation FAILED:", err.Error())
     return
   }
   // Invoke the function which is exported with the function name "fib".
   res, err = executor.Invoke(store, "fib", int32(30))
   if err == nil {
     fmt.Println("Get fibonacci[30]:", res[0].(int32))
   } else {
     fmt.Println("Run failed:", err.Error())
   }

   ast.Release()
   loader.Release()
   validator.Release()
   executor.Release()
   store.Release()
   ```

   在 WasmEdge-Go `v0.10.0` 之後，開發者應先依函式名稱擷取 `Function` 實例。

   ```go
   // ...
   // Ignore the unchanged steps before validation. Please refer to the sample code above.

   var mod *wasmedge.Module
   // Instantiate the WASM module and get the output module instance.
   mod, err = executor.Instantiate(store, ast)
   if err != nil {
     fmt.Println("Instantiation FAILED:", err.Error())
     return
   }
   // Retrieve the function instance by name.
   funcinst := mod.FindFunction("fib")
   if funcinst == nil {
     fmt.Println("Run FAILED: Function name `fib` not found")
     return
   }
   res, err = executor.Invoke(store, funcinst, int32(30))
   if err == nil {
     fmt.Println("Get fibonacci[30]:", res[0].(int32))
   } else {
     fmt.Println("Run FAILED:", err.Error())
   }

   ast.Release()
   mod.Release()
   loader.Release()
   validator.Release()
   executor.Release()
   store.Release()
   ```

## 實例擷取

此範例使用從文字格式 [fibonacci.wat](https://raw.githubusercontent.com/WasmEdge/WasmEdge/master/examples/wasm/fibonacci.wat) 轉換而來的 WASM 檔案 `fibonacci.wasm`。

在 WasmEdge-Go `v0.9.2` 之前的版本中，開發者可以從 `Store` 中擷取具名或匿名模組所有匯出的實例：

```go
// Create the store object. The store object holds the instances.
store := wasmedge.NewStore()
// Error.
var err error
// AST object.
var ast *wasmedge.AST

// Create the loader object.
loader := wasmedge.NewLoader()
// Create the validator object.
validator := wasmedge.NewValidator()
// Create the executor object.
executor := wasmedge.NewExecutor()

// Load the WASM file or the compiled-WASM file and convert into the AST object.
ast, err = loader.LoadFile("fibonacci.wasm")
if err != nil {
  fmt.Println("Load WASM from file FAILED:", err.Error())
  return
}
// Validate the WASM module.
err = validator.Validate(ast)
if err != nil {
  fmt.Println("Validation FAILED:", err.Error())
  return
}
// Example: register and instantiate the WASM module with the module name "module_fib".
err = executor.RegisterModule(store, ast, "module_fib")
if err != nil {
  fmt.Println("Instantiation FAILED:", err.Error())
  return
}
// Example: Instantiate the WASM module into the Store object.
err = executor.Instantiate(store, ast)
if err != nil {
  fmt.Println("Instantiation FAILED:", err.Error())
  return
}

// Now, developers can retrieve the exported instances from the store.
// Take the exported functions as example. This WASM exports the function "fib".
// Find the function "fib" from the instantiated anonymous module.
func1 := store.FindFunction("fib")
// Find the function "fib" from the registered module "module_fib".
func2 := store.FindFunctionRegistered("module_fib", "fib")

ast.Release()
store.Release()
loader.Release()
validator.Release()
executor.Release()
```

在 WasmEdge-Go `v0.10.0` 之後，開發者可以實例化多個匿名 `Module` 實例，並應從具名或匿名 `Module` 實例中擷取匯出的實例：

```go
// Create the store object. The store is the object to link the modules for imports and exports.
store := wasmedge.NewStore()
// Error.
var err error
// AST object.
var ast *wasmedge.AST
// Module instances.
var namedmod *wasmedge.Module
var anonymousmod *wasmedge.Module

// Create the loader object.
loader := wasmedge.NewLoader()
// Create the validator object.
validator := wasmedge.NewValidator()
// Create the executor object.
executor := wasmedge.NewExecutor()

// Load the WASM file or the compiled-WASM file and convert into the AST object.
ast, err = loader.LoadFile("fibonacci.wasm")
if err != nil {
  fmt.Println("Load WASM from file FAILED:", err.Error())
  return
}
// Validate the WASM module.
err = validator.Validate(ast)
if err != nil {
  fmt.Println("Validation FAILED:", err.Error())
  return
}
// Example: register and instantiate the WASM module with the module name "module_fib".
namedmod, err = executor.Register(store, ast, "module_fib")
if err != nil {
  fmt.Println("Instantiation FAILED:", err.Error())
  return
}
// Example: Instantiate the WASM module and get the output module instance.
anonymousmod, err = executor.Instantiate(store, ast)
if err != nil {
  fmt.Println("Instantiation FAILED:", err.Error())
  return
}

// Now, developers can retrieve the exported instances from the module instances.
// Take the exported functions as example. This WASM exports the function "fib".
// Find the function "fib" from the instantiated anonymous module.
func1 := anonymousmod.FindFunction("fib")
// Find the function "fib" from the registered module "module_fib".
func2 := namedmod.FindFunction("fib")
// Or developers can get the named module instance from the store:
gotmod := store.FindModule("module_fib")
func3 := gotmod.FindFunction("fib")

namedmod.Release()
anonymousmod.Release()
ast.Release()
store.Release()
loader.Release()
validator.Release()
executor.Release()
```

## 主機函式

主機函式的差異在於替換了 `ImportObject` 結構。

```go
// Host function body definition.
func host_add(data interface{}, mem *wasmedge.Memory, params []interface{}) ([]interface{}, wasmedge.Result) {
  // add: i32, i32 -> i32
  res := params[0].(int32) + params[1].(int32)

  // Set the returns
  returns := make([]interface{}, 1)
  returns[0] = res

  // Return
  return returns, wasmedge.Result_Success
}

// ...

// Create an import object with the module name "module".
impobj := wasmedge.NewImportObject("module")

// Create and add a function instance into the import object with export name "add".
functype := wasmedge.NewFunctionType(
  []wasmedge.ValType{wasmedge.ValType_I32, wasmedge.ValType_I32},
  []wasmedge.ValType{wasmedge.ValType_I32},
)
hostfunc := wasmedge.NewFunction(functype, host_add, nil, 0)
// The third parameter is the pointer to the additional data object.
// Developers should guarantee the life cycle of the data, and it can be `nil`
// if the external data is not needed.
functype.Release()
impobj.AddFunction("add", hostfunc)

// The import object should be released.
// Developers should __NOT__ release the instances added into the import objects.
impobj.Release()
```

開發者可以使用 `Module` 結構輕鬆升級到 WasmEdge `v0.10.0`。

```go
// Host function body definition.
func host_add(data interface{}, mem *wasmedge.Memory, params []interface{}) ([]interface{}, wasmedge.Result) {
  // add: i32, i32 -> i32
  res := params[0].(int32) + params[1].(int32)

  // Set the returns
  returns := make([]interface{}, 1)
  returns[0] = res

  // Return
  return returns, wasmedge.Result_Success
}

// ...

// Create a module instance with the module name "module".
mod := wasmedge.NewModule("module")

// Create and add a function instance into the module instance with export name "add".
functype := wasmedge.NewFunctionType(
  []wasmedge.ValType{wasmedge.ValType_I32, wasmedge.ValType_I32},
  []wasmedge.ValType{wasmedge.ValType_I32},
)
hostfunc := wasmedge.NewFunction(functype, host_add, nil, 0)
// The third parameter is the pointer to the additional data object.
// Developers should guarantee the life cycle of the data, and it can be `nil`
// if the external data is not needed.
functype.Release()
mod.AddFunction("add", hostfunc)

// The module instances should be released.
// Developers should __NOT__ release the instances added into the module instance objects.
mod.Release()
```
