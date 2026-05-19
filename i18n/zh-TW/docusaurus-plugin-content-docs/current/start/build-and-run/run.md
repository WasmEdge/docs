---
sidebar_position: 2
---

# `wasmedge run` CLI

[安裝](../install.md#install) 完成後,使用者可以執行 `wasmedge run` 指令。

`wasmedge run` 是 `wasmedge` 不含 `-v|--version` 選項的別名。`wasmedge run` 工具的用法為:

```bash
$ wasmedge run -h
USAGE
   wasmedge run [OPTIONS] [--] WASM_OR_SO [ARG ...]
```

## 選項

`wasmedge run` 是 `wasmedge` 不含 `-v|--version` 選項的別名。

換句話說,如果使用者想要執行以下指令。

```bash
wasmedge --reactor fibonacci.wasm fib 10
```

也可以加上子指令 `run`,執行流程與結果都沒有差異。

```bash
wasmedge run --reactor fibonacci.wasm fib 10
```
