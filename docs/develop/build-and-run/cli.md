---
sidebar_position: 2
---

# The `wasmedge` CLI

After intalling WasmEdge, you can use the `wasmedge` CLI to execute a compiled wasm file. We will cover how to run Wasm files with WasmEdge on your own machine and Docker images.

The `wasmedge` binary is a command line interface (CLI) program that runs WebAssembly programs.

- If the WebAssembly program contains a `main()` function, `wasmedge` would execute it as a standalone program in the command mode.
- If the WebAssembly program contains one or more exported public functions, `wasmedge` could invoke individual functions in the reactor mode.

By default, the `wasmedge` will execute WebAssembly programs in interpreter mode, and [execute the AOT-compiled `.so`, `.dylib`, `.dll`, or `.wasm` (universal output format) in AOT mode](aot.md). If you want to accelerate the WASM execution, we recommend to [compile the WebAssembly with the AOT compiler](aot.md) first.

```bash
$ wasmedge -v
wasmedge version {{ wasmedge_version }}
```

Users can run the `wasmedge -h` for realizing the command line options quickly, or [refer to the detailed `wasmedge` CLI options here](#options).The usage of the `wasmedge` tool will be:

```bash
$ wasmedge -h
USAGE
   wasmedge [OPTIONS] [--] WASM_OR_SO [ARG ...]

...
```

If users install WasmEdge from the install script with the option `-e tf,image`, the WasmEdge CLI tools with TensorFlow and TensorFlow-Lite extensions will be installed alongside.

- `wasmedge-tensorflow` CLI tool
  - The `wasmedge` tool with TensorFlow, TensorFlow-Lite, and `wasmedge-image` extensions.
  - Only on `x86_64` and `aarch64` Linux platforms and `x86_64` MacOS.
- `wasmedge-tensorflow-lite` CLI tool
  - The `wasmedge` tool with TensorFlow-Lite, and `wasmedge-image` extensions.
  - Only on `x86_64` and `aarch64` Linux platforms, Android, and `x86_64` MacOS.

The `wasmedge` CLI tool will execute the wasm file in ahead-of-time(AOT) mode or interpreter mode. If the file has been compiled with `wasmedgec`, then WasmEdge will execute it in AOT mode, otherwise WasmEdge will execute it in interpreter mode.

## Options

The options of the `wasmedge` CLI tool are as follows:

1. `-v|--version`: Show the version information. Will ignore other arguments below.
2. `-h|--help`: Show the help messages. Will ignore other arguments below.
3. (Optional) `--reactor`: Enable the reactor mode.
    - In the reactor mode, `wasmedge` runs a specified function exported by the WebAssembly program.
    - WasmEdge will execute the function which name should be given in `ARG[0]`.
    - If there's an exported function which names `_initialize`, the function will be executed with the empty parameter at first.
4. (Optional) `--dir`: Bind directories into WASI virtual filesystem.
    - Use `--dir guest_path:host_path` to bind the host path into the guest path in WASI virtual system.
5. (Optional) `--env`: Assign the environment variables in WASI.
    - Use `--env ENV_NAME=VALUE` to assign the environment variable.
6. (Optional) Statistics information:
    - Use `--enable-time-measuring` to show the execution time.
    - Use `--enable-gas-measuring` to show the amount of used gas.
    - Use `--enable-instruction-count` to display the number of executed instructions.
    - Or use `--enable-all-statistics` to enable all of the statistics options.
7. (Optional) Resource limitations:
    - Use `--time-limit MILLISECOND_TIME` to limit the execution time. Default value is `0` which specifies no limitation.
    - Use `--gas-limit GAS_LIMIT` to limit the execution cost.
    - Use `--memory-page-limit PAGE_COUNT` to set the limitation of pages(as size of 64 KiB) in every memory instance.
8. (Optional) WebAssembly proposals:
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
9. WASM file (`/path/to/wasm/file`).
10. (Optional) `ARG` command line arguments array.
    - In reactor mode, the first argument will be the function name, and the arguments after `ARG[0]` will be parameters of wasm function `ARG[0]`.
    - In command mode, the arguments will be the command line arguments of the WASI `_start` function. They are also known as command line arguments(`argv`) for a standalone C/C++ program.

## Examples

### Build and run a standalone WebAssembly app

The Hello world example is a standalone Rust application that can be executed by the [WasmEdge CLI](../build-and-run/cli). Its source code and build instructions are available [here](https://github.com/second-state/rust-examples/tree/main/hello).

You will need to have the [Rust compiler installed](https://github.com/second-state/rust-examples/blob/main/README.md#prerequisites), and then use the following command to build the Wasm bytecode file from the Rust source code.

```bash
cargo build --target wasm32-wasi --release
```

You can then use the `wasmedge` command to run the program.

```bash
$ wasmedge target/wasm32-wasi/release/hello.wasm
Hello WasmEdge!
```

#### Execute with `statistics` enabled

The CLI supports `--enable-all-statistics` flags for the statistics and gas metering.

You can run:

```bash
wasmedge --enable-all-statistics hello.wasm
```

The output will be:

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

#### Execute with `gas-limit` enabled

The CLI supports `--gas-limit` flags for controlling the execution costs.

For giving sufficient gas as the example, you can run:

```bash
wasmedge --enable-all-statistics --gas-limit 20425 hello.wasm
```

The output will be:

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

For giving insufficient gas as the example, you can run:

```bash
wasmedge --enable-all-statistics --gas-limit 20 hello.wasm
```

The output will be:

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

### Call a WebAssembly function compiled from Rust

The [add](https://github.com/second-state/wasm-learning/tree/master/cli/add) program is written in Rust and contains an exported `add()` function. You can compile it into WebAssembly and use `wasmedge` to call the `add()` function. In this example, you will see how it is done from the CLI. It is often used when you embed WasmEdge into another host application, and need to call a Wasm function from the host.

You will need to have the [Rust compiler](https://github.com/second-state/rust-examples/blob/main/README.md#prerequisites) installed, and then use the following command to build the Wasm bytecode file from the Rust source code.

```bash
cargo build --target wasm32-wasi --release
```

You can execute `wasmedge` in reactor mode to invoke the `add()` function with two `i32` integer input parameters.

```bash
wasmedge --reactor add.wasm add 2 2
```

The output will be:

```bash
4
```

### Call a WebAssembly function written in WAT

We created the hand-written [fibonacci.wat](https://github.com/WasmEdge/WasmEdge/raw/master/examples/wasm/fibonacci.wat) and used the [wat2wasm](https://webassembly.github.io/wabt/demo/wat2wasm/) tool to convert it into the [fibonacci.wasm](https://github.com/WasmEdge/WasmEdge/raw/master/examples/wasm/fibonacci.wasm) WebAssembly program. It exported a `fib()` function which takes a single `i32` integer as the input parameter. We can execute `wasmedge` in reactor mode to invoke the exported function.

You can run:

```bash
wasmedge --reactor fibonacci.wasm fib 10
```

The output will be:

```bash
89
```

### JavaScript examples

It is possible to use WasmEdge as a high-performance, secure, extensible, easy to deploy, and [Kubernetes-compliant](https://github.com/second-state/wasmedge-containers-examples) JavaScript runtime. There is no need to build a JavaScript app. You just need to download the WasmEdge JavaScript runtime for Node.js.

- [Download the wasmedge_quickjs.wasm file here](https://github.com/second-state/wasmedge-quickjs/releases/download/v0.5.0-alpha/wasmedge_quickjs.wasm)
- [Download the modules.zip file here](https://github.com/second-state/wasmedge-quickjs/releases/download/v0.5.0-alpha/modules.zip) and then unzip it into the current folder as `./modules/`

```bash
wget https://github.com/second-state/wasmedge-quickjs/releases/download/v0.5.0-alpha/wasmedge_quickjs.wasm
wget https://github.com/second-state/wasmedge-quickjs/releases/download/v0.5.0-alpha/modules.zip
unzip modules.zip
```

The [hello.js](https://github.com/WasmEdge/WasmEdge/raw/master/examples/js/hello.js) file is a very simple JavaScript program. You can run:

```bash
wasmedge --dir .:. wasmedge_quickjs.wasm hello.js 1 2 3
```

The output will be:

```bash
Hello 1 2 3
```

The [qjs_tf.wasm](https://github.com/WasmEdge/WasmEdge/raw/master/examples/wasm/js/qjs_tf.wasm) is a JavaScript interpreter with [WasmEdge Tensorflow extension](https://www.secondstate.io/articles/wasi-tensorflow/) compiled into WebAssembly. To run [qjs_tf.wasm](https://github.com/WasmEdge/WasmEdge/raw/master/examples/wasm/js/qjs_tf.wasm), you must use the `wasmedge-tensorflow-lite` CLI tool, which is a build of WasmEdge with Tensorflow-Lite extension built-in. You can download a full [Tensorflow-based JavaScript example](https://github.com/second-state/wasmedge-quickjs/tree/main/example_js/tensorflow_lite_demo) to classify images.

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

## Docker images for the CLI tools

The Docker images in this section are mostly used for development purposes. They allow you to use WasmEdge tools in containerized Linux environments. If you want to containerize Wasm apps, check out [this](../getting-started/quick_start_docker) section.

The `wasmedge/slim:{version}` Docker images provide a slim WasmEdge images built with [DockerSlim](https://dockersl.im) every releases.

- Image `wasmedge/slim-runtime:{version}` includes only WasmEdge runtime with `wasmedge` command.
- Image `wasmedge/slim:{version}` includes the following command line utilities:
  - `wasmedge`
  - `wasmedgec`
- Image `wasmedge/slim-tf:{version}` includes the following command line utilities:
  - `wasmedge`
  - `wasmedgec`
  - `wasmedge-tensorflow-lite`
  - `wasmedge-tensorflow`
  - `show-tflite-tensor`
- The working directory of the release docker image is `/app`.

### Dockerslim Examples

Afer pulling the docker iamge successfully, you could use `wasmedgec` and `wasmedge` to aot compile the wasm file and run the wasm app.

```bash
$ docker pull wasmedge/slim:{{ wasmedge_version }}

$ docker run -it --rm -v $PWD:/app wasmedge/slim:{{ wasmedge_version }} wasmedgec hello.wasm hello.aot.wasm
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

Use `wasmedge-tensorflow-lite` ([link](https://github.com/WasmEdge/WasmEdge/tree/master/examples/js)):

```bash
$ docker pull wasmedge/slim-tf:{{ wasmedge_version }}
$ wget https://raw.githubusercontent.com/second-state/wasmedge-quickjs/main/example_js/tensorflow_lite_demo/aiy_food_V1_labelmap.txt
$ wget https://raw.githubusercontent.com/second-state/wasmedge-quickjs/main/example_js/tensorflow_lite_demo/food.jpg
$ wget https://raw.githubusercontent.com/second-state/wasmedge-quickjs/main/example_js/tensorflow_lite_demo/lite-model_aiy_vision_classifier_food_V1_1.tflite
$ wget https://raw.githubusercontent.com/second-state/wasmedge-quickjs/main/example_js/tensorflow_lite_demo/main.js

$ docker run -it --rm -v $PWD:/app wasmedge/slim-tf:{{ wasmedge_version }} wasmedge-tensorflow-lite --dir .:. qjs_tf.wasm main.js
label:
Hot dog
confidence:
0.8941176470588236
```
