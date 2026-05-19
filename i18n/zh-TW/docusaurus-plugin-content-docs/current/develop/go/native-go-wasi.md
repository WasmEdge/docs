---
sidebar_position: 2
---

# 搭配 WASI 的原生 Go（Go 1.21+）

從 Go 1.21 開始，Go 工具鏈原生支援將應用程式編譯為 WebAssembly System Interface（WASI）。這讓開發者能夠使用標準 Go 編譯器建置 WebAssembly 應用程式，並在符合 WASI 規範的執行環境（例如 WasmEdge）上執行。

本頁說明如何使用原生 Go 搭配 WasmEdge 開發並執行基於 WASI 的應用程式，並重點介紹與 TinyGo 的主要差異，TinyGo 過去一直是在 WebAssembly 上執行 Go 應用程式的主要方式。

對於需要 TinyGo 標準函式庫尚未完整支援的功能（例如更完整的語言特性或與現有 Go 程式碼庫的整合）的開發者而言，原生 Go 支援特別有用。


## TinyGo 與原生 Go 的比較

目前有兩種方式可以為 WasmEdge 開發 Go 應用程式：使用 TinyGo，或使用 Go 1.21 中導入的具備 WASI 支援的原生 Go 編譯器。每種方式都有不同的取捨。

| 面向 | TinyGo | 原生 Go（Go 1.21+） |
|------|--------|----------------------|
| 編譯器 | TinyGo（以 LLVM 為基礎） | 標準 Go 編譯器 |
| 標準函式庫 | 部分支援 | 較為完整 |
| WASI 支援 | 成熟 | 自 Go 1.21 起導入 |
| 網路 | 預設不可用 | 預設不可用（WASI 的限制） |
| 典型應用情境 | 小型、資源受限的工作負載 | 既有的 Go 程式碼庫、更豐富的語言特性 |

TinyGo 過去一直是在 WebAssembly 上執行 Go 應用程式的主要方式，對於輕量級工作負載而言仍然是不錯的選擇。具備 WASI 支援的原生 Go 讓開發者能夠重複利用更多既有的 Go 程式碼與工具，但仍受到 WASI 環境的限制。


## Hello World 範例

以下範例示範一個編譯為 WASI 並使用 WasmEdge 執行的最小化 Go 應用程式。

### hello.go

```go
package main

import "fmt"

func main() {
	fmt.Println("Hello, world")
}
```

### 建置

```bash
# 初始化模組（可選，但建議執行）
go mod init hello
# 建置相容於 WASI 的 WebAssembly 模組
GOOS=wasip1 GOARCH=wasm go build -o hello.wasm
```

### 使用 WasmEdge 執行

```bash
wasmedge hello.wasm
```

預期輸出：

```
Hello, world
```

請確認此範例在使用 WasmEdge 執行時會印出「Hello, world」。本節刻意保持精簡，以示範原生 Go WASI 路徑能夠端到端運作。


## 使用 Go 1.21 建置 WASI 模組

要將 Go 應用程式編譯為相容於 WASI 的 WebAssembly 模組，需要 Go 1.21 或更新版本。

建置應用程式時請使用以下環境變數：

```bash
GOOS=wasip1 GOARCH=wasm go build -o app.wasm
```

在此命令中：

GOOS=wasip1 指定 WASI Preview 1 目標

GOARCH=wasm 選擇 WebAssembly 架構

app.wasm 為產生的 WebAssembly 模組

產生的 .wasm 檔案可以由相容於 WASI 的執行環境（例如 WasmEdge）執行。


## 使用 WasmEdge 執行模組

建置好 WebAssembly 模組（例如 `app.wasm`）後，便可使用 WasmEdge CLI 執行它。

```bash
wasmedge app.wasm
```

WasmEdge 預設會執行 WASI 的 _start 進入點。緊接著模組路徑之後的命令列引數會在執行階段轉發給模組。當需要存取檔案系統時，可以使用 --dir 選項預先開啟主機目錄。


## 網路與 WASI 限制

目前的 WASI Preview 1 規範並不包含對 TCP 或 UDP 等網路原語的原生支援。因此，依賴標準 `net` 或 `net/http` 函式庫的 Go 套件無法在 WASI 環境中直接運作。

此限制同時適用於以 WASI 為目標的 TinyGo 與原生 Go，並非 WasmEdge 特有的問題。網路支援需要額外的抽象層或主機提供的功能，這些將在後續章節中討論。


## 使用 stealthrocket/net 進行網路操作

為了克服 WASI Preview 1 缺乏原生網路支援的問題，
需要採用替代方案。其中一個實驗性的方式是使用
外部的 `stealthrocket/net` 專案，它提供了
為 WASI 環境設計的網路實作。

`stealthrocket/net` 並非依賴傳統的 socket API，而是將
網路請求轉發給主機提供的功能。視執行環境而定，這可以為
編譯為 WASI 的 Go 應用程式提供有限的 HTTP
與網路功能。

> **備註**
> `stealthrocket/net` **並非 WasmEdge 的一部分**，此處僅作為
> 外部參考提及。使用細節、相容性與範例應該直接
> 向該專案的維護者確認。

更多資訊請參閱官方儲存庫：
- https://github.com/stealthrocket/net



## 在原生 Go（Go 1.21+）中匯入主機函式

編譯為 WASI 的原生 Go 應用程式可以呼叫由
WebAssembly 執行環境（例如 WasmEdge）所實作的函式，
而非定義於模組內部的函式。

從 Go 1.21 開始，可以使用
`//go:wasmimport` 指令來宣告主機函式。

### 範例

```go
package main

//go:wasmimport wasi_snapshot_preview1 proc_exit
func procExit(code uint32)

func main() {
	procExit(0)
}
```

在這個範例中，proc_exit 是執行環境提供的 WASI 主機函式。
其實作由 WASI 環境而非 WebAssembly 模組內的 Go 程式碼提供。

詳細說明請參閱官方 Go 文件：
- https://pkg.go.dev/cmd/compile#hdr-Directives
