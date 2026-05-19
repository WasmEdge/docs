---
sidebar_position: 2
---

# 升級至 WasmEdge 0.17.0

由於 WasmEdge C API 有破壞性變更，本文件說明使用 WasmEdge C API 從 `0.16.3` 升級到 `0.17.0` 版本的程式設計指引。

## 概念

1. 將 `WasmEdge_Limit` 結構重構為 `WasmEdge_LimitContext`。

   為了支援 [Memory64 提案](https://github.com/WebAssembly/memory64)，`WasmEdge_Limit` 結構被新的 `WasmEdge_LimitContext` 不透明型別所取代，新型別額外攜帶一個 64 位元位址旗標，並在內部使用 64 位元的最小值與最大值。

   開發者應使用下列 API 來建立、查詢與銷毀 `WasmEdge_LimitContext`：

   - `WasmEdge_LimitCreate()`：建立不含最大值的限制情境。
   - `WasmEdge_LimitCreateWithMax()`：建立含最大值的限制情境。
   - `WasmEdge_LimitGetMin()`：取得限制情境的最小值。
   - `WasmEdge_LimitGetMax()`：取得限制情境的最大值。
   - `WasmEdge_LimitHasMax()`：取得限制情境的有最大值選項。
   - `WasmEdge_LimitIsShared()`：取得限制情境的可共用選項。
   - `WasmEdge_LimitIs64Bit()`：取得限制情境的 64 位元位址型別選項。
   - `WasmEdge_LimitDelete()`：銷毀限制情境。

   `WasmEdge_LimitIsEqual()` 的簽章已更新，改為接受兩個 `const WasmEdge_LimitContext *` 引數，而不再是兩個 `WasmEdge_Limit` 結構。

   下列 API 也已更新為接受或回傳 `WasmEdge_LimitContext`：

   - `WasmEdge_TableTypeCreate()`
   - `WasmEdge_TableTypeGetLimit()`
   - `WasmEdge_MemoryTypeCreate()`
   - `WasmEdge_MemoryTypeGetLimit()`

2. 引入了 `WasmEdge_RunMode` 列舉及其相關 API。

   不再使用強制解譯器模式的布林旗標，而是引入新的三態 `WasmEdge_RunMode` 列舉來選擇 WASM 執行引擎：解譯器（預設）、JIT 或 AOT。新的 API 包括：

   - `WasmEdge_ConfigureSetRunMode()`：在設定情境中設定執行模式。
   - `WasmEdge_ConfigureGetRunMode()`：從設定情境中取得執行模式。

   下列 API 已棄用並移至 `wasmedge_deprecated.h` 標頭檔。它們仍可運作但未來會被移除：

   - `WasmEdge_ConfigureSetForceInterpreter()`：請改用 `WasmEdge_ConfigureSetRunMode()` 搭配 `WasmEdge_RunMode_Interpreter`。
   - `WasmEdge_ConfigureIsForceInterpreter()`：請改用 `WasmEdge_ConfigureGetRunMode()` 並與 `WasmEdge_RunMode_Interpreter` 進行比較。

3. 引入了以別名註冊模組實例的全新 API。

   新增下列 API，可使用指定名稱（而非模組自身名稱）來註冊模組實例。對於必須在不同匯入命名空間名稱下存取的共用模組而言，這相當實用。

   - `WasmEdge_ExecutorRegisterImportWithAlias()`：以別名將模組實例註冊到儲存區。
   - `WasmEdge_VMRegisterModuleFromImportWithAlias()`：以別名將模組實例註冊到 VM。

4. 支援 [Memory64 提案](https://github.com/WebAssembly/memory64)。

   解譯器與 AOT/JIT 編譯器皆支援 Memory64。作為 WASM 3.0 標準的一部分，該提案預設啟用。開發者可以將 `true` 作為 `Is64Bit` 參數傳給 `WasmEdge_LimitCreate()` 或 `WasmEdge_LimitCreateWithMax()` 來建立 64 位元的記憶體型別。

## 表格型別與記憶體型別的限制情境

在 `0.16.3` 之前的版本中，`WasmEdge_Limit` 是一個一般結構，開發者以傳值的方式將其傳遞給表格型別與記憶體型別的建立 API。

```c
WasmEdge_Limit TabLim = {
    .HasMax = true, .Shared = false, .Min = 10, .Max = 20};
WasmEdge_TableTypeContext *TabType =
    WasmEdge_TableTypeCreate(WasmEdge_ValTypeGenFuncRef(), TabLim);

WasmEdge_Limit GotTabLim = WasmEdge_TableTypeGetLimit(TabType);
uint32_t Min = GotTabLim.Min;
uint32_t Max = GotTabLim.Max;
WasmEdge_TableTypeDelete(TabType);

WasmEdge_Limit MemLim = {
    .HasMax = true, .Shared = false, .Min = 1, .Max = 5};
WasmEdge_MemoryTypeContext *MemType = WasmEdge_MemoryTypeCreate(MemLim);
WasmEdge_MemoryTypeDelete(MemType);
```

在 `0.17.0` 之後，`WasmEdge_LimitContext` 是一個不透明物件。開發者應透過 `WasmEdge_LimitCreate()` 或 `WasmEdge_LimitCreateWithMax()` 建立、將指標傳遞給型別建立 API，並在不再需要時透過 `WasmEdge_LimitDelete()` 銷毀。

```c
/* Create a limit context with min=10, max=20, 32-bit address, non-shared. */
WasmEdge_LimitContext *TabLim = WasmEdge_LimitCreateWithMax(10, 20, false, false);
WasmEdge_TableTypeContext *TabType =
    WasmEdge_TableTypeCreate(WasmEdge_ValTypeGenFuncRef(), TabLim);
/* The limit context can be deleted after the type creation. */
WasmEdge_LimitDelete(TabLim);

/*
 * The limit context returned from `WasmEdge_TableTypeGetLimit()` or
 * `WasmEdge_MemoryTypeGetLimit()` is owned by the type context and should
 * __NOT__ be deleted by developers.
 */
const WasmEdge_LimitContext *GotTabLim = WasmEdge_TableTypeGetLimit(TabType);
uint64_t Min = WasmEdge_LimitGetMin(GotTabLim);
uint64_t Max = WasmEdge_LimitGetMax(GotTabLim);
WasmEdge_TableTypeDelete(TabType);

WasmEdge_LimitContext *MemLim = WasmEdge_LimitCreateWithMax(1, 5, false, false);
WasmEdge_MemoryTypeContext *MemType = WasmEdge_MemoryTypeCreate(MemLim);
WasmEdge_LimitDelete(MemLim);
WasmEdge_MemoryTypeDelete(MemType);
```

## 執行模式設定

在 `0.16.3` 之前的版本中，設定情境中唯一的執行引擎開關是布林值 `ForceInterpreter` 旗標。

```c
WasmEdge_ConfigureContext *ConfCxt = WasmEdge_ConfigureCreate();
WasmEdge_ConfigureSetForceInterpreter(ConfCxt, true);
bool IsForceInterp = WasmEdge_ConfigureIsForceInterpreter(ConfCxt);
WasmEdge_ConfigureDelete(ConfCxt);
```

在 `0.17.0` 之後，三態的 `WasmEdge_RunMode` 列舉取代了布林旗標。

```c
enum WasmEdge_RunMode {
  WasmEdge_RunMode_Interpreter = 0, // Default, interpreter mode.
  WasmEdge_RunMode_JIT,             // JIT mode.
  WasmEdge_RunMode_AOT,             // AOT mode.
};
```

只有 `WasmEdge_RunMode_AOT` 會從通用 WASM 載入 AOT 自訂區段，或對共用函式庫 WASM 產物進行 `dlopen`。在其他模式中，AOT 資料會被忽略，而共用函式庫輸入會在擷取其內嵌位元組之後，重新以一般 WASM 載入。

```c
WasmEdge_ConfigureContext *ConfCxt = WasmEdge_ConfigureCreate();
WasmEdge_ConfigureSetRunMode(ConfCxt, WasmEdge_RunMode_AOT);
enum WasmEdge_RunMode Mode = WasmEdge_ConfigureGetRunMode(ConfCxt);
WasmEdge_ConfigureDelete(ConfCxt);
```

<!-- prettier-ignore -->
:::note
為了保持向後相容性，仍保留了 `WasmEdge_ConfigureSetForceInterpreter()` 與 `WasmEdge_ConfigureIsForceInterpreter()` API，但已移至 `wasmedge_deprecated.h` 標頭檔。它們會在內部轉譯為新的執行模式欄位，且未來會被移除。
:::

## 以別名註冊模組實例

在 `0.16.3` 之前的版本中，模組實例只能以模組實例建立時所設定的自身模組名稱，註冊到儲存區或 VM 中。

```c
WasmEdge_VMContext *VMCxt = WasmEdge_VMCreate(NULL, NULL);
WasmEdge_ModuleInstanceContext *HostMod =
    WasmEdge_ModuleInstanceCreate(/* ... ignored ... */);
WasmEdge_Result Res = WasmEdge_VMRegisterModuleFromImport(VMCxt, HostMod);

WasmEdge_ModuleInstanceDelete(HostMod);
WasmEdge_VMDelete(VMCxt);
```

在 `0.17.0` 之後，開發者可以透過新的 `WasmEdge_ExecutorRegisterImportWithAlias()` 與 `WasmEdge_VMRegisterModuleFromImportWithAlias()` API，以任意別名註冊模組實例。同一個模組實例現在可以在同一個儲存區或 VM 中以多個別名註冊。

```c
WasmEdge_VMContext *VMCxt = WasmEdge_VMCreate(NULL, NULL);
WasmEdge_ModuleInstanceContext *HostMod =
    WasmEdge_ModuleInstanceCreate(/* ... ignored ... */);
WasmEdge_String AliasName = WasmEdge_StringCreateByCString("alias_name");

WasmEdge_Result Res =
    WasmEdge_VMRegisterModuleFromImportWithAlias(VMCxt, AliasName, HostMod);

WasmEdge_StringDelete(AliasName);
WasmEdge_ModuleInstanceDelete(HostMod);
WasmEdge_VMDelete(VMCxt);
```

## Memory64 提案

自 `0.17.0` 發行版本起，WasmEdge 在解譯器與 AOT/JIT 編譯器中皆支援 [Memory64 提案](https://github.com/WebAssembly/memory64)。作為 WASM 3.0 標準的一部分，該提案預設啟用，開發者不需要在設定情境中將其開啟。

要建立 64 位元的記憶體型別，建構限制情境時請將 `true` 作為 `Is64Bit` 參數傳入。

```c
/* Create a 64-bit memory type with min=1 page, no max. */
WasmEdge_LimitContext *Mem64Lim = WasmEdge_LimitCreate(1, /* Is64Bit */ true);
WasmEdge_MemoryTypeContext *Mem64Type = WasmEdge_MemoryTypeCreate(Mem64Lim);
WasmEdge_LimitDelete(Mem64Lim);

/* ... */

WasmEdge_MemoryTypeDelete(Mem64Type);
```
