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

| Toolchain | Version | Compatible | Notes |
|-----------|---------|------------|-------|
| WasmEdge (runtime) | 0.17.x | Yes | Latest EH proposal; use `--enable-exception-handling` |
| Emscripten (`-fwasm-exceptions`) | 3.1.64, 6.0.0 | No | Emits legacy EH (e.g. opcode `0x117` / `delegate`) |
| wasi-sdk / clang | None verified | No | No public wasi-sdk release verified to emit latest EH yet |
| `wasm-3.0-exceptions` spec tests | wasmedge-spectest | Yes | Official test inputs used by WasmEdge CI |

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
