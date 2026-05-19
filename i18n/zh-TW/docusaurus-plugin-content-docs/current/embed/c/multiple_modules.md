---
sidebar_position: 5
---

# 多個 WASM 模組範例

對於那些匯出函式的 WASM 模組,其他 WASM 模組可以將它們作為函式庫匯入。

這會造成在執行時需連結多個模組以滿足相依性的情況。

本章將介紹在 WasmEdge 中連結並執行多個 WASM 模組的範例。

## 範例 WASM 檔案

### 函式庫 WASM

假設有一個 WASM 匯出了它的函式:

```wasm
(module
  (func (export "add") (param i32 i32) (result i32)
    ;; Function to add 2 numbers and exported as "add".
    (i32.add (local.get 0) (local.get 1))
  )
  (func (export "mul") (param i32 i32) (result i32)
    ;; Function to mul 2 number and exported as "mul".
    (i32.mul (local.get 0) (local.get 1))
  )
)
```

使用者可以透過 [wat2wasm](https://webassembly.github.io/wabt/demo/wat2wasm/) 線上工具將 `wat` 轉換為 `wasm`。假設這個 `wat` 已被轉換成 WASM 二進位格式並儲存為 `lib.wasm`。

### 進入點 WASM

假設有一個 WASM 從 `lib.wasm` 匯入某些函式,並匯出可被呼叫的函式:

```wasm
(module
  (type $type0 (func (param i32 i32)(result i32)))
  ;; Import the "add" function which calculate "a + b".
  (import "math" "add" (func $math-add (type $type0)))
  ;; Import the "mul" function which calculate "a * b".
  (import "math" "mul" (func $math-mul (type $type0)))
  (func (export "add_and_square") (param i32 i32) (result i32)
    ;; Function to add 2 numbers and square it ((a + b)^2).
    ;; Exported as "add_and_square".
    (call $math-mul
      (call $math-add (local.get 0) (local.get 1))
      (call $math-add (local.get 0) (local.get 1))
    )
  )
  (func (export "sum_of_squares") (param i32 i32) (result i32)
    ;; Function to calculate the sum of squares (a^2 + b^2).
    ;; Exported as "sum_of_squares".
    (call $math-add
      (call $math-mul (local.get 0) (local.get 0))
      (call $math-mul (local.get 1) (local.get 1))
    )
  )
)
```

使用者可以透過 [wat2wasm](https://webassembly.github.io/wabt/demo/wat2wasm/) 線上工具將 `wat` 轉換為 `wasm`。假設這個 `wat` 已被轉換成 WASM 二進位格式並儲存為 `test.wasm`。

### 前置需求

要執行這些範例,開發者應該[安裝 WasmEdge](../../start/install.md#install)。

為了提升執行 WASM 的效能,開發者也可以使用 [AOT 編譯器](../../start/build-and-run/aot.md)來編譯上述 WASM 檔案。

## 透過 VM 上下文連結 WASM 模組

透過 `WasmEdge_VMContext`,開發者可以快速地實例化並執行 WASM。至少有四種方法可以透過 VM 上下文連結多個 WASM 模組。以下程式碼範例中,假設 C 程式碼儲存為 `example.c`。

1. 直接從檔案註冊並實例化 `lib.wasm`。

   ```c
   #include <stdio.h>
   #include <wasmedge/wasmedge.h>

   int main() {
     /* The result. */
     WasmEdge_Result Res;

     /* The params and returns. */
     WasmEdge_Value Params[2], Returns[1];

     /* Create the VM context. */
     WasmEdge_VMContext *VMCxt = WasmEdge_VMCreate(NULL, NULL);

     /* Register the `lib.wasm` from file with the module name "math". */
     WasmEdge_String ModuleName = WasmEdge_StringCreateByCString("math");
     Res = WasmEdge_VMRegisterModuleFromFile(VMCxt, ModuleName, "lib.wasm");
     WasmEdge_StringDelete(ModuleName);
     if (!WasmEdge_ResultOK(Res)) {
       WasmEdge_VMDelete(VMCxt);
       printf("Register lib.wasm error: %s\n", WasmEdge_ResultGetMessage(Res));
       return -1;
     }

     /* Instantiate the `test.wasm`. */
     /*
      * Developers can use the APIs such as `WasmEdge_VMRunWasmFromFile` to
      * instantiate and execute quickly.
      */
     Res = WasmEdge_VMLoadWasmFromFile(VMCxt, "test.wasm");
     if (!WasmEdge_ResultOK(Res)) {
       WasmEdge_VMDelete(VMCxt);
       printf("Load test.wasm error: %s\n", WasmEdge_ResultGetMessage(Res));
       return -1;
     }
     Res = WasmEdge_VMValidate(VMCxt);
     if (!WasmEdge_ResultOK(Res)) {
       WasmEdge_VMDelete(VMCxt);
       printf("Validate test.wasm error: %s\n",
              WasmEdge_ResultGetMessage(Res));
       return -1;
     }
     Res = WasmEdge_VMInstantiate(VMCxt);
     if (!WasmEdge_ResultOK(Res)) {
       WasmEdge_VMDelete(VMCxt);
       printf("Instantiate test.wasm error: %s\n",
              WasmEdge_ResultGetMessage(Res));
       return -1;
     }

     /* Invoke the functions. */
     /* Invoke the "add_and_square" to calculate (123 + 456)^2 */
     WasmEdge_String FuncName =
         WasmEdge_StringCreateByCString("add_and_square");
     Params[0] = WasmEdge_ValueGenI32(123);
     Params[1] = WasmEdge_ValueGenI32(456);
     Res = WasmEdge_VMExecute(VMCxt, FuncName, Params, 2, Returns, 1);
     WasmEdge_StringDelete(FuncName);
     if (WasmEdge_ResultOK(Res)) {
       printf("Get the '(%d + %d)^2' result: %d\n", 123, 456,
              WasmEdge_ValueGetI32(Returns[0]));
     } else {
       printf("Execute 'add_and_square' error: %s\n",
              WasmEdge_ResultGetMessage(Res));
     }
     /* Invoke the "sum_of_squares" to calculate (77^2 + 88^2) */
     FuncName = WasmEdge_StringCreateByCString("sum_of_squares");
     Params[0] = WasmEdge_ValueGenI32(77);
     Params[1] = WasmEdge_ValueGenI32(88);
     Res = WasmEdge_VMExecute(VMCxt, FuncName, Params, 2, Returns, 1);
     WasmEdge_StringDelete(FuncName);
     if (WasmEdge_ResultOK(Res)) {
       printf("Get the '%d^2 + %d^2' result: %d\n", 77, 88,
              WasmEdge_ValueGetI32(Returns[0]));
     } else {
       printf("Execute 'sum_of_squares' error: %s\n",
              WasmEdge_ResultGetMessage(Res));
     }

     /* Resources deallocations. */
     WasmEdge_VMDelete(VMCxt);
     return 0;
   }
   ```

   接著編譯並執行:

   ```bash
   $ gcc test.c -lwasmedge
   $ ./a.out
   Get the '(123 + 456)^2' result: 335241
   Get the '77^2 + 88^2' result: 13673
   ```

2. 從緩衝區註冊並實例化 `lib.wasm`。

   ```c
   #include <stdio.h>
   #include <wasmedge/wasmedge.h>

   int main() {
     /* The result. */
     WasmEdge_Result Res;

     /* The params and returns. */
     WasmEdge_Value Params[2], Returns[1];

     /* The `lib.wasm` buffer example. */
     /* Developers can also load the buffer from file. */
     uint8_t WASM[] = {/* WASM header */
                       0x00, 0x61, 0x73, 0x6D, 0x01, 0x00, 0x00, 0x00,
                       /* Type section */
                       0x01, 0x07, 0x01,
                       /* function type {i32, i32} -> {i32} */
                       0x60, 0x02, 0x7F, 0x7F, 0x01, 0x7F,
                       /* Function section */
                       0x03, 0x03, 0x02, 0x00, 0x00,
                       /* Export section */
                       0x07, 0x0D, 0x02,
                       /* export function: "add" */
                       0x03, 0x61, 0x64, 0x64, 0x00, 0x00,
                       /* export function: "mul" */
                       0x03, 0x6D, 0x75, 0x6C, 0x00, 0x01,
                       /* Code section */
                       0x0A, 0x11, 0x02,
                       /* "add" code body */
                       0x07, 0x00, 0x20, 0x00, 0x20, 0x01, 0x6A, 0x0B,
                       /* "mul" code body */
                       0x07, 0x00, 0x20, 0x00, 0x20, 0x01, 0x6C, 0x0B};

     /* Create the VM context. */
     WasmEdge_VMContext *VMCxt = WasmEdge_VMCreate(NULL, NULL);

     /* Register the `lib.wasm` from the buffer with the module name "math". */
     WasmEdge_String ModuleName = WasmEdge_StringCreateByCString("math");
     Res = WasmEdge_VMRegisterModuleFromBuffer(VMCxt, ModuleName, WASM,
                                               sizeof(WASM));
     WasmEdge_StringDelete(ModuleName);
     if (!WasmEdge_ResultOK(Res)) {
       WasmEdge_VMDelete(VMCxt);
       printf("Register lib.wasm error: %s\n", WasmEdge_ResultGetMessage(Res));
       return -1;
     }

     /* Instantiate the `test.wasm`. */
     /*
      * Developers can use the APIs such as `WasmEdge_VMRunWasmFromFile` to
      * instantiate and execute quickly.
      */
     Res = WasmEdge_VMLoadWasmFromFile(VMCxt, "test.wasm");
     if (!WasmEdge_ResultOK(Res)) {
       WasmEdge_VMDelete(VMCxt);
       printf("Load test.wasm error: %s\n", WasmEdge_ResultGetMessage(Res));
       return -1;
     }
     Res = WasmEdge_VMValidate(VMCxt);
     if (!WasmEdge_ResultOK(Res)) {
       WasmEdge_VMDelete(VMCxt);
       printf("Validate test.wasm error: %s\n",
              WasmEdge_ResultGetMessage(Res));
       return -1;
     }
     Res = WasmEdge_VMInstantiate(VMCxt);
     if (!WasmEdge_ResultOK(Res)) {
       WasmEdge_VMDelete(VMCxt);
       printf("Instantiate test.wasm error: %s\n",
              WasmEdge_ResultGetMessage(Res));
       return -1;
     }

     /* Invoke the functions. */
     /* Invoke the "add_and_square" to calculate (123 + 456)^2 */
     WasmEdge_String FuncName =
         WasmEdge_StringCreateByCString("add_and_square");
     Params[0] = WasmEdge_ValueGenI32(123);
     Params[1] = WasmEdge_ValueGenI32(456);
     Res = WasmEdge_VMExecute(VMCxt, FuncName, Params, 2, Returns, 1);
     WasmEdge_StringDelete(FuncName);
     if (WasmEdge_ResultOK(Res)) {
       printf("Get the '(%d + %d)^2' result: %d\n", 123, 456,
              WasmEdge_ValueGetI32(Returns[0]));
     } else {
       printf("Execute 'add_and_square' error: %s\n",
              WasmEdge_ResultGetMessage(Res));
     }
     /* Invoke the "sum_of_squares" to calculate (77^2 + 88^2) */
     FuncName = WasmEdge_StringCreateByCString("sum_of_squares");
     Params[0] = WasmEdge_ValueGenI32(77);
     Params[1] = WasmEdge_ValueGenI32(88);
     Res = WasmEdge_VMExecute(VMCxt, FuncName, Params, 2, Returns, 1);
     WasmEdge_StringDelete(FuncName);
     if (WasmEdge_ResultOK(Res)) {
       printf("Get the '%d^2 + %d^2' result: %d\n", 77, 88,
              WasmEdge_ValueGetI32(Returns[0]));
     } else {
       printf("Execute 'sum_of_squares' error: %s\n",
              WasmEdge_ResultGetMessage(Res));
     }

     /* Resources deallocations. */
     WasmEdge_VMDelete(VMCxt);
     return 0;
   }
   ```

   接著編譯並執行:

   ```bash
   $ gcc test.c -lwasmedge
   $ ./a.out
   Get the '(123 + 456)^2' result: 335241
   Get the '77^2 + 88^2' result: 13673
   ```

3. 先將 `lib.wasm` 載入至 AST 上下文

   ```c
   #include <stdio.h>
   #include <wasmedge/wasmedge.h>

   int main() {
     /* The result. */
     WasmEdge_Result Res;

     /* The params and returns. */
     WasmEdge_Value Params[2], Returns[1];

     /* Assume that the `lib.wasm` has loaded first. */
     WasmEdge_LoaderContext *LoadCxt = WasmEdge_LoaderCreate(NULL);
     WasmEdge_ASTModuleContext *LibASTCxt = NULL;
     Res = WasmEdge_LoaderParseFromFile(LoadCxt, &LibASTCxt, "lib.wasm");
     WasmEdge_LoaderDelete(LoadCxt);
     if (!WasmEdge_ResultOK(Res)) {
       printf("Load lib.wasm error: %s\n", WasmEdge_ResultGetMessage(Res));
       return -1;
     }

     /* Create the VM context. */
     WasmEdge_VMContext *VMCxt = WasmEdge_VMCreate(NULL, NULL);

     /* Register the loaded AST context with the module name "math". */
     WasmEdge_String ModuleName = WasmEdge_StringCreateByCString("math");
     Res =
         WasmEdge_VMRegisterModuleFromASTModule(VMCxt, ModuleName, LibASTCxt);
     WasmEdge_StringDelete(ModuleName);
     WasmEdge_ASTModuleDelete(LibASTCxt);
     if (!WasmEdge_ResultOK(Res)) {
       WasmEdge_VMDelete(VMCxt);
       printf("Register lib.wasm error: %s\n", WasmEdge_ResultGetMessage(Res));
       return -1;
     }

     /* Instantiate the `test.wasm`. */
     /*
      * Developers can use the APIs such as `WasmEdge_VMRunWasmFromFile` to
      * instantiate and execute quickly.
      */
     Res = WasmEdge_VMLoadWasmFromFile(VMCxt, "test.wasm");
     if (!WasmEdge_ResultOK(Res)) {
       WasmEdge_VMDelete(VMCxt);
       printf("Load test.wasm error: %s\n", WasmEdge_ResultGetMessage(Res));
       return -1;
     }
     Res = WasmEdge_VMValidate(VMCxt);
     if (!WasmEdge_ResultOK(Res)) {
       WasmEdge_VMDelete(VMCxt);
       printf("Validate test.wasm error: %s\n",
              WasmEdge_ResultGetMessage(Res));
       return -1;
     }
     Res = WasmEdge_VMInstantiate(VMCxt);
     if (!WasmEdge_ResultOK(Res)) {
       WasmEdge_VMDelete(VMCxt);
       printf("Instantiate test.wasm error: %s\n",
              WasmEdge_ResultGetMessage(Res));
       return -1;
     }

     /* Invoke the functions. */
     /* Invoke the "add_and_square" to calculate (123 + 456)^2 */
     WasmEdge_String FuncName =
         WasmEdge_StringCreateByCString("add_and_square");
     Params[0] = WasmEdge_ValueGenI32(123);
     Params[1] = WasmEdge_ValueGenI32(456);
     Res = WasmEdge_VMExecute(VMCxt, FuncName, Params, 2, Returns, 1);
     WasmEdge_StringDelete(FuncName);
     if (WasmEdge_ResultOK(Res)) {
       printf("Get the '(%d + %d)^2' result: %d\n", 123, 456,
              WasmEdge_ValueGetI32(Returns[0]));
     } else {
       printf("Execute 'add_and_square' error: %s\n",
              WasmEdge_ResultGetMessage(Res));
     }
     /* Invoke the "sum_of_squares" to calculate (77^2 + 88^2) */
     FuncName = WasmEdge_StringCreateByCString("sum_of_squares");
     Params[0] = WasmEdge_ValueGenI32(77);
     Params[1] = WasmEdge_ValueGenI32(88);
     Res = WasmEdge_VMExecute(VMCxt, FuncName, Params, 2, Returns, 1);
     WasmEdge_StringDelete(FuncName);
     if (WasmEdge_ResultOK(Res)) {
       printf("Get the '%d^2 + %d^2' result: %d\n", 77, 88,
              WasmEdge_ValueGetI32(Returns[0]));
     } else {
       printf("Execute 'sum_of_squares' error: %s\n",
              WasmEdge_ResultGetMessage(Res));
     }

     /* Resources deallocations. */
     WasmEdge_VMDelete(VMCxt);
     return 0;
   }
   ```

   接著編譯並執行:

   ```bash
   $ gcc test.c -lwasmedge
   $ ./a.out
   Get the '(123 + 456)^2' result: 335241
   Get the '77^2 + 88^2' result: 13673
   ```

4. 先實例化 `lib.wasm`

   ```c
   #include <stdio.h>
   #include <wasmedge/wasmedge.h>

   int main() {
     /* The result. */
     WasmEdge_Result Res;

     /* The params and returns. */
     WasmEdge_Value Params[2], Returns[1];

     /* Create the VM context. */
     WasmEdge_VMContext *VMCxt = WasmEdge_VMCreate(NULL, NULL);

     /* Assume that the `lib.wasm` has instantiated first. */
     WasmEdge_LoaderContext *LoadCxt = WasmEdge_LoaderCreate(NULL);
     WasmEdge_ValidatorContext *ValidCxt = WasmEdge_ValidatorCreate(NULL);
     WasmEdge_ExecutorContext *ExecCxt = WasmEdge_ExecutorCreate(NULL, NULL);
     WasmEdge_StoreContext *StoreCxt = WasmEdge_StoreCreate();
     WasmEdge_ASTModuleContext *LibASTCxt = NULL;
     WasmEdge_ModuleInstanceContext *LibInstCxt = NULL;
     Res = WasmEdge_LoaderParseFromFile(LoadCxt, &LibASTCxt, "lib.wasm");
     WasmEdge_LoaderDelete(LoadCxt);
     if (!WasmEdge_ResultOK(Res)) {
       printf("Load lib.wasm error: %s\n", WasmEdge_ResultGetMessage(Res));
       return -1;
     }
     Res = WasmEdge_ValidatorValidate(ValidCxt, LibASTCxt);
     WasmEdge_ValidatorDelete(ValidCxt);
     if (!WasmEdge_ResultOK(Res)) {
       WasmEdge_ASTModuleDelete(LibASTCxt);
       printf("Validate lib.wasm error: %s\n", WasmEdge_ResultGetMessage(Res));
       return -1;
     }
     /*
      * The module name is determined when instantiation.
      * If use the `WasmEdge_ExecutorInstantiate` API, the module name will be
      * "".
      */
     WasmEdge_String ModuleName = WasmEdge_StringCreateByCString("math");
     Res = WasmEdge_ExecutorRegister(ExecCxt, &LibInstCxt, StoreCxt, LibASTCxt,
                                     ModuleName);
     WasmEdge_ExecutorDelete(ExecCxt);
     WasmEdge_ASTModuleDelete(LibASTCxt);
     WasmEdge_StringDelete(ModuleName);
     WasmEdge_StoreDelete(StoreCxt);
     if (!WasmEdge_ResultOK(Res)) {
       printf("Instantiate lib.wasm error: %s\n",
              WasmEdge_ResultGetMessage(Res));
       return -1;
     }

     /* Register the module instance with the module name "math". */
     /* The module name has been determined when instantiating the `lib.wasm`. */
     Res = WasmEdge_VMRegisterModuleFromImport(VMCxt, LibInstCxt);
     if (!WasmEdge_ResultOK(Res)) {
       WasmEdge_VMDelete(VMCxt);
       WasmEdge_ModuleInstanceDelete(LibInstCxt);
       printf("Register lib.wasm error: %s\n", WasmEdge_ResultGetMessage(Res));
       return -1;
     }

     /* Instantiate the `test.wasm`. */
     /*
      * Developers can use the APIs such as `WasmEdge_VMRunWasmFromFile` to
      * instantiate and execute quickly.
      */
     Res = WasmEdge_VMLoadWasmFromFile(VMCxt, "test.wasm");
     if (!WasmEdge_ResultOK(Res)) {
       WasmEdge_VMDelete(VMCxt);
       WasmEdge_ModuleInstanceDelete(LibInstCxt);
       printf("Load test.wasm error: %s\n", WasmEdge_ResultGetMessage(Res));
       return -1;
     }
     Res = WasmEdge_VMValidate(VMCxt);
     if (!WasmEdge_ResultOK(Res)) {
       WasmEdge_VMDelete(VMCxt);
       WasmEdge_ModuleInstanceDelete(LibInstCxt);
       printf("Validate test.wasm error: %s\n",
              WasmEdge_ResultGetMessage(Res));
       return -1;
     }
     Res = WasmEdge_VMInstantiate(VMCxt);
     if (!WasmEdge_ResultOK(Res)) {
       WasmEdge_VMDelete(VMCxt);
       WasmEdge_ModuleInstanceDelete(LibInstCxt);
       printf("Instantiate test.wasm error: %s\n",
              WasmEdge_ResultGetMessage(Res));
       return -1;
     }

     /* Invoke the functions. */
     /* Invoke the "add_and_square" to calculate (123 + 456)^2 */
     WasmEdge_String FuncName =
         WasmEdge_StringCreateByCString("add_and_square");
     Params[0] = WasmEdge_ValueGenI32(123);
     Params[1] = WasmEdge_ValueGenI32(456);
     Res = WasmEdge_VMExecute(VMCxt, FuncName, Params, 2, Returns, 1);
     WasmEdge_StringDelete(FuncName);
     if (WasmEdge_ResultOK(Res)) {
       printf("Get the '(%d + %d)^2' result: %d\n", 123, 456,
              WasmEdge_ValueGetI32(Returns[0]));
     } else {
       printf("Execute 'add_and_square' error: %s\n",
              WasmEdge_ResultGetMessage(Res));
     }
     /* Invoke the "sum_of_squares" to calculate (77^2 + 88^2) */
     FuncName = WasmEdge_StringCreateByCString("sum_of_squares");
     Params[0] = WasmEdge_ValueGenI32(77);
     Params[1] = WasmEdge_ValueGenI32(88);
     Res = WasmEdge_VMExecute(VMCxt, FuncName, Params, 2, Returns, 1);
     WasmEdge_StringDelete(FuncName);
     if (WasmEdge_ResultOK(Res)) {
       printf("Get the '%d^2 + %d^2' result: %d\n", 77, 88,
              WasmEdge_ValueGetI32(Returns[0]));
     } else {
       printf("Execute 'sum_of_squares' error: %s\n",
              WasmEdge_ResultGetMessage(Res));
     }

     /* Resources deallocations. */
     WasmEdge_VMDelete(VMCxt);
     /* The imported module instance should be destroyed. */
     WasmEdge_ModuleInstanceDelete(LibInstCxt);
     return 0;
   }
   ```

   接著編譯並執行:

   ```bash
   $ gcc test.c -lwasmedge
   $ ./a.out
   Get the '(123 + 456)^2' result: 335241
   Get the '77^2 + 88^2' result: 13673
   ```

## 透過執行器上下文連結 WASM 模組

要連結多個 WASM 模組,開發者應先依照模組相依性的順序實例化它們。

```c
#include <stdio.h>
#include <wasmedge/wasmedge.h>

int main() {
  /* The result. */
  WasmEdge_Result Res;

  /* The params and returns. */
  WasmEdge_Value Params[2], Returns[1];

  /* Create the contexts. */
  WasmEdge_LoaderContext *LoadCxt = WasmEdge_LoaderCreate(NULL);
  WasmEdge_ValidatorContext *ValidCxt = WasmEdge_ValidatorCreate(NULL);
  WasmEdge_ExecutorContext *ExecCxt = WasmEdge_ExecutorCreate(NULL, NULL);
  WasmEdge_StoreContext *StoreCxt = WasmEdge_StoreCreate();

  /* Load and register the `lib.wasm` with the module name "math". */
  WasmEdge_ASTModuleContext *LibASTCxt = NULL;
  WasmEdge_ModuleInstanceContext *LibInstCxt = NULL;
  Res = WasmEdge_LoaderParseFromFile(LoadCxt, &LibASTCxt, "lib.wasm");
  if (!WasmEdge_ResultOK(Res)) {
    printf("Load lib.wasm error: %s\n", WasmEdge_ResultGetMessage(Res));
    return -1;
  }
  Res = WasmEdge_ValidatorValidate(ValidCxt, LibASTCxt);
  if (!WasmEdge_ResultOK(Res)) {
    printf("Validate lib.wasm error: %s\n", WasmEdge_ResultGetMessage(Res));
    return -1;
  }
  WasmEdge_String ModuleName = WasmEdge_StringCreateByCString("math");
  Res = WasmEdge_ExecutorRegister(ExecCxt, &LibInstCxt, StoreCxt, LibASTCxt,
                                  ModuleName);
  WasmEdge_StringDelete(ModuleName);
  WasmEdge_ASTModuleDelete(LibASTCxt);
  if (!WasmEdge_ResultOK(Res)) {
    printf("Instantiate lib.wasm error: %s\n", WasmEdge_ResultGetMessage(Res));
    return -1;
  }

  /* Load and instantiate the `test.wasm`. */
  WasmEdge_ASTModuleContext *TestASTCxt = NULL;
  WasmEdge_ModuleInstanceContext *TestInstCxt = NULL;
  Res = WasmEdge_LoaderParseFromFile(LoadCxt, &TestASTCxt, "test.wasm");
  if (!WasmEdge_ResultOK(Res)) {
    printf("Load test.wasm error: %s\n", WasmEdge_ResultGetMessage(Res));
    return -1;
  }
  Res = WasmEdge_ValidatorValidate(ValidCxt, TestASTCxt);
  if (!WasmEdge_ResultOK(Res)) {
    printf("Validate test.wasm error: %s\n", WasmEdge_ResultGetMessage(Res));
    return -1;
  }
  Res =
      WasmEdge_ExecutorInstantiate(ExecCxt, &TestInstCxt, StoreCxt, TestASTCxt);
  WasmEdge_ASTModuleDelete(TestASTCxt);
  if (!WasmEdge_ResultOK(Res)) {
    printf("Instantiate test.wasm error: %s\n", WasmEdge_ResultGetMessage(Res));
    return -1;
  }

  /* Invoke the functions. */
  /* Invoke the "add_and_square" to calculate (123 + 456)^2 */
  WasmEdge_String FuncName = WasmEdge_StringCreateByCString("add_and_square");
  WasmEdge_FunctionInstanceContext *FuncCxt =
      WasmEdge_ModuleInstanceFindFunction(TestInstCxt, FuncName);
  WasmEdge_StringDelete(FuncName);
  if (FuncCxt == NULL) {
    printf("Function 'add_and_square' not found.\n");
    return -1;
  }
  Params[0] = WasmEdge_ValueGenI32(123);
  Params[1] = WasmEdge_ValueGenI32(456);
  Res = WasmEdge_ExecutorInvoke(ExecCxt, FuncCxt, Params, 2, Returns, 1);
  if (WasmEdge_ResultOK(Res)) {
    printf("Get the '(%d + %d)^2' result: %d\n", 123, 456,
           WasmEdge_ValueGetI32(Returns[0]));
  } else {
    printf("Execute 'add_and_square' error: %s\n",
           WasmEdge_ResultGetMessage(Res));
  }
  /* Invoke the "sum_of_squares" to calculate (77^2 + 88^2) */
  FuncName = WasmEdge_StringCreateByCString("sum_of_squares");
  FuncCxt = WasmEdge_ModuleInstanceFindFunction(TestInstCxt, FuncName);
  WasmEdge_StringDelete(FuncName);
  if (FuncCxt == NULL) {
    printf("Function 'sum_of_squares' not found.\n");
    return -1;
  }
  Params[0] = WasmEdge_ValueGenI32(77);
  Params[1] = WasmEdge_ValueGenI32(88);
  Res = WasmEdge_ExecutorInvoke(ExecCxt, FuncCxt, Params, 2, Returns, 1);
  if (WasmEdge_ResultOK(Res)) {
    printf("Get the '%d^2 + %d^2' result: %d\n", 77, 88,
           WasmEdge_ValueGetI32(Returns[0]));
  } else {
    printf("Execute 'sum_of_squares' error: %s\n",
           WasmEdge_ResultGetMessage(Res));
  }

  /* Resources deallocations. */
  WasmEdge_LoaderDelete(LoadCxt);
  WasmEdge_ValidatorDelete(ValidCxt);
  WasmEdge_ExecutorDelete(ExecCxt);
  WasmEdge_StoreDelete(StoreCxt);
  WasmEdge_ModuleInstanceDelete(LibInstCxt);
  WasmEdge_ModuleInstanceDelete(TestInstCxt);
  return 0;
}
```

接著編譯並執行:

```bash
$ gcc test.c -lwasmedge
$ ./a.out
Get the '(123 + 456)^2' result: 335241
Get the '77^2 + 88^2' result: 13673
```
