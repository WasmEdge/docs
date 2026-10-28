---
sidebar_position: 6
---

# Call an Exported Function

This page shows the smallest useful C host that loads a WASM module and calls one exported function with the WasmEdge C API.

Compared with the [C SDK introduction](intro.md), this example:

- Does **not** enable WASI (the module below does not need it)
- Takes the module path and input `n` from the command line
- Shows how to link against a **user-local** WasmEdge install (`~/.local/wasmedge`)

For AOT compilation and the full API surface, see [intro.md](intro.md) and the [C API reference](reference/latest.md).

## Prerequisites

1. [Install WasmEdge](../../start/install.md#install) (tested with **0.17.1**).
2. A C compiler (`gcc` or `clang`).
3. Optional: [WABT](https://github.com/WebAssembly/wabt) (`wat2wasm`) if you start from WAT instead of a ready `.wasm` file.

## Get `fibonacci.wasm`

The module used here is [examples/wasm/fibonacci.wat](https://github.com/WasmEdge/WasmEdge/blob/master/examples/wasm/fibonacci.wat) from the WasmEdge repository. Convert it with WABT:

```bash
wat2wasm fibonacci.wat -o fibonacci.wasm
```

Alternatively, copy a prebuilt `fibonacci.wasm` from a WasmEdge checkout under `examples/wasm/`.

Check the export with the CLI reactor:

```bash
$ wasmedge --reactor fibonacci.wasm fib 8
34
```

## Host program

Save as `run_fib.c`:

```c
#include <stdio.h>
#include <stdlib.h>
#include <wasmedge/wasmedge.h>

int main(int Argc, const char *Argv[]) {
  if (Argc < 3) {
    printf("Usage: %s <wasm file> <n>\n", Argv[0]);
    return 1;
  }

  int32_t N = (int32_t)atoi(Argv[2]);
  WasmEdge_VMContext *VMCxt = WasmEdge_VMCreate(NULL, NULL);
  WasmEdge_Value Params[1] = {WasmEdge_ValueGenI32(N)};
  WasmEdge_Value Returns[1];
  WasmEdge_String FuncName = WasmEdge_StringCreateByCString("fib");

  WasmEdge_Result Res = WasmEdge_VMRunWasmFromFile(
      VMCxt, Argv[1], FuncName, Params, 1, Returns, 1);

  if (WasmEdge_ResultOK(Res)) {
    printf("fib(%d) = %d\n", N, WasmEdge_ValueGetI32(Returns[0]));
  } else {
    printf("Error: %s\n", WasmEdge_ResultGetMessage(Res));
  }

  WasmEdge_StringDelete(FuncName);
  WasmEdge_VMDelete(VMCxt);
  return WasmEdge_ResultOK(Res) ? 0 : 1;
}
```

Flow:

1. `WasmEdge_VMCreate` — create a VM (configure/store may be `NULL`)
2. `WasmEdge_ValueGenI32` — pack the `i32` argument
3. `WasmEdge_VMRunWasmFromFile` — load the module and call `fib`
4. Read the result, then delete the string and VM

## Build and run

If WasmEdge is on the default library path:

```bash
gcc run_fib.c -lwasmedge -o run_fib
./run_fib fibonacci.wasm 8
```

Expected output:

```text
fib(8) = 34
```

If you installed WasmEdge under `~/.local/wasmedge` (common for the official tarball on Linux), point the compiler at `include` and `lib64`:

```bash
WASMEDGE_ROOT="$HOME/.local/wasmedge"

gcc run_fib.c \
  -I"$WASMEDGE_ROOT/include" \
  -L"$WASMEDGE_ROOT/lib64" -lwasmedge \
  -Wl,-rpath,"$WASMEDGE_ROOT/lib64" \
  -o run_fib

./run_fib fibonacci.wasm 8
./run_fib fibonacci.wasm 32
```

```text
fib(8) = 34
fib(32) = 3524578
```

<!-- prettier-ignore -->
:::note
On some Linux systems an older `libwasmedge` from the distro package may still be present under `/usr/lib`. Prefer the install you intend to use with `-L` / `-rpath` (or uninstall the package version) so the host links against the matching headers and shared library.
:::

## Related

- [WasmEdge C SDK Introduction](intro.md) — same `fib` example with WASI enabled, plus AOT
- [Use WasmEdge Library](library.md) — headers and linking details
- [C API reference](reference/latest.md)
