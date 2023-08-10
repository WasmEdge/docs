---
sidebar_position: 3
---

# Redis driver

WasmEdge provides a Redis driver for Rust developers, enabling developers to build database applications in Rust and then running in WasmEdge.

<!-- prettier-ignore -->
:::note
Before we start, ensure [you have Rust and WasmEdge installed](../setup.md).
:::

## Run the example

The [wasmedge-db-example/redis](https://github.com/WasmEdge/wasmedge-db-examples/tree/main/redis) is a Redis connector example written in Rust.

```bash
git clone https://github.com/WasmEdge/wasmedge-db-examples
cd wasmedge-db-examples/redis

# Compile the rust code into WASM
cargo build --target wasm32-wasi --release

# Execute Redis command against a Redis instance at redis://localhost/
wasmedge --env "REDIS_URL=redis://localhost/" target/wasm32-wasi/release/wasmedge-redis-client-examples.wasm
```

## Code explanation

<!-- prettier-ignore -->
:::info
Work in Progress
:::
