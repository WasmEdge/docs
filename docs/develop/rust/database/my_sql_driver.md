---
sidebar_position: 1
---

# MySQL driver

The database connection is necessary for today's enterprise development. WasmEdge provides a MySQL driver for Rust developers, enabling developers to build database applications in Rust and then running in WasmEdge.

<!-- prettier-ignore -->
:::note
Before we start, [you need to have Rust and WasmEdge installed](../setup.md).
Make sure that you read the [special notes on networking apps](../setup#special-notes-for-networking-apps) especially if you are compiling Rust programs on a Mac.
:::

## Run the example

The [wasmedge-db-example/mysql_async](https://github.com/WasmEdge/wasmedge-db-examples/tree/main/mysql_async) is a MySQL connector example written in Rust.

```bash
git clone https://github.com/WasmEdge/wasmedge-db-examples
cd wasmedge-db-examples/mysql_async

# Compile the rust code into WASM
RUSTFLAGS="--cfg wasmedge --cfg tokio_unstable" cargo build --target wasm32-wasi --release

# Execute MySQL statements against a MySQL database at mysql://user:passwd@127.0.0.1:3306
wasmedge --env "DATABASE_URL=mysql://user:passwd@127.0.0.1:3306/mysql" target/wasm32-wasi/release/crud.wasm
```

<!-- prettier-ignore -->
:::note
Since we have TLS enabled by default in this example, you will need the [wasi-sdk version of clang](../setup#tls-on-macos) for compiling it on MacOS.
:::

To use TLS, you will need to turn on the `default-rustls` feature on the `mysql_async` crate in `Cargo.toml`.
Then, run the application as follows.

```toml
# Execute MySQL statements against an AWS RDS database that requires TLS
wasmedge --env "DATABASE_SSL=1" --env "DATABASE_URL=mysql://user:passwd@mydb.123456789012.us-east-1.rds.amazonaws.com:3306/mysql" crud.wasm
```

## Configuration

In order to compile the `mysql_async` and `tokio` crates, we will need to apply two patches to add
WasmEdge-specific socket APIs to those crates. The following example shows that the TLS connection is enabled.

```toml
[patch.crates-io]
tokio = { git = "https://github.com/second-state/wasi_tokio.git", branch = "v1.36.x" }
socket2 = { git = "https://github.com/second-state/socket2.git", branch = "v0.5.x" }

[dependencies]
mysql_async = { version = "0.34", default-features=false, features = [ "default-rustls" ], git="https://github.com/blackbeam/mysql_async.git" }
zstd-sys = "=2.0.9"
tokio = { version = "1", features = [ "io-util", "fs", "net", "time", "rt", "macros"] }
```

## Code example

The following code shows how to connect to a MySQL database server, and then insert, update, and delete records using SQL
statements.

Connect to a MySQL database.

```rust
    // Below we create a customized connection pool
    let opts = Opts::from_url(&*get_url()).unwrap();
    let mut builder = OptsBuilder::from_opts(opts);
    if std::env::var("DATABASE_SSL").is_ok() {
        builder = builder.ssl_opts(SslOpts::default());
    }
    // The connection pool will have a min of 5 and max of 10 connections.
    let constraints = PoolConstraints::new(5, 10).unwrap();
    let pool_opts = PoolOpts::default().with_constraints(constraints);

    let pool = Pool::new(builder.pool_opts(pool_opts));
    let mut conn = pool.get_conn().await.unwrap();
```

Create a table on the connected database.

```rust
    // create table if no tables exist
    let result = r"SHOW TABLES LIKE 'orders';"
        .with(())
        .map(&mut conn, |s: String| String::from(s))
        .await?;

    if result.len() == 0 {
        // table doesn't exist, create a new one
        r"CREATE TABLE orders (order_id INT, production_id INT, quantity INT, amount FLOAT, shipping FLOAT, tax FLOAT, shipping_address VARCHAR(20));".ignore(&mut conn).await?;
        println!("create new table");
    } else {
        // delete all data from the table.
        println!("delete all from orders");
        r"DELETE FROM orders;".ignore(&mut conn).await?;
    }
```

Insert some records into the MySQL database using SQL.

```rust
    let orders = vec![
        Order::new(1, 12, 2, 56.0, 15.0, 2.0, String::from("Mataderos 2312")),
        Order::new(2, 15, 3, 256.0, 30.0, 16.0, String::from("1234 NW Bobcat")),
        Order::new(3, 11, 5, 536.0, 50.0, 24.0, String::from("20 Havelock")),
        Order::new(4, 8, 8, 126.0, 20.0, 12.0, String::from("224 Pandan Loop")),
        Order::new(5, 24, 1, 46.0, 10.0, 2.0, String::from("No.10 Jalan Besar")),
    ];

    r"INSERT INTO orders (order_id, production_id, quantity, amount, shipping, tax, shipping_address)
      VALUES (:order_id, :production_id, :quantity, :amount, :shipping, :tax, :shipping_address)"
        .with(orders.iter().map(|order| {
            params! {
                "order_id" => order.order_id,
                "production_id" => order.production_id,
                "quantity" => order.quantity,
                "amount" => order.amount,
                "shipping" => order.shipping,
                "tax" => order.tax,
                "shipping_address" => &order.shipping_address,
            }
        }))
        .batch(&mut conn)
        .await?;
```

Query the database.

```rust
    // query data
    let loaded_orders = "SELECT * FROM orders"
        .with(())
        .map(
            &mut conn,
            |(order_id, production_id, quantity, amount, shipping, tax, shipping_address)| {
                Order::new(
                    order_id,
                    production_id,
                    quantity,
                    amount,
                    shipping,
                    tax,
                    shipping_address,
                )
            },
        )
        .await?;
    dbg!(loaded_orders.len());
    dbg!(loaded_orders);
```

Delete some records from the database.

```rust
    // delete some data
    r"DELETE FROM orders WHERE order_id=4;"
        .ignore(&mut conn)
        .await?;

    // query data
    let loaded_orders = "SELECT * FROM orders"
        .with(())
        .map(
            &mut conn,
            |(order_id, production_id, quantity, amount, shipping, tax, shipping_address)| {
                Order::new(
                    order_id,
                    production_id,
                    quantity,
                    amount,
                    shipping,
                    tax,
                    shipping_address,
                )
            },
        )
        .await?;
    dbg!(loaded_orders.len());
    dbg!(loaded_orders);
```

Update records in the MySQL database.

```rust
    // update some data
    r"UPDATE orders
    SET shipping_address = '8366 Elizabeth St.'
    WHERE order_id = 2;"
        .ignore(&mut conn)
        .await?;
    // query data
    let loaded_orders = "SELECT * FROM orders"
        .with(())
        .map(
            &mut conn,
            |(order_id, production_id, quantity, amount, shipping, tax, shipping_address)| {
                Order::new(
                    order_id,
                    production_id,
                    quantity,
                    amount,
                    shipping,
                    tax,
                    shipping_address,
                )
            },
        )
        .await?;
    dbg!(loaded_orders.len());
    dbg!(loaded_orders);
```

Close the database connection.

```rust
    drop(conn);
    pool.disconnect().await.unwrap();
```
