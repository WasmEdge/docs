---
sidebar_position: 3
---

# Redis driver

WasmEdge provides a Redis driver for Rust developers, enabling developers to build database applications in Rust and then running in WasmEdge.

<!-- prettier-ignore -->
:::note
Before we start, [you need to have Rust and WasmEdge installed](../setup.md).
Make sure that you read the [special notes on networking apps](../setup#special-notes-for-networking-apps) especially if you are compiling Rust programs on a Mac.
:::

## Run the example

The [wasmedge-db-example/redis](https://github.com/WasmEdge/wasmedge-db-examples/tree/main/redis) is a Redis connector example written in Rust.

```bash
git clone https://github.com/WasmEdge/wasmedge-db-examples
cd wasmedge-db-examples/redis

# Compile the rust code into WASM
RUSTFLAGS="--cfg wasmedge --cfg tokio_unstable" cargo build --target wasm32-wasip1 --release

# Execute Redis command against a Redis instance at redis://localhost/
wasmedge --env "REDIS_URL=redis://localhost/" target/wasm32-wasip1/release/wasmedge-redis-client-examples.wasm
```

## Configuration

In order to compile the `redis` and `tokio` crates, we will need to apply patches to add WasmEdge-specific socket APIs to those crates in `Cargo.toml`.

```rust
[patch.crates-io]
tokio = { git = "https://github.com/second-state/wasi_tokio.git", branch = "v1.36.x" }

[dependencies]
anyhow = "1.0"
chrono = { version = "0.4", features = ["serde"] }
tokio = { version = "1", features = ["full"] }
redis = { version = "0.25.4", default-features = false, features = [
    "tokio-comp",
] }
```

## Code explanation

The following program uses the `redis` crate to access a Redis server through its connection URL.
It gets the current time, saves the timestamp object to the Redis server, and then reads it back for
display on the console.

```rust
#[tokio::main(flavor = "current_thread")]
async fn main() -> Result<()> {
    // connect to redis
    let client = redis::Client::open(&*get_url()).unwrap();
    let mut con = client.get_multiplexed_async_connection().await.unwrap();

    let time = format!("{}", chrono::Utc::now());
    // throw away the result, just make sure it does not fail
    let _: () = con.set("current_time", time).await.unwrap();

    // read back the key and return it.  Because the return value
    // from the function is a result for String, this will automatically
    // convert into one.
    let value: String = con.get("current_time").await.unwrap();
    println!("Successfully GET `time`: {}", value);

    Ok(())
}
```
