---
sidebar_position: 3
---

# wasm-nginx-module

wasm-nginx-module 是以 OpenResty 為基礎建構的 Nginx 模組。透過實作 [Proxy-WASM ABI](https://github.com/proxy-wasm/spec)，任何使用 Proxy WASM SDK 撰寫的 WASM 程式都可以在其中執行。因此，您可以用 Go 或 Rust 撰寫程式碼，編譯成 Wasm，然後在 Nginx 中載入並執行它。

> wasm-nginx-module 已經在 APISIX 中被使用，使其能 [像 Lua 外掛一樣執行 WASM 外掛](https://github.com/apache/apisix/blob/master/docs/en/latest/wasm.md)。

要跟著本章的教學進行，您需要先 [建置包含 wasm-nginx-module 的 Nginx，並將 WasmEdge 共享函式庫安裝在正確路徑](https://github.com/api7/wasm-nginx-module#install-dependencies)。

當您安裝好 Nginx 後，讓我展示一個實際的範例 - 使用 WASM 在 Nginx 中注入自訂回應。

## 透過 Go 在 Nginx 中注入自訂回應，逐步教學

### Go 步驟 1：根據 proxy-wasm-go-sdk 撰寫程式碼

實作的程式碼（包含 `go.mod` 及其他檔案）可以在 [這裡](https://github.com/apache/apisix/tree/master/t/wasm) 找到。

需要說明的是，雖然 proxy-wasm-go-sdk 專案掛著 Go 之名，但實際上使用的是 tinygo 而非原生的 Go，在支援 WASI 上有些問題（您可以將 WASI 理解為非瀏覽器的 WASM 執行環境介面）。詳細資訊請參閱 [此處](https://github.com/tetratelabs/proxy-wasm-go-sdk/blob/main/doc/OVERVIEW.md#tinygo-vs-the-official-go-compiler)。

我們也提供了 Rust 版本（包含 Cargo.toml 與其他檔案）於 [那裡](https://github.com/api7/wasm-nginx-module/tree/main/t/testdata/rust/fault-injection)。

### Go 步驟 2：建置對應的 WASM 檔案

```shell
tinygo build -o ./fault-injection/main.go.wasm -scheduler=none -target=wasi ./fault-injection/main.go
```

### Go 步驟 3：載入並執行 WASM 檔案

接著，使用以下設定啟動 Nginx：

```conf
worker_processes  1;

error_log  /tmp/error.log warn;

events {
    worker_connections  10240;
}

http {
    wasm_vm wasmedge;
    init_by_lua_block {
        local wasm = require("resty.proxy-wasm")
        package.loaded.plugin = assert(wasm.load("fault_injection",
            "/path/to/fault-injection/main.go.wasm"))
    }
    server {
        listen 1980;
        location / {
            content_by_lua_block {
                local wasm = require("resty.proxy-wasm")
                local ctx = assert(wasm.on_configure(package.loaded.plugin,
                    '{"http_status": 403, "body": "powered by wasm-nginx-module"}'))
                assert(wasm.on_http_request_headers(ctx))
            }
        }
    }
}
```

此設定會載入我們剛建置的 WASM 檔案，並以 `{"http_status": 403, "body": "powered by wasm-nginx-module"}` 這個設定來執行它。

### Go 步驟 4：驗證結果

Nginx 啟動後，我們可以使用 `curl http://127.0.0.1:1980/ -i` 來驗證 Wasm 的執行結果。

預期會看到以下輸出：

```bash
HTTP/1.1 403 Forbidden
...

powered by wasm-nginx-module
```

## 透過 Rust 在 Nginx 中注入自訂回應，逐步教學

### Rust 步驟 1：根據 proxy-wasm-rust-sdk 撰寫程式碼

我們也提供了 Rust 版本（包含 Cargo.toml 與其他檔案）於 [此處](https://github.com/api7/wasm-nginx-module/tree/main/t/testdata/rust/fault-injection)。

### Rust 步驟 2：建置對應的 WASM 檔案

```shell
cargo build --target=wasm32-wasip1
```

### Rust 步驟 3：載入並執行 WASM 檔案

接著，使用以下設定啟動 Nginx：

```conf
worker_processes  1;

error_log  /tmp/error.log warn;

events {
    worker_connections  10240;
}

http {
    wasm_vm wasmedge;
    init_by_lua_block {
        local wasm = require("resty.proxy-wasm")
        package.loaded.plugin = assert(wasm.load("fault_injection",
            "/path/to/fault-injection/target/wasm32-wasip1/debug/fault_injection.wasm"))
    }
    server {
        listen 1980;
        location / {
            content_by_lua_block {
                local wasm = require("resty.proxy-wasm")
                local ctx = assert(wasm.on_configure(package.loaded.plugin,
                    '{"http_status": 403, "body": "powered by wasm-nginx-module"}'))
                assert(wasm.on_http_request_headers(ctx))
            }
        }
    }
}
```

此設定會載入我們剛建置的 WASM 檔案，並以 `{"http_status": 403, "body": "powered by wasm-nginx-module"}` 這個設定來執行它。

### Rust 步驟 4：驗證結果

Nginx 啟動後，我們可以使用 `curl http://127.0.0.1:1980/ -i` 來驗證 Wasm 的執行結果。

預期會看到以下輸出：

```bash
HTTP/1.1 403 Forbidden
...

powered by wasm-nginx-module
```
