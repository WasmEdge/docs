---
sidebar_position: 2
---

# PostgreSQL driver

A database connection is necessary for today's enterprise development. WasmEdge provides a PostgreSQL driver for Rust developers, enabling developers to build database applications in Rust and then running in WasmEdge.

<!-- prettier-ignore -->
:::note
Before we start, [you need to have Rust and WasmEdge installed](../setup.md).
Make sure that you read the [special notes on networking apps](../setup#special-notes-for-networking-apps) especially if you are compiling Rust programs on a Mac.
:::

## Run the example

The [wasmedge-db-example/postgres](https://github.com/WasmEdge/wasmedge-db-examples/tree/main/postgres) is a PostgreSQL connector example written in Rust.

```bash
git clone https://github.com/WasmEdge/wasmedge-db-examples
cd wasmedge-db-examples/postgres

# Compile the rust code into WASM
RUSTFLAGS="--cfg wasmedge --cfg tokio_unstable" cargo build --target wasm32-wasi --release

# Execute SQL statements against a PostgreSQL database at postgres://user:passwd@localhost/testdb
wasmedge --env "DATABASE_URL=postgres://user:passwd@localhost/testdb" target/wasm32-wasi/release/crud.wasm
```

## Configuration

In order to compile the `tokio-postgres` and `tokio` crates, we will need to apply patches to add WasmEdge-specific socket APIs to those crates in `Cargo.toml`.

```
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

## Code explanation

We first use a Rust struct to represent the database table.

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

Then, you can use the `tokio-postgres` API to access the database through its connection URL.
The code below shows how to perform basic CRUD operations using SQL commands.

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

