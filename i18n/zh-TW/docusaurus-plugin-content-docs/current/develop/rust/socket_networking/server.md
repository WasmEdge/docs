---
sidebar_position: 2
---

# Socket 伺服器

如同我們在[用戶端](client.md)章節所述，透過 WasmEdge 的 socket API，Rust 開發者可以直接在 TCP 與 UDP socket 層級進行開發。在本章中，我們將示範如何以 TCP socket API 建立 HTTP 伺服器。我們在此處選擇 HTTP 作為示範，是因為 HTTP 通訊協定本身相對單純。如果您需要正式環境等級的 HTTP 伺服器，請參閱 [HTTP 伺服器](../http_service/server.md)章節。

- [HTTP 伺服器範例](#an-http-server-example)
- [非阻塞 HTTP 伺服器範例](#a-non-blocking-http-server-example)

<!-- prettier-ignore -->
:::note
開始之前，請確認[您已安裝 Rust 與 WasmEdge](../setup.md)。
:::

## HTTP 伺服器範例

在 WasmEdge 中建置並執行[範例](https://github.com/second-state/wasmedge_wasi_socket/tree/main/examples/http_server)。

```bash
git clone https://github.com/second-state/wasmedge_wasi_socket
cd wasmedge_wasi_socket/http_server

# Build the Rust code
cargo build --target wasm32-wasip1 --release
# Use the AoT compiler for better performance
wasmedge compile target/wasm32-wasip1/release/http_server.wasm http_server.wasm

# Run the example
$wasmedge http_server.wasm
new connection at 1234
```

若要測試此 HTTP 伺服器，您可以透過 `curl` 送出 HTTP 請求。

```bash
$ curl -d "name=WasmEdge" -X POST http://127.0.0.1:1234
echo: name=WasmEdge
```

HTTP 伺服器應用程式的[原始碼](https://github.com/second-state/wasmedge_wasi_socket/tree/main/examples/http_server)如下。下方範例展示一個 HTTP 伺服器，會將任何傳入的請求原樣回傳。

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

## 非阻塞 HTTP 伺服器範例

依下列方式在 WasmEdge 中建置並執行[範例](https://github.com/second-state/wasmedge_wasi_socket/)。

```bash
git clone https://github.com/second-state/wasmedge_wasi_socket
cd wasmedge_wasi_socket

# Build the Rust code
cargo build --target wasm32-wasip1 --release
# Use the AoT compiler for better performance
wasmedge compile target/wasm32-wasip1/release/poll_tcp_listener.wasm poll_tcp_listener.wasm

# Run the example
wasmedge poll_tcp_listener.wasm
```

您可以透過 `curl` 送出 HTTP 請求來測試此 HTTP 伺服器。

```bash
$ curl -d "name=WasmEdge" -X POST http://127.0.0.1:1234
echo: name=WasmEdge
```

非阻塞 HTTP 伺服器應用程式的[原始碼](https://github.com/second-state/wasmedge_wasi_socket/blob/main/examples/poll_tcp_listener.rs)可供取得。下列 `main()` 函式會啟動一個 HTTP 伺服器，從多個開啟的連線接收事件，並在接收到事件時，呼叫註冊於每個連線上的非同步處理函式。此伺服器可以並行處理來自多個開啟連線的事件。

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

`handle_connection()` 函式會處理那些開啟連線上的資料。在這個範例中，它只是將請求主體寫入回應。這也是非同步完成的 — 也就是說，`handle_connection()` 函式會為回應建立一個事件並放入佇列。主應用程式迴圈會處理該事件、送出回應，同時繼續等候來自其他連線的資料。

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
