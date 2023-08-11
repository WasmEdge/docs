---
sidebar_position: 1
---

# Install Notes

To use a kind of WasmEdge language SDK, you must install WasmEdge itself first. Please be noted, he version of WasmEdge's language SDKs should be the same as the version of WasmEdge. For example, If you want to use WasmEdge Go SDK v{{ wasmedge_version }}, then your WasmEdge version must be {{ wasmedge_version }} as well.

<!-- prettier-ignore -->
:::note
The releases of WasmEdge language SDKs follow the official version of WasmEdge. We don't release the alpha, beta, and RC versions for WasmEdge language SDKs. For the WasmEdge release process, please check [here](../../contribute/release.md).
:::

## Install WasmEdge GO SDK as an example

Let's take WasmEdge Go SDK as an example to show how to embed a WASM App in Rust to a Go Host application.

First, ensure you have installed [Go](https://go.dev/dl/) first. The Golang version should be above 1.16.

Next, let's install WasmEdge and WasmEdge Go SDK. Again, The WasmEdge and WasmEdge Go SDK should be the same version.

```bash
$ go version
go version go1.16.5 linux/amd64

# Install WasmEdge
$ curl -sSf https://raw.githubusercontent.com/WasmEdge/WasmEdge/master/utils/install.sh | bash -s -- -v {{ wasmedge_version }}

# Install WasmEdge-Go
$ go get github.com/second-state/WasmEdge-go/wasmedge@v{{ wasmedge_version }}
```

Now we have set up WasmEdge and WasmEdge Go SDK. Next, let's see how to create a WASM app using Rust and wasmedge-bindgen.

To embed WasmEdge into your host app, you must install WasmEdge itself and its corresponding WasmEdge's language bindings.

In this Quick Start guide, we use WasmEdge Go SDK as an example to show how it works. Primarily, we will use [a bindgen function](https://github.com/second-state/WasmEdge-go-examples/tree/master/wasmedge-bindgen/go_BindgenFuncs) in rust to demonstrate how to call a few simple WebAssembly functions from a Go app.

Before we start, ensure you have installed [Go first](https://go.dev/dl/). The Golang version should be above 1.16.

First, let's install WasmEdge and WasmEdge Go SDK. **They should be in the same version**.

```bash
$ go version
go version go1.16.5 linux/amd64

# Install WasmEdge
$ curl -sSf https://raw.githubusercontent.com/WasmEdge/WasmEdge/master/utils/install.sh | bash -s -- -v {{ wasmedge_version }}

# Install WasmEdge-Go
$ go get github.com/second-state/WasmEdge-go/wasmedge@v{{ wasmedge_version }}

# Install the WasmEdge-bindgen tool, which helps us handle complex data passing
$ go get github.com/second-state/wasmedge-bindgen@v0.4.1
```

<!-- prettier-ignore -->
:::note
For more advanced features like AI inference, please refer to [Go SDK For Embedding WASM Function Chapter](/category/go-sdk-for-embedding-wasmedge).
:::

Since the demo app includes [a compiled WASM file](https://github.com/second-state/WasmEdge-go-examples/blob/master/wasmedge-bindgen/go_BindgenFuncs/rust_bindgen_funcs_lib.wasm) from [the Rust function](https://github.com/second-state/WasmEdge-go-examples/tree/master/wasmedge-bindgen/go_BindgenFuncs/rust_bindgen_funcs), so we don't need to install the Rust toolchain to compile the Rust code to wasm.

## Run the demo

Now we have set up the basic environment, let's run the example.

```bash
# Get the source code of this example
$ git clone https://github.com/second-state/WasmEdge-go-examples.git
$ cd WasmEdge-go-examples//wasmedge-bindgen/go_BindgenFuncs/

# build the project
go build

# run the example
./bindgen_funcs rust_bindgen_funcs_lib.wasm
```

The standard output of this example will be the following:

```bash
Run bindgen -- create_line: {"points":[{"x":2.5,"y":7.8},{"x":2.5,"y":5.8}],"valid":true,"length":2.0,"desc":"A thin red line"}
Run bindgen -- say: hello bindgen funcs test
Run bindgen -- obfusticate: N dhvpx oebja sbk whzcf bire gur ynml qbt
Run bindgen -- lowest_common_multiple: 246
Run bindgen -- sha3_digest: [87 27 231 209 189 105 251 49 159 10 211 250 15 159 154 181 43 218 26 141 56 199 25 45 60 10 20 163 54 211 195 203]
Run bindgen -- keccak_digest: [126 194 241 200 151 116 227 33 216 99 159 22 107 3 177 169 216 191 114 156 174 193 32 159 246 228 245 133 52 75 55 27]
```

## Achieve higher performance

Use the following command line if you want to get better performance.

```bash
# Use the AoT mode
wasmedgec rust_bindgen_funcs_lib.wasm rust_bindgen_funcs_lib.wasm

# Run the demo
./bindgen_funcs rust_bindgen_funcs_lib.wasm
```

That's it. Let's dive into [more examples with WasmEdge Go SDK](/category/go-sdk-for-embedding-wasmedge).
