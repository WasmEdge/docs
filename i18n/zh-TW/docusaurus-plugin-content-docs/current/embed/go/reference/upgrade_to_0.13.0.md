---
sidebar_position: 4
---

# 升級至 WasmEdge-Go v0.13.0

由於 WasmEdge-Go API 有破壞性變更，本文件說明使用 WasmEdge-Go API 從 `v0.12.1` 升級到 `v0.13.0` 版本的程式設計指引。

## 概念

1. 移除了 `TensorFlow`、`TensorFlow-Lite` 與 `Image` 擴充功能 API。

   在 `v0.13.0` 之後，WasmEdge 的擴充功能由對應的外掛取代。請參閱我們最新的[範例](https://github.com/second-state/WasmEdge-go-examples/tree/master/go_mtcnn)。

2. 由執行器以非同步方式呼叫 WASM 函式。

   開發者可以使用 `(wasmedge.Executor).AsyncInvoke()` API 來非同步執行 WASM 函式。

3. 修正了 `(wasmedge.Executor).Invoke()` API，移除了第一個 `wasmedge.Store` 參數。

   更新方式非常簡單，只要捨棄第一個參數即可。

4. 統一的 WasmEdge CLI。

   開發者可以使用 `wasmedge.RunWasmEdgeUnifiedCLI()` API 來觸發統一的 WasmEdge CLI。
