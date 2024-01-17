---
sidebar_position: 1
---

# MySQL driver

The database connection is necessary for today's enterprise development. WasmEdge provides a MySQL driver for Rust developers, enabling developers to build database applications in Rust and then running in WasmEdge.

<!-- prettier-ignore -->
:::note
Before we start, ensure [you have Rust and WasmEdge installed](../setup.md). If you are connecting to a remote MySQL database using TLS, you will need to [install the TLS plugin](../../../start/install.md#tls-plug-in) for WasmEdge as well.
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

To use TLS, you will need to turn on the `default-rustls` feature in `Cargo.toml`.

```
mysql_async_wasi = { version = "0.31", features = [ "default-rustls" ] }
```

Then, run the application as follows.

```
# Execute MySQL statements against an AWS RDS database that requires TLS
wasmedge --env "DATABASE_SSL=1" --env "DATABASE_URL=mysql://user:passwd@mydb.123456789012.us-east-1.rds.amazonaws.com:3306/mysql" crud.wasm
```

## Code explanation

<!-- prettier-ignore -->
:::info
Work in Progress
:::
