---
sidebar_position: 2
---

# Server

For WasmEdge to become a cloud-native runtime for microservices, it needs to support HTTP servers. By its very nature, the HTTP server is always asynchronous (non-blocking -- so that it can handle concurrent requests). This chapter will cover HTTP servers using popular Rust APIs.

- [The warp API](#the-warp-api)
- [The hyper API](#the-hyper-api)

<!-- prettier-ignore -->
:::note
Before we start, ensure [you have Rust and WasmEdge installed](../setup.md).
:::

## The warp API

Use the warp API to create an asynchronous HTTP server. Build and run [the example](https://github.com/WasmEdge/wasmedge_hyper_demo/blob/main/server-warp/) in WasmEdge as follows.

```bash
git clone https://github.com/WasmEdge/wasmedge_hyper_demo
cd wasmedge_hyper_demo/server-warp

# Build the Rust code
cargo build --target wasm32-wasi --release
# Use the AoT compiler for better performance
wasmedge compile target/wasm32-wasi/release/wasmedge_warp_server.wasm wasmedge_warp_server.wasm

# Run the example
wasmedge wasmedge_warp_server.wasm
```

Then from another terminal, you can request the server. The HTTP server echoes the request data and sends back the response.

```bash
$ curl http://localhost:8080/echo -X POST -d "WasmEdge"
WasmEdge
```

In your Rust application, import the WasmEdge-adapted `warp_wasi` crate, which uses a special version of single-threaded Tokio adapted for WebAssembly. Just add the following lines to your `Cargo.toml`.

```toml
[dependencies]
tokio_wasi = { version = "1", features = ["rt", "macros", "net", "time", "io-util"]}
warp_wasi = "0.3"
```

The [Rust example code](https://github.com/WasmEdge/wasmedge_hyper_demo/blob/main/server-warp/src/main.rs) below shows an HTTP server that echoes back any incoming request.

```rust
#[tokio::main(flavor = "current_thread")]
async fn main() {
    // GET /
    let help = warp::get()
        .and(warp::path::end())
        .map(|| "Try POSTing data to /echo such as: `curl localhost:8080/echo -XPOST -d 'hello world'`\n");

    // POST /echo
    let echo = warp::post()
        .and(warp::path("echo"))
        .and(warp::body::bytes())
        .map(|body_bytes: bytes::Bytes| {
            format!("{}\n", std::str::from_utf8(body_bytes.as_ref()).unwrap())
        });

    let routes = help.or(echo);
    warp::serve(routes).run(([0, 0, 0, 0], 8080)).await
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
