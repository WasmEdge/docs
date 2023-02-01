---
sidebar_position: 1
---

# 1 Quick Start with the WasmEdge Go SDK

## Installation

To embed WasmEdge into your host app, you need to install WasmEdge itself and the corresponding WasmEdge's language bindings. 

In this Quick Start guide, we use WasmEdge Go SDK as an example to show how it works. Specially, we will use [a bindgen function](https://github.com/second-state/WasmEdge-go-examples/tree/master/wasmedge-bindgen/go_BindgenFuncs) in rust to demonstrate how to call a few simple WebAssembly functions from a Go app.

Before we start, make sure you have installed [Go first](https://go.dev/dl/). The Golang version should be above 1.16.

First, let's install WasmEdge and WasmEdge Go SDK. They should be in the same version.

```
$ go version
go version go1.16.5 linux/amd64

# Install WasmEdge
$ curl -sSf https://raw.githubusercontent.com/WasmEdge/WasmEdge/master/utils/install.sh | bash -s -- -v 0.11.2

# Install WasmEdge-Go
$ go get github.com/second-state/WasmEdge-go/wasmedge@v0.11.2

# Install the WasmEdge-bindgen tool, which help us handle complex data passing
$ go get github.com/second-state/wasmedge-bindgen@v0.4.1
```
> For more advanced features like AI inference, please refer to XYZ Chapter.

Since the demo app includes [a compiled Wasm file](https://github.com/second-state/WasmEdge-go-examples/blob/master/wasmedge-bindgen/go_BindgenFuncs/rust_bindgen_funcs_lib.wasm) from [the Rust function](https://github.com/second-state/WasmEdge-go-examples/tree/master/wasmedge-bindgen/go_BindgenFuncs/rust_bindgen_funcs), so we don't need to install the Rust toolchain to compile the Rust code to wasm.

## Run the demo

Now we have set up the basic environment, let's run the example.

```
# Get the source code of this example
$ git clone https://github.com/second-state/WasmEdge-go-examples.git
$ cd WasmEdge-go-examples//wasmedge-bindgen/go_BindgenFuncs/

# build the project
$ go build

# run the example
$ ./bindgen_funcs rust_bindgen_funcs_lib.wasm
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

Use the following command line, if you want to get better performance.

```bash
# Use the AoT mode
wasmedgec rust_bindgen_funcs_lib.wasm rust_bindgen_funcs_lib.wasm

# Run the demo
./bindgen_funcs rust_bindgen_funcs_lib.wasm
```

That's it.  Let's dive into more examples.