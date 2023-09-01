---
sidebar_position: 1
---

# WebAssembly Proposals

## Standard WebAssembly Features

WasmEdge supports the following [WebAssembly proposals](https://github.com/WebAssembly/proposals). These proposals are likely to become official WebAssembly specifications in the future.

| Proposal | WasmEdge CLI flag | WasmEdge C API enumeration | Default turning on | Interpreter mode | AOT mode |
| --- | --- | --- | --- | --- | --- |
| [Import/Export of Mutable Globals][] | `--disable-import-export-mut-globals` | `WasmEdge_Proposal_ImportExportMutGlobals` | ✓ (since `0.8.2`) | ✓ | ✓ |
| [Non-trapping float-to-int conversions][] | `--disable-non-trap-float-to-int` | `WasmEdge_Proposal_NonTrapFloatToIntConversions` | ✓ (since `0.8.2`) | ✓ | ✓ |
| [Sign-extension operators][] | `--disable-sign-extension-operators` | `WasmEdge_Proposal_SignExtensionOperators` | ✓ (since `0.8.2`) | ✓ | ✓ |
| [Multi-value][] | `--disable-multi-value` | `WasmEdge_Proposal_MultiValue` | ✓ (since `0.8.2`) | ✓ | ✓ |
| [Reference Types][] | `--disable-reference-types` | `WasmEdge_Proposal_ReferenceTypes` | ✓ (since `0.8.2`) | ✓ | ✓ |
| [Bulk memory operations][] | `--disable-bulk-memory` | `WasmEdge_Proposal_BulkMemoryOperations` | ✓ (since `0.8.2`) | ✓ | ✓ |
| [Fixed-width SIMD][] | `--disable-simd` | `WasmEdge_Proposal_SIMD` | ✓ (since `0.9.0`) | ✓ (since `0.8.2`) | ✓ (since `0.8.2`) |
| [Tail call][] | `--enable-tail-call` | `WasmEdge_Proposal_TailCall` |  | ✓ (since `0.10.0`) | ✓ (since `0.10.0`) |
| [Extended Constant Expressions][] | `--enable-extended-const` | `WasmEdge_Proposal_ExtendedConst` |  | ✓ (since `0.10.0`) | ✓ (since `0.10.0`) |
| [Typed Function References][] | `--enable-function-reference` | `WasmEdge_Proposal_FunctionReferences` |  | ✓ (since `0.14.0`) | ✓ (since `0.14.0`) |
| [Garbage collection][] | `--enable-gc` | `WasmEdge_Proposal_GC` |  | ✓ (since `0.14.0`) |  |
| [Multiple memories][] | `--enable-multi-memory` | `WasmEdge_Proposal_MultiMemories` |  | ✓ (since `0.9.1`) | ✓ (since `0.9.1`) |
| [Threads][] | `--enable-threads` | `WasmEdge_Proposal_Threads` |  | ✓ (since `0.10.1`) | ✓ (since `0.10.1`) |
| [Exception handling][] | `--enable-exception-handling` | `WasmEdge_Proposal_ExceptionHandling` |  | ✓ (since `0.14.0`) |  |
| [Component Model][] | `--enable-component` | `WasmEdge_Proposal_Component` |  | Loader only (since `0.14.0`) |  |

The following proposals are under development and may be supported in the future:

- [Exception handling][]
- [Relaxed SIMD][]
- [Memory64][]
- [WebAssembly C and C++ API][]

[Import/Export of Mutable Globals]: https://github.com/WebAssembly/mutable-global
[Non-trapping float-to-int conversions]: https://github.com/WebAssembly/nontrapping-float-to-int-conversions
[Sign-extension operators]: https://github.com/WebAssembly/sign-extension-ops
[Multi-value]: https://github.com/WebAssembly/multi-value
[Reference Types]: https://github.com/WebAssembly/reference-types
[Bulk memory operations]: https://github.com/WebAssembly/bulk-memory-operations
[Fixed-width SIMD]: https://github.com/webassembly/simd
[Tail call]: https://github.com/WebAssembly/tail-call
[Multiple memories]: https://github.com/WebAssembly/multi-memory
[Extended Constant Expressions]: https://github.com/WebAssembly/extended-const
[Threads]: https://github.com/webassembly/threads
[Component Model]: https://github.com/WebAssembly/component-model
[Exception handling]: https://github.com/WebAssembly/exception-handling
[Typed Function References]: https://github.com/WebAssembly/function-references
[Garbage collection]: https://github.com/WebAssembly/gc
[Relaxed SIMD]: https://github.com/WebAssembly/relaxed-simd
[Memory64]: https://github.com/WebAssembly/memory64
[WebAssembly C and C++ API]: https://github.com/WebAssembly/wasm-c-api

## WASI proposals

WasmEdge implements the following [WASI proposals](https://github.com/WebAssembly/WASI/blob/main/Proposals.md):

| Proposal | Platform: `Linux x86_64` | Platform: `Linux aarch64` | Platform: `x86_64 MacOS` | Platform: `MacOS arm64` |
| --- | --- | --- | --- | --- |
| [Sockets][] | ✓ (since `0.10.0`) | ✓ (since `0.10.0`) | ✓ (since `0.10.0`) | ✓ (since `0.10.0`) |
| [Crypto][] | ✓ (since `0.10.1`) | ✓ (since `0.10.1`) | ✓ (since `0.13.0`) | ✓ (since `0.13.0`) |
| [Logging][] | ✓ (since `0.13.0`) | ✓ (since `0.13.0`) | ✓ (since `0.13.0`) | ✓ (since `0.13.0`) |
| [Machine Learning (wasi-nn)][] | ✓ OpenVINO (since `0.10.1`)<br/>✓ PyTorch (since `0.11.1`)<br/>✓ TensorFlow-Lite (since `0.11.2`)<br/>✓ Ggml (since `0.13.4`) | ✓ Ggml (since `0.13.4`) | ✓ Ggml (since `0.13.4`) | ✓ Ggml (since `0.13.4`) |
| [proxy-wasm][] | ✓ (since `0.8.2`, interpreter) | | ✓ (since `0.11.2`, interpreter) | |

The following proposals is under development and may be supported in the future:

- TensorFlow backend of WASI-NN

[Sockets]: https://github.com/WebAssembly/wasi-sockets
[Crypto]: https://github.com/WebAssembly/wasi-crypto
[Logging]: https://github.com/WebAssembly/wasi-logging
[Machine Learning (wasi-nn)]: https://github.com/WebAssembly/wasi-nn
[proxy-wasm]: https://github.com/proxy-wasm/spec
