---
sidebar_position: 1
---

## Using Plug-ins to Extend the Runtime in C

The WasmEdge plug-ins are the shared libraries to provide the WasmEdge runtime to load and create host module instances. With the plug-ins, the WasmEdge runtime can be extended more easily.

## Loading Plug-ins from Paths

Developers can start using WasmEdge plug-ins by loading them from specific paths. To load plug-ins from the default paths, the following API can be used:

```c
WasmEdge_PluginLoadWithDefaultPaths();
```

Once this API is called, plug-ins from the default paths will be loaded. The default paths include:

- The path specified in the `WASMEDGE_PLUGIN_PATH` environment variable.
- The `../plugin/` directory relative to the WasmEdge installation path.
- The `./wasmedge/` directory under the library path if WasmEdge is installed in a system directory (e.g., `/usr` and `/usr/local`).
  
Developers can also load plug-ins from specific paths using this API:

```c
WasmEdge_PluginLoadFromPath("PATH_TO_PLUGIN/plugin.so");
```

## Listing Loaded Plug-ins

Once plug-ins are loaded, developers can list the loaded plug-in names using the following approach:

```c
WasmEdge_PluginLoadWithDefaultPaths();
printf("Number of loaded plug-ins: %d\n", WasmEdge_PluginListPluginsLength());

WasmEdge_String Names[20];
uint32_t NumPlugins = WasmEdge_PluginListPlugins(Names, 20);
for (int I = 0; I < NumPlugins; I++) {
  printf("Plug-in %d name: %s\n", I, Names[I].Buf);
}
```

## Retrieving Plug-in Context by Name

Developers can obtain the plug-in context by its name using the following method:

```c
/* Assume that wasi_crypto plug-in is installed in the default plug-in path. */
WasmEdge_PluginLoadWithDefaultPaths();

const char PluginName[] = "wasi_crypto";
WasmEdge_String NameString =
    WasmEdge_StringWrap(PluginName, strlen(PluginName));
const WasmEdge_PluginContext *PluginCxt = WasmEdge_PluginFind(NameString);
```

## Creating Module Instances from Plug-ins

With the plug-in context, developers can create module instances by providing the module name:

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

There may be several plug-ins in the default plug-in paths if users [installed WasmEdge plug-ins by the installer](/contribute/installer.md#plugins).

Before using the plug-ins, developers should [Loading Plug-ins from Paths](#loading-plug-ins-from-paths).

## Automatic Module Creation and Mocking

Upon creating a `VM` context, the WasmEdge runtime will automatically create and register the modules of loaded plug-ins. In cases where specific plug-ins are not loaded, WasmEdge will provide mock implementations for certain host modules. These mocked modules include:

 - `wasi_ephemeral_crypto_asymmetric_common` (for the `WASI-Crypto`)
 - `wasi_ephemeral_crypto_common` (for the `WASI-Crypto`)
 - `wasi_ephemeral_crypto_kx` (for the `WASI-Crypto`)
 - `wasi_ephemeral_crypto_signatures` (for the `WASI-Crypto`)
 - `wasi_ephemeral_crypto_symmetric` (for the `WASI-Crypto`)
 - `wasi_ephemeral_nn`
 - `wasi_snapshot_preview1`
 - `wasmedge_httpsreq`
 - `wasmedge_process`

## Handling Missing Plug-ins and Error Messages

When the WASM want to invoke these host functions but the corresponding plug-in not installed, WasmEdge will print the error message and return an error.

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
