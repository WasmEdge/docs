---
sidebar_position: 1
---

# WasmEdge Go SDK Introduction

The following is the guide to working with the WasmEdge Go API. You can embed the WasmEdge into your go application through the WasmEdge Go API.

## Set up Environment for embedding WASM functions into your go application

### Install and build WasmEdge and WasmEdge Go SDK

The WasmEdge-go requires Golang version >= 1.16. Please check your Golang version before installation. You can [download Golang here](https://golang.org/dl/).

```bash
$ go version
go version go1.16.5 linux/amd64
```

Meanwhile, please ensure you have installed [WasmEdge](../../start/install.md#install) with the same `WasmEdge-go` release version.

```bash
curl -sSf https://raw.githubusercontent.com/WasmEdge/WasmEdge/master/utils/install.sh | bash -s -- -v {{ wasmedge_version }}
```

Install the `WasmEdge-go` package and build in your Go project directory:

```bash
go get github.com/second-state/WasmEdge-go/wasmedge@v{{ wasmedge_version }}
go build
```

### Build WasmEdge-go Extensions

<!-- prettier-ignore -->
:::note
The WasmEdge extensions have been deprecated after the 0.12.1 version. Please use the corresponding plug-ins after the 0.13.0 version.
:::

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

### Toolchain for Compile the Source Code to WASM Bytecode

To embed WasmEdge into your go application and run the WASM function, we still need language toolchain to compile the source code to WASM bytecode.

- For Rust, please refer to [the Rust setup guide](../../develop/rust/setup.md)

- For Tinygo, please refer to [the Tinygo setup guide](../../develop/go/hello_world.md)

- For C, please refer to [the C setup guide](../../develop/c/hello_world.md)

- For Javascript, you need the [WasmEdge-QuickJS](https://github.com/second-state/wasmedge-quickjs) into your Go application. See a community example [here](https://github.com/Edgenesis/wasm-shifu-demo).

## Examples

- [Embed a standalone WASM app](app.md)
- [Embed a WASM function](function.md)
- [Pass complex parameters to WASM functions](passing_data.md)
- [Embed a Tensorflow inference function](ai.md)
- [Embed a bindgen function](bindgen.md)

## API References

- [v0.13.4](reference/latest.md)
- [v0.12.1](reference/0.12.x.md)
- [v0.11.2](reference/0.11.x.md)
- [v0.10.1](reference/0.10.x.md)
- [v0.9.1](reference/0.9.x.md)
