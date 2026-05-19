---
sidebar_position: 8
---

# 升級至 WasmEdge-Go v0.11.0

由於 WasmEdge C API 有破壞性變更，本文件說明使用 WasmEdge C API 從 `v0.10.1` 升級到 `v0.11.0` 版本的程式設計指引。

## 概念

1. 在主機函式中支援使用者自訂的錯誤代碼。

   開發者可以使用新的 API `WasmEdge_ResultGen()` 來產生一個帶有 `WasmEdge_ErrCategory_UserLevelError` 與錯誤代碼的 `WasmEdge_Result` 結構。透過此支援，開發者可以在主機函式失敗時自行指定錯誤代碼。關於指定使用者自訂錯誤代碼的範例，請參閱[下方範例](#user-defined-error-code-in-host-functions)。

2. 主機函式擴充的呼叫框架

   在先前版本中，主機函式僅將記憶體實例傳遞到函式主體。為了支援 WASM multiple memories 提案以及在主機函式中提供遞迴呼叫，新的情境 `WasmEdge_CallingFrameContext` 取代了主機函式定義中第二個引數的記憶體實例。關於新的主機函式定義範例，請參閱[下方範例](#calling-frame-in-host-functions)。

3. 套用 SONAME 與 SOVERSION。

   在連結 WasmEdge 共用函式庫時，請注意 `libwasmedge_c.so` 在 0.11.0 發行版本之後已重新命名為 `libwasmedge.so`。請使用 `-lwasmedge` 取代 `-lwasmedge_c` 作為連結器選項。

## 主機函式中的使用者自訂錯誤代碼

假設我們想在 `0.10.1` 之前的版本中指定主機函式失敗：

```c
/* Host function body definition. */
WasmEdge_Result FaildFunc(void *Data, WasmEdge_MemoryInstanceContext *MemCxt,
                          const WasmEdge_Value *In, WasmEdge_Value *Out) {
  /* This will create a trap in WASM. */
  return WasmEdge_Result_Fail;
}
```

執行結束後，開發者會取得 `WasmEdge_Result`。如果開發者以回傳的結果呼叫 `WasmEdge_ResultOK()`，會得到 `false`。如果開發者以回傳的結果呼叫 `WasmEdge_ResultGetCode()`，會永遠得到 `2`。

對於 `0.11.0` 之後的版本，開發者可以指定 24 位元（小於 `16777216`）大小範圍內的錯誤代碼。

```c
/* Host function body definition. */
WasmEdge_Result FaildFunc(void *Data,
                          const WasmEdge_CallingFrameContext *CallFrameCxt,
                          const WasmEdge_Value *In, WasmEdge_Value *Out) {
  /* This will create a trap in WASM with the error code. */
  return WasmEdge_ResultGen(WasmEdge_ErrCategory_UserLevelError, 12345678);
}
```

因此當開發者以回傳的結果呼叫 `WasmEdge_ResultGetCode()` 時，會得到錯誤代碼 `12345678`。請注意，如果開發者呼叫 `WasmEdge_ResultGetMessage()`，將永遠得到 C 字串 `"user defined error code"`。

## 主機函式中的呼叫框架

在實作主機函式時，開發者通常會使用輸入的記憶體實例來載入或儲存資料。在 `0.10.1` 之前的 WasmEdge 版本中，主機函式定義裡位於輸入與回傳值清單之前的引數是記憶體實例情境，因此開發者可以存取記憶體實例中的資料。

```c
/* Host function body definition. */
WasmEdge_Result LoadOffset(void *Data, WasmEdge_MemoryInstanceContext *MemCxt,
                           const WasmEdge_Value *In, WasmEdge_Value *Out) {
  /* Function type: {i32} -> {} */
  uint32_t Offset = (uint32_t)WasmEdge_ValueGetI32(In[0]);
  uint32_t Num = 0;
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

輸入的記憶體實例屬於堆疊頂端呼叫框架上的模組實例。然而，套用 WASM multiple memories 提案之後，一個 WASM 模組中可能會有超過 1 個記憶體實例。此外，可能會有存取堆疊頂端框架上模組實例的需求，例如為了取得匯出的 WASM 函式，或在主機函式中進行遞迴呼叫。為了支援這些情境，`WasmEdge_CallingFrameContext` 被設計用來取代主機函式的記憶體實例輸入。

在 `0.11.0` 之後的 WasmEdge 版本中，主機函式定義有所變更：

```c
typedef WasmEdge_Result (*WasmEdge_HostFunc_t)(
    void *Data, const WasmEdge_CallingFrameContext *CallFrameCxt,
    const WasmEdge_Value *Params, WasmEdge_Value *Returns);

typedef WasmEdge_Result (*WasmEdge_WrapFunc_t)(
    void *This, void *Data, const WasmEdge_CallingFrameContext *CallFrameCxt,
    const WasmEdge_Value *Params, const uint32_t ParamLen,
    WasmEdge_Value *Returns, const uint32_t ReturnLen);
```

開發者需要改為使用 `WasmEdge_CallingFrameContext` 相關的 API 來存取記憶體實例：

```c
/* Host function body definition. */
WasmEdge_Result LoadOffset(void *Data,
                           const WasmEdge_CallingFrameContext *CallFrameCxt,
                           const WasmEdge_Value *In, WasmEdge_Value *Out) {
  /* Function type: {i32} -> {} */
  uint32_t Offset = (uint32_t)WasmEdge_ValueGetI32(In[0]);
  uint32_t Num = 0;

  /* Get the 0th memory instance of the module of the top frame on the stack. */
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

`WasmEdge_CallingFrameGetModuleInstance()` API 可以協助開發者取得堆疊頂端框架上的模組實例。有了模組實例情境，開發者可以使用模組實例相關的 API 來取得其內容。

`WasmEdge_CallingFrameGetExecutor()` API 可以協助開發者取得目前使用中的執行器情境。因此開發者可以使用該執行器來遞迴呼叫其他 WASM 函式，而無需建立新的執行器情境。
