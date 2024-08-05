---
sidebar_position: 1
---

# Set up Rust toolchain

In the following chapters, we will show how to build and compile Rust programs into WASM bytecode and then run them in WasmEdge.

Before we start, let's set up the software we need.

## Install WasmEdge

Use the following command line to install WasmEdge on your machine. If you use Windows or other non-Unix-like platforms, please refer to the [WasmEdge installation](../../start/install.md#install).

```bash
curl -sSf https://raw.githubusercontent.com/WasmEdge/WasmEdge/master/utils/install.sh | bash
```

## Install Rust

Use the following command line to install Rust on your machine. If you use Windows or other non-Unix-like platforms, please refer to the [Rust installation instruction](https://www.rust-lang.org/tools/install).

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

## Set up the Rust compiler's target

To build a WASM file running in server-side WebAssembly like WasmEdge, we need to add the `wasm32-wasi` target for the Rust compiler after Rust is installed.

```bash
rustup target add wasm32-wasi
```

## Special notes for networking apps

### Tokio support

WasmEdge supports async networking APIs provided by [Tokio](https://tokio.rs/) and related crates. If you have tokio in your `Cargo.toml`, you
need to add a few config flags to help the Rust compiler choose the correct feature branches in the library source code. Here is an example of `cargo build` command for compiling a tokio app to Wasm.

```bash
RUSTFLAGS="--cfg wasmedge --cfg tokio_unstable" cargo build --target wasm32-wasi --release
```

Alternatively, you could add these lines to the `.cargo/config.toml` file.

```toml
[build]
target = "wasm32-wasi"
rustflags = ["--cfg", "wasmedge", "--cfg", "tokio_unstable"]
```

Once you have these lines in `.cargo/config.toml`, you can simply use the regular `cargo` command.

```
cargo build --target wasm32-wasi --release
```

### TLS on MacOS

The standard `cargo` toolchain can support the [Rust TLS](https://github.com/rustls/rustls) library on Linux. However,
on MacOS, you need a special version of the Clang tool, released from the official [wasi-sdk](https://github.com/WebAssembly/wasi-sdk), in order to support TLS libraries.

> When you compile Rust TLS source code to Wasm on Linux, the result Wasm file is cross-platform and can run correctly on any platform with WasmEdge installed. This section is only applicable when you need to **compile** Rust TLS source code on MacOS.

[Download the latest wasi-sdk release](https://github.com/WebAssembly/wasi-sdk/releases) for your platform and
expand it into a directory. Point the `WASI_SDK_PATH` variable to this directory and export a `CC` variable for the default Clang.

```bash
export WASI_SDK_PATH /path/to/wasi-sdk-22.0
export CC="${WASI_SDK_PATH}/bin/clang --sysroot=${WASI_SDK_PATH}/share/wasi-sysroot"
```

That's it. Now you can use the `cargo` tools on MacOS to compile tokio libraries with `rust-tls` feature turned on.
