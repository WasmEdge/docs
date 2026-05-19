---
sidebar_position: 1
---

# 設定 Rust 工具鏈

在接下來的章節中，我們將示範如何將 Rust 程式建置與編譯為 WASM 位元組碼，並在 WasmEdge 上執行。

開始之前，先設定我們所需的軟體。

## 安裝 WasmEdge

使用下列命令在您的機器上安裝 WasmEdge。若您使用的是 Windows 或其他非類 Unix 平台，請參考 [WasmEdge 安裝說明](../../start/install.md#install)。

```bash
curl -sSf https://raw.githubusercontent.com/WasmEdge/WasmEdge/master/utils/install.sh | bash
```

## 安裝 Rust

使用下列命令在您的機器上安裝 Rust。若您使用的是 Windows 或其他非類 Unix 平台，請參考 [Rust 安裝說明](https://www.rust-lang.org/tools/install)。

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

## 設定 Rust 編譯器的目標

為了建置可在類似 WasmEdge 的伺服器端 WebAssembly 環境中執行的 WASM 檔案，在 Rust 安裝完成之後，我們需要為 Rust 編譯器加入 `wasm32-wasip1` 目標。

```bash
rustup target add wasm32-wasip1
```

## 網路應用程式的特別說明

### Tokio 支援

WasmEdge 支援由 [Tokio](https://tokio.rs/) 與相關 crate 所提供的非同步網路 API。如果您的 `Cargo.toml` 內有 tokio，您需要加入一些設定旗標，協助 Rust 編譯器在函式庫原始碼中選擇正確的特性分支。下方是一個將 tokio 應用程式編譯為 Wasm 的 `cargo build` 命令範例。

```bash
RUSTFLAGS="--cfg wasmedge --cfg tokio_unstable" cargo build --target wasm32-wasip1 --release
```

或者，您可以將以下幾行加入 `.cargo/config.toml` 檔案。

```toml
[build]
target = "wasm32-wasip1"
rustflags = ["--cfg", "wasmedge", "--cfg", "tokio_unstable"]
```

在 `.cargo/config.toml` 中加入這幾行之後，您就可以直接使用一般的 `cargo` 命令。

```bash
cargo build --target wasm32-wasip1 --release
```

### MacOS 上的 TLS

標準的 `cargo` 工具鏈在 Linux 上能夠支援 [Rust TLS](https://github.com/rustls/rustls) 函式庫。然而在 MacOS 上，您需要使用官方 [wasi-sdk](https://github.com/WebAssembly/wasi-sdk) 所釋出的特殊版本 Clang 工具，才能支援 TLS 函式庫。

> 當您在 Linux 上將 Rust TLS 原始碼編譯為 Wasm 時，產生的 Wasm 檔案具有跨平台特性，可以在任何已安裝 WasmEdge 的平台上正確執行。本節僅適用於需要在 MacOS 上**編譯** Rust TLS 原始碼的情況。

[下載最新的 wasi-sdk 釋出版本](https://github.com/WebAssembly/wasi-sdk/releases)以符合您的平台，並將其解壓縮至一個資料夾。將 `WASI_SDK_PATH` 變數指向此資料夾，並匯出 `CC` 變數做為預設的 Clang。

```bash
export WASI_SDK_PATH /path/to/wasi-sdk-22.0
export CC="${WASI_SDK_PATH}/bin/clang --sysroot=${WASI_SDK_PATH}/share/wasi-sysroot"
```

這樣就完成了。現在您可以在 MacOS 上使用 `cargo` 工具，並開啟 `rust-tls` 特性來編譯 tokio 函式庫。
