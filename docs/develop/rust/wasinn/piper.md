---
sidebar_position: 6
---

# Piper Backend

We will use [this example project](https://github.com/second-state/WasmEdge-WASINN-examples/tree/master/wasmedge-piper) to show how to make AI inference with a Piper model in WasmEdge and Rust.

## Prerequisite

Besides the [regular WasmEdge and Rust requirements](../../rust/setup.md), please make sure that you have the [WASI-NN plugin with Piper installed](../../../start/install.md#wasi-nn-plug-in-with-piper-backend).

## Quick start

Because the example already includes a compiled WASM file from the Rust code, we could use WasmEdge CLI to execute the example directly. First, git clone the `WasmEdge-WASINN-examples` repo.

```bash
git clone https://github.com/second-state/WasmEdge-WASINN-examples.git
cd WasmEdge-WASINN-examples/wasmedge-piper/
```

Please follow the `README.md` to run the example.
