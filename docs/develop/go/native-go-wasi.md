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


## Hello World example

The following example demonstrates a minimal Go application compiled to WASI and executed using WasmEdge.

### hello.go

```go
package main

import "fmt"

func main() {
	fmt.Println("Hello, world")
}
```

### Build

```bash
# initialize a module (optional, but recommended)
go mod init hello
# build a WASI-compatible WebAssembly module
GOOS=wasip1 GOARCH=wasm go build -o hello.wasm
```

### Run with WasmEdge

```bash
wasmedge hello.wasm
```

Expected output:

```
Hello, world
```

Ensure the example prints "Hello, world" when run with WasmEdge. This section is intentionally minimal to demonstrate the native Go WASI path working end-to-end.


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

To work around the lack of native networking support in WASI Preview 1,
alternative approaches are required. One such experimental approach is the use
of the external `stealthrocket/net` project, which provides a networking
implementation designed for WASI environments.

Rather than relying on traditional socket APIs, `stealthrocket/net` forwards
network requests to host-provided functionality. This can enable limited HTTP
and networking capabilities for Go applications compiled to WASI, depending on
the runtime environment.

> **Note**
> `stealthrocket/net` is **not part of WasmEdge** and is mentioned here only as an
> external reference. Usage details, compatibility, and examples should be
> verified directly with the project maintainers.

For more information, see the official repository:
- https://github.com/stealthrocket/net



## Importing host functions in native Go (Go 1.21+)

Native Go applications compiled to WASI can call functions that are implemented
by the WebAssembly runtime (such as WasmEdge) rather than inside the module
itself.

Starting with Go 1.21, host functions can be declared using the
`//go:wasmimport` directive.

### Example

```go
package main

//go:wasmimport wasi_snapshot_preview1 proc_exit
func procExit(code uint32)

func main() {
	procExit(0)
}
```

In this example, proc_exit is a WASI host function provided by the runtime.
The implementation is supplied by the WASI environment rather than by Go code
inside the WebAssembly module.

For more details, see the official Go documentation:
- https://pkg.go.dev/cmd/compile#hdr-Directives
