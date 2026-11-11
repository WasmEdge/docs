---
sidebar_position: 5
---

# Wide Arithmetic

WasmEdge supports the [WebAssembly Wide Arithmetic proposal](https://github.com/WebAssembly/wide-arithmetic) starting from version `0.19.0`. The proposal adds instructions that produce 128-bit results from 64-bit values, which helps big-integer and cryptography code avoid emulating carries and wide products with several instructions.

## What is Wide Arithmetic?

The proposal does not add an `i128` type. A 128-bit value is passed as two `i64` values: the low half followed by the high half.

| Instruction | Inputs | Results |
| --- | --- | --- |
| `i64.add128` | `lhs_lo lhs_hi rhs_lo rhs_hi` | `lo hi` |
| `i64.sub128` | `lhs_lo lhs_hi rhs_lo rhs_hi` | `lo hi` |
| `i64.mul_wide_s` | `lhs rhs` | `lo hi` |
| `i64.mul_wide_u` | `lhs rhs` | `lo hi` |

`i64.add128` and `i64.sub128` wrap around modulo 2^128. `i64.mul_wide_s` and `i64.mul_wide_u` return the full 128-bit product of two signed or unsigned 64-bit values.

The proposal is disabled by default. Enable it with the `--enable-wide-arithmetic` flag. The `--enable-all` flag also enables it.

## Prerequisites

- WasmEdge `0.19.0` or later. See the [installation guide](https://github.com/WasmEdge/docs/blob/main/docs/start/install.md).
- [`wasm-tools`](https://github.com/bytecodealliance/wasm-tools), to compile `.wat` source files to `.wasm`. See the [Garbage Collection guide](gc.md#prerequisites) for installation steps.

## Example

Create a file called `wide.wat`:

```wasm
(module
  (func (export "add128") (param i64 i64 i64 i64) (result i64 i64)
    (i64.add128 (local.get 0) (local.get 1) (local.get 2) (local.get 3)))
  (func (export "mul_wide_u") (param i64 i64) (result i64 i64)
    (i64.mul_wide_u (local.get 0) (local.get 1))))
```

Compile it to a `.wasm` binary:

```bash
wasm-tools parse wide.wat -o wide.wasm
```

Add `0xFFFFFFFFFFFFFFFF` (passed as `-1`) and `1`. The low half overflows to `0` and the carry goes to the high half:

```bash
wasmedge --enable-wide-arithmetic --reactor wide.wasm add128 -1 0 1 0
```

Expected output:

```
0
1
```

Multiply `0xFFFFFFFFFFFFFFFF` by `2` as unsigned values:

```bash
wasmedge --enable-wide-arithmetic --reactor wide.wasm mul_wide_u -1 2
```

Expected output:

```
-2
1
```

The CLI prints each `i64` result as a signed decimal number, so the low half `0xFFFFFFFFFFFFFFFE` is shown as `-2`.

Without the flag, WasmEdge rejects the module when loading it:

```bash
wasmedge --reactor wide.wasm add128 -1 0 1 0
```

## AOT Compilation

Pass the flag when compiling the module:

```bash
wasmedge compile --enable-wide-arithmetic wide.wasm wide_aot.wasm
wasmedge --enable-wide-arithmetic --run-mode=aot --reactor wide_aot.wasm add128 -1 0 1 0
```

## C API

To enable Wide Arithmetic programmatically via the WasmEdge C API, use the `WasmEdge_Proposal_WideArithmetic` enumeration value:

```c
WasmEdge_ConfigureContext *ConfCxt = WasmEdge_ConfigureCreate();
WasmEdge_ConfigureAddProposal(ConfCxt, WasmEdge_Proposal_WideArithmetic);
```
