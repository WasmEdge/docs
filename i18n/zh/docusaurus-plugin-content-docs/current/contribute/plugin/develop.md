---
sidebar_position: 2
---

# 3.2 Develop WasmEdge Plug-in

WasmEdge provides a C++ based API for registering extension modules and host functions. While the WasmEdge language SDKs allow registering host functions from a host (wrapping) application, the plugin API allows such extensions to be incorporated into WasmEdge's own building and releasing process.

The C API for the plug-in mechanism is under development.
In the future, we will release the C API of plug-in mechanism and recommend developers to implement the plug-ins with C API.

## Loadable Plug-in

Loadable plugin is a standalone `.so`/`.dylib`/`.dll` file that WasmEdge can load during runtime environment, and provide modules to be imported.

Please [refer to the plugin example code](https://github.com/WasmEdge/WasmEdge/tree/master/examples/plugin/get-string).
