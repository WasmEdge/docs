---
sidebar_position: 3
---

# AoT 编译器

安装完成后（请参阅[安装指南](../install.md#install)），用户可以执行 `wasmedge compile` 命令。

`wasmedge compile` 命令的用法如下：

```bash
$ wasmedge compile -h
USAGE
   wasmedge compile [OPTIONS] [--] WASM WASM_SO

...
```

`wasmedge compile` 命令可将 WebAssembly 编译为本机机器码（即，AOT 编译器）。对于纯 WebAssembly，`wasmedge` 工具将以解释器模式执行 WASM。通过 `wasmedge compile` AOT 编译器编译后，`wasmedge` 工具可以以 AOT 模式执行 WASM，速度要快得多。

## 选项

`wasmedge compile` 命令的选项如下。

1. `-h|--help`：显示帮助信息。将忽略下面的其他参数。
2. （可选）`--dump`：将 LLVM IR 转储到 `wasm.ll` 和 `wasm-opt.ll`。
3. （可选）`--interruptible`：生成支持可中断执行的二进制文件。
   - 默认情况下，AOT 编译的 WASM 不支持[异步执行中的中断](../../embed/c/reference/0.12.x#async)。
4. （可选）统计信息：
   - 默认情况下，即使在运行 `wasmedge` 工具时打开选项，AOT 编译的 WASM 也不支持所有统计信息。
   - 使用 `--enable-time-measuring` 生成用于启用执行时间测量统计的代码。
   - 使用 `--enable-gas-measuring` 生成用于启用执行中的 gas 测量统计的代码。
   - 使用 `--enable-instruction-count` 生成用于启用 WebAssembly 指令计数统计的代码。
5. （可选）`--generic-binary`：生成通用二进制文件。
6. （可选）WebAssembly 提案：
   - 使用 `--disable-import-export-mut-globals` 禁用[可变全局变量的导入/导出](https://github.com/WebAssembly/mutable-global) 提案（默认为 `ON`）。
   - 使用 `--disable-non-trap-float-to-int` 禁用[非陷阱浮点到整数转换](https://github.com/WebAssembly/nontrapping-float-to-int-conversions) 提案（默认为 `ON`）。
   - 使用 `--disable-sign-extension-operators` 禁用[符号扩展运算符](https://github.com/WebAssembly/sign-extension-ops) 提案（默认为 `ON`）。
   - 使用 `--disable-multi-value` 禁用[多值](https://github.com/WebAssembly/multi-value) 提案（默认为 `ON`）。
   - 使用 `--disable-bulk-memory` 禁用[批量内存操作](https://github.com/WebAssembly/bulk-memory-operations) 提案（默认为 `ON`）。
   - 使用 `--disable-reference-types` 禁用[引用类型](https://github.com/WebAssembly/reference-types) 提案（默认为 `ON`）。
   - 使用 `--disable-simd` 禁用[固定宽度 SIMD](https://github.com/webassembly/simd) 提案（默认为 `ON`）。
   - 使用 `--enable-multi-memory` 启用[多内存](https://github.com/WebAssembly/multi-memory) 提案（默认为 `OFF`）。
   - 使用 `--enable-tail-call` 启用[尾调用](https://github.com/WebAssembly/tail-call) 提案（默认为 `OFF`）。
   - 使用 `--enable-extended-const` 启用[扩展常量表达式](https://github.com/WebAssembly/extended-const) 提案（默认为 `OFF`）。
   - 使用 `--enable-threads` 启用[线程](https://github.com/webassembly/threads) 提案（默认为 `OFF`）。
   - 使用 `--enable-all` 启用上述所有提案。
7. （可选）`--optimize`：选择 LLVM 优化级别。
   - 使用 `--optimize LEVEL` 来设置优化级别。`LEVEL` 应为 `0`、`1`、`2`、`3`、`s` 或 `z` 中的一个。
   - 默认值为 `2`，即 `O2`。
8. 输入的 WASM 文件（`/path/to/wasm/file`）。
9. 输出路径（`/path/to/output/file`）。
   - 默认情况下，`wasmedge compile` 命令将输出[通用的 WASM 格式](#output-format-universal-wasm)。
   - 如果在输出路径中指定了特定的文件扩展名（在 Linux 上为 `.so`，在 MacOS 上为 `.dylib`，在 Windows 上为 `.dll`），`wasmedge compile` 命令将输出[共享库格式](#output-format-shared-library)。

## 示例

我们创建了纯手工编写的 [fibonacci.wat](https://github.com/WasmEdge/WasmEdge/raw/master/examples/wasm/fibonacci.wat) 并使用 [wat2wasm](https://webassembly.github.io/wabt/demo/wat2wasm/) 工具将其转换为 `fibonacci.wasm` WebAssembly 程序。以此为例，将它导出为一个接收单个 `i32` 整数作为输入参数的 `fib()` 函数。

你可以执行：

```bash
wasmedge compile fibonacci.wasm fibonacci_aot.wasm
```

或者：

```bash
wasmedge compile fibonacci.wasm fibonacci_aot.so # 在 Linux 上
```

输出将会是：

```bash
[2022-09-09 14:22:10.540] [info] compile start
[2022-09-09 14:22:10.541] [info] verify start
[2022-09-09 14:22:10.542] [info] optimize start
[2022-09-09 14:22:10.547] [info] codegen start
[2022-09-09 14:22:10.552] [info] output start
[2022-09-09 14:22:10.600] [info] compile done
```

然后，你可以使用 `wasmedge` 执行输出文件并测量执行时间：

```bash
time wasmedge --reactor fibonacci_aot.wasm fib 30
```

输出将会是：

```bash
1346269

real    0m0.029s
user    0m0.012s
sys     0m0.014s
```

接着，你可以与解释器模式进行比较：

```bash
time wasmedge --reactor fibonacci.wasm fib 30
```

输出显示，AOT 编译的 WASM 比解释器模式快得多：

```bash
1346269

real    0m0.442s
user    0m0.427s
sys     0m0.012s
```

## 输出格式：通用 WASM

默认情况下，`wasmedge compile` AOT 编译器工具可以将 AOT 编译的本机二进制文件包装为原始 WASM 文件中的自定义部分。我们称其为通用 WASM 二进制格式。

这个 AOT 编译的 WASM 文件与所有的 WebAssembly runtime 兼容。但是，当 WasmEdge runtime 执行此 WASM 文件时，WasmEdge 将从自定义部分提取本机二进制并以 AOT 模式执行它。

<!-- prettier-ignore -->
:::note
在 MacOS 平台上，通用 WASM 格式在执行时会产生 `bus error`。默认情况下，`wasmedge compile` 工具会以 `O2` 级别优化 WASM。我们正在尝试解决此问题。请使用共享库输出格式以暂时解决此问题。
:::

```bash
wasmedge compile app.wasm app_aot.wasm
wasmedge app_aot.wasm
```

## 输出格式：共享库

用户可以为输出文件指定共享库扩展名（在 Linux 上为 `.so`，在 MacOS 上为 `.dylib`，在 Windows 上为 `.dll`），以生成共享库格式的输出。

这个 AOT 编译的 WASM 文件仅供 WasmEdge 使用，其他 WebAssembly runtime 无法使用。

```bash
wasmedge compile app.wasm app_aot.so
wasmedge app_aot.so
```
