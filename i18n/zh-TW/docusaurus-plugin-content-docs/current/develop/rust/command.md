---
sidebar_position: 11
---

# 命令介面

WASI 讓 WebAssembly 程式能夠呼叫主機作業系統中的標準函式庫函式。它透過一種稱為「以能力為基礎的安全性（capability-based security）」的細緻安全模型來達成此目的。當 WebAssembly VM 啟動時，VM 的擁有者可以授予存取主機系統資源的權限。程式無法存取未被明確允許的資源（例如檔案資料夾）。

那麼，為何只局限於標準函式庫函式呢？同樣的方法也可以從 WebAssembly 呼叫任何主機函式。WasmEdge 提供了類似 WASI 的擴充功能，可以存取主機作業系統中的命令列程式。

命令列程式可以：

- 透過命令列參數與 `STDIN` 串流接收輸入。
- 透過 `STDOUT` 串流回傳值與資料。

WasmEdge 的應用程式開發者可以使用我們的 Rust 介面 crate 來存取此項功能。請在 `Cargo.toml` 內加入這個相依性。

```toml
[dependencies]
wasmedge_process_interface = "0.2.1"
```

在 Rust 應用程式中，您現在可以使用此 API 方法為作業系統命令列程式啟動一個新行程，透過 `arg()` 方法或 `STDIN` 傳入參數，並透過 `STDOUT` 接收回傳值。

```rust
let mut cmd = Command::new("http_proxy");

cmd.arg("post")
   .arg("https://api.sendgrid.com/v3/mail/send")
   .arg(auth_header);
cmd.stdin_u8vec(payload.to_string().as_bytes());

let out = cmd.output();
```

接著，您可以將該 Rust 函式編譯為 WebAssembly，並像 [Hello world](hello_world.md) 章節一樣在 WasmEdge 中執行。
