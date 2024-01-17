---
sidebar_position: 2
---

# Upgrade to WasmEdge-Go v0.13.0

Due to the WasmEdge-Go API breaking changes, this document shows the guideline of programming with WasmEdge-Go API to upgrade from the `v0.12.1` to the `v0.13.0` version.

## Concepts

1. Removed the `TensorFlow`, `TensorFlow-Lite`, and `Image` extension APIs.

   After `v0.13.0`, the WasmEdge extensions are replaced by the corresponding plug-ins. Please refer to our newest [example](https://github.com/second-state/WasmEdge-go-examples/tree/master/go_mtcnn).

2. Asynchronously invoking WASM function by executor.

   Developers can use the `(wasmedge.Executor).AsyncInvoke()` API to execute a WASM function asynchronously.

3. Fixed the `(wasmedge.Executor).Invoke()` API to remove the first `wasmedge.Store` parameter.

   It's easy to update. Just drop the first parameter.

4. Unified WasmEdge CLI.

   Developers can use the `wasmedge.RunWasmEdgeUnifiedCLI()` API to trigger the unified WasmEdge CLI.
