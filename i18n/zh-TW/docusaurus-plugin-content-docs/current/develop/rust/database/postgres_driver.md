---
sidebar_position: 2
---

# PostgreSQL 驅動程式

對於現今企業開發而言，資料庫連線是不可或缺的。WasmEdge 為 Rust 開發者提供了 PostgreSQL 驅動程式，使開發者能以 Rust 建立資料庫應用程式，並在 WasmEdge 中執行。

<!-- prettier-ignore -->
:::note
開始之前，[您需要先安裝 Rust 與 WasmEdge](../setup.md)。
請務必閱讀[網路應用程式的特別說明](../setup#special-notes-for-networking-apps)，尤其是當您在 Mac 上編譯 Rust 程式時。
:::

## 執行範例

[wasmedge-db-example/postgres](https://github.com/WasmEdge/wasmedge-db-examples/tree/main/postgres) 是以 Rust 撰寫的 PostgreSQL 連接器範例。

```bash
git clone https://github.com/WasmEdge/wasmedge-db-examples
cd wasmedge-db-examples/postgres

# Compile the rust code into WASM
RUSTFLAGS="--cfg wasmedge --cfg tokio_unstable" cargo build --target wasm32-wasip1 --release

# Execute SQL statements against a PostgreSQL database at postgres://user:passwd@localhost/testdb
wasmedge --env "DATABASE_URL=postgres://user:passwd@localhost/testdb" target/wasm32-wasip1/release/crud.wasm
```

## 設定

為了能夠編譯 `tokio-postgres` 與 `tokio` 等 crate，我們需要在 `Cargo.toml` 中套用 patch，將 WasmEdge 專屬的 socket API 加入這些 crate。

```toml
[patch.crates-io]
tokio = { git = "https://github.com/second-state/wasi_tokio.git", branch = "v1.36.x" }
socket2 = { git = "https://github.com/second-state/socket2.git", branch = "v0.5.x" }
tokio-postgres = { git = "https://github.com/second-state/rust-postgres.git" }

[dependencies]
tokio-postgres = "0.7"
tokio = { version = "1", features = [
    "io-util",
    "fs",
    "net",
    "time",
    "rt",
    "macros",
] }
```

## 程式碼說明

我們先使用一個 Rust struct 來代表資料庫資料表。

```rust
#[derive(Debug)]
struct Order {
    order_id: i32,
    production_id: i32,
    quantity: i32,
    amount: f32,
    shipping: f32,
    tax: f32,
    shipping_address: String,
}

impl Order {
    fn new(
        order_id: i32,
        production_id: i32,
        quantity: i32,
        amount: f32,
        shipping: f32,
        tax: f32,
        shipping_address: String,
    ) -> Self {
        Self {
            order_id,
            production_id,
            quantity,
            amount,
            shipping,
            tax,
            shipping_address,
        }
    }
}
```

然後，您可以使用 `tokio-postgres` API 透過其連線 URL 存取資料庫。
下方程式碼示範如何使用 SQL 命令執行基本的 CRUD 操作。

```rust
#[tokio::main(flavor = "current_thread")]
async fn main() -> Result<(), Error> {
    // Connect to the database.
    let (client, connection) = tokio_postgres::connect(&*get_url(), NoTls).await?;

    // The connection object performs the actual communication with the database,
    // so spawn it off to run on its own.
    tokio::spawn(async move {
        if let Err(e) = connection.await {
            eprintln!("connection error: {}", e);
        }
    });

    client.execute("CREATE TABLE IF NOT EXISTS orders (order_id INT, production_id INT, quantity INT, amount REAL, shipping REAL, tax REAL, shipping_address VARCHAR(256));", &[]).await?;

    let orders = vec![
        Order::new(1, 12, 2, 56.0, 15.0, 2.0, String::from("Mataderos 2312")),
        Order::new(2, 15, 3, 256.0, 30.0, 16.0, String::from("1234 NW Bobcat")),
        Order::new(3, 11, 5, 536.0, 50.0, 24.0, String::from("20 Havelock")),
        Order::new(4, 8, 8, 126.0, 20.0, 12.0, String::from("224 Pandan Loop")),
        Order::new(5, 24, 1, 46.0, 10.0, 2.0, String::from("No.10 Jalan Besar")),
    ];

    for order in orders.iter() {
        client.execute(
            "INSERT INTO orders (order_id, production_id, quantity, amount, shipping, tax, shipping_address) VALUES ($1, $2, $3, $4, $5, $6, $7)",
            &[&order.order_id, &order.production_id, &order.quantity, &order.amount, &order.shipping, &order.tax, &order.shipping_address]
        ).await?;
    }

    let rows = client.query("SELECT * FROM orders;", &[]).await?;
    for row in rows.iter() {
        let order_id : i32 = row.get(0);
        println!("order_id {}", order_id);

        let production_id : i32 = row.get(1);
        println!("production_id {}", production_id);

        let quantity : i32 = row.get(2);
        println!("quantity {}", quantity);

        let amount : f32 = row.get(3);
        println!("amount {}", amount);

        let shipping : f32 = row.get(4);
        println!("shipping {}", shipping);

        let tax : f32 = row.get(5);
        println!("tax {}", tax);

        let shipping_address : &str = row.get(6);
        println!("shipping_address {}", shipping_address);
    }

    client.execute("DELETE FROM orders;", &[]).await?;

    Ok(())
}
```
