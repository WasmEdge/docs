---
sidebar_position: 1
---

# HTTP client

WasmEdge allows Rust developers to use APIs they are already familiar with to access the Internet via the HTTP or HTTPS protocols. This chapter will cover HTTP client APIs and libraries to access external web services from your WasmEdge app. For HTTP servers in WasmEdge, please see [the next chapter](server).

<!-- prettier-ignore -->
:::note
Before we start, [you need to have Rust and WasmEdge installed](../setup.md).
Make sure that you read the [special notes on networking apps](../setup#special-notes-for-networking-apps) especially if you are compiling Rust programs on a Mac.
:::

We will discuss HTTP and HTTPS clients using popular Rust APIs.

- [The reqwest API](#the-reqwest-api)
- [The hyper API](#the-hyper-api)

## The reqwest API

The `reqwest` crate is a popular Rust library to create asynchronous HTTP clients. It is built on top of the `hyper` and `tokio` APIs. Many developers find it easier to use. But perhaps more importantly, many existing Rust applications use `reqwest`, and you can make them work in WasmEdge by simply patching the `reqwest` crate in `Cargo.toml` with simple patches! Build and run [the example](https://github.com/WasmEdge/wasmedge_reqwest_demo/) in WasmEdge as follows.

<!-- prettier-ignore -->
:::note
Non-blocking I/O means that the application program can keep multiple connections open simultaneously, and process data in and out of those connections as they come in. The program can either alternatingly poll those open connections or wait for incoming data to trigger async functions. That allows I/O intensive programs to run much faster, even in a single-threaded environment.
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

In your Rust application, import the standard [reqwest](https://crates.io/crates/reqwest) and [tokio](https://crates.io/crates/tokio) crates. You will also patch a few dependency crates to make them aware of the WasmEdge socket API. Just add the following lines to your `Cargo.toml`.

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
The `Cargo.toml` here shows that TLS is enabled. If you need to compile it on the MacOS, you will need the [wasi-sdk version of clang](../setup#tls-on-macos).
:::

The [example Rust code](https://github.com/WasmEdge/wasmedge_reqwest_demo/blob/main/src/http.rs) below shows an HTTP GET request.

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

And here is an HTTP POST request.

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

## The hyper API

The [hyper crate](https://crates.io/crates/hyper) is a widely used Rust library to create HTTP and HTTPS networking applications for both clients and servers. A key feature of the `hyper` crate is that it is based on the `tokio` runtime, which supports asynchronous network connections. Asynchronous HTTP or HTTPS requests do not block the execution of the calling application. It allows an application to make multiple concurrent HTTP requests and to process responses as they are received. That enables high-performance networking applications in WasmEdge. Build and run [the hyper example](https://github.com/WasmEdge/wasmedge_hyper_demo/) in WasmEdge as follows.

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

In your Rust application, import the [hyper](https://crates.io/crates/hyper) crate,
and patch it with WasmEdge sockets patches.
Just add the following line to your `Cargo.toml`.

```toml
[patch.crates-io]
tokio = { git = "https://github.com/second-state/wasi_tokio.git", branch = "v1.36.x" }
socket2 = { git = "https://github.com/second-state/socket2.git", branch = "v0.5.x" }
hyper = { git = "https://github.com/second-state/wasi_hyper.git", branch = "v0.14.x" }

[dependencies]
hyper = { version = "0.14", features = ["full"] }
tokio = { version = "1", features = [ "rt", "macros", "net", "time", "io-util" ] }
```

The HTTPS version of the demo is as follows.

```bash
// Build
cd wasmedge_hyper_demo/client-https
RUSTFLAGS="--cfg wasmedge --cfg tokio_unstable" cargo build --target wasm32-wasip1 --release
wasmedge compile target/wasm32-wasip1/release/wasmedge_hyper_client_https.wasm wasmedge_hyper_client_https.wasm

// Run
wasmedge wasmedge_hyper_client_https.wasm
```

In the HTTPS version of `Cargo.toml`, you just need to import the standard [hyper-rustls](https://crates.io/crates/hyper-rustls), [rustls](https://crates.io/crates/rustls) and [webpki-roots](https://crates.io/crates/webpki-roots) crates with the same patches as above.

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
If you need to compile `rustls` as shown in the `Cargo.toml` above on the MacOS, you will need the [wasi-sdk version of clang](../setup#tls-on-macos).
:::

The [Rust example code](https://github.com/WasmEdge/wasmedge_hyper_demo/blob/main/client/src/main.rs) below shows an HTTP GET request.

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

The [HTTPS example](https://github.com/WasmEdge/wasmedge_hyper_demo/blob/main/client-https/src/main.rs) is slightly more complex.

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

And here is an HTTP POST request.

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
