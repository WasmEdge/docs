---
sidebar_position: 2
---

# 伺服器

要讓 WasmEdge 成為微服務的雲端原生執行環境，它需要支援 HTTP 伺服器。就其本質而言，HTTP 伺服器一向都是非同步的（非阻塞 — 才能處理並行請求）。本章將涵蓋使用熱門 Rust API 建立的 HTTP 伺服器。

- [axum API](#the-axum-api)
- [hyper API](#the-hyper-api)

<!-- prettier-ignore -->
:::note
開始之前，[您需要先安裝 Rust 與 WasmEdge](../setup.md)。
請務必閱讀[網路應用程式的特別說明](../setup#special-notes-for-networking-apps)，尤其是當您在 Mac 上編譯 Rust 程式時。
:::

## axum API

[axum](https://github.com/tokio-rs/axum) crate 是 Rust Tokio 生態系中最熱門的 HTTP 伺服器框架。
它同時也是許多熱門服務的網頁框架，例如 [flows.network](https://flows.network) 這個用於工作流程函式的無伺服器平台。

使用 axum API 建立非同步 HTTP 伺服器。依下列方式在 WasmEdge 中建置並執行[範例](https://github.com/WasmEdge/wasmedge_hyper_demo/blob/main/server-axum/)。

```bash
git clone https://github.com/WasmEdge/wasmedge_hyper_demo
cd wasmedge_hyper_demo/server-axum

# Build the Rust code
RUSTFLAGS="--cfg wasmedge --cfg tokio_unstable" cargo build --target wasm32-wasip1 --release
# Use the AoT compiler for better performance
wasmedge compile target/wasm32-wasip1/release/wasmedge_axum_server.wasm wasmedge_axum_server.wasm

# Run the example
wasmedge wasmedge_axum_server.wasm
```

接著，在另一個終端機中，您可以向該伺服器送出請求。HTTP 伺服器會將請求資料原樣回應，並送回回應。

```bash
$ curl http://localhost:8080/echo -X POST -d "WasmEdge"
WasmEdge
```

在您的 Rust 應用程式中，您將會套用由 WasmEdge 社群所開發的數個 patch，
用 WasmEdge socket 取代標準函式庫中的 POSIX socket。套用這些 patch 後，
您就可以使用官方的 `tokio` 與 `axum` crate。

```toml
[patch.crates-io]
tokio = { git = "https://github.com/second-state/wasi_tokio.git", branch = "v1.36.x" }
socket2 = { git = "https://github.com/second-state/socket2.git", branch = "v0.5.x" }
hyper = { git = "https://github.com/second-state/wasi_hyper.git", branch = "v0.14.x" }

[dependencies]
axum = "0.6"
bytes = "1"
futures-util = "0.3.30"
tokio = { version = "1", features = ["rt", "macros", "net", "time", "io-util"]}
```

下方[範例 Rust 程式碼](https://github.com/WasmEdge/wasmedge_hyper_demo/blob/main/server-axum/src/main.rs)展示一個 HTTP 伺服器，會回應對 `/` 與 `/echo` URL 端點的傳入請求。

```rust
#[tokio::main(flavor = "current_thread")]
async fn main() {
    // build our application with a route
    let app = Router::new()
        .route("/", get(help))
        .route("/echo", post(echo));

    // run it
    let addr = "0.0.0.0:8080";
    let tcp_listener = TcpListener::bind(addr).await.unwrap();
    println!("listening on {}", addr);
    axum::Server::from_tcp(tcp_listener.into_std().unwrap())
        .unwrap()
        .serve(app.into_make_service())
        .await
        .unwrap();
}
```

當 `/echo` 收到 `POST` 請求時，會呼叫 `echo()` 函式。該函式會接收並處理請求主體，然後回傳位元組，作為回應訊息送回。

```rust
async fn echo(mut stream: BodyStream) -> Bytes {
    if let Some(Ok(s)) = stream.next().await {
        s
    } else {
        Bytes::new()
    }
}
```

## hyper API

`hyper` crate 是一個非常優異的函式庫，可使用可自訂的低階 API 來建立 HTTP 伺服器。依下列方式在 WasmEdge 中建置並執行[範例](https://github.com/WasmEdge/wasmedge_hyper_demo/blob/main/server/)。

```bash
git clone https://github.com/WasmEdge/wasmedge_hyper_demo
cd wasmedge_hyper_demo/server

# Build the Rust code
RUSTFLAGS="--cfg wasmedge --cfg tokio_unstable" cargo build --target wasm32-wasip1 --release
# Use the AoT compiler to get better performance
wasmedge compile target/wasm32-wasip1/release/wasmedge_hyper_server.wasm wasmedge_hyper_server.wasm

# Run the example
wasmedge wasmedge_hyper_server.wasm
```

接著，在另一個終端機中，您可以向該伺服器送出請求。HTTP 伺服器會將請求資料原樣回應，並送回回應。

```bash
$ curl http://localhost:8080/echo -X POST -d "WasmEdge"
WasmEdge
```

在您的 Rust 應用程式中，匯入 [hyper](https://crates.io/crates/hyper) 與 [tokio](https://crates.io/crates/tokio) crate，以及 WasmEdge 的 patch。只要在 `Cargo.toml` 加入下列幾行即可。

```toml
[patch.crates-io]
tokio = { git = "https://github.com/second-state/wasi_tokio.git", branch = "v1.36.x" }
socket2 = { git = "https://github.com/second-state/socket2.git", branch = "v0.5.x" }
hyper = { git = "https://github.com/second-state/wasi_hyper.git", branch = "v0.14.x" }

[dependencies]
hyper = { version = "0.14", features = ["full"]}
tokio = { version = "1", features = ["rt", "macros", "net", "time", "io-util"]}
```

下方[範例 Rust 程式碼](https://github.com/WasmEdge/wasmedge_hyper_demo/blob/main/server/src/main.rs)展示一個 HTTP 伺服器，會將任何傳入的請求原樣回傳。

```rust
async fn echo(req: Request<Body>) -> Result<Response<Body>, hyper::Error> {
    match (req.method(), req.uri().path()) {
        // Serve some instructions at /
        (&Method::GET, "/") => Ok(Response::new(Body::from(
            "Try POSTing data to /echo such as: `curl localhost:8080/echo -XPOST -d 'hello world'`",
        ))),

        // Simply echo the body back to the client.
        (&Method::POST, "/echo") => Ok(Response::new(req.into_body())),

        (&Method::POST, "/echo/reversed") => {
            let whole_body = hyper::body::to_bytes(req.into_body()).await?;

            let reversed_body = whole_body.iter().rev().cloned().collect::<Vec<u8>>();
            Ok(Response::new(Body::from(reversed_body)))
        }

        // Return the 404 Not Found for other routes.
        _ => {
            let mut not_found = Response::default();
            *not_found.status_mut() = StatusCode::NOT_FOUND;
            Ok(not_found)
        }
    }
}
```
