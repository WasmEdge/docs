---
sidebar_position: 1
---

# Socket client

It is possible for WasmEdge applications to open TCP/IP or UDP network sockets in the host system to communicate directly with external applications. One of the key features of WasmEdge is that it supports non-blocking sockets. That allows even a single-threaded WASM application to handle concurrent network requests. For example, while the program is waiting for data to stream in from one connection, it can start or handle another connection. The [wasmedge_wasi_socket](https://github.com/second-state/wasmedge_wasi_socket) crate enables Rust developers to work on the network socket level.

In this chapter, we will show you how to build HTTP clients on TCP sockets. The reason is that the HTTP protocol is relatively simple and could be demonstrated easily. If you use HTTP clients in production, we recommend checking out the [HTTP client](../http_service/client.md) chapter in this book.

- [A simple HTTP client based on TCP sockets](#a-simple-http-client)
- [A non-blocking HTTP client based on TCP sockets](#a-non-blocking-http-client-example)

<!-- prettier-ignore -->
:::note
Before we start, ensure [you have Rust and WasmEdge installed](../setup.md).
:::

## A Simple HTTP Client

You can build and run [the example](https://github.com/second-state/wasmedge_wasi_socket/tree/main/examples/http_client) in WasmEdge as follows.

```bash
git clone https://github.com/second-state/wasmedge_wasi_socket.git
cd wasmedge_wasi_socket/http_client/

# Build the Rust Code
cargo build --target wasm32-wasi --release
# Use the AoT compiler to get better performance
wasmedge compile target/wasm32-wasi/release/http_client.wasm http_client.wasm

# Run the example
wasmedge http_client.wasm
```

The [source code](https://github.com/second-state/wasmedge_wasi_socket/tree/main/examples/http_client) for the HTTP client is available as follows.

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

## A non-blocking HTTP client example

You can build and run [the example](https://github.com/second-state/wasmedge_wasi_socket/tree/main/examples/nonblock_http_client) in WasmEdge as follows.

```bash
git clone https://github.com/second-state/wasmedge_wasi_socket
cd wasmedge_wasi_socket/nonblock_http_client/

# Build the Rust Code
cargo build --target wasm32-wasi --release
# Use the AoT compiler for better performance
wasmedge compile target/wasm32-wasi/release/nonblock_http_client.wasm nonblock_http_client.wasm

# Run the example
wasmedge nonblock_http_client.wasm
```

<!-- prettier-ignore -->
:::note
Non-blocking I/O means that the application program can keep multiple connections open simultaneously, and process data in and out of those connections as they come in. The program can either alternatingly poll those open connections or wait for incoming data to trigger async functions. That allows I/O intensive programs to run faster, even in a single-threaded environment.
:::

The [source code](https://github.com/second-state/wasmedge_wasi_socket/tree/main/examples/nonblock_http_client) for a non-blocking HTTP client application is available. The following `main()` function starts two HTTP connections. The program keeps both connections open and alternatingly checks for incoming data. In other words, the two connections are not blocking each other. Their data are handled concurrently (or alternatingly) as the data comes in.

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
