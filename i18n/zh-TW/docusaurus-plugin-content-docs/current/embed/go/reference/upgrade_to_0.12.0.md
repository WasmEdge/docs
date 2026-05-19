---
sidebar_position: 6
---

# 升級至 WasmEdge-Go v0.12.0

由於 WasmEdge-Go API 有破壞性變更，本文件說明使用 WasmEdge-Go API 從 `v0.11.2` 升級到 `v0.12.0` 版本的程式設計指引。

## 概念

1. 移除了 `wasmedge.HostRegistration` 相關常數值的成員。

   下列常數值已被移除：

   - `wasmedge.WasmEdge_Process`
   - `wasmedge.WasiNN`
   - `wasmedge.WasiCrypto_Common`
   - `wasmedge.WasiCrypto_AsymmetricCommon`
   - `wasmedge.WasiCrypto_Kx`
   - `wasmedge.WasiCrypto_Signatures`
   - `wasmedge.WasiCrypto_Symmetric`

   現在 `wasmedge.VM` 物件會自動建立並註冊主機模組。如果未載入外掛，`VM` 物件會建立並註冊模擬模組，以防止匯入失敗。

2. 移除了外掛的模組實例建立函式。

   下列 API 已被移除：

   - `wasmedge.NewWasiNNModule()`
   - `wasmedge.NewWasiCryptoCommonModule()`
   - `wasmedge.NewWasiCryptoAsymmetricCommonModule()`
   - `wasmedge.NewWasiCryptoKxModule()`
   - `wasmedge.NewWasiCryptoSignaturesModule()`
   - `wasmedge.NewWasiCryptoSymmetricModule()`
   - `wasmedge.NewWasmEdgeProcessModule()`

   關於從外掛建立模組實例的新範例，請參閱[下方範例](#creating-the-module-instance-from-a-plug-in)。

3. `VM` 物件的新模組實例擷取 API。

   - 新增 `(*wasmedge.VM).GetRegisteredModule()`，可在 `VM` 物件中快速擷取已註冊的具名模組。
   - 新增 `(*wasmedge.VM).ListRegisteredModule()`，可在 `VM` 物件中快速列出已註冊的具名模組。

## VM 物件中不再需要為外掛設定 `wasmedge.HostRegistration` 常數值

在 `v0.11.2` 之前的版本中，當開發者想要在 VM 中載入外掛時，必須加入設定：

```go
// Assume that wasi_crypto plug-in is installed in the default plug-in path.
wasmedge.LoadPluginDefaultPaths()

conf := wasmedge.NewConfigure(wasmedge.WASI)
comf.AddConfig(wasmedge.WasiCrypto_Common)
comf.AddConfig(wasmedge.WasiCrypto_AsymmetricCommon)
comf.AddConfig(wasmedge.WasiCrypto_Kx)
comf.AddConfig(wasmedge.WasiCrypto_Signatures)
comf.AddConfig(wasmedge.WasiCrypto_Symmetric)
vm := wasmedge.NewVMWithConfig(conf)
conf.Release()

store := vm.GetStore()
modulelist := store.ListModule()
for _, name := range modulelist {
  fmt.Println(name)
}
// Will print:
//   wasi_ephemeral_crypto_asymmetric_common
//   wasi_ephemeral_crypto_common
//   wasi_ephemeral_crypto_kx
//   wasi_ephemeral_crypto_signatures
//   wasi_ephemeral_crypto_symmetric
vm.Release()
```

在 `v0.12.0` 之後，呼叫 `wasmedge.LoadPluginDefaultPaths()` 或將特定路徑傳入 `wasmedge.LoadPluginFromPath()` API 之後，外掛會自動載入。

對於未安裝的外掛，模擬的模組會被註冊到 `VM` 物件中，並在呼叫主機函式時印出錯誤訊息，以通知使用者安裝該外掛。

```go
wasmedge.LoadPluginDefaultPaths()
// The `wasmedge.WASI` is still needed.
conf := wasmedge.NewConfigure(wasmedge.WASI)
vm := wasmedge.NewVMWithConfig(conf)
conf.Release()

modulelist := vm.ListRegisteredModule()
for _, name := range modulelist {
  fmt.Println(name)
}
// Will print:
//   wasi_ephemeral_crypto_asymmetric_common
//   wasi_ephemeral_crypto_common
//   wasi_ephemeral_crypto_kx
//   wasi_ephemeral_crypto_signatures
//   wasi_ephemeral_crypto_symmetric
//   wasi_ephemeral_nn
//   wasi_snapshot_preview1
//   wasmedge_httpsreq
//   wasmedge_process
vm.Release()
```

<!-- prettier-ignore -->
:::note
如果開發者想使用 WASI，仍然需要 `wasmedge.WASI` 設定。
:::

## 從外掛建立模組實例

當開發者沒有使用 VM 物件來載入外掛時，可以使用 `v0.11.2` 之前版本的建立函式：

```go
// Assume that wasi_crypto plug-in is installed in the default plug-in path.
wasmedge.LoadPluginDefaultPaths()

cryptocommonmod := wasmedge.NewWasiCryptoCommonModule()

cryptocommonmod.Release()
```

但如果開發者必須為不同的外掛使用不同的 API，這既不合理也缺乏擴充性。

在 `v0.12.0` 版本之後，新增了 `wasmedge.Plugin` 結構，開發者可以使用通用的 API 來建立模組實例：

```go
// Assume that wasi_crypto plug-in is installed in the default plug-in path.
wasmedge.LoadPluginDefaultPaths()

cryptoplugin := wasmedge.FindPlugin("wasi_crypto")
if ctyptoplugin == nil {
  fmt.Println("FAIL: Cannot find the wasi_crypto plugin.")
  return
}

cryptocommonmod := cryptoplugin.CreateModule("wasi_crypto_common")

cryptocommonmod.Release()
```

## 從 VM 情境擷取模組實例

在 `v0.11.2` 之前的版本中，開發者可以使用 `wasmedge.HostRegistration` 常數值來擷取 `WASI` 或外掛中的模組，或從 `store` 物件擷取已註冊的模組。

```go
// Assume that wasi_crypto plug-in is installed in the default plug-in path.
wasmedge.LoadPluginDefaultPaths()
conf := wasmedge.NewConfigure(wasmedge.WASI)
comf.AddConfig(wasmedge.WasiCrypto_Common)
comf.AddConfig(wasmedge.WasiCrypto_AsymmetricCommon)
comf.AddConfig(wasmedge.WasiCrypto_Kx)
comf.AddConfig(wasmedge.WasiCrypto_Signatures)
comf.AddConfig(wasmedge.WasiCrypto_Symmetric)
vm := wasmedge.NewVMWithConfig(conf)
conf.Release()

// Get the WASI module instance.
wasimod := vm.GetImportModule(wasmedge.WASI)
// Get the WASI-crypto-common module instance.
cryptocommonmod := vm.GetImportModule(wasmedge.WasiCrypto_Common)

// Get the registered module instance by name.
store := vm.GetStore()
cryptokxmod := store.FindModule("wasi_ephemeral_crypto_kx")

vm.Release()
```

在 `v0.12.0` 版本之後，由於移除了與外掛相關的設定，且外掛會自動註冊到 VM 物件中，因此除了內建主機模組（目前是 `WASI`）之外，開發者無法再使用 `(*wasmedge.VM).GetImportModule()` API 來擷取模組實例。

不過，開發者可以使用新的 API 更快速地擷取已註冊的模組實例。

```go
// Assume that wasi_crypto plug-in is installed in the default plug-in path.
wasmedge.LoadPluginDefaultPaths()
// Add the WASI configurations.
conf := wasmedge.NewConfigure(wasmedge.WASI)
vm := wasmedge.NewVMWithConfig(conf)
conf.Release()

// Get the WASI module instance.
wasimod := vm.GetImportModule(wasmedge.WASI)
// Get the registered WASI-crypto-common module instance by name.
cryptocommonmod := vm.GetRegisteredModule("wasi_ephemeral_crypto_common")

vm.Release()
```
