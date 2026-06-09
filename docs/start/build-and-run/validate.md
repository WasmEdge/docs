---
sidebar_position: 6
---

# `wasmedge validate` CLI

After [installation](https://wasmedge.org/docs/start/install#install), users can execute the `wasmedge validate` command.

The `wasmedge validate` command loads a WebAssembly module and runs the validation phase, checking that the module conforms to the WebAssembly specification. It does **not** instantiate or execute the module. This is useful for verifying correctness of a WASM binary before deployment or execution.

```bash
$ wasmedge validate -h
USAGE
   wasmedge validate [OPTIONS] [--] WASM_OR_SO

...
```

## Options

The options of the `wasmedge validate` command are as follows.

1. `-h|--help`: Show the help messages. Will ignore the other arguments below.
2. _(Optional)_ `--log-level`: Set logging level. Valid values: `off`, `trace`, `debug`, `info`, `warning`, `error`, `fatal`. Default is `info`.
3. _(Optional)_ `--forbidden-plugin`: List of plugins to ignore.
4. _(Optional)_ WebAssembly proposals:
   - Use `--wasm-1` to set the environment as WASM 1.0 standard. This standard includes the following proposals:
      - [Import/Export of Mutable Globals](https://github.com/WebAssembly/mutable-global)
   - Use `--wasm-2` to set the environment as WASM 2.0 standard. This standard includes the WASM 1.0 and following proposals:
      - [Non-Trapping Float-to-Int Conversions](https://github.com/WebAssembly/nontrapping-float-to-int-conversions)
      - [Sign-Extension Operators](https://github.com/WebAssembly/sign-extension-ops)
      - [Multi-value](https://github.com/WebAssembly/multi-value)
      - [Bulk Memory Operations](https://github.com/WebAssembly/bulk-memory-operations)
      - [Reference Types](https://github.com/WebAssembly/reference-types)
      - [Fixed-width SIMD](https://github.com/webassembly/simd)
   - Use `--wasm-3` to set the environment as WASM 3.0 standard (Currently default since 0.16.0). This standard includes the WASM 2.0 and following proposals:
      - [Tail call](https://github.com/WebAssembly/tail-call)
      - [Extended Constant Expressions](https://github.com/WebAssembly/extended-const)
      - [Typed-Function References](https://github.com/WebAssembly/function-references)
      - [Garbage Collection](https://github.com/WebAssembly/gc)
      - [Multiple Memories](https://github.com/WebAssembly/multi-memory)
      - [Relaxed SIMD](https://github.com/webassembly/relaxed-simd)
      - [Exception Handling](https://github.com/WebAssembly/exception-handling)
      - [Memory64 (currently not implemented)](https://github.com/WebAssembly/memory64)
   - Use `--disable-import-export-mut-globals` to disable the [Import/Export of Mutable Globals](https://github.com/WebAssembly/mutable-global) proposal (Default `ON`).
   - Use `--disable-non-trap-float-to-int` to disable the [Non-Trapping Float-to-Int Conversions](https://github.com/WebAssembly/nontrapping-float-to-int-conversions) proposal (Default `ON`).
   - Use `--disable-sign-extension-operators` to disable the [Sign-Extension Operators](https://github.com/WebAssembly/sign-extension-ops) proposal (Default `ON`).
   - Use `--disable-multi-value` to disable the [Multi-value](https://github.com/WebAssembly/multi-value) proposal (Default `ON`).
   - Use `--disable-bulk-memory` to disable the [Bulk Memory Operations](https://github.com/WebAssembly/bulk-memory-operations) proposal (Default `ON`).
   - Use `--disable-reference-types` to disable the [Reference Types](https://github.com/WebAssembly/reference-types) proposal (Default `ON`).
   - Use `--disable-simd` to disable the [Fixed-width SIMD](https://github.com/webassembly/simd) proposal (Default `ON`).
   - Use `--disable-tail-call` to disable the [Tail call](https://github.com/WebAssembly/tail-call) proposal (Default `ON`).
   - Use `--disable-extended-const` to disable the [Extended Constant Expressions](https://github.com/WebAssembly/extended-const) proposal (Default `ON`).
   - Use `--disable-function-reference` to disable the [Typed-Function References](https://github.com/WebAssembly/function-references) proposal (Default `ON`).
   - Use `--disable-gc` to disable the [Garbage Collection](https://github.com/WebAssembly/gc) proposal (Default `ON`).
   - Use `--disable-multi-memory` to disable the [Multiple Memories](https://github.com/WebAssembly/multi-memory) proposal (Default `ON`).
   - Use `--disable-relaxed-simd` to disable the [Relaxed SIMD](https://github.com/webassembly/relaxed-simd) proposal (Default `ON`).
   - Use `--disable-exception-handling` to disable the [Exception Handling](https://github.com/WebAssembly/exception-handling) proposal (Default `ON`).
   - Use `--enable-threads` to enable the [Threads](https://github.com/webassembly/threads) proposal (Default `OFF`).
   - Use `--enable-component` to enable the [Component Model](https://github.com/WebAssembly/component-model) proposal (Default `OFF`, loader phase only).
   - Use `--enable-all` to enable ALL proposals above.
5. Input WASM file (`/path/to/wasm/file`).

## Example

### Validating a correct module

We created the hand-written [fibonacci.wat](https://github.com/WasmEdge/WasmEdge/raw/master/examples/wasm/fibonacci.wat) and used the [wat2wasm](https://webassembly.github.io/wabt/demo/wat2wasm/) tool to convert it into the `fibonacci.wasm` WebAssembly program. It exported a `fib()` function which takes a single `i32` integer as the input parameter.

You can run:

```bash
wasmedge validate fibonacci.wasm
```

The output will be:

```bash
[2026-03-24 02:07:35.939] [info] Validation succeeded.
```

The exit code will be `0`.

### Validating an invalid module

We created the hand-written [bad_validate.wat](https://github.com/WasmEdge/WasmEdge/raw/master/examples/wasm/bad_validate.wat) and used the [wat2wasm](https://webassembly.github.io/wabt/demo/wat2wasm/) tool to convert it into the `bad_validate.wasm` WebAssembly program. This module intentionally contains a type mismatch to demonstrate validation failure.

You can run:

```bash
wasmedge validate bad_validate.wasm
```

The output will be:

```bash
[2026-03-24 02:08:49.475] [error] validation failed: type mismatch, Code: 0x202
[2026-03-24 02:08:49.475] [error]     Mismatched value type. Expected: i32 , Got: i64
[2026-03-24 02:08:49.475] [error]     In instruction: end (0x08) , Bytecode offset: 0x00000026
[2026-03-24 02:08:49.475] [error]     At AST node: expression
[2026-03-24 02:08:49.475] [error]     At AST node: code segment
[2026-03-24 02:08:49.475] [error]     At AST node: code section
[2026-03-24 02:08:49.475] [error]     At AST node: module
```

The exit code will be `1`.
