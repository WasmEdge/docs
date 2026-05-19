---
sidebar_position: 4
---

# 自訂外部參考

[外部參考](https://webassembly.github.io/spec/core/syntax/types.html#syntax-reftype)表示一個指向主機物件的不透明且不可偽造的參考。一個新的 `externref` 型別可以被傳入 WASM 模組或從中回傳。WASM 模組無法看出 `externref` 值的位元樣式,也無法透過整數值偽造主機參考。

<!-- prettier-ignore -->
:::note
本章所使用的所有 WASM 範例程式碼,使用者可以透過 [wat2wasm](https://webassembly.github.io/wabt/demo/wat2wasm/) 線上工具將 `wat` 轉換為 `wasm`。
:::

## 教學

以下教學總結了 WasmEdge 中的 `externref` 範例。

### 準備你的 WASM 檔案

WASM 檔案應該要包含匯入接收 `externref` 的主機函式。以[這個 WAT](https://github.com/WasmEdge/WasmEdge/blob/master/test/externref/externrefTestData/funcs.wat) 為例:

```wasm
(module
  (type $t0 (func (param externref i32) (result i32)))
  (type $t1 (func (param externref i32 i32) (result i32)))
  (type $t2 (func (param externref externref i32 i32) (result i32)))
  (import "extern_module" "functor_square" (func $functor_square (type $t0)))
  (import "extern_module" "class_add" (func $class_add (type $t1)))
  (import "extern_module" "func_mul" (func $func_mul (type $t1)))
  (func $call_add (export "call_add") (type $t1) (param $p0 externref) (param $p1 i32) (param $p2 i32) (result i32)
    (call $class_add
      (local.get $p0)
      (local.get $p1)
      (local.get $p2)))
  (func $call_mul (export "call_mul") (type $t1) (param $p0 externref) (param $p1 i32) (param $p2 i32) (result i32)
    (call $func_mul
      (local.get $p0)
      (local.get $p1)
      (local.get $p2)))
  (func $call_square (export "call_square") (type $t0) (param $p0 externref) (param $p1 i32) (result i32)
    (call $functor_square
      (local.get $p0)
      (local.get $p1)))
  (func $call_add_square (export "call_add_square") (type $t2) (param $p0 externref) (param $p1 externref) (param $p2 i32) (param $p3 i32) (result i32)
    (call $functor_square
      (local.get $p1)
      (call $class_add
        (local.get $p0)
        (local.get $p2)
        (local.get $p3))))
  (memory $memory (export "memory") 1))
```

### 實作主機模組並註冊到 WasmEdge

執行 Wasm 之前,應實作主機模組並將其註冊到 WasmEdge。假設以下程式碼儲存為 `main.c`:

```c
#include <wasmedge/wasmedge.h>

#include <stdio.h>

uint32_t SquareFunc(uint32_t A) { return A * A; }
uint32_t AddFunc(uint32_t A, uint32_t B) { return A + B; }
uint32_t MulFunc(uint32_t A, uint32_t B) { return A * B; }

// Host function to call `SquareFunc` by external reference
WasmEdge_Result ExternSquare(void *Data,
                             const WasmEdge_CallingFrameContext *CallFrameCxt,
                             const WasmEdge_Value *In, WasmEdge_Value *Out) {
  // Function type: {externref, i32} -> {i32}
  uint32_t (*Func)(uint32_t) = WasmEdge_ValueGetExternRef(In[0]);
  uint32_t C = Func(WasmEdge_ValueGetI32(In[1]));
  Out[0] = WasmEdge_ValueGenI32(C);
  return WasmEdge_Result_Success;
}

// Host function to call `AddFunc` by external reference
WasmEdge_Result ExternAdd(void *Data,
                          const WasmEdge_CallingFrameContext *CallFrameCxt,
                          const WasmEdge_Value *In, WasmEdge_Value *Out) {
  // Function type: {externref, i32, i32} -> {i32}
  uint32_t (*Func)(uint32_t, uint32_t) = WasmEdge_ValueGetExternRef(In[0]);
  uint32_t C = Func(WasmEdge_ValueGetI32(In[1]), WasmEdge_ValueGetI32(In[2]));
  Out[0] = WasmEdge_ValueGenI32(C);
  return WasmEdge_Result_Success;
}

// Host function to call `ExternMul` by external reference
WasmEdge_Result ExternMul(void *Data,
                          const WasmEdge_CallingFrameContext *CallFrameCxt,
                          const WasmEdge_Value *In, WasmEdge_Value *Out) {
  // Function type: {externref, i32, i32} -> {i32}
  uint32_t (*Func)(uint32_t, uint32_t) = WasmEdge_ValueGetExternRef(In[0]);
  uint32_t C = Func(WasmEdge_ValueGetI32(In[1]), WasmEdge_ValueGetI32(In[2]));
  Out[0] = WasmEdge_ValueGenI32(C);
  return WasmEdge_Result_Success;
}

// Helper function to create the "extern_module" module instance.
WasmEdge_ModuleInstanceContext *CreateExternModule() {
  WasmEdge_String HostName;
  WasmEdge_FunctionTypeContext *HostFType = NULL;
  WasmEdge_FunctionInstanceContext *HostFunc = NULL;
  WasmEdge_ValType P[3], R[1];

  HostName = WasmEdge_StringCreateByCString("extern_module");
  WasmEdge_ModuleInstanceContext *HostMod =
      WasmEdge_ModuleInstanceCreate(HostName);
  WasmEdge_StringDelete(HostName);

  // Add host function "functor_square": {externref, i32} -> {i32}
  P[0] = WasmEdge_ValTypeGenExternRef();
  P[1] = WasmEdge_ValTypeGenI32();
  R[0] = WasmEdge_ValTypeGenI32();
  HostFType = WasmEdge_FunctionTypeCreate(P, 2, R, 1);
  HostFunc = WasmEdge_FunctionInstanceCreate(HostFType, ExternSquare, NULL, 0);
  WasmEdge_FunctionTypeDelete(HostFType);
  HostName = WasmEdge_StringCreateByCString("functor_square");
  WasmEdge_ModuleInstanceAddFunction(HostMod, HostName, HostFunc);
  WasmEdge_StringDelete(HostName);

  // Add host function "class_add": {externref, i32, i32} -> {i32}
  P[2] = WasmEdge_ValTypeGenI32();
  HostFType = WasmEdge_FunctionTypeCreate(P, 3, R, 1);
  HostFunc = WasmEdge_FunctionInstanceCreate(HostFType, ExternAdd, NULL, 0);
  WasmEdge_FunctionTypeDelete(HostFType);
  HostName = WasmEdge_StringCreateByCString("class_add");
  WasmEdge_ModuleInstanceAddFunction(HostMod, HostName, HostFunc);
  WasmEdge_StringDelete(HostName);

  // Add host function "func_mul": {externref, i32, i32} -> {i32}
  HostFType = WasmEdge_FunctionTypeCreate(P, 3, R, 1);
  HostFunc = WasmEdge_FunctionInstanceCreate(HostFType, ExternMul, NULL, 0);
  WasmEdge_FunctionTypeDelete(HostFType);
  HostName = WasmEdge_StringCreateByCString("func_mul");
  WasmEdge_ModuleInstanceAddFunction(HostMod, HostName, HostFunc);
  WasmEdge_StringDelete(HostName);

  return HostMod;
}

int main() {
  WasmEdge_VMContext *VMCxt = WasmEdge_VMCreate(NULL, NULL);
  WasmEdge_ModuleInstanceContext *HostMod = CreateExternModule();
  WasmEdge_Value P[3], R[1];
  WasmEdge_String FuncName;
  WasmEdge_Result Res;

  Res = WasmEdge_VMRegisterModuleFromImport(VMCxt, HostMod);
  if (!WasmEdge_ResultOK(Res)) {
    printf("Host module instance registration failed\n");
    return EXIT_FAILURE;
  }
  Res = WasmEdge_VMLoadWasmFromFile(VMCxt, "funcs.wasm");
  if (!WasmEdge_ResultOK(Res)) {
    printf("WASM file loading failed\n");
    return EXIT_FAILURE;
  }
  Res = WasmEdge_VMValidate(VMCxt);
  if (!WasmEdge_ResultOK(Res)) {
    printf("WASM validation failed\n");
    return EXIT_FAILURE;
  }
  Res = WasmEdge_VMInstantiate(VMCxt);
  if (!WasmEdge_ResultOK(Res)) {
    printf("WASM instantiation failed\n");
    return EXIT_FAILURE;
  }

  // Test 1: call add -- 1234 + 5678
  P[0] = WasmEdge_ValueGenExternRef(AddFunc);
  P[1] = WasmEdge_ValueGenI32(1234);
  P[2] = WasmEdge_ValueGenI32(5678);
  FuncName = WasmEdge_StringCreateByCString("call_add");
  Res = WasmEdge_VMExecute(VMCxt, FuncName, P, 3, R, 1);
  WasmEdge_StringDelete(FuncName);
  if (WasmEdge_ResultOK(Res)) {
    printf("Test 1 -- `call_add` -- 1234 + 5678 = %d\n",
           WasmEdge_ValueGetI32(R[0]));
  } else {
    printf("Test 1 -- `call_add` -- 1234 + 5678 -- failed\n");
    return EXIT_FAILURE;
  }

  // Test 2: call mul -- 789 * 4321
  P[0] = WasmEdge_ValueGenExternRef(MulFunc);
  P[1] = WasmEdge_ValueGenI32(789);
  P[2] = WasmEdge_ValueGenI32(4321);
  FuncName = WasmEdge_StringCreateByCString("call_mul");
  Res = WasmEdge_VMExecute(VMCxt, FuncName, P, 3, R, 1);
  WasmEdge_StringDelete(FuncName);
  if (WasmEdge_ResultOK(Res)) {
    printf("Test 2 -- `call_mul` -- 789 * 4321 = %d\n",
           WasmEdge_ValueGetI32(R[0]));
  } else {
    printf("Test 2 -- `call_mul` -- 789 * 4321 -- failed\n");
    return EXIT_FAILURE;
  }

  // Test 3: call square -- 8256^2
  P[0] = WasmEdge_ValueGenExternRef(SquareFunc);
  P[1] = WasmEdge_ValueGenI32(8256);
  FuncName = WasmEdge_StringCreateByCString("call_square");
  Res = WasmEdge_VMExecute(VMCxt, FuncName, P, 2, R, 1);
  if (WasmEdge_ResultOK(Res)) {
    printf("Test 3 -- `call_mul` -- 8256 ^ 2 = %d\n",
           WasmEdge_ValueGetI32(R[0]));
  } else {
    printf("Test 3 -- `call_mul` -- 8256 ^ 2 -- failed\n");
    return EXIT_FAILURE;
  }

  return EXIT_SUCCESS;
}
```

### 設定環境並編譯

1. 安裝 WasmEdge 共享函式庫。

   詳細資訊請參考[安裝](../../start/install.md#install)。

2. 如上準備 WASM 與 `main.c` 原始檔。

3. 編譯

   ```bash
   gcc main.c -lwasmedge
   # 或是在 C++ 情境下可以使用 g++,或者使用 clang。
   ```

4. 執行測試

   ```bash
   $ ./a.out
   Test 1 -- `call_add` -- 1234 + 5678 = 6912
   Test 2 -- `call_mul` -- 789 * 4321 = 3409269
   Test 3 -- `call_mul` -- 8256 ^ 2 = 68161536
   ```

## 帶有外部參考的 WASM 模組

以下面的 `wat` 為例:

```wasm
(module
  (type $t0 (func (param externref i32) (result i32)))
  ;; Import a host function which type is {externref i32} -> {i32}
  (import "extern_module" "functor_square" (func $functor_square (type $t0)))
  ;; WASM function which type is {externref i32} -> {i32} and exported as "call_square"
  (func $call_square (export "call_square") (type $t0) (param $p0 externref) (param $p1 i32) (result i32)
    (call $functor_square (local.get $p0) (local.get $p1))
  )
  (memory $memory (export "memory") 1))
```

WASM 函式「`call_square`」接收一個 `externref` 參數,並以該 `externref` 呼叫匯入的主機函式 `functor_square`。因此,當使用者呼叫「`call_square`」WASM 函式並傳入物件參考時,`functor_square` 主機函式就能取得該物件參考。

## WasmEdge ExternRef 範例

下列範例示範如何在 WasmEdge C API 中於 WASM 內使用 `externref`。

### WASM 程式碼

WASM 程式碼必須將 `externref` 傳給想要存取它的主機函式。以下面的 `wat` 為例,它是[測試 WASM 檔案](https://github.com/WasmEdge/WasmEdge/blob/master/test/externref/externrefTestData/funcs.wat)的一部分:

```wasm
(module
  (type $t0 (func (param externref i32 i32) (result i32)))
  (import "extern_module" "func_mul" (func $func_mul (type $t0)))
  (func $call_mul (export "call_mul") (type $t0) (param $p0 externref) (param $p1 i32) (param $p2 i32) (result i32)
    (call $func_mul (local.get $p0) (local.get $p1) (local.get $p2))
  )
  (memory $memory (export "memory") 1))
```

主機函式「`extern_module::func_mul`」將 `externref` 視為一個函式指標,用以乘上參數 1 與 2 並回傳結果。匯出的 WASM 函式「`call_mul`」呼叫「`func_mul`」並傳入 `externref` 與 2 個數字作為引數。

### 主機函式

要實例化上述範例的 Wasm,主機函式必須註冊到 WasmEdge。更多細節請參考[主機函式](reference/latest.md#host-functions)。接收 `externref` 的主機函式必須知道原始物件的型別。我們以函式指標為例。

```c
/* Function to pass as function pointer. */
uint32_t MulFunc(uint32_t A, uint32_t B) { return A * B; }

/* Host function to call the function by external reference as a function pointer */
WasmEdge_Result ExternMul(void *, const WasmEdge_CallingFrameContext *,
                          const WasmEdge_Value *In, WasmEdge_Value *Out) {
  /* Function type: {externref, i32, i32} -> {i32} */
  void *Ptr = WasmEdge_ValueGetExternRef(In[0]);
  uint32_t (*Obj)(uint32_t, uint32_t) = Ptr;
  /*
   * For C++, the `reinterpret_cast` is needed:
   * uint32_t (*Obj)(uint32_t, uint32_t) =
   *   *reinterpret_cast<uint32_t (*)(uint32_t, uint32_t)>(Ptr);
   */
  uint32_t C = Obj(WasmEdge_ValueGetI32(In[1]), WasmEdge_ValueGetI32(In[2]));
  Out[0] = WasmEdge_ValueGenI32(C);
  return WasmEdge_Result_Success;
}
```

「`MulFunc`」是要以 `externref` 形式傳入 WASM 的函式。在「`func_mul`」主機函式中,使用者可以使用「`WasmEdge_ValueGetExternRef`」API 從包含 `externref` 的 `WasmEdge_Value` 中取得指標。

開發者可以將具備名稱的主機函式加入模組實例中。

```c
/* Create a module instance. */
WasmEdge_String HostName = WasmEdge_StringCreateByCString("extern_module");
WasmEdge_ModuleInstanceContext *HostMod =
    WasmEdge_ModuleInstanceCreate(HostName);
WasmEdge_StringDelete(HostName);

/* Create a function instance and add to the module instance. */
WasmEdge_ValType P[3], R[1];
P[0] = WasmEdge_ValTypeGenExternRef();
P[1] = WasmEdge_ValTypeGenI32();
P[2] = WasmEdge_ValTypeGenI32();
R[0] = WasmEdge_ValTypeGenI32();
WasmEdge_FunctionTypeContext *HostFType =
    WasmEdge_FunctionTypeCreate(P, 3, R, 1);
WasmEdge_FunctionInstanceContext *HostFunc =
    WasmEdge_FunctionInstanceCreate(HostFType, ExternFuncMul, NULL, 0);
WasmEdge_FunctionTypeDelete(HostFType);
HostName = WasmEdge_StringCreateByCString("func_mul");
WasmEdge_ModuleInstanceAddFunction(HostMod, HostName, HostFunc);
WasmEdge_StringDelete(HostName);

...
```

### 執行

以[測試 WASM 檔案的文字格式](https://github.com/WasmEdge/WasmEdge/raw/master/test/externref/externrefTestData/funcs.wat)為例。假設 `funcs.wasm` 已複製到目前目錄。以下是透過 WasmEdge C API 以 `externref` 執行 WASM 的範例。

```c
/* Create the VM context. */
WasmEdge_VMContext *VMCxt = WasmEdge_VMCreate(NULL, NULL);
/* Create the module instance context that contains the host functions. */
WasmEdge_ModuleInstanceContext *HostMod = /* Ignored ... */;
/* Assume the host functions are added to the module instance above. */
WasmEdge_Value P[3], R[1];
WasmEdge_String FuncName;
WasmEdge_Result Res;

/* Register the module instance into VM. */
Res = WasmEdge_VMRegisterModuleFromImport(VMCxt, HostMod);
if (!WasmEdge_ResultOK(Res)) {
  printf("Import object registration failed\n");
  return EXIT_FAILURE;
}
/* Load WASM from the file. */
Res = WasmEdge_VMLoadWasmFromFile(VMCxt, "funcs.wasm");
if (!WasmEdge_ResultOK(Res)) {
  printf("WASM file loading failed\n");
  return EXIT_FAILURE;
}
/* Validate WASM. */
Res = WasmEdge_VMValidate(VMCxt);
if (!WasmEdge_ResultOK(Res)) {
  printf("WASM validation failed\n");
  return EXIT_FAILURE;
}
/* Instantiate the WASM module. */
Res = WasmEdge_VMInstantiate(VMCxt);
if (!WasmEdge_ResultOK(Res)) {
  printf("WASM instantiation failed\n");
  return EXIT_FAILURE;
}

/* Run a WASM function. */
P[0] = WasmEdge_ValueGenExternRef(AddFunc);
P[1] = WasmEdge_ValueGenI32(1234);
P[2] = WasmEdge_ValueGenI32(5678);
/* Run the `call_add` function. */
FuncName = WasmEdge_StringCreateByCString("call_add");
Res = WasmEdge_VMExecute(VMCxt, FuncName, P, 3, R, 1);
WasmEdge_StringDelete(FuncName);
if (WasmEdge_ResultOK(Res)) {
  printf("Run -- `call_add` -- 1234 + 5678 = %d\n",
          WasmEdge_ValueGetI32(R[0]));
} else {
  printf("Run -- `call_add` -- 1234 + 5678 -- failed\n");
  return EXIT_FAILURE;
}
```

## 傳遞物件

上面的範例是將函式參考作為 `externref` 傳入。下面的範例則說明如何在 C++ 中將物件參考作為 `externref` 傳入 WASM。

### 傳遞類別

要將類別作為 `externref` 傳入,需要物件實例。

```cpp
class AddClass {
public:
  uint32_t add(uint32_t A, uint32_t B) const { return A + B; }
};

AddClass AC;
```

接著使用者可以使用 `WasmEdge_ValueGenExternRef()` API 將物件傳入 WasmEdge。

```cpp
WasmEdge_Value P[3], R[1];
P[0] = WasmEdge_ValueGenExternRef(&AC);
P[1] = WasmEdge_ValueGenI32(1234);
P[2] = WasmEdge_ValueGenI32(5678);
WasmEdge_String FuncName = WasmEdge_StringCreateByCString("call_add");
WasmEdge_Result Res = WasmEdge_VMExecute(VMCxt, FuncName, P, 3, R, 1);
WasmEdge_StringDelete(FuncName);
if (WasmEdge_ResultOK(Res)) {
  std::cout << "Result : " << WasmEdge_ValueGetI32(R[0]) std::endl;
  // Will print `6912`.
} else {
  return EXIT_FAILURE;
}
```

在會透過參考存取物件的主機函式中,使用者可以使用 `WasmEdge_ValueGetExternRef()` API 取得指向該物件的參考。

```cpp
// Modify the `ExternAdd` in the above tutorial.
WasmEdge_Result ExternAdd(void *, const WasmEdge_CallingFrameContext *,
                          const WasmEdge_Value *In, WasmEdge_Value *Out) {
  // Function type: {externref, i32, i32} -> {i32}
  void *Ptr = WasmEdge_ValueGetExternRef(In[0]);
  AddClass &Obj = *reinterpret_cast<AddClass *>(Ptr);
  uint32_t C =
      Obj.add(WasmEdge_ValueGetI32(In[1]), WasmEdge_ValueGetI32(In[2]));
  Out[0] = WasmEdge_ValueGenI32(C);
  return WasmEdge_Result_Success;
}
```

### 將物件作為 Functor 傳遞

如同傳遞類別實例一樣,需要 functor 物件實例。

```cpp
struct SquareStruct {
  uint32_t operator()(uint32_t Val) const { return Val * Val; }
};

SquareStruct SS;
```

接著使用者可以使用 `WasmEdge_ValueGenExternRef()` API 將物件傳入 WasmEdge。

```cpp
WasmEdge_Value P[2], R[1];
P[0] = WasmEdge_ValueGenExternRef(&SS);
P[1] = WasmEdge_ValueGenI32(1024);
WasmEdge_String FuncName = WasmEdge_StringCreateByCString("call_square");
WasmEdge_Result Res = WasmEdge_VMExecute(VMCxt, FuncName, P, 2, R, 1);
WasmEdge_StringDelete(FuncName);
if (WasmEdge_ResultOK(Res)) {
  std::cout << "Result : " << WasmEdge_ValueGetI32(R[0]) std::endl;
  // Will print `1048576`.
} else {
  return EXIT_FAILURE;
}
```

在會透過參考存取物件的主機函式中,使用者可以使用 `WasmEdge_ValueGetExternRef` API 取得指向該物件(即 functor)的參考。

```cpp
// Modify the `ExternSquare` in the above tutorial.
WasmEdge_Result ExternSquare(void *, const WasmEdge_CallingFrameContext *,
                          const WasmEdge_Value *In, WasmEdge_Value *Out) {
  // Function type: {externref, i32, i32} -> {i32}
  void *Ptr = WasmEdge_ValueGetExternRef(In[0]);
  SquareStruct &Obj = *reinterpret_cast<SquareStruct *>(Ptr);
  uint32_t C = Obj(WasmEdge_ValueGetI32(In[1]));
  Out[0] = WasmEdge_ValueGenI32(C);
  return WasmEdge_Result_Success;
}
```

### 傳遞 STL 物件

[文字格式的範例 WASM](https://github.com/WasmEdge/WasmEdge/raw/master/test/externref/externrefTestData/stl.wat) 提供了可與能存取 C++ STL 物件的主機函式互動的函式。假設 WASM 檔案 `stl.wasm` 已複製到目前目錄。

以 `std::ostream` 與 `std::string` 物件為例。假設有一個主機函式透過 `externref` 存取 `std::ostream` 與 `std::string`:

```cpp
// Host function to output std::string through std::ostream
WasmEdge_Result ExternSTLOStreamStr(void *,
                                    const WasmEdge_CallingFrameContext *,
                                    const WasmEdge_Value *In,
                                    WasmEdge_Value *) {
  // Function type: {externref, externref} -> {}
  void *Ptr0 = WasmEdge_ValueGetExternRef(In[0]);
  void *Ptr1 = WasmEdge_ValueGetExternRef(In[1]);
  std::ostream &RefOS = *reinterpret_cast<std::ostream *>(Ptr0);
  std::string &RefStr = *reinterpret_cast<std::string *>(Ptr1);
  RefOS << RefStr;
  return WasmEdge_Result_Success;
}
```

假設上述主機函式已被加入模組實例 `HostMod` 中,且 `HostMod` 已註冊到一個 VM 上下文 `VMCxt`。接著使用者就可以實例化 WASM 模組:

```cpp
WasmEdge_Result Res = WasmEdge_VMLoadWasmFromFile(VMCxt, "stl.wasm");
if (!WasmEdge_ResultOK(Res)) {
  printf("WASM file loading failed\n");
  return EXIT_FAILURE;
}
Res = WasmEdge_VMValidate(VMCxt);
if (!WasmEdge_ResultOK(Res)) {
  printf("WASM validation failed\n");
  return EXIT_FAILURE;
}
Res = WasmEdge_VMInstantiate(VMCxt);
if (!WasmEdge_ResultOK(Res)) {
  printf("WASM instantiation failed\n");
  return EXIT_FAILURE;
}
```

最後,以外部參考傳入 `std::cout` 與一個 `std::string` 物件。

```cpp
std::string PrintStr("Hello world!");
WasmEdge_Value P[2], R[1];
P[0] = WasmEdge_ValueGenExternRef(&std::cout);
P[1] = WasmEdge_ValueGenExternRef(&PrintStr);
WasmEdge_String FuncName = WasmEdge_StringCreateByCString("call_ostream_str");
WasmEdge_Result Res = WasmEdge_VMExecute(VMCxt, FuncName, P, 2, R, 1);
// Will print "Hello world!" to stdout.
WasmEdge_StringDelete(FuncName);
if (!WasmEdge_ResultOK(Res)) {
  return EXIT_FAILURE;
}
```

對於其他 C++ STL 物件的情境,例如 `std::vector<T>`、`std::map<T, U>` 或 `std::set<T>`,只要 `reinterpret_cast` 中的型別正確,就可以在主機函式中正確存取該物件。
