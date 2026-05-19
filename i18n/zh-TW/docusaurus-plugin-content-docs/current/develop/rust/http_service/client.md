---
sidebar_position: 1
---

# HTTP 用戶端

WasmEdge 讓 Rust 開發者能透過 HTTP 或 HTTPS 通訊協定使用他們已經熟悉的 API 來存取網際網路。本章將涵蓋 HTTP 用戶端的 API 與函式庫，用以從您的 WasmEdge 應用程式存取外部的網頁服務。關於 WasmEdge 內的 HTTP 伺服器，請參閱[下一章](server)。

<!-- prettier-ignore -->
:::note
開始之前，[您需要先安裝 Rust 與 WasmEdge](../setup.md)。
請務必閱讀[網路應用程式的特別說明](../setup#special-notes-for-networking-apps)，尤其是當您在 Mac 上編譯 Rust 程式時。
:::

我們將會使用熱門的 Rust API 來討論 HTTP 與 HTTPS 用戶端。

- [reqwest API](#the-reqwest-api)
- [hyper API](#the-hyper-api)

## reqwest API

`reqwest` crate 是熱門的 Rust 函式庫，可用於建立非同步 HTTP 用戶端。它建構於 `hyper` 與 `tokio` API 之上，許多開發者認為使用它更為簡單。不過更重要的是，許多現有的 Rust 應用程式都使用 `reqwest`，而您只需要在 `Cargo.toml` 內為 `reqwest` crate 套用簡單的 patch，就可以讓它們在 WasmEdge 中運作！依下列方式在 WasmEdge 中建置並執行[範例](https://github.com/WasmEdge/wasmedge_reqwest_demo/)。

<!-- prettier-ignore -->
:::note
非阻塞 I/O 表示應用程式可以同時保持多個連線開啟，並在資料進出這些連線時即時處理它們。程式可以對這些開啟的連線進行交替輪詢，或是等候傳入的資料觸發非同步函式。即使在單執行緒的環境中，這也能讓 I/O 密集型的程式執行得更快。
:::

```bash
git clone https://github.com/WasmEdge/wasmedge_reqwest_demo
cd wasmedge_reqwest_demo

# Build the Rust code
RUSTFLAGS="--cfg wasmedge --cfg tokio_unstable" cargo build --target wasm32-wasip1 --release
# Use the AoT compiler to get better performance
wasmedge compile target/wasm32-wasip1/release/http.wasm http.wasm
wasmedge compile target/wasm32-wasip1/release/https.wasm https.wasm

# Run the HTTP GET and POST examples
wasmedge http.wasm

# Run the HTTPS GET and POST examples
wasmedge https.wasm
```

在您的 Rust 應用程式中，匯入標準的 [reqwest](https://crates.io/crates/reqwest) 與 [tokio](https://crates.io/crates/tokio) crate。您也需要對部分相依 crate 套用 patch，讓它們認識 WasmEdge 的 socket API。只要在 `Cargo.toml` 加入下列幾行即可。

```toml
[patch.crates-io]
tokio = { git = "https://github.com/second-state/wasi_tokio.git", branch = "v1.36.x" }
socket2 = { git = "https://github.com/second-state/socket2.git", branch = "v0.5.x" }
hyper = { git = "https://github.com/second-state/wasi_hyper.git", branch = "v0.14.x" }
reqwest = { git = "https://github.com/second-state/wasi_reqwest.git", branch = "0.11.x" }

[dependencies]
reqwest = { version = "0.11", default-features = false, features = ["rustls-tls"] }
tokio = { version = "1", features = ["rt", "macros", "net", "time"] }
```

<!-- prettier-ignore -->
:::note
此處的 `Cargo.toml` 顯示已啟用 TLS。若您需要在 MacOS 上編譯，會需要 [wasi-sdk 版本的 clang](../setup#tls-on-macos)。
:::

下方[範例 Rust 程式](https://github.com/WasmEdge/wasmedge_reqwest_demo/blob/main/src/http.rs)展示 HTTP GET 請求。

```rust
use std::collections::HashMap;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let resp = reqwest::get("http://eu.httpbin.org/ip")
        .await?
        .json::<HashMap<String, String>>()
        .await?;
    println!("{:#?}", resp);
    Ok(())
}
```

下方為 HTTP POST 請求。

```rust
    let client = reqwest::Client::new();

    let res = client
        .post("http://eu.httpbin.org/post")
        .body("msg=WasmEdge")
        .send()
        .await?;
    let body = res.text().await?;

    println!("POST: {}", body);
```

## hyper API

[hyper crate](https://crates.io/crates/hyper) 是廣泛使用的 Rust 函式庫，可用於為用戶端與伺服器建立 HTTP 與 HTTPS 網路應用程式。`hyper` crate 的關鍵特色是它建構於 `tokio` 執行環境之上，支援非同步網路連線。非同步的 HTTP 或 HTTPS 請求不會阻擋呼叫端應用程式的執行。這讓應用程式能夠同時送出多個並行的 HTTP 請求，並在收到回應時加以處理。這使得 WasmEdge 中能夠有高效能的網路應用程式。依下列方式在 WasmEdge 中建置並執行 [hyper 範例](https://github.com/WasmEdge/wasmedge_hyper_demo/)。

```bash
git clone https://github.com/WasmEdge/wasmedge_hyper_demo
cd wasmedge_hyper_demo/client

# Build the Rust code
RUSTFLAGS="--cfg wasmedge --cfg tokio_unstable" cargo build --target wasm32-wasip1 --release
# Use the AoT compiler to get better performance
wasmedge compile target/wasm32-wasip1/release/wasmedge_hyper_client.wasm wasmedge_hyper_client.wasm

# Run the example
wasmedge wasmedge_hyper_client.wasm
```

在您的 Rust 應用程式中匯入 [hyper](https://crates.io/crates/hyper) crate，
並對其套用 WasmEdge socket patch。
只要在 `Cargo.toml` 加入下列幾行即可。

```toml
[patch.crates-io]
tokio = { git = "https://github.com/second-state/wasi_tokio.git", branch = "v1.36.x" }
socket2 = { git = "https://github.com/second-state/socket2.git", branch = "v0.5.x" }
hyper = { git = "https://github.com/second-state/wasi_hyper.git", branch = "v0.14.x" }

[dependencies]
hyper = { version = "0.14", features = ["full"] }
tokio = { version = "1", features = [ "rt", "macros", "net", "time", "io-util" ] }
```

HTTPS 版本的範例如下。

```bash
// Build
cd wasmedge_hyper_demo/client-https
RUSTFLAGS="--cfg wasmedge --cfg tokio_unstable" cargo build --target wasm32-wasip1 --release
wasmedge compile target/wasm32-wasip1/release/wasmedge_hyper_client_https.wasm wasmedge_hyper_client_https.wasm

// Run
wasmedge wasmedge_hyper_client_https.wasm
```

在 HTTPS 版本的 `Cargo.toml` 中，您只需匯入標準的 [hyper-rustls](https://crates.io/crates/hyper-rustls)、[rustls](https://crates.io/crates/rustls) 與 [webpki-roots](https://crates.io/crates/webpki-roots) crate，並套用與上述相同的 patch。

```toml
[patch.crates-io]
tokio = { git = "https://github.com/second-state/wasi_tokio.git", branch = "v1.36.x" }
socket2 = { git = "https://github.com/second-state/socket2.git", branch = "v0.5.x" }
hyper = { git = "https://github.com/second-state/wasi_hyper.git", branch = "v0.14.x" }

[dependencies]
hyper = { version = "0.14", features = ["full"]}
hyper-rustls = { version = "0.25", default-features = false, features = [ "http1", "tls12", "logging", "ring", "webpki-tokio" ] }
rustls = { version = "0.22", default-features = false }
webpki-roots = "0.26.1"

tokio = { version = "1", features = ["rt", "macros", "net", "time", "io-util"]}
pretty_env_logger = "0.4.0"
```

<!-- prettier-ignore -->
:::note
若您需要在 MacOS 上依上方 `Cargo.toml` 編譯 `rustls`，會需要 [wasi-sdk 版本的 clang](../setup#tls-on-macos)。
:::

下方[範例 Rust 程式碼](https://github.com/WasmEdge/wasmedge_hyper_demo/blob/main/client/src/main.rs)展示 HTTP GET 請求。

```rust
async fn fetch_url_return_str (url: hyper::Uri) -> Result<()> {
    let client = Client::new();
    let mut res = client.get(url).await?;

    let mut resp_data = Vec::new();
    while let Some(next) = res.data().await {
        let chunk = next?;
        resp_data.extend_from_slice(&chunk);
    }
    println!("{}", String::from_utf8_lossy(&resp_data));
```

[HTTPS 範例](https://github.com/WasmEdge/wasmedge_hyper_demo/blob/main/client-https/src/main.rs)稍微複雜一些。

```rust
async fn fetch_https_url(url: hyper::Uri) -> Result<()> {
    let https = wasmedge_hyper_rustls::connector::new_https_connector(
        wasmedge_rustls_api::ClientConfig::default(),
    );
    let client = Client::builder().build::<_, hyper::Body>(https);
    let res = client.get(url).await?;

    let body = hyper::body::to_bytes(res.into_body()).await.unwrap();
    println!("{}", String::from_utf8(body.into()).unwrap());
    Ok(())
}
```

下方為 HTTP POST 請求。

```rust
async fn post_url_return_str (url: hyper::Uri, post_body: &'static [u8]) -> Result<()> {
    let client = Client::new();
    let req = Request::builder()
        .method(Method::POST)
        .uri(url)
        .body(Body::from(post_body))?;
    let mut res = client.request(req).await?;

    let mut resp_data = Vec::new();
    while let Some(next) = res.data().await {
        let chunk = next?;
        resp_data.extend_from_slice(&chunk);
    }
    println!("{}", String::from_utf8_lossy(&resp_data));

    Ok(())
}
```
