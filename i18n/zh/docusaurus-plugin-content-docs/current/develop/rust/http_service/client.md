---
sidebar_position: 1
---

# 4.3.1 Client

WasmEdge allows Rust developers to use APIs they are already familiar with to access the Internet via the HTTP or HTTPS protocols. In this chapter, we will cover simple synchronous clients, asynchronous clients, as well as clients based on low level hyper and socket APIs. For HTTP servers in WasmEdge, please see [the next chapter](server).

> Before we started, make sure [you have Rust and WasmEdge installed](../../rust/setup).

## Synchronous

You could use the http_req API to make simple synchronous HTTP requests. Here are some examples. First, you will need to import the [http_req_wasi](https://crates.io/crates/http_req_wasi) crate, which is compatible with http_req at the API level.

Just add the following line to your Cargo.toml.

```
[dependencies]
http_req_wasi  = "0.10"
```

Note: The wasmedge_http_req project is a fork of the [http_req](https://github.com/jayjamesjay/http_req) project. It uses a special version of single threaded Tokio that is adapted for WebAssembly.

The example below shows an [HTTP GET request](https://github.com/second-state/http_req/blob/a53f6e6cb315aff488f9b2abcf2c4b2a1d631a34/examples/get.rs).

```
use http_req::request;

fn main() {
    let mut writer = Vec::new(); //container for body of a response
    let res = request::get("http://eu.httpbin.org/get?msg=WasmEdge", &mut writer).unwrap();

    println!("Status: {} {}", res.status_code(), res.reason());
    println!("Headers {}", res.headers());
    println!("{}", String::from_utf8_lossy(&writer));
}
```

And here is an [HTTP POST request](https://github.com/second-state/http_req/blob/a53f6e6cb315aff488f9b2abcf2c4b2a1d631a34/examples/post.rs).

```
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

You can build and run [the example](https://github.com/second-state/http_req/) in WasmEdge as follows.

```
# get the source code
$ git clone https://github.com/second-state/http_req.git
$ cd http_req/

# Build the Rust Code
cargo build --target wasm32-wasi --release

# Use the AoT compiler to get better performance
wasmedgec target/wasm32-wasi/release/get.wasm target/wasm32-wasi/release/get.wasm

# Run the example
wasmedge target/wasm32-wasi/release/get.wasm
```

## Asynchronous

You could use the reqwest API to make asynchronous HTTP requests. Here are some examples. First, you will need to import the WasmEdge adapted [reqwest_wasi crate](https://crates.io/crates/reqwest_wasi), which uses a special version of single threaded Tokio that is adapted for WebAssembly.

Just add the following line to your Cargo.toml.

```
[dependencies]
reqwest_wasi = { version = "0.11", features = ["json"] }
tokio_wasi = { version = "1.21", features = ["full"] }
```

The example below shows an HTTP GET request.

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

You can build and run [the example](https://github.com/WasmEdge/wasmedge_reqwest_demo/) in WasmEdge as follows.

```
# get the source code
$ git clone https://github.com/WasmEdge/wasmedge_reqwest_demo.git
$ cd wasmedge_reqwest_demo

# Build the Rust code
cargo build --target wasm32-wasi --release

# Use the AoT compiler to get better performance
wasmedgec target/wasm32-wasi/release/wasmedge_reqwest_demo.wasm target/wasm32-wasi/release/wasmedge_reqwest_demo.wasm

# Run the example
wasmedge target/wasm32-wasi/release/wasmedge_reqwest_demo.wasm
```

## The hyper API

The http_req and reqwest crates are convenient to use. But often times, developers need access lower level APIs. The hyper crate is an excellent HTTP library for that. Here are some examples. First, you will need to import [the WasmEdge adapted hyper crate](https://crates.io/crates/hyper_wasi), which uses a special version of single threaded Tokio that is adapted for WebAssembly.

Just add the following line to your Cargo.toml.

```
[dependencies]
hyper_wasi = "0.15.0"
```

The example below shows an HTTP GET request.

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

You can build and run [the hyper example](https://github.com/WasmEdge/wasmedge_hyper_demo/) in WasmEdge as follows.

```
# Git clone or fork the example repo
$ git clone https://github.com/WasmEdge/wasmedge_hyper_demo.git
$ cd wasmedge_hyper_demo/client
# Build the Rust code
cargo build --target wasm32-wasi --release
# Use the AoT compiler to get better performance
wasmedgec target/wasm32-wasi/release/wasmedge_hyper_client.wasm target/wasm32-wasi/release/wasmedge_hyper_client.wasm
# Run the example
wasmedge target/wasm32-wasi/release/wasmedge_hyper_client.wasm
```
