---
sidebar_position: 3
---

# The AoT Compiler

After [installation](../install.md#install), users can execute the `wasmedge compile` command.

The usage of the `wasmedge compile` command will be:

```bash
$ wasmedge compile -h
USAGE
   wasmedge compile [OPTIONS] [--] WASM WASM_SO

...
```

The `wasmedge compile` command can compile WebAssembly into native machine code (i.e., the AOT compiler). For the pure WebAssembly, the `wasmedge` tool will execute the WASM in interpreter mode. After compiling with the `wasmedge compile` AOT compiler, the `wasmedge` tool can execute the WASM in AOT mode, which is much faster.

## Options

The options of the `wasmedge compile` command are as follows.

1. `-h|--help`: Show the help messages. Will ignore the other arguments below.
2. _(Optional)_ `--dump`: Dump the LLVM IR to `wasm.ll` and `wasm-opt.ll`.
3. _(Optional)_ `--interruptible`: Generate the binary which supports interruptible execution.
   - By default, the AOT-compiled WASM not supports [interruptions in asynchronous executions](../../embed/c/reference/0.12.x#async).
4. _(Optional)_ Statistics information:
   - By default, the AOT-compiled WASM not supports all statistics even if the options are turned on when running the `wasmedge` tool.
   - Use `--enable-time-measuring` to generate code for enabling time-measuring statistics in execution.
   - Use `--enable-gas-measuring` to generate code for enabling the statistics of gas measuring in execution.
   - Use `--enable-instruction-count` to generate code for enabling the statistics of counting WebAssembly instructions.
   - Or use `--enable-all-statistics` to generate code for enabling all of the statistics.
5. _(Optional)_ `--generic-binary`: Generate the generic binary of the current host CPU architecture.
6. _(Optional)_ WebAssembly proposals:
   - Use `--disable-import-export-mut-globals` to disable the [Import/Export of Mutable Globals](https://github.com/WebAssembly/mutable-global) proposal (Default `ON`).
   - Use `--disable-non-trap-float-to-int` to disable the [Non-Trapping Float-to-Int Conversions](https://github.com/WebAssembly/nontrapping-float-to-int-conversions) proposal (Default `ON`).
   - Use `--disable-sign-extension-operators` to disable the [Sign-Extension Operators](https://github.com/WebAssembly/sign-extension-ops) proposal (Default `ON`).
   - Use `--disable-multi-value` to disable the [Multi-value](https://github.com/WebAssembly/multi-value) proposal (Default `ON`).
   - Use `--disable-bulk-memory` to disable the [Bulk Memory Operations](https://github.com/WebAssembly/bulk-memory-operations) proposal (Default `ON`).
   - Use `--disable-reference-types` to disable the [Reference Types](https://github.com/WebAssembly/reference-types) proposal (Default `ON`).
   - Use `--disable-simd` to disable the [Fixed-width SIMD](https://github.com/webassembly/simd) proposal (Default `ON`).
   - Use `--enable-multi-memory` to enable the [Multiple Memories](https://github.com/WebAssembly/multi-memory) proposal (Default `OFF`).
   - Use `--enable-tail-call` to enable the [Tail call](https://github.com/WebAssembly/tail-call) proposal (Default `OFF`).
   - Use `--enable-extended-const` to enable the [Extended Constant Expressions](https://github.com/WebAssembly/extended-const) proposal (Default `OFF`).
   - Use `--enable-threads` to enable the [Threads](https://github.com/webassembly/threads) proposal (Default `OFF`).
   - Use `--enable-all` to enable ALL proposals above.
7. _(Optional)_ `--optimize`: Select the LLVM optimization level.
   - Use `--optimize LEVEL` to set the optimization level. The `LEVEL` should be one of `0`, `1`, `2`, `3`, `s`, or `z`.
   - The default value will be `2`, which means `O2`.
8. Input WASM file (`/path/to/wasm/file`).
9. Output path (`/path/to/output/file`).
   - By default, the `wasmedge compile` command will output the [universal WASM format](#output-format-universal-wasm).
   - If the specific file extension (`.so` on Linux, `.dylib` on MacOS, and `.dll` on Windows) is assigned in the output path, the `wasmedge compile` command will output the [shared library format](#output-format-shared-library).

## Example

We created the hand-written [fibonacci.wat](https://github.com/WasmEdge/WasmEdge/raw/master/examples/wasm/fibonacci.wat) and used the [wat2wasm](https://webassembly.github.io/wabt/demo/wat2wasm/) tool to convert it into the `fibonacci.wasm` WebAssembly program. Take it, for example. It exported a `fib()` function, which takes a single `i32` integer as the input parameter.

You can run:

```bash
wasmedge compile fibonacci.wasm fibonacci_aot.wasm
```

or:

```bash
wasmedge compile fibonacci.wasm fibonacci_aot.so # On Linux.
```

The output will be:

```bash
[2022-09-09 14:22:10.540] [info] compile start
[2022-09-09 14:22:10.541] [info] verify start
[2022-09-09 14:22:10.542] [info] optimize start
[2022-09-09 14:22:10.547] [info] codegen start
[2022-09-09 14:22:10.552] [info] output start
[2022-09-09 14:22:10.600] [info] compile done
```

Then you can execute the output file with `wasmedge` and measure the execution time:

```bash
time wasmedge --reactor fibonacci_aot.wasm fib 30
```

The output will be:

```bash
1346269

real    0m0.029s
user    0m0.012s
sys     0m0.014s
```

Then you can compare it with the interpreter mode:

```bash
time wasmedge --reactor fibonacci.wasm fib 30
```

The output shows that the AOT-compiled WASM is much faster than the interpreter mode:

```bash
1346269

real    0m0.442s
user    0m0.427s
sys     0m0.012s
```

## Output Format: Universal WASM

By default, the `wasmedge compile` AOT compiler tool could wrap the AOT-compiled native binary into a custom section in the origin WASM file. We call this the universal WASM binary format.

This AOT-compiled WASM file is compatible with any WebAssembly runtime. However, when this WASM file is executed by the WasmEdge runtime, WasmEdge will extract the native binary from the custom section and execute it in AOT mode.

<!-- prettier-ignore -->
:::note
On MacOS platforms, the universal WASM format will `bus error` in execution. By default, the `wasmedge compile` tool optimizes the WASM in the `O2` level. We are trying to fix this issue. For working around, please use the shared library output format instead.
:::

```bash
wasmedge compile app.wasm app_aot.wasm
wasmedge app_aot.wasm
```

## Output Format: Shared Library

Users can assign the shared library extension for the output files (`.so` on Linux, `.dylib` on MacOS, and `.dll` on Windows) to generate the shared library output format output.

This AOT-compiled WASM file is only for WasmEdge use and cannot be used by other WebAssembly runtimes.

```bash
wasmedge compile app.wasm app_aot.so
wasmedge app_aot.so
```
