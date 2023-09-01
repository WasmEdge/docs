---
sidebar_position: 1
---

# `wasmedge` 命令行工具

在安装了 WasmEdge 后，你可以使用 `wasmedge` 来执行 WASM 文件。我们将介绍如何在你的机器和 Docker 镜像上使用 WasmEdge 运行 WASM 文件。

`wasmedge` 二进制文件是一个命令行界面（CLI）程序，用于运行 WebAssembly 程序。

- 如果 WebAssembly 程序包含 `main()` 函数，`wasmedge` 将把它作为独立程序以命令模式执行。
- 如果 WebAssembly 程序包含一个或多个导出的公共函数，`wasmedge` 可以在反应器模式中调用单个函数。

默认情况下，`wasmedge` 将以解释器模式执行 WebAssembly 程序，并在 AOT 模式下执行 AOT 编译的 `.so`、`.dylib`、`.dll` 或 `.wasm`（通用输出格式）。如果要加速 WASM 执行，我们建议首先使用 [AOT 编译器对 WebAssembly 进行编译](aot.md)。

<!-- prettier-ignore -->
:::note
原始的 `wasmedgec` 工具已更改为 `wasmedge compile`。[`wasmedge compile` CLI 工具](aot.md) 是用于将 WebAssembly 文件编译为本机代码的预先编译器。
:::

```bash
$ wasmedge -v
wasmedge version {{ wasmedge_version }}
```

