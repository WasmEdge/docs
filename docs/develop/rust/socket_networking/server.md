---
sidebar_position: 2
---

# Socket server

As we described in the [client](client.md) chapter, with the WasmEdge socket API, it is possible for Rust developers to work directly on the TCP and UDP socket level. In this chapter, we will show how to create HTTP servers with the TCP socket API. We chose HTTP here for demonstration purposes due to the simplicity of the HTTP protocol. If you need a production-ready HTTP server, check out the [HTTP server](../http_service/server.md) chapter.

- [An HTTP server example](#an-http-server-example)
- [A non-blocking HTTP server example](#a-non-blocking-http-server-example)

<!-- prettier-ignore -->
:::note
Before we start, ensure [you have Rust and WasmEdge installed](../setup.md).
:::

## An HTTP server example

Build and run [the example](https://github.com/second-state/wasmedge_wasi_socket/tree/main/examples/http_server) in WasmEdge.

```bash
git clone https://github.com/second-state/wasmedge_wasi_socket
cd wasmedge_wasi_socket/http_server

# Build the Rust code
cargo build --target wasm32-wasi --release
# Use the AoT compiler for better performance
wasmedge compile target/wasm32-wasi/release/http_server.wasm http_server.wasm

# Run the example
$wasmedge http_server.wasm
new connection at 1234
```

To test the HTTP server, you can submit an HTTP request via `curl`.

```bash
$ curl -d "name=WasmEdge" -X POST http://127.0.0.1:1234
echo: name=WasmEdge
```

The [source code](https://github.com/second-state/wasmedge_wasi_socket/tree/main/examples/http_server) for the HTTP server application is available as follows. The example below shows an HTTP server that echoes back any incoming request.

```rust
use bytecodec::DecodeExt;
use httpcodec::{HttpVersion, ReasonPhrase, Request, RequestDecoder, Response, StatusCode};
use std::io::{Read, Write};
#[cfg(feature = "std")]
use std::net::{Shutdown, TcpListener, TcpStream};
#[cfg(not(feature = "std"))]
use wasmedge_wasi_socket::{Shutdown, TcpListener, TcpStream};

fn handle_http(req: Request<String>) -> bytecodec::Result<Response<String>> {
  Ok(Response::new(
    HttpVersion::V1_0,
    StatusCode::new(200)?,
    ReasonPhrase::new("")?,
    format!("echo: {}", req.body()),
  ))
}

fn handle_client(mut stream: TcpStream) -> std::io::Result<()> {
  let mut buff = [0u8; 1024];
  let mut data = Vec::new();

  loop {
    let n = stream.read(&mut buff)?;
    data.extend_from_slice(&buff[0..n]);
    if n < 1024 {
      break;
    }
  }

  let mut decoder =
    RequestDecoder::<httpcodec::BodyDecoder<bytecodec::bytes::Utf8Decoder>>::default();

  let req = match decoder.decode_from_bytes(data.as_slice()) {
    Ok(req) => handle_http(req),
    Err(e) => Err(e),
  };

  let r = match req {
    Ok(r) => r,
    Err(e) => {
      let err = format!("{:?}", e);
      Response::new(
        HttpVersion::V1_0,
        StatusCode::new(500).unwrap(),
        ReasonPhrase::new(err.as_str()).unwrap(),
        err.clone(),
      )
    }
  };

  let write_buf = r.to_string();
  stream.write(write_buf.as_bytes())?;
  stream.shutdown(Shutdown::Both)?;
  Ok(())
}

fn main() -> std::io::Result<()> {
  let port = std::env::var("PORT").unwrap_or(1234.to_string());
  println!("new connection at {}", port);
  let listener = TcpListener::bind(format!("0.0.0.0:{}", port))?;
  loop {
    let _ = handle_client(listener.accept()?.0);
  }
}
```

## A non-blocking HTTP server example

Build and run [the example](https://github.com/second-state/wasmedge_wasi_socket/) in WasmEdge as follows.

```bash
git clone https://github.com/second-state/wasmedge_wasi_socket
cd wasmedge_wasi_socket

# Build the Rust code
cargo build --target wasm32-wasi --release
# Use the AoT compiler for better performance
wasmedge compile target/wasm32-wasi/release/poll_tcp_listener.wasm poll_tcp_listener.wasm

# Run the example
wasmedge poll_tcp_listener.wasm
```

You can submit an HTTP request via `curl` to test the HTTP server.

```bash
$ curl -d "name=WasmEdge" -X POST http://127.0.0.1:1234
echo: name=WasmEdge
```

The [source code](https://github.com/second-state/wasmedge_wasi_socket/blob/main/examples/poll_tcp_listener.rs) for a non-blocking HTTP server application is available. The following `main()` function starts an HTTP server. It receives events from multiple open connections and processes them as they are received by calling the async handler functions registered to each connection. This server can process events from multiple open connections concurrently.

```rust
fn main() -> std::io::Result<()> {
    let mut connects = Connects::new();
    let server = TcpListener::bind("127.0.0.1:1234", true)?;
    connects.add(NetConn::Server(server));

    loop {
        let subs = connects_to_subscriptions(&connects);
        let events = poll::poll(&subs)?;

        for event in events {
            let conn_id = event.userdata as usize;
            match connects.get_mut(conn_id) {
                Some(NetConn::Server(server)) => match event.event_type {
                    poll::EventType::Timeout => unreachable!(),
                    poll::EventType::Error(e) => {
                        return Err(e);
                    }
                    poll::EventType::Read => {
                        let (mut tcp_client, addr) = server.accept(true)?;
                        println!("accept from {}", addr);

                        match tcp_client.write(DATA) {
                            Ok(n) if n < DATA.len() => {
                                println!(
                                    "write hello error: {}",
                                    io::Error::from(io::ErrorKind::WriteZero)
                                );
                                continue;
                            }
                            Ok(_) => {}
                            Err(ref err) if would_block(err) => {}
                            Err(ref err) if interrupted(err) => {}
                            Err(err) => {
                                println!("write hello error: {}", err);
                                continue;
                            }
                        }

                        let id = connects.add(NetConn::Client(tcp_client));
                        println!("add conn[{}]", id);
                    }
                    poll::EventType::Write => unreachable!(),
                },
                Some(NetConn::Client(client)) => {
                    match event.event_type {
                        poll::EventType::Timeout => {
                            // if Subscription timeout is not None.
                            unreachable!()
                        }
                        poll::EventType::Error(e) => {
                            println!("tcp_client[{}] recv a io error: {}", conn_id, e);
                            connects.remove(conn_id);
                        }
                        poll::EventType::Read => match handle_connection_read(client) {
                            Ok(true) => {
                                println!("tcp_client[{}] is closed", conn_id);
                                connects.remove(conn_id);
                            }
                            Err(e) => {
                                println!("tcp_client[{}] recv a io error: {}", conn_id, e);
                                connects.remove(conn_id);
                            }
                            _ => {}
                        },
                        poll::EventType::Write => unreachable!(),
                    }
                }
                _ => {}
            }
        }
    }
}
```

The `handle_connection()` function processes the data from those open connections. In this case, it just writes the request body into the response. It is also done asynchronously -- meaning that the `handle_connection()` function creates an event for the response and puts it in the queue. The main application loop processes the event and sends the response while waiting for data from other connections.

```rust
fn handle_connection_read(connection: &mut TcpStream) -> io::Result<bool> {
    let mut connection_closed = false;
    let mut received_buff = [0u8; 2048];

    let mut received_data = Vec::with_capacity(2048);
    loop {
        match connection.read(&mut received_buff) {
            Ok(0) => {
                connection_closed = true;
                break;
            }
            Ok(n) => {
                received_data.extend_from_slice(&received_buff[0..n]);
            }
            Err(ref err) if would_block(err) => break,
            Err(ref err) if interrupted(err) => continue,
            Err(err) => return Err(err),
        }
    }

    if !received_data.is_empty() {
        if let Ok(str_buf) = std::str::from_utf8(&received_data) {
            println!("Received data: {}", str_buf.trim_end());
        } else {
            println!("Received (none UTF-8) data: {:?}", received_data);
        }
    }

    if connection_closed {
        return Ok(true);
    }

    Ok(false)
}
```
