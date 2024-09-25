---
sidebar_position: 2
---

# Server

For WasmEdge to become a cloud-native runtime for microservices, it needs to support HTTP servers. By its very nature, the HTTP server is always asynchronous (non-blocking -- so that it can handle concurrent requests). This chapter will cover HTTP servers using popular Rust APIs.

- [The axum API](#the-axum-api)
- [The hyper API](#the-hyper-api)

<!-- prettier-ignore -->
:::note
Before we start, [you need to have Rust and WasmEdge installed](../setup.md).
Make sure that you read the [special notes on networking apps](../setup#special-notes-for-networking-apps) especially if you are compiling Rust programs on a Mac.
:::

## The axum API

The [axum](https://github.com/tokio-rs/axum) crate is the most popular HTTP server framework in the Rust Tokio ecosystem.
It is also the web framework for many popular services such as the [flows.network](https://flows.network) serverless platform for workflow functions.

Use the axum API to create an asynchronous HTTP server. Build and run [the example](https://github.com/WasmEdge/wasmedge_hyper_demo/blob/main/server-axum/) in WasmEdge as follows.

```bash
git clone https://github.com/WasmEdge/wasmedge_hyper_demo
cd wasmedge_hyper_demo/server-axum

# Build the Rust code
RUSTFLAGS="--cfg wasmedge --cfg tokio_unstable" cargo build --target wasm32-wasi --release
# Use the AoT compiler for better performance
wasmedge compile target/wasm32-wasi/release/wasmedge_axum_server.wasm wasmedge_axum_server.wasm

# Run the example
wasmedge wasmedge_axum_server.wasm
```

Then from another terminal, you can request the server. The HTTP server echoes the request data and sends back the response.

```bash
$ curl http://localhost:8080/echo -X POST -d "WasmEdge"
WasmEdge
```

In your Rust application, you will apply a few patches developed by the WasmEdge community to replace
POSIX sockets with WasmEdge sockets in standard libraries. With those patches, you can then
use the official `tokio` and `axum` crates.

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

The [Rust example code](https://github.com/WasmEdge/wasmedge_hyper_demo/blob/main/server-axum/src/main.rs) below shows an HTTP server that responds to incoming requests for the `/` and `/echo` URL endpoints.

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

The  `echo()` function is called when a `POST` request is received at `/echo`. The function receives and processes
the request body and returns bytes that are sent back as the response message.

```rust
async fn echo(mut stream: BodyStream) -> Bytes {
    if let Some(Ok(s)) = stream.next().await {
        s
    } else {
        Bytes::new()
    }
}
```

## The hyper API

The `hyper` crate is an excellent library for building HTTP servers using customizable low level APIs. Build and run [the example](https://github.com/WasmEdge/wasmedge_hyper_demo/blob/main/server/) in WasmEdge as follows.

```bash
git clone https://github.com/WasmEdge/wasmedge_hyper_demo
cd wasmedge_hyper_demo/server

# Build the Rust code
RUSTFLAGS="--cfg wasmedge --cfg tokio_unstable" cargo build --target wasm32-wasi --release
# Use the AoT compiler to get better performance
wasmedge compile target/wasm32-wasi/release/wasmedge_hyper_server.wasm wasmedge_hyper_server.wasm

# Run the example
wasmedge wasmedge_hyper_server.wasm
```

Then from another terminal, you can request the server. The HTTP server echoes the request data and sends back the response.

```bash
$ curl http://localhost:8080/echo -X POST -d "WasmEdge"
WasmEdge
```

In your Rust application, import the [hyper](https://crates.io/crates/hyper) and [tokio](https://crates.io/crates/tokio) crates, as well as the WasmEdge patches. Just add the following lines to your `Cargo.toml`.

```toml
[patch.crates-io]
tokio = { git = "https://github.com/second-state/wasi_tokio.git", branch = "v1.36.x" }
socket2 = { git = "https://github.com/second-state/socket2.git", branch = "v0.5.x" }
hyper = { git = "https://github.com/second-state/wasi_hyper.git", branch = "v0.14.x" }

[dependencies]
hyper = { version = "0.14", features = ["full"]}
tokio = { version = "1", features = ["rt", "macros", "net", "time", "io-util"]}
```

The [Rust example code](https://github.com/WasmEdge/wasmedge_hyper_demo/blob/main/server/src/main.rs) below shows an HTTP server that echoes back any incoming request.

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
