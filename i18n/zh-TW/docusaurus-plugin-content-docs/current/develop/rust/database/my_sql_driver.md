---
sidebar_position: 1
---

# MySQL 驅動程式

對於現今企業開發而言，資料庫連線是不可或缺的。WasmEdge 為 Rust 開發者提供了 MySQL 驅動程式，使開發者能以 Rust 建立資料庫應用程式，並在 WasmEdge 中執行。

<!-- prettier-ignore -->
:::note
開始之前，[您需要先安裝 Rust 與 WasmEdge](../setup.md)。
請務必閱讀[網路應用程式的特別說明](../setup#special-notes-for-networking-apps)，尤其是當您在 Mac 上編譯 Rust 程式時。
:::

## 執行範例

[wasmedge-db-example/mysql_async](https://github.com/WasmEdge/wasmedge-db-examples/tree/main/mysql_async) 是以 Rust 撰寫的 MySQL 連接器範例。

```bash
git clone https://github.com/WasmEdge/wasmedge-db-examples
cd wasmedge-db-examples/mysql_async

# Compile the rust code into WASM
RUSTFLAGS="--cfg wasmedge --cfg tokio_unstable" cargo build --target wasm32-wasip1 --release

# Execute MySQL statements against a MySQL database at mysql://user:passwd@127.0.0.1:3306
wasmedge --env "DATABASE_URL=mysql://user:passwd@127.0.0.1:3306/mysql" target/wasm32-wasip1/release/crud.wasm
```

<!-- prettier-ignore -->
:::note
由於本範例已預設啟用 TLS，因此若您要在 MacOS 上編譯，會需要 [wasi-sdk 版本的 clang](../setup#tls-on-macos)。
:::

若要使用 TLS，您必須在 `Cargo.toml` 中開啟 `mysql_async` crate 的 `default-rustls` 特性。
然後依下列方式執行應用程式。

```toml
# Execute MySQL statements against an AWS RDS database that requires TLS
wasmedge --env "DATABASE_SSL=1" --env "DATABASE_URL=mysql://user:passwd@mydb.123456789012.us-east-1.rds.amazonaws.com:3306/mysql" crud.wasm
```

## 設定

為了能夠編譯 `mysql_async` 與 `tokio` 等 crate，我們需要套用兩個 patch，將 WasmEdge 專屬的 socket API 加入這些 crate。下方範例展示了已啟用 TLS 連線的設定。

```toml
[patch.crates-io]
tokio = { git = "https://github.com/second-state/wasi_tokio.git", branch = "v1.36.x" }
socket2 = { git = "https://github.com/second-state/socket2.git", branch = "v0.5.x" }

[dependencies]
mysql_async = { version = "0.34", default-features=false, features = [ "default-rustls" ], git="https://github.com/blackbeam/mysql_async.git" }
zstd-sys = "=2.0.9"
tokio = { version = "1", features = [ "io-util", "fs", "net", "time", "rt", "macros"] }
```

## 程式碼範例

下列程式碼展示了如何連接到 MySQL 資料庫伺服器，並使用 SQL 敘述新增、更新與刪除紀錄。

連接到 MySQL 資料庫。

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

在已連線的資料庫上建立資料表。

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

使用 SQL 將一些紀錄寫入 MySQL 資料庫。

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

查詢資料庫。

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

從資料庫刪除一些紀錄。

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

更新 MySQL 資料庫中的紀錄。

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

關閉資料庫連線。

```rust
    drop(conn);
    pool.disconnect().await.unwrap();
```
