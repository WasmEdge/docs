---
sidebar_position: 2
---

# Native Go with WASI (Go 1.21+)

Starting with Go 1.21, the Go toolchain natively supports compiling applications to the WebAssembly System Interface (WASI). This enables developers to build WebAssembly applications using the standard Go compiler and run them on WASI-compliant runtimes such as WasmEdge.

This page describes how to develop and run WASI-based applications using native Go with WasmEdge. It also highlights key differences compared to using TinyGo, which has historically been the primary way to run Go applications on WebAssembly.

Native Go support is particularly useful for developers who require functionality that is not fully available in the TinyGo standard library, such as more complete language features or integration with existing Go codebases.


## TinyGo vs Native Go

There are currently two ways to develop Go applications for WasmEdge: using TinyGo or using the native Go compiler with WASI support introduced in Go 1.21. Each approach has different trade-offs.

| Aspect | TinyGo | Native Go (Go 1.21+) |
|------|--------|----------------------|
| Compiler | TinyGo (LLVM-based) | Standard Go compiler |
| Standard library | Partial | More complete |
| Binary size | Smaller | Larger |
| WASI support | Mature | Introduced in Go 1.21 |
| Networking | Not available by default | Not available by default (WASI limitation) |
| Typical use cases | Small, resource-constrained workloads | Existing Go codebases, richer language features |

TinyGo has historically been the primary way to run Go applications on WebAssembly and remains a good choice for lightweight workloads. Native Go with WASI support enables developers to reuse more existing Go code and tooling, but it is still subject to the limitations of the WASI environment.


## Building a WASI module with Go 1.21

To compile a Go application to a WASI-compatible WebAssembly module, Go 1.21 or newer is required.

Use the following environment variables when building your application:

```bash
GOOS=wasip1 GOARCH=wasm go build -o app.wasm
```

In this command:

GOOS=wasip1 specifies the WASI Preview 1 target

GOARCH=wasm selects the WebAssembly architecture

app.wasm is the generated WebAssembly module

The resulting .wasm file can be executed by WASI-compliant runtimes such as WasmEdge.


## Running the module with WasmEdge

After building the WebAssembly module (for example, `app.wasm`), it can be executed using the WasmEdge CLI.

```bash
wasmedge app.wasm
```

WasmEdge executes the WASI _start entry point by default. Command-line arguments provided after the module path are forwarded to the module at runtime. The --dir option can be used to preopen host directories for file system access when required.


## Networking and WASI limitations

The current WASI Preview 1 specification does not include native support for networking primitives such as TCP or UDP sockets. As a result, Go packages that depend on the standard `net` or `net/http` libraries cannot function out of the box in a WASI environment.

This limitation applies to both TinyGo and native Go when targeting WASI and is not specific to WasmEdge. Networking support requires additional abstractions or host-provided functionality, which are discussed in the following sections.


## Networking with stealthrocket/net

To work around the lack of native networking support in WASI Preview 1, alternative approaches are required. One such approach is the use of the `stealthrocket/net` project, which provides a networking implementation designed for WASI environments.

Rather than relying on traditional socket APIs, `stealthrocket/net` enables networking by forwarding requests to host-provided functionality. This allows Go applications compiled to WASI to perform HTTP requests and other network operations when supported by the runtime environment.

When using native Go with WASI, libraries such as `stealthrocket/net` can be used to enable networking functionality that is otherwise unavailable through the standard Go `net` and `net/http` packages.


## Importing host functions in Go 1.21

In addition to using libraries such as `stealthrocket/net`, native Go applications compiled to WASI can interact with runtime-provided functionality by importing host functions.

Starting with Go 1.21, host functions can be declared using the `//go:wasmimport` directive. This allows Go code to call functions that are implemented by the WebAssembly runtime, such as WasmEdge, rather than inside the WebAssembly module itself.

Host functions can be used to expose capabilities that are not available in the WASI specification, including networking, system integration, or custom platform services. The exact set of available host functions depends on the runtime and its configuration.
