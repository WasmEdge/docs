---
sidebar_position: 1
---

# 1 Quick Start

## Installation

To embed WasmEdge into your host app, you need to install WasmEdge itself and the corresponding WasmEdge's language bindings. 

In this Quick Start guide, we use WasmEdge Go SDK as an example to show how it works. Specially, we will use [a bindgen function](https://github.com/second-state/WasmEdge-go-examples/tree/master/go_BindgenFuncs) in rust to demonstrate how to call a few simple WebAssembly functions from a Go app.

Before we start, make sure you have installed WasmEdge and WasmEdge Go SDK. They should be in the same version.

```
# [Install Go first](https://go.dev/dl/). The Golang version should be above 1.16.
$ go version
go version go1.16.5 linux/amd64

# Install WasmEdge
$ curl -sSf https://raw.githubusercontent.com/WasmEdge/WasmEdge/master/utils/install.sh | bash -s -- -v 0.11.2

# Install WasmEdge-Go
$ go get github.com/second-state/WasmEdge-go/wasmedge@v0.11.2
$ go build
```
> For more advanced features like AI inference, please refer to XYZ Chapter.

Since the demo app is written in Rust, we also need to install Rust.

```
# Install Rust
$ curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Add wasm32-wasi target
$ rustup target add wasm32-wasi
```

## Run the demo





## Create a Wasm app using Rust 


## Embed the Wasm app into a GO host app