---
sidebar_position: 3
---

# Embed the WASM app into your Go Host app

In the previous chapter, we learned how to create a WASM app using Rust and `wasmedge-bindgen` tool. In this chapter, I will walk you through how to embed the compiled WASM app into your Go Host app.

## The Go Host Application

In the [Go host application](https://github.com/second-state/WasmEdge-go-examples/blob/master/wasmedge-bindgen/go_BindgenFuncs/bindgen_funcs.go), you can create and set up the WasmEdge VM using the WasmEdge Go SDK.

However, instead of calling `vm.Instantiate()`, you should now call `bindgen.Instantiate(vm)` to instantiate the VM and return a `bindgen` object.

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

Next, you can call any `[wasmedge_bindgen]` annotated functions in the VM via the `bindgen` object.

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

## Run the WASM app from your Go Host

Before that, make sure you have [installed Go, WasmEdge, and WasmEdge Go SDK](install.md).

```bash
$ cd rust_bindgen_funcs
go build
./bindgen_funcs rust_bindgen_funcs_lib.wasm
```

The standard output of this example will be the following.

```bash
Run bindgen -- create_line: {"points":[{"x":1.5,"y":3.8},{"x":2.5,"y":5.8}],"valid":true,"length":2.2360682,"desc":"A thin red line"}
Run bindgen -- say: hello bindgen funcs test
Run bindgen -- obfusticate: N dhvpx oebja sbk whzcf bire gur ynml qbt
Run bindgen -- lowest_common_multiple: 246
Run bindgen -- sha3_digest: [87 27 231 209 189 105 251 49 159 10 211 250 15 159 154 181 43 218 26 141 56 199 25 45 60 10 20 163 54 211 195 203]
Run bindgen -- keccak_digest: [126 194 241 200 151 116 227 33 216 99 159 22 107 3 177 169 216 191 114 156 174 193 32 159 246 228 245 133 52 75 55 27]
```

That's it. Next, let's dive into how to pass complex data from host applications to the WASM app.
