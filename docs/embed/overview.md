---
sidebar_position: 1
displayed_sidebar: embedSidebar
---

# Embed Wasm Functions in Your Apps

As we mentioned before, the most important use case for WasmEdge is to safely execute user-defined or community-contributed code as plug-ins in a software product. It enables third-party developers, vendors, suppliers, and community members to extend and customize the software product.

We could use WasmEdge as a standalone container and deploy WasmEdge using the existing containers tools. The other way is to use WasmEdge as an embedded runtime and manage WasmEdge using the host applications.

WasmEdge provides SDKs for various programming languages. The WasmEdge library allows developers to embed the WasmEdge into their host applications, so that the WebAssembly applications can be executed in the WasmEdge sandbox safely. Furthermore, developers can implement the host functions for the extensions with the WasmEdge library.

![Embeded architecture](embed_arch.png)

In this section, we will walk you through how to embed WasmEdge in different languages. We will cover the following content:

- [Quick Start](../category/quick-start)
- [Passing complex data](../category/passing-complex-data)
- [Developing components using witc](./witc)
- [Embed WasmEdge in C/C++](../category/c-sdk-for-embedding-wasm-functions)
- [Embed WasmEdge in Rust](../category/rust-sdk-for-embedding-wasm-functions)
- [Embed WasmEdge in Go](../category/go-sdk-for-embedding-wasm-functions)
- [Embed WasmEdge in Java](../category/java-sdk-for-embedding-wasm-functions)
- [Embed WasmEdge in Python](../category/python-sdk-for-embedding-wasm-functions)
- [Use cases](../category/use-cases)

Besides this, we also have two more guides for [developing Wasm apps](/develop/overview) and [contributing to WasmEdge](/contribute/overview).

If you find some issues or have any feedback, you could reach out to us via the following ways.

- [Discord Chat](https://discord.gg/U4B5sFTkFc)
- [Create a GitHub issue for technical support](https://github.com/WasmEdge/WasmEdge/issues)
- [Submit a GitHub discussion](https://github.com/WasmEdge/WasmEdge/discussions)
- [Follow @realwasmedge on Twitter](https://twitter.com/realwasmedge)
