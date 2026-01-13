---
sidebar_position: 4
---

# Upgrade to WasmEdge 0.15.0

Due to the WasmEdge C API breaking changes, this document shows the guideline for programming with WasmEdge C API to upgrade from the `0.14.1` to the `0.15.0` version.

## Concepts

1. Introduced new APIs for logging.

   Besides the `WasmEdge_LogSetErrorLevel()` and `WasmEdge_LogSetDebugLevel()` APIs, developers can use the `WasmEdge_LogSetLevel()` API to set the logging level.

   On the other hand, developers can use the `WasmEdge_LogSetCallback()` API to set the callback to receive the message struct when logging occurs.

2. Introduced new API for forcibly deleting registered modules.

   Developers can use the `WasmEdge_VMForceDeleteRegisteredModule()` API to delete the registered modules in the VM context.

   This API provides the force deletion of module instance. After invoking this API, the module instance will be deleted. Developers should consider the module dependency when using this API.

## Logging Level and Callback Configuration

Developers can set the logging level by the `WasmEdge_LogSetLevel()` API with the level enumeration:

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

For getting the detailed result or error message, WasmEdge provides the callback interface to register the customized callback function into the logging sink. Developers will get the message struct via the callback argument:

```c
typedef struct WasmEdge_LogMessage {
  WasmEdge_String Message;
  WasmEdge_String LoggerName;
  WasmEdge_LogLevel Level;
  time_t Time;
  uint64_t ThreadId;
} WasmEdge_LogMessage;
```

Developers can register the callback by the `WasmEdge_LogSetCallback()` API to receive the message when logging occurs.

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

## Module Instance Deletion in VM Context

For instantiated and registered modules in VM context, developers can use the `WasmEdge_VMForceDeleteRegisteredModule()` API to forcibly delete and unregister the module instance by name.

<!-- prettier-ignore -->
:::note
This API doesn't check the module instance dependencies for exporting and importing. Developers should guarantee the module dependencies by theirselves when using this API. The safer API will be provided in the future.
:::

Assume that the WASM file [`fibonacci.wasm`](https://raw.githubusercontent.com/WasmEdge/WasmEdge/master/examples/wasm/fibonacci.wat) is copied into the current directory, and the C file `test.c` is as following:

<!-- prettier-ignore -->
:::note
`fibonacci.wat` file is provided in text format. Users should convert it into corresponding WASM binary format by using [WABT tool](https://github.com/WebAssembly/wabt).
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

Noticed that this API will take the ownership of the module instance and delete it. If developers delete the module instance by this API which registered via the `WasmEdge_VMRegisterModuleFromImport()` API, the module instance should NOT be deleted again.
