---
sidebar_position: 1
---

# WebAssembly 提案

## 標準 WebAssembly 特性

WasmEdge 支援以下 [WebAssembly 提案](https://github.com/WebAssembly/proposals)。這些提案在未來很可能成為官方 WebAssembly 規範。

| 提案 | WasmEdge CLI 旗標 | WasmEdge C API 列舉 | 預設啟用 | 直譯模式 | AOT 模式 |
| --- | --- | --- | --- | --- | --- |
| [Import/Export of Mutable Globals][] | `--disable-import-export-mut-globals` | `WasmEdge_Proposal_ImportExportMutGlobals` | ✓ (自 `0.8.2` 起) | ✓ | ✓ |
| [Non-trapping float-to-int conversions][] | `--disable-non-trap-float-to-int` | `WasmEdge_Proposal_NonTrapFloatToIntConversions` | ✓ (自 `0.8.2` 起) | ✓ | ✓ |
| [Sign-extension operators][] | `--disable-sign-extension-operators` | `WasmEdge_Proposal_SignExtensionOperators` | ✓ (自 `0.8.2` 起) | ✓ | ✓ |
| [Multi-value][] | `--disable-multi-value` | `WasmEdge_Proposal_MultiValue` | ✓ (自 `0.8.2` 起) | ✓ | ✓ |
| [Reference Types][] | `--disable-reference-types` | `WasmEdge_Proposal_ReferenceTypes` | ✓ (自 `0.8.2` 起) | ✓ | ✓ |
| [Bulk memory operations][] | `--disable-bulk-memory` | `WasmEdge_Proposal_BulkMemoryOperations` | ✓ (自 `0.8.2` 起) | ✓ | ✓ |
| [Fixed-width SIMD][] | `--disable-simd` | `WasmEdge_Proposal_SIMD` | ✓ (自 `0.9.0` 起) | ✓ (自 `0.8.2` 起) | ✓ (自 `0.8.2` 起) |
| [Tail call][] | `--disable-tail-call` | `WasmEdge_Proposal_TailCall` | ✓ (自 `0.16.0` 起) | ✓ (自 `0.10.0` 起) | ✓ (自 `0.10.0` 起) |
| [Extended Constant Expressions][] | `--disable-extended-const` | `WasmEdge_Proposal_ExtendedConst` | ✓ (自 `0.16.0` 起) | ✓ (自 `0.10.0` 起) | ✓ (自 `0.10.0` 起) |
| [Typed Function References][] | `--disable-function-reference` | `WasmEdge_Proposal_FunctionReferences` | ✓ (自 `0.16.0` 起) | ✓ (自 `0.14.0` 起) | ✓ (自 `0.14.0` 起) |
| [Garbage collection][] | `--disable-gc` | `WasmEdge_Proposal_GC` | ✓ (自 `0.16.0` 起) | ✓ (自 `0.14.0` 起) | ✓ (自 `0.15.0` 起) |
| [Multiple memories][] | `--disable-multi-memory` | `WasmEdge_Proposal_MultiMemories` | ✓ (自 `0.16.0` 起) | ✓ (自 `0.9.1` 起) | ✓ (自 `0.9.1` 起) |
| [Relaxed SIMD][] | `--disable-relaxed-simd` | `WasmEdge_Proposal_RelaxSIMD` | ✓ (自 `0.16.0` 起) | ✓ (自 `0.14.1` 起) | ✓ (自 `0.14.1` 起) |
| [Exception handling][] | `--disable-exception-handling` | `WasmEdge_Proposal_ExceptionHandling` | ✓ (自 `0.16.0` 起) | ✓ (自 `0.14.0` 起) |  |
| [Memory64][] | `--disable-memory64` | `WasmEdge_Proposal_Memory64` | ✓ (自 `0.17.0` 起) | ✓ (自 `0.17.0` 起) | ✓ (自 `0.17.0` 起) |
| [Threads][] | `--enable-threads` | `WasmEdge_Proposal_Threads` |  | ✓ (自 `0.10.1` 起) | ✓ (自 `0.10.1` 起) |
| [Component Model][] | `--enable-component` | `WasmEdge_Proposal_Component` |  | 載入器與驗證器(自 `0.17.0` 起) |  |

以下提案正在開發中,未來可能會受到支援:

- [Exception handling][] (AOT 模式)
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

## WASI 提案

WasmEdge 實作了以下 [WASI 提案](https://github.com/WebAssembly/WASI/blob/main/Proposals.md):

| 提案 | 平台:`Linux x86_64` | 平台:`Linux aarch64` | 平台:`x86_64 MacOS` | 平台:`MacOS arm64` |
| --- | --- | --- | --- | --- |
| [Sockets][] | ✓ (自 `0.10.0` 起) | ✓ (自 `0.10.0` 起) | ✓ (自 `0.10.0` 起) | ✓ (自 `0.10.0` 起) |
| [Crypto][] | ✓ (自 `0.10.1` 起) | ✓ (自 `0.10.1` 起) | ✓ (自 `0.13.0` 起) | ✓ (自 `0.13.0` 起) |
| [Logging][] | ✓ (自 `0.13.0` 起) | ✓ (自 `0.13.0` 起) | ✓ (自 `0.13.0` 起) | ✓ (自 `0.13.0` 起) |
| [Machine Learning (wasi-nn)][] | ✓ OpenVINO (自 `0.10.1` 起)<br/>✓ PyTorch (自 `0.11.1` 起)<br/>✓ TensorFlow-Lite (自 `0.11.2` 起)<br/>✓ Ggml (自 `0.13.4` 起) | ✓ Ggml (自 `0.13.4` 起) | ✓ Ggml (自 `0.13.4` 起) | ✓ Ggml (自 `0.13.4` 起) |
| [proxy-wasm][] | ✓ (自 `0.8.2` 起,直譯) | | ✓ (自 `0.11.2` 起,直譯) | |

以下提案正在開發中,未來可能會受到支援:

- WASI-NN 的 TensorFlow 後端

[Sockets]: https://github.com/WebAssembly/wasi-sockets
[Crypto]: https://github.com/WebAssembly/wasi-crypto
[Logging]: https://github.com/WebAssembly/wasi-logging
[Machine Learning (wasi-nn)]: https://github.com/WebAssembly/wasi-nn
[proxy-wasm]: https://github.com/proxy-wasm/spec
