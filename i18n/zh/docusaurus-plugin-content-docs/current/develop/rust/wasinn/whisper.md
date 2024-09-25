---
sidebar_position: 7
---

# Whisper Backend

We will use [this example project](https://github.com/second-state/WasmEdge-WASINN-examples/tree/master/whisper-basic) to show how to make AI inference with a Whisper model in WasmEdge and Rust.

## Prerequisite

Besides the [regular WasmEdge and Rust requirements](../../rust/setup.md), please make sure that you have the [WASI-NN plugin with Whisper installed](../../../start/install.md#install-wasmedge-with-plug-ins).

## Quick start

Because the example already includes a compiled WASM file from the Rust code, we could use WasmEdge CLI to execute the example directly. First, git clone the `WasmEdge-WASINN-examples` repo.

```bash
git clone https://github.com/second-state/WasmEdge-WASINN-examples.git
cd WasmEdge-WASINN-examples/whisper-basic/
```

Please follow the `README.md` to run the example.
