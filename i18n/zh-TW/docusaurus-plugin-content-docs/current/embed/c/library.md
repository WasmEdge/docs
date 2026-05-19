---
sidebar_position: 2
---

# 使用 WasmEdge 函式庫

當使用 WasmEdge C API 進行程式設計時,開發者應該包含必要的標頭檔並與 WasmEdge 函式庫連結。除了透過 WasmEdge 共享函式庫[安裝 WasmEdge](../../start/install.md#install)之外,開發者也可以[建置 WasmEdge](../../contribute/source/build_from_src.md) 來產生 WasmEdge 靜態函式庫。

假設範例 `test.c`:

```c
#include <stdio.h>
#include <wasmedge/wasmedge.h>

/* Host function body definition. */
WasmEdge_Result Add(void *Data,
                    const WasmEdge_CallingFrameContext *CallFrameCxt,
                    const WasmEdge_Value *In, WasmEdge_Value *Out) {
  int32_t Val1 = WasmEdge_ValueGetI32(In[0]);
  int32_t Val2 = WasmEdge_ValueGetI32(In[1]);
  printf("Host function \"Add\": %d + %d\n", Val1, Val2);
  Out[0] = WasmEdge_ValueGenI32(Val1 + Val2);
  return WasmEdge_Result_Success;
}

int main() {
  /* Create the VM context. */
  WasmEdge_VMContext *VMCxt = WasmEdge_VMCreate(NULL, NULL);

  /* The WASM module buffer. */
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

  /* Create the module instance. */
  WasmEdge_String ExportName = WasmEdge_StringCreateByCString("extern");
  WasmEdge_ModuleInstanceContext *HostModCxt =
      WasmEdge_ModuleInstanceCreate(ExportName);
  WasmEdge_ValType ParamList[2] = {WasmEdge_ValTypeGenI32(), WasmEdge_ValTypeGenI32()};
  WasmEdge_ValType ReturnList[1] = {WasmEdge_ValTypeGenI32()};
  WasmEdge_FunctionTypeContext *HostFType =
      WasmEdge_FunctionTypeCreate(ParamList, 2, ReturnList, 1);
  WasmEdge_FunctionInstanceContext *HostFunc =
      WasmEdge_FunctionInstanceCreate(HostFType, Add, NULL, 0);
  WasmEdge_FunctionTypeDelete(HostFType);
  WasmEdge_String HostFuncName = WasmEdge_StringCreateByCString("func-add");
  WasmEdge_ModuleInstanceAddFunction(HostModCxt, HostFuncName, HostFunc);
  WasmEdge_StringDelete(HostFuncName);

  WasmEdge_VMRegisterModuleFromImport(VMCxt, HostModCxt);

  /* The parameters and returns arrays. */
  WasmEdge_Value Params[2] = {WasmEdge_ValueGenI32(1234),
                              WasmEdge_ValueGenI32(5678)};
  WasmEdge_Value Returns[1];
  /* Function name. */
  WasmEdge_String FuncName = WasmEdge_StringCreateByCString("addTwo");
  /* Run the WASM function from buffer. */
  WasmEdge_Result Res = WasmEdge_VMRunWasmFromBuffer(
      VMCxt, WASM, sizeof(WASM), FuncName, Params, 2, Returns, 1);

  if (WasmEdge_ResultOK(Res)) {
    printf("Get the result: %d\n", WasmEdge_ValueGetI32(Returns[0]));
  } else {
    printf("Error message: %s\n", WasmEdge_ResultGetMessage(Res));
  }

  /* Resources deallocations. */
  WasmEdge_VMDelete(VMCxt);
  WasmEdge_StringDelete(FuncName);
  WasmEdge_ModuleInstanceDelete(HostModCxt);
  return 0;
}
```

這個範例會執行一個 WASM,該 WASM 會呼叫主機函式以對兩個數字進行相加。

## 與 WasmEdge 共享函式庫連結

要將執行檔與 WasmEdge 共享函式庫連結很容易。只要在安裝完 WasmEdge 之後編譯範例檔即可。

```bash
$ gcc test.c -lwasmedge -o test
$ ./test
Host function "Add": 1234 + 5678
Get the result: 6912
```

## 與 WasmEdge 靜態函式庫連結

要準備 WasmEdge 靜態函式庫,開發者應使用以下選項[從原始碼建置 WasmEdge](../../contribute/source/build_from_src#cmake-building-options):

```bash
# 建議使用 `wasmedge/wasmedge:latest` docker 映像檔,該映像檔提供所需的套件。
# 在 WasmEdge 原始碼目錄中
cmake -Bbuild -GNinja -DCMAKE_BUILD_TYPE=Release -DWASMEDGE_LINK_LLVM_STATIC=ON -DWASMEDGE_BUILD_SHARED_LIB=Off -DWASMEDGE_BUILD_STATIC_LIB=On -DWASMEDGE_LINK_TOOLS_STATIC=On -DWASMEDGE_BUILD_PLUGINS=Off
cmake --build build
cmake --install build
```

cmake 選項 `-DWASMEDGE_LINK_LLVM_STATIC=ON` 會啟用靜態函式庫建置,而 `-DWASMEDGE_BUILD_SHARED_LIB=Off` 會關閉共享函式庫建置。

安裝完成後,開發者可以編譯範例檔:

```bash
# 注意:只有 Linux 平台需要 `-lrt`。MacOS 平台不需要這個連結器旗標。
$ gcc test.c -lwasmedge -lrt -ldl -pthread -lm -lstdc++ -o test
$ ./test
Host function "Add": 1234 + 5678
Get the result: 6912
```
