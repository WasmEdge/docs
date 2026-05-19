---
sidebar_position: 1
---

# WasmEdge Go SDK 介紹

以下是使用 WasmEdge Go API 的指南。你可以透過 WasmEdge Go API 將 WasmEdge 嵌入到你的 Go 應用程式中。

## 設定將 WASM 函式嵌入 Go 應用程式的環境

### 安裝並建置 WasmEdge 與 WasmEdge Go SDK

WasmEdge-go 需要 Golang 版本 >= 1.16。安裝前請先確認你的 Golang 版本。你可以在[這裡下載 Golang](https://golang.org/dl/)。

```bash
$ go version
go version go1.16.5 linux/amd64
```

同時,請確認你已安裝與 `WasmEdge-go` 釋出版本相同的 [WasmEdge](../../start/install.md#install)。

```bash
curl -sSf https://raw.githubusercontent.com/WasmEdge/WasmEdge/master/utils/install.sh | bash -s -- -v {{ wasmedge_go_version }}
```

在你的 Go 專案目錄中安裝 `WasmEdge-go` 套件並建置:

```bash
go get github.com/second-state/WasmEdge-go/wasmedge@v{{ wasmedge_go_version }}
go build
```

### 建置 WasmEdge-go 延伸功能

<!-- prettier-ignore -->
:::note
WasmEdge 延伸功能在 0.12.1 版之後已被棄用。請在 0.13.0 版之後使用相對應的外掛。
:::

預設情況下,`WasmEdge-go` 僅啟用基本執行環境。

`WasmEdge-go` 提供以下延伸功能:

- TensorFlow

  - 此延伸功能支援 [WasmEdge-tensorflow](https://github.com/second-state/WasmEdge-tensorflow) 中的主機函式。
  - 要安裝 `tensorflow` 延伸功能,請在 WasmEdge 安裝程式命令中使用 `-e tensorflow` 旗標。
  - 使用此延伸功能時,建置時必須加上 `tensorflow` 標籤:

    ```bash
    go build -tags tensorflow
    ```

- Image

  - 此延伸功能支援 [WasmEdge-image](https://github.com/second-state/WasmEdge-image) 中的主機函式。
  - 要安裝 `image` 延伸功能,請在 WasmEdge 安裝程式命令中使用 `-e image` 旗標。
  - 使用此延伸功能時,建置時必須加上 `image` 標籤:

    ```bash
    go build -tags image
    ```

你也可以在建置時同時啟用多個延伸功能:

```bash
go build -tags image,tensorflow
```

關於範例,請參考[範例儲存庫](https://github.com/second-state/WasmEdge-go-examples/)。

### Go 中的 WasmEdge AOT 編譯器

[go_WasmAOT 範例](https://github.com/second-state/WasmEdge-go-examples/tree/master/go_WasmAOT)示範如何在 Go 應用程式中將 WASM 檔案編譯為原生二進位檔案(AOT 編譯)。

### 將原始碼編譯為 WASM 位元組碼的工具鏈

要將 WasmEdge 嵌入到你的 Go 應用程式並執行 WASM 函式,我們仍需要語言工具鏈將原始碼編譯為 WASM 位元組碼。

- 關於 Rust,請參考 [Rust 設定指南](../../develop/rust/setup.md)

- 關於 Tinygo,請參考 [Tinygo 設定指南](../../develop/go/hello_world.md)

- 關於 C,請參考 [C 設定指南](../../develop/c/hello_world.md)

- 關於 Javascript,你需要把 [WasmEdge-QuickJS](https://github.com/second-state/wasmedge-quickjs) 加入你的 Go 應用程式。請參考[社群範例](https://github.com/Edgenesis/wasm-shifu-demo)。

## 範例

- [嵌入一個獨立的 WASM 應用程式](app.md)
- [嵌入一個 WASM 函式](function.md)
- [傳遞複雜參數到 WASM 函式](passing_data.md)
- [嵌入一個 Tensorflow 推論函式](ai.md)
- [嵌入一個 bindgen 函式](bindgen.md)

## API 參考

- [v0.14.0](reference/latest.md)
- [v0.13.5](reference/0.13.x.md)
- [v0.12.1](reference/0.12.x.md)
- [v0.11.2](reference/0.11.x.md)
- [v0.10.1](reference/0.10.x.md)
- [v0.9.1](reference/0.9.x.md)
