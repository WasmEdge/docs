---
sidebar_position: 3
---

# Redis 驅動程式

WasmEdge 為 Rust 開發者提供了 Redis 驅動程式，使開發者能以 Rust 建立資料庫應用程式，並在 WasmEdge 中執行。

<!-- prettier-ignore -->
:::note
開始之前，[您需要先安裝 Rust 與 WasmEdge](../setup.md)。
請務必閱讀[網路應用程式的特別說明](../setup#special-notes-for-networking-apps)，尤其是當您在 Mac 上編譯 Rust 程式時。
:::

## 執行範例

[wasmedge-db-example/redis](https://github.com/WasmEdge/wasmedge-db-examples/tree/main/redis) 是以 Rust 撰寫的 Redis 連接器範例。

```bash
git clone https://github.com/WasmEdge/wasmedge-db-examples
cd wasmedge-db-examples/redis

# Compile the rust code into WASM
RUSTFLAGS="--cfg wasmedge --cfg tokio_unstable" cargo build --target wasm32-wasip1 --release

# Execute Redis command against a Redis instance at redis://localhost/
wasmedge --env "REDIS_URL=redis://localhost/" target/wasm32-wasip1/release/wasmedge-redis-client-examples.wasm
```

## 設定

為了能夠編譯 `redis` 與 `tokio` 等 crate，我們需要在 `Cargo.toml` 中套用 patch，將 WasmEdge 專屬的 socket API 加入這些 crate。

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

## 程式碼說明

下列程式使用 `redis` crate，透過其連線 URL 存取 Redis 伺服器。
它會取得目前時間，將該時間戳記物件存到 Redis 伺服器，再讀回並
顯示於主控台。

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
