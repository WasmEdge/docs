---
sidebar_position: 7
---

# `wasmedge instantiate` CLI

After [installation](../install.md#install), users can execute the `wasmedge instantiate` command.

The `wasmedge instantiate` command loads, validates, and instantiates a WebAssembly module. It checks that all imports can be resolved and that the module can be fully instantiated, but does **not** execute any functions. This is useful for verifying that a WASM module can be successfully linked and instantiated in a given environment before running it.

The `wasmedge instantiate` command also supports linking additional WASM modules, allowing you to verify that multi-module dependencies resolve correctly.

```bash
$ wasmedge instantiate -h
USAGE
   wasmedge instantiate [OPTIONS] [--] WASM_OR_SO

...
```

## Options

The options of the `wasmedge instantiate` command are as follows.

1. `-h|--help`: Show the help messages. Will ignore the other arguments below.
2. _(Optional)_ `--log-level`: Set logging level. Valid values: `off`, `trace`, `debug`, `info`, `warning`, `error`, `fatal`. Default is `info`.
3. _(Optional)_ `--forbidden-plugin`: List of plugins to ignore.
4. _(Optional)_ `--module`: Register additional WASM modules for linking. Each module can be specified as `--module name:path`, where `name` is the module name to export and `path` is the WASM file path. This option can be repeated to register multiple modules.
5. _(Optional)_ `--dir`: Bind directories into WASI virtual filesystem.
   - Use `--dir guest_path:host_path` to bind the host path into the guest path in WASI virtual system.
6. _(Optional)_ `--env`: Assign the environment variables in WASI.
   - Use `--env ENV_NAME=VALUE` to assign the environment variable.
7. _(Optional)_ `--memory-page-limit`: Set the limitation of pages (as size of 64 KiB) in every memory instance.
8. _(Optional)_ WebAssembly proposals:
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
9. Input WASM file (`/path/to/wasm/file`).

## Example

### Instantiating a self-contained module

We created the hand-written [fibonacci.wat](https://github.com/WasmEdge/WasmEdge/raw/master/examples/wasm/fibonacci.wat) and used the [wat2wasm](https://webassembly.github.io/wabt/demo/wat2wasm/) tool to convert it into the `fibonacci.wasm` WebAssembly program. It exported a `fib()` function which takes a single `i32` integer as the input parameter.

You can run:

```bash
wasmedge instantiate fibonacci.wasm
```

The output will be:

```bash
[2026-03-24 02:07:47.135] [info] Instantiation succeeded.
```

The exit code will be `0`.

### Instantiation failure due to unresolved imports

We created the hand-written [bad_instantiate.wat](https://github.com/WasmEdge/WasmEdge/raw/master/examples/wasm/bad_instantiate.wat) and used the [wat2wasm](https://webassembly.github.io/wabt/demo/wat2wasm/) tool to convert it into the `bad_instantiate.wasm` WebAssembly program. This module imports functions, memory, tables, and globals from an `env` module that is not available in the CLI environment, causing instantiation to fail.

You can run:

```bash
wasmedge instantiate bad_instantiate.wasm
```

The output will be:

```bash
[2026-04-09 00:33:46.404] [error] instantiation failed: unknown import, Code: 0x302
[2026-04-09 00:33:46.404] [error]     When linking module: "env" , memory name: "memory"
[2026-04-09 00:33:46.404] [error]     At AST node: import description
[2026-04-09 00:33:46.404] [error]     This may be the import of host environment like JavaScript or Golang. Please check that you've registered the necessary host modules from the host programming language.
[2026-04-09 00:33:46.404] [error]     At AST node: import section
[2026-04-09 00:33:46.404] [error]     At AST node: module
```

The exit code will be `1`.

### Multi-module linking

You can register additional WASM modules to satisfy imports using the `--module` option. For example, if `main.wasm` imports from a module named `utils`, you can provide it:

```bash
wasmedge instantiate --module utils:utils.wasm main.wasm
```

Multiple modules can be linked by repeating the `--module` flag:

```bash
wasmedge instantiate --module utils:utils.wasm --module math:math.wasm main.wasm
```

If all imports are resolved successfully, the output will be:

```bash
[info] Instantiation succeeded.
```
