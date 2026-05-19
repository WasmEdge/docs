---
sidebar_position: 1
---

# WasmEdge C++ SDK 介紹

WasmEdge C++ SDK 是一系列標頭檔與函式庫的集合,讓你能建置並部署可在 WasmEdge 裝置上執行的 WebAssembly(Wasm)模組。它包含一個 CMake 專案以及一組命令列工具,可用來建置與部署你的 Wasm 模組。

## 快速開始指南

要開始使用 WasmEdge,請依照以下步驟操作:

安裝 WasmEdge C/C++ SDK:從 WasmEdge [網站](https://wasmedge.org/docs/embed/quick-start/install)下載 C++ SDK,並依照指示在你的開發機器上安裝。

```cpp
#include <wasmedge/wasmedge.h>
#include <iostream>

int main(int argc, char** argv) {
  /* Create the configure context and add the WASI support. */
  /* This step is not necessary unless you need WASI support. */
  WasmEdge_ConfigureContext* conf_cxt = WasmEdge_ConfigureCreate();
  WasmEdge_ConfigureAddHostRegistration(conf_cxt, WasmEdge_HostRegistration_Wasi);
  /* The configure and store context to the VM creation can be NULL. */
  WasmEdge_VMContext* vm_cxt = WasmEdge_VMCreate(conf_cxt, nullptr);

  /* The parameters and returns arrays. */
  WasmEdge_Value params[1] = { WasmEdge_ValueGenI32(40) };
  WasmEdge_Value returns[1];
  /* Function name. */
  WasmEdge_String func_name = WasmEdge_StringCreateByCString("fib");
  /* Run the WASM function from file. */
  WasmEdge_Result res = WasmEdge_VMRunWasmFromFile(vm_cxt, argv[1], func_name, params, 1, returns, 1);

  if (WasmEdge_ResultOK(res)) {
    std::cout << "Get result: " << WasmEdge_ValueGetI32(returns[0]) << std::endl;
  } else {
    std::cout << "Error message: " << WasmEdge_ResultGetMessage(res) << std::endl;
  }

  /* Resources deallocations. */
  WasmEdge_VMDelete(vm_cxt);
  WasmEdge_ConfigureDelete(conf_cxt);
  WasmEdge_StringDelete(func_name);
  return 0;
}
```

你可以使用 -I 旗標指定 include 目錄,並分別使用 -L 與 -l 旗標指定函式庫目錄與函式庫名稱。接著你就可以編譯並執行(費氏數列第 40 個數字為 102334155):

```bash
gcc example.cpp -x c++ -I/path/to/wasmedge/include -L/path/to/wasmedge/lib -lwasmedge -o example
```

要執行上一步建立的 `example` 執行檔,可使用以下命令:

```bash
./example
```

## AOT 編譯器快速開始指南

```cpp
#include <wasmedge/wasmedge.h>
#include <stdio.h>

int main(int argc, const char* argv[]) {
  // Create the configure context and add the WASI support.
  // This step is not necessary unless you need WASI support.
  wasmedge_configure_context* conf_cxt = wasmedge_configure_create();
  wasmedge_configure_add_host_registration(conf_cxt, WASMEDGE_HOST_REGISTRATION_WASI);

  // Create the VM context in AOT mode.
  wasmedge_vm_context* vm_cxt = wasmedge_vm_create_aot(conf_cxt, NULL);

  // The parameters and returns arrays.
  wasmedge_value params[1] = { wasmedge_value_gen_i32(32) };
  wasmedge_value returns[1];
  // Function name.
  wasmedge_string func_name = wasmedge_string_create_by_cstring("fib");
  // Run the WASM function from file.
  wasmedge_result res = wasmedge_vm_run_wasm_from_file(vm_cxt, argv[1], func_name, params, 1, returns, 1);

  if (wasmedge_result_ok(res)) {
    printf("Get result: %d\n", wasmedge_value_get_i32(returns[0]));
  } else {
    printf("Error message: %s\n", wasmedge_result_get_message(res));
  }

  // Resources deallocations.
  wasmedge_vm_delete(vm_cxt);
  wasmedge_configure_delete(conf_cxt);
  wasmedge_string_delete(func_name);
  return 0;
}
```

在這個範例中,我們使用 wasmedge_vm_create_aot 函式以 AOT 模式建立一個 wasmedge_vm_context 物件,然後將其作為第二個引數傳給 wasmedge_vm_run_wasm_from_file 函式,以 AOT 模式執行 Wasm 模組。
