---
sidebar_position: 1
---

# Socket 用戶端

WasmEdge 應用程式可以在主機系統中開啟 TCP/IP 或 UDP 網路 socket，直接與外部應用程式通訊。WasmEdge 的關鍵特色之一是它支援非阻塞 socket。即使是單執行緒的 WASM 應用程式，也能藉此處理並行的網路請求。例如，當程式正在等候某個連線傳入資料時，它可以開始或處理另一個連線。[wasmedge_wasi_socket](https://github.com/second-state/wasmedge_wasi_socket) crate 讓 Rust 開發者能在網路 socket 層級進行開發。

在本章中，我們將示範如何在 TCP socket 上建立 HTTP 用戶端。原因是 HTTP 通訊協定相對單純，便於示範。如果您要在正式環境中使用 HTTP 用戶端，建議閱讀本書中的 [HTTP 用戶端](../http_service/client.md)章節。

- [以 TCP socket 為基礎的簡易 HTTP 用戶端](#a-simple-http-client)
- [以 TCP socket 為基礎的非阻塞 HTTP 用戶端](#a-non-blocking-http-client-example)

<!-- prettier-ignore -->
:::note
開始之前，請確認[您已安裝 Rust 與 WasmEdge](../setup.md)。
:::

## 簡易 HTTP 用戶端

您可以依下列方式在 WasmEdge 中建置並執行[範例](https://github.com/second-state/wasmedge_wasi_socket/tree/main/examples/http_client)。

```bash
git clone https://github.com/second-state/wasmedge_wasi_socket.git
cd wasmedge_wasi_socket/http_client/

# Build the Rust Code
cargo build --target wasm32-wasip1 --release
# Use the AoT compiler to get better performance
wasmedge compile target/wasm32-wasip1/release/http_client.wasm http_client.wasm

# Run the example
wasmedge http_client.wasm
```

HTTP 用戶端的[原始碼](https://github.com/second-state/wasmedge_wasi_socket/tree/main/examples/http_client)如下。

```rust
use wasmedge_http_req::request;

fn main() {
  let mut writer = Vec::new(); //container for body of a response
  let res = request::get("http://127.0.0.1:1234/get", &mut writer).unwrap();

  println!("GET");
  println!("Status: {} {}", res.status_code(), res.reason());
  println!("Headers {}", res.headers());
  println!("{}", String::from_utf8_lossy(&writer));

  let mut writer = Vec::new(); //container for body of a response
  const BODY: &[u8; 27] = b"field1=value1&field2=value2";
  // let res = request::post("https://httpbin.org/post", BODY, &mut writer).unwrap();
  // no https , no dns
  let res = request::post("http://127.0.0.1:1234/post", BODY, &mut writer).unwrap();

  println!("POST");
  println!("Status: {} {}", res.status_code(), res.reason());
  println!("Headers {}", res.headers());
  println!("{}", String::from_utf8_lossy(&writer));
}
```

## 非阻塞 HTTP 用戶端範例

您可以依下列方式在 WasmEdge 中建置並執行[範例](https://github.com/second-state/wasmedge_wasi_socket/tree/main/examples/nonblock_http_client)。

```bash
git clone https://github.com/second-state/wasmedge_wasi_socket
cd wasmedge_wasi_socket/nonblock_http_client/

# Build the Rust Code
cargo build --target wasm32-wasip1 --release
# Use the AoT compiler for better performance
wasmedge compile target/wasm32-wasip1/release/nonblock_http_client.wasm nonblock_http_client.wasm

# Run the example
wasmedge nonblock_http_client.wasm
```

<!-- prettier-ignore -->
:::note
非阻塞 I/O 表示應用程式可以同時保持多個連線開啟，並在資料進出這些連線時即時處理它們。程式可以對這些開啟的連線進行交替輪詢，或是等候傳入的資料觸發非同步函式。即使在單執行緒的環境中，這也能讓 I/O 密集型的程式執行得更快。
:::

非阻塞 HTTP 用戶端應用程式的[原始碼](https://github.com/second-state/wasmedge_wasi_socket/tree/main/examples/nonblock_http_client)可供取得。下列 `main()` 函式會啟動兩個 HTTP 連線，程式會同時保持兩個連線開啟，並交替檢查傳入的資料。換句話說，這兩個連線不會互相阻擋。當資料抵達時，會以並行（或交替）方式處理它們的資料。

```rust
use httparse::{Response, EMPTY_HEADER};
use std::io::{self, Read, Write};
use std::str::from_utf8;
use wasmedge_wasi_socket::TcpStream;

fn main() {
    let req = "GET / HTTP/1.0\n\n";
    let mut first_connection = TcpStream::connect("127.0.0.1:80").unwrap();
    first_connection.set_nonblocking(true).unwrap();
    first_connection.write_all(req.as_bytes()).unwrap();

    let mut second_connection = TcpStream::connect("127.0.0.1:80").unwrap();
    second_connection.set_nonblocking(true).unwrap();
    second_connection.write_all(req.as_bytes()).unwrap();

    let mut first_buf = vec![0; 4096];
    let mut first_bytes_read = 0;
    let mut second_buf = vec![0; 4096];
    let mut second_bytes_read = 0;

    loop {
        let mut first_complete = false;
        let mut second_complete = false;
        if !first_complete {
            match read_data(&mut first_connection, &mut first_buf, first_bytes_read) {
                Ok((bytes_read, false)) => {
                    first_bytes_read = bytes_read;
                }
                Ok((bytes_read, true)) => {
                    println!("First connection completed");
                    if bytes_read != 0 {
                        parse_data(&first_buf, bytes_read);
                    }
                    first_complete = true;
                }
                Err(e) => {
                    println!("First connection error: {}", e);
                    first_complete = true;
                }
            }
        }
        if !second_complete {
            match read_data(&mut second_connection, &mut second_buf, second_bytes_read) {
                Ok((bytes_read, false)) => {
                    second_bytes_read = bytes_read;
                }
                Ok((bytes_read, true)) => {
                    println!("Second connection completed");
                    if bytes_read != 0 {
                        parse_data(&second_buf, bytes_read);
                    }
                    second_complete = true;
                }
                Err(e) => {
                    println!("Second connection error: {}", e);
                    second_complete = true;
                }
            }
        }
        if first_complete && second_complete {
            break;
        }
    }
}
```
