---
sidebar_position: 7
---

# 4.6 MySQL-based Database Driver

Database connection is necessary for today's enterprise development. WasmEdge provides MySQL-based drivers for Rust developer, enabling developers to build database applications in Rust and then running in WasmEdge.

> Before we started, make sure [you have Rust and WasmEdge installed](setup).

## Run the example

The [wasmedge-db-example/mysql](https://github.com/WasmEdge/wasmedge-db-examples/tree/main/mysql) is a MySQL connector example, written in Rust.

```
// download the example
git clone https://github.com/WasmEdge/wasmedge-db-examples.git
cd mysql

// compile the rust code into Wasm bytecode
cargo build --target wasm32-wasi --release

// Executed the MySQL driver
wasmedge --env "DATABASE_URL=mysql://user:passwd@127.0.0.1:3306/mysql" target/wasm32-wasi/debug/query.wasm
wasmedge --env "DATABASE_URL=mysql://user:passwd@127.0.0.1:3306/mysql" target/wasm32-wasi/debug/insert.wasm
```

Then, you will see XYZ
