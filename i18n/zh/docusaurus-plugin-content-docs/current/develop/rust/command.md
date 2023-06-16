---
sidebar_position: 10
---

# 命令行接口

WASI使得 WebAssembly 程序可以调用主机操作系统的标准库函数。它通过一种称为“基于能力的安全模型”的细粒度安全机制实现。WebAssembly 虚拟机的所有者可以在虚拟机启动时授予对主机系统资源的访问权限。程序只能访问明确允许的资源（例如文件夹），而无法访问任何未明确允许的资源。

那么，为什么要局限于标准库函数呢？同样的方法可以用于从 WebAssembly 调用任何主机函数。WasmEdge 提供了类似 WASI 的扩展，以访问主机操作系统中的任何命令行程序。

命令行程序可以

- 通过命令行参数以及 STDIN 流接收输入。
- 通过 STDOUT 流返回值和数据。

WasmEdge 应用程序开发人员可以使用我们的 Rust 接口 crate 来访问此功能。在 Cargo.toml 文件中，确保你拥有以下依赖项：

```toml
[dependencies]
rust_process_interface_library = "0.1.3"
```

在 Rust 应用程序中，你可以使用 API 方法启动一个新的进程来执行操作系统命令程序，通过 arg() 方法和 STDIN 传递参数，并通过 STDOUT 接收返回值。

```rust
let mut cmd = Command::new("http_proxy");

cmd.arg("post")
   .arg("https://api.sendgrid.com/v3/mail/send")
   .arg(auth_header);
cmd.stdin_u8vec(payload.to_string().as_bytes());

let out = cmd.output();
```

然后，将 Rust 函数编译为 WebAssembly，并可以在 WasmEdge 中运行，就像 [hello world](hello_world.md) 章节中的示例一样。
