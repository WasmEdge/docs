---
sidebar_position: 1
---

# 5.1 WasmEdge Rust SDK

## Overview

WasmEdge Rust SDK consists of four crates. In the diagram below, the blue rectangles represent the crates, and the arrows show the dependency relation.

<div align=center>
  <img src="image/arch-rust-sdk.jpg" width=50%/>
</div>

- `wasmedge-sdk` crate defines a group of safe, ergonomic high-level APIs, which are used by developers to build up their own business applications.

- `wasmedge-sys` crate is a wrapper of WasmEdge C-API and provides the safe counterparts. It is not recommended to use it directly by application developers. `wasmedge-sys`, `wasmedge-types` and `wasmedge-macro` constitute the low-level layer of WasmEdge Rust SDK.

- `wasmedge-types` crate defines the data structures that are commonly used in `wasmedge-sdk` and `wasmedge-sys`.

- `wasmedge-macro` crate defines the macros that are commonly used in `wasmedge-sdk` and `wasmedge-sys` to declare [host functions](https://webassembly.github.io/spec/core/exec/runtime.html#:~:text=A%20host%20function%20is%20a,a%20module%20as%20an%20import.).

## Usage

> Notice that the correct version of WasmEdge library should be installed in your local environment in advance. The [versioning table](https://crates.io/crates/wasmedge-sdk) below provides the version information.

To use `wasmedge-sdk` in your project, follow the steps below to get ready:

- Deploy WasmEdge library in your local environment.

  Refer to the [Quick Install](https://wasmedge.org/book/en/quick_start/install.html#quick-install) to install WasmEdge library. Or, run the following command directly to install WasmEdge library. Here, we take `WasmEdge v0.12.0` as an example.

  ```bash
  // install WasmEdge-0.12.0 to /usr/local
  curl -sSf https://raw.githubusercontent.com/WasmEdge/WasmEdge/master/utils/install.sh | bash -s -- -p /usr/local -v 0.12.0
  ```

- Add `wasmedge-sdk` crate to your `Cargo.toml` file. Note that, according to the version table, the version of `wasmedge-sdk` matching `WasmEdge v0.12.0` is `0.8.0`.

  ```toml
  wasmedge-sdk = "0.8.0"
  ```

## Examples

[wasmedge-rustsdk-examples](https://github.com/second-state/wasmedge-rustsdk-examples/tree/main) provides a set of examples to demonstrate how to use `wasmedge-sdk` to, for example, create host functions, create WebAssembly libraries, create plugins, and etc.
