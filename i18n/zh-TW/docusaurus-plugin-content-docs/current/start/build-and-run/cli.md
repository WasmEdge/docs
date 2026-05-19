---
sidebar_position: 1
---

# `wasmedge` CLI

安裝 WasmEdge 之後,您可以使用 `wasmedge` CLI 來執行 WASM 檔案。我們將說明如何在您的機器及 Docker 映像檔上使用 WasmEdge 執行 WASM 檔案。

`wasmedge` 二進位檔是一個命令列介面 (CLI) 程式,用來執行 WebAssembly 程式。

- 如果 WebAssembly 程式包含 `main()` 函式,`wasmedge` 會以命令模式將其作為獨立程式執行。
- 如果 WebAssembly 程式包含一個或多個匯出的公開函式,`wasmedge` 可以在 reactor 模式下呼叫個別函式。

預設情況下,`wasmedge` 會以直譯模式執行 WebAssembly 程式,並以 AOT 模式執行 AOT 編譯的 `.so`、`.dylib`、`.dll` 或 `.wasm`(通用輸出格式)。如果您想要加速 WASM 執行,建議您先 [使用 AOT 編譯器編譯 WebAssembly](aot.md)。

<!-- prettier-ignore -->
:::note
原本的 `wasmedgec` 工具已變更為 `wasmedge compile`。[`wasmedge compile` CLI 工具](aot.md) 是預先編譯器,可將 WebAssembly 檔案編譯為原生程式碼。
:::

```bash
$ wasmedge -v
wasmedge version {{ wasmedge_version }}
```

