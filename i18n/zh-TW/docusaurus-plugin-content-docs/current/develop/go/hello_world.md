---
sidebar_position: 1
---

# TinyGo

本頁專注於搭配 WasmEdge 使用 TinyGo。  
原生 Go（Go 1.21+）的支援另有獨立文件，請參閱
[原生 Go WASI 文件](./native-go-wasi.md)。


在 WasmEdge 中執行 Go 程式的最佳方式是使用 [TinyGo](https://tinygo.org/) 將 Go 原始碼編譯為 WebAssembly。本文將示範如何進行。

原生 Go（Go 1.21+）現在已支援編譯為 WASI。關於在 WasmEdge 中使用原生 Go 的詳細說明，請參閱原生 Go WASI 指南。


## 安裝 TinyGo

在安裝 TinyGo 之前，您的機器上必須已[安裝 Go](https://go.dev/doc/install)。建議使用 Go v1.17 或更新版本。對於 x86 處理器上的 Ubuntu 或其他基於 Debian 的 Linux 系統，您可以使用以下命令列安裝 TinyGo。其他平台請參閱 [TinyGo 文件](https://tinygo.org/getting-started/install/)。

```bash
wget https://github.com/tinygo-org/tinygo/releases/download/v0.21.0/tinygo_0.21.0_amd64.deb
sudo dpkg -i tinygo_0.21.0_amd64.deb`
```

接著，執行以下命令列以確認安裝是否成功。

```bash
$ tinygo version
tinygo version 0.21.0 linux/amd64 (using go version go1.16.7 and LLVM version 11.0.0)
```

## Hello world

這個簡單的 Go 應用程式有一個 `main()` 函式，會將訊息印到主控台。位於 `main.go` 檔案中的原始碼如下。

```go
package main

func main() {
  println("Hello TinyGo from WasmEdge!")
}
```

<!-- prettier-ignore -->
:::note
在 `main()` 函式內，您可以使用 Go 標準 API 來讀寫檔案，並存取命令列引數與 `env` 變數。
:::

### Hello world：編譯與建置

接著，使用 TinyGo 將 `main.go` 程式編譯為 WebAssembly。

```bash
tinygo build -o hello.wasm -target wasi main.go
```

您會在同一目錄下看到 `hello.wasm` 檔案，這是一個 WebAssembly 位元組碼檔案。

### Hello world：執行

您可以透過 [WasmEdge CLI](../../start/build-and-run/cli.md) 執行它。

```bash
$ wasmedge hello.wasm
Hello TinyGo from WasmEdge!
```

## 一個簡單的函式

第二個範例是一個 Go 函式，接受一個呼叫參數來計算費氏數列數值。然而，為了讓 Go 應用程式能夠正確存取作業系統（例如取得命令列引數），您必須在原始碼中包含一個空的 `main()` 函式。

```go
package main

func main(){
}

//export fibArray
func fibArray(n int32) int32{
  arr := make([]int32, n)
  for i := int32(0); i < n; i++ {
    switch {
    case i < 2:
      arr[i] = i
    default:
      arr[i] = arr[i-1] + arr[i-2]
    }
  }
  return arr[n-1]
}
```

### 一個簡單的函式：編譯與建置

接著，使用 TinyGo 將 `main.go` 程式編譯為 WebAssembly。

```bash
tinygo build -o fib.wasm -target wasi main.go
```

您會在同一目錄下看到名為 `fib.wasm` 的檔案，這是一個 WebAssembly 位元組碼檔案。

### 一個簡單的函式：執行

您可以在 `--reactor` 模式下透過 [WasmEdge CLI](../../start/build-and-run/cli.md) 執行它。`wasm` 檔案之後的命令列引數依序為函式名稱與呼叫參數。

```bash
$ wasmedge --reactor fib.wasm fibArray 10
34
```

## 提升效能

為了讓這些應用程式達到原生 Go 的效能，您可以使用 `wasmedge compile` 命令對 `wasm` 程式進行 AOT 編譯，然後再透過 `wasmedge` 命令執行。

```bash
$ wasmedge compile hello.wasm hello.wasm

$ wasmedge hello.wasm
Hello TinyGo from WasmEdge!
```

對於 `--reactor` 模式，

```bash
$ wasmedge compile fib.wasm fib.wasm

$ wasmedge --reactor fib.wasm fibArray 10
34
```
