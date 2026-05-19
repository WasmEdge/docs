---
sidebar_position: 4
---

# Qdrant 驅動程式

WasmEdge 正逐漸成為大型語言模型（LLM）的輕量、可攜帶且可嵌入的執行環境。LLM 推論應用（例如 RAG 聊天機器人與 AI agent）可以在 Mac 或 Windows 上開發、一次編譯為 Wasm，然後部署到 Nvidia / AMD / ARM 設備或伺服器上，並充分運用裝置上的 GPU、NPU 及加速器。

因此，除了 LLM 推論執行環境之外，這類 LLM 應用程式也需要在向量資料庫中管理嵌入向量。[qdrant-rest-client](https://crates.io/crates/qdrant_rest_client) crate 讓您可以從可攜的 Wasm 應用程式中存取 Qdrant 向量資料庫！

<!-- prettier-ignore -->
:::note
開始之前，[您需要先安裝 Rust 與 WasmEdge](../setup.md)。
請務必閱讀[網路應用程式的特別說明](../setup#special-notes-for-networking-apps)，尤其是當您在 Mac 上編譯 Rust 程式時。
:::

## 執行範例

[wasmedge-db-example/qdrant](https://github.com/WasmEdge/wasmedge-db-examples/tree/main/qdrant) 是以 Rust 撰寫的 Qdrant 用戶端範例。

```bash
git clone https://github.com/WasmEdge/wasmedge-db-examples
cd wasmedge-db-examples/qdrant

# Compile the rust code into WASM
RUSTFLAGS="--cfg wasmedge --cfg tokio_unstable" cargo build --target wasm32-wasip1 --release

# Perform vector data operations against a Qdrant at http://localhost:6333
wasmedge target/wasm32-wasip1/release/qdrant_examples.wasm
```

## 設定

為了能夠編譯 `qdrant_rest_client` 與 `tokio` 等 crate，我們需要在 `Cargo.toml` 中套用 patch，將 WasmEdge 專屬的 socket API 加入這些 crate。

```rust
[patch.crates-io]
socket2 = { git = "https://github.com/second-state/socket2.git", branch = "v0.5.x" }
reqwest = { git = "https://github.com/second-state/wasi_reqwest.git", branch = "0.11.x" }
hyper = { git = "https://github.com/second-state/wasi_hyper.git", branch = "v0.14.x" }
tokio = { git = "https://github.com/second-state/wasi_tokio.git", branch = "v1.36.x" }

[dependencies]
anyhow = "1.0"
serde_json = "1.0"
serde = { version = "1.0", features = ["derive"] }
url = "2.3"
tokio = { version = "1", features = ["io-util", "fs", "net", "time", "rt", "macros"] }
qdrant_rest_client = "0.1.0"
```

## 程式碼說明

下列程式使用 `qdrant_rest_client` crate，透過 RESTful API 存取本機的 Qdrant 伺服器。
它會先建立數個點（向量），將這些向量存到 Qdrant 資料庫，接著取得部分向量、
搜尋向量，最後再從資料庫將它們刪除。

```rust
#[tokio::main(flavor = "current_thread")]
async fn main() -> Result<(), Box<dyn std::error::Error + Send + Sync>> {
    let client = qdrant::Qdrant::new();
    // Create a collection with 10-dimensional vectors
    let r = client.create_collection("my_test", 4).await;
    println!("Create collection result is {:?}", r);

    let mut points = Vec::<Point>::new();
    points.push(Point {
        id: PointId::Num(1),
        vector: vec![0.05, 0.61, 0.76, 0.74],
        payload: json!({"city": "Berlin"}).as_object().map(|m| m.to_owned()),
    });
    points.push(Point {
        id: PointId::Num(2),
        vector: vec![0.19, 0.81, 0.75, 0.11],
        payload: json!({"city": "London"}).as_object().map(|m| m.to_owned()),
    });
    points.push(Point {
        id: PointId::Num(3),
        vector: vec![0.36, 0.55, 0.47, 0.94],
        payload: json!({"city": "Moscow"}).as_object().map(|m| m.to_owned()),
    });
    points.push(Point {
        id: PointId::Num(4),
        vector: vec![0.18, 0.01, 0.85, 0.80],
        payload: json!({"city": "New York"})
            .as_object()
            .map(|m| m.to_owned()),
    });
    points.push(Point {
        id: PointId::Num(5),
        vector: vec![0.24, 0.18, 0.22, 0.44],
        payload: json!({"city": "Beijing"}).as_object().map(|m| m.to_owned()),
    });
    points.push(Point {
        id: PointId::Num(6),
        vector: vec![0.35, 0.08, 0.11, 0.44],
        payload: json!({"city": "Mumbai"}).as_object().map(|m| m.to_owned()),
    });

    let r = client.upsert_points("my_test", points).await;
    println!("Upsert points result is {:?}", r);

    println!(
        "The collection size is {}",
        client.collection_info("my_test").await
    );

    let p = client.get_point("my_test", 2).await;
    println!("The second point is {:?}", p);

    let ps = client.get_points("my_test", vec![1, 2, 3, 4, 5, 6]).await;
    println!("The 1-6 points are {:?}", ps);

    let q = vec![0.2, 0.1, 0.9, 0.7];
    let r = client.search_points("my_test", q, 2, None).await;
    println!("Search result points are {:?}", r);

    let r = client.delete_points("my_test", vec![1, 4]).await;
    println!("Delete points result is {:?}", r);

    println!(
        "The collection size is {}",
        client.collection_info("my_test").await
    );

    let q = vec![0.2, 0.1, 0.9, 0.7];
    let r = client.search_points("my_test", q, 2, None).await;
    println!("Search result points are {:?}", r);
    Ok(())
}
```
