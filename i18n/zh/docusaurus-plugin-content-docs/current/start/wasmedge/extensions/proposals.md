---
sidebar_position: 1
---

# WebAssembly 提案

## 标准的 WebAssembly 功能

WasmEdge 支持以下 [WebAssembly 提案](https://github.com/WebAssembly/proposals)。这些提案可能成为未来的官方 WebAssembly 规范。

| 提案 | WasmEdge CLI 标志 | WasmEdge C API 枚举 | 默认开启 | 解释器模式 | AOT 模式 |
| --- | --- | --- | --- | --- | --- |
| [可变全局变量的导入/导出][] | `--disable-import-export-mut-globals` | `WasmEdge_Proposal_ImportExportMutGlobals` | ✓（自`0.8.2`） | ✓ | ✓ |
| [非陷阱浮点数到整数转换][] | `--disable-non-trap-float-to-int` | `WasmEdge_Proposal_NonTrapFloatToIntConversions` | ✓（自`0.8.2`） | ✓ | ✓ |
| [符号扩展操作][] | `--disable-sign-extension-operators` | `WasmEdge_Proposal_SignExtensionOperators` | ✓（自`0.8.2`） | ✓ | ✓ |
| [多值返回][] | `--disable-multi-value` | `WasmEdge_Proposal_MultiValue` | ✓（自`0.8.2`） | ✓ | ✓ |
| [引用类型][] | `--disable-reference-types` | `WasmEdge_Proposal_ReferenceTypes` | ✓（自`0.8.2`） | ✓ | ✓ |
| [批量内存操作][] | `--disable-bulk-memory` | `WasmEdge_Proposal_BulkMemoryOperations` | ✓（自`0.8.2`） | ✓ | ✓ |
| [固定宽度 SIMD][] | `--disable-simd` | `WasmEdge_Proposal_SIMD` | ✓（自`0.9.0`） | ✓（自`0.8.2`） | ✓（自`0.8.2`） |
| [尾调用][] | `--enable-tail-call` | `WasmEdge_Proposal_TailCall` |  | ✓（自`0.10.0`） | ✓（自`0.10.0`） |
| [多内存][] | `--enable-multi-memory` | `WasmEdge_Proposal_MultiMemories` |  | ✓（自`0.9.1`） | ✓（自`0.9.1`） |
| [扩展常量表达式][] | `--enable-extended-const` | `WasmEdge_Proposal_ExtendedConst` |  | ✓（自`0.10.0`） | ✓（自`0.10.0`） |
| [线程][] | `--enable-threads` | `WasmEdge_Proposal_Threads` |  | ✓（自`0.10.1`） | ✓（自`0.10.1`） |

以下提案正在开发中，可能在将来得到支持：

- [组件模型][]
- [异常处理][]
- [垃圾回收][]
- [WebAssembly C 和 C++ API][]

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
[Garbage collection]: https://github.com/WebAssembly/gc
[WebAssembly C and C++ API]: https://github.com/WebAssembly/wasm-c-api

## WASI 提案

WasmEdge 实现了以下 [WASI 提案](https://github.com/WebAssembly/WASI/blob/main/Proposals.md)：

| 提案 | 平台支持 |
| --- | --- |
| [Sockets][] | `x86_64 Linux`, `aarch64 Linux` (自 `0.10.0` 起) |
| [Crypto][] | `x86_64 Linux`, `aarch64 Linux` (自 `0.10.1` 起) |
| [机器学习（wasi-nn）][] | `x86_64 Linux`, OpenVINO (自 `0.10.1` 起), PyTorch (自 `0.11.1` 起), 以及 TensorFlow-Lite (自 `0.11.2` 起) 后端 |
| [proxy-wasm][] | `x86_64 Linux（仅解释器）` (自 `0.8.2` 起) |

以下提案正在开发中，将来可能会得到支持：

- WASI-NN 的 TensorFlow 后端

[Sockets]: https://github.com/WebAssembly/wasi-sockets
[Crypto]: https://github.com/WebAssembly/wasi-crypto
[机器学习（wasi-nn）]: https://github.com/WebAssembly/wasi-nn
[proxy-wasm]: https://github.com/proxy-wasm/spec
