---
sidebar_position: 2
---

# Upgrade to WasmEdge 0.13.0

Due to the WasmEdge C API breaking changes, this document shows the guideline for programming with WasmEdge C API to upgrade from the `0.12.1` to the `0.13.0` version.

In this version, there are only new features. Developers can build their original source with this WasmEdge version directly.

## Concepts

1. Introduced new API for setting data and its finalizer into module instances when creation.

   Developers can use the `WasmEdge_ModuleInstanceCreateWithData()` API to set the host data and its finalizer into the module instance.

2. Asynchronously invoking WASM function by executor.

   Developers can use the `WasmEdge_ExecutorAsyncInvoke()` API to execute a WASM function asynchronously.

3. Unified WasmEdge CLI.

   Developers can use the `WasmEdge_Driver_UniTool()` API to trigger the unified WasmEdge CLI.

## Set data and its finalizer into a module instance when creation

Besides setting host data into a host function, developers can set and move ownership of host data into a `Module` instance context with its finalizer. This may be useful when implementing the plug-ins.

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

## Unified WasmEdge CLI

The `WasmEdge_Driver_UniTool()` API presents the same function as running the [`wasmedge` tool](../../../start/build-and-run/cli.md).

```c
#include <wasmedge/wasmedge.h>
#include <stdio.h>
int main(int argc, const char *argv[]) {
  /* Run the WasmEdge unified tool. */
  /* (Within both runtime and AOT compiler) */
  return WasmEdge_Driver_UniTool(argc, argv);
}
```
