---
sidebar_position: 1
---

# 4.4.1 Client

WasmEdge allows Rust developers to use APIs they are already familiar with to access the Internet via the HTTP or HTTPS protocols. In this chapter, we will cover HTTP client APIs and libraries to access external web services from your WasmEdge app. For HTTP servers in WasmEdge, please see [the next chapter](server).

:::note
Before we started, make sure [you have Rust and WasmEdge installed](../setup).
:::

We will discuss asynchronous HTTP and HTTPS clients with reqwest, synchronous clients with http_req, and low level clients with hyper. All of them are popular Rust crates for networking.

* [Async client with reqwest](#asynchronous-client-with-reqwest)
* [Sync client with http_req](#synchronous-client-with-http-req)
* [Low level HTTP API with hyper](#low-level-api-with-hyper)

## Asynchronous client with reqwest

Asynchronous HTTP or HTTPS requests do not block the execution of the calling application. It allows an application to make multiple concurrent HTTP requests and to process responses as they are received. That enables high-performance networking applications in WasmEdge.

:::note
Non-blocking I/O means that the application program can keep multiple connections open at the same time, and process data in and out of those connections as they come in. The program can either alternatingly poll those open connections or wait for incoming data to trigger async functions. That allows I/O intensive programs to run much faster even in a single-threaded environment.
:::

You could use the reqwest API to make asynchronous HTTP requests. Build and run [the example](https://github.com/WasmEdge/wasmedge_reqwest_demo/) in WasmEdge as follows. It will execute both HTTP and HTTPS examples.

```bash
git clone https://github.com/WasmEdge/wasmedge_reqwest_demo
cd wasmedge_reqwest_demo

# Build the Rust code
cargo build --target wasm32-wasi --release
# Use the AoT compiler to get better performance
wasmedgec target/wasm32-wasi/release/wasmedge_reqwest_demo.wasm wasmedge_reqwest_demo.wasm

# Run the example
wasmedge wasmedge_reqwest_demo.wasm
```

In your Rust application, import the WasmEdge adapted [reqwest_wasi crate](https://crates.io/crates/reqwest_wasi), which uses a special version of single threaded Tokio that is adapted for WebAssembly.
Just add the following line to your Cargo.toml.

```
[dependencies]
reqwest_wasi = { version = "0.11", features = ["json"] }
tokio_wasi = { version = "1.21", features = ["full"] }
```

The [example Rust code](https://github.com/WasmEdge/wasmedge_reqwest_demo/blob/main/src/main.rs) below shows an HTTP GET request.

```
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

```
    let client = reqwest::Client::new();

    let res = client
        .post("http://eu.httpbin.org/post")
        .body("msg=WasmEdge")
        .send()
        .await?;
    let body = res.text().await?;

    println!("POST: {}", body);
```

:::note
In order to make HTTPS requests, you need to install the WasmEdge TLS plugin.
:::


## Synchronous client with http_req

If your WasmEdge application only needs to make sequential requests to external web services, a synchronous client is easier to work with. It allows you to make a request, wait for the response, and move on once the response is fully received.
You could use the http_req API to make simple synchronous HTTP requests. 
Build and run [the example](https://github.com/second-state/http_req/) in WasmEdge as follows.

```bash
git clone https://github.com/second-state/http_req
cd http_req/

# Build the Rust Code
cargo build --target wasm32-wasi --release
# Use the AoT compiler to get better performance
wasmedgec target/wasm32-wasi/release/get.wasm get.wasm

# Run the example
wasmedge get.wasm
```

In your Rust application, import the [http_req_wasi](https://crates.io/crates/http_req_wasi) crate, which is compatible with [http_req](https://github.com/jayjamesjay/http_req) at the API level.
Just add the following line to your Cargo.toml.

```
[dependencies]
http_req_wasi  = "0.10"
```

The example below shows an [HTTP GET request](https://github.com/second-state/http_req/blob/master/examples/get.rs).

```rust
use http_req::request;

fn main() {
    let mut writer = Vec::new(); //container for body of a response
    let res = request::get("http://eu.httpbin.org/get?msg=WasmEdge", &mut writer).unwrap();

    println!("Status: {} {}", res.status_code(), res.reason());
    println!("Headers {}", res.headers());
    println!("{}", String::from_utf8_lossy(&writer));
}
```

And here is an [HTTP POST request](https://github.com/second-state/http_req/blob/master/examples/post.rs).

```rust
use http_req::request;

fn main() {
    let mut writer = Vec::new(); //container for body of a response
    const BODY: &[u8; 27] = b"field1=value1&field2=value2";
    let res = request::post("http://eu.httpbin.org/post", BODY, &mut writer).unwrap();

    println!("Status: {} {}", res.status_code(), res.reason());
    println!("Headers {}", res.headers());
    println!("{}", String::from_utf8_lossy(&writer));
}
```

:::note
In order to make HTTPS requests, you need to [install the wasmedge_httpsreq plugin](../../build-and-run/install#wasmedge-httpsreq-plugin). You can then run the HTTPS [GET](https://github.com/second-state/http_req/blob/master/examples/get_https.rs) and [POST](https://github.com/second-state/http_req/blob/master/examples/post_https.rs) examples in the example repo.
:::

## Low-level API with hyper

The http_req and reqwest crates are convenient to use. But often times, developers need access lower level APIs. The hyper crate is an excellent HTTP library for that. 
Build and run [the hyper example](https://github.com/WasmEdge/wasmedge_hyper_demo/) in WasmEdge as follows.

:::note
The `hyper_wasi` crate utilizes non-blocking socket connections.
:::

```
git clone https://github.com/WasmEdge/wasmedge_hyper_demo
cd wasmedge_hyper_demo/client

# Build the Rust code
cargo build --target wasm32-wasi --release
# Use the AoT compiler to get better performance
wasmedgec target/wasm32-wasi/release/wasmedge_hyper_client.wasm wasmedge_hyper_client.wasm

# Run the example
wasmedge wasmedge_hyper_client.wasm
```

In your Rust application, import [the WasmEdge adapted hyper crate](https://crates.io/crates/hyper_wasi), which uses a special version of single threaded Tokio that is adapted for WebAssembly.
Just add the following line to your Cargo.toml.

```
[dependencies]
hyper_wasi = "0.15.0"
```

The [Rust example code](https://github.com/WasmEdge/wasmedge_hyper_demo/blob/main/client/src/main.rs) below shows an HTTP GET request.

```
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

And here is an HTTP POST request.

```
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

:::note
In order to make HTTPS requests, you need to install the WasmEdge TLS plugin.
:::


