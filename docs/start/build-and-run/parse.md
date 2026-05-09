---
sidebar_position: 5
---

# `wasmedge parse` CLI

After [installation](../install.md#install), users can execute the `wasmedge parse` command.

The `wasmedge parse` command loads a WebAssembly module and displays a detailed summary of its structure, including all sections defined in the binary (types, imports, functions, globals, exports, code, memory, tables, and custom sections). It is useful for inspecting WASM modules without executing them.

```bash
$ wasmedge parse -h
USAGE
   wasmedge parse [OPTIONS] [--] WASM_OR_SO

...
```

## Options

The options of the `wasmedge parse` command are as follows.

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

## Output

The `wasmedge parse` command prints a structured summary of the WASM binary, organized by section:

- **Type** — Function signatures (parameter and return types).
- **Import** — Imported functions, memories, tables, and globals with their source module and name.
- **Function** — Locally defined functions with their type signature index.
- **Global** — Global variables with type, mutability, and initializer expression.
- **Export** — Exported functions, globals, memories, and tables.
- **Code** — Code segments with byte sizes for each function.
- **Custom** — Custom sections such as the `name` section, which maps indices to human-readable names.

If a `name` custom section is present in the WASM binary, function and global names will be displayed alongside their indices throughout the output.

## Example

We created the hand-written [parse_example.wat](https://github.com/WasmEdge/WasmEdge/raw/master/examples/wasm/parse_example.wat) and used the [wat2wasm](https://webassembly.github.io/wabt/demo/wat2wasm/) tool to convert it into the `parse_example.wasm` WebAssembly program. It contains imports, multiple function signatures, globals with initializers, and a `name` custom section.

You can run:

```bash
wasmedge parse parse_example.wasm
```

The output will be:

```bash
parse_example.wasm:  file format wasm 0x1

Section Details:

Type[5]:
 - type[0] (i32, i32) -> nil
 - type[1] () -> nil
 - type[2] (i32, i32) -> i32
 - type[3] (i64) -> i64
 - type[4] () -> f64
Import[4]:
 - memory[0] pages: initial=2 max=16 <- env.memory
 - func[0] sig=0 <log> <- env.log
 - table[0] <- env.table
 - global[0] i32 mutable=0 <imported_base> <- env.base
Function[7]:
 - func[1] sig=1 <__wasm_call_ctors>
 - func[2] sig=2 <add>
 - func[3] sig=2 <sub>
 - func[4] sig=2 <mul>
 - func[5] sig=3 <factorial>
 - func[6] sig=4 <get_pi>
 - func[7] sig=0 <call_log>
Global[5]:
 - global[1] i32 mutable=1 <__stack_pointer> - init i32=66560
 - global[2] i32 mutable=0 <__heap_base> - init i32=131072
 - global[3] i32 mutable=0 <__data_end> - init i32=1024
 - global[4] f64 mutable=0 <pi_approx> - init f64=3.14159
 - global[5] i64 mutable=0 <big_val> - init i64=9999999999
Export[13]:
 - func[1] <__wasm_call_ctors> -> "__wasm_call_ctors"
 - func[2] <add> -> "add"
 - func[3] <sub> -> "sub"
 - func[4] <mul> -> "mul"
 - func[5] <factorial> -> "factorial"
 - func[6] <get_pi> -> "get_pi"
 - func[7] <call_log> -> "call_log"
 - global[1] -> "__stack_pointer"
 - global[2] -> "__heap_base"
 - global[3] -> "__data_end"
 - global[4] -> "pi_approx"
 - global[5] -> "big_val"
 - table[1] -> "func_table"
Code[7]:
 - func[1] size=2 <__wasm_call_ctors>
 - func[2] size=7 <add>
 - func[3] size=7 <sub>
 - func[4] size=7 <mul>
 - func[5] size=39 <factorial>
 - func[6] size=11 <get_pi>
 - func[7] size=8 <call_log>
Custom:
 - name: "name"
 - func[0] <log>
 - func[1] <__wasm_call_ctors>
 - func[2] <add>
 - func[3] <sub>
 - func[4] <mul>
 - func[5] <factorial>
 - func[6] <get_pi>
 - func[7] <call_log>
 - global[0] <imported_base>
 - global[1] <__stack_pointer>
 - global[2] <__heap_base>
 - global[3] <__data_end>
 - global[4] <pi_approx>
 - global[5] <big_val>
```
