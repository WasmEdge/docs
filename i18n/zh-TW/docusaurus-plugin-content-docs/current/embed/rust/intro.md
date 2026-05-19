---
sidebar_position: 1
---

# WasmEdge Rust SDK

## 概觀

WasmEdge Rust SDK 由五個 crate 組成：

- `wasmedge-sdk` crate 定義了一組安全、符合人體工學的高階 API，供開發者用來建構自己的商業應用程式。

- `wasmedge-sys` crate 是 WasmEdge C-API 的包裝，提供安全的對應介面。不建議應用程式開發者直接使用它。`wasmedge-sys`、`wasmedge-types` 與 `wasmedge-macro` 構成了 WasmEdge Rust SDK 的低階層。

- `wasmedge-types` crate 定義了在 `wasmedge-sdk` 與 `wasmedge-sys` 中常用的資料結構。

- `wasmedge-macro` crate 定義了在 `wasmedge-sdk` 與 `wasmedge-sys` 中用來宣告 [主機函式](https://webassembly.github.io/spec/core/exec/runtime.html#:~:text=A%20host%20function%20is%20a,a%20module%20as%20an%20import.) 的常用巨集。

- `async-wasi` crate 提供非同步的 WASI API。

## 使用方式

- 在本機環境部署 WasmEdge 函式庫。

  由於此 crate 依賴 WasmEdge C API，因此必須先在系統中安裝。請參閱 [WasmEdge 安裝與解除安裝](../../start/install.md) 來安裝 WasmEdge 函式庫。下方的版本對照表顯示了每個 `wasmedge-sdk` crate 版本所需的 WasmEdge 函式庫版本。

  | wasmedge-sdk | WasmEdge lib | wasmedge-sys | wasmedge-types | wasmedge-macro | async-wasi |
  | :-: | :-: | :-: | :-: | :-: | :-: |
  | 0.11.0 | 0.13.3 | 0.16.0 | 0.4.3 | 0.6.0 | 0.0.3 |
  | 0.10.1 | 0.13.3 | 0.15.1 | 0.4.2 | 0.5.0 | 0.0.2 |
  | 0.10.0 | 0.13.2 | 0.15.0 | 0.4.2 | 0.5.0 | 0.0.2 |
  | 0.9.0 | 0.13.1 | 0.14.0 | 0.4.2 | 0.4.0 | 0.0.1 |
  | 0.9.0 | 0.13.0 | 0.14.0 | 0.4.2 | 0.4.0 | 0.0.1 |
  | 0.8.1 | 0.12.1 | 0.13.1 | 0.4.1 | 0.3.0 | - |
  | 0.8.0 | 0.12.0 | 0.13.0 | 0.4.1 | 0.3.0 | - |
  | 0.7.1 | 0.11.2 | 0.12.2 | 0.3.1 | 0.3.0 | - |
  | 0.7.0 | 0.11.2 | 0.12 | 0.3.1 | 0.3.0 | - |
  | 0.6.0 | 0.11.2 | 0.11 | 0.3.0 | 0.2.0 | - |
  | 0.5.0 | 0.11.1 | 0.10 | 0.3.0 | 0.1.0 | - |
  | 0.4.0 | 0.11.0 | 0.9 | 0.2.1 | - | - |
  | 0.3.0 | 0.10.1 | 0.8 | 0.2 | - | - |
  | 0.1.0 | 0.10.0 | 0.7 | 0.1 | - | - |

  WasmEdge Rust SDK 會自動搜尋下列路徑以尋找 WasmEdge 函式庫：

  - `/usr/local`（Linux/macOS）
  - `$HOME/.wasmedge`（Linux/macOS）

    請注意，如果您將 WasmEdge 函式庫安裝在其他路徑，可以將 `WASMEDGE_INCLUDE_DIR` 與 `WASMEDGE_LIB_DIR` 環境變數設定為 WasmEdge 函式庫的路徑。

- 將 `wasmedge-sdk` crate 加入您的 `Cargo.toml` 檔案。請注意，根據版本對照表，對應 `WasmEdge v0.13.3` 的 `wasmedge-sdk` 版本為 `0.11.0`。

  ```toml
  wasmedge-sdk = "0.11.0"
  ```

**注意：** 最低支援的 Rust 版本為 1.68。

## 範例

[wasmedge-rustsdk-examples](https://github.com/second-state/wasmedge-rustsdk-examples/tree/main) 提供了一組範例，示範如何使用 `wasmedge-sdk` 來建立主機函式、建立 WebAssembly 函式庫、建立外掛等等。
