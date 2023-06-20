---
sidebar_position: 3
---

# WasmEdge Plugin API Reference

WasmEdge Plug-ins are shared libraries that provide the WasmEdge runtime with the ability to load and create host module instances, allowing for easy extension of the WasmEdge runtime. The WasmEdge Plugin API Reference provides information on how to load, register, and import WasmEdge plugins.

## Loading a WasmEdge plugin

To use the plug-ins, developers need to load them from specific paths. The following API should be called:

```bash
WasmEdge_PluginLoadWithDefaultPaths();
```
This API loads the plug-ins from the default paths, which include:

- The path specified in the environment variable `WASMEDGE_PLUGIN_PATH`.
- The `../plugin/` directory relative to the WasmEdge installation path.
- The `./wasmedge/` directory under the library path if WasmEdge is installed in a system directory like `/usr` or `/usr/local`.

If developers want to load plug-ins from a specific path or under a specific directory, they can use the following API:

```bash
WasmEdge_PluginLoadFromPath("PATH_TO_PLUGIN/plugin.so");

```

## Getting Plug-ins by Name

Once the plug-ins are loaded, developers can list the loaded plug-in names and retrieve the plug-in context by its name using the following APIs:

```c
WasmEdge_PluginLoadWithDefaultPaths();
printf("Number of loaded plug-ins: %d\n", WasmEdge_PluginListPluginsLength());

WasmEdge_String Names[20];
uint32_t NumPlugins = WasmEdge_PluginListPlugins(Names, 20);
for (int I = 0; I < NumPlugins; I++) {
  printf("Plug-in %d name: %s\n", I, Names[I].Buf);
}

const char PluginName[] = "wasi_crypto";
WasmEdge_String NameString = WasmEdge_StringWrap(PluginName, strlen(PluginName));
const WasmEdge_PluginContext *PluginCxt = WasmEdge_PluginFind(NameString);
```

## Creating Module Instances from Plug-ins

With the plug-in context obtained, developers can create module instances by providing the module name. Here's an example:

```c
// Assuming `PluginCxt` is the context for the wasi_crypto plug-in.

// List the available host modules in the plug-in.
WasmEdge_String Names[20];
uint32_t ModuleLen = WasmEdge_PluginListModule(PluginCxt, Names, 20);
for (uint32_t I = 0; I < ModuleLen; I++) {
  // Print the available host module names in the plug-in.
  printf("%s\n", Names[I].Buf);
}

// Create a module instance from the plug-in using the module name.
const char ModuleName[] = "wasi_ephemeral_crypto_common";
WasmEdge_String NameString = WasmEdge_StringWrap(ModuleName, strlen(ModuleName));
WasmEdge_ModuleInstance *ModCxt = WasmEdge_PluginCreateModule(PluginCxt, NameString);

WasmEdge_ModuleInstanceDelete(ModCxt);
```

## Registering the plugin API

## Importing the plugin modules

## Sample application that uses a WasmEdge plugin

## WasmEdge Currently Released Plugins

## Overview of the WasmEdge Plug-ins

## WasmEdge-Process Plug-in

### WASI-Crypto Plug-in

### WASI-NN Plug-in with OpenVINO backend

### WASI-NN Plug-in with PyTorch backend

### WASI-NN Plug-in with TensorFlow-Lite backend

### WasmEdge-HttpsReq Plug-in
