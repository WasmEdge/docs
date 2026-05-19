---
sidebar_position: 6
---

# Piper 後端

我們將以[這個範例專案](https://github.com/second-state/WasmEdge-WASINN-examples/tree/master/wasmedge-piper)示範如何在 WasmEdge 與 Rust 中使用 Piper 模型進行 AI 推論。

## 必要條件

除了[一般的 WasmEdge 與 Rust 需求](../../rust/setup.md)之外，請確認您已[安裝具有 Piper 的 WASI-NN 外掛](../../../start/install.md#wasi-nn-plug-in-with-piper-backend)。

## 快速開始

由於此範例已內含由 Rust 程式編譯而成的 WASM 檔案，因此我們可以直接使用 WasmEdge CLI 來執行它。首先，git clone `WasmEdge-WASINN-examples` 儲存庫。

```bash
git clone https://github.com/second-state/WasmEdge-WASINN-examples.git
cd WasmEdge-WASINN-examples/wasmedge-piper/
```

請依照 `README.md` 的指示執行此範例。
