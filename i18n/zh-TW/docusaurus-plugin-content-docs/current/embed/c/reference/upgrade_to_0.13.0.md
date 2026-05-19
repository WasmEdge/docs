---
sidebar_position: 10
---

# 升級至 WasmEdge 0.13.0

由於 WasmEdge C API 有破壞性變更，本文件說明使用 WasmEdge C API 從 `0.12.1` 升級到 `0.13.0` 版本的程式設計指引。

此版本僅包含新功能，開發者可以直接使用此 WasmEdge 版本建置原本的原始碼。

## 概念

1. 引入了在建立模組實例時，用以設定資料與其終結器的全新 API。

   開發者可以使用 `WasmEdge_ModuleInstanceCreateWithData()` API，將主機資料及其終結器設定到模組實例中。

2. 由執行器以非同步方式呼叫 WASM 函式。

   開發者可以使用 `WasmEdge_ExecutorAsyncInvoke()` API 來非同步執行 WASM 函式。

3. 統一的 WasmEdge CLI。

   開發者可以使用 `WasmEdge_Driver_UniTool()` API 來觸發統一的 WasmEdge CLI。

## 在建立模組實例時設定資料與其終結器

除了將主機資料設定到主機函式之外，開發者還可以將主機資料的所有權，連同其終結器一起設定並轉移到 `Module` 實例情境中。這對於實作外掛時相當實用。

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

## 統一的 WasmEdge CLI

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
