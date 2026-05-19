---
sidebar_position: 1
---

# Python

Python 執行環境有數種不同的語言實作，其中一些支援 WebAssembly。本文件將說明如何在 WasmEdge 上執行 [RustPython](https://github.com/RustPython/RustPython) 以執行 Python 程式。

## 編譯 RustPython

要編譯 RustPython，您必須在機器上安裝 Rust 工具鏈，並啟用對 `wasm32-wasip1` 平台的支援。

```bash
rustup target add wasm32-wasip1
```

接著您可以使用以下命令來複製並編譯 RustPython：

```bash
git clone https://github.com/RustPython/RustPython.git
cd RustPython
cargo build --release --target wasm32-wasip1 --features="freeze-stdlib"
```

啟用 `freeze-stdlib` 功能是為了將 Python 標準函式庫包含在二進位檔案內。輸出檔案應位於 `target/wasm32-wasip1/release/rustpython.wasm`。

## AOT 編譯

WasmEdge 支援將 WebAssembly 位元組碼程式編譯為原生機器碼以獲得更佳效能。強烈建議在執行前先將 RustPython 編譯為原生機器碼。

```bash
wasmedge compile ./target/wasm32-wasip1/release/rustpython.wasm ./target/wasm32-wasip1/release/rustpython.wasm
```

## 執行

```bash
wasmedge ./target/wasm32-wasip1/release/rustpython.wasm
```

接著您便能在 WebAssembly 中取得一個 Python shell！

## 授予檔案系統存取權限

您可以預先開啟目錄，讓 WASI 程式擁有讀寫實際機器上檔案的權限。以下命令將目前的工作目錄掛載到 WASI 虛擬檔案系統。

```bash
wasmedge --dir .:. ./target/wasm32-wasip1/release/rustpython.wasm
```
