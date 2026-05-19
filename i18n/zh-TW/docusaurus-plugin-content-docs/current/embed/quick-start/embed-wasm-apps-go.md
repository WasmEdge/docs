---
sidebar_position: 3
---

# 將 WASM 應用程式嵌入你的 Go 主機應用程式

在上一章中,我們學習了如何使用 Rust 與 `wasmedge-bindgen` 工具建立 WASM 應用程式。在本章中,我會帶你了解如何將編譯好的 WASM 應用程式嵌入到你的 Go 主機應用程式裡。

## Go 主機應用程式

在 [Go 主機應用程式](https://github.com/second-state/WasmEdge-go-examples/blob/master/wasmedge-bindgen/go_BindgenFuncs/bindgen_funcs.go)中,你可以使用 WasmEdge Go SDK 建立並設定 WasmEdge VM。

然而,你現在應該呼叫 `bindgen.Instantiate(vm)` 來實例化 VM 並回傳一個 `bindgen` 物件,而不是呼叫 `vm.Instantiate()`。

```go
func main() {
  // Expected Args[0]: program name (./bindgen_funcs)
  // Expected Args[1]: wasm file (rust_bindgen_funcs_lib.wasm))

  wasmedge.SetLogErrorLevel()
  var conf = wasmedge.NewConfigure(wasmedge.WASI)
  var vm = wasmedge.NewVMWithConfig(conf)
  var wasi = vm.GetImportModule(wasmedge.WASI)
  wasi.InitWasi(
    os.Args[1:],     // The args
    os.Environ(),    // The envs
    []string{".:."}, // The mapping preopens
  )
  vm.LoadWasmFile(os.Args[1])
  vm.Validate()

  // Instantiate the bindgen and vm
  bg := bindgen.Instantiate(vm)
```

接著,你可以透過 `bindgen` 物件呼叫 VM 中任何標註了 `[wasmedge_bindgen]` 的函式。

```go
  // create_line: string, string, string -> string (inputs are JSON stringified)
  res, err := bg.Execute("create_line", "{\"x\":2.5,\"y\":7.8}", "{\"x\":2.5,\"y\":5.8}", "A thin red line")
  if err == nil {
    fmt.Println("Run bindgen -- create_line:", string(res))
  } else {
    fmt.Println("Run bindgen -- create_line FAILED", err)
  }

  // say: string -> string
  res, err = bg.Execute("say", "bindgen funcs test")
  if err == nil {
    fmt.Println("Run bindgen -- say:", string(res))
  } else {
    fmt.Println("Run bindgen -- say FAILED")
  }

  // obfusticate: string -> string
  res, err = bg.Execute("obfusticate", "A quick brown fox jumps over the lazy dog")
  if err == nil {
    fmt.Println("Run bindgen -- obfusticate:", string(res))
  } else {
    fmt.Println("Run bindgen -- obfusticate FAILED")
  }

  // lowest_common_multiple: i32, i32 -> i32
  res, err = bg.Execute("lowest_common_multiple", int32(123), int32(2))
  if err == nil {
    num, _ := strconv.ParseInt(string(res), 10, 32)
    fmt.Println("Run bindgen -- lowest_common_multiple:", num)
  } else {
    fmt.Println("Run bindgen -- lowest_common_multiple FAILED")
  }

  // sha3_digest: array -> array
  res, err = bg.Execute("sha3_digest", []byte("This is an important message"))
  if err == nil {
    fmt.Println("Run bindgen -- sha3_digest:", res)
  } else {
    fmt.Println("Run bindgen -- sha3_digest FAILED")
  }

  // keccak_digest: array -> array
  res, err = bg.Execute("keccak_digest", []byte("This is an important message"))
  if err == nil {
    fmt.Println("Run bindgen -- keccak_digest:", res)
  } else {
    fmt.Println("Run bindgen -- keccak_digest FAILED")
  }

  bg.Release()
  vm.Release()
  conf.Release()
}
```

## 從你的 Go 主機執行 WASM 應用程式

在此之前,請確認你已經[安裝了 Go、WasmEdge 與 WasmEdge Go SDK](install.md)。

```bash
$ cd rust_bindgen_funcs
go build
./bindgen_funcs rust_bindgen_funcs_lib.wasm
```

此範例的標準輸出如下。

```bash
Run bindgen -- create_line: {"points":[{"x":1.5,"y":3.8},{"x":2.5,"y":5.8}],"valid":true,"length":2.2360682,"desc":"A thin red line"}
Run bindgen -- say: hello bindgen funcs test
Run bindgen -- obfusticate: N dhvpx oebja sbk whzcf bire gur ynml qbt
Run bindgen -- lowest_common_multiple: 246
Run bindgen -- sha3_digest: [87 27 231 209 189 105 251 49 159 10 211 250 15 159 154 181 43 218 26 141 56 199 25 45 60 10 20 163 54 211 195 203]
Run bindgen -- keccak_digest: [126 194 241 200 151 116 227 33 216 99 159 22 107 3 177 169 216 191 114 156 174 193 32 159 246 228 245 133 52 75 55 27]
```

就這樣。接著,讓我們深入了解如何將複雜資料從主機應用程式傳遞給 WASM 應用程式。
