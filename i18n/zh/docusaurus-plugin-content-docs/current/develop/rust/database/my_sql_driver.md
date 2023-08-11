---
sidebar_position: 1
---

# MySQL driver

The database connection is necessary for today's enterprise development. WasmEdge provides a MySQL driver for Rust developers, enabling developers to build database applications in Rust and then running in WasmEdge.

<!-- prettier-ignore -->
:::note
Before we start, ensure [you have Rust and WasmEdge installed](../setup.md).
:::

## Run the example

The [wasmedge-db-example/mysql_async](https://github.com/WasmEdge/wasmedge-db-examples/tree/main/mysql_async) is a MySQL connector example written in Rust.

```bash
git clone https://github.com/WasmEdge/wasmedge-db-examples
cd wasmedge-db-examples/mysql_async

# Compile the rust code into WASM
cargo build --target wasm32-wasi --release

# Execute MySQL statements against a MySQL database at mysql://user:passwd@127.0.0.1:3306
wasmedge --env "DATABASE_URL=mysql://user:passwd@127.0.0.1:3306/mysql" target/wasm32-wasi/release/crud.wasm
```

## Code explanation

<!-- prettier-ignore -->
:::info
Work in Progress
:::
