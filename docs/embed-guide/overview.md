---
sidebar_position: 1
displayed_sidebar: embedSidebar
---

# Guide for Embedding Wasm functions

As we mentioned before, the most important use case for WasmEdge is to safely execute user-defined or community-contributed code as plug-ins in a software product. It enables third-party developers, vendors, suppliers, and community members to extend and customize the software product.

We could use WasmEdge as a standalone container and deploy WasmEdge using the existing containers tools. The other way is to use WasmEdge as an embedded runtime and manage WasmEdge using the host applications.

WasmEdge provides SDKs for various programming languages. The WasmEdge library allows developers to embed the WasmEdge into their host applications, so that the WebAssembly applications can be executed in the WasmEdge sandbox safely. Furthermore, developers can implement the host functions for the extensions with the WasmEdge library.

In this section, we will walk you through how to embed WasmEdge in different languages. 

We will cover the following content:

* [Quick Start](../category/quick-start)
* [Passing complex data](../category/passing-complex-data)
* [Developing components using witc](./witc)
* [Embed WasmEdge in C/C++](../category/wasmedge-c-api)
* [Embed WasmEdge in Rust](../category/wasmedge-rust-sdk)
* [Embed WasmEdge in Go](../category/wasmedge-go-sdk)
* [Embed WasmEdge in Java](../category/wasmedge-java-sdk)
* [Embed WasmEdge in Python](../category/wasmedge-python-sdk)
* [Use cases](../category/wasmedge-use-cases)


Besides this, we also have two more guides for developing Wasm apps and contributing to WasmEdge.


If you find some issues or have any feedback, you could reach out to us via the following ways.

* [Discord Chat](https://discord.gg/U4B5sFTkFc)
* [Create a GitHub issue for technical support](https://github.com/WasmEdge/WasmEdge/issues)
* [Submit a GitHub discussion](https://github.com/WasmEdge/WasmEdge/discussions)
* [Follow @realwasmedge on Twitter](https://twitter.com/realwasmedge)