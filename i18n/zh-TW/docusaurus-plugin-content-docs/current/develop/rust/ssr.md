---
sidebar_position: 12
---

# 伺服器端渲染

前端網頁框架讓開發者能以高階語言與元件模型來建立網頁應用程式。網頁應用程式會建置為靜態網站，再於瀏覽器中渲染。雖然許多前端網頁框架（例如 React 與 Vue）以 JavaScript 為基礎，但隨著 Rust 語言在開發者間獲得更多關注，以 Rust 為基礎的框架也開始出現。這些網頁框架透過從 Rust 原始碼編譯而成的 WebAssembly 來渲染 HTML DOM UI，並使用 [wasm-bindgen](https://github.com/rustwasm/wasm-bindgen) 將 Rust 與 HTML DOM 串接起來。雖然這些框架是將 `.wasm` 檔案傳送至瀏覽器以便在用戶端渲染 UI，但有些框架提供了額外的選項 — [伺服器端渲染](https://en.wikipedia.org/wiki/Server-side_scripting)。也就是在伺服器上執行 WebAssembly 程式碼、建構 HTML DOM UI，並將 HTML 內容串流到瀏覽器，以便在較慢的裝置與網路上獲得更快的效能與啟動時間。

<!-- prettier-ignore -->
:::note
如果您對以 JavaScript 為基礎的 Jamstack 與 SSR 框架（例如 React）有興趣，請[查閱我們的 JavaScript SSR 章節](../javascript/ssr.md)。
:::

本文將探討如何使用 WasmEdge 在伺服器上渲染網頁 UI。我們選擇 [Percy](https://github.com/chinedufn/percy) 作為框架，因為它在 SSR 與 [Hydration](<https://en.wikipedia.org/wiki/Hydration_(web_development)>) 方面相對成熟。Percy 已經提供了一個 SSR 的[範例](https://github.com/chinedufn/percy/tree/master/examples/isomorphic)，強烈建議先閱讀它，以了解運作方式。Percy 預設的 SSR 設定會採用原生 Rust 網頁伺服器，將 Rust 程式碼編譯為伺服器的機器原生程式碼。然而，我們需要一個沙箱來在伺服器上代管使用者的應用程式。雖然也可以在 Linux 容器（Docker）內執行原生程式碼，但更為高效（且更為安全）的做法是將編譯後的程式碼放到伺服器上的 WebAssembly VM 中執行，特別是考量到渲染程式碼本來就已經編譯為 WebAssembly。

讓我們一步步在 WasmEdge 伺服器中執行一個 Percy SSR 服務。

假設我們位於 `examples/isomorphic` 資料夾中，於現有的 `server` 旁邊建立一個新的 crate。

```bash
cargo new server-wasmedge
```

您會收到提示要您將新建的 crate 放入 workspace，因此請將下列內容插入 `[workspace]` 的 `members` 中。該檔案為 `../../Cargo.toml`。

```toml
"examples/isomorphic/server-wasmedge"
```

在該檔案開啟的狀態下，於底部加入這兩行：

```toml
[patch.crates-io]
wasm-bindgen = { git = "https://github.com/KernelErr/wasm-bindgen.git", branch = "wasi-compat" }
```

<!-- prettier-ignore -->
:::note
為何我們需要分支版的 `wasm-bindgen`？因為 `wasm-bindgen` 是在瀏覽器中銜接 Rust 與 HTML 的必備黏合層。但在伺服器上，我們需要將 Rust 程式碼建置為 `wasm32-wasip1` 目標，這與 `wasm-bindgen` 不相容。我們的分支版 `wasm-bindgen` 具備條件式設定，能在針對 `wasm32-wasip1` 目標所產生的 `.wasm` 檔案中移除瀏覽器專用程式碼。
:::

接著將 crate 的 `Cargo.toml` 內容替換為下列內容。

```toml
[package]
name = "isomorphic-server-wasmedge"
version = "0.1.0"
edition = "2021"

# See more keys and their definitions at https://doc.rust-lang.org/cargo/reference/manifest.html

[dependencies]
wasmedge_wasi_socket = "0"
querystring = "1.1.0"
parsed = { version = "0.3", features = ["http"] }
anyhow = "1"
serde = { version = "1.0", features = ["derive"] }
isomorphic-app = { path = "../app" }
```

`wasmedge_wasi_socket` crate 是 WasmEdge 的 socket API。此專案仍在開發中。接下來，將 `index.html` 檔案複製到 crate 的根目錄。

```bash
cp server/src/index.html server-wasmedge/src/
```

然後我們建立一些 Rust 程式碼，以便在 WasmEdge 中啟動網頁服務！`main.rs` 程式會監聽請求並透過串流送出回應。

```rust
use std::io::Write;
use wasmedge_wasi_socket::{Shutdown, TcpListener};

mod handler;
mod mime;
mod response;

fn main() {
    let server = TcpListener::bind("127.0.0.1:3000", false).unwrap();
    println!("Server listening on 127.0.0.1:3000");

    // Simple single-thread HTTP server
    // For server with Pool support, see https://github.com/second-state/wasmedge_wasi_socket/tree/main/examples/poll_http_server
    loop {
        let (mut stream, addr) = server.accept(0).unwrap();
        println!("Accepted connection from {}", addr);
        match handler::handle_req(&mut stream, addr) {
            Ok((res, binary)) => {
                let res: String = res.into();
                let bytes = res.as_bytes();
                stream.write_all(bytes).unwrap();
                if let Some(binary) = binary {
                    stream.write_all(&binary).unwrap();
                }
            }
            Err(e) => {
                println!("Error: {:?}", e);
            }
        };
        stream.shutdown(Shutdown::Both).unwrap();
    }
}
```

`handler.rs` 會將接收到的資料解析為路徑與查詢物件，並回傳對應的回應。

```rust
use crate::response;
use anyhow::Result;
use parsed::http::Response;
use std::io::Read;
use wasmedge_wasi_socket::{SocketAddr, TcpStream};

pub fn handle_req(stream: &mut TcpStream, addr: SocketAddr) -> Result<(Response, Option<Vec<u8>>)> {
    let mut buf = [0u8; 1024];
    let mut received_data: Vec<u8> = Vec::new();

    loop {
        let n = stream.read(&mut buf)?;
        received_data.extend_from_slice(&buf[..n]);
        if n < 1024 {
            break;
        }
    }

    let mut bs: parsed::stream::ByteStream = match String::from_utf8(received_data) {
        Ok(s) => s.into(),
        Err(_) => return Ok((response::bad_request(), None)),
    };

    let req = match parsed::http::parse_http_request(&mut bs) {
        Some(req) => req,
        None => return Ok((response::bad_request(), None)),
    };

    println!("{:?} request: {:?} {:?}", addr, req.method, req.path);

    let mut path_split = req.path.split("?");
    let path = path_split.next().unwrap_or("/");
    let query_str = path_split.next().unwrap_or("");
    let query = querystring::querify(&query_str);
    let mut init_count: Option<u32> = None;
    for (k, v) in query {
        if k.eq("init") {
            match v.parse::<u32>() {
                Ok(v) => init_count = Some(v),
                Err(_) => return Ok((response::bad_request(), None)),
            }
        }
    }

    let (res, binary) = if path.starts_with("/static") {
        response::file(&path)
    } else {
        // render page
        response::ssr(&path, init_count)
    }
    .unwrap_or_else(|_| response::internal_error());

    Ok((res, binary))
}
```

`response.rs` 程式會將靜態資源與伺服器端渲染內容封裝成回應物件。對於後者，您可以看到 SSR 發生於 `app.render().to_string()`，並將結果字串透過取代佔位字串的方式置入 HTML 中。

```rust
use crate::mime::MimeType;
use anyhow::Result;
use parsed::http::{Header, Response};
use std::fs::{read};
use std::path::Path;
use isomorphic_app::App;

const HTML_PLACEHOLDER: &str = "#HTML_INSERTED_HERE_BY_SERVER#";
const STATE_PLACEHOLDER: &str = "#INITIAL_STATE_JSON#";

pub fn ssr(path: &str, init: Option<u32>) -> Result<(Response, Option<Vec<u8>>)> {
    let html = format!("{}", include_str!("./index.html"));

    let app = App::new(init.unwrap_or(1001), path.to_string());
    let state = app.store.borrow();

    let html = html.replace(HTML_PLACEHOLDER, &app.render().to_string());
    let html = html.replace(STATE_PLACEHOLDER, &state.to_json());

    Ok((Response {
        protocol: "HTTP/1.0".to_string(),
        code: 200,
        message: "OK".to_string(),
        headers: vec![
            Header {
                name: "content-type".to_string(),
                value: MimeType::from_ext("html").get(),
            },
            Header {
                name: "content-length".to_string(),
                value: html.len().to_string(),
            },
        ],
        content: html.into_bytes(),
    }, None))
}

/// Get raw file content
pub fn file(path: &str) -> Result<(Response, Option<Vec<u8>>)> {
    let path = Path::new(&path);
    if path.exists() {
        let content_type: MimeType = match path.extension() {
            Some(ext) => MimeType::from_ext(ext.to_str().get_or_insert("")),
            None => MimeType::from_ext(""),
        };
        let content = read(path)?;

        Ok((Response {
            protocol: "HTTP/1.0".to_string(),
            code: 200,
            message: "OK".to_string(),
            headers: vec![
                Header {
                    name: "content-type".to_string(),
                    value: content_type.get(),
                },
                Header {
                    name: "content-length".to_string(),
                    value: content.len().to_string(),
                },
            ],
            content: vec![],
        }, Some(content)))
    } else {
        Ok((Response {
            protocol: "HTTP/1.0".to_string(),
            code: 404,
            message: "Not Found".to_string(),
            headers: vec![],
            content: vec![],
        }, None))
    }
}

/// Bad Request
pub fn bad_request() -> Response {
    Response {
        protocol: "HTTP/1.0".to_string(),
        code: 400,
        message: "Bad Request".to_string(),
        headers: vec![],
        content: vec![],
    }
}

/// Internal Server Error
pub fn internal_error() -> (Response, Option<Vec<u8>>) {
    (Response {
        protocol: "HTTP/1.0".to_owned(),
        code: 500,
        message: "Internal Server Error".to_owned(),
        headers: vec![],
        content: vec![],
    }, None)
}
```

`mime.rs` 程式是用於資源副檔名與 Mime 類型之間的對應表。

```rust
pub struct MimeType {
    pub r#type: String,
}

impl MimeType {
    pub fn new(r#type: &str) -> Self {
        MimeType {
            r#type: r#type.to_string(),
        }
    }

    pub fn from_ext(ext: &str) -> Self {
        match ext {
            "html" => MimeType::new("text/html"),
            "css" => MimeType::new("text/css"),
            "map" => MimeType::new("application/json"),
            "js" => MimeType::new("application/javascript"),
            "json" => MimeType::new("application/json"),
            "svg" => MimeType::new("image/svg+xml"),
            "wasm" => MimeType::new("application/wasm"),
            _ => MimeType::new("text/plain"),
        }
    }

    pub fn get(self) -> String {
        self.r#type
    }
}
```

這樣就完成了！現在我們來建置並執行這個網頁應用程式。如果您已經測試過原本的範例，那麼您應該早已建置好用戶端的 WebAssembly。

```bash
cd client
./build-wasm.sh
```

接下來，建置並執行伺服器。

```bash
cd ../server-wasmedge
cargo build --target wasm32-wasip1
OUTPUT_CSS="$(pwd)/../client/build/app.css" wasmedge --dir /static:../client/build ../../../target/wasm32-wasip1/debug/isomorphic-server-wasmedge.wasm
```

開啟瀏覽器並前往 `http://127.0.0.1:3000`，您將會看到此網頁應用程式運作中。

此外，您可以把所有步驟放到殼層指令稿 `../start-wasmedge.sh` 中。

```bash
#!/bin/bash

cd $(dirname $0)

cd ./client

./build-wasm.sh

cd ../server-wasmedge

OUTPUT_CSS="$(pwd)/../client/build/app.css" cargo run -p isomorphic-server-wasmedge
```

將下列內容加入 `.cargo/config.toml` 檔案。

```toml
[build]
target = "wasm32-wasip1"

[target.wasm32-wasip1]
runner = "wasmedge --dir /static:../client/build"
```

之後，只要一個 CLI 命令 `./start-wasmedge.sh` 就會執行所有建置與執行此網頁應用程式的工作！

我們已分支 Percy 儲存庫，並為您準備好一個可直接建置的 [server-wasmedge](https://github.com/second-state/percy/tree/master/examples/isomorphic/server-wasmedge) 範例專案。祝您寫程式愉快！
