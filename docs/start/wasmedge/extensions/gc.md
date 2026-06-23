---
sidebar_position: 4
---

# Garbage Collection

WasmEdge supports the [WebAssembly Garbage Collection (GC) proposal](https://github.com/WebAssembly/gc) starting from version `0.14.0`. This allows high-level languages like Kotlin, Dart, and OCaml to compile to WebAssembly without bundling their own garbage collector, resulting in smaller binaries and better runtime performance.

## What is Wasm GC?

Normally, WebAssembly manages memory manually — programs allocate and free memory themselves using linear memory. The GC proposal adds first-class garbage-collected types: **structs** (fixed heterogeneous fields) and **arrays** (homogeneous elements), both allocated on the heap and automatically reclaimed when no longer reachable.

This is enabled by default in WasmEdge since `0.16.0`. For WasmEdge `0.14.x`–`0.15.x`, enable it explicitly with the (deprecated) `--enable-gc` flag; you can disable GC with `--disable-gc` when needed.

## Prerequisites

- WasmEdge `0.14.0` or later. See the [installation guide](../../../start/install.md).
- [`wat2wasm`](https://github.com/WebAssembly/wabt) from the WABT toolkit, to compile `.wat` source files to `.wasm`.

Install WABT on Linux:

```bash
apt install wabt
```

Or on macOS:

```bash
brew install wabt
```

## Example: Working with Structs

The following WAT (WebAssembly Text Format) example defines a `$point` struct with two `i32` fields, allocates one, sets a field, and returns a value from it.

Create a file called `point.wat`:

```wasm
(module
  (type $point (struct (field $x (mut i32)) (field $y (mut i32))))

  (func (export "make_point") (result i32)
    (local $p (ref $point))
    ;; Allocate a new $point struct with x=10, y=20
    (local.set $p
      (struct.new $point (i32.const 10) (i32.const 20))
    )
    ;; Update x to 99
    (struct.set $point $x (local.get $p) (i32.const 99))
    ;; Return the value of x
    (struct.get $point $x (local.get $p))
  )
)
```

Compile it to a `.wasm` binary:

```bash
wat2wasm point.wat -o point.wasm
```

Run it with WasmEdge:

```bash
wasmedge --invoke make_point point.wasm
```

Expected output:

```
99
```

## Example: Working with Arrays

The following example creates a GC-managed array of `i32` values, fills it with a value, and reads back an element.

Create a file called `array.wat`:

```wasm
(module
  (type $int_array (array (mut i32)))

  (func (export "array_example") (result i32)
    (local $a (ref $int_array))
    ;; Allocate an array of length 5, initialized to 0
    (local.set $a
      (array.new_default $int_array (i32.const 5))
    )
    ;; Set element at index 2 to 42
    (array.set $int_array (local.get $a) (i32.const 2) (i32.const 42))
    ;; Return element at index 2
    (array.get $int_array (local.get $a) (i32.const 2))
  )
)
```

Compile and run:

```bash
wat2wasm array.wat -o array.wasm
wasmedge --invoke array_example array.wasm
```

Expected output:

```
42
```

## Disabling GC

If you need to run a Wasm module without GC support (for example, to test compatibility), pass the `--disable-gc` flag:

```bash
wasmedge --disable-gc your_module.wasm
```

## C API

To configure GC support programmatically via the WasmEdge C API, use the `WasmEdge_Proposal_GC` enumeration value:

```c
WasmEdge_ConfigureContext *ConfCxt = WasmEdge_ConfigureCreate();
// WasmEdge 0.16.0+ enables GC by default; to disable it:
WasmEdge_ConfigureRemoveProposal(ConfCxt, WasmEdge_Proposal_GC);
// WasmEdge 0.14.x–0.15.x has GC off by default; to enable it instead:
// WasmEdge_ConfigureAddProposal(ConfCxt, WasmEdge_Proposal_GC);
```

## Language Support

Languages that compile to Wasm GC and can run on WasmEdge include:

- **Kotlin/Wasm** — via the Kotlin compiler's `wasmGc` target
- **Dart** — via `dart compile wasm`
- **OCaml** — via the `wasm_of_ocaml` compiler

For language-specific guides, refer to the respective language's documentation on compiling to the `wasm32-unknown-unknown` GC target.