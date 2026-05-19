---
sidebar_position: 6
---

# 升級至 WasmEdge 0.15.0

由於 WasmEdge C API 有破壞性變更，本文件說明使用 WasmEdge C API 從 `0.14.1` 升級到 `0.15.0` 版本的程式設計指引。

## 概念

1. 引入了用於記錄的全新 API。

   除了 `WasmEdge_LogSetErrorLevel()` 與 `WasmEdge_LogSetDebugLevel()` API 之外，開發者可以使用 `WasmEdge_LogSetLevel()` API 來設定記錄等級。

   另一方面，開發者可以使用 `WasmEdge_LogSetCallback()` API 來設定回呼，以便在記錄發生時接收訊息結構。

2. 引入了用於強制刪除已註冊模組的全新 API。

   開發者可以使用 `WasmEdge_VMForceDeleteRegisteredModule()` API 來刪除 VM 情境中已註冊的模組。

   此 API 提供強制刪除模組實例的功能。呼叫此 API 之後，模組實例會被刪除。開發者在使用此 API 時應考量模組之間的相依性。

## 記錄等級與回呼設定

開發者可以透過 `WasmEdge_LogSetLevel()` API 搭配等級列舉來設定記錄等級：

```c
typedef enum WasmEdge_LogLevel {
  WasmEdge_LogLevel_Trace,
  WasmEdge_LogLevel_Debug,
  WasmEdge_LogLevel_Info,
  WasmEdge_LogLevel_Warn,
  WasmEdge_LogLevel_Error,
  WasmEdge_LogLevel_Critical,
} WasmEdge_LogLevel;
```

為了取得詳細結果或錯誤訊息，WasmEdge 提供回呼介面，可以將自訂的回呼函式註冊到記錄輸出端。開發者會透過回呼參數取得訊息結構：

```c
typedef struct WasmEdge_LogMessage {
  WasmEdge_String Message;
  WasmEdge_String LoggerName;
  WasmEdge_LogLevel Level;
  time_t Time;
  uint64_t ThreadId;
} WasmEdge_LogMessage;
```

開發者可以透過 `WasmEdge_LogSetCallback()` API 來註冊回呼，以便在記錄發生時接收訊息。

```c
#include <wasmedge/wasmedge.h>
void callback(const WasmEdge_LogMessage *Message) {
  printf("Message: %s, LoggerName: %s\n", Message->Message.Buf, Message->LoggerName.Buf);
}

int main() {
  WasmEdge_LogSetCallback(callback);
  return 0;
}
```

## 在 VM 情境中刪除模組實例

對於 VM 情境中已實例化並註冊的模組，開發者可以使用 `WasmEdge_VMForceDeleteRegisteredModule()` API 依名稱強制刪除並取消註冊模組實例。

<!-- prettier-ignore -->
:::note
此 API 不會檢查模組實例的匯出與匯入相依性。開發者在使用此 API 時應自行確保模組相依性。未來會提供更安全的 API。
:::

假設 WASM 檔案 [`fibonacci.wasm`](https://raw.githubusercontent.com/WasmEdge/WasmEdge/master/examples/wasm/fibonacci.wat) 已複製到目前目錄，且 C 檔案 `test.c` 內容如下：

<!-- prettier-ignore -->
:::note
`fibonacci.wat` 檔案是以文字格式提供。使用者應使用 [WABT 工具](https://github.com/WebAssembly/wabt) 將其轉換為對應的 WASM 二進位格式。
:::

```c
#include <wasmedge/wasmedge.h>
#include <stdio.h>
int main() {
  WasmEdge_VMContext *VMCxt = WasmEdge_VMCreate(NULL, NULL);

  /* The parameters and returns arrays. */
  WasmEdge_Value Params[1] = {WasmEdge_ValueGenI32(20)};
  WasmEdge_Value Returns[1];
  /* Names. */
  WasmEdge_String ModName = WasmEdge_StringCreateByCString("mod");
  WasmEdge_String FuncName = WasmEdge_StringCreateByCString("fib");
  /* Result. */
  WasmEdge_Result Res;

  /* Register the WASM module into VM. */
  Res = WasmEdge_VMRegisterModuleFromFile(VMCxt, ModName, "fibonacci.wasm");
  if (!WasmEdge_ResultOK(Res)) {
    printf("WASM registration failed: %s\n",
          WasmEdge_ResultGetMessage(Res));
    return 1;
  }
  /*
  * The function "fib" in the "fibonacci.wasm" was exported with the module
  * name "mod". As the same as host functions, other modules can import the
  * function `"mod" "fib"`.
  */

  /* Forcibly delete the registered module. */
  WasmEdge_VMForceDeleteRegisteredModule(VMCxt, ModName);

  WasmEdge_StringDelete(ModName);
  WasmEdge_StringDelete(FuncName);
  WasmEdge_VMDelete(VMCxt);
  return 0;
}
```

請注意，此 API 會取得模組實例的所有權並將其刪除。如果開發者透過此 API 刪除由 `WasmEdge_VMRegisterModuleFromImport()` API 註冊的模組實例，則該模組實例不應再次被刪除。
