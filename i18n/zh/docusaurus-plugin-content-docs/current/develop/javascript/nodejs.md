---
sidebar_position: 5
---

# Node.js support

Many existing JavaScript apps use Node.js built-in APIs. To support and reuse these JavaScript apps, we are implementing many Node.JS APIs for WasmEdge QuickJS. The goal is to have unmodified Node.js programs running in WasmEdge QuickJS.

To use Node.js APIs in WasmEdge, you must make the `modules` directory from [wasmedge-quickjs](https://github.com/second-state/wasmedge-quickjs) accessible to the WasmEdge Runtime. The most straightforward approach is to clone the [wasmedge-quickjs](https://github.com/second-state/wasmedge-quickjs) repo and run the Node.js app from the repo's top directory.

```bash
# Clone the wasmedge-quickjs
git clone https://github.com/second-state/wasmedge-quickjs
# Use the wasmedge-quickjs directory as the working directory for modules access
cd wasmedge-quickjs
# Download a released WasmEdge QuickJS runtime
curl -OL https://github.com/second-state/wasmedge-quickjs/releases/download/v0.5.0-alpha/wasmedge_quickjs.wasm
# Copy the nodejs project to the current working directory and run the nodejs app
cp -r /path/to/my_node_app .
wasmedge --dir .:. wasmedge_quickjs.wasm my_node_app/index.js
```

<!-- prettier-ignore -->
:::note
If you want to run `wasmedge` from a directory outside the repo, you will need to tell it where to find the `modules` directory using the `--dir` option. A typical command will look like this: `wasmedge --dir .:. --dir ./modules:/path/to/modules wasmedge_quickjs.wasm app.js`
:::

The progress of Node.js support in WasmEdge QuickJS is **[tracked in this issue](https://github.com/WasmEdge/WasmEdge/issues/1535).** There are two approaches for supporting Node.js APIs in WasmEdge QuickJS.

## The JavaScript modules

Some Node.js functions can be implemented in pure JavaScript using the [modules](modules) approach. For example,

- The [querystring](https://github.com/second-state/wasmedge-quickjs/blob/main/modules/querystring.js) functions just perform string manipulations.
- The [buffer](https://github.com/second-state/wasmedge-quickjs/blob/main/modules/buffer.js) functions manage and encode arrays and memory structures.
- The [encoding](https://github.com/second-state/wasmedge-quickjs/blob/main/modules/encoding.js) and [http](https://github.com/second-state/wasmedge-quickjs/blob/main/modules/http.js) functions support corresponding Node.js APIs by wrapping around [Rust internal modules](rust).

## The Rust internal modules

Other Node.js functions must be implemented using the [internal_module](rust) approach in Rust. There are two reasons for that. First, some Node.js API functions are CPU intensive (e.g., encoding) and is most efficiently implemented in Rust. Second, some Node.js API functions require access to the underlying system (e.g., networking and file system) through native host functions.

- The [core](https://github.com/second-state/wasmedge-quickjs/blob/main/src/internal_module/core.rs) module provides OS-level functions such as `timeout`.
- The [encoding](https://github.com/second-state/wasmedge-quickjs/blob/main/src/internal_module/encoding.rs) module provides high-performance encoding and decoding functions, which are in turn [wrapped into Node.js encoding APIs](https://github.com/second-state/wasmedge-quickjs/blob/main/modules/encoding.js).
- The [wasi_net_module](https://github.com/second-state/wasmedge-quickjs/blob/main/src/internal_module/wasi_net_module.rs) provides JavaScript networking functions implemented via the Rust-based WasmEdge WASI socket API. It is then wrapped into the [Node.js http module](https://github.com/second-state/wasmedge-quickjs/blob/main/modules/http.js).

Node.js compatibility support in WasmEdge QuickJS is a work in progress. It is an excellent way for new developers to get familiar with WasmEdge QuickJS. Join us!
