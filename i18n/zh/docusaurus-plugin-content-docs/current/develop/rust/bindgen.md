---
sidebar_position: 11
---

# Rust函数的绑定生成

如果你的 Rust 程序有一个 main() 函数，你可以将其编译为 WebAssembly，并使用 wasmedge 命令行工具作为独立应用程序运行。然而，更常见的用例是将 Rust 函数编译为 WebAssembly，然后从宿主应用程序中调用它。这被称为嵌入式 WASM 函数。宿主应用程序使用 WasmEdge 语言 SDK（例如[Go](/category/go-sdk-for-embedding-wasm-functions), [Rust](/category/rust-sdk-for-embedding-wasm-functions), [C](/category/c-sdk-for-embedding-wasm-functions), Python (正在开发中) 和 Java (正在开发中)) 来调用从 Rust 源代码编译的这些 WASM 函数。在本章中，我们将介绍一些关于 WasmEdge-bindgen 的内容， 你可以在[这里](/category/passing-complex-data)找到更多信息。

所有的 WasmEdge 宿主语言 SDK 都支持简单的函数调用。然而，WASM 规范只支持一些简单的数据类型作为调用参数和返回值，例如 i32、i64、f32、f64 和 v128。当 Rust 函数编译为 WASM 时，wasmedge-bindgen crate 会将 Rust 函数的参数和返回值转换为简单的整数类型。例如，字符串会自动转换为两个整数，一个是内存地址，一个是长度，这些可以被标准的 WASM 规范处理。在 Rust 源代码中，这非常容易实现。只需用 #[wasmedge-bindgen] 宏对函数进行注解即可。你可以使用标准的 Rust 编译器工具链（例如最新的 Cargo）编译带有注解的 Rust 代码。

```rust
use wasmedge_bindgen::*;
use wasmedge_bindgen_macro::*;

#[wasmedge_bindgen]
pub fn say(s: String) -> Result<Vec<u8>, String> {
  let r = String::from("hello ");
  return Ok((r + s.as_str()).as_bytes().to_vec());
}
```

当然，一旦上述 Rust 代码被编译为 WASM，函数 say() 就不再接受 String 参数，也不返回 Vec<u8>。因此，调用者（即宿主应用程序）在调用之前必须首先将调用参数解构为内存指针，并在调用后从内存指针组装返回值。这些操作可以由 WasmEdge 语言 SDK 自动处理。要查看完整的示例，包括 Rust WASM 函数和 Go 宿主应用程序，请参阅我们在 Go SDK 文档中的教程。

[完整的 Rust（WASM）和 Go（宿主）中的 wasmedge-bindgen 示例](/embed/go/function)

当然，开发人员可以选择手动完成 wasmedge-bindgen 的工作，并直接传递内存指针。如果你对这种调用 Rust 编译的 WASM 函数的方法感兴趣，请查看我们[在 Go SDK 中的示例](/embed/go/passing_data)。
