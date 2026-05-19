---
sidebar_position: 4
---

# 傳遞複雜參數到 WASM 函式

WebAssembly 規格的一個問題在於它僅支援數量非常有限的資料型別。如果你想嵌入一個帶有複雜呼叫參數或回傳值的 WebAssembly 函式,你必須在 Go SDK 與 WebAssembly 函式兩端管理記憶體指標。

複雜的呼叫參數與回傳值包含動態記憶體結構,例如字串與位元組陣列。

在本節中,我們會討論幾個範例。

- [傳遞複雜參數到 WASM 函式](#pass-complex-parameters-to-wasm-functions)
  - [將字串傳給 Rust 函式](#pass-strings-to-rust-functions)
  - [將字串傳給 TinyGo 函式](#pass-strings-to-tinygo-functions)
  - [將位元組傳給 Rust 函式](#pass-bytes-to-rust-functions)
  - [將位元組傳給 TinyGo 函式](#pass-bytes-to-tinygo-functions)

## 將字串傳給 Rust 函式

在[這個範例](https://github.com/second-state/WasmEdge-go-examples/tree/master/go_MemoryGreet)中,我們會示範如何從 Go 應用程式呼叫[一個以 Rust 為基礎的 WebAssembly 函式](https://github.com/second-state/WasmEdge-go-examples/blob/master/go_MemoryGreet/rust_memory_greet/src/lib.rs)。特別是,我們會討論如何傳遞字串資料。

<!-- prettier-ignore -->
:::note
另一個將複雜值傳遞並回傳給 WebAssembly 中 Rust 函式的替代方法,是使用 `wasmedge_bindgen` 編譯工具。你可以[在這裡了解更多](bindgen.md)。
:::

這個 Rust 函式接收字串的記憶體指標,然後自行建立 Rust 字串。

```rust
use std::ffi::{CStr, CString};
use std::mem;
use std::os::raw::{c_char, c_void};

#[no_mangle]
pub extern fn allocate(size: usize) -> *mut c_void {
  let mut buffer = Vec::with_capacity(size);
  let pointer = buffer.as_mut_ptr();
  mem::forget(buffer);

  pointer as *mut c_void
}

#[no_mangle]
pub extern fn deallocate(pointer: *mut c_void, capacity: usize) {
  unsafe {
    let _ = Vec::from_raw_parts(pointer, 0, capacity);
  }
}

#[no_mangle]
pub extern fn greet(subject: *mut c_char) -> *mut c_char {
  let subject = unsafe { CStr::from_ptr(subject).to_bytes().to_vec() };
  let mut output = b"Hello, ".to_vec();
  output.extend(&subject);
  output.extend(&[b'!']);

  unsafe { CString::from_vec_unchecked(output) }.into_raw()
}
```

使用標準的 Rust 編譯工具將 Rust 原始碼編譯成 WebAssembly 位元組碼應用程式。

```bash
cd rust_memory_greet
cargo build --target wasm32-wasip1
# The output WASM will be `target/wasm32-wasip1/debug/rust_memory_greet_lib.wasm`.
```

[Go SDK 應用程式](https://github.com/second-state/WasmEdge-go-examples/blob/master/go_MemoryGreet/greet_memory.go)必須從 WasmEdge VM 呼叫 `allocate`,以取得指向字串參數的指標。接著它會用該指標呼叫 Rust 中的 `greet` 函式。函式回傳後,Go 應用程式會呼叫 `deallocate` 來釋放該記憶體空間。

```go
package main

import (
  "fmt"
  "os"
  "strings"

  "github.com/second-state/WasmEdge-go/wasmedge"
)

func main() {
  wasmedge.SetLogErrorLevel()
  conf := wasmedge.NewConfigure(wasmedge.WASI)
  vm := wasmedge.NewVMWithConfig(conf)

  wasi := vm.GetImportModule(wasmedge.WASI)
  wasi.InitWasi(
    os.Args[1:],
    os.Environ(),
    []string{".:."},
  )

  err := vm.LoadWasmFile(os.Args[1])
  if err != nil {
    fmt.Println("failed to load wasm")
  }
  vm.Validate()
  vm.Instantiate()

  subject := "WasmEdge"
  lengthOfSubject := len(subject)

  // Allocate memory for the subject, and get a pointer to it.
  // Include a byte for the NULL terminator we add below.
  allocateResult, _ := vm.Execute("allocate", int32(lengthOfSubject + 1))
  inputPointer := allocateResult[0].(int32)

  // Write the subject into the memory.
  mod := vm.GetActiveModule()
  mem := mod.FindMemory("memory")
  memData, _ := mem.GetData(uint(inputPointer), uint(lengthOfSubject+1))
  copy(memData, subject)

  // C-string terminates by NULL.
  memData[lengthOfSubject] = 0

  // Run the `greet` function. Given the pointer to the subject.
  greetResult, _ := vm.Execute("greet", inputPointer)
  outputPointer := greetResult[0].(int32)

  pageSize := mem.GetPageSize()
  // Read the result of the `greet` function.
  memData, _ = mem.GetData(uint(0), uint(pageSize * 65536))
  nth := 0
  var output strings.Builder

  for {
    if memData[int(outputPointer) + nth] == 0 {
      break
    }

    output.WriteByte(memData[int(outputPointer) + nth])
    nth++
  }

  lengthOfOutput := nth

  fmt.Println(output.String())

  // Deallocate the subject, and the output.
  vm.Execute("deallocate", inputPointer, int32(lengthOfSubject+1))
  vm.Execute("deallocate", outputPointer, int32(lengthOfOutput+1))

  vm.Release()
  conf.Release()
}
```

要建置 Go SDK 範例,請執行以下命令。

```bash
go get github.com/second-state/WasmEdge-go/wasmedge@v{{ wasmedge_go_version }}
go build greet_memory.go
```

現在你可以使用 Go 應用程式來執行從 Rust 編譯而來的 WebAssembly 外掛。

```bash
$ ./greet_memory rust_memory_greet_lib.wasm
Hello, WasmEdge!
```

## 將字串傳給 TinyGo 函式

在[這個範例](https://github.com/second-state/WasmEdge-go-examples/tree/master/go_MemoryGreetTinyGo)中,我們會示範如何從 Go 應用程式呼叫[一個以 TinyGo 為基礎的 WebAssembly 函式](https://github.com/second-state/WasmEdge-go-examples/blob/master/go_MemoryGreetTinyGo/greet.go)。

這個 TinyGo 函式接收字串的記憶體指標,然後自行建立 TinyGo 字串。

<!-- prettier-ignore -->
:::note
編譯後的 WebAssembly 程式需要空的 `main()` 才能正確設定 WASI。
:::

```go
package main

import (
  "strings"
  "unsafe"
)

func main() {}

//export greet
func greet(subject *int32) *int32 {
  nth := 0
  var subjectStr strings.Builder
  pointer := uintptr(unsafe.Pointer(subject))
  for {
    s := *(*int32)(unsafe.Pointer(pointer + uintptr(nth)))
    if s == 0 {
      break
    }

    subjectStr.WriteByte(byte(s))
    nth++
  }

  output := []byte("Hello, " + subjectStr.String() + "!")

  r := make([]int32, 2)
  r[0] = int32(uintptr(unsafe.Pointer(&(output[0]))))
  r[1] = int32(len(output))

  return &r[0]
}
```

使用 TinyGo 編譯工具將 Go 原始碼編譯成 WebAssembly 位元組碼應用程式。

```bash
tinygo build -o greet.wasm -target wasi greet.go
```

[Go SDK 應用程式](https://github.com/second-state/WasmEdge-go-examples/blob/master/go_MemoryGreetTinyGo/greet_memory.go)必須從 WasmEdge VM 呼叫 `malloc`,以取得指向字串參數的指標。接著它會用該指標呼叫 TinyGo 中的 `greet` 函式。函式回傳後,Go 應用程式會呼叫 `free` 來釋放該記憶體空間。

```go
package main

import (
  "fmt"
  "os"
  "encoding/binary"

  "github.com/second-state/WasmEdge-go/wasmedge"
)

func main() {
  wasmedge.SetLogErrorLevel()
  conf := wasmedge.NewConfigure(wasmedge.WASI)
  vm := wasmedge.NewVMWithConfig(conf)

  wasi := vm.GetImportModule(wasmedge.WASI)
  wasi.InitWasi(
    os.Args[1:],
    os.Environ(),
    []string{".:."},
  )

  err := vm.LoadWasmFile(os.Args[1])
  if err != nil {
    fmt.Println("failed to load wasm")
  }
  vm.Validate()
  vm.Instantiate()

  subject := "WasmEdge"
  lengthOfSubject := len(subject)

  // Allocate memory for the subject, and get a pointer to it.
  // Include a byte for the NULL terminator we add below.
  allocateResult, _ := vm.Execute("malloc", int32(lengthOfSubject+1))
  inputPointer := allocateResult[0].(int32)

  // Write the subject into the memory.
  mod := vm.GetActiveModule()
  mem := mod.FindMemory("memory")
  memData, _ := mem.GetData(uint(inputPointer), uint(lengthOfSubject+1))
  copy(memData, subject)

  // C-string terminates by NULL.
  memData[lengthOfSubject] = 0

  // Run the `greet` function. Given the pointer to the subject.
  greetResult, _ := vm.Execute("greet", inputPointer)
  outputPointer := greetResult[0].(int32)

  memData, _ = mem.GetData(uint(outputPointer), 8)
  resultPointer := binary.LittleEndian.Uint32(memData[:4])
  resultLength := binary.LittleEndian.Uint32(memData[4:])

  // Read the result of the `greet` function.
  memData, _ = mem.GetData(uint(resultPointer), uint(resultLength))
  fmt.Println(string(memData))

  // Deallocate the subject, and the output.
  vm.Execute("free", inputPointer)

  vm.Release()
  conf.Release()
}
```

要建置 Go SDK 範例,請執行以下命令。

```bash
go get github.com/second-state/WasmEdge-go/wasmedge@v{{ wasmedge_go_version }}
go build greet_memory.go
```

現在你可以使用 Go 應用程式來執行從 TinyGo 編譯而來的 WebAssembly 外掛。

```bash
$ ./greet_memory greet.wasm
Hello, WasmEdge!
```

## 將位元組傳給 Rust 函式

在[這個範例](https://github.com/second-state/WasmEdge-go-examples/tree/master/go_AccessMemory)中,我們會示範如何呼叫[以 Rust 為基礎的 WebAssembly 函式](https://github.com/second-state/WasmEdge-go-examples/blob/master/go_AccessMemory/rust_access_memory/src/lib.rs),並在 Go 應用程式中傳入或傳回陣列。

<!-- prettier-ignore -->
:::note
另一個將複雜值傳遞並回傳給 WebAssembly 中 Rust 函式的替代方法,是使用 `wasmedge_bindgen` 編譯工具。你可以[在這裡了解更多](bindgen.md)。
:::

`fib_array()` 函式接收一個陣列作為呼叫參數,並以費氏數列填入該陣列。另外,`fib_array_return_memory()` 函式則會回傳一個費氏數列陣列。

對於呼叫參數中的陣列,Rust 函式 `fib_array()` 會接收記憶體指標,並使用 `from_raw_parts` 建立 Rust 的 `Vec`。對於回傳值中的陣列,Rust 函式 `fib_array_return_memory()` 則直接回傳指標。

```rust
use std::mem;
use std::os::raw::{c_void, c_int};

#[no_mangle]
pub extern fn allocate(size: usize) -> *mut c_void {
  let mut buffer = Vec::with_capacity(size);
  let pointer = buffer.as_mut_ptr();
  mem::forget(buffer);

  pointer as *mut c_void
}

#[no_mangle]
pub extern fn deallocate(pointer: *mut c_void, capacity: usize) {
  unsafe {
    let _ = Vec::from_raw_parts(pointer, 0, capacity);
  }
}

#[no_mangle]
pub extern fn fib_array(n: i32, p: *mut c_int) -> i32 {
  unsafe {
    let mut arr = Vec::<i32>::from_raw_parts(p, 0, (4*n) as usize);
    for i in 0..n {
      if i < 2 {
        arr.push(i);
      } else {
        arr.push(arr[(i - 1) as usize] + arr[(i - 2) as usize]);
      }
    }
    let r = arr[(n - 1) as usize];
    mem::forget(arr);
    r
  }
}

#[no_mangle]
pub extern fn fib_array_return_memory(n: i32) -> *mut c_int {
  let mut arr = Vec::with_capacity((4 * n) as usize);
  let pointer = arr.as_mut_ptr();
  for i in 0..n {
    if i < 2 {
      arr.push(i);
    } else {
      arr.push(arr[(i - 1) as usize] + arr[(i - 2) as usize]);
    }
  }
  mem::forget(arr);
  pointer
}
```

使用標準的 Rust 編譯工具將 Rust 原始碼編譯成 WebAssembly 位元組碼應用程式。

```bash
cd rust_access_memory
cargo build --target wasm32-wasip1
# The output WASM will be target/wasm32-wasip1/debug/rust_access_memory_lib.wasm.
```

[Go SDK 應用程式](https://github.com/second-state/WasmEdge-go-examples/blob/master/go_AccessMemory/run.go)必須從 WasmEdge VM 呼叫 `allocate`,以取得指向陣列的指標。接著它會用該指標呼叫 Rust 中的 `fib_array()` 函式並傳入該指標。函式回傳後,Go 應用程式會使用 WasmEdge 的 `store` API,從呼叫參數中(`fib_array()`)或回傳值中(`fib_array_return_memory()`)的指標建立陣列。Go 應用程式最後會呼叫 `deallocate` 釋放該記憶體空間。

```go
package main

import (
  "fmt"
  "os"
  "unsafe"

  "github.com/second-state/WasmEdge-go/wasmedge"
)

func main() {
  wasmedge.SetLogErrorLevel()
  conf := wasmedge.NewConfigure(wasmedge.WASI)
  vm := wasmedge.NewVMWithConfig(conf)

  wasi := vm.GetImportModule(wasmedge.WASI)
  wasi.InitWasi(
    os.Args[1:],
    os.Environ(),
    []string{".:."},
  )

  err := vm.LoadWasmFile(os.Args[1])
  if err != nil {
    fmt.Println("failed to load wasm")
  }
  vm.Validate()
  vm.Instantiate()

  n := int32(10)

  p, err := vm.Execute("allocate", 4 * n)
  if err != nil {
    fmt.Println("allocate failed:", err)
  }

  fib, err := vm.Execute("fib_array", n, p[0])
  if err != nil {
    fmt.Println("fib_rray failed:", err)
  } else {
    fmt.Println("fib_array() returned:", fib[0])
    fmt.Printf("fib_array memory at: %p\n", unsafe.Pointer((uintptr)(p[0].(int32))))
    mod := vm.GetActiveModule()
    mem := mod.FindMemory("memory")
    if mem != nil {
      // int32 occupies 4 bytes
      fibArray, err := mem.GetData(uint(p[0].(int32)), uint(n * 4))
      if err == nil && fibArray != nil {
        fmt.Println("fibArray:", fibArray)
      }
    }
  }

  fibP, err := vm.Execute("fib_array_return_memory", n)
  if err != nil {
    fmt.Println("fib_array_return_memory failed:", err)
  } else {
    fmt.Printf("fib_array_return_memory memory at: %p\n", unsafe.Pointer((uintptr)(fibP[0].(int32))))
    mod := vm.GetActiveModule()
    mem := mod.FindMemory("memory")
    if mem != nil {
      // int32 occupies 4 bytes
      fibArrayReturnMemory, err := mem.GetData(uint(fibP[0].(int32)), uint(n * 4))
      if err == nil && fibArrayReturnMemory != nil {
        fmt.Println("fibArrayReturnMemory:", fibArrayReturnMemory)
      }
    }
  }

  _, err = vm.Execute("deallocate", p[0].(int32), 4 * n)
  if err != nil {
    fmt.Println("free failed:", err)
  }


  exitcode := wasi.WasiGetExitCode()
  if exitcode != 0 {
    fmt.Println("Go: Running wasm failed, exit code:", exitcode)
  }

  vm.Release()
  conf.Release()
}
```

要建置 Go SDK 範例,請執行以下命令。

```bash
go get github.com/second-state/WasmEdge-go/wasmedge@v{{ wasmedge_go_version }}
go build run.go
```

現在你可以使用 Go 應用程式來執行從 Rust 編譯而來的 WebAssembly 外掛。

```bash
$ ./run rust_access_memory_lib.wasm
fib_array() returned: 34
fib_array memory at: 0x102d80
fibArray: [0 0 0 0 1 0 0 0 1 0 0 0 2 0 0 0 3 0 0 0 5 0 0 0 8 0 0 0 13 0 0 0 21 0 0 0 34 0 0 0]
fib_array_return_memory memory at: 0x105430
fibArrayReturnMemory: [0 0 0 0 1 0 0 0 1 0 0 0 2 0 0 0 3 0 0 0 5 0 0 0 8 0 0 0 13 0 0 0 21 0 0 0 34 0 0 0]
```

## 將位元組傳給 TinyGo 函式

在[這個範例](https://github.com/second-state/WasmEdge-go-examples/tree/master/go_AccessMemoryTinyGo)中,我們會示範如何呼叫[以 TinyGo 為基礎的 WebAssembly 函式](https://github.com/second-state/WasmEdge-go-examples/blob/master/go_AccessMemoryTinyGo/fib.go),並在 Go 應用程式中傳入或傳回陣列。

`fibArray` 函式接收一個陣列作為呼叫參數,並以費氏數列填入該陣列。另外,`fibArrayReturnMemory` 函式則會回傳一個費氏數列陣列。

```go
package main

import (
  "fmt"
  "unsafe"
)

func main() {
  println("in main")
  n := int32(10)
  arr := make([]int32, n)
  arrP := &arr[0]
  fmt.Printf("call fibArray(%d, %p) = %d\n", n, arrP, fibArray(n, arrP))
  fmt.Printf("call fibArrayReturnMemory(%d) return %p\n", n, fibArrayReturnMemory(n))
}

// export fibArray
func fibArray(n int32, p *int32) int32 {
  arr := unsafe.Slice(p, n)
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

// export fibArrayReturnMemory
func fibArrayReturnMemory(n int32) *int32 {
  arr := make([]int32, n)
  for i := int32(0); i < n; i++ {
    switch {
    case i < 2:
      arr[i] = i
    default:
      arr[i] = arr[i-1] + arr[i-2]
    }
  }
  return &arr[0]
}
```

使用 TinyGo 編譯工具將 Go 原始碼編譯成 WebAssembly 位元組碼應用程式。

```bash
tinygo build -o fib.wasm -target wasi fib.go
```

[Go SDK 應用程式](https://github.com/second-state/WasmEdge-go-examples/blob/master/go_AccessMemoryTinyGo/run.go)必須從 WasmEdge VM 呼叫 `malloc`,以取得指向陣列的指標。接著它會用該指標呼叫 TinyGo 中的 `fibArray()` 函式。函式回傳後,Go 應用程式會使用 WasmEdge SDK 的 `store` API,從呼叫參數中(`fibArray()`)或回傳值中(`fibArrayReturnMemory()`)的指標建立陣列。Go 應用程式最後會呼叫 `free` 釋放該記憶體空間。

```go
package main

import (
  "fmt"
  "os"
  "unsafe"

  "github.com/second-state/WasmEdge-go/wasmedge"
)

func main() {
  wasmedge.SetLogErrorLevel()
  conf := wasmedge.NewConfigure(wasmedge.WASI)
  vm := wasmedge.NewVMWithConfig(conf)

  wasi := vm.GetImportModule(wasmedge.WASI)
  wasi.InitWasi(
    os.Args[1:],
    os.Environ(),
    []string{".:."},
  )

  err := vm.LoadWasmFile(os.Args[1])
  if err != nil {
    fmt.Println("failed to load wasm")
  }
  vm.Validate()
  vm.Instantiate()

  n := int32(10)

  p, err := vm.Execute("malloc", n)
  if err != nil {
    fmt.Println("malloc failed:", err)
  }

  fib, err := vm.Execute("fibArray", n, p[0])
  if err != nil {
    fmt.Println("fibArray failed:", err)
  } else {
    fmt.Println("fibArray() returned:", fib[0])
    fmt.Printf("fibArray memory at: %p\n", unsafe.Pointer((uintptr)(p[0].(int32))))
    mod := vm.GetActiveModule()
    mem := mod.FindMemory("memory")
    if mem != nil {
      // int32 occupies 4 bytes
      fibArray, err := mem.GetData(uint(p[0].(int32)), uint(n * 4))
      if err == nil && fibArray != nil {
        fmt.Println("fibArray:", fibArray)
      }
    }
  }

  fibP, err := vm.Execute("fibArrayReturnMemory", n)
  if err != nil {
    fmt.Println("fibArrayReturnMemory failed:", err)
  } else {
    fmt.Printf("fibArrayReturnMemory memory at: %p\n", unsafe.Pointer((uintptr)(fibP[0].(int32))))
    mod := vm.GetActiveModule()
    mem := mod.FindMemory("memory")
    if mem != nil {
      // int32 occupies 4 bytes
      fibArrayReturnMemory, err := mem.GetData(uint(fibP[0].(int32)), uint(n * 4))
      if err == nil && fibArrayReturnMemory != nil {
        fmt.Println("fibArrayReturnMemory:", fibArrayReturnMemory)
      }
    }
  }

  _, err = vm.Execute("free", p...)
  if err != nil {
    fmt.Println("free failed:", err)
  }

  exitcode := wasi.WasiGetExitCode()
  if exitcode != 0 {
    fmt.Println("Go: Running wasm failed, exit code:", exitcode)
  }

  vm.Release()
  conf.Release()
}
```

要建置 Go SDK 範例,請執行以下命令。

```bash
go get github.com/second-state/WasmEdge-go/wasmedge@v{{ wasmedge_go_version }}
go build run.go
```

現在你可以使用 Go 應用程式來執行從 TinyGo 編譯而來的 WebAssembly 外掛。

```bash
$ ./run fib.wasm
fibArray() returned: 34
fibArray memory at: 0x14d3c
fibArray: [0 0 0 0 1 0 0 0 1 0 0 0 2 0 0 0 3 0 0 0 5 0 0 0 8 0 0 0 13 0 0 0 21 0 0 0 34 0 0 0]
fibArrayReturnMemory memory at: 0x14d4c
fibArrayReturnMemory: [0 0 0 0 1 0 0 0 1 0 0 0 2 0 0 0 3 0 0 0 5 0 0 0 8 0 0 0 13 0 0 0 21 0 0 0 34 0 0 0]
```