用户可以运行 `wasmedge -h` 快速了解命令行选项，或者[在这里查看详细的 `wasmedge` CLI 选项](#选项)。`wasmedge` 工具的用法将是：

```bash
$ wasmedge -h
USAGE
   wasmedge [OPTIONS] [--] WASM_OR_SO [ARG ...]

...
```

`wasmedge` CLI 工具将以预先编译（AOT）模式或解释器模式执行 WASM 文件。如果文件已使用 `wasmedge compile` 编译，则 WasmEdge 将以 AOT 模式执行它，否则将以解释器模式执行。

## 选项

`wasmedge` 命令行工具的选项如下：

1. `-v|--version`：显示版本信息。将忽略下面的其他参数。
2. `-h|--help`：显示帮助信息。将忽略下面的其他参数。
3. （可选）`--reactor`：启用反应器模式。
   - 在反应器模式下，`wasmedge` 运行 WebAssembly 程序中导出的特定函数。
   - WasmEdge 将执行函数，函数名应作为 `ARG[0]` 给出。
   - 如果一个导出函数名为 `_initialize`，该函数将首先以空参数执行。
4. （可选）`--dir`：将目录绑定到 WASI 虚拟文件系统。
   - 使用 `--dir guest_path:host_path` 将主机路径绑定到 WASI 虚拟系统中的客户端路径。
5. （可选）`--env`：在 WASI 中分配环境变量。
   - 使用 `--env ENV_NAME=VALUE` 分配环境变量。
6. （可选）统计信息：
   - 使用 `--enable-time-measuring` 显示执行时间。
   - 使用 `--enable-gas-measuring` 显示消耗的 gas 量。
   - 使用 `--enable-instruction-count` 显示执行的指令数量。
   - 或者使用 `--enable-all-statistics` 启用所有统计选项。
7. （可选）资源限制：
   - 使用 `--time-limit MILLISECOND_TIME` 限制执行时间。默认值为 `0`，表示无限制。
   - 使用 `--gas-limit GAS_LIMIT` 限制执行成本。
   - 使用 `--memory-page-limit PAGE_COUNT` 设置每个内存实例中页面（64 KiB 大小）的限制。
8. （可选）WebAssembly 提案：
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
   - 使用 `--enable-all` 启用以上所有提案。
9. WASM 文件（`/path/to/wasm/file`）。
10. （可选）`ARG` 命令行参数数组。
    - 在反应器模式下，第一个参数将是函数名，`ARG[0]` 之后的参数将是 WASM 函数 `ARG[0]` 的参数。
    - 在命令模式下，参数将是 WASI `_start` 函数的命令行参数。它们也被称为独立的 C/C++ 程序的命令行参数（`argv`）。

## TensorFlow 工具

<!-- prettier-ignore -->
:::note
在 0.12.1 版本之后，`WasmEdge-tensorflow-tools` 已被弃用，并在 0.13.0 版本之后由插件替代。
:::

如果用户使用安装脚本并选择 `-e tf,image` 选项安装 WasmEdge，那么 WasmEdge CLI 工具将会安装 TensorFlow 和 TensorFlow-Lite 扩展。

- `wasmedge-tensorflow` CLI 工具
  - 包含 TensorFlow、TensorFlow-Lite 和 `wasmedge-image` 扩展的 `wasmedge` 工具。
  - 仅支持 `x86_64` 和 `aarch64` Linux 平台以及 `x86_64` MacOS。
- `wasmedge-tensorflow-lite` CLI 工具
  - 包含 TensorFlow-Lite 和 `wasmedge-image` 扩展的 `wasmedge` 工具。
  - 仅支持 `x86_64` 和 `aarch64` Linux 平台、Android 和 `x86_64` MacOS。

## 示例

### 构建和运行独立的 WebAssembly 应用

Hello World 示例是一个独立的 Rust 应用程序，可以通过 [WasmEdge 命令行工具](../build-and-run/cli)执行。它的源代码和构建说明可以在[此处](https://github.com/second-state/rust-examples/tree/main/hello)找到。

你需要安装 [Rust 编译器](https://github.com/second-state/rust-examples/blob/main/README.md#prerequisites)，然后使用以下命令从 Rust 源代码构建 WASM 字节码文件。

```bash
cargo build --target wasm32-wasi --release
```

你可以使用 `wasmedge` 指令运行这个程序：

```bash
$ wasmedge target/wasm32-wasi/release/hello.wasm
Hello WasmEdge!
```

#### 开启 `statistics` 并执行

命令行支持 `--enable-all-statistics` 参数，用于启用所有统计选项。

你可以运行：

```bash
wasmedge --enable-all-statistics hello.wasm
```

输出为：

```bash
Hello WasmEdge!
[2021-12-09 16:03:33.261] [info] ====================  Statistics  ====================
[2021-12-09 16:03:33.261] [info]  Total execution time: 268266 ns
[2021-12-09 16:03:33.261] [info]  Wasm instructions execution time: 251610 ns
[2021-12-09 16:03:33.261] [info]  Host functions execution time: 16656 ns
[2021-12-09 16:03:33.261] [info]  Executed wasm instructions count: 20425
[2021-12-09 16:03:33.261] [info]  Gas costs: 20425
[2021-12-09 16:03:33.261] [info]  Instructions per second: 81177218
[2021-12-09 16:03:33.261] [info] =======================   End   ======================
```

#### 开启 `gas-limit` 并执行

命令行支持 `--gas-limit`参数，用于控制执行成本。

下面是提供足够的 Gas 的示例：

```bash
wasmedge --enable-all-statistics --gas-limit 20425 hello.wasm
```

输出为：

```bash
Hello WasmEdge!
[2021-12-09 16:03:33.261] [info] ====================  Statistics  ====================
[2021-12-09 16:03:33.261] [info]  Total execution time: 268266 ns
[2021-12-09 16:03:33.261] [info]  Wasm instructions execution time: 251610 ns
[2021-12-09 16:03:33.261] [info]  Host functions execution time: 16656 ns
[2021-12-09 16:03:33.261] [info]  Executed wasm instructions count: 20425
[2021-12-09 16:03:33.261] [info]  Gas costs: 20425
[2021-12-09 16:03:33.261] [info]  Instructions per second: 81177218
[2021-12-09 16:03:33.261] [info] =======================   End   ======================
```

下面是提供不足的 Gas 的示例：

```bash
wasmedge --enable-all-statistics --gas-limit 20 hello.wasm
```

输出为：

```bash
Hello WasmEdge!
[2021-12-23 15:19:06.690] [error] Cost exceeded limit. Force terminate the execution.
[2021-12-23 15:19:06.690] [error]     In instruction: ref.func (0xd2) , Bytecode offset: 0x00000000
[2021-12-23 15:19:06.690] [error]     At AST node: expression
[2021-12-23 15:19:06.690] [error]     At AST node: element segment
[2021-12-23 15:19:06.690] [error]     At AST node: element section
[2021-12-23 15:19:06.690] [error]     At AST node: module
[2021-12-23 15:19:06.690] [info] ====================  Statistics  ====================
[2021-12-23 15:19:06.690] [info]  Total execution time: 0 ns
[2021-12-23 15:19:06.690] [info]  Wasm instructions execution time: 0 ns
[2021-12-23 15:19:06.690] [info]  Host functions execution time: 0 ns
[2021-12-23 15:19:06.690] [info]  Executed wasm instructions count: 21
[2021-12-23 15:19:06.690] [info]  Gas costs: 20
```

### 调用从 Rust 编译的 WebAssembly 函数

[add](https://github.com/second-state/wasm-learning/tree/master/cli/add) 程序是用 Rust 编写的，包含一个导出的 `add()` 函数。你可以将其编译为 WebAssembly，并使用 `wasmedge` 调用 `add()` 函数。在这个示例中，你将看到如何从 CLI 进行此操作。通常在将 WasmEdge 嵌入到另一个主机应用程序中时，需要从主机调用 WASM 函数。

你需要安装 [Rust 编译器](https://github.com/second-state/rust-examples/blob/main/README.md#prerequisites)，然后使用以下命令从 Rust 源代码构建 WASM 字节码文件。

```bash
cargo build --target wasm32-wasi --release
```

你可以在反应器模式下执行 `wasmedge`，以调用具有两个 `i32` 整数输入参数的 `add()` 函数。

```bash
wasmedge --reactor add.wasm add 2 2
```

输出为：

```bash
4
```

### 调用用 WAT 编写的 WebAssembly 函数

我们创建了纯手工编写的 [fibonacci.wat](https://github.com/WasmEdge/WasmEdge/raw/master/examples/wasm/fibonacci.wat) 文件，并使用 [wat2wasm](https://webassembly.github.io/wabt/demo/wat2wasm/) 工具将其转换为名为 `fibonacci.wasm` 的 WebAssembly 程序。它导出了一个 `fib()` 函数，该函数以单个 `i32` 整数作为输入参数。我们可以在反应器模式下执行 `wasmedge` 来调用导出的函数。

你可以运行：

```bash
wasmedge --reactor fibonacci.wasm fib 10
```

输出为：

```bash
89
```

### JavaScript 示例

使用 WasmEdge 作为高性能、安全、可扩展、易于部署的、符合 [Kubernetes](https://github.com/second-state/wasmedge-containers-examples) 标准的 JavaScript 运行时是可能的。无需构建 JavaScript 应用程序。你需要下载适用于 Node.js 的 WasmEdge JavaScript 运行时。

- [在此处下载 wasmedge_quickjs.wasm 文件](https://github.com/second-state/wasmedge-quickjs/releases/download/v0.5.0-alpha/wasmedge_quickjs.wasm)
- [在此处下载 modules.zip 文件](https://github.com/second-state/wasmedge-quickjs/releases/download/v0.5.0-alpha/modules.zip)，然后解压到当前文件夹中并确保名称为 `./modules/`。

```bash
wget https://github.com/second-state/wasmedge-quickjs/releases/download/v0.5.0-alpha/wasmedge_quickjs.wasm
wget https://github.com/second-state/wasmedge-quickjs/releases/download/v0.5.0-alpha/modules.zip
unzip modules.zip
```

以一个简单的 JavaScript 文件为例。将以下代码保存为 `hello.js`：

```javascript
args = args.slice(1);
print('Hello', ...args);
```

你可以使用下面的命令运行：

```bash
wasmedge --dir .:. wasmedge_quickjs.wasm hello.js 1 2 3
```

输出为：

```bash
Hello 1 2 3
```

[qjs_tf.wasm](https://github.com/WasmEdge/WasmEdge/raw/master/examples/wasm/js/qjs_tf.wasm) 是一个被贬意为 WebAssembly 的包含 [WasmEdge Tensorflow 扩展](https://www.secondstate.io/articles/wasi-tensorflow/) 的 JavaScript 解释器。要运行 [qjs_tf.wasm](https://github.com/WasmEdge/WasmEdge/raw/master/examples/wasm/js/qjs_tf.wasm)，你必须使用 `wasmedge-tensorflow-lite` CLI 工具，这是一个内置了 Tensorflow-Lite 扩展的 WasmEdge 构建版本。你可以下载一个完整的[基于 Tensorflow 的 JavaScript 示例](https://github.com/second-state/wasmedge-quickjs/tree/main/example_js/tensorflow_lite_demo) 进行图像分类。

```bash
# Download the Tensorflow example
$ wget https://raw.githubusercontent.com/second-state/wasmedge-quickjs/main/example_js/tensorflow_lite_demo/aiy_food_V1_labelmap.txt
$ wget https://raw.githubusercontent.com/second-state/wasmedge-quickjs/main/example_js/tensorflow_lite_demo/food.jpg
$ wget https://raw.githubusercontent.com/second-state/wasmedge-quickjs/main/example_js/tensorflow_lite_demo/lite-model_aiy_vision_classifier_food_V1_1.tflite
$ wget https://raw.githubusercontent.com/second-state/wasmedge-quickjs/main/example_js/tensorflow_lite_demo/main.js

$ wasmedge-tensorflow-lite --dir .:. qjs_tf.wasm main.js
label: Hot dog
confidence: 0.8941176470588236
```

## CLI 工具的 Docker 镜像

本节中的 Docker 镜像主要用于开发目的。它允许你在容器化的 Linux 环境中使用 WasmEdge 工具。如果你想要容器化 WASM 应用程序，请查看[此处](../getting-started/quick_start_docker.md)的内容。

`wasmedge/slim:{version}` Docker 镜像提供了使用 [DockerSlim](https://dockersl.im) 构建的精简 WasmEdge 镜像，每次发布都会更新。

- 镜像 `wasmedge/slim-runtime:{version}` 仅包含具有 `wasmedge` 命令的 WasmEdge runtime。
- 镜像 `wasmedge/slim:{version}` 包含以下命令行实用程序：
  - `wasmedge`
  - `wasmedge compile`
- 镜像 `wasmedge/slim-tf:{version}` 包含以下命令行实用程序 (在 0.13.0 版本之后不再推荐使用)：
  - `wasmedge`
  - `wasmedge compile`
  - `wasmedge-tensorflow-lite`
  - `wasmedge-tensorflow`
  - `show-tflite-tensor`
- 发布 Docker 镜像的工作目录是 `/app`。

### Dockerslim 示例

成功拉取 Docker 镜像后，你可以使用 `wasmedge compile` 和 `wasmedge` 进行 AOT 编译 WASM 文件和运行 WASM 应用程序。

```bash
$ docker pull wasmedge/slim:{{ wasmedge_version }}

$ docker run -it --rm -v $PWD:/app wasmedge/slim:{{ wasmedge_version }} wasmedge compile hello.wasm hello.aot.wasm
[2022-07-07 08:15:49.154] [info] compile start
[2022-07-07 08:15:49.163] [info] verify start
[2022-07-07 08:15:49.169] [info] optimize start
[2022-07-07 08:15:49.808] [info] codegen start
[2022-07-07 08:15:50.419] [info] output start
[2022-07-07 08:15:50.421] [info] compile done
[2022-07-07 08:15:50.422] [info] output start

$ docker run -it --rm -v $PWD:/app wasmedge/slim:{{ wasmedge_version }} wasmedge hello.aot.wasm world
hello
world
```

使用 `wasmedge-tensorflow-lite` ([link](https://github.com/WasmEdge/WasmEdge/tree/master/examples/js)):

<!-- prettier-ignore -->
:::note
`WasmEdge-tensorflow-tools` 已在 0.12.1 版本之后被弃用。我们将在未来更新使用 WasmEdge 插件。
:::

```bash
$ docker pull wasmedge/slim-tf:0.12.1
$ wget https://raw.githubusercontent.com/second-state/wasmedge-quickjs/main/example_js/tensorflow_lite_demo/aiy_food_V1_labelmap.txt
$ wget https://raw.githubusercontent.com/second-state/wasmedge-quickjs/main/example_js/tensorflow_lite_demo/food.jpg
$ wget https://raw.githubusercontent.com/second-state/wasmedge-quickjs/main/example_js/tensorflow_lite_demo/lite-model_aiy_vision_classifier_food_V1_1.tflite
$ wget https://raw.githubusercontent.com/second-state/wasmedge-quickjs/main/example_js/tensorflow_lite_demo/main.js

$ docker run -it --rm -v $PWD:/app wasmedge/slim-tf:0.12.1 wasmedge-tensorflow-lite --dir .:. qjs_tf.wasm main.js
label:
Hot dog
confidence:
0.8941176470588236
```
