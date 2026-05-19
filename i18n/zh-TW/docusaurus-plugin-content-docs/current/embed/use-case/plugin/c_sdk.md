---
sidebar_position: 1
---

# 在 C 中使用外掛擴充執行環境

WasmEdge 外掛是讓 WasmEdge 執行環境用來載入並建立主機模組實例的共享函式庫。透過外掛，WasmEdge 執行環境可以更輕鬆地進行擴充。

## 從路徑載入外掛

開發者可以透過從特定路徑載入外掛來開始使用 WasmEdge 外掛。要從預設路徑載入外掛，可以使用以下 API：

```c
WasmEdge_PluginLoadWithDefaultPaths();
```

呼叫此 API 後，會載入預設路徑中的外掛。預設路徑包含：

- `WASMEDGE_PLUGIN_PATH` 環境變數中指定的路徑。
- 相對於 WasmEdge 安裝路徑的 `../plugin/` 目錄。
- 若 WasmEdge 安裝於系統目錄中（例如 `/usr` 與 `/usr/local`），則為函式庫路徑下的 `./wasmedge/` 目錄。

開發者也可以使用此 API 從特定路徑載入外掛：

```c
WasmEdge_PluginLoadFromPath("PATH_TO_PLUGIN/plugin.so");
```

## 列出已載入的外掛

外掛載入後，開發者可以使用以下方式列出已載入的外掛名稱：

```c
WasmEdge_PluginLoadWithDefaultPaths();
printf("Number of loaded plug-ins: %d\n", WasmEdge_PluginListPluginsLength());

WasmEdge_String Names[20];
uint32_t NumPlugins = WasmEdge_PluginListPlugins(Names, 20);
for (int I = 0; I < NumPlugins; I++) {
  printf("Plug-in %d name: %s\n", I, Names[I].Buf);
}
```

## 依名稱取得外掛 Context

開發者可以使用以下方法依名稱取得外掛 context：

```c
/* Assume that wasi_crypto plug-in is installed in the default plug-in path. */
WasmEdge_PluginLoadWithDefaultPaths();

const char PluginName[] = "wasi_crypto";
WasmEdge_String NameString =
    WasmEdge_StringWrap(PluginName, strlen(PluginName));
const WasmEdge_PluginContext *PluginCxt = WasmEdge_PluginFind(NameString);
```

## 從外掛建立模組實例

有了外掛 context，開發者可以透過提供模組名稱來建立模組實例：

```c
/* Assume that the `PluginCxt` is the context to the wasi_crypto plug-in. */

/* List the available host modules in the plug-in. */
WasmEdge_String Names[20];
uint32_t ModuleLen = WasmEdge_PluginListModule(PluginCxt, Names, 20);
for (uint32_t I = 0; I < ModuleLen; I++) {
  /* Will print the available host module names in the plug-in. */
  printf("%s\n", Names[I].Buf);
}
/* Will print here for the WASI-Crypto plug-in here:
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

若使用者 [透過安裝程式安裝了 WasmEdge 外掛](/contribute/installer.md#plugins)，預設外掛路徑中可能會有數個外掛。

在使用外掛之前，開發者應先 [從路徑載入外掛](#從路徑載入外掛)。

## 自動模組建立與模擬

在建立 `VM` context 時，WasmEdge 執行環境會自動建立並註冊已載入外掛的模組。在特定外掛未載入的情況下，WasmEdge 會為某些主機模組提供模擬實作。這些被模擬的模組包含：

- `wasi_ephemeral_crypto_asymmetric_common`（對應 `WASI-Crypto`）
- `wasi_ephemeral_crypto_common`（對應 `WASI-Crypto`）
- `wasi_ephemeral_crypto_kx`（對應 `WASI-Crypto`）
- `wasi_ephemeral_crypto_signatures`（對應 `WASI-Crypto`）
- `wasi_ephemeral_crypto_symmetric`（對應 `WASI-Crypto`）
- `wasi_ephemeral_nn`
- `wasi_snapshot_preview1`
- `wasmedge_httpsreq`
- `wasmedge_process`

## 處理外掛缺失與錯誤訊息

當 WASM 想要呼叫這些主機函式但對應的外掛未安裝時，WasmEdge 會印出錯誤訊息並回傳錯誤。

```c
/* Load the plug-ins in the default paths first. */
WasmEdge_PluginLoadWithDefaultPaths();
/* Create the configure context and add the WASI configuration. */
WasmEdge_ConfigureContext *ConfCxt = WasmEdge_ConfigureCreate();
WasmEdge_ConfigureAddHostRegistration(ConfCxt,
                                        WasmEdge_HostRegistration_Wasi);
WasmEdge_VMContext *VMCxt = WasmEdge_VMCreate(ConfCxt, NULL);
WasmEdge_ConfigureDelete(ConfCxt);
/* The following API can retrieve the registered modules in the VM context,
* includes the built-in WASI and the plug-ins.
*/
/*
* This API will return `NULL` if the module instance is not found.
*/
WasmEdge_String WasiName =
    WasmEdge_StringCreateByCString("wasi_snapshot_preview1");
/* The `WasiModule` will not be `NULL` because the configuration was set. */
const WasmEdge_ModuleInstanceContext *WasiModule =
    WasmEdge_VMGetRegisteredModule(VMCxt, WasiName);
WasmEdge_StringDelete(WasiName);
WasmEdge_String WasiNNName =
    WasmEdge_StringCreateByCString("wasi_ephemeral_nn");
/* The `WasiNNModule` will not be `NULL` even if the wasi_nn plug-in is not
* installed, because the VM context will mock and register the host
* modules.
*/
const WasmEdge_ModuleInstanceContext *WasiNNModule =
    WasmEdge_VMGetRegisteredModule(VMCxt, WasiNNName);
WasmEdge_StringDelete(WasiNNName);

WasmEdge_VMDelete(VMCxt);
```
