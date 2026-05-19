---
sidebar_position: 1
---

# WasmEdge C SDK 介紹

WasmEdge C API 是一個用以將 WasmEdge 執行環境嵌入 C 程式的介面。以下是使用 WasmEdge C API 的快速開始指南。關於 WasmEdge C API 的完整細節,請參考[完整文件](reference/latest.md)。在開始使用 WasmEdge C API 進行程式設計前,請先[安裝 WasmEdge](../../start/install.md#install)。

WasmEdge C API 也是其他語言 SDK 的基礎 API。

<!-- prettier-ignore -->
:::note
本章所使用的所有 WASM 範例程式碼,使用者可以透過 [wasmedge.org 的 wat2wasm](https://webassembly.github.io/wabt/demo/wat2wasm/) 線上工具將 `wat` 轉換為 `wasm`。
:::

## WasmEdge Runner 快速開始指南

以下是執行一個 WASM 檔案的範例。假設 WASM 檔案 [fibonacci.wasm](https://github.com/WasmEdge/WasmEdge/raw/master/examples/wasm/fibonacci.wat) 已被複製到目前目錄,且 C 檔案 `test_wasmedge.c` 內容如下:
請注意:在範例目錄中提供的是 `fibonacci.wat` 檔案,使用者應該用 [WABT 工具](https://github.com/WebAssembly/wabt)將其轉換為對應的 wasm 檔案。

```c
#include <wasmedge/wasmedge.h>
#include <stdio.h>
int main(int Argc, const char* Argv[]) {
  /* Create the configure context and add the WASI support. */
  /* This step is not necessary unless you need WASI support. */
  WasmEdge_ConfigureContext *ConfCxt = WasmEdge_ConfigureCreate();
  WasmEdge_ConfigureAddHostRegistration(ConfCxt, WasmEdge_HostRegistration_Wasi);
  /* The configure and store context to the VM creation can be NULL. */
  WasmEdge_VMContext *VMCxt = WasmEdge_VMCreate(ConfCxt, NULL);

  /* The parameters and returns arrays. */
  WasmEdge_Value Params[1] = { WasmEdge_ValueGenI32(32) };
  WasmEdge_Value Returns[1];
  /* Function name. */
  WasmEdge_String FuncName = WasmEdge_StringCreateByCString("fib");
  /* Run the WASM function from file. */
  WasmEdge_Result Res = WasmEdge_VMRunWasmFromFile(VMCxt, Argv[1], FuncName, Params, 1, Returns, 1);

  if (WasmEdge_ResultOK(Res)) {
    printf("Get result: %d\n", WasmEdge_ValueGetI32(Returns[0]));
  } else {
    printf("Error message: %s\n", WasmEdge_ResultGetMessage(Res));
  }

  /* Resources deallocations. */
  WasmEdge_VMDelete(VMCxt);
  WasmEdge_ConfigureDelete(ConfCxt);
  WasmEdge_StringDelete(FuncName);
  return 0;
}
```

接著你就可以編譯並執行:(以 0 為起點時,費氏數列第 32 個數字為 3524578)

```bash
$ gcc test_wasmedge.c -lwasmedge -o test_wasmedge
$ ./test_wasmedge fibonacci.wasm
Get result: 3524578
```

## WasmEdge AOT 編譯器快速開始指南

假設 WASM 檔案 [fibonacci.wasm](https://github.com/WasmEdge/WasmEdge/raw/master/examples/wasm/fibonacci.wat) 已複製到目前目錄,且 C 檔案 `test_wasmedge_compiler.c` 內容如下:
請注意:在範例目錄中提供的是 `fibonacci.wat` 檔案,使用者應該用 [WABT 工具](https://github.com/WebAssembly/wabt)將其轉換為對應的 wasm 檔案。

```c
#include <wasmedge/wasmedge.h>
#include <stdio.h>
int main(int Argc, const char* Argv[]) {
  /* Create the configure context. */
  WasmEdge_ConfigureContext *ConfCxt = WasmEdge_ConfigureCreate();
  /* ... Adjust settings in the configure context. */
  /* Result. */
  WasmEdge_Result Res;

  /* Create the compiler context. The configure context can be NULL. */
  WasmEdge_CompilerContext *CompilerCxt = WasmEdge_CompilerCreate(ConfCxt);
  /* Compile the WASM file with input and output paths. */
  Res = WasmEdge_CompilerCompile(CompilerCxt, Argv[1], Argv[2]);
  if (!WasmEdge_ResultOK(Res)) {
    printf("Compilation failed: %s\n", WasmEdge_ResultGetMessage(Res));
    return 1;
  }

  WasmEdge_CompilerDelete(CompilerCxt);
  WasmEdge_ConfigureDelete(ConfCxt);
  return 0;
}
```

接著你就可以編譯並執行(輸出檔案為 `fibonacci_aot.wasm`):

```bash
$ gcc test_wasmedge_compiler.c -lwasmedge -o test_wasmedge_compiler
$ ./test_wasmedge_compiler fibonacci.wasm fibonacci_aot.wasm
[2021-07-02 11:08:08.651] [info] compile start
[2021-07-02 11:08:08.653] [info] verify start
[2021-07-02 11:08:08.653] [info] optimize start
[2021-07-02 11:08:08.670] [info] codegen start
[2021-07-02 11:08:08.706] [info] compile done
```

編譯後的 WASM 檔案可作為 WasmEdge runner 的 WASM 輸入。以下是直譯模式與 AOT 模式的比較:

```bash
$ time ./test_wasmedge fibonacci.wasm
Get result: 5702887

real 0m2.715s
user 0m2.700s
sys 0m0.008s

$ time ./test_wasmedge fibonacci_aot.wasm
Get result: 5702887

real 0m0.036s
user 0m0.022s
sys 0m0.011s
```

## API 參考

- [0.17.0](reference/latest.md)
- [0.16.3](reference/0.16.x.md)
- [0.15.1](reference/0.15.x.md)
- [0.14.1](reference/0.14.x.md)
- [0.13.5](reference/0.13.x.md)
- [0.12.1](reference/0.12.x.md)
- [0.11.2](reference/0.11.x.md)
- [0.10.1](reference/0.10.x.md)
- [0.9.1](reference/0.9.x.md)

## 範例

- 與 [WasmEdge 函式庫](library.md)連結
- 在 C/C++ 中使用 WebAssembly 輸入與輸出的[外部參考](externref.md)
- 在 C/C++ 中實作[主機函式](host_function.md)
- [多個 WASM 模組範例](multiple_modules.md)
