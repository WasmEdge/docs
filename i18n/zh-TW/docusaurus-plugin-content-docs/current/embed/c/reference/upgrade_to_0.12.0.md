---
sidebar_position: 12
---

# 升級至 WasmEdge 0.12.0

由於 WasmEdge C API 有破壞性變更，本文件說明使用 WasmEdge C API 從 `0.11.2` 升級到 `0.12.0` 版本的程式設計指引。

## 概念

1. 移除了 `WasmEdge_HostRegistration` 列舉的成員。

   下列 `WasmEdge_HostRegistration` 列舉的成員已被移除：

   - `WasmEdge_HostRegistration_WasmEdge_Process`
   - `WasmEdge_HostRegistration_WasiNN`
   - `WasmEdge_HostRegistration_WasiCrypto_Common`
   - `WasmEdge_HostRegistration_WasiCrypto_AsymmetricCommon`
   - `WasmEdge_HostRegistration_WasiCrypto_Kx`
   - `WasmEdge_HostRegistration_WasiCrypto_Signatures`
   - `WasmEdge_HostRegistration_WasiCrypto_Symmetric`

   現在 `WasmEdge_VMContext` 會自動建立並註冊主機模組。如果未載入外掛，`WasmEdge_VMContext` 會建立並註冊模擬模組，以防止匯入失敗。

