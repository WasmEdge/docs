---
sidebar_position: 4
---

# Qdrant driver

WasmEdge is emerging as a lightweight, portable, and embeddable runtime for large language models (LLMs). LLM inference applications, such as RAG chatbots and AI agents, can be developed on Mac or Windows, compiled to Wasm once, and then deployed across Nvidia / AMD / ARM-powered devices or servers, fully taking advantage of on-device GPUs, NPUs, and accelerators.

Hence, besides the LLM inference runtime, those LLM applications also need to manage embeddings in vector databases. The [qdrant-rest-client](https://crates.io/crates/qdrant_rest_client) crate allows you to access the Qdrant vector database from your portable Wasm apps!

<!-- prettier-ignore -->
:::note
Before we start, [you need to have Rust and WasmEdge installed](../setup.md).
Make sure that you read the [special notes on networking apps](../setup#special-notes-for-networking-apps) especially if you are compiling Rust programs on a Mac.
:::

## Run the example

The [wasmedge-db-example/qdrant](https://github.com/WasmEdge/wasmedge-db-examples/tree/main/qdrant) is a Qdrant client example written in Rust.

```bash
git clone https://github.com/WasmEdge/wasmedge-db-examples
cd wasmedge-db-examples/qdrant

# Compile the rust code into WASM
RUSTFLAGS="--cfg wasmedge --cfg tokio_unstable" cargo build --target wasm32-wasi --release

# Perform vector data operations against a Qdrant at http://localhost:6333
wasmedge target/wasm32-wasi/release/qdrant_examples.wasm
```

## Configuration

In order to compile the `qdrant_rest_client` and `tokio` crates, we will need to apply patches to add WasmEdge-specific socket APIs to those crates in `Cargo.toml`.

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

## Code explanation

The following program uses the `qdrant_rest_client` crate to access local Qdrant server through its RESTful API.
It first creates several points (vectors), saves those vectors to the Qdrant database, retrieves some vectors, 
searches for vectors, and finally deletes them from the database.

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

