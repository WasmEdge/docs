---
sidebar_position: 3
---

# AoT 編譯器

[安裝](../install.md#install) 完成後,使用者可以執行 `wasmedge compile` 指令。

`wasmedge compile` 指令的用法為:

```bash
$ wasmedge compile -h
USAGE
   wasmedge compile [OPTIONS] [--] WASM WASM_SO

...
```

`wasmedge compile` 指令可以將 WebAssembly 編譯為原生機器碼(亦即 AOT 編譯器)。對於純 WebAssembly,`wasmedge` 工具會以直譯模式執行 WASM。在使用 `wasmedge compile` AOT 編譯器編譯之後,`wasmedge` 工具可以用 AOT 模式執行 WASM,速度會快很多。

## 選項

`wasmedge compile` 指令的選項如下。

1. `-h|--help`:顯示說明訊息。會忽略以下其他參數。
2. _(選用)_ `--dump`:將 LLVM IR 傾印到 `wasm.ll` 與 `wasm-opt.ll`。
3. _(選用)_ `--interruptible`:產生支援可中斷執行的二進位檔。
   - 預設情況下,AOT 編譯的 WASM 不支援 [非同步執行中的中斷](../../embed/c/reference/0.12.x#async)。
4. _(選用)_ 統計資訊:
   - 預設情況下,即使在執行 `wasmedge` 工具時開啟了相關選項,AOT 編譯的 WASM 也不支援所有統計資料。
   - 使用 `--enable-time-measuring` 產生在執行時啟用時間量測統計的程式碼。
   - 使用 `--enable-gas-measuring` 產生在執行時啟用 gas 量測統計的程式碼。
   - 使用 `--enable-instruction-count` 產生在執行時啟用計算 WebAssembly 指令數量的統計程式碼。
   - 或使用 `--enable-all-statistics` 產生啟用所有統計資料的程式碼。
5. _(選用)_ `--generic-binary`:產生目前主機 CPU 架構的通用二進位檔。
6. _(選用)_ WebAssembly 提案:
   - 使用 `--wasm-1` 將編譯環境設為 WASM 1.0 標準。此標準包含以下提案:
      - [Import/Export of Mutable Globals](https://github.com/WebAssembly/mutable-global)
   - 使用 `--wasm-2` 將編譯環境設為 WASM 2.0 標準。此標準包含 WASM 1.0 與以下提案:
      - [Non-Trapping Float-to-Int Conversions](https://github.com/WebAssembly/nontrapping-float-to-int-conversions)
      - [Sign-Extension Operators](https://github.com/WebAssembly/sign-extension-ops)
      - [Multi-value](https://github.com/WebAssembly/multi-value)
      - [Bulk Memory Operations](https://github.com/WebAssembly/bulk-memory-operations)
      - [Reference Types](https://github.com/WebAssembly/reference-types)
      - [Fixed-width SIMD](https://github.com/webassembly/simd)
   - 使用 `--wasm-3` 將編譯環境設為 WASM 3.0 標準(自 0.16.0 起為目前的預設值)。此標準包含 WASM 2.0 與以下提案:
      - [Tail call](https://github.com/WebAssembly/tail-call)
      - [Extended Constant Expressions](https://github.com/WebAssembly/extended-const)
      - [Typed-Function References](https://github.com/WebAssembly/function-references)
      - [Garbage Collection](https://github.com/WebAssembly/gc)
      - [Multiple Memories](https://github.com/WebAssembly/multi-memory)
      - [Relaxed SIMD](https://github.com/webassembly/relaxed-simd)
      - [Exception Handling (currently not implemented)](https://github.com/WebAssembly/exception-handling)
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
   - 已淘汰:使用 `--enable-tail-call` 啟用 [Tail call](https://github.com/WebAssembly/tail-call) 提案。
   - 已淘汰:使用 `--enable-extended-const` 啟用 [Extended Constant Expressions](https://github.com/WebAssembly/extended-const) 提案。
   - 已淘汰:使用 `--enable-function-reference` 啟用 [Typed-Function References](https://github.com/WebAssembly/function-references) 提案。
   - 已淘汰:使用 `--enable-gc` 啟用 [GC](https://github.com/WebAssembly/gc) 提案。
   - 已淘汰:使用 `--enable-multi-memory` 啟用 [Multiple Memories](https://github.com/WebAssembly/multi-memory) 提案。
   - 已淘汰:使用 `--enable-relaxed-simd` 啟用 [Relaxed SIMD](https://github.com/webassembly/relaxed-simd) 提案。
   - 使用 `--enable-threads` 啟用 [Threads](https://github.com/webassembly/threads) 提案(預設為 `OFF`)。
   - 使用 `--enable-all` 啟用上述所有提案。
7. _(選用)_ `--optimize`:選擇 LLVM 最佳化等級。
   - 使用 `--optimize LEVEL` 設定最佳化等級。`LEVEL` 應為 `0`、`1`、`2`、`3`、`s` 或 `z` 其中之一。
   - 預設值為 `2`,代表 `O2`。
8. 輸入的 WASM 檔案 (`/path/to/wasm/file`)。
9. 輸出路徑 (`/path/to/output/file`)。
   - 預設情況下,`wasmedge compile` 指令會輸出 [通用 WASM 格式](#output-format-universal-wasm)。
   - 如果輸出路徑中指定了特定的副檔名(Linux 上為 `.so`、MacOS 上為 `.dylib`、Windows 上為 `.dll`),`wasmedge compile` 指令會輸出 [共用函式庫格式](#output-format-shared-library)。

## 範例

我們建立了手寫的 [fibonacci.wat](https://github.com/WasmEdge/WasmEdge/raw/master/examples/wasm/fibonacci.wat),並使用 [wat2wasm](https://webassembly.github.io/wabt/demo/wat2wasm/) 工具將其轉換為 `fibonacci.wasm` WebAssembly 程式。以此為例。它匯出了一個 `fib()` 函式,接受單一 `i32` 整數作為輸入參數。

您可以執行:

```bash
wasmedge compile fibonacci.wasm fibonacci_aot.wasm
```

或:

```bash
wasmedge compile fibonacci.wasm fibonacci_aot.so # On Linux.
```

輸出將會是:

```bash
[2022-09-09 14:22:10.540] [info] compile start
[2022-09-09 14:22:10.541] [info] verify start
[2022-09-09 14:22:10.542] [info] optimize start
[2022-09-09 14:22:10.547] [info] codegen start
[2022-09-09 14:22:10.552] [info] output start
[2022-09-09 14:22:10.600] [info] compile done
```

接著您可以用 `wasmedge` 執行輸出檔案並量測執行時間:

```bash
time wasmedge --reactor fibonacci_aot.wasm fib 30
```

輸出將會是:

```bash
1346269

real    0m0.029s
user    0m0.012s
sys     0m0.014s
```

接著您可以與直譯模式比較:

```bash
time wasmedge --reactor fibonacci.wasm fib 30
```

輸出顯示 AOT 編譯的 WASM 比直譯模式快很多:

```bash
1346269

real    0m0.442s
user    0m0.427s
sys     0m0.012s
```

## 輸出格式:通用 WASM

預設情況下,`wasmedge compile` AOT 編譯器工具可以將 AOT 編譯後的原生二進位檔包裝在原始 WASM 檔案的自訂區段中。我們稱之為通用 WASM 二進位格式。

此 AOT 編譯後的 WASM 檔案與任何 WebAssembly 執行環境相容。然而,當此 WASM 檔案由 WasmEdge 執行環境執行時,WasmEdge 會從自訂區段中擷取原生二進位檔,並以 AOT 模式執行它。

<!-- prettier-ignore -->
:::note
在 MacOS 平台上,通用 WASM 格式在執行時會發生 `bus error`。預設情況下,`wasmedge compile` 工具會以 `O2` 等級最佳化 WASM。我們正在嘗試修正此問題。作為暫時的因應措施,請改用共用函式庫輸出格式。
:::

```bash
wasmedge compile app.wasm app_aot.wasm
wasmedge app_aot.wasm
```

## 輸出格式:共用函式庫

使用者可以指定輸出檔的共用函式庫副檔名(Linux 上為 `.so`、MacOS 上為 `.dylib`、Windows 上為 `.dll`)以產生共用函式庫格式的輸出。

此 AOT 編譯後的 WASM 檔案僅供 WasmEdge 使用,無法供其他 WebAssembly 執行環境使用。

```bash
wasmedge compile app.wasm app_aot.so
wasmedge app_aot.so
```
