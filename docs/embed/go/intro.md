---
sidebar_position: 1
---

# WasmEdge Go SDK Introduction

The following are the guide to work with the WasmEdge Go API. You can embed the WasmEdge into your go application through the WasmEdge Go API.

## Set up environment for embedding Wasm functions into your go application

### Install and build WasmEdge and WasmEdge Go SDK

The WasmEdge-go requires golang version >= 1.16. Please check your golang version before installation. You can [download golang here](https://golang.org/dl/).

```bash
$ go version
go version go1.16.5 linux/amd64
```

Meantime, please make sure you have installed [WasmEdge](/develop/build-and-run/install) with the same `WasmEdge-go` release version.

```bash
curl -sSf https://raw.githubusercontent.com/WasmEdge/WasmEdge/master/utils/install.sh | bash -s -- -v {{ wasmedge_version }}
```

If you need the `TensorFlow` or `Image` extension for `WasmEdge-go`, please install the `WasmEdge` with extensions:

```bash
curl -sSf https://raw.githubusercontent.com/WasmEdge/WasmEdge/master/utils/install.sh | bash -s -- -v {{ wasmedge_version }} -e tensorflow,image
```

Noticed that the `TensorFlow` and `Image` extensions are only for the `Linux` platforms.

Install the `WasmEdge-go` package and build in your Go project directory:

```bash
go get github.com/second-state/WasmEdge-go/wasmedge@v{{ wasmedge_version }}
go build
```

### Build WasmEdge-go Extensions

By default, the `WasmEdge-go` only turns on the basic runtime.

`WasmEdge-go` has the following extensions:

- TensorFlow

  - This extension supports the host functions in [WasmEdge-tensorflow](https://github.com/second-state/WasmEdge-tensorflow).
  - To install the `tensorflow` extension, please use the `-e tensorflow` flag in the WasmEdge installer command.
  - For using this extension, the tag `tensorflow` when building is required:

    ```bash
    go build -tags tensorflow
    ```

- Image

  - This extension supports the host functions in [WasmEdge-image](https://github.com/second-state/WasmEdge-image).
  - To install the `image` extension, please use the `-e image` flag in the WasmEdge installer command.
  - For using this extension, the tag `image` when building is required:

    ```bash
    go build -tags image
    ```

You can also turn on the multiple extensions when building:

```bash
go build -tags image,tensorflow
```

For examples, please refer to the [example repository](https://github.com/second-state/WasmEdge-go-examples/).

### WasmEdge AOT Compiler in Go

The [go_WasmAOT example](https://github.com/second-state/WasmEdge-go-examples/tree/master/go_WasmAOT) demonstrates how to compile a WASM file into a native binary (AOT compile) from within a Go application.

### toolchain for compile the source code to Wasm bytecode

To embed WasmEdge into your go application and run the Wasm function, we still need language toolchain to compile the source code to Wasm bytecode.

- For Rust, please refer to [the Rust set up guide](/develop/rust/setup)

- For Tinygo, please refer to [the Tinygo set up guide](/develop/go/hello_world)

- For C, please refer to [the C set up guide](/develop/c/hello_world)

- For Javascript, you need to the [WasmEdge-QuickJS](https://github.com/second-state/wasmedge-quickjs) into your Go application. See a community example [here](https://github.com/Edgenesis/wasm-shifu-demo).

## Examples

- [Embed a standalone Wasm app](/embed/go/app)
- [Embed a Wasm function](/embed/go/function)
- [Pass complex parameters to Wasm functions](/embed/go/passing_data)
- [Embed a Tensorflow inference function](/embed/go/ai)
- [Embed a bindgen function](/embed/go/bindgen)

## API References

- [v0.12.0](/embed/go/reference/0.12.0)
- [v0.11.2](/embed/go/reference/0.11.2)
- [v0.10.1](/embed/go/reference/0.10.1)
- [v0.9.1](/embed/go/reference/0.9.1)
