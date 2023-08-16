---
sidebar_position: 3
---

## Using Plug-ins to Extend the Runtime in C

The WasmEdge plug-ins are the shared libraries to provide the WasmEdge runtime to load and create host module instances. With the plug-ins, the WasmEdge runtime can be extended more easily.

## Loading Plug-ins from Paths

Developers can start using WasmEdge plug-ins by loading them from specific paths. To load plug-ins from the default paths, the following API can be used:

```go
wasmedge.LoadPluginDefaultPaths()
```

Once this API is called, plug-ins from the default paths will be loaded. The default paths include:

- The path specified in the `WASMEDGE_PLUGIN_PATH` environment variable.
- The `../plugin/` directory relative to the WasmEdge installation path.
- The `./wasmedge/` directory under the library path if WasmEdge is installed in a system directory (e.g., `/usr` and `/usr/local`).

Developers can also load plug-ins from specific paths using this API:

```go
wasmedge.LoadPluginFromPath("PATH_TO_PLUGIN/plugin.so")
```

## Listing Loaded Plug-ins

Once plug-ins are loaded, developers can list the loaded plug-in names using the following approach:

```go
wasmedge.LoadPluginDefaultPaths()
pluginnames := wasmedge.ListPlugins()
for _, name := range pluginnames {
  fmt.Println("Loaded plug-in name: ", name)
}
```

## Getting Plug-in Context by Name

Developers can obtain the plug-in context by its name using the following method:

```go
// Assume that wasi_crypto plug-in is installed in the default plug-in path.
wasmedge.LoadPluginDefaultPaths()
plugincrypto := wasmedge.FindPlugin("wasi_crypto")
```

## Creating Module Instances from Plug-ins

With the plug-in context, developers can create module instances by providing the module name:

```go
// Assume that the `plugincrypto` is the object to the wasi_crypto plug-in.

// List the available host modules in the plug-in.
modules := plugincrypto.ListModule()
for _, name := range modules {
  fmt.Println("Available module: ", name)
}
// Will print here for the WASI-Crypto plug-in here:
//   wasi_ephemeral_crypto_asymmetric_common
//   wasi_ephemeral_crypto_common
//   wasi_ephemeral_crypto_kx
//   wasi_ephemeral_crypto_signatures
//   wasi_ephemeral_crypto_symmetric

// Create a module instance from the plug-in by the module name.
modinst := plugincrypto.CreateModule("wasi_ephemeral_crypto_common")

modinst.Release()
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
- `wasi:logging/logging` (for the `WASI-Logging`)

## Handling Missing Plug-ins and Error Messages

When the WASM want to invoke these host functions but the corresponding plug-in not installed, WasmEdge will print the error message and return an error.

```go
// Load the plug-ins in the default paths first.
wasmedge.LoadPluginDefaultPaths()

// Create the VM object with the WASI configuration.
conf := wasmedge.NewConfigure(wasmedge.WASI)
vm := wasmedge.NewVMWithConfig(conf)
conf.Release()

// The following API can retrieve the registered modules in the VM objects, includes the built-in WASI and the plug-ins.
// This API will return `NULL` if the module instance not found.

// The `wasimodule` will not be `nil` because the configuration was set.
wasimodule := vm.GetRegisteredModule("wasi_snapshot_preview1")

// The `wasinnmodule` will not be `nil` even if the wasi_nn plug-in is not installed, because the VM context will mock and register the host modules.
wasinnmodule := vm.GetRegisteredModule("wasi_ephemeral_nn")

vm.Release()
```
