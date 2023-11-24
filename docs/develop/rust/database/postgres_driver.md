---
sidebar_position: 2
---

# PostgreSQL driver

A database connection is necessary for today's enterprise development. WasmEdge provides a PostgreSQL driver for Rust developers, enabling developers to build database applications in Rust and then running in WasmEdge.

<!-- prettier-ignore -->
:::note
Before we start, make sure [you have Rust and WasmEdge installed](../setup.md).
:::

## Run the example

The [wasmedge-db-example/postgres](https://github.com/WasmEdge/wasmedge-db-examples/tree/main/postgres) is a PostgreSQL connector example written in Rust.

```bash
git clone https://github.com/WasmEdge/wasmedge-db-examples
cd wasmedge-db-examples/postgres

# Compile the rust code into WASM
cargo build --target wasm32-wasi --release

# Execute SQL statements against a PostgreSQL database at postgres://user:passwd@localhost/testdb
wasmedge --env "DATABASE_URL=postgres://user:passwd@localhost/testdb" target/wasm32-wasi/release/crud.wasm
```

## Code explanation

<!-- prettier-ignore -->
:::info
Work in Progress
:::
