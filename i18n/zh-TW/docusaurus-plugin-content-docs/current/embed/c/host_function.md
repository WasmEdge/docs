---
sidebar_position: 3
---

# 主機函式

[主機函式](https://webassembly.github.io/spec/core/exec/runtime.html#syntax-hostfunc)是 WebAssembly 之外的函式,並作為匯入傳入 WASM 模組。下列步驟示範如何實作主機函式並將 `host module` 註冊到 WasmEdge 執行環境中。

## 主機實例

WasmEdge 支援將 `host function`、`memory`、`table` 與 `global` 實例註冊為匯入。

### 函式

WasmEdge 中的主機函式內容定義如下:

```c
typedef WasmEdge_Result (*WasmEdge_HostFunc_t)(
    void *Data, const WasmEdge_CallingFrameContext *CallFrameCxt,
    const WasmEdge_Value *Params, WasmEdge_Value *Returns);
```

一個簡單的主機函式可定義如下:

```c
#include <wasmedge/wasmedge.h>

/* This function can add 2 i32 values and return the result. */
WasmEdge_Result Add(void *, const WasmEdge_CallingFrameContext *,
                    const WasmEdge_Value *In, WasmEdge_Value *Out) {
  /*
  * Params: {i32, i32}
  * Returns: {i32}
  */

  /* Retrieve the value 1. */
  int32_t Val1 = WasmEdge_ValueGetI32(In[0]);
  /* Retrieve the value 2. */
  int32_t Val2 = WasmEdge_ValueGetI32(In[1]);
  /* Output value 1 is Val1 + Val2. */
  Out[0] = WasmEdge_ValueGenI32(Val1 + Val2);
  /* Return the status of success. */
  return WasmEdge_Result_Success;
}
```

要把主機函式加入主機模組實例中,開發者應先以函式型別上下文建立函式實例。

```c
WasmEdge_ValType ParamList[2] = {WasmEdge_ValTypeGenI32(), WasmEdge_ValTypeGenI32()};
WasmEdge_ValType ReturnList[1] = {WasmEdge_ValTypeGenI32()};
/* Create a function type: {i32, i32} -> {i32}. */
WasmEdge_FunctionTypeContext *HostFType =
    WasmEdge_FunctionTypeCreate(ParamList, 2, ReturnList, 1);
/*
  * Create a function context with the function type and host function body.
  * The `Cost` parameter can be 0 if developers do not need the cost
  * measuring.
  */
WasmEdge_FunctionInstanceContext *HostFunc =
    WasmEdge_FunctionInstanceCreate(HostFType, Add, NULL, 0);
/*
  * The third parameter is the pointer to the additional data.
  * Developers should guarantee the life cycle of the data, and it can be NULL if the external data is not needed.
  */
WasmEdge_FunctionTypeDelete(HostType);
```

### 表格、記憶體與全域

要建立 `host table`、`memory` 與 `global` 實例,開發者可使用類似的 API。

```c
/* Create a host table exported as "table". */
WasmEdge_LimitContext *TabLimit = WasmEdge_LimitCreateWithMax(10, 20, false, false);
WasmEdge_TableTypeContext *HostTType =
    WasmEdge_TableTypeCreate(WasmEdge_ValTypeGenFuncRef(), TabLimit);
WasmEdge_LimitDelete(TabLimit);
WasmEdge_TableInstanceContext *HostTable =
    WasmEdge_TableInstanceCreate(HostTType);
WasmEdge_TableTypeDelete(HostTType);

/* Create a host memory exported as "memory". */
WasmEdge_LimitContext *MemLimit = WasmEdge_LimitCreateWithMax(1, 2, false, false);
WasmEdge_MemoryTypeContext *HostMType = WasmEdge_MemoryTypeCreate(MemLimit);
WasmEdge_LimitDelete(MemLimit);
WasmEdge_MemoryInstanceContext *HostMemory =
    WasmEdge_MemoryInstanceCreate(HostMType);
WasmEdge_MemoryTypeDelete(HostMType);

/* Create a host global exported as "global_i32" and initialized as `666`. */
WasmEdge_GlobalTypeContext *HostGType =
    WasmEdge_GlobalTypeCreate(WasmEdge_ValTypeGenI32(), WasmEdge_Mutability_Const);
WasmEdge_GlobalInstanceContext *HostGlobal =
    WasmEdge_GlobalInstanceCreate(HostGType, WasmEdge_ValueGenI32(666));
WasmEdge_GlobalTypeDelete(HostGType);
```

## 主機模組

主機模組是一種包含 `host functions`、`tables`、`memories` 與 `globals` 的模組實例,就跟 WASM 模組一樣。開發者可以透過 API 將這些實例加入主機模組。在將主機模組註冊到 `VM` 或 `Store` 上下文後,該模組中所匯出的實例,即可在 WASM 模組實例化時被其匯入。

### 建立模組實例

模組實例會提供匯出的模組名稱。

```c
WasmEdge_String HostName = WasmEdge_StringCreateByCString("test");
WasmEdge_ModuleInstanceContext *HostMod =
    WasmEdge_ModuleInstanceCreate(HostName);
WasmEdge_StringDelete(HostName);
```

### 加入實例

開發者可以將 `host functions`、`tables`、`memories` 與 `globals` 連同匯出名稱一起加入模組實例。加入到模組後,實例的擁有權會移轉給模組。開發者**不應該**再存取或銷毀它們。

```c
/* Add the host function created above with the export name "add". */
HostName = WasmEdge_StringCreateByCString("add");
WasmEdge_ModuleInstanceAddFunction(HostMod, HostName, HostFunc);
WasmEdge_StringDelete(HostName);

/* Add the table created above with the export name "table". */
HostName = WasmEdge_StringCreateByCString("table");
WasmEdge_ModuleInstanceAddTable(HostMod, HostName, HostTable);
WasmEdge_StringDelete(HostName);

/* Add the memory created above with the export name "memory". */
HostName = WasmEdge_StringCreateByCString("memory");
WasmEdge_ModuleInstanceAddMemory(HostMod, HostName, HostMemory);
WasmEdge_StringDelete(HostName);

/* Add the global created above with the export name "global_i32". */
HostName = WasmEdge_StringCreateByCString("global_i32");
WasmEdge_ModuleInstanceAddGlobal(HostMod, HostName, HostGlobal);
WasmEdge_StringDelete(HostName);
```

### 將主機模組註冊到 WasmEdge

要在 WASM 中匯入主機函式,開發者可以將主機模組註冊到 `VM` 或 `Store` 上下文中。

```c
WasmEdge_StoreContext *StoreCxt = WasmEdge_StoreCreate();
WasmEdge_ExecutorContext *ExecCxt = WasmEdge_ExecutorCreate(NULL, NULL);

/* Register the module instance into the store. */
WasmEdge_Result Res =
    WasmEdge_ExecutorRegisterImport(ExecCxt, StoreCxt, HostModCxt);
if (!WasmEdge_ResultOK(Res)) {
  printf("Host module registration failed: %s\n",
         WasmEdge_ResultGetMessage(Res));
  return -1;
}
/*
 * Developers can register the host module into a VM context by the
 * `WasmEdge_VMRegisterModuleFromImport()` API.
 */
/*
 * The owner of the host module will not be changed. Developers can register
 * the host module into several VMs or stores.
 */

/* Although being registered, the host module should be destroyed. */
WasmEdge_StoreDelete(StoreCxt);
WasmEdge_ExecutorDelete(ExecCxt);
WasmEdge_ModuleInstanceDelete(HostModCxt);
```

## 主機函式內容實作要訣

以下是實作主機函式的一些要訣。

### Calling Frame 上下文

`WasmEdge_CallingFrameContext` 是一個讓開發者存取[呼叫堆疊頂端框架](https://webassembly.github.io/spec/core/exec/runtime.html#activations-and-frames)中模組實例的上下文。根據 [WASM 規格](https://webassembly.github.io/spec/core/exec/instructions.html#function-calls),呼叫函式時會將包含呼叫者函式所屬模組實例的框架推入堆疊。因此,主機函式可以存取堆疊頂端框架的模組實例以取得記憶體實例來讀寫資料。

```c
/* Host function body definition. */
WasmEdge_Result LoadOffset(void *Data,
                           const WasmEdge_CallingFrameContext *CallFrameCxt,
                           const WasmEdge_Value *In, WasmEdge_Value *Out) {
  /* Function type: {i32} -> {} */
  uint32_t Offset = (uint32_t)WasmEdge_ValueGetI32(In[0]);
  uint32_t Num = 0;

  /* Get the 0th memory instance of the module of the top frame on the stack. */
  /*
   * Noticed that the `MemCxt` will be `NULL` if there's no memory instance in
   * the module instance on the top frame.
   */
  WasmEdge_MemoryInstanceContext *MemCxt =
      WasmEdge_CallingFrameGetMemoryInstance(CallFrameCxt, 0);
  WasmEdge_Result Res =
      WasmEdge_MemoryInstanceGetData(MemCxt, (uint8_t *)(&Num), Offset, 4);
  if (WasmEdge_ResultOK(Res)) {
    printf("u32 at memory[%u]: %u\n", Offset, Num);
  } else {
    return Res;
  }
  return WasmEdge_Result_Success;
}
```

`WasmEdge_CallingFrameGetModuleInstance()` API 可幫助開發者取得堆疊頂端框架的模組實例。有了模組實例上下文,開發者就可以使用與模組實例相關的 API 取得其內容。`WasmEdge_CallingFrameGetExecutor()` API 則可協助開發者取得目前使用中的執行器上下文,藉此使用該執行器遞迴地呼叫其他 WASM 函式,而無須建立新的執行器上下文。

### 回傳錯誤碼

通常,WasmEdge 中的主機函式可以回傳 `WasmEdge_Result_Success` 來表示執行成功。要表示主機函式執行失敗,其中一種方式是回傳帶有錯誤碼的陷阱(trap)。接著 WasmEdge 執行環境會在 WASM 中產生陷阱並回傳該錯誤。

<!-- prettier-ignore -->
:::note
我們不建議使用 `exit()` 之類的系統呼叫。這會關閉整個 WasmEdge 執行環境。_
:::

要簡單地產生陷阱,開發者可以回傳 `WasmEdge_Result_Fail`。如果開發者以回傳的結果呼叫 `WasmEdge_ResultOK()`,會得到 `false`。如果以回傳的結果呼叫 `WasmEdge_ResultGetCode()`,則永遠會得到 `2`。

從 `0.11.0` 之後的版本,開發者可以指定 24 位元(小於 `16777216`)範圍內的錯誤碼。

```c
/* Host function body definition. */
WasmEdge_Result FaildFunc(void *Data,
                          const WasmEdge_CallingFrameContext *CallFrameCxt,
                          const WasmEdge_Value *In, WasmEdge_Value *Out) {
  /* This will create a trap in WASM with the error code. */
  return WasmEdge_ResultGen(WasmEdge_ErrCategory_UserLevelError, 12345678);
}
```

因此當開發者以回傳的結果呼叫 `WasmEdge_ResultGetCode()` 時,會得到錯誤碼 `12345678`。如果呼叫 `WasmEdge_ResultGetMessage()`,則永遠會得到 C 字串 `"user defined error code"`。

### 主機資料

`WasmEdge_FunctionInstanceCreate()` API 的第三個參數是型別為 `void *` 的主機資料。開發者可以在建立時將資料傳入主機函式。然後在主機函式內容中,開發者可以從第一個引數存取該資料。開發者必須確保主機資料的可用性比主機函式還要長。

```c
/* Host function body definition. */
WasmEdge_Result PrintData(void *Data,
                          const WasmEdge_CallingFrameContext *,
                          const WasmEdge_Value *In, WasmEdge_Value *Out) {
  /* Function type: {} -> {} */
  printf("Data: %lf\n", *(double *)Data);
  return WasmEdge_Result_Success;
}

/* The host data. */
double Number = 0.0f;

/* Create a function type: {} -> {}. */
WasmEdge_FunctionTypeContext *HostFType =
    WasmEdge_FunctionTypeCreate(NULL, 0, NULL, 0);
/* Create a function context with the function type and host function body. */
WasmEdge_FunctionInstanceContext *HostFunc =
    WasmEdge_FunctionInstanceCreate(HostFType, &PrintData, (void *)(&Number), 0);
WasmEdge_FunctionTypeDelete(HostType);
```

### 強制終止

開發者有時會希望以成功狀態終止 WASM 執行。WasmEdge 提供在主機函式中終止 WASM 執行的方法。開發者可以回傳 `WasmEdge_Result_Terminate` 來觸發目前執行的強制終止。如果開發者以回傳的結果呼叫 `WasmEdge_ResultOK()`,會得到 `true`。如果以回傳的結果呼叫 `WasmEdge_ResultGetCode()`,則永遠會得到 `1`。