使用者可以執行 `wasmedge -h` 快速了解命令列選項,或 [參考此處的詳細 `wasmedge` CLI 選項](#options)。`wasmedge` 工具的用法為:

```bash
$ wasmedge -h
USAGE
   wasmedge [OPTIONS] [--] WASM_OR_SO [ARG ...]

...
```

`wasmedge` CLI 工具會以預先編譯 (AOT) 模式或直譯模式執行 wasm 檔案。如果檔案已用 `wasmedge compile` 編譯過,WasmEdge 會以 AOT 模式執行;否則,WasmEdge 會以直譯模式執行。

## 選項

`wasmedge` CLI 工具的選項如下:

1. `-v|--version`:顯示版本資訊。會忽略以下其他參數。
2. `-h|--help`:顯示說明訊息。會忽略以下其他參數。
3. _(選用)_ `--reactor`:啟用 reactor 模式。
   - 在 reactor 模式下,`wasmedge` 會執行由 WebAssembly 程式匯出的指定函式。
   - WasmEdge 會執行的函式名稱應在 `ARG[0]` 中給定。
   - 如果匯出的函式名稱為 `_initialize`,該函式會先以空參數執行。
4. _(選用)_ `--dir`:將目錄繫結至 WASI 虛擬檔案系統。
   - 使用 `--dir guest_path:host_path` 將主機路徑繫結至 WASI 虛擬系統中的訪客路徑。
5. _(選用)_ `--env`:在 WASI 中指派環境變數。
   - 使用 `--env ENV_NAME=VALUE` 指派環境變數。
6. _(選用)_ 統計資訊:
   - 使用 `--enable-time-measuring` 顯示執行時間。
   - 使用 `--enable-gas-measuring` 顯示已用的 gas 數量。
   - 使用 `--enable-instruction-count` 顯示已執行指令的數量。
   - 或使用 `--enable-all-statistics` 啟用所有統計選項。
   - 使用 `--log-level=LEVEL` 控制紀錄等級。有效值為 `off`、`trace`、`debug`、`info`、`warning`、`error`、`fatal`。預設為 `info`。
7. _(選用)_ 資源限制:
   - 使用 `--time-limit MILLISECOND_TIME` 限制執行時間。預設值為 `0`,代表無限制。
   - 使用 `--gas-limit GAS_LIMIT` 限制執行成本。
   - 使用 `--memory-page-limit PAGE_COUNT` 設定每個記憶體實體中分頁(每頁 64 KiB)的限制。
8. _(選用)_ 執行模式:
   - 使用 `--run-mode=<interpreter|jit|aot>` 選擇 WASM 執行引擎(不分大小寫,預設為 `interpreter`)。自 `0.17.0` 起可用。
   - 已淘汰:使用 `--force-interpreter` 強制以直譯模式執行 WASM。請改用 `--run-mode=interpreter`。
   - 已淘汰:使用 `--enable-jit` 啟用 Just-In-Time 編譯器來執行 WASM。請改用 `--run-mode=jit`。
9. _(選用)_ WebAssembly 提案:
   - 使用 `--wasm-1` 將執行環境設為 WASM 1.0 標準。此標準包含以下提案:
      - [Import/Export of Mutable Globals](https://github.com/WebAssembly/mutable-global)
   - 使用 `--wasm-2` 將執行環境設為 WASM 2.0 標準。此標準包含 WASM 1.0 與以下提案:
      - [Non-Trapping Float-to-Int Conversions](https://github.com/WebAssembly/nontrapping-float-to-int-conversions)
      - [Sign-Extension Operators](https://github.com/WebAssembly/sign-extension-ops)
      - [Multi-value](https://github.com/WebAssembly/multi-value)
      - [Bulk Memory Operations](https://github.com/WebAssembly/bulk-memory-operations)
      - [Reference Types](https://github.com/WebAssembly/reference-types)
      - [Fixed-width SIMD](https://github.com/webassembly/simd)
   - 使用 `--wasm-3` 將執行環境設為 WASM 3.0 標準(自 0.16.0 起為目前的預設值)。此標準包含 WASM 2.0 與以下提案:
      - [Tail call](https://github.com/WebAssembly/tail-call)
      - [Extended Constant Expressions](https://github.com/WebAssembly/extended-const)
      - [Typed-Function References](https://github.com/WebAssembly/function-references)
      - [Garbage Collection](https://github.com/WebAssembly/gc)
      - [Multiple Memories](https://github.com/WebAssembly/multi-memory)
      - [Relaxed SIMD](https://github.com/webassembly/relaxed-simd)
      - [Exception Handling](https://github.com/WebAssembly/exception-handling)
      - [Memory64](https://github.com/WebAssembly/memory64)
   - 使用 `--disable-import-export-mut-globals` 停用 [Import/Export of Mutable Globals](https://github.com/WebAssembly/mutable-global) 提案(預設為 `ON`)。
   - 使用 `--disable-non-trap-float-to-int` 停用 [Non-Trapping Float-to-Int Conversions](https://github.com/WebAssembly/nontrapping-float-to-int-conversions) 提案(預設為 `ON`)。
   - 使用 `--disable-sign-extension-operators` 停用 [Sign-Extension Operators](https://github.com/WebAssembly/sign-extension-ops) 提案(預設為 `ON`)。
   - 使用 `--disable-multi-value` 停用 [Multi-value](https://github.com/WebAssembly/multi-value) 提案(預設為 `ON`)。
   - 使用 `--disable-bulk-memory` 停用 [Bulk Memory Operations](https://github.com/WebAssembly/bulk-memory-operations) 提案(預設為 `ON`)。
   - 使用 `--disable-reference-types` 停用 [Reference Types](https://github.com/WebAssembly/reference-types) 提案(預設為 `ON`)。
   - 使用 `--disable-simd` 停用 [Fixed-width SIMD](https://github.com/webassembly/simd) 提案(預設為 `ON`)。
   - 使用 `--disable-tail-call` 停用 [Tail call](https://github.com/WebAssembly/tail-call) 提案(預設為 `ON`)。
   - 使用 `--disable-extended-const` 停用 [Extended Constant Expressions](https://github.com/WebAssembly/extended-const) 提案(預設為 `ON`)。
   - 使用 `--disable-function-reference` 停用 [Typed-Function References](https://github.com/WebAssembly/function-references) 提案(預設為 `ON`)。
   - 使用 `--disable-gc` 停用 [Garbage Collection](https://github.com/WebAssembly/gc) 提案(預設為 `ON`)。
   - 使用 `--disable-multi-memory` 停用 [Multiple Memories](https://github.com/WebAssembly/multi-memory) 提案(預設為 `ON`)。
   - 使用 `--disable-relaxed-simd` 停用 [Relaxed SIMD](https://github.com/webassembly/relaxed-simd) 提案(預設為 `ON`)。
   - 使用 `--disable-exception-handling` 停用 [Exception Handling](https://github.com/WebAssembly/exception-handling) 提案(預設為 `ON`,僅限直譯模式)。
   - 已淘汰:使用 `--enable-tail-call` 啟用 [Tail call](https://github.com/WebAssembly/tail-call) 提案。
   - 已淘汰:使用 `--enable-extended-const` 啟用 [Extended Constant Expressions](https://github.com/WebAssembly/extended-const) 提案。
   - 已淘汰:使用 `--enable-function-reference` 啟用 [Typed-Function References](https://github.com/WebAssembly/function-references) 提案。
   - 已淘汰:使用 `--enable-gc` 啟用 [GC](https://github.com/WebAssembly/gc) 提案。
   - 已淘汰:使用 `--enable-multi-memory` 啟用 [Multiple Memories](https://github.com/WebAssembly/multi-memory) 提案。
   - 已淘汰:使用 `--enable-relaxed-simd` 啟用 [Relaxed SIMD](https://github.com/webassembly/relaxed-simd) 提案。
   - 已淘汰:使用 `--enable-exception-handling` 啟用 [Exception Handling](https://github.com/WebAssembly/exception-handling) 提案。
   - 使用 `--enable-threads` 啟用 [Threads](https://github.com/webassembly/threads) 提案(預設為 `OFF`)。
   - 使用 `--enable-component` 啟用 [Component Model](https://github.com/WebAssembly/component-model) 提案(預設為 `OFF`,僅限載入器與驗證器階段)。
   - 使用 `--enable-all` 啟用上述所有提案。
10. WASM 檔案 (`/path/to/wasm/file`)。
11. _(選用)_ `ARG` 命令列引數陣列。
    - 在 reactor 模式下,第一個引數會是函式名稱,而 `ARG[0]` 之後的引數則是 wasm 函式 `ARG[0]` 的參數。
    - 在命令模式下,引數則是 WASI `_start` 函式的命令列引數。它們也稱為獨立 C/C++ 程式的命令列引數 (`argv`)。

## TensorFlow 工具

<!-- prettier-ignore -->
:::note
`WasmEdge-tensorflow-tools` 已於 0.12.1 版本之後淘汰,並於 0.13.0 版本後由外掛取代。
:::

如果使用者在安裝腳本中使用 `-e tf,image` 選項安裝 WasmEdge,則同時也會安裝具備 TensorFlow 與 TensorFlow-Lite 擴充功能的 WasmEdge CLI 工具。

- `wasmedge-tensorflow` CLI 工具
  - 具備 TensorFlow、TensorFlow-Lite 與 `wasmedge-image` 擴充功能的 `wasmedge` 工具。
  - 僅支援 `x86_64` 與 `aarch64` Linux 平台以及 `x86_64` MacOS。
- `wasmedge-tensorflow-lite` CLI 工具
  - 具備 TensorFlow-Lite 與 `wasmedge-image` 擴充功能的 `wasmedge` 工具。
  - 僅支援 `x86_64` 與 `aarch64` Linux 平台、Android 以及 `x86_64` MacOS。

## 範例

### 建置並執行獨立的 WebAssembly 應用程式

Hello World 範例是一個獨立的 Rust 應用程式,可以透過 [WasmEdge CLI](../build-and-run/cli) 執行。其原始碼與建置說明請參考 [此處](https://github.com/second-state/rust-examples/tree/main/hello)。

您需要先 [安裝 Rust 編譯器](https://github.com/second-state/rust-examples/blob/main/README.md#prerequisites),然後使用以下指令從 Rust 原始碼建置 WASM 位元組碼檔案。

```bash
cargo build --target wasm32-wasip1 --release
```

接著您可以使用 `wasmedge` 指令執行程式。

```bash
$ wasmedge target/wasm32-wasip1/release/hello.wasm
Hello WasmEdge!
```

#### 啟用 `statistics` 執行

CLI 支援 `--enable-all-statistics` 旗標,用於統計資訊與 gas 計量。

您可以執行:

```bash
wasmedge --enable-all-statistics hello.wasm
```

輸出將會是:

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

#### 啟用 `gas-limit` 執行

CLI 支援 `--gas-limit` 旗標,用於控制執行成本。

以提供足夠 gas 為例,您可以執行:

```bash
wasmedge --enable-all-statistics --gas-limit 20425 hello.wasm
```

輸出將會是:

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

以提供不足 gas 為例,您可以執行:

```bash
wasmedge --enable-all-statistics --gas-limit 20 hello.wasm
```

輸出將會是:

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

### 呼叫由 Rust 編譯而成的 WebAssembly 函式

[add](https://github.com/second-state/wasm-learning/tree/master/cli/add) 程式以 Rust 撰寫,並包含一個匯出的 `add()` 函式。您可以將其編譯為 WebAssembly 並使用 `wasmedge` 呼叫 `add()` 函式。在此範例中,您將看到如何從 CLI 完成此操作。當您將 WasmEdge 嵌入另一個主機應用程式中,並需要從主機呼叫 WASM 函式時,這常會被用到。

您需要先 [安裝 Rust 編譯器](https://github.com/second-state/rust-examples/blob/main/README.md#prerequisites),然後使用以下指令從 Rust 原始碼建置 WASM 位元組碼檔案。

```bash
cargo build --target wasm32-wasip1 --release
```

您可以在 reactor 模式下執行 `wasmedge`,使用兩個 `i32` 整數輸入參數呼叫 `add()` 函式。

```bash
wasmedge --reactor add.wasm add 2 2
```

輸出將會是:

```bash
4
```

### 呼叫以 WAT 撰寫的 WebAssembly 函式

我們建立了手寫的 [fibonacci.wat](https://github.com/WasmEdge/WasmEdge/raw/master/examples/wasm/fibonacci.wat),並使用 [wat2wasm](https://webassembly.github.io/wabt/demo/wat2wasm/) 工具將其轉換為 `fibonacci.wasm` WebAssembly 程式。它匯出了一個 `fib()` 函式,接受單一 `i32` 整數作為輸入參數。我們可以在 reactor 模式下執行 `wasmedge` 呼叫已匯出的函式。

您可以執行:

```bash
wasmedge --reactor fibonacci.wasm fib 10
```

輸出將會是:

```bash
89
```

### JavaScript 範例

使用 WasmEdge 作為高效能、安全、可擴充、易於部署且 [符合 Kubernetes](https://github.com/second-state/wasmedge-containers-examples) 的 JavaScript 執行環境是可行的。您不需要建置 JavaScript 應用程式。您需要為 Node.js 下載 WasmEdge JavaScript 執行環境。

- [從此處下載 wasmedge_quickjs.wasm 檔案](https://github.com/second-state/wasmedge-quickjs/releases/download/v0.5.0-alpha/wasmedge_quickjs.wasm)
- [從此處下載 modules.zip 檔案](https://github.com/second-state/wasmedge-quickjs/releases/download/v0.5.0-alpha/modules.zip),並將其解壓縮到目前資料夾中作為 `./modules/`

```bash
wget https://github.com/second-state/wasmedge-quickjs/releases/download/v0.5.0-alpha/wasmedge_quickjs.wasm
wget https://github.com/second-state/wasmedge-quickjs/releases/download/v0.5.0-alpha/modules.zip
unzip modules.zip
```

以一個簡單的 JavaScript 檔案為例。將以下程式碼存為 `hello.js`:

```javascript
args = args.slice(1);
print('Hello', ...args);
```

您可以執行:

```bash
wasmedge --dir .:. wasmedge_quickjs.wasm hello.js 1 2 3
```

輸出將會是:

```bash
Hello 1 2 3
```

[qjs_tf.wasm](https://github.com/WasmEdge/WasmEdge/raw/master/examples/wasm/js/qjs_tf.wasm) 是將 [WasmEdge Tensorflow 擴充功能](https://www.secondstate.io/articles/wasi-tensorflow/) 編譯進 WebAssembly 的 JavaScript 直譯器。若要執行 [qjs_tf.wasm](https://github.com/WasmEdge/WasmEdge/raw/master/examples/wasm/js/qjs_tf.wasm),您必須使用 `wasmedge-tensorflow-lite` CLI 工具,它是內建 Tensorflow-Lite 擴充功能的 WasmEdge 建置版本。您可以下載完整的 [基於 Tensorflow 的 JavaScript 範例](https://github.com/second-state/wasmedge-quickjs/tree/main/example_js/tensorflow_lite_demo) 來分類影像。

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

## CLI 工具的 Docker 映像檔

本節中的 Docker 映像檔主要用於開發目的。它們讓您可以在容器化的 Linux 環境中使用 WasmEdge 工具。如果您想要將 WASM 應用程式容器化,請參考 [此](../getting-started/quick_start_docker.md) 章節。

`wasmedge/slim:{version}` Docker 映像檔提供使用 [DockerSlim](https://dockersl.im) 在每次發行版本建置的精簡 WasmEdge 映像檔。

- 映像檔 `wasmedge/slim-runtime:{version}` 僅包含 WasmEdge 執行環境及 `wasmedge` 指令。
- 映像檔 `wasmedge/slim:{version}` 包含以下命令列工具:
  - `wasmedge`
  - `wasmedge compile`
- 映像檔 `wasmedge/slim-tf:{version}` 包含以下命令列工具(0.13.0 之後已淘汰):
  - `wasmedge`
  - `wasmedge compile`
  - `wasmedge-tensorflow-lite`
  - `wasmedge-tensorflow`
  - `show-tflite-tensor`
- 發行版 docker 映像檔的工作目錄為 `/app`。

### Dockerslim 範例

成功拉取 docker 映像檔之後,您可以使用 `wasmedge compile` 與 `wasmedge` 來 AOT 編譯 wasm 檔案並執行 wasm 應用程式。

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

使用 `wasmedge-tensorflow-lite` ([連結](https://github.com/WasmEdge/WasmEdge/tree/master/examples/js)):

<!-- prettier-ignore -->
:::note
`WasmEdge-tensorflow-tools` 已於 0.12.1 版本之後淘汰。未來我們將改用 WasmEdge 外掛。
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
