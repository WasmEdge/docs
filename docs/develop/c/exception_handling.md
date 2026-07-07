---
sidebar_position: 6
---

# Exception Handling

WasmEdge implements the [latest exception-handling proposal](https://github.com/WebAssembly/exception-handling) (post Oct 2023). Legacy EH instructions such as `delegate` are rejected at load time.

Enable the proposal when running or compiling:

```bash
wasmedge --enable-exception-handling module.wasm
wasmedge compile --enable-exception-handling module.wasm module.aot.wasm
```

## Toolchain compatibility

| Toolchain | Compatible with WasmEdge EH | Notes |
|-----------|----------------------------|-------|
| Emscripten (`-fwasm-exceptions`) | No (as of 2026) | Often emits legacy EH (e.g. opcode `0x117` / `delegate`) |
| C/C++ via wasi-sdk / clang | Check your LLVM version | Must emit the latest EH proposal, not legacy EH |
| `wasm-3.0-exceptions` spec tests | Yes | Official test inputs used by WasmEdge |

WasmEdge does not plan to support legacy EH. Use modules built for the current proposal only.

## How WasmEdge tests EH

CI runs the `wasm-3.0-exceptions` suite from [wasmedge-spectest](https://github.com/WasmEdge/wasmedge-spectest). See `test/spec/CMakeLists.txt` in the [WasmEdge](https://github.com/WasmEdge/WasmEdge) repository.

To run a spec test locally after building tests, or fetch a `.wasm` from that repository:

```bash
wasmedge --enable-exception-handling path/to/test.wasm
```

## Emscripten repro (expected failure today)

```bash
emcc -O1 -fwasm-exceptions -sSTANDALONE_WASM a.cpp -o a.wasm
wasmedge --enable-exception-handling a.wasm
```

Example `a.cpp` and more detail: [examples/exception_handling](https://github.com/WasmEdge/WasmEdge/tree/master/examples/exception_handling) in the WasmEdge repository.