2. 移除了外掛的模組實例建立函式。

   下列 API 已被移除：

   - `WasmEdge_ModuleInstanceCreateWasiNN()`
   - `WasmEdge_ModuleInstanceCreateWasiCryptoCommon()`
   - `WasmEdge_ModuleInstanceCreateWasiCryptoAsymmetricCommon()`
   - `WasmEdge_ModuleInstanceCreateWasiCryptoKx()`
   - `WasmEdge_ModuleInstanceCreateWasiCryptoSignatures()`
   - `WasmEdge_ModuleInstanceCreateWasiCryptoSymmetric()`
   - `WasmEdge_ModuleInstanceCreateWasmEdgeProcess()`

   關於從外掛建立模組實例的新範例，請參閱[下方範例](#creating-the-module-instance-from-a-plug-in)。

3. `VM` 情境的新模組實例擷取 API。

   - 新增 `WasmEdge_VMGetRegisteredModule()`，可在 VM 情境中快速擷取已註冊的具名模組。
   - 新增 `WasmEdge_VMListRegisteredModuleLength()` 與 `WasmEdge_VMListRegisteredModule()`，可在 VM 情境中快速列出已註冊的具名模組。

## VM 情境中不再需要為外掛設定 `WasmEdge_HostRegistration`

在 `0.11.2` 之前的版本中，當開發者想要在 VM 中載入外掛時，必須加入設定：

```c
/* Assume that wasi_crypto plug-in is installed in the default plug-in path. */
WasmEdge_PluginLoadWithDefaultPaths();
WasmEdge_ConfigureContext *Conf = WasmEdge_ConfigureCreate();
WasmEdge_ConfigureAddHostRegistration(
    Conf, WasmEdge_HostRegistration_WasiCrypto_Common);
WasmEdge_ConfigureAddHostRegistration(
    Conf, WasmEdge_HostRegistration_WasiCrypto_AsymmetricCommon);
WasmEdge_ConfigureAddHostRegistration(Conf,
                                      WasmEdge_HostRegistration_WasiCrypto_Kx);
WasmEdge_ConfigureAddHostRegistration(
    Conf, WasmEdge_HostRegistration_WasiCrypto_Signatures);
WasmEdge_ConfigureAddHostRegistration(
    Conf, WasmEdge_HostRegistration_WasiCrypto_Symmetric);
WasmEdge_VMContext *VMCxt = WasmEdge_VMCreate(Conf, NULL);
WasmEdge_ConfigureDelete(Conf);

WasmEdge_String Names[32];
WasmEdge_StoreContext *StoreCxt = WasmEdge_VMGetStoreContext(VMCxt);
uint32_t ModuleLen = WasmEdge_StoreListModule(StoreCxt, Names, 32);
for (uint32_t I = 0; I < ModuleLen; I++) {
  printf("%s\n", Names[I].Buf);
}
/*
 * Will print:
 * wasi_ephemeral_crypto_asymmetric_common
 * wasi_ephemeral_crypto_common
 * wasi_ephemeral_crypto_kx
 * wasi_ephemeral_crypto_signatures
 * wasi_ephemeral_crypto_symmetric
 */
WasmEdge_VMDelete(VMCxt);
```

在 `0.12.0` 之後，呼叫 `WasmEdge_PluginLoadWithDefaultPaths()` 或將特定路徑傳入 `WasmEdge_PluginLoadFromPath()` API 之後，外掛會自動載入。

對於未安裝的外掛，模擬的模組會被註冊到 VM 情境中，並在呼叫主機函式時印出錯誤訊息，以通知使用者安裝該外掛。

```c
WasmEdge_PluginLoadWithDefaultPaths();
WasmEdge_ConfigureContext *Conf = WasmEdge_ConfigureCreate();
/* The `WasmEdge_HostRegistration_Wasi` is still needed. */
WasmEdge_ConfigureAddHostRegistration(Conf, WasmEdge_HostRegistration_Wasi);
WasmEdge_VMContext *VMCxt = WasmEdge_VMCreate(Conf, NULL);
WasmEdge_ConfigureDelete(Conf);

WasmEdge_String Names[32];
uint32_t ModuleLen = WasmEdge_VMListRegisteredModule(VMCxt, Names, 32);
for (uint32_t I = 0; I < ModuleLen; I++) {
  printf("%s\n", Names[I].Buf);
}
/*
 * Will print:
 * wasi_ephemeral_crypto_asymmetric_common
 * wasi_ephemeral_crypto_common
 * wasi_ephemeral_crypto_kx
 * wasi_ephemeral_crypto_signatures
 * wasi_ephemeral_crypto_symmetric
 * wasi_ephemeral_nn
 * wasi_snapshot_preview1
 * wasmedge_httpsreq
 * wasmedge_process
 */
WasmEdge_VMDelete(VMCxt);
```

<!-- prettier-ignore -->
:::note
如果開發者想使用 WASI，仍然需要 `WasmEdge_HostRegistration_Wasi` 設定。
:::

## 從外掛建立模組實例

當開發者沒有使用 VM 情境來載入外掛時，可以使用 `0.11.2` 之前版本的建立函式：

```c
/* Assume that wasi_crypto plug-in is installed in the default plug-in path. */
WasmEdge_PluginLoadWithDefaultPaths();

WasmEdge_ModuleInstance *WasiCryptoCommonCxt =
    WasmEdge_ModuleInstanceCreateWasiCryptoCommon();

WasmEdge_ModuleInstanceDelete(WasiCryptoCommonCxt);
```

但如果開發者必須為不同的外掛使用不同的 API，這既不合理也缺乏擴充性。

在 `0.12.0` 版本之後，新增了 `WasmEdge_PluginContext`，開發者可以使用通用的 API 來建立模組實例：

```c
/* Assume that wasi_crypto plug-in is installed in the default plug-in path. */
WasmEdge_PluginLoadWithDefaultPaths();

const char CryptoPName[] = "wasi_crypto";
const char CryptoMName[] = "wasi_crypto_common";
WasmEdge_String PluginName =
    WasmEdge_StringWrap(CryptoPName, strlen(CryptoPName));
WasmEdge_String ModuleName =
    WasmEdge_StringWrap(CryptoMName, strlen(CryptoMName));
const WasmEdge_PluginContext *PluginCxt = WasmEdge_PluginFind(PluginName);

WasmEdge_ModuleInstance *ModCxt =
    WasmEdge_PluginCreateModule(PluginCxt, ModuleName);

WasmEdge_ModuleInstanceDelete(ModCxt);
```

## 從 VM 情境擷取模組實例

在 `0.11.2` 之前的版本中，開發者可以使用 `WasmEdge_HostRegistration` 值來擷取 `WASI` 或外掛中的模組，或從儲存區情境擷取已註冊的模組。

```c
/* Assume that wasi_crypto plug-in is installed in the default plug-in path. */
WasmEdge_PluginLoadWithDefaultPaths();
WasmEdge_ConfigureContext *Conf = WasmEdge_ConfigureCreate();
/* Add the WASI-Crypto related configurations. */
WasmEdge_ConfigureAddHostRegistration(
    Conf, WasmEdge_HostRegistration_WasiCrypto_Common);
WasmEdge_ConfigureAddHostRegistration(
    Conf, WasmEdge_HostRegistration_WasiCrypto_AsymmetricCommon);
WasmEdge_ConfigureAddHostRegistration(Conf,
                                      WasmEdge_HostRegistration_WasiCrypto_Kx);
WasmEdge_ConfigureAddHostRegistration(
    Conf, WasmEdge_HostRegistration_WasiCrypto_Signatures);
WasmEdge_ConfigureAddHostRegistration(
    Conf, WasmEdge_HostRegistration_WasiCrypto_Symmetric);
/* Add the WASI configurations. */
WasmEdge_ConfigureAddHostRegistration(Conf, WasmEdge_HostRegistration_Wasi);
WasmEdge_VMContext *VMCxt = WasmEdge_VMCreate(Conf, NULL);
WasmEdge_ConfigureDelete(Conf);

/* Get the WASI module instance. */
WasmEdge_ModuleInstance *WASIModInst =
    WasmEdge_VMGetImportModuleContext(VMCxt, WasmEdge_HostRegistration_Wasi);
/* Get the WASI-crypto-common module instance. */
WasmEdge_ModuleInstance *WASICryptoCommonModInst =
    WasmEdge_VMGetImportModuleContext(
        VMCxt, WasmEdge_HostRegistration_WasiCrypto_Common);

/* Get the registered module instance by name. */
WasmEdge_StoreContext *StoreCxt = WasmEdge_VMGetStoreContext(VMCxt);
WasmEdge_String ModName =
    WasmEdge_StringCreateByCString("wasi_ephemeral_crypto_kx");
const WasmEdge_ModuleInstance *WASICryptoKxModInst =
    WasmEdge_StoreFindModule(StoreCxt, ModName);
WasmEdge_StringDelete(ModName);

WasmEdge_VMDelete(VMCxt);
```

在 `0.12.0` 版本之後，由於移除了與外掛相關的設定，且外掛會自動註冊到 VM 情境中，因此除了內建主機模組（目前是 `WASI`）之外，開發者無法再使用 `WasmEdge_VMGetImportModuleContext()` API 來擷取模組實例。

不過，開發者可以使用新的 API 更快速地擷取已註冊的模組實例。

```c
/* Assume that wasi_crypto plug-in is installed in the default plug-in path. */
WasmEdge_PluginLoadWithDefaultPaths();
WasmEdge_ConfigureContext *Conf = WasmEdge_ConfigureCreate();
/* Add the WASI configurations. */
WasmEdge_ConfigureAddHostRegistration(Conf, WasmEdge_HostRegistration_Wasi);
WasmEdge_VMContext *VMCxt = WasmEdge_VMCreate(Conf, NULL);
WasmEdge_ConfigureDelete(Conf);

/* Get the WASI module instance. */
WasmEdge_ModuleInstance *WASIModInst =
    WasmEdge_VMGetImportModuleContext(VMCxt, WasmEdge_HostRegistration_Wasi);
/* Get the registered WASI-crypto-common module instance by name. */
WasmEdge_String ModName =
    WasmEdge_StringCreateByCString("wasi_ephemeral_crypto_common");
const WasmEdge_ModuleInstance *WASICryptoKxModInst =
    WasmEdge_VMGetImportModuleContext(VMCxt, ModName);
WasmEdge_StringDelete(ModName);

WasmEdge_VMDelete(VMCxt);
```
