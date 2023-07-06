---
sidebar_position: 1
displayed_sidebar: developSidebar
---

# Develop Wasm Apps

WasmEdge is a lightweight, high-performance, and extensible WebAssembly runtime for cloud native, edge, and decentralized applications. It powers serverless apps, embedded functions, microservices, udf, smart contracts, and IoT devices. WasmEdge is currently a CNCF (Cloud Native Computing Foundation) Sandbox project.

The WasmEdge Runtime provides a well-defined execution sandbox for its contained WebAssembly bytecode program. The runtime offers isolation and protection for operating system resources (e.g., file system, sockets, environment variables, processes) and memory space. The most important use case for WasmEdge is to safely execute user-defined or community-contributed code as plug-ins in a software product (e.g., SaaS, database, edge nodes, or even blockchain nodes). It enables third-party developers, vendors, suppliers, and community members to extend and customize the software product.

In this part, we will walk you through what is WasmEdge and how to develop Wasm applications in different languages.

We will cover the following content:

- [Getting Started](/category/getting-started-with-wasmEdge)
- Introduce the [WasmEdge Runtime](/category/what-is-wasmedge)
- [Building and running WasmEdge apps](/category/building-and-running-wasmedge-apps)
- Develop WebAssembly apps from your programming languages from [Rust](/category/develop-wasm-apps-in-rust), [C/C++](/category/develop-wasm-apps-in-cc), [JavaScript](/category/develop-wasm-apps-in-javascript), [Go](/category/develop-wasm-apps-in-go), and many other languages.
- [Deploy Wasm Apps with the existing container toolings](/category/deploy-wasmedge-apps-in-kubernetes)

# Write a WebAssembly Application

A key value proposition of WebAssembly is that it supports multiple programming languages. WebAssembly is a "managed runtime" for many programming languages including [C/C++](/category/develop-wasm-apps-in-cc), [Rust](/category/develop-wasm-apps-in-rust), [Go](/category/develop-wasm-apps-in-go), and even [JavaScript](/category/develop-wasm-apps-in-javascript) and [Python](/category/develop-wasm-apps-in-python).

- For compiled languages (e.g., C and Rust), WasmEdge WebAssembly provides a safe, secure, isolated, and containerized runtime as opposed to Native Client (NaCl).
- For interpreted or managed languages (e.g., JavaScript and Python), WasmEdge WebAssembly provides a secure, fast, lightweight, and containerized runtime as opposed to Docker + guest OS + native interpreter.

In this chapter, we will discuss how to compile sources into WebAssembly in different languages and run them in WasmEdge.

Besides this, we also have two more guides for [Embedding Wasm Functions](/embed/overview) and [Contributing](/contribute/overview) to WasmEdge.

If you find some issues or have any feedback, you could reach out to us via the following ways.

- [Discord Chat](https://discord.gg/U4B5sFTkFc)
- [Create a GitHub issue for technical support](https://github.com/WasmEdge/WasmEdge/issues)
- [Submit a GitHub discussion](https://github.com/WasmEdge/WasmEdge/discussions)
- [Follow @realwasmedge on Twitter](https://twitter.com/realwasmedge)

