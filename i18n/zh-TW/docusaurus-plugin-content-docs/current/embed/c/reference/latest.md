---
sidebar_position: 1
---

# C API 0.17.0 文件

[WasmEdge C API](https://github.com/WasmEdge/WasmEdge/blob/master/include/api/wasmedge/wasmedge.h) 定義了用於存取 WasmEdge 執行環境（版本 `{{ wasmedge_version }}`）的介面。以下是使用 WasmEdge C API 的相關指南。

## WasmEdge 安裝

### 下載與安裝

安裝 WasmEdge 最簡單的方式是執行以下命令。您的系統必須具備 `git` 與 `wget` 這兩個前置條件。

```bash
curl -sSf https://raw.githubusercontent.com/WasmEdge/WasmEdge/master/utils/install.sh | bash -s -- -v {{ wasmedge_version }}
```

更多詳細資訊，請參閱 WasmEdge 的[安裝指南](../../../start/install.md#install)。

### 編譯原始碼

在安裝 WasmEdge 之後，下列指南可協助您測試 WasmEdge C API 的可用性。

1. 準備測試用的 C 檔案（假設儲存為 `test.c`）：

   ```c
   #include <wasmedge/wasmedge.h>
   #include <stdio.h>
   int main() {
     printf("WasmEdge version: %s\n", WasmEdge_VersionGet());
     return 0;
   }
   ```

2. 使用 `gcc` 或 `clang` 編譯此檔案。

   ```bash
   gcc test.c -lwasmedge
   ```

3. 執行並取得預期的輸出。

   ```bash
   $ ./a.out
   WasmEdge version: {{ wasmedge_version }}
   ```

### ABI 相容性

自 `0.11.0` 版本起，WasmEdge C API 引入了 SONAME 與 SOVERSION，以呈現不同 C API 版本之間的相容性。

在 0.11.0 之前的版本皆未進行版本標記。請確認函式庫版本與您所使用的對應 C API 版本一致。

| WasmEdge 版本 | WasmEdge C API 函式庫名稱 | WasmEdge C API SONAME | WasmEdge C API SOVERSION |
| --- | --- | --- | --- |
| < 0.11.0 | libwasmedge_c.so | 未版本化 | 未版本化 |
| 0.11.0 to 0.11.1 | libwasmedge.so | libwasmedge.so.0 | libwasmedge.so.0.0.0 |
| 0.11.2 | libwasmedge.so | libwasmedge.so.0 | libwasmedge.so.0.0.1 |
| 0.12.0 to 0.12.1 | libwasmedge.so | libwasmedge.so.0 | libwasmedge.so.0.0.2 |
| 0.13.0 to 0.13.5 | libwasmedge.so | libwasmedge.so.0 | libwasmedge.so.0.0.3 |
| 0.14.0 to 0.16.3 | libwasmedge.so | libwasmedge.so.0 | libwasmedge.so.0.1.0 |
| Since 0.17.0 | libwasmedge.so | libwasmedge.so.0 | libwasmedge.so.0.1.1 |

## WasmEdge 基礎

在此部分，我們將介紹 WasmEdge 共用函式庫的工具與概念。

### 版本

`Version` 相關 API 提供開發者檢查 WasmEdge 共用函式庫的版本。

```c
#include <wasmedge/wasmedge.h>
printf("WasmEdge version: %s\n", WasmEdge_VersionGet());
printf("WasmEdge version major: %u\n", WasmEdge_VersionGetMajor());
printf("WasmEdge version minor: %u\n", WasmEdge_VersionGetMinor());
printf("WasmEdge version patch: %u\n", WasmEdge_VersionGetPatch());
```

### 日誌設定

1. 設定日誌等級

   `WasmEdge_LogSetErrorLevel()` 與 `WasmEdge_LogSetDebugLevel()` API 可將日誌系統設定為偵錯等級或錯誤等級。預設情況下會設定為錯誤等級，並隱藏偵錯資訊。

   開發者可透過 `WasmEdge_LogSetLevel()` API 以等級列舉的方式設定日誌等級：

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

   開發者也可使用 `WasmEdge_LogOff()` API 來停用所有日誌。

2. 日誌回呼

   為取得詳細的結果或錯誤訊息，WasmEdge 提供回呼介面，可將自訂的回呼函式註冊至日誌系統中。

   開發者將透過回呼引數取得訊息結構：

   ```c
   typedef struct WasmEdge_LogMessage {
     WasmEdge_String Message;
     WasmEdge_String LoggerName;
     WasmEdge_LogLevel Level;
     time_t Time;
     uint64_t ThreadId;
   } WasmEdge_LogMessage;
   ```

   開發者可透過 `WasmEdge_LogSetCallback()` API 註冊回呼函式，以便在日誌發生時接收訊息。

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

### 值型別

為了描述 WASM 中的值型別，WasmEdge 使用 `WasmEdge_ValType` 結構來編碼值型別。

1. 數值型別：`i32`、`i64`、`f32`、`f64`，以及 `SIMD` 提案的 `v128`

   ```c
   WasmEdge_ValType ValType;
   ValType = WasmEdge_ValTypeGenI32();
   bool IsTypeI32 = WasmEdge_ValTypeIsI32(ValType);
   /* The `IsTypeI32` will be `TRUE`. */
   ValType = WasmEdge_ValTypeGenI64();
   bool IsTypeI64 = WasmEdge_ValTypeIsI64(ValType);
   /* The `IsTypeI64` will be `TRUE`. */
   ValType = WasmEdge_ValTypeGenF32();
   bool IsTypeF32 = WasmEdge_ValTypeIsF32(ValType);
   /* The `IsTypeF32` will be `TRUE`. */
   ValType = WasmEdge_ValTypeGenF64();
   bool IsTypeF64 = WasmEdge_ValTypeIsF64(ValType);
   /* The `IsTypeF64` will be `TRUE`. */
   ValType = WasmEdge_ValTypeGenV128();
   bool IsTypeV128 = WasmEdge_ValTypeIsV128(ValType);
   /* The `IsTypeV128` will be `TRUE`. */
   ```

2. 參照型別：`Reference-Types` 或 `Typed-Function References` 提案中的 `funcref` 與 `externref`

   ```c
   WasmEdge_ValType ValType;

   ValType = WasmEdge_ValTypeGenFuncRef();
   /* The nullable funcref type is generated. */
   bool IsTypeFuncRef = WasmEdge_ValTypeIsFuncRef(ValType);
   /* The `IsTypeFuncRef` will be `TRUE`. */
   bool IsTypeRef = WasmEdge_ValTypeIsRef(ValType);
   /* The `IsTypeRef` will be `TRUE`. */
   bool IsTypeNullableRef = WasmEdge_ValTypeIsRefNull(ValType);
   /* The `IsTypeNullableRef` will be `TRUE`. */

   ValType = WasmEdge_ValTypeGenExternRef();
   /* The nullable externref type is generated. */
   bool IsTypeExternRef = WasmEdge_ValTypeIsExternRef(ValType);
   /* The `IsTypeExternRef` will be `TRUE`. */
   IsTypeRef = WasmEdge_ValTypeIsRef(ValType);
   /* The `IsTypeRef` will be `TRUE`. */
   IsTypeNullableRef = WasmEdge_ValTypeIsRefNull(ValType);
   /* The `IsTypeNullableRef` will be `TRUE`. */
   ```

### 值

在 WasmEdge 中，開發者應透過 API 將值轉換為 `WasmEdge_Value` 物件，以便對應到 WASM 引數或回傳值的型別。透過這些 API，輸出的 `WasmEdge_Value` 物件將正確記錄值的型別與內容。

1. 數值型別：`i32`、`i64`、`f32`、`f64`，以及 `SIMD` 提案的 `v128`

   ```c
   WasmEdge_Value Val;

   Val = WasmEdge_ValueGenI32(123456);
   bool IsTypeI32 = WasmEdge_ValTypeIsI32(Val.Type);
   /* The `IsTypeI32` will be `TRUE`. */
   printf("%d\n", WasmEdge_ValueGetI32(Val));
   /* Will print "123456" */

   Val = WasmEdge_ValueGenI64(1234567890123LL);
   bool IsTypeI64 = WasmEdge_ValTypeIsI64(Val.Type);
   /* The `IsTypeI64` will be `TRUE`. */
   printf("%ld\n", WasmEdge_ValueGetI64(Val));
   /* Will print "1234567890123" */

   Val = WasmEdge_ValueGenF32(123.456f);
   bool IsTypeF32 = WasmEdge_ValTypeIsF32(Val.Type);
   /* The `IsTypeF32` will be `TRUE`. */
   printf("%f\n", WasmEdge_ValueGetF32(Val));
   /* Will print "123.456001" */

   Val = WasmEdge_ValueGenF64(123456.123456789);
   bool IsTypeF64 = WasmEdge_ValTypeIsF64(Val.Type);
   /* The `IsTypeF64` will be `TRUE`. */
   printf("%.10f\n", WasmEdge_ValueGetF64(Val));
   /* Will print "123456.1234567890" */
   ```

2. 參照型別：`Reference-Types` 或 `Typed-Function References` 提案中的 `funcref` 與 `externref`

   ```c
   WasmEdge_Value Val;
   void *Ptr;
   uint32_t Num = 10;
   /* Generate an externref to NULL. */
   Val = WasmEdge_ValueGenExternRef(NULL);
   bool IsNull = WasmEdge_ValueIsNullRef(Val);
   /* The `IsNull` will be `TRUE`. */
   bool IsTypeExternRef = WasmEdge_ValTypeIsExternRef(Val.Type);
   /* The `IsTypeExternRef` will be `TRUE`. */
   bool IsTypeRef = WasmEdge_ValTypeIsRef(Val.Type);
   /* The `IsTypeRef` will be `TRUE`. */
   bool IsTypeNullableRef = WasmEdge_ValTypeIsRefNull(Val.Type);
   /* The `IsTypeNullableRef` will be `TRUE`. */
   Ptr = WasmEdge_ValueGetExternRef(Val);
   /* The `Ptr` will be `NULL`. */

   /* Get the function instance by creation or from module instance. */
   const WasmEdge_FunctionInstanceContext *FuncCxt = ...;
   /* Generate a funcref with the given function instance context. */
   Val = WasmEdge_ValueGenFuncRef(FuncCxt);
   bool IsTypeFuncRef = WasmEdge_ValTypeIsFuncRef(Val.Type);
   /* The `IsTypeFuncRef` will be `TRUE`. */
   IsTypeRef = WasmEdge_ValTypeIsRef(Val.Type);
   /* The `IsTypeRef` will be `TRUE`. */
   IsTypeNullableRef = WasmEdge_ValTypeIsRefNull(Val.Type);
   /* The `IsTypeNullableRef` will be `TRUE`. */
   const WasmEdge_FunctionInstanceContext *GotFuncCxt =
       WasmEdge_ValueGetFuncRef(Val);
   /* The `GotFuncCxt` will be the same as `FuncCxt`. */

   /* Generate a externref to `Num`. */
   Val = WasmEdge_ValueGenExternRef(&Num);
   Ptr = WasmEdge_ValueGetExternRef(Val);
   /* The `Ptr` will be `&Num`. */
   printf("%u\n", *(uint32_t *)Ptr);
   /* Will print "10" */
   Num += 55;
   printf("%u\n", *(uint32_t *)Ptr);
   /* Will print "65" */
   ```

### 緩衝區

`WasmEdge_Bytes` 物件用於從記憶體載入或編譯模組的輸入緩衝區，或是序列化模組的輸出緩衝區。

<!-- prettier-ignore -->
:::note
此物件的設計目的是用以取代 WasmEdge C API 中作為輸入與輸出的原始緩衝區。我們建議開發者使用 `WasmEdge_Bytes` 相關 API，而非原始緩衝區，例如使用 `WasmEdge_LoaderParseFromBytes()` 而非 `WasmEdge_LoaderParseFromBuffer()`。
:::

1. 從具有長度的緩衝區建立 `WasmEdge_Bytes`。

   ```c
   uint8_t Buf[4] = {1, 2, 3, 4};
   WasmEdge_Bytes Bytes = WasmEdge_BytesCreate(Buf, 4);
   /* The objects should be deleted by `WasmEdge_BytesDelete()`. */
   WasmEdge_BytesDelete(Bytes);
   ```

2. 將 `WasmEdge_Bytes` 包裝到具有長度的緩衝區。

   內容不會被複製，呼叫者應自行確保輸入緩衝區的生命週期。

   ```c
   uint8_t Buf[4] = {1, 2, 3, 4};
   WasmEdge_Bytes Bytes = WasmEdge_BytesWrap(Buf, 4);
   /* The object should __NOT__ be deleted by `WasmEdge_BytesDelete()`. */
   ```

### 字串

`WasmEdge_String` 物件用於在呼叫 WASM 函式或尋找實例上下文時表示實例名稱。

1. 從 C 字串（以 NULL 結尾的 `const char *`）或具有長度的緩衝區建立 `WasmEdge_String`。

   C 字串或緩衝區的內容會被複製到 `WasmEdge_String` 物件中。

   ```c
   char Buf[4] = {50, 55, 60, 65};
   WasmEdge_String Str1 = WasmEdge_StringCreateByCString("test");
   WasmEdge_String Str2 = WasmEdge_StringCreateByBuffer(Buf, 4);
   /* The objects should be deleted by `WasmEdge_StringDelete()`. */
   WasmEdge_StringDelete(Str1);
   WasmEdge_StringDelete(Str2);
   ```

2. 將 `WasmEdge_String` 包裝到具有長度的緩衝區。

   內容不會被複製，呼叫者應自行確保輸入緩衝區的生命週期。

   ```c
   const char CStr[] = "test";
   WasmEdge_String Str = WasmEdge_StringWrap(CStr, 4);
   /* The object should __NOT__ be deleted by `WasmEdge_StringDelete()`. */
   ```

3. 字串比較

   ```c
   const char CStr[] = "abcd";
   char Buf[4] = {0x61, 0x62, 0x63, 0x64};
   WasmEdge_String Str1 = WasmEdge_StringWrap(CStr, 4);
   WasmEdge_String Str2 = WasmEdge_StringCreateByBuffer(Buf, 4);
   bool IsEq = WasmEdge_StringIsEqual(Str1, Str2);
   /* The `IsEq` will be `TRUE`. */
   WasmEdge_StringDelete(Str2);
   ```

4. 轉換為 C 字串

   ```c
   char Buf[256];
   WasmEdge_String Str =
       WasmEdge_StringCreateByCString("test_wasmedge_string");
   uint32_t StrLength = WasmEdge_StringCopy(Str, Buf, sizeof(Buf));
   /* StrLength will be 20 */
   printf("String: %s\n", Buf);
   /* Will print "test_wasmedge_string". */
   ```

### 執行結果

`WasmEdge_Result` 物件用於表示執行狀態。與 WASM 執行相關的 API 會回傳 `WasmEdge_Result` 以表示其狀態。

```c
WasmEdge_Result Res = WasmEdge_Result_Success;
bool IsSucceeded = WasmEdge_ResultOK(Res);
/* The `IsSucceeded` will be `TRUE`. */
uint32_t Code = WasmEdge_ResultGetCode(Res);
/* The `Code` will be 0. */
const char *Msg = WasmEdge_ResultGetMessage(Res);
/* The `Msg` will be "success". */
enum WasmEdge_ErrCategory Category = WasmEdge_ResultGetCategory(Res);
/* The `Category` will be WasmEdge_ErrCategory_WASM. */

Res = WasmEdge_ResultGen(WasmEdge_ErrCategory_UserLevelError, 123);
/* Generate the user-defined result with code. */
Code = WasmEdge_ResultGetCode(Res);
/* The `Code` will be 123. */
Category = WasmEdge_ResultGetCategory(Res);
/* The `Category` will be WasmEdge_ErrCategory_UserLevelError. */
```

### 上下文

諸如 `VM`、`Store` 與 `Function` 等物件皆由 `Context` 所組成。所有的上下文都可透過呼叫對應的建立 API 來建立，並應透過呼叫對應的刪除 API 來銷毀。開發者有責任管理這些上下文以進行記憶體管理。

```c
/* Create the configure context. */
WasmEdge_ConfigureContext *ConfCxt = WasmEdge_ConfigureCreate();
/* Delete the configure context. */
WasmEdge_ConfigureDelete(ConfCxt);
```

其他上下文的細節將於稍後介紹。

### WASM 資料結構

WASM 資料結構用於建立實例，或可從實例上下文查詢取得。建立實例的細節將在[實例](#instances)中介紹。

1. Limit 上下文

   `WasmEdge_LimitContext` 用於描述限制（limit）的最小值、最大值、可共用性，以及 64 位元位址型別（用於 Memory64 提案）。

   開發者可透過下列任一 API 來建立 `WasmEdge_LimitContext`：

   ```c
   /// Create a limit context without the maximum value.
   WasmEdge_LimitContext *WasmEdge_LimitCreate(const uint64_t Min,
                                               const bool Is64Bit);

   /// Create a limit context with the maximum value.
   WasmEdge_LimitContext *WasmEdge_LimitCreateWithMax(
       const uint64_t Min, const uint64_t Max,
       const bool Is64Bit, const bool IsShared);
   ```

   最小值與最大值以 `uint64_t` 的形式傳遞。`Is64Bit` 參數用於決定該限制上下文是否為 Memory64 提案所使用的 64 位元位址型別。對於 table 型別的使用，`IsShared` 參數應為 `false`。

   建立後，開發者可使用下列 API 來存取限制上下文的資訊：

   ```c
   /// Get the minimum value of the limit context.
   uint64_t WasmEdge_LimitGetMin(const WasmEdge_LimitContext *Cxt);
   /// Get the maximum value of the limit context.
   uint64_t WasmEdge_LimitGetMax(const WasmEdge_LimitContext *Cxt);
   /// Get the has-maximum option of the limit context.
   bool WasmEdge_LimitHasMax(const WasmEdge_LimitContext *Cxt);
   /// Get the shareable option of the limit context.
   bool WasmEdge_LimitIsShared(const WasmEdge_LimitContext *Cxt);
   /// Get the 64-bit address type option of the limit context.
   bool WasmEdge_LimitIs64Bit(const WasmEdge_LimitContext *Cxt);
   /// Compare 2 limit contexts.
   bool WasmEdge_LimitIsEqual(const WasmEdge_LimitContext *Lim1,
                              const WasmEdge_LimitContext *Lim2);
   ```

   開發者在使用完 `WasmEdge_LimitContext` 後，應呼叫 `WasmEdge_LimitDelete()` API 來銷毀它。請注意，由 `WasmEdge_TableTypeGetLimit()` 或 `WasmEdge_MemoryTypeGetLimit()` 回傳的 `WasmEdge_LimitContext` 為對應型別上下文所擁有，開發者__不應__將其刪除。

   ```c
   WasmEdge_LimitContext *LimCxt = WasmEdge_LimitCreateWithMax(10, 20, false, false);
   /* ... */
   WasmEdge_LimitDelete(LimCxt);
   ```

2. 函式型別上下文

   `Function Type` 上下文用於建立 `Function`、檢查 `Function` 實例的值型別，或從 VM 取得指定函式名稱的函式型別。開發者可使用 `Function Type` 上下文 API 取得參數或回傳值型別的資訊。

   ```c
   WasmEdge_ValType ParamList[2] = {WasmEdge_ValTypeGenI32(),
                                    WasmEdge_ValTypeGenI64()};
   WasmEdge_ValType ReturnList[1] = {WasmEdge_ValTypeGenFuncRef()};
   WasmEdge_FunctionTypeContext *FuncTypeCxt =
       WasmEdge_FunctionTypeCreate(ParamList, 2, ReturnList, 1);

   WasmEdge_ValType Buf[16];
   uint32_t ParamLen = WasmEdge_FunctionTypeGetParametersLength(FuncTypeCxt);
   /* `ParamLen` will be 2. */
   uint32_t GotParamLen = WasmEdge_FunctionTypeGetParameters(FuncTypeCxt, Buf, 16);
   /*
    * `GotParamLen` will be 2, and `Buf[0]` and `Buf[1]` will be the same as
    * `ParamList`.
    */
   uint32_t ReturnLen = WasmEdge_FunctionTypeGetReturnsLength(FuncTypeCxt);
   /* `ReturnLen` will be 1. */
   uint32_t GotReturnLen = WasmEdge_FunctionTypeGetReturns(FuncTypeCxt, Buf, 16);
   /*
    * `GotReturnLen` will be 1, and `Buf[0]` will be the same as `ReturnList`.
    */

   WasmEdge_FunctionTypeDelete(FuncTypeCxt);
   ```

3. Table 型別上下文

   `Table Type` 上下文用於建立 `Table` 實例，或從 `Table` 實例取得資訊。

   ```c
   /* Create a limit context with min=10, max=20, 32-bit address, non-shared. */
   WasmEdge_LimitContext *TabLim = WasmEdge_LimitCreateWithMax(10, 20, false, false);
   WasmEdge_TableTypeContext *TabTypeCxt =
       WasmEdge_TableTypeCreate(WasmEdge_ValTypeGenExternRef(), TabLim);
   /* The limit context is copied. Delete the local copy after the type creation. */
   WasmEdge_LimitDelete(TabLim);

   WasmEdge_ValType GotRefType = WasmEdge_TableTypeGetRefType(TabTypeCxt);
   bool IsTypeExternRef = WasmEdge_ValTypeIsExternRef(GotRefType);
   /* `IsTypeExternRef` will be `TRUE`. */
   bool IsTypeRef = WasmEdge_ValTypeIsRef(GotRefType);
   /* `IsTypeRef` will be `TRUE`. */
   bool IsTypeNullableRef = WasmEdge_ValTypeIsRefNull(GotRefType);
   /* `IsTypeNullableRef` will be `TRUE`. */
   const WasmEdge_LimitContext *GotTabLim = WasmEdge_TableTypeGetLimit(TabTypeCxt);
   /*
    * `GotTabLim` is owned by `TabTypeCxt` and should __NOT__ be deleted by
    * developers. The minimum, maximum, and other options can be queried via
    * the `WasmEdge_LimitGet*()` APIs.
    */

   WasmEdge_TableTypeDelete(TabTypeCxt);
   ```

4. Memory 型別上下文

   `Memory Type` 上下文用於建立 `Memory` 實例，或從 `Memory` 實例取得資訊。

   ```c
   /* Create a limit context with min=10, max=20, 32-bit address, non-shared. */
   WasmEdge_LimitContext *MemLim = WasmEdge_LimitCreateWithMax(10, 20, false, false);
   WasmEdge_MemoryTypeContext *MemTypeCxt = WasmEdge_MemoryTypeCreate(MemLim);
   WasmEdge_LimitDelete(MemLim);

   const WasmEdge_LimitContext *GotMemLim = WasmEdge_MemoryTypeGetLimit(MemTypeCxt);
   /* `GotMemLim` is owned by `MemTypeCxt` and should __NOT__ be deleted. */

   WasmEdge_MemoryTypeDelete(MemTypeCxt);
   ```

   開發者可將 `true` 作為 `WasmEdge_LimitCreate()` 或 `WasmEdge_LimitCreateWithMax()` 的 `Is64Bit` 參數，以建立 64 位元的 memory 型別，這會被 [Memory64 提案](https://github.com/WebAssembly/memory64)所使用。

5. Global 型別上下文

   `Global Type` 上下文用於建立 `Global` 實例，或從 `Global` 實例取得資訊。

   ```c
   WasmEdge_GlobalTypeContext *GlobTypeCxt = WasmEdge_GlobalTypeCreate(
       WasmEdge_ValTypeGenF64(), WasmEdge_Mutability_Var);

   WasmEdge_ValType GotValType = WasmEdge_GlobalTypeGetValType(GlobTypeCxt);
   bool IsTypeF64 = WasmEdge_ValTypeIsF64(GotValType);
   /* `IsTypeF64` will be `TRUE`. */
   WasmEdge_Mutability GotValMut =
       WasmEdge_GlobalTypeGetMutability(GlobTypeCxt);
   /* `GotValMut` will be WasmEdge_Mutability_Var. */

   WasmEdge_GlobalTypeDelete(GlobTypeCxt);
   ```

6. Tag 型別上下文

   `Tag Type` 上下文用於從 `Tag` 實例取得資訊。
   只有在開啟 `Exception Handling` 提案時才能使用。

   ```c
   /* Get the tag type from a tag instance. */
   const WasmEdge_TagTypeContext *TagTypeCxt = WasmEdge_TagInstanceGetTagType(...);

   const WasmEdge_FunctionTypeContext *FuncTypeCxt =
       WasmEdge_TagTypeGetFunctionType(TagTypeCxt);
   ```

7. Import 型別上下文

   `Import Type` 上下文用於從 [AST 模組](#ast-module)取得匯入資訊。開發者可從 `Import Type` 上下文取得外部型別（`function`、`table`、`memory`、`tag` 或 `global`）、匯入模組名稱以及外部名稱。查詢 `Import Type` 上下文的細節將於 [AST 模組](#ast-module)中介紹。

   ```c
   WasmEdge_ASTModuleContext *ASTCxt = ...;
   /*
    * Assume that `ASTCxt` is returned by the `WasmEdge_LoaderContext` for the
    * result of loading a WASM file.
    */
   const WasmEdge_ImportTypeContext *ImpType = ...;
   /* Assume that `ImpType` is queried from the `ASTCxt` for the import. */

   enum WasmEdge_ExternalType ExtType =
       WasmEdge_ImportTypeGetExternalType(ImpType);
   /*
    * The `ExtType` can be one of `WasmEdge_ExternalType_Function`,
    * `WasmEdge_ExternalType_Table`, `WasmEdge_ExternalType_Memory`,
    * `WasmEdge_ExternalType_Tag`, or `WasmEdge_ExternalType_Global`.
    */
   WasmEdge_String ModName = WasmEdge_ImportTypeGetModuleName(ImpType);
   WasmEdge_String ExtName = WasmEdge_ImportTypeGetExternalName(ImpType);
   /*
    * The `ModName` and `ExtName` should not be destroyed and the string
    * buffers are binded into the `ASTCxt`.
    */
   const WasmEdge_FunctionTypeContext *FuncTypeCxt =
       WasmEdge_ImportTypeGetFunctionType(ASTCxt, ImpType);
   /*
    * If the `ExtType` is not `WasmEdge_ExternalType_Function`, the
    * `FuncTypeCxt` will be NULL.
    */
   const WasmEdge_TableTypeContext *TabTypeCxt =
       WasmEdge_ImportTypeGetTableType(ASTCxt, ImpType);
   /*
    * If the `ExtType` is not `WasmEdge_ExternalType_Table`, the `TabTypeCxt`
    * will be NULL.
    */
   const WasmEdge_MemoryTypeContext *MemTypeCxt =
       WasmEdge_ImportTypeGetMemoryType(ASTCxt, ImpType);
   /*
    * If the `ExtType` is not `WasmEdge_ExternalType_Memory`, the `MemTypeCxt`
    * will be NULL.
    */
   const WasmEdge_TagTypeContext *TagTypeCxt =
       WasmEdge_ImportTypeGetTagType(ASTCxt, ImpType);
   /*
    * If the `ExtType` is not `WasmEdge_ExternalType_Tag`, the `TagTypeCxt`
    * will be NULL.
    */
   const WasmEdge_GlobalTypeContext *GlobTypeCxt =
       WasmEdge_ImportTypeGetGlobalType(ASTCxt, ImpType);
   /*
    * If the `ExtType` is not `WasmEdge_ExternalType_Global`, the `GlobTypeCxt`
    * will be NULL.
    */
   ```

8. Export 型別上下文

   `Export Type` 上下文用於從 [AST 模組](#ast-module)取得匯出資訊。開發者可從 `Export Type` 上下文取得外部型別（`function`、`table`、`memory`、`tag` 或 `global`）以及外部名稱。查詢 `Export Type` 上下文的細節將於 [AST 模組](#ast-module)中介紹。

   ```c
   WasmEdge_ASTModuleContext *ASTCxt = ...;
   /*
    * Assume that `ASTCxt` is returned by the `WasmEdge_LoaderContext` for the
    * result of loading a WASM file.
    */
   const WasmEdge_ExportTypeContext *ExpType = ...;
   /* Assume that `ExpType` is queried from the `ASTCxt` for the export. */

   enum WasmEdge_ExternalType ExtType =
       WasmEdge_ExportTypeGetExternalType(ExpType);
   /*
    * The `ExtType` can be one of `WasmEdge_ExternalType_Function`,
    * `WasmEdge_ExternalType_Table`, `WasmEdge_ExternalType_Memory`,
    * `WasmEdge_ExternalType_Tag`, or `WasmEdge_ExternalType_Global`.
    */
   WasmEdge_String ExtName = WasmEdge_ExportTypeGetExternalName(ExpType);
   /*
    * The `ExtName` should not be destroyed and the string buffer is binded
    * into the `ASTCxt`.
    */
   const WasmEdge_FunctionTypeContext *FuncTypeCxt =
       WasmEdge_ExportTypeGetFunctionType(ASTCxt, ExpType);
   /*
    * If the `ExtType` is not `WasmEdge_ExternalType_Function`, the
    * `FuncTypeCxt` will be NULL.
    */
   const WasmEdge_TableTypeContext *TabTypeCxt =
       WasmEdge_ExportTypeGetTableType(ASTCxt, ExpType);
   /*
    * If the `ExtType` is not `WasmEdge_ExternalType_Table`, the `TabTypeCxt`
    * will be NULL.
    */
   const WasmEdge_MemoryTypeContext *MemTypeCxt =
       WasmEdge_ExportTypeGetMemoryType(ASTCxt, ExpType);
   /*
    * If the `ExtType` is not `WasmEdge_ExternalType_Memory`, the `MemTypeCxt`
    * will be NULL.
    */
   const WasmEdge_TagTypeContext *TagTypeCxt =
       WasmEdge_ExportTypeGetTagType(ASTCxt, ExpType);
   /*
    * If the `ExtType` is not `WasmEdge_ExternalType_Tag`, the `TagTypeCxt`
    * will be NULL.
    */
   const WasmEdge_GlobalTypeContext *GlobTypeCxt =
       WasmEdge_ExportTypeGetGlobalType(ASTCxt, ExpType);
   /*
    * If the `ExtType` is not `WasmEdge_ExternalType_Global`, the `GlobTypeCxt`
    * will be NULL.
    */
   ```

### 非同步

在呼叫[非同步執行 API](#asynchronous-execution) 之後，開發者將取得 `WasmEdge_Async` 物件。開發者擁有此物件，並應呼叫 `WasmEdge_AsyncDelete()` API 來銷毀它。

1. 等待非同步執行

   開發者可等待執行直到完成：

   ```c
   WasmEdge_Async *Async = ...; /* Ignored. Asynchronous execute a function. */
   /* Blocking and waiting for the execution. */
   WasmEdge_AsyncWait(Async);
   WasmEdge_AsyncDelete(Async);
   ```

   或者開發者可設定等待的時間上限。若超出時間上限，開發者可選擇取消執行。對於 AOT 模式下可中斷的執行，開發者應透過 `WasmEdge_ConfigureCompilerSetInterruptible()` API 將 `TRUE` 設定到 AOT 編譯器的設定上下文中。

   ```c
   WasmEdge_Async *Async = ...; /* Ignored. Asynchronous execute a function. */
   /* Blocking and waiting for the execution for 1 second. */
   bool IsEnd = WasmEdge_AsyncWaitFor(Async, 1000);
   if (IsEnd) {
     /* The execution finished. Developers can get the result. */
     WasmEdge_Result Res = WasmEdge_AsyncGet(/* ... Ignored */);
   } else {
     /*
      * The time limit exceeded. Developers can keep waiting or cancel the
      * execution.
      */
     WasmEdge_AsyncCancel(Async);
     WasmEdge_Result Res = WasmEdge_AsyncGet(Async, 0, NULL);
     /* The result error code will be `WasmEdge_ErrCode_Interrupted`. */
   }
   WasmEdge_AsyncDelete(Async);
   ```

2. 取得非同步執行的結果

   開發者可使用 `WasmEdge_AsyncGetReturnsLength()` API 取得回傳值清單的長度。此函式會阻塞並等待執行。若執行已完成，此函式會立即回傳長度。若執行失敗，此函式將回傳 `0`。此函式可協助開發者建立緩衝區以取得回傳值。若開發者已知緩衝區長度，可略過此函式並使用 `WasmEdge_AsyncGet()` API 取得結果。

   ```c
   WasmEdge_Async *Async = ...; /* Ignored. Asynchronous execute a function. */
   /*
    * Blocking and waiting for the execution and get the return value list
    * length.
    */
   uint32_t Arity = WasmEdge_AsyncGetReturnsLength(Async);
   WasmEdge_AsyncDelete(Async);
   ```

   `WasmEdge_AsyncGet()` API 會阻塞並等待執行。若執行已完成，此函式將把回傳值填入緩衝區並立即回傳執行結果。

   ```c
   WasmEdge_Async *Async = ...; /* Ignored. Asynchronous execute a function. */
   /* Blocking and waiting for the execution and get the return values. */
   const uint32_t BUF_LEN = 256;
   WasmEdge_Value Buf[BUF_LEN];
   WasmEdge_Result Res = WasmEdge_AsyncGet(Async, Buf, BUF_LEN);
   WasmEdge_AsyncDelete(Async);
   ```

### 設定

設定上下文 `WasmEdge_ConfigureContext` 管理 `Loader`、`Validator`、`Executor`、`VM` 與 `Compiler` 上下文的設定。開發者可調整關於提案、VM 主機預先註冊（例如 `WASI`）以及 AOT 編譯器選項的設定，然後將 `Configure` 上下文套用以建立執行環境上下文。

1. 標準

   WasmEdge 支援從最早的 `1.0` 版本起的 WebAssembly 標準。開發者可使用 `WasmEdge_ConfigureSetWASMStandard()` API 將 WASM 標準指派到 `Configure` 上下文。在指派 WASM 標準後，對應的 WASM 提案將會被啟用或停用，且所有提案的設定都會被覆寫。

   下列 WASM 標準受支援：

   ```c
   enum WasmEdge_Standard {
     WasmEdge_Standard_WASM_1, // WASM 1.0
     WasmEdge_Standard_WASM_2, // WASM 2.0
     WasmEdge_Standard_WASM_3, // WASM 3.0, default
   }
   ```

   ```c
   /* By default, the standard is WASM 3.0. */
   WasmEdge_ConfigureContext *ConfCxt = WasmEdge_ConfigureCreate();

   /* The `IsMultiRet` will be `TRUE`. */
   bool IsMultiRet =
       WasmEdge_ConfigureHasProposal(ConfCxt, WasmEdge_Proposal_MultiValue);

   /* Remove the Multi-value returns proposal, which is in WASM 2.0. */
   WasmEdge_ConfigureRemoveProposal(ConfCxt, WasmEdge_Proposal_MultiValue);

   /* The `IsMultiRet` will be `FALSE`. */
   IsMultiRet =
       WasmEdge_ConfigureHasProposal(ConfCxt, WasmEdge_Proposal_MultiValue);

   /* Set the standard to WASM 2.0. All proposal settings is reset. */
   WasmEdge_ConfigureSetWASMStandard(ConfCxt, WasmEdge_Standard_WASM_2);

   /* The `IsMultiRet` will be `TRUE`. */
   IsMultiRet =
       WasmEdge_ConfigureHasProposal(ConfCxt, WasmEdge_Proposal_MultiValue);

   /* Set the standard to WASM 1.0. All proposal settings is reset. */
   WasmEdge_ConfigureSetWASMStandard(ConfCxt, WasmEdge_Standard_WASM_1);

   /* The `IsMultiRet` will be `FALSE`. */
   IsMultiRet =
       WasmEdge_ConfigureHasProposal(ConfCxt, WasmEdge_Proposal_MultiValue);

   WasmEdge_ConfigureDelete(ConfCxt);
   ```

2. 提案

   WasmEdge 支援開啟或關閉 WebAssembly 提案。此設定對於以 `Configure` 上下文建立的任何上下文皆有效。

   ```c
   enum WasmEdge_Proposal {
     WasmEdge_Proposal_ImportExportMutGlobals = 0,
     WasmEdge_Proposal_NonTrapFloatToIntConversions,
     WasmEdge_Proposal_SignExtensionOperators,
     WasmEdge_Proposal_MultiValue,
     WasmEdge_Proposal_BulkMemoryOperations,
     WasmEdge_Proposal_ReferenceTypes,
     WasmEdge_Proposal_SIMD,
     WasmEdge_Proposal_TailCall,
     WasmEdge_Proposal_ExtendedConst,
     WasmEdge_Proposal_FunctionReferences,
     WasmEdge_Proposal_GC,
     WasmEdge_Proposal_MultiMemories,
     WasmEdge_Proposal_RelaxSIMD,
     WasmEdge_Proposal_Annotations,       // NOT IMPLEMENTED
     WasmEdge_Proposal_ExceptionHandling,
     WasmEdge_Proposal_Memory64,
     WasmEdge_Proposal_Threads,
     WasmEdge_Proposal_Component,
   };
   ```

   開發者可將提案加入或從 `Configure` 上下文中移除。

   ```c
   /*
    * By default, the following proposals have turned on initially:
    * * WASM 1.0 Proposals:
    *    * Import/Export of mutable globals
    * * WASM 2.0 Proposals:
    *    * Non-trapping float-to-int conversions
    *    * Sign-extension operators
    *    * Multi-value returns
    *    * Bulk memory operations
    *    * Reference types
    *    * Fixed-width SIMD
    * * WASM 3.0 Proposals:
    *    * Tail-call
    *    * Extended-const
    *    * Typed-function references
    *    * GC
    *    * Multiple memories
    *    * Relaxed SIMD
    *    * Memory64
    *    * Exception handling (interpreter only)
    *
    * For the current WasmEdge version, the following proposals are supported
    * (turned off by default) additionally:
    * * Threads
    * * Component model (loader and validator phase only)
    */
   WasmEdge_ConfigureContext *ConfCxt = WasmEdge_ConfigureCreate();
   WasmEdge_ConfigureAddProposal(ConfCxt, WasmEdge_Proposal_Threads);
   WasmEdge_ConfigureRemoveProposal(ConfCxt, WasmEdge_Proposal_GC);
   bool IsBulkMem = WasmEdge_ConfigureHasProposal(
       ConfCxt, WasmEdge_Proposal_BulkMemoryOperations);
   /* The `IsBulkMem` will be `TRUE`. */
   WasmEdge_ConfigureDelete(ConfCxt);
   ```

3. 主機註冊

   此設定用於 `VM` 上下文以開啟 `WASI` 支援，且僅在 `VM` 上下文中有效。

   此列舉的元素保留供未來其他內建主機函式（例如 `wasi-socket`）使用。

   ```c
   enum WasmEdge_HostRegistration {
     WasmEdge_HostRegistration_Wasi = 0
   };
   ```

   詳細內容將於 [VM 上下文的預先註冊](#built-in-host-modules-and-plug-in-preregistrations)中介紹。

   ```c
   WasmEdge_ConfigureContext *ConfCxt = WasmEdge_ConfigureCreate();
   bool IsHostWasi = WasmEdge_ConfigureHasHostRegistration(
       ConfCxt, WasmEdge_HostRegistration_Wasi);
   /* The `IsHostWasi` will be `FALSE`. */
   WasmEdge_ConfigureAddHostRegistration(ConfCxt,
                                         WasmEdge_HostRegistration_Wasi);
   IsHostWasi = WasmEdge_ConfigureHasHostRegistration(
       ConfCxt, WasmEdge_HostRegistration_Wasi);
   /* The `IsHostWasi` will be `TRUE`. */
   WasmEdge_ConfigureDelete(ConfCxt);
   ```

4. 最大記憶體頁數

   開發者可透過此設定限制 memory 實例的頁數大小。當在 WASM 執行中擴大 memory 實例的頁數而超過限制大小時，頁數擴大會失敗。此設定僅在 `Executor` 與 `VM` 上下文中有效。

   ```c
   WasmEdge_ConfigureContext *ConfCxt = WasmEdge_ConfigureCreate();
   uint32_t PageSize = WasmEdge_ConfigureGetMaxMemoryPage(ConfCxt);
   /* By default, the maximum memory page size is 65536. */
   WasmEdge_ConfigureSetMaxMemoryPage(ConfCxt, 1024);
   /*
    * Limit the memory size of each memory instance with not larger than 1024
    * pages (64 MiB).
    */
   PageSize = WasmEdge_ConfigureGetMaxMemoryPage(ConfCxt);
   /* The `PageSize` will be 1024. */
   WasmEdge_ConfigureDelete(ConfCxt);
   ```

5. 執行模式

   WasmEdge 為 WASM 執行引擎支援三種狀態的執行模式：直譯器、JIT 或 AOT。開發者可使用 `WasmEdge_ConfigureSetRunMode()` API 來選擇引擎：

   ```c
   enum WasmEdge_RunMode {
     WasmEdge_RunMode_Interpreter = 0, // Default, interpreter mode.
     WasmEdge_RunMode_JIT,             // JIT mode.
     WasmEdge_RunMode_AOT,             // AOT mode.
   };
   ```

   只有 `WasmEdge_RunMode_AOT` 會載入 universal WASM 中的 AOT 自訂區段，或是以 `dlopen` 載入共用函式庫形式的 WASM 產物。在其他模式中，AOT 資料會被忽略，而共用函式庫形式的輸入會在抽取其內嵌位元組後以一般 WASM 重新載入。

   ```c
   WasmEdge_ConfigureContext *ConfCxt = WasmEdge_ConfigureCreate();
   enum WasmEdge_RunMode Mode = WasmEdge_ConfigureGetRunMode(ConfCxt);
   /* By default, `Mode` will be `WasmEdge_RunMode_Interpreter`. */
   WasmEdge_ConfigureSetRunMode(ConfCxt, WasmEdge_RunMode_AOT);
   Mode = WasmEdge_ConfigureGetRunMode(ConfCxt);
   /* `Mode` will be `WasmEdge_RunMode_AOT`. */
   WasmEdge_ConfigureDelete(ConfCxt);
   ```

   <!-- prettier-ignore -->
   :::note
   `WasmEdge_ConfigureSetForceInterpreter()` 與 `WasmEdge_ConfigureIsForceInterpreter()` API 自 `0.17.0` 版本起已被棄用。開發者應改用 `WasmEdge_ConfigureSetRunMode()` 與 `WasmEdge_ConfigureGetRunMode()` API。
   :::

6. AOT 編譯器選項

   AOT 編譯器選項用以設定最佳化等級、輸出格式、傾印 IR 以及通用二進位檔的行為。

   ```c
   enum WasmEdge_CompilerOptimizationLevel {
     // Disable as many optimizations as possible.
     WasmEdge_CompilerOptimizationLevel_O0 = 0,
     // Optimize quickly without destroying debuggability.
     WasmEdge_CompilerOptimizationLevel_O1,
     // Optimize for fast execution as much as possible without triggering
     // significant incremental compile time or code size growth.
     WasmEdge_CompilerOptimizationLevel_O2,
     // Optimize for fast execution as much as possible.
     WasmEdge_CompilerOptimizationLevel_O3,
     // Optimize for small code size as much as possible without triggering
     // significant incremental compile time or execution time slowdowns.
     WasmEdge_CompilerOptimizationLevel_Os,
     // Optimize for small code size as much as possible.
     WasmEdge_CompilerOptimizationLevel_Oz
   };

   enum WasmEdge_CompilerOutputFormat {
     // Native dynamic library format.
     WasmEdge_CompilerOutputFormat_Native = 0,
     // WebAssembly with AOT compiled codes in custom section.
     WasmEdge_CompilerOutputFormat_Wasm
   };
   ```

   這些設定僅在 `Compiler` 上下文中有效。

   ```c
   WasmEdge_ConfigureContext *ConfCxt = WasmEdge_ConfigureCreate();
   /* By default, the optimization level is O3. */
   WasmEdge_ConfigureCompilerSetOptimizationLevel(
       ConfCxt, WasmEdge_CompilerOptimizationLevel_O2);
   /* By default, the output format is universal WASM. */
   WasmEdge_ConfigureCompilerSetOutputFormat(
       ConfCxt, WasmEdge_CompilerOutputFormat_Native);
   /* By default, the dump IR is `FALSE`. */
   WasmEdge_ConfigureCompilerSetDumpIR(ConfCxt, TRUE);
   /* By default, the generic binary is `FALSE`. */
   WasmEdge_ConfigureCompilerSetGenericBinary(ConfCxt, TRUE);
   /* By default, the interruptible is `FALSE`.
   /* Set this option to `TRUE` to support the interruptible execution in AOT
   mode. */
   WasmEdge_ConfigureCompilerSetInterruptible(ConfCxt, TRUE);
   WasmEdge_ConfigureDelete(ConfCxt);
   ```

7. 統計選項

   統計選項用以設定執行環境與 AOT 編譯器中關於指令計數、成本量測與時間量測的行為。這些設定在 `Compiler`、`VM` 與 `Executor` 上下文中皆有效。

   ```c
   WasmEdge_ConfigureContext *ConfCxt = WasmEdge_ConfigureCreate();
   /*
    * By default, the instruction counting is `FALSE` when running a
    * compiled-WASM or a pure-WASM.
    */
   WasmEdge_ConfigureStatisticsSetInstructionCounting(ConfCxt, TRUE);
   /*
    * By default, the cost measurement is `FALSE` when running a compiled-WASM
    * or a pure-WASM.
    */
   WasmEdge_ConfigureStatisticsSetCostMeasuring(ConfCxt, TRUE);
   /*
    * By default, the time measurement is `FALSE` when running a compiled-WASM
    * or a pure-WASM.
    */
   WasmEdge_ConfigureStatisticsSetTimeMeasuring(ConfCxt, TRUE);
   WasmEdge_ConfigureDelete(ConfCxt);
   ```

### 統計

統計上下文 `WasmEdge_StatisticsContext` 在執行環境中提供指令計數器、成本加總以及成本限制。

在使用統計之前，必須先設定統計組態。否則呼叫統計時的回傳值將為未定義行為。

1. 指令計數器

   指令計數器可協助開發者分析 WASM 執行的效能。開發者可從 `VM` 上下文取得 `Statistics` 上下文，或建立一個新的以用於 `Executor` 的建立。細節將於後續部分介紹。

   ```c
   WasmEdge_StatisticsContext *StatCxt = WasmEdge_StatisticsCreate();
   /*
    * ...
    * After running the WASM functions with the `Statistics` context
    */
   uint32_t Count = WasmEdge_StatisticsGetInstrCount(StatCxt);
   double IPS = WasmEdge_StatisticsGetInstrPerSecond(StatCxt);
   WasmEdge_StatisticsDelete(StatCxt);
   ```

2. 成本表

   成本表用以依指令權重累計指令的成本。開發者可將成本表陣列（索引為指令的位元組碼值，值為指令的成本）設定到 `Statistics` 上下文中。若設定了成本限制值，當執行時超過成本限制，將立即回傳 `cost limit exceeded` 錯誤。

   ```c
   WasmEdge_StatisticsContext *StatCxt = WasmEdge_StatisticsCreate();
   uint64_t CostTable[16] = {
     0, 0,
     10, /* 0x02: Block */
     11, /* 0x03: Loop */
     12, /* 0x04: If */
     12, /* 0x05: Else */
     0, 0, 0, 0, 0, 0,
     20, /* 0x0C: Br */
     21, /* 0x0D: Br_if */
     22, /* 0x0E: Br_table */
     0
   };
   /*
    * Developers can set the costs of each instruction. The value not
    * covered will be 0.
    */
   WasmEdge_StatisticsSetCostTable(StatCxt, CostTable, 16);
   WasmEdge_StatisticsSetCostLimit(StatCxt, 5000000);
   /*
    * ...
    * After running the WASM functions with the `Statistics` context
    */
   uint64_t Cost = WasmEdge_StatisticsGetTotalCost(StatCxt);
   WasmEdge_StatisticsDelete(StatCxt);
   ```

## WasmEdge VM

在此部分，我們將介紹 `WasmEdge_VMContext` 物件的函式，並展示執行 WASM 函式的範例。

### 使用 VM 上下文的 WASM 執行範例

下例展示執行 WASM 來取得 Fibonacci 的範例。此範例使用 [fibonacci.wat](https://raw.githubusercontent.com/WasmEdge/WasmEdge/master/examples/wasm/fibonacci.wat)。

<!-- prettier-ignore -->
:::note
`fibonacci.wat` 檔案以文字格式提供。使用者應使用 [WABT 工具](https://github.com/WebAssembly/wabt)將其轉換為對應的 WASM 二進位格式。
:::

```wasm
(module
  (export "fib" (func $fib))
  (func $fib (param $n i32) (result i32)
    (if
      (i32.lt_s (get_local $n)(i32.const 2))
      (return (i32.const 1))
    )
    (return
      (i32.add
        (call $fib (i32.sub (get_local $n)(i32.const 2)))
        (call $fib (i32.sub (get_local $n)(i32.const 1)))
      )
    )
  )
)
```

1. 快速執行 WASM 函式

   假設 WASM 檔案 [`fibonacci.wasm`](https://raw.githubusercontent.com/WasmEdge/WasmEdge/master/examples/wasm/fibonacci.wat) 已複製到目前目錄，且 C 檔案 `test.c` 內容如下：

   <!-- prettier-ignore -->
   :::note
   `fibonacci.wat` 檔案以文字格式提供。使用者應使用 [WABT 工具](https://github.com/WebAssembly/wabt)將其轉換為對應的 WASM 二進位格式。
   :::

   ```c
   #include <stdio.h>
   #include <wasmedge/wasmedge.h>
   int main() {
     /* Create the configure context and add the WASI support. */
     /* This step is not necessary unless you need WASI support. */
     WasmEdge_ConfigureContext *ConfCxt = WasmEdge_ConfigureCreate();
     WasmEdge_ConfigureAddHostRegistration(ConfCxt,
                                           WasmEdge_HostRegistration_Wasi);
     /* The configure and store context to the VM creation can be NULL. */
     WasmEdge_VMContext *VMCxt = WasmEdge_VMCreate(ConfCxt, NULL);

     /* The parameters and returns arrays. */
     WasmEdge_Value Params[1] = {WasmEdge_ValueGenI32(5)};
     WasmEdge_Value Returns[1];
     /* Function name. */
     WasmEdge_String FuncName = WasmEdge_StringCreateByCString("fib");
     /* Run the WASM function from file. */
     WasmEdge_Result Res = WasmEdge_VMRunWasmFromFile(
         VMCxt, "fibonacci.wasm", FuncName, Params, 1, Returns, 1);
     /*
      * Developers can run the WASM binary from buffer with the
      * `WasmEdge_VMRunWasmFromBytes()` API, or from
      * `WasmEdge_ASTModuleContext` object with the
      * `WasmEdge_VMRunWasmFromASTModule()` API.
      */

     if (WasmEdge_ResultOK(Res)) {
       printf("Get the result: %d\n", WasmEdge_ValueGetI32(Returns[0]));
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

   接著您可以編譯並執行：（以 0 起算的第 5 個 Fibonacci 數為 8）

   ```bash
   $ gcc test.c -lwasmedge
   $ ./a.out
   Get the result: 8
   ```

2. 手動實例化並執行 WASM 函式

   除上述範例外，開發者可使用 `VM` 上下文 API 一步一步地執行 WASM 函式：

   ```c
   #include <wasmedge/wasmedge.h>
   #include <stdio.h>
   int main() {
     /* Create the configure context and add the WASI support. */
     /* This step is not necessary unless you need the WASI support. */
     WasmEdge_ConfigureContext *ConfCxt = WasmEdge_ConfigureCreate();
     WasmEdge_ConfigureAddHostRegistration(ConfCxt,
                                           WasmEdge_HostRegistration_Wasi);
     /* The configure and store context to the VM creation can be NULL. */
     WasmEdge_VMContext *VMCxt = WasmEdge_VMCreate(ConfCxt, NULL);

     /* The parameters and returns arrays. */
     WasmEdge_Value Params[1] = {WasmEdge_ValueGenI32(10)};
     WasmEdge_Value Returns[1];
     /* Function name. */
     WasmEdge_String FuncName = WasmEdge_StringCreateByCString("fib");
     /* Result. */
     WasmEdge_Result Res;

     /* Step 1: Load WASM file. */
     Res = WasmEdge_VMLoadWasmFromFile(VMCxt, "fibonacci.wasm");
     /*
      * Developers can load the WASM binary from buffer with the
      * `WasmEdge_VMLoadWasmFromBytes()` API, or from
      * `WasmEdge_ASTModuleContext` object with the
      * `WasmEdge_VMLoadWasmFromASTModule()` API.
      */
     if (!WasmEdge_ResultOK(Res)) {
       printf("Loading phase failed: %s\n", WasmEdge_ResultGetMessage(Res));
       return 1;
     }
     /* Step 2: Validate the WASM module. */
     Res = WasmEdge_VMValidate(VMCxt);
     if (!WasmEdge_ResultOK(Res)) {
       printf("Validation phase failed: %s\n", WasmEdge_ResultGetMessage(Res));
       return 1;
     }
     /* Step 3: Instantiate the WASM module. */
     Res = WasmEdge_VMInstantiate(VMCxt);
     /*
      * Developers can load, validate, and instantiate another WASM module to
      * replace the instantiated one. In this case, the old module will be
      * cleared, but the registered modules are still kept.
      */
     if (!WasmEdge_ResultOK(Res)) {
       printf("Instantiation phase failed: %s\n",
              WasmEdge_ResultGetMessage(Res));
       return 1;
     }
     /*
      * Step 4: Execute WASM functions. You can execute functions repeatedly
      * after instantiation.
      */
     Res = WasmEdge_VMExecute(VMCxt, FuncName, Params, 1, Returns, 1);
     if (WasmEdge_ResultOK(Res)) {
       printf("Get the result: %d\n", WasmEdge_ValueGetI32(Returns[0]));
     } else {
       printf("Execution phase failed: %s\n", WasmEdge_ResultGetMessage(Res));
     }

     /* Resources deallocations. */
     WasmEdge_VMDelete(VMCxt);
     WasmEdge_ConfigureDelete(ConfCxt);
     WasmEdge_StringDelete(FuncName);
     return 0;
   }
   ```

   接著您可以編譯並執行：（以 0 起算的第 10 個 Fibonacci 數為 89）

   ```bash
   $ gcc test.c -lwasmedge
   $ ./a.out
   Get the result: 89
   ```

   下圖說明 `VM` 上下文的狀態。

   ```text
                          |========================|
                 |------->|      VM: Initiated     |
                 |        |========================|
                 |                    |
                 |                 LoadWasm
                 |                    |
                 |                    v
                 |        |========================|
                 |--------|       VM: Loaded       |<-------|
                 |        |========================|        |
                 |              |            ^              |
                 |         Validate          |              |
             Cleanup            |          LoadWasm         |
                 |              v            |            LoadWasm
                 |        |========================|        |
                 |--------|      VM: Validated     |        |
                 |        |========================|        |
                 |              |            ^              |
                 |      Instantiate          |              |
                 |              |          RegisterModule   |
                 |              v            |              |
                 |        |========================|        |
                 |--------|    VM: Instantiated    |--------|
                          |========================|
                                |            ^
                                |            |
                                --------------
                   Instantiate, Execute, ExecuteRegistered
   ```

   `VM` 上下文於建立時的狀態為 `Inited`。在成功載入 WASM 後，狀態會變為 `Loaded`。在成功驗證 WASM 後，狀態會變為 `Validated`。在成功實例化 WASM 後，狀態會變為 `Instantiated`，此時開發者可呼叫函式。開發者可在任何狀態下註冊 WASM 或模組實例，但必須再次實例化 WASM。開發者也可在任何狀態下載入 WASM，但在呼叫函式之前，應先驗證並實例化該 WASM 模組。在 `Instantiated` 狀態下，開發者可再次實例化 WASM 模組以重設舊的 WASM 執行環境結構。

### VM 建立

`VM` 建立 API 接受 `Configure` 上下文與 `Store` 上下文。如果開發者只需要預設設定，僅需將 `NULL` 傳入建立 API 即可。`Store` 上下文的細節將於 [Store](#store) 中介紹。

```c
WasmEdge_ConfigureContext *ConfCxt = WasmEdge_ConfigureCreate();
WasmEdge_StoreContext *StoreCxt = WasmEdge_StoreCreate();
WasmEdge_VMContext *VMCxt = WasmEdge_VMCreate(ConfCxt, StoreCxt);
/* The caller should guarantee the life cycle if the store context. */
WasmEdge_StatisticsContext *StatCxt = WasmEdge_VMGetStatisticsContext(VMCxt);
/*
 * The VM context already contains the statistics context and can be retrieved
 * by this API.
 */
/*
 * Note that the retrieved store and statistics contexts from the VM contexts by
 * VM APIs should __NOT__ be destroyed and owned by the VM contexts.
 */
WasmEdge_VMDelete(VMCxt);
WasmEdge_StoreDelete(StoreCxt);
WasmEdge_ConfigureDelete(ConfCxt);
```

### 內建主機模組與外掛預先註冊

WasmEdge 提供下列內建主機模組與外掛預先註冊。

1. [WASI（WebAssembly System Interface）](https://github.com/WebAssembly/WASI)

   開發者可在 `Configure` 上下文中開啟 VM 的 WASI 支援。

   ```c
   WasmEdge_ConfigureContext *ConfCxt = WasmEdge_ConfigureCreate();
   WasmEdge_ConfigureAddHostRegistration(ConfCxt,
                                         WasmEdge_HostRegistration_Wasi);
   WasmEdge_VMContext *VMCxt = WasmEdge_VMCreate(ConfCxt, NULL);
   WasmEdge_ConfigureDelete(ConfCxt);
   /*
    * The following API can retrieve the built-in registered module instances
    * from the VM context.
    */
   /*
    * This API will return `NULL` if the corresponding configuration is not set
    * when creating the VM context.
    */
   WasmEdge_ModuleInstanceContext *WasiModule =
       WasmEdge_VMGetImportModuleContext(VMCxt,
                                         WasmEdge_HostRegistration_Wasi);
   /* Initialize the WASI. */
   WasmEdge_ModuleInstanceInitWASI(WasiModule, /* ... ignored */);
   WasmEdge_VMDelete(VMCxt);
   ```

   也可透過 API 建立 WASI 模組實例。細節將於[主機函式](#host-functions)與[主機模組註冊](#host-module-registrations)中介紹。

2. 外掛

   如果使用者[透過安裝程式安裝了 WasmEdge 外掛](../../../start/install.md#install-wasmedge-plug-ins-and-dependencies)，則預設外掛路徑中可能會有數個外掛。

   在使用外掛之前，開發者應[從路徑載入外掛](#load-plug-ins-from-paths)。

   `VM` 上下文會在建立時自動建立並註冊已載入外掛的模組。此外，若外掛未載入，下列主機模組將被模擬：

   - `wasi_ephemeral_crypto_asymmetric_common`（用於 `WASI-Crypto`）
   - `wasi_ephemeral_crypto_common`（用於 `WASI-Crypto`）
   - `wasi_ephemeral_crypto_kx`（用於 `WASI-Crypto`）
   - `wasi_ephemeral_crypto_signatures`（用於 `WASI-Crypto`）
   - `wasi_ephemeral_crypto_symmetric`（用於 `WASI-Crypto`）
   - `wasi_ephemeral_nn`
   - `wasi_snapshot_preview1`
   - `wasmedge_httpsreq`
   - `wasmedge_process`

   當 WASM 想呼叫這些主機函式但對應的外掛未安裝時，WasmEdge 將印出錯誤訊息並回傳錯誤。

   ```c
   /* Load the plug-ins in the default paths first. */
   WasmEdge_PluginLoadWithDefaultPaths();
   /* Create the configure context and add the WASI configuration. */
   WasmEdge_ConfigureContext *ConfCxt = WasmEdge_ConfigureCreate();
   WasmEdge_ConfigureAddHostRegistration(ConfCxt,
                                         WasmEdge_HostRegistration_Wasi);
   WasmEdge_VMContext *VMCxt = WasmEdge_VMCreate(ConfCxt, NULL);
   WasmEdge_ConfigureDelete(ConfCxt);
   /*
    * The following API can retrieve the registered modules in the VM context,
    * includes the built-in WASI and the plug-ins.
    */
   /*
    * This API will return `NULL` if the module instance not found.
    */
   WasmEdge_String WasiName =
       WasmEdge_StringCreateByCString("wasi_snapshot_preview1");
   /* The `WasiModule` will not be `NULL` because the configuration was set. */
   const WasmEdge_ModuleInstanceContext *WasiModule =
       WasmEdge_VMGetRegisteredModule(VMCxt, WasiName);
   WasmEdge_StringDelete(WasiName);
   WasmEdge_String WasiNNName =
       WasmEdge_StringCreateByCString("wasi_ephemeral_nn");
   /*
    * The `WasiNNModule` will not be `NULL` even if the wasi_nn plug-in is not
    * installed, because the VM context will mock and register the host
    * modules.
    */
   const WasmEdge_ModuleInstanceContext *WasiNNModule =
       WasmEdge_VMGetRegisteredModule(VMCxt, WasiNNName);
   WasmEdge_StringDelete(WasiNNName);

   WasmEdge_VMDelete(VMCxt);
   ```

### 主機模組註冊

[主機函式](https://webassembly.github.io/spec/core/exec/runtime.html#syntax-hostfunc)是位於 WebAssembly 之外並作為匯入傳遞給 WASM 模組的函式。在 WasmEdge 中，主機函式以模組名稱組合成主機模組，作為 `WasmEdge_ModuleInstanceContext` 物件。詳細內容請參閱 [WasmEdge 執行環境中的主機函式](#host-functions)。

在本章中，我們將示範如何將主機模組註冊到 `VM` 上下文中。請注意，開發者應確保已註冊模組實例的可用性，並在不再使用時刪除該模組實例。

```c
WasmEdge_VMContext *VMCxt = WasmEdge_VMCreate(NULL, NULL);
WasmEdge_ModuleInstanceContext *WasiModule =
    WasmEdge_ModuleInstanceCreateWASI(/* ... ignored ... */);
/* You can also create and register the WASI host modules by this API. */
WasmEdge_Result Res = WasmEdge_VMRegisterModuleFromImport(VMCxt, WasiModule);
/* The result status should be checked. */

/* ... */

WasmEdge_VMDelete(VMCxt);
WasmEdge_ModuleInstanceDelete(WasiModule);
/*
 * The created module instances should be deleted by the developers when the VM
 * deallocation.
 */
```

開發者可使用 `WasmEdge_VMRegisterModuleFromImportWithAlias()` API 以給定的別名而非其自身的模組名稱來註冊模組實例。當需要以不同的匯入命名空間存取相同的模組實例時，此功能相當有用，例如在 threads 提案中。

```c
WasmEdge_VMContext *VMCxt = WasmEdge_VMCreate(NULL, NULL);
WasmEdge_ModuleInstanceContext *HostModule =
    WasmEdge_ModuleInstanceCreate(/* ... ignored ... */);
WasmEdge_String AliasName = WasmEdge_StringCreateByCString("alias_name");
/* Register the module instance under the alias name. */
WasmEdge_Result Res =
    WasmEdge_VMRegisterModuleFromImportWithAlias(VMCxt, AliasName, HostModule);
/* The result status should be checked. */

WasmEdge_StringDelete(AliasName);
WasmEdge_VMDelete(VMCxt);
WasmEdge_ModuleInstanceDelete(HostModule);
```

### WASM 註冊與執行

在 WebAssembly 中，WASM 模組中的實例可以被匯出，並被其他 WASM 模組匯入。WasmEdge VM 提供 API 讓開發者註冊並匯出任何 WASM 模組，並執行已註冊 WASM 模組中的函式或主機函式。

1. 以匯出的模組名稱註冊 WASM 模組

   除非模組實例已內含模組名稱，否則每個 WASM 模組在註冊時都應有唯一的命名。

   假設 WASM 檔案 [`fibonacci.wasm`](https://raw.githubusercontent.com/WasmEdge/WasmEdge/master/examples/wasm/fibonacci.wat) 已複製到目前目錄，且 C 檔案 `test.c` 內容如下：

   <!-- prettier-ignore -->
   :::note
   `fibonacci.wat` 檔案以文字格式提供。使用者應使用 [WABT 工具](https://github.com/WebAssembly/wabt)將其轉換為對應的 WASM 二進位格式。
   :::

   ```c
   WasmEdge_VMContext *VMCxt = WasmEdge_VMCreate(NULL, NULL);
   WasmEdge_String ModName = WasmEdge_StringCreateByCString("mod");
   WasmEdge_Result Res =
       WasmEdge_VMRegisterModuleFromFile(VMCxt, ModName, "fibonacci.wasm");
   /*
    * Developers can register the WASM module from buffer with the
    * `WasmEdge_VMRegisterModuleFromBytes()` API, or from
    * `WasmEdge_ASTModuleContext` object with the
    * `WasmEdge_VMRegisterModuleFromASTModule()` API.
    */
   /*
    * The result status should be checked.
    * The error will occur if the WASM module instantiation failed or the
    * module name conflicts.
    */
   WasmEdge_StringDelete(ModName);
   WasmEdge_VMDelete(VMCxt);
   ```

2. 執行已註冊 WASM 模組中的函式

   假設 C 檔案 `test.c` 內容如下：

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
     /*
      * Developers can register the WASM module from buffer with the
      * `WasmEdge_VMRegisterModuleFromBytes()` API, or from
      * `WasmEdge_ASTModuleContext` object with the
      * `WasmEdge_VMRegisterModuleFromASTModule()` API.
      */
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

     /*
      * Execute WASM functions in registered modules.
      * Unlike the execution of functions, the registered functions can be
      * invoked without `WasmEdge_VMInstantiate()` because the WASM module was
      * instantiated when registering. Developers can also invoke the host
      * functions directly with this API.
      */
     Res = WasmEdge_VMExecuteRegistered(VMCxt, ModName, FuncName, Params, 1,
                                        Returns, 1);
     if (WasmEdge_ResultOK(Res)) {
       printf("Get the result: %d\n", WasmEdge_ValueGetI32(Returns[0]));
     } else {
       printf("Execution phase failed: %s\n", WasmEdge_ResultGetMessage(Res));
     }
     WasmEdge_StringDelete(ModName);
     WasmEdge_StringDelete(FuncName);
     WasmEdge_VMDelete(VMCxt);
     return 0;
   }
   ```

   接著您可以編譯並執行：（以 0 起算的第 20 個 Fibonacci 數為 89）

   ```bash
   $ gcc test.c -lwasmedge
   $ ./a.out
   Get the result: 10946
   ```

3. 強制刪除已註冊的 WASM 模組

   對於 VM 上下文中已實例化並註冊的模組，開發者可使用 `WasmEdge_VMForceDeleteRegisteredModule()` API 透過名稱強制刪除並取消註冊該模組實例。

   <!-- prettier-ignore -->
   :::note
   此 API 不會檢查匯出與匯入的模組實例相依性。開發者使用此 API 時應自行確保模組相依性。未來將提供更安全的 API。
   :::

   ```c
   #include <wasmedge/wasmedge.h>
   #include <stdio.h>
   int main() {
     WasmEdge_VMContext *VMCxt = WasmEdge_VMCreate(NULL, NULL);

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

### 非同步執行

1. 快速地非同步執行 WASM 函式

   假設 WASM 檔案 [`fibonacci.wasm`](https://raw.githubusercontent.com/WasmEdge/WasmEdge/master/examples/wasm/fibonacci.wat) 已複製到目前目錄，且 C 檔案 `test.c` 內容如下：

   <!-- prettier-ignore -->
   :::note
   `fibonacci.wat` 檔案以文字格式提供。使用者應使用 [WABT 工具](https://github.com/WebAssembly/wabt)將其轉換為對應的 WASM 二進位格式。
   :::

   ```c
   #include <wasmedge/wasmedge.h>
   #include <stdio.h>
   int main() {
     /* Create the VM context. */
     WasmEdge_VMContext *VMCxt = WasmEdge_VMCreate(NULL, NULL);

     /* The parameters and returns arrays. */
     WasmEdge_Value Params[1] = {WasmEdge_ValueGenI32(20)};
     WasmEdge_Value Returns[1];
     /* Function name. */
     WasmEdge_String FuncName = WasmEdge_StringCreateByCString("fib");
     /* Asynchronously run the WASM function from file and get the
      * `WasmEdge_Async` object. */
     WasmEdge_Async *Async = WasmEdge_VMAsyncRunWasmFromFile(
         VMCxt, "fibonacci.wasm", FuncName, Params, 1);
     /*
      * Developers can run the WASM binary from buffer with the
      * `WasmEdge_VMAsyncRunWasmFromBytes()` API, or from
      * `WasmEdge_ASTModuleContext` object with the
      * `WasmEdge_VMAsyncRunWasmFromASTModule()` API.
      */

     /* Wait for the execution. */
     WasmEdge_AsyncWait(Async);
     /*
      * Developers can also use the `WasmEdge_AsyncGetReturnsLength()` or
      * `WasmEdge_AsyncGet()` APIs to wait for the asynchronous execution.
      * These APIs will wait until the execution finished.
      */

     /* Check the return values length. */
     uint32_t Arity = WasmEdge_AsyncGetReturnsLength(Async);
     /* The `Arity` should be 1. Developers can skip this step if they have
      * known the return arity. */

     /* Get the result. */
     WasmEdge_Result Res = WasmEdge_AsyncGet(Async, Returns, Arity);

     if (WasmEdge_ResultOK(Res)) {
       printf("Get the result: %d\n", WasmEdge_ValueGetI32(Returns[0]));
     } else {
       printf("Error message: %s\n", WasmEdge_ResultGetMessage(Res));
     }

     /* Resources deallocations. */
     WasmEdge_AsyncDelete(Async);
     WasmEdge_VMDelete(VMCxt);
     WasmEdge_StringDelete(FuncName);
     return 0;
   }
   ```

   接著您可以編譯並執行：（以 0 起算的第 20 個 Fibonacci 數為 10946）

   ```bash
   $ gcc test.c -lwasmedge
   $ ./a.out
   Get the result: 10946
   ```

2. 手動實例化並以非同步方式執行 WASM 函式

   除上述範例外，開發者可使用 `VM` 上下文 API 一步一步地執行 WASM 函式：

   ```c
   #include <wasmedge/wasmedge.h>
   #include <stdio.h>
   int main() {
     /* Create the VM context. */
     WasmEdge_VMContext *VMCxt = WasmEdge_VMCreate(NULL, NULL);

     /* The parameters and returns arrays. */
     WasmEdge_Value Params[1] = {WasmEdge_ValueGenI32(25)};
     WasmEdge_Value Returns[1];
     /* Function name. */
     WasmEdge_String FuncName = WasmEdge_StringCreateByCString("fib");
     /* Result. */
     WasmEdge_Result Res;

     /* Step 1: Load WASM file. */
     Res = WasmEdge_VMLoadWasmFromFile(VMCxt, "fibonacci.wasm");
     /*
      * Developers can load the WASM binary from buffer with the
      * `WasmEdge_VMLoadWasmFromBytes()` API, or from `WasmEdge_ASTModuleContext`
      * object with the `WasmEdge_VMLoadWasmFromASTModule()` API.
      */
     if (!WasmEdge_ResultOK(Res)) {
       printf("Loading phase failed: %s\n", WasmEdge_ResultGetMessage(Res));
       return 1;
     }
     /* Step 2: Validate the WASM module. */
     Res = WasmEdge_VMValidate(VMCxt);
     if (!WasmEdge_ResultOK(Res)) {
       printf("Validation phase failed: %s\n", WasmEdge_ResultGetMessage(Res));
       return 1;
     }
     /* Step 3: Instantiate the WASM module. */
     Res = WasmEdge_VMInstantiate(VMCxt);
     /*
      * Developers can load, validate, and instantiate another WASM module to
      * replace the instantiated one. In this case, the old module will be
      * cleared, but the registered modules are still kept.
      */
     if (!WasmEdge_ResultOK(Res)) {
       printf("Instantiation phase failed: %s\n",
              WasmEdge_ResultGetMessage(Res));
       return 1;
     }
     /* Step 4: Asynchronously execute the WASM function and get the
      * `WasmEdge_Async` object. */
     WasmEdge_Async *Async =
         WasmEdge_VMAsyncExecute(VMCxt, FuncName, Params, 1);
     /*
      * Developers can execute functions repeatedly after instantiation.
      * For invoking the registered functions, you can use the
      * `WasmEdge_VMAsyncExecuteRegistered()` API.
      */

     /* Wait and check the return values length. */
     uint32_t Arity = WasmEdge_AsyncGetReturnsLength(Async);
     /* The `Arity` should be 1. Developers can skip this step if they have
      * known the return arity. */

     /* Get the result. */
     Res = WasmEdge_AsyncGet(Async, Returns, Arity);
     if (WasmEdge_ResultOK(Res)) {
       printf("Get the result: %d\n", WasmEdge_ValueGetI32(Returns[0]));
     } else {
       printf("Execution phase failed: %s\n", WasmEdge_ResultGetMessage(Res));
     }

     /* Resources deallocations. */
     WasmEdge_AsyncDelete(Async);
     WasmEdge_VMDelete(VMCxt);
     WasmEdge_StringDelete(FuncName);
   }
   ```

   接著您可以編譯並執行：（以 0 起算的第 25 個 Fibonacci 數為 121393）

   ```bash
   $ gcc test.c -lwasmedge
   $ ./a.out
   Get the result: 121393
   ```

### 實例追蹤

有時開發者可能需要取得 WASM 執行環境的實例。`VM` 上下文提供 API 來擷取這些實例。

1. Store

   若 `VM` 上下文在建立時未指派 `Store` 上下文，則 `VM` 上下文會配置並擁有一個 `Store` 上下文。

   ```c
   WasmEdge_VMContext *VMCxt = WasmEdge_VMCreate(NULL, NULL);
   WasmEdge_StoreContext *StoreCxt = WasmEdge_VMGetStoreContext(VMCxt);
   /* The object should __NOT__ be deleted by `WasmEdge_StoreDelete()`. */
   WasmEdge_VMDelete(VMCxt);
   ```

   開發者也可在建立 `VM` 上下文時帶入 `Store` 上下文。在此情況下，開發者應自行確保 `Store` 上下文的生命週期。請參閱 [Store 上下文](#store)以瞭解 `Store` 上下文 API 的細節。

   ```c
   WasmEdge_StoreContext *StoreCxt = WasmEdge_StoreCreate();
   WasmEdge_VMContext *VMCxt = WasmEdge_VMCreate(NULL, StoreCxt);
   WasmEdge_StoreContext *StoreCxtMock = WasmEdge_VMGetStoreContext(VMCxt);
   /* The `StoreCxt` and the `StoreCxtMock` are the same. */
   WasmEdge_VMDelete(VMCxt);
   WasmEdge_StoreDelete(StoreCxt);
   ```

2. 列出已匯出的函式

   在 WASM 模組實例化後，開發者可使用 `WasmEdge_VMExecute()` API 呼叫已匯出的 WASM 函式。為此，開發者可能需要已匯出 WASM 函式清單的資訊。函式型別的細節請參閱[執行環境中的實例](#instances)。

   假設 WASM 檔案 [`fibonacci.wasm`](https://raw.githubusercontent.com/WasmEdge/WasmEdge/master/examples/wasm/fibonacci.wat) 已複製到目前目錄，且 C 檔案 `test.c` 內容如下：

   <!-- prettier-ignore -->
   :::note
   `fibonacci.wat` 檔案以文字格式提供。使用者應使用 [WABT 工具](https://github.com/WebAssembly/wabt)將其轉換為對應的 WASM 二進位格式。
   :::

   ```c
   #include <wasmedge/wasmedge.h>
   #include <stdio.h>
   int main() {
     WasmEdge_StoreContext *StoreCxt = WasmEdge_StoreCreate();
     WasmEdge_VMContext *VMCxt = WasmEdge_VMCreate(NULL, StoreCxt);

     WasmEdge_VMLoadWasmFromFile(VMCxt, "fibonacci.wasm");
     WasmEdge_VMValidate(VMCxt);
     WasmEdge_VMInstantiate(VMCxt);

     /* List the exported functions. */
     /* Get the number of exported functions. */
     uint32_t FuncNum = WasmEdge_VMGetFunctionListLength(VMCxt);
     /* Create the name buffers and the function type buffers. */
     const uint32_t BUF_LEN = 256;
     WasmEdge_String FuncNames[BUF_LEN];
     WasmEdge_FunctionTypeContext *FuncTypes[BUF_LEN];
     /*
      * Get the export function list.
      * If the function list length is larger than the buffer length, the
      * overflowed data will be discarded. The `FuncNames` and `FuncTypes` can
      * be NULL if developers don't need them.
      */
     uint32_t RealFuncNum =
         WasmEdge_VMGetFunctionList(VMCxt, FuncNames, FuncTypes, BUF_LEN);

     for (uint32_t I = 0; I < RealFuncNum && I < BUF_LEN; I++) {
       char Buf[BUF_LEN];
       uint32_t Size = WasmEdge_StringCopy(FuncNames[I], Buf, sizeof(Buf));
       printf("Get exported function string length: %u, name: %s\n", Size,
              Buf);
       /*
        * The function names should be __NOT__ destroyed.
        * The returned function type contexts should __NOT__ be destroyed.
        */
     }
     WasmEdge_StoreDelete(StoreCxt);
     WasmEdge_VMDelete(VMCxt);
     return 0;
   }
   ```

   接著您可以編譯並執行：（`fibonacci.wasm` 中唯一匯出的函式為 `fib`）

   ```bash
   $ gcc test.c -lwasmedge
   $ ./a.out
   Get exported function string length: 3, name: fib
   ```

   若開發者想取得已註冊 WASM 模組中已匯出的函式名稱，請從 `VM` 上下文擷取 `Store` 上下文，並參閱 [Store 上下文](#store)的 API，依模組名稱列出已註冊的函式。

3. 取得函式型別

   `VM` 上下文提供 API 以依函式名稱尋找函式型別。函式型別的細節請參閱[執行環境中的實例](#instances)。

   ```c
   /*
    * ...
    * Assume that a WASM module is instantiated in `VMCxt`.
    */
   WasmEdge_String FuncName = WasmEdge_StringCreateByCString("fib");
   const WasmEdge_FunctionTypeContext *FuncType =
       WasmEdge_VMGetFunctionType(VMCxt, FuncName);
   /*
    * Developers can get the function types of functions in the registered
    * modules via the `WasmEdge_VMGetFunctionTypeRegistered()` API with the
    * module name. If the function is not found, these APIs will return `NULL`.
    * The returned function type contexts should __NOT__ be destroyed.
    */
   WasmEdge_StringDelete(FuncName);
   ```

4. 取得目前作用中的模組

   在 WASM 模組實例化後，會實例化一個由 `VM` 上下文擁有的匿名模組。開發者可能需要擷取它以取得該模組以外的實例。然後開發者可使用 `WasmEdge_VMGetActiveModule()` API 來取得該匿名模組實例。模組實例 API 的細節請參閱[模組實例](#instances)。

   ```c
   /*
    * ...
    * Assume that a WASM module is instantiated in `VMCxt`.
    */
   const WasmEdge_ModuleInstanceContext *ModCxt =
       WasmEdge_VMGetActiveModule(VMCxt);
   /*
    * If there's no WASM module instantiated, this API will return `NULL`.
    * The returned module instance context should __NOT__ be destroyed.
    */
   ```

5. 列出並取得已註冊的模組

   除了存取 `VM` 的 `store` 上下文之外，開發者可使用下列 API 列出並擷取 `VM` 上下文中已註冊的模組。

   ```c
   /*
    * ...
    * Assume that the `VMCxt` is created.
    */
   WasmEdge_String Names[32];
   uint32_t ModuleLen = WasmEdge_VMListRegisteredModule(VMCxt, Names, 32);
   for (uint32_t I = 0; I < ModuleLen; I++) {
     /* Will print the registered module names in the VM context. */
     printf("%s\n", Names[I].Buf);
   }

   WasmEdge_String WasiName =
       WasmEdge_StringCreateByCString("wasi_snapshot_preview1");
   /* The `WasiModule` will not be `NULL` because the configuration was set. */
   const WasmEdge_ModuleInstanceContext *WasiModule =
       WasmEdge_VMGetRegisteredModule(VMCxt, WasiName);
   WasmEdge_StringDelete(WasiName);
   ```

6. 取得元件

   `VM` 上下文由 `Loader`、`Validator` 與 `Executor` 上下文所組成。若開發者想使用這些上下文而不另外建立其他實例，下列 API 可協助開發者從 `VM` 上下文中取得它們。所取得的上下文由 `VM` 上下文所擁有，開發者不應呼叫其刪除函式。

   ```c
   WasmEdge_LoaderContext *LoadCxt = WasmEdge_VMGetLoaderContext(VMCxt);
   /* The object should __NOT__ be deleted by `WasmEdge_LoaderDelete()`. */
   WasmEdge_ValidatorContext *ValidCxt = WasmEdge_VMGetValidatorContext(VMCxt);
   /* The object should __NOT__ be deleted by `WasmEdge_ValidatorDelete()`. */
   WasmEdge_ExecutorContext *ExecCxt = WasmEdge_VMGetExecutorContext(VMCxt);
   /* The object should __NOT__ be deleted by `WasmEdge_ExecutorDelete()`. */
   ```

## WasmEdge Runtime

在本節中，我們將手動介紹 WasmEdge 執行環境的各個物件。

### 逐步執行 WASM 範例

除了透過 [`VM` 上下文](#wasmedge-vm)執行 WASM 之外，開發者也可以使用 `Loader`、`Validator`、`Executor` 和 `Store` 上下文，逐步執行 WASM 函式或實例化 WASM 模組。

假設 WASM 檔案 [`fibonacci.wasm`](https://raw.githubusercontent.com/WasmEdge/WasmEdge/master/examples/wasm/fibonacci.wat) 已複製到目前的目錄，且 C 檔案 `test.c` 的內容如下：

<!-- prettier-ignore -->
:::note
`fibonacci.wat` 檔案以文字格式提供。使用者應透過 [WABT 工具](https://github.com/WebAssembly/wabt)將其轉換為對應的 WASM 二進位格式。
:::

```c
#include <wasmedge/wasmedge.h>
#include <stdio.h>
int main() {
  /*
   * Create the configure context. This step is not necessary because we didn't
   * adjust any setting.
   */
  WasmEdge_ConfigureContext *ConfCxt = WasmEdge_ConfigureCreate();
  /*
   * Create the statistics context. This step is not necessary if the statistics
   * in runtime is not needed.
   */
  WasmEdge_StatisticsContext *StatCxt = WasmEdge_StatisticsCreate();
  /*
   * Create the store context. The store context is the object to link the
   * modules for imports and exports.
   */
  WasmEdge_StoreContext *StoreCxt = WasmEdge_StoreCreate();
  /* Result. */
  WasmEdge_Result Res;

  /* Create the loader context. The configure context can be NULL. */
  WasmEdge_LoaderContext *LoadCxt = WasmEdge_LoaderCreate(ConfCxt);
  /* Create the validator context. The configure context can be NULL. */
  WasmEdge_ValidatorContext *ValidCxt = WasmEdge_ValidatorCreate(ConfCxt);
  /*
   * Create the executor context. The configure context and the statistics
   * context can be NULL.
   */
  WasmEdge_ExecutorContext *ExecCxt = WasmEdge_ExecutorCreate(ConfCxt, StatCxt);

  /*
   * Load the WASM file or the compiled-WASM file and convert into the AST
   * module context.
   */
  WasmEdge_ASTModuleContext *ASTCxt = NULL;
  Res = WasmEdge_LoaderParseFromFile(LoadCxt, &ASTCxt, "fibonacci.wasm");
  if (!WasmEdge_ResultOK(Res)) {
    printf("Loading phase failed: %s\n", WasmEdge_ResultGetMessage(Res));
    return 1;
  }
  /* Validate the WASM module. */
  Res = WasmEdge_ValidatorValidate(ValidCxt, ASTCxt);
  if (!WasmEdge_ResultOK(Res)) {
    printf("Validation phase failed: %s\n", WasmEdge_ResultGetMessage(Res));
    return 1;
  }
  /* Instantiate the WASM module into store context. */
  WasmEdge_ModuleInstanceContext *ModCxt = NULL;
  Res = WasmEdge_ExecutorInstantiate(ExecCxt, &ModCxt, StoreCxt, ASTCxt);
  if (!WasmEdge_ResultOK(Res)) {
    printf("Instantiation phase failed: %s\n", WasmEdge_ResultGetMessage(Res));
    return 1;
  }

  /* Try to list the exported functions of the instantiated WASM module. */
  uint32_t FuncNum = WasmEdge_ModuleInstanceListFunctionLength(ModCxt);
  /* Create the name buffers. */
  const uint32_t BUF_LEN = 256;
  WasmEdge_String FuncNames[BUF_LEN];
  /*
   * If the list length is larger than the buffer length, the overflowed data
   * will be discarded.
   */
  uint32_t RealFuncNum =
      WasmEdge_ModuleInstanceListFunction(ModCxt, FuncNames, BUF_LEN);
  for (uint32_t I = 0; I < RealFuncNum && I < BUF_LEN; I++) {
    char Buf[BUF_LEN];
    uint32_t Size = WasmEdge_StringCopy(FuncNames[I], Buf, sizeof(Buf));
    printf("Get exported function string length: %u, name: %s\n", Size, Buf);
    /* The function names should __NOT__ be destroyed. */
  }

  /* The parameters and returns arrays. */
  WasmEdge_Value Params[1] = {WasmEdge_ValueGenI32(18)};
  WasmEdge_Value Returns[1];
  /* Function name. */
  WasmEdge_String FuncName = WasmEdge_StringCreateByCString("fib");
  /* Find the exported function by function name. */
  WasmEdge_FunctionInstanceContext *FuncCxt =
      WasmEdge_ModuleInstanceFindFunction(ModCxt, FuncName);
  if (FuncCxt == NULL) {
    printf("Function `fib` not found.\n");
    return 1;
  }
  /* Invoke the WASM function. */
  Res = WasmEdge_ExecutorInvoke(ExecCxt, FuncCxt, Params, 1, Returns, 1);
  if (WasmEdge_ResultOK(Res)) {
    printf("Get the result: %d\n", WasmEdge_ValueGetI32(Returns[0]));
  } else {
    printf("Execution phase failed: %s\n", WasmEdge_ResultGetMessage(Res));
  }

  /* Resources deallocations. */
  WasmEdge_StringDelete(FuncName);
  WasmEdge_ASTModuleDelete(ASTCxt);
  WasmEdge_ModuleInstanceDelete(ModCxt);
  WasmEdge_LoaderDelete(LoadCxt);
  WasmEdge_ValidatorDelete(ValidCxt);
  WasmEdge_ExecutorDelete(ExecCxt);
  WasmEdge_ConfigureDelete(ConfCxt);
  WasmEdge_StoreDelete(StoreCxt);
  WasmEdge_StatisticsDelete(StatCxt);
  return 0;
}
```

接著可以編譯並執行：（以 0 為起始索引時，第 18 個費氏數為 4181）

```bash
$ gcc test.c -lwasmedge
$ ./a.out
Get exported function string length: 3, name: fib
Get the result: 4181
```

### Loader

`Loader` 上下文會從檔案或緩衝區載入 WASM 二進位內容。它同時支援 WASM 與來自 [WasmEdge AOT 編譯器](#wasmedge-aot-compiler)的已編譯 WASM。

```c
uint8_t Buf[4096];
/* ... Read the WASM code to the buffer. */
uint32_t FileSize = ...;
/* The `FileSize` is the length of the WASM code. */

/* Developers can adjust settings in the configure context. */
WasmEdge_ConfigureContext *ConfCxt = WasmEdge_ConfigureCreate();
/* Create the loader context. The configure context can be NULL. */
WasmEdge_LoaderContext *LoadCxt = WasmEdge_LoaderCreate(ConfCxt);

WasmEdge_ASTModuleContext *ASTCxt = NULL;
WasmEdge_Result Res;

/* Load WASM or compiled-WASM from the file. */
Res = WasmEdge_LoaderParseFromFile(LoadCxt, &ASTCxt, "fibonacci.wasm");
if (!WasmEdge_ResultOK(Res)) {
  printf("Loading phase failed: %s\n", WasmEdge_ResultGetMessage(Res));
}
/* The output AST module context should be destroyed. */
WasmEdge_ASTModuleDelete(ASTCxt);

/* Load WASM or compiled-WASM from the buffer. */
WasmEdge_Bytes Bytes = WasmEdge_BytesWrap(Buf, FileSize);
Res = WasmEdge_LoaderParseFromBytes(LoadCxt, &ASTCxt, Bytes);
/*
 * Note: `WasmEdge_LoaderParseFromBuffer()` will be deprecated in the future.
 * We recommand developers to use `WasmEdge_LoaderParseFromBytes()` instead.
 */
if (!WasmEdge_ResultOK(Res)) {
  printf("Loading phase failed: %s\n", WasmEdge_ResultGetMessage(Res));
}
/* The output AST module context should be destroyed. */
WasmEdge_ASTModuleDelete(ASTCxt);

WasmEdge_LoaderDelete(LoadCxt);
WasmEdge_ConfigureDelete(ConfCxt);
```

### Validator

`Validator` 上下文可以驗證 WASM 模組。每個 WASM 模組在實例化之前都應該先進行驗證。

```c
/*
 * ...
 * Assume that the `ASTCxt` is the output AST module context from the loader
 * context.
 * Assume that the `ConfCxt` is the configure context.
 */
/* Create the validator context. The configure context can be NULL. */
WasmEdge_ValidatorContext *ValidCxt = WasmEdge_ValidatorCreate(ConfCxt);
WasmEdge_Result Res = WasmEdge_ValidatorValidate(ValidCxt, ASTCxt);
if (!WasmEdge_ResultOK(Res)) {
  printf("Validation phase failed: %s\n", WasmEdge_ResultGetMessage(Res));
}
WasmEdge_ValidatorDelete(ValidCxt);
```

### Executor

`Executor` 上下文是 WASM 與已編譯 WASM 的執行器。此物件應以 `Store` 上下文為基礎運作。關於 `Store` 上下文的詳細資訊，請參閱[下一章](#store)。

1. 將 `AST module` 實例化並註冊為具名 `Module` 實例

   如同在 `VM` 上下文中[註冊宿主模組](#host-module-registrations)或[匯入 WASM 模組](#wasm-registrations-and-executions)一樣，開發者可以將 `AST module` 上下文實例化為具名 `Module` 實例，並將其註冊到 `Store` 上下文中。註冊後，所產生的 `Module` 實例會以給定的模組名稱匯出到 `Store`，並可在實例化其他模組時被連結。

   關於 `Module` 實例的 API 詳細資訊，請參閱[實例](#instances)。`Store` 上下文僅作為實例化時搜尋並連結已匯出模組的連結器。開發者在不再使用輸出的 `Module` 實例時應將其刪除。當 `Module` 實例被刪除時，它會自動取消與所有已連結的 `Store` 上下文的連結。

   ```c
   /*
    * ...
    * Assume that the `ASTCxt` is the output AST module context from the loader
    * context and has passed the validation. Assume that the `ConfCxt` is the
    * configure context.
    */
   /* Create the statistics context. This step is not necessary. */
   WasmEdge_StatisticsContext *StatCxt = WasmEdge_StatisticsCreate();
   /*
    * Create the executor context. The configure and the statistics contexts
    * can be NULL.
    */
   WasmEdge_ExecutorContext *ExecCxt =
       WasmEdge_ExecutorCreate(ConfCxt, StatCxt);
   /*
    * Create the store context. The store context is the object to link the
    * modules for imports and exports.
    */
   WasmEdge_StoreContext *StoreCxt = WasmEdge_StoreCreate();
   /* Result. */
   WasmEdge_Result Res;

   WasmEdge_String ModName = WasmEdge_StringCreateByCString("mod");
   /* The output module instance. */
   WasmEdge_ModuleInstanceContext *ModCxt = NULL;
   /*
    * Register the WASM module into the store with the export module name
    * "mod".
    */
   Res =
       WasmEdge_ExecutorRegister(ExecCxt, &ModCxt, StoreCxt, ASTCxt, ModName);
   if (!WasmEdge_ResultOK(Res)) {
     printf("WASM registration failed: %s\n", WasmEdge_ResultGetMessage(Res));
     return -1;
   }
   WasmEdge_StringDelete(ModName);

   /* ... */

   /* After the execution, the resources should be released. */
   WasmEdge_ExecutorDelete(ExecCxt);
   WasmEdge_StatisticsDelete(StatCxt);
   WasmEdge_StoreDelete(StoreCxt);
   WasmEdge_ModuleInstanceDelete(ModCxt);
   ```

2. 註冊既有的 `Module` 實例並匯出模組名稱

   除了實例化並註冊 `AST module` 上下文外，開發者也可以將既有的 `Module` 實例直接註冊到 store，並一同匯出其模組名稱（該名稱已存在於 `Module` 實例中）。當開發者為宿主函式建立 `Module` 實例並希望將其註冊以供連結時，便會發生此情形。關於在 `Module` 實例中建構宿主函式的詳細資訊，請參閱[宿主函式](#host-functions)。

   ```c
   /*
    * ...
    * Assume that the `ASTCxt` is the output AST module context from the loader
    * context and has passed the validation. Assume that the `ConfCxt` is the
    * configure context.
    */
   /* Create the statistics context. This step is not necessary. */
   WasmEdge_StatisticsContext *StatCxt = WasmEdge_StatisticsCreate();
   /*
    * Create the executor context. The configure and the statistics contexts
    * can be NULL.
    */
   WasmEdge_ExecutorContext *ExecCxt =
       WasmEdge_ExecutorCreate(ConfCxt, StatCxt);
   /*
    * Create the store context. The store context is the object to link the
    * modules for imports and exports.
    */
   WasmEdge_StoreContext *StoreCxt = WasmEdge_StoreCreate();
   /* Result. */
   WasmEdge_Result Res;

   /* Create a module instance for host functions. */
   WasmEdge_String ModName = WasmEdge_StringCreateByCString("host-module");
   WasmEdge_ModuleInstanceContext *HostModCxt =
       WasmEdge_ModuleInstanceCreate(ModName);
   WasmEdge_StringDelete(ModName);
   /*
    * ...
    * Create and add the host functions, tables, memories, and globals into the
    * module instance.
    */

   /* Register the module instance into store with the exported module name. */
   /* The export module name is in the module instance already. */
   Res = WasmEdge_ExecutorRegisterImport(ExecCxt, StoreCxt, HostModCxt);
   if (!WasmEdge_ResultOK(Res)) {
     printf("WASM registration failed: %s\n", WasmEdge_ResultGetMessage(Res));
     return -1;
   }
   /*
    * Developers can also register the module instance under an alias module
    * name through the `WasmEdge_ExecutorRegisterImportWithAlias()` API:
    *
    *   WasmEdge_String AliasName =
    *       WasmEdge_StringCreateByCString("alias-module");
    *   Res = WasmEdge_ExecutorRegisterImportWithAlias(
    *       ExecCxt, StoreCxt, HostModCxt, AliasName);
    *   WasmEdge_StringDelete(AliasName);
    */

   /* ... */

   /* After the execution, the resources should be released. */
   WasmEdge_ExecutorDelete(ExecCxt);
   WasmEdge_StatisticsDelete(StatCxt);
   WasmEdge_StoreDelete(StoreCxt);
   WasmEdge_ModuleInstanceDelete(ModCxt);
   ```

3. 將 `AST module` 實例化為匿名的 `Module` 實例

   WASM 或已編譯 WASM 模組在函式呼叫之前應先實例化。實例化 WASM 模組之前，請檢查[匯入區段](https://webassembly.github.io/spec/core/syntax/modules.html#syntax-import)，以確保所需的匯入已註冊到 `Store` 上下文中以供連結。

   ```c
   /*
    * ...
    * Assume that the `ASTCxt` is the output AST module context from the loader
    * context and has passed the validation. Assume that the `ConfCxt` is the
    * configure context.
    */
   /* Create the statistics context. This step is not necessary. */
   WasmEdge_StatisticsContext *StatCxt = WasmEdge_StatisticsCreate();
   /*
    * Create the executor context. The configure and the statistics contexts
    * can be NULL.
    */
   WasmEdge_ExecutorContext *ExecCxt =
       WasmEdge_ExecutorCreate(ConfCxt, StatCxt);
   /*
    * Create the store context. The store context is the object to link the
    * modules for imports and exports.
    */
   WasmEdge_StoreContext *StoreCxt = WasmEdge_StoreCreate();

   /* The output module instance. */
   WasmEdge_ModuleInstanceContext *ModCxt = NULL;
   /* Instantiate the WASM module. */
   WasmEdge_Result Res =
       WasmEdge_ExecutorInstantiate(ExecCxt, &ModCxt, StoreCxt, ASTCxt);
   if (!WasmEdge_ResultOK(Res)) {
     printf("WASM instantiation failed: %s\n", WasmEdge_ResultGetMessage(Res));
     return -1;
   }

   /* ... */

   /* After the execution, the resources should be released. */
   WasmEdge_ExecutorDelete(ExecCxt);
   WasmEdge_StatisticsDelete(StatCxt);
   WasmEdge_StoreDelete(StoreCxt);
   WasmEdge_ModuleInstanceDelete(ModCxt);
   ```

4. 呼叫函式

   完成註冊或實例化並取得結果 `Module` 實例後，開發者可以從 `Module` 實例取得已匯出的 `Function` 實例以供呼叫。關於 `Module` 實例的 API 詳細資訊，請參閱[實例](#instances)。透過 `WasmEdge_ExecutorInvoke()` API 呼叫 `Function` 實例的範例，請參閱[上述範例](#wasm-execution-example-step-by-step)。

5. 非同步呼叫函式

   如同 [在 VM 中非同步執行 WASM 函式](#asynchronous-execution)，開發者也可以透過 `Executor` 上下文的 API 以非同步方式呼叫函式。

   取得 `Function` 實例後，開發者可以呼叫 `WasmEdge_ExecutorAsyncInvoke()` API 來取得 `Async` 上下文。請參閱 [Async](#async) 章節以了解如何透過此上下文取得結果。

### AST Module

`AST Module` 上下文呈現從 WASM 檔案或緩衝區載入的結構。開發者會在從 [Loader](#loader) 載入 WASM 檔案或緩衝區後取得此物件。在實例化之前，開發者也可以查詢 `AST Module` 上下文的匯入與匯出。

```c
WasmEdge_ASTModuleContext *ASTCxt = ...;
/* Assume that a WASM is loaded into an AST module context. */

/* Create the import type context buffers. */
const uint32_t BUF_LEN = 256;
const WasmEdge_ImportTypeContext *ImpTypes[BUF_LEN];
uint32_t ImportNum = WasmEdge_ASTModuleListImportsLength(ASTCxt);
/*
 * If the list length is larger than the buffer length, the overflowed data will
 * be discarded.
 */
uint32_t RealImportNum =
    WasmEdge_ASTModuleListImports(ASTCxt, ImpTypes, BUF_LEN);
for (uint32_t I = 0; I < RealImportNum && I < BUF_LEN; I++) {
  /* Working with the import type `ImpTypes[I]` ... */
}

/* Create the export type context buffers. */
const WasmEdge_ExportTypeContext *ExpTypes[BUF_LEN];
uint32_t ExportNum = WasmEdge_ASTModuleListExportsLength(ASTCxt);
/*
 * If the list length is larger than the buffer length, the overflowed data will
 * be discarded.
 */
uint32_t RealExportNum =
    WasmEdge_ASTModuleListExports(ASTCxt, ExpTypes, BUF_LEN);
for (uint32_t I = 0; I < RealExportNum && I < BUF_LEN; I++) {
  /* Working with the export type `ExpTypes[I]` ... */
}

WasmEdge_ASTModuleDelete(ASTCxt);
/*
 * After deletion of `ASTCxt`, all data queried from the `ASTCxt` should not be
 * accessed.
 */
```

### Serializer

作為將 WASM 檔案或緩衝區載入為 `AST Module` 的反向操作，`Loader` 上下文也提供了序列化工具，可將 `AST Module` 序列化回 WASM 緩衝區。

```c
WasmEdge_ASTModuleContext *ASTCxt = ...;
/* Assume that a WASM is loaded into an AST module context. */

WasmEdge_LoaderContext *LoadCxt = ...;
/* Assume that a loader context is created with configuration. */

WasmEdbe_Bytes Bytes;
/* Serialize the AST module back into WASM binary format. */
Res = WasmEdge_LoaderSerializeASTModule(LoadCxt, ASTCxt, &Bytes);
if (!WasmEdge_ResultOK(Res)) {
  printf("Serialization failed: %s\n", WasmEdge_ResultGetMessage(Res));
}

/* The output WasmEdge_Bytes should be destroyed. */
WasmEdge_BytesDelete(Bytes);
```

### Store

[Store](https://webassembly.github.io/spec/core/exec/runtime.html#store) 是執行環境的結構，代表 WebAssembly 程式可以操作的所有全域狀態。WasmEdge 中的 `Store` 上下文是一個物件，作為連結器在實例化 WASM 模組時提供實例的匯出與匯入。開發者可以從 `Store` 上下文取得具名模組，並應刪除已註冊到 `Store` 上下文中且不再使用的 `Module` 實例。

當 `Store` 上下文被刪除時，已連結的 `Module` 實例會自動取消與此 `Store` 上下文的連結。當 `Module` 實例被刪除時，它會自動取消與所有已連結的 `Store` 上下文的連結。

```c
WasmEdge_StoreContext *StoreCxt = WasmEdge_StoreCreate();

/*
 * ...
 * Register a WASM module via the executor context.
 */

/* Try to list the registered WASM modules. */
uint32_t ModNum = WasmEdge_StoreListModuleLength(StoreCxt);
/* Create the name buffers. */
const uint32_t BUF_LEN = 256;
WasmEdge_String ModNames[BUF_LEN];
/*
 * If the list length is larger than the buffer length, the overflowed data will
 * be discarded.
 */
uint32_t RealModNum = WasmEdge_StoreListModule(StoreCxt, ModNames, BUF_LEN);
for (uint32_t I = 0; I < RealModNum && I < BUF_LEN; I++) {
  /* Working with the module name `ModNames[I]` ... */
  /* The module names should __NOT__ be destroyed. */
}

/* Find named module by name. */
WasmEdge_String ModName = WasmEdge_StringCreateByCString("module");
const WasmEdge_ModuleInstanceContext *ModCxt =
    WasmEdge_StoreFindModule(StoreCxt, ModName);
/* If the module with name not found, the `ModCxt` will be NULL. */
WasmEdge_StringDelete(ModName);
```

### 實例

實例是 WASM 的執行環境結構。開發者可以從 `Store` 上下文取得 `Module` 實例，並從 `Module` 實例取得其他實例。單一實例可以透過其建立函式進行配置。開發者可以將實例建構到 `Module` 實例中以供註冊使用。詳細資訊請參閱[宿主函式](#host-functions)。透過建立函式建立的實例應由開發者自行刪除，唯一的例外是這些實例已被加入到 `Module` 實例中。

1. Module 實例

   實例化或註冊 `AST module` 上下文後，開發者會取得一個 `Module` 實例作為結果，並負責在不使用時將其刪除。`Module` 實例也可以為宿主模組建立。詳細資訊請參閱[宿主函式](#host-functions)。`Module` 實例提供 API 來列出與尋找模組中已匯出的實例。

   ```c
   /*
    * ...
    * Instantiate a WASM module via the executor context and get the `ModCxt`
    * as the output module instance.
    */

   /* Try to list the exported instance of the instantiated WASM module. */
   /* Take the function instances for example here. */
   uint32_t FuncNum = WasmEdge_ModuleInstanceListFunctionLength(ModCxt);
   /* Create the name buffers. */
   const uint32_t BUF_LEN = 256;
   WasmEdge_String FuncNames[BUF_LEN];
   /*
    * If the list length is larger than the buffer length, the overflowed data
    * will be discarded.
    */
   uint32_t RealFuncNum =
       WasmEdge_ModuleInstanceListFunction(ModCxt, FuncNames, BUF_LEN);
   for (uint32_t I = 0; I < RealFuncNum && I < BUF_LEN; I++) {
     /* Working with the function name `FuncNames[I]` ... */
     /* The function names should __NOT__ be destroyed. */
   }

   /* Try to find the exported instance of the instantiated WASM module. */
   /* Take the function instances for example here. */
   /* Function name. */
   WasmEdge_String FuncName = WasmEdge_StringCreateByCString("fib");
   WasmEdge_FunctionInstanceContext *FuncCxt =
       WasmEdge_ModuleInstanceFindFunction(ModCxt, FuncName);
   /* `FuncCxt` will be `NULL` if the function not found. */
   /*
    * The returned instance is owned by the module instance context and should
    * __NOT__ be destroyed.
    */
   WasmEdge_StringDelete(FuncName);
   ```

2. Function 實例

   [宿主函式](https://webassembly.github.io/spec/core/exec/runtime.html#syntax-hostfunc)是位於 WebAssembly 之外、並作為匯入傳遞給 WASM 模組的函式。在 WasmEdge 中，開發者可以為宿主函式建立 `Function` 上下文，並將其加入 `Module` 實例上下文，以便註冊到 `VM` 或 `Store` 中。開發者可以透過 API 從 `Function` 上下文取得 `Function Type`。關於`宿主函式`指南的詳細資訊，請參閱[下一章](#host-functions)。

   ```c
   /* Retrieve the function instance from the module instance context. */
   WasmEdge_FunctionInstanceContext *FuncCxt = ...;
   WasmEdge_FunctionTypeContext *FuncTypeCxt =
       WasmEdge_FunctionInstanceGetFunctionType(FuncCxt);
   /*
    * The `FuncTypeCxt` is owned by the `FuncCxt` and should __NOT__ be
    * destroyed.
    */

   /*
    * For the function instance creation, please refer to the `Host Function`
    * guide.
    */
   ```

3. Table 實例

   在 WasmEdge 中，開發者可以建立 `Table` 上下文並將其加入 `Module` 實例上下文，以便註冊到 `VM` 或 `Store` 中。`Table` 上下文提供 API 來控制 table 實例中的資料。

   ```c
   /* Create a limit context with min=10, max=20, 32-bit address, non-shared. */
   WasmEdge_LimitContext *TabLimit = WasmEdge_LimitCreateWithMax(10, 20, false, false);
   /* Create the table type with limit and the `FuncRef` element type. */
   WasmEdge_TableTypeContext *TabTypeCxt =
       WasmEdge_TableTypeCreate(WasmEdge_ValTypeGenFuncRef(), TabLimit);
   WasmEdge_LimitDelete(TabLimit);
   /* Create the table instance with table type. */
   /* 
    * Developers can also use the `WasmEdge_TableInstanceCreateWithInit()` API to
    * create the table instance with default reference values.
    */
   WasmEdge_TableInstanceContext *HostTable =
       WasmEdge_TableInstanceCreate(TabTypeCxt);
   /* Delete the table type. */
   WasmEdge_TableTypeDelete(TabTypeCxt);
   WasmEdge_Result Res;
   WasmEdge_Value Data;

   const WasmEdge_TableTypeContext *GotTabTypeCxt =
       WasmEdge_TableInstanceGetTableType(HostTable);
   /*
    * The `GotTabTypeCxt` got from table instance is owned by the `HostTable` and
    * should __NOT__ be destroyed.
    */
   WasmEdge_ValType RefType = WasmEdge_TableTypeGetRefType(GotGlobTypeCxt);
   bool IsTypeFuncRef = WasmEdge_ValTypeIsFuncRef(RefType);
   /* `IsTypeFuncRef` will be `TRUE`. */
   Data = WasmEdge_ValueGenFuncRef(5);
   Res = WasmEdge_TableInstanceSetData(HostTable, Data, 3);
   /* Set the function index 5 to the table[3]. */
   /*
    * This will get an "out of bounds table access" error
    * because the position (13) is out of the table size (10):
    *   Res = WasmEdge_TableInstanceSetData(HostTable, Data, 13);
    */
   Res = WasmEdge_TableInstanceGetData(HostTable, &Data, 3);
   /* Get the FuncRef value of the table[3]. */
   /*
    * This will get an "out of bounds table access" error
    * because the position (13) is out of the table size (10):
    *   Res = WasmEdge_TableInstanceGetData(HostTable, &Data, 13);
    */

   uint32_t Size = WasmEdge_TableInstanceGetSize(HostTable);
   /* `Size` will be 10. */
   Res = WasmEdge_TableInstanceGrow(HostTable, 6);
   /* Grow the table size of 6, the table size will be 16. */
   /*
    * This will get an "out of bounds table access" error because
    * the size (16 + 6) will reach the table limit(20):
    *   Res = WasmEdge_TableInstanceGrow(HostTable, 6);
    */

   WasmEdge_TableInstanceDelete(HostTable);
   ```

4. Memory 實例

   在 WasmEdge 中，開發者可以建立 `Memory` 上下文並將其加入 `Module` 實例上下文，以便註冊到 `VM` 或 `Store` 中。`Memory` 上下文提供 API 來控制 memory 實例中的資料。

   ```c
   /* Create a limit context with min=1, max=5, 32-bit address, non-shared. */
   WasmEdge_LimitContext *MemLimit = WasmEdge_LimitCreateWithMax(1, 5, false, false);
   /* Create the memory type with limit. The memory page size is 64KiB. */
   WasmEdge_MemoryTypeContext *MemTypeCxt =
       WasmEdge_MemoryTypeCreate(MemLimit);
   WasmEdge_LimitDelete(MemLimit);
   /* Create the memory instance with memory type. */
   WasmEdge_MemoryInstanceContext *HostMemory =
       WasmEdge_MemoryInstanceCreate(MemTypeCxt);
   /* Delete the memory type. */
   WasmEdge_MemoryTypeDelete(MemTypeCxt);
   WasmEdge_Result Res;
   uint8_t Buf[256];

   Buf[0] = 0xAA;
   Buf[1] = 0xBB;
   Buf[2] = 0xCC;
   Res = WasmEdge_MemoryInstanceSetData(HostMemory, Buf, 0x1000, 3);
   /* Set the data[0:2] to the memory[4096:4098]. */
   /*
    * This will get an "out of bounds memory access" error
    * because [65535:65537] is out of 1 page size (65536):
    *   Res = WasmEdge_MemoryInstanceSetData(HostMemory, Buf, 0xFFFF, 3);
    */
   Buf[0] = 0;
   Buf[1] = 0;
   Buf[2] = 0;
   Res = WasmEdge_MemoryInstanceGetData(HostMemory, Buf, 0x1000, 3);
   /* Get the memory[4096:4098]. Buf[0:2] will be `{0xAA, 0xBB, 0xCC}`. */
   /*
    * This will get an "out of bounds memory access" error
    * because [65535:65537] is out of 1 page size (65536):
    *   Res = WasmEdge_MemoryInstanceSetData(HostMemory, Buf, 0xFFFF, 3);
    */

   uint32_t PageSize = WasmEdge_MemoryInstanceGetPageSize(HostMemory);
   /* `PageSize` will be 1. */
   Res = WasmEdge_MemoryInstanceGrowPage(HostMemory, 2);
   /* Grow the page size of 2, the page size of the memory instance will be 3. */
   /*
    * This will get an "out of bounds memory access" error because
    * the page size (3 + 3) will reach the memory limit(5):
    *   Res = WasmEdge_MemoryInstanceGrowPage(HostMemory, 3);
    */

   WasmEdge_MemoryInstanceDelete(HostMemory);
   ```

5. Tag 實例

   與其他實例不同，`Tag` 上下文僅在開啟 `Exception Handling` 提案時才可使用，且只能從 `Module` 實例上下文取得。開發者可以從實例取得 `Tag Type`。

   ```c
   /*
    * ...
    * Instantiate a WASM module with exception handling instructions via the
    * executor context and get the `ModCxt` as the output module instance.
    */

   /* Try to list the exported tag instance of the instantiated WASM module. */
   uint32_t TagNum = WasmEdge_ModuleInstanceListTagLength(ModCxt);
   /* Create the name buffers. */
   const uint32_t BUF_LEN = 256;
   WasmEdge_String TagNames[BUF_LEN];
   /*
    * If the list length is larger than the buffer length, the overflowed data
    * will be discarded.
    */
   uint32_t RealTagNum = WasmEdge_ModuleInstanceListTag(ModCxt, TagNames, BUF_LEN);
   for (uint32_t I = 0; I < RealTagNum && I < BUF_LEN; I++) {
     /* Working with the tag name `TagNames[I]` ... */
     /* The function names should __NOT__ be destroyed. */
   }

   /* Try to find the exported tag instance of the instantiated WASM module. */
   WasmEdge_String TagName = WasmEdge_StringCreateByCString("tag-1");
   WasmEdge_TagInstanceContext *TagCxt =
       WasmEdge_ModuleInstanceFindTag(ModCxt, TagName);
   /* `TagCxt` will be `NULL` if the tag not found. */
   /*
    * The returned instance is owned by the module instance context and should
    * __NOT__ be destroyed.
    */

   /* Try to retrieve the tag type from the tag instance. */
   const WasmEdge_TagTypeContext *TagTypeCxt =
       WasmEdge_TagInstanceGetTagType(TagCxt);
   /*
    * The returned tag type context is owned by the tag instance context and should
    * __NOT__ be destroyed.
    */

   WasmEdge_StringDelete(TagName);
   ```

6. Global 實例

   在 WasmEdge 中，開發者可以建立 `Global` 上下文並將其加入 `Module` 實例上下文，以便註冊到 `VM` 或 `Store` 中。`Global` 上下文提供 API 來控制 global 實例中的值。

   ```c
   WasmEdge_Value Val = WasmEdge_ValueGenI64(1000);
   /* Create the global type with value type and mutation. */
   WasmEdge_GlobalTypeContext *GlobTypeCxt = WasmEdge_GlobalTypeCreate(
       WasmEdge_ValTypeGenI64(), WasmEdge_Mutability_Var);
   /* Create the global instance with value and global type. */
   WasmEdge_GlobalInstanceContext *HostGlobal =
       WasmEdge_GlobalInstanceCreate(GlobTypeCxt, Val);
   /* Delete the global type. */
   WasmEdge_GlobalTypeDelete(GlobTypeCxt);
   WasmEdge_Result Res;

   const WasmEdge_GlobalTypeContext *GotGlobTypeCxt =
       WasmEdge_GlobalInstanceGetGlobalType(HostGlobal);
   /*
    * The `GotGlobTypeCxt` got from global instance is owned by the `HostGlobal`
    * and should __NOT__ be destroyed.
    */
   WasmEdge_ValType ValType = WasmEdge_GlobalTypeGetValType(GotGlobTypeCxt);
   bool IsTypeF64 = WasmEdge_ValTypeIsI64(ValType);
   /* `ValType` will be `TRUE`. */
   enum WasmEdge_Mutability ValMut =
       WasmEdge_GlobalTypeGetMutability(GotGlobTypeCxt);
   /* `ValMut` will be `WasmEdge_Mutability_Var`. */

   Res = WasmEdge_GlobalInstanceSetValue(HostGlobal, WasmEdge_ValueGenI64(888));
   /*
    * Set the value u64(888) to the global.
    * This function will return error if the value type mismatched or
    * the global mutability is `WasmEdge_Mutability_Const`.
    */
   WasmEdge_Value GlobVal = WasmEdge_GlobalInstanceGetValue(HostGlobal);
   /* Get the value (888 now) of the global context. */

   WasmEdge_GlobalInstanceDelete(HostGlobal);
   ```

### 宿主函式

[宿主函式](https://webassembly.github.io/spec/core/exec/runtime.html#syntax-hostfunc)是位於 WebAssembly 之外，並作為匯入傳遞給 WASM 模組的函式。在 WasmEdge 中，開發者可以建立 `Function`、`Memory`、`Table` 和 `Global` 上下文，並將其加入 `Module` 實例上下文，以便註冊到 `VM` 或 `Store` 中。

1. 宿主函式的配置

   開發者可以定義具有以下函式簽章的 C 函式作為宿主函式主體：

   ```c
   typedef WasmEdge_Result (*WasmEdge_HostFunc_t)(
       void *Data, const WasmEdge_CallingFrameContext *CallFrameCxt,
       const WasmEdge_Value *Params, WasmEdge_Value *Returns);
   ```

   以下是一個用於將兩個 `i32` 值相加的 `add` 宿主函式範例：

   ```c
   WasmEdge_Result Add(void *, const WasmEdge_CallingFrameContext *,
                       const WasmEdge_Value *In, WasmEdge_Value *Out) {
     /*
      * Params: {i32, i32}
      * Returns: {i32}
      * Developers should take care about the function type.
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

   接著開發者可以使用宿主函式主體與函式型別建立 `Function` 上下文：

   ```c
   WasmEdge_ValType ParamList[2] = {WasmEdge_ValTypeGenI32(),
                                    WasmEdge_ValTypeGenI32()};
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
    * Developers should guarantee the life cycle of the data, and it can be
    * `NULL` if the external data is not needed.
    */
   WasmEdge_FunctionTypeDelete(HostType);

   /*
    * If the function instance is __NOT__ added into a module instance context,
    * it should be deleted.
    */
   WasmEdge_FunctionInstanceDelete(HostFunc);
   ```

2. 呼叫框架（Calling frame）上下文

   `WasmEdge_CallingFrameContext` 是一個讓開發者得以存取[呼叫堆疊頂端框架](https://webassembly.github.io/spec/core/exec/runtime.html#activations-and-frames)所屬模組實例的上下文。根據 [WASM 規範](https://webassembly.github.io/spec/core/exec/instructions.html#function-calls)，呼叫函式時會將一個帶有模組實例的框架推入堆疊。因此宿主函式可以存取堆疊頂端框架的模組實例，並從中取得記憶體實例以讀寫資料。

   ```c
   WasmEdge_Result LoadOffset(void *Data,
                              const WasmEdge_CallingFrameContext *CallFrameCxt,
                              const WasmEdge_Value *In, WasmEdge_Value *Out) {
     /* Function type: {i32} -> {} */
     uint32_t Offset = (uint32_t)WasmEdge_ValueGetI32(In[0]);
     uint32_t Num = 0;

     /*
      * Get the 0-th memory instance of the module instance of the top frame on
      * stack.
      */
     WasmEdge_MemoryInstanceContext *MemCxt =
         WasmEdge_CallingFrameGetMemoryInstance(CallFrameCxt, 0);

     WasmEdge_Result Res =
         WasmEdge_MemoryInstanceGetData(MemCxt, (uint8_t *)(&Num), Offset, 4);
     if (WasmEdge_ResultOK(Res)) {
       printf("u32 at memory[%lu]: %lu\n", Offset, Num);
     } else {
       return Res;
     }
     return WasmEdge_Result_Success;
   }
   ```

   除了使用 `WasmEdge_CallingFrameGetMemoryInstance()` API 透過索引從模組實例取得記憶體實例之外，開發者也可以使用 `WasmEdge_CallingFrameGetModuleInstance()` 直接取得模組實例。因此開發者可以透過 `WasmEdge_ModuleInstanceContext` 的 API 取得已匯出的上下文。此外開發者也可以使用 `WasmEdge_CallingFrameGetExecutor()` API 取得目前使用中的執行器上下文。

3. 宿主函式中使用者自訂的錯誤碼

   在宿主函式中，WasmEdge 提供 `WasmEdge_Result_Success` 代表成功、`WasmEdge_Result_Terminate` 用於終止 WASM 執行，以及 `WasmEdge_Result_Fail` 代表失敗。WasmEdge 也支援傳回使用者指定的錯誤碼。開發者可以使用 `WasmEdge_ResultGen()` API 產生帶有錯誤碼的 `WasmEdge_Result`，並使用 `WasmEdge_ResultGetCode()` API 取得錯誤碼。

   > 注意：錯誤碼僅支援 24 位元整數（`uint32_t` 中的 0 ~ 16777216）。超過 24 位元的數值會被截斷。

   假設 WAT 對應的簡易 WASM 如下：

   ```wasm
   (module
     (type $t0 (func (param i32)))
     (import "extern" "trap" (func $f-trap (type $t0)))
     (func (export "trap") (param i32)
       local.get 0
       call $f-trap)
   )
   ```

   而 `test.c` 內容如下：

   ```c
   #include <wasmedge/wasmedge.h>
   #include <stdio.h>

   /* Host function body definition. */
   WasmEdge_Result Trap(void *Data,
                        const WasmEdge_CallingFrameContext *CallFrameCxt,
                        const WasmEdge_Value *In, WasmEdge_Value *Out) {
     int32_t Val = WasmEdge_ValueGetI32(In[0]);
     /* Return the error code from the param[0]. */
     return WasmEdge_ResultGen(WasmEdge_ErrCategory_UserLevelError, Val);
   }

   int main() {
     /* Create the VM context. */
     WasmEdge_VMContext *VMCxt = WasmEdge_VMCreate(NULL, NULL);

     /* The WASM module buffer. */
     uint8_t WASM[] = {/* WASM header */
                       0x00, 0x61, 0x73, 0x6D, 0x01, 0x00, 0x00, 0x00,
                       /* Type section */
                       0x01, 0x05, 0x01,
                       /* function type {i32} -> {} */
                       0x60, 0x01, 0x7F, 0x00,
                       /* Import section */
                       0x02, 0x0F, 0x01,
                       /* module name: "extern" */
                       0x06, 0x65, 0x78, 0x74, 0x65, 0x72, 0x6E,
                       /* extern name: "trap" */
                       0x04, 0x74, 0x72, 0x61, 0x70,
                       /* import desc: func 0 */
                       0x00, 0x00,
                       /* Function section */
                       0x03, 0x02, 0x01, 0x00,
                       /* Export section */
                       0x07, 0x08, 0x01,
                       /* export name: "trap" */
                       0x04, 0x74, 0x72, 0x61, 0x70,
                       /* export desc: func 0 */
                       0x00, 0x01,
                       /* Code section */
                       0x0A, 0x08, 0x01,
                       /* code body */
                       0x06, 0x00, 0x20, 0x00, 0x10, 0x00, 0x0B};

     /* Create the module instance. */
     WasmEdge_String ExportName = WasmEdge_StringCreateByCString("extern");
     WasmEdge_ModuleInstanceContext *HostModCxt =
         WasmEdge_ModuleInstanceCreate(ExportName);
     WasmEdge_ValType ParamList[1] = {WasmEdge_ValTypeGenI32()};
     WasmEdge_FunctionTypeContext *HostFType =
         WasmEdge_FunctionTypeCreate(ParamList, 1, NULL, 0);
     WasmEdge_FunctionInstanceContext *HostFunc =
         WasmEdge_FunctionInstanceCreate(HostFType, Trap, NULL, 0);
     WasmEdge_FunctionTypeDelete(HostFType);
     WasmEdge_String HostFuncName = WasmEdge_StringCreateByCString("trap");
     WasmEdge_ModuleInstanceAddFunction(HostModCxt, HostFuncName, HostFunc);
     WasmEdge_StringDelete(HostFuncName);

     WasmEdge_VMRegisterModuleFromImport(VMCxt, HostModCxt);

     /* The parameters and returns arrays. */
     WasmEdge_Value Params[1] = {WasmEdge_ValueGenI32(5566)};
     /* Function name. */
     WasmEdge_String FuncName = WasmEdge_StringCreateByCString("trap");
     /* Run the WASM function from memory. */
     WasmEdge_Bytes Bytes = WasmEdge_BytesWrap(WASM, sizeof(WASM));
     /*
      * Note: `WasmEdge_VMRunWasmFromBuffer()` will be deprecated in the future.
      * We recommand developers to use `WasmEdge_VMRunWasmFromBytes()` instead.
      */
     WasmEdge_Result Res =
         WasmEdge_VMRunWasmFromBytes(VMCxt, Bytes, FuncName, Params, 1, NULL, 0);

     /* Get the result code and print. */
     printf("Get the error code: %u\n", WasmEdge_ResultGetCode(Res));

     /* Resources deallocations. */
     WasmEdge_VMDelete(VMCxt);
     WasmEdge_StringDelete(FuncName);
     WasmEdge_ModuleInstanceDelete(HostModCxt);
     return 0;
   }
   ```

   接著可以編譯並執行：（會得到預期的錯誤碼 `5566`）

   ```bash
   $ gcc test.c -lwasmedge
   $ ./a.out
   [2022-08-26 15:06:40.384] [error] user defined failed: user defined error code, Code: 0x15be
   [2022-08-26 15:06:40.384] [error]     When executing function name: "trap"
   Get the error code: 5566
   ```

4. 以宿主實例建構模組實例

   除了透過註冊或實例化 WASM 模組來建立 `Module` 實例之外，開發者也可以使用模組名稱建立 `Module` 實例，並以匯出名稱將 `Function`、`Memory`、`Table` 和 `Global` 實例加入其中。

   ```c
   /* Host function body definition. */
   WasmEdge_Result Add(void *Data,
                       const WasmEdge_CallingFrameContext *CallFrameCxt,
                       const WasmEdge_Value *In, WasmEdge_Value *Out) {
     int32_t Val1 = WasmEdge_ValueGetI32(In[0]);
     int32_t Val2 = WasmEdge_ValueGetI32(In[1]);
     Out[0] = WasmEdge_ValueGenI32(Val1 + Val2);
     return WasmEdge_Result_Success;
   }

   /* Create a module instance. */
   WasmEdge_String ExportName = WasmEdge_StringCreateByCString("module");
   WasmEdge_ModuleInstanceContext *HostModCxt =
       WasmEdge_ModuleInstanceCreate(ExportName);
   /*
    * Developers can also use the WasmEdge_ModuleInstanceCreateWithData() to
    * create the module instance with the data and its finalizer. It will be
    * introduced later.
    */
   WasmEdge_StringDelete(ExportName);

   /* Create and add a function instance into the module instance. */
   WasmEdge_ValType ParamList[2] = {WasmEdge_ValTypeGenI32(),
                                    WasmEdge_ValTypeGenI32()};
   WasmEdge_ValType ReturnList[1] = {WasmEdge_ValTypeGenI32()};
   WasmEdge_FunctionTypeContext *HostFType =
       WasmEdge_FunctionTypeCreate(ParamList, 2, ReturnList, 1);
   WasmEdge_FunctionInstanceContext *HostFunc =
       WasmEdge_FunctionInstanceCreate(HostFType, Add, NULL, 0);
   /*
    * The third parameter is the pointer to the additional data object.
    * Developers should guarantee the life cycle of the data, and it can be
    * `NULL` if the external data is not needed.
    */
   WasmEdge_FunctionTypeDelete(HostFType);
   WasmEdge_String FuncName = WasmEdge_StringCreateByCString("add");
   WasmEdge_ModuleInstanceAddFunction(HostModCxt, FuncName, HostFunc);
   WasmEdge_StringDelete(FuncName);

   /* Create and add a table instance into the import object. */
   WasmEdge_LimitContext *TableLimit = WasmEdge_LimitCreateWithMax(10, 20, false, false);
   WasmEdge_TableTypeContext *HostTType =
       WasmEdge_TableTypeCreate(WasmEdge_ValTypeGenFuncRef(), TableLimit);
   WasmEdge_LimitDelete(TableLimit);
   WasmEdge_TableInstanceContext *HostTable =
       WasmEdge_TableInstanceCreate(HostTType);
   WasmEdge_TableTypeDelete(HostTType);
   WasmEdge_String TableName = WasmEdge_StringCreateByCString("table");
   WasmEdge_ModuleInstanceAddTable(HostModCxt, TableName, HostTable);
   WasmEdge_StringDelete(TableName);

   /* Create and add a memory instance into the import object. */
   WasmEdge_LimitContext *MemoryLimit = WasmEdge_LimitCreateWithMax(1, 2, false, false);
   WasmEdge_MemoryTypeContext *HostMType =
       WasmEdge_MemoryTypeCreate(MemoryLimit);
   WasmEdge_LimitDelete(MemoryLimit);
   WasmEdge_MemoryInstanceContext *HostMemory =
       WasmEdge_MemoryInstanceCreate(HostMType);
   WasmEdge_MemoryTypeDelete(HostMType);
   WasmEdge_String MemoryName = WasmEdge_StringCreateByCString("memory");
   WasmEdge_ModuleInstanceAddMemory(HostModCxt, MemoryName, HostMemory);
   WasmEdge_StringDelete(MemoryName);

   /* Create and add a global instance into the module instance. */
   WasmEdge_GlobalTypeContext *HostGType = WasmEdge_GlobalTypeCreate(
       WasmEdge_ValTypeGenI32(), WasmEdge_Mutability_Var);
   WasmEdge_GlobalInstanceContext *HostGlobal =
       WasmEdge_GlobalInstanceCreate(HostGType, WasmEdge_ValueGenI32(666));
   WasmEdge_GlobalTypeDelete(HostGType);
   WasmEdge_String GlobalName = WasmEdge_StringCreateByCString("global");
   WasmEdge_ModuleInstanceAddGlobal(HostModCxt, GlobalName, HostGlobal);
   WasmEdge_StringDelete(GlobalName);

   /*
    * The module instance should be deleted.
    * Developers should __NOT__ destroy the instances added into the module
    * instance contexts.
    */
   WasmEdge_ModuleInstanceDelete(HostModCxt);
   ```

5. 特定模組實例

   `WasmEdge_ModuleInstanceCreateWASI()` API 可以建立並初始化 `WASI` 模組實例。

   開發者可以建立這些模組實例上下文並將其註冊到 `Store` 或 `VM` 上下文，而不需要調整 `Configure` 上下文中的設定。

   ```c
   WasmEdge_ModuleInstanceContext *WasiModCxt =
       WasmEdge_ModuleInstanceCreateWASI(/* ... ignored */);
   WasmEdge_VMContext *VMCxt = WasmEdge_VMCreate(NULL, NULL);
   /* Register the WASI and WasmEdge_Process into the VM context. */
   WasmEdge_VMRegisterModuleFromImport(VMCxt, WasiModCxt);
   /* Get the WASI exit code. */
   uint32_t ExitCode = WasmEdge_ModuleInstanceWASIGetExitCode(WasiModCxt);
   /*
    * The `ExitCode` will be EXIT_SUCCESS if the execution has no error.
    * Otherwise, it will return with the related exit code.
    */
   WasmEdge_VMDelete(VMCxt);
   /* The module instances should be deleted. */
   WasmEdge_ModuleInstanceDelete(WasiModCxt);
   ```

6. 範例

   假設 WAT 對應的簡易 WASM 如下：

   ```wasm
   (module
     (type $t0 (func (param i32 i32) (result i32)))
     (import "extern" "func-add" (func $f-add (type $t0)))
     (func (export "addTwo") (param i32 i32) (result i32)
       local.get 0
       local.get 1
       call $f-add)
   )
   ```

   而 `test.c` 內容如下：

   ```c
   #include <wasmedge/wasmedge.h>
   #include <stdio.h>

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
     WasmEdge_ValType ParamList[2] = {WasmEdge_ValTypeGenI32(),
                                      WasmEdge_ValTypeGenI32()};
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
     /* Run the WASM function from memory. */
     WasmEdge_Bytes Bytes = WasmEdge_BytesWrap(WASM, sizeof(WASM));
     /*
      * Note: `WasmEdge_VMRunWasmFromBuffer()` will be deprecated in the future.
      * We recommand developers to use `WasmEdge_VMRunWasmFromBytes()` instead.
      */
     WasmEdge_Result Res = WasmEdge_VMRunWasmFromBytes(VMCxt, Bytes, FuncName,
                                                       Params, 2, Returns, 1);

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

   接著可以編譯並執行：（1234 + 5678 的結果為 6912）

   ```bash
   $ gcc test.c -lwasmedge
   $ ./a.out
   Host function "Add": 1234 + 5678
   Get the result: 6912
   ```

7. 宿主資料範例

   開發者可以將外部資料物件設定到 `Function` 上下文，並在函式主體中存取該物件。假設 WAT 對應的簡易 WASM 如下：

   ```wasm
   (module
     (type $t0 (func (param i32 i32) (result i32)))
     (import "extern" "func-add" (func $f-add (type $t0)))
     (func (export "addTwo") (param i32 i32) (result i32)
       local.get 0
       local.get 1
       call $f-add)
   )
   ```

   而 `test.c` 內容如下：

   ```c
   #include <wasmedge/wasmedge.h>
   #include <stdio.h>

   /* Host function body definition. */
   WasmEdge_Result Add(void *Data,
                       const WasmEdge_CallingFrameContext *CallFrameCxt,
                       const WasmEdge_Value *In, WasmEdge_Value *Out) {
     int32_t Val1 = WasmEdge_ValueGetI32(In[0]);
     int32_t Val2 = WasmEdge_ValueGetI32(In[1]);
     printf("Host function \"Add\": %d + %d\n", Val1, Val2);
     Out[0] = WasmEdge_ValueGenI32(Val1 + Val2);
     /* Also set the result to the data. */
     int32_t *DataPtr = (int32_t *)Data;
     *DataPtr = Val1 + Val2;
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

     /* The external data object: an integer. */
     int32_t Data;

     /* Create the module instance. */
     WasmEdge_String ExportName = WasmEdge_StringCreateByCString("extern");
     WasmEdge_ModuleInstanceContext *HostModCxt =
         WasmEdge_ModuleInstanceCreate(ExportName);
     WasmEdge_ValType ParamList[2] = {WasmEdge_ValTypeGenI32(),
                                      WasmEdge_ValTypeGenI32()};
     WasmEdge_ValType ReturnList[1] = {WasmEdge_ValTypeGenI32()};
     WasmEdge_FunctionTypeContext *HostFType =
         WasmEdge_FunctionTypeCreate(ParamList, 2, ReturnList, 1);
     WasmEdge_FunctionInstanceContext *HostFunc =
         WasmEdge_FunctionInstanceCreate(HostFType, Add, &Data, 0);
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
     /* Run the WASM function from memory. */
     WasmEdge_Bytes Bytes = WasmEdge_BytesWrap(WASM, sizeof(WASM));
     /*
      * Note: `WasmEdge_VMRunWasmFromBuffer()` will be deprecated in the future.
      * We recommand developers to use `WasmEdge_VMRunWasmFromBytes()` instead.
      */
     WasmEdge_Result Res = WasmEdge_VMRunWasmFromBytes(VMCxt, Bytes, FuncName,
                                                       Params, 2, Returns, 1);

     if (WasmEdge_ResultOK(Res)) {
       printf("Get the result: %d\n", WasmEdge_ValueGetI32(Returns[0]));
     } else {
       printf("Error message: %s\n", WasmEdge_ResultGetMessage(Res));
     }
     printf("Data value: %d\n", Data);

     /* Resources deallocations. */
     WasmEdge_VMDelete(VMCxt);
     WasmEdge_StringDelete(FuncName);
     WasmEdge_ModuleInstanceDelete(HostModCxt);
     return 0;
   }
   ```

   接著可以編譯並執行：（1234 + 5678 的結果為 6912）

   ```bash
   $ gcc test.c -lwasmedge
   $ ./a.out
   Host function "Add": 1234 + 5678
   Get the result: 6912
   Data value: 6912
   ```

8. 模組實例中帶有終結器的宿主資料

   除了將宿主資料設定到宿主函式之外，開發者也可以將宿主資料的所有權連同其終結器一併設定並轉移到 `Module` 實例上下文中。這在實作外掛時非常有用。

   ```c
   /* Struct definition. */
   typedef struct Point {
     int X;
     int Y;
   } Point;

   /* Host function body definition. */
   WasmEdge_Result Print(void *Data,
                         const WasmEdge_CallingFrameContext *CallFrameCxt,
                         const WasmEdge_Value *In, WasmEdge_Value *Out) {
     Point *P = (Point *)In;
     printf("Point: (%d, %d)\n", P->X, P->Y);
     return WasmEdge_Result_Success;
   }

   /* Finalizer definition. */
   void PointFinalizer(void *Data) {
     if (Data) {
       free((Point *)Data);
     }
   }

   /* Create a module instance with host data and its finalizer. */
   WasmEdge_String ExportName = WasmEdge_StringCreateByCString("module");
   Point *Data = (Point *)malloc(sizeof(Point));
   Data->X = 5;
   Data->Y = -5;
   WasmEdge_ModuleInstanceContext *HostModCxt =
       WasmEdge_ModuleInstanceCreateWithData(ExportName, Data, PointFinalizer);
   /*
   * When the `HostModCxt` being destroyed, the finalizer will be invoked and the
   * `Data` will be its argument.
   */
   WasmEdge_StringDelete(ExportName);
   ```

### 外掛

WasmEdge 外掛是共用函式庫，可為 WasmEdge 執行環境提供載入並建立宿主模組實例的能力。透過外掛，WasmEdge 執行環境可以更輕鬆地進行擴充。

#### 從路徑載入外掛

要使用外掛，開發者應先從路徑載入外掛。

```c
WasmEdge_PluginLoadWithDefaultPaths();
```

呼叫此 API 後，預設路徑中的外掛將會被載入。預設路徑為：

1. 環境變數 `WASMEDGE_PLUGIN_PATH` 所指定的路徑。
2. 相對於 WasmEdge 安裝路徑的 `../plugin/` 目錄。
3. 若 WasmEdge 安裝在系統目錄下（例如 `/usr` 和 `/usr/local`），則為函式庫路徑下的 `./wasmedge/` 目錄。

要從特定路徑或在特定目錄下載入外掛，開發者可以使用此 API：

```c
WasmEdge_PluginLoadFromPath("PATH_TO_PLUGIN/plugin.so");
```

#### 依名稱取得外掛

載入外掛後，開發者可以列出已載入的外掛名稱。

```c
WasmEdge_PluginLoadWithDefaultPaths();
printf("Number of loaded plug-ins: %d\n", WasmEdge_PluginListPluginsLength());

WasmEdge_String Names[20];
uint32_t NumPlugins = WasmEdge_PluginListPlugins(Names, 20);
for (int I = 0; I < NumPlugins; I++) {
  printf("plug-in %d name: %s\n", I, Names[I].Buf);
}
```

且開發者可以依名稱取得外掛上下文。

```c
/* Assume that wasi_crypto plug-in is installed in the default plug-in path. */
WasmEdge_PluginLoadWithDefaultPaths();

const char PluginName[] = "wasi_crypto";
WasmEdge_String NameString =
    WasmEdge_StringWrap(PluginName, strlen(PluginName));
const WasmEdge_PluginContext *PluginCxt = WasmEdge_PluginFind(NameString);
```

#### 從外掛建立模組實例

取得外掛上下文後，開發者可以依模組名稱建立模組實例。

```c
/* Assume that the `PluginCxt` is the context to the wasi_crypto plug-in. */

/* List the available host modules in the plug-in. */
WasmEdge_String Names[20];
uint32_t ModuleLen = WasmEdge_PluginListModule(PluginCxt, Names, 20);
for (uint32_t I = 0; I < ModuleLen; I++) {
  /* Will print the available host module names in the plug-in. */
  printf("%s\n", Names[I].Buf);
}
/*
 * Will print here for the WASI-Crypto plug-in here:
 * wasi_ephemeral_crypto_asymmetric_common
 * wasi_ephemeral_crypto_common
 * wasi_ephemeral_crypto_kx
 * wasi_ephemeral_crypto_signatures
 * wasi_ephemeral_crypto_symmetric
 */

/* Create a module instance from the plug-in by the module name. */
const char ModuleName[] = "wasi_ephemeral_crypto_common";
WasmEdge_String NameString =
    WasmEdge_StringWrap(ModuleName, strlen(ModuleName));
WasmEdge_ModuleInstance *ModCxt =
    WasmEdge_PluginCreateModule(PluginCxt, NameString);

WasmEdge_ModuleInstanceDelete(ModCxt);
```

## WasmEdge AOT 編譯器

在本節中，我們將介紹 WasmEdge AOT 編譯器與其選項。

WasmEdge 以直譯模式執行 WASM 檔案，同時也支援不需要修改任何程式碼的 AOT（提前編譯）模式執行。WasmEdge AOT（提前編譯）編譯器會將 WASM 檔案編譯為可在 AOT 模式中執行的形式，效能比直譯模式快上許多。開發者可以將 WASM 檔案編譯為共用函式庫格式或通用 WASM 格式的已編譯 WASM 檔案，以供 AOT 模式執行使用。

### 編譯範例

假設 WASM 檔案 [`fibonacci.wasm`](https://raw.githubusercontent.com/WasmEdge/WasmEdge/master/examples/wasm/fibonacci.wat) 已複製到目前的目錄，且 C 檔案 `test.c` 的內容如下：

<!-- prettier-ignore -->
:::note
`fibonacci.wat` 檔案以文字格式提供。使用者應透過 [WABT 工具](https://github.com/WebAssembly/wabt)將其轉換為對應的 WASM 二進位格式。
:::

```c
#include <wasmedge/wasmedge.h>
#include <stdio.h>
int main() {
  /* Create the configure context. */
  WasmEdge_ConfigureContext *ConfCxt = WasmEdge_ConfigureCreate();
  /* ... Adjust settings in the configure context. */
  /* Result. */
  WasmEdge_Result Res;

  /* Create the compiler context. The configure context can be NULL. */
  WasmEdge_CompilerContext *CompilerCxt = WasmEdge_CompilerCreate(ConfCxt);
  /* Compile the WASM file with input and output paths. */
  Res = WasmEdge_CompilerCompile(CompilerCxt, "fibonacci.wasm",
                                 "fibonacci-aot.wasm");
  if (!WasmEdge_ResultOK(Res)) {
    printf("Compilation failed: %s\n", WasmEdge_ResultGetMessage(Res));
    return 1;
  }

  WasmEdge_CompilerDelete(CompilerCxt);
  WasmEdge_ConfigureDelete(ConfCxt);
  return 0;
}
```

接著可以編譯並執行（輸出檔案為「fibonacci-aot.wasm」）：

```bash
$ gcc test.c -lwasmedge
$ ./a.out
[2021-07-02 11:08:08.651] [info] compile start
[2021-07-02 11:08:08.653] [info] verify start
[2021-07-02 11:08:08.653] [info] optimize start
[2021-07-02 11:08:08.670] [info] codegen start
[2021-07-02 11:08:08.706] [info] compile done
```

### 編譯器選項

開發者可以為 AOT 編譯器設定選項，例如最佳化等級與輸出格式：

```c
/// AOT compiler optimization level enumeration.
enum WasmEdge_CompilerOptimizationLevel {
  /// Disable as many optimizations as possible.
  WasmEdge_CompilerOptimizationLevel_O0 = 0,
  /// Optimize quickly without destroying debuggability.
  WasmEdge_CompilerOptimizationLevel_O1,
  /// Optimize for fast execution as much as possible without triggering
  /// significant incremental compile time or code size growth.
  WasmEdge_CompilerOptimizationLevel_O2,
  /// Optimize for fast execution as much as possible.
  WasmEdge_CompilerOptimizationLevel_O3,
  /// Optimize for small code size as much as possible without triggering
  /// significant incremental compile time or execution time slowdowns.
  WasmEdge_CompilerOptimizationLevel_Os,
  /// Optimize for small code size as much as possible.
  WasmEdge_CompilerOptimizationLevel_Oz
};

/// AOT compiler output binary format enumeration.
enum WasmEdge_CompilerOutputFormat {
  /// Native dynamic library format.
  WasmEdge_CompilerOutputFormat_Native = 0,
  /// WebAssembly with AOT compiled codes in custom sections.
  WasmEdge_CompilerOutputFormat_Wasm
};
```

詳細資訊請參閱 [AOT 編譯器選項設定](#configurations)。

## WasmEdge CLI 工具

在本節中，我們將介紹用於觸發 WasmEdge CLI 工具的 C API。

除了直接執行 `wasmedge` 和 `wasmedgec` CLI 工具之外，開發者也可以透過 WasmEdge C API 觸發 WasmEdge CLI 工具。其 API 引數與 CLI 工具的命令列引數相同。

### Runtime CLI

`WasmEdge_Driver_Tool()` API 提供與執行 [`wasmedge run` 命令](../../../start/build-and-run/run.md)相同的功能。

請注意，此 API 對應於舊版的 `wasmedge` CLI 工具，其行為與 `wasmedge run` 命令相同。若要使用目前統一的 `wasmedge` CLI，請參閱[下方的 API](#unified-cli)。

```c
#include <wasmedge/wasmedge.h>
#include <stdio.h>
int main(int argc, const char *argv[]) {
  /* Run the WasmEdge runtime tool. */
  return WasmEdge_Driver_Tool(argc, argv);
}
```

### Compiler CLI

`WasmEdge_Driver_Compiler()` API 提供與執行 [`wasmedge compile` 工具](../../../start/build-and-run/aot.md)相同的功能。

請注意，此 API 對應於舊版的 `wasmedgec` CLI 工具，其行為與 `wasmedge compile` 命令相同。若要使用目前統一的 `wasmedge` CLI，請參閱[下方的 API](#unified-cli)。

```c
#include <wasmedge/wasmedge.h>
#include <stdio.h>
int main(int argc, const char *argv[]) {
  /* Run the WasmEdge AOT compiler. */
  return WasmEdge_Driver_Compiler(argc, argv);
}
```

### 統一 CLI

`WasmEdge_Driver_UniTool()` API 提供與執行 [`wasmedge` 工具](../../../start/build-and-run/cli.md)相同的功能。

```c
#include <wasmedge/wasmedge.h>
#include <stdio.h>
int main(int argc, const char *argv[]) {
  /* Run the WasmEdge unified tool. */
  /* (Within both runtime and AOT compiler) */
  return WasmEdge_Driver_UniTool(argc, argv);
}
```

### Windows 的 CLI 輔助工具

在 Windows 平台上，開發者可以使用 `WasmEdge_Driver_ArgvCreate()` 和 `WasmEdge_Driver_ArgvDelete()` API 來轉換並處理 `UTF-8` 命令列引數，或使用 `WasmEdge_Driver_SetConsoleOutputCPtoUTF8()` API 將主控台輸出的編碼頁設定為 `UTF-8`。
