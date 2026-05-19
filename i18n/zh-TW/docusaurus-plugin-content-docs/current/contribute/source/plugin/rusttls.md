---
sidebar_position: 8
---

# (於 `0.14.0` 後棄用) 建置具有 Rustls 外掛的版本

<!-- prettier-ignore -->
:::note
此外掛在 WasmEdge `0.14.0` 之後已棄用,因為 `rustls` 已被 [`reqwest`](../../../develop/rust/http_service/client.md#the-reqwest-api) 取代。
:::

WasmEdge Rustls 外掛是 WasmEdge 中 OpenSSL 外掛的替代品。它提供 Rust 友善的介面以使用 Rustls 函式庫,Rustls 是 OpenSSL 的現代、快速且更安全的替代方案。

以下是建置 WasmEdge Rustls 外掛的逐步指南:

## 先決條件

請確認您的系統上已安裝下列相依套件:

- Rust:您可以從[官方網站](https://www.rust-lang.org/tools/install) 安裝它。
- CMake:最低版本 3.12。請從[官方網站](https://cmake.org/download/) 安裝。

## Clone WasmEdge 儲存庫

首先,從 GitHub clone WasmEdge 儲存庫:

```bash
git clone https://github.com/WasmEdge/WasmEdge.git
```

## 進入 Rustls 外掛目錄

進入 clone 後儲存庫中的 `wasmedge_rustls` 目錄:

```bash
cd WasmEdge/plugins/wasmedge_rustls
```

## 建置外掛

現在您可以建置 Rustls 外掛。執行下列指令:

```bash
cargo build --release
```

此指令以 release 模式建置外掛。已編譯的執行檔將位於 `target/release` 目錄中。

## 安裝外掛

要安裝外掛,您可以使用 `cargo install` 指令:

```bash
cargo install --path .
```

此指令會將建置出的外掛安裝至您的 Rust 執行檔目錄中。

## 用法

要在 WasmEdge 中使用此外掛,您需要在啟動 WasmEdge 執行環境時指定它:

```bash
wasmedge --dir .:. --reactor --rustls_plugin target/release/libwasmedge_rustls.so your_wasm_file.wasm
```

將 `your_wasm_file.wasm` 替換為您的 WebAssembly 檔案路徑。`--rustls_plugin` 旗標指定 Rustls 外掛的路徑。

就這樣!您已成功建置並安裝 WasmEdge Rustls 外掛。如果您之前在 WasmEdge 執行環境設定中使用 OpenSSL,請務必將 OpenSSL 外掛替換為 Rustls 外掛。

如需更多資訊,您可以參閱 [GitHub 儲存庫](https://github.com/WasmEdge/WasmEdge/tree/master/plugins/wasmedge_rustls)。
