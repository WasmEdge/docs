---
sidebar_position: 1
---

# 安裝說明

要使用 WasmEdge 語言 SDK,你必須先安裝 WasmEdge 本身。請特別注意,WasmEdge 語言 SDK 的版本必須與 WasmEdge 的版本相同。例如,如果你想使用 WasmEdge Go SDK v{{ wasmedge_go_version }},那麼你的 WasmEdge 版本也必須是 {{ wasmedge_go_version }}。

<!-- prettier-ignore -->
:::note
WasmEdge 語言 SDK 的釋出版本會跟隨 WasmEdge 官方版本。我們不會為 WasmEdge 語言 SDK 釋出 alpha、beta 與 RC 版本。關於 WasmEdge 的釋出流程,請參考[這裡](../../contribute/release.md)。
:::

## 以安裝 WasmEdge GO SDK 為例

我們以 WasmEdge Go SDK 為例,展示如何將以 Rust 撰寫的 WASM 應用程式嵌入到 Go 主機應用程式中。

首先,請先確認你已經安裝了 [Go](https://go.dev/dl/)。Golang 的版本必須在 1.16 以上。

接下來,讓我們安裝 WasmEdge 與 WasmEdge Go SDK。再次強調,WasmEdge 與 WasmEdge Go SDK 的版本必須相同。

```bash
$ go version
go version go1.16.5 linux/amd64

# 安裝 WasmEdge
$ curl -sSf https://raw.githubusercontent.com/WasmEdge/WasmEdge/master/utils/install.sh | bash -s -- -v {{ wasmedge_go_version }}

# 安裝 WasmEdge-Go
$ go get github.com/second-state/WasmEdge-go/wasmedge@v{{ wasmedge_go_version }}
```

現在我們已經設定好 WasmEdge 與 WasmEdge Go SDK。接著我們來看看如何使用 Rust 與 wasmedge-bindgen 建立一個 WASM 應用程式。

要將 WasmEdge 嵌入你的主機應用程式中,你必須安裝 WasmEdge 本身以及對應的 WasmEdge 語言繫結。

在這份快速開始指南中,我們以 WasmEdge Go SDK 為例展示運作方式。我們主要會使用 [一個 bindgen 函式](https://github.com/second-state/WasmEdge-go-examples/tree/master/wasmedge-bindgen/go_BindgenFuncs)(以 Rust 撰寫)來示範如何從 Go 應用程式呼叫幾個簡單的 WebAssembly 函式。

開始之前,請先確認你已經安裝 [Go](https://go.dev/dl/)。Golang 的版本必須在 1.16 以上。

首先,讓我們安裝 WasmEdge 與 WasmEdge Go SDK。**它們的版本必須相同**。

```bash
$ go version
go version go1.16.5 linux/amd64

# 安裝 WasmEdge
$ curl -sSf https://raw.githubusercontent.com/WasmEdge/WasmEdge/master/utils/install.sh | bash -s -- -v {{ wasmedge_go_version }}

# 安裝 WasmEdge-Go
$ go get github.com/second-state/WasmEdge-go/wasmedge@v{{ wasmedge_go_version }}

# 安裝 WasmEdge-bindgen 工具,協助我們處理複雜資料的傳遞
$ go get github.com/second-state/wasmedge-bindgen@v0.4.1
```

<!-- prettier-ignore -->
:::note
更多進階功能(例如 AI 推論),請參考 [Go SDK 嵌入 WASM 函式章節](/category/go-sdk-for-embedding-wasmedge)。
:::

由於示範應用程式已包含[編譯好的 WASM 檔案](https://github.com/second-state/WasmEdge-go-examples/blob/master/wasmedge-bindgen/go_BindgenFuncs/rust_bindgen_funcs_lib.wasm),這個檔案是從[該 Rust 函式](https://github.com/second-state/WasmEdge-go-examples/tree/master/wasmedge-bindgen/go_BindgenFuncs/rust_bindgen_funcs)編譯而來,所以我們不需要安裝 Rust 工具鏈來將 Rust 程式碼編譯為 wasm。

## 執行示範

現在我們已經設定好基本環境,讓我們執行範例。

```bash
# 取得這個範例的原始碼
$ git clone https://github.com/second-state/WasmEdge-go-examples.git
$ cd WasmEdge-go-examples//wasmedge-bindgen/go_BindgenFuncs/

# 建置專案
go build

# 執行範例
./bindgen_funcs rust_bindgen_funcs_lib.wasm
```

此範例的標準輸出如下:

```bash
Run bindgen -- create_line: {"points":[{"x":2.5,"y":7.8},{"x":2.5,"y":5.8}],"valid":true,"length":2.0,"desc":"A thin red line"}
Run bindgen -- say: hello bindgen funcs test
Run bindgen -- obfusticate: N dhvpx oebja sbk whzcf bire gur ynml qbt
Run bindgen -- lowest_common_multiple: 246
Run bindgen -- sha3_digest: [87 27 231 209 189 105 251 49 159 10 211 250 15 159 154 181 43 218 26 141 56 199 25 45 60 10 20 163 54 211 195 203]
Run bindgen -- keccak_digest: [126 194 241 200 151 116 227 33 216 99 159 22 107 3 177 169 216 191 114 156 174 193 32 159 246 228 245 133 52 75 55 27]
```

## 取得更好的效能

如果你想取得更好的效能,請使用以下命令列。

```bash
# 使用 AoT 模式
wasmedgec rust_bindgen_funcs_lib.wasm rust_bindgen_funcs_lib.wasm

# 執行示範
./bindgen_funcs rust_bindgen_funcs_lib.wasm
```

就這樣。讓我們深入了解[更多 WasmEdge Go SDK 範例](/category/go-sdk-for-embedding-wasmedge)。
