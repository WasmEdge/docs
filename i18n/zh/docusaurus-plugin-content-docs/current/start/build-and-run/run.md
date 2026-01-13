---
sidebar_position: 2
---

# `wasmedge run`

安装完成后（参见[安装](../install.md#install)），用户可以执行 `wasmedge run` 命令。

`wasmedge run` 是不带 `-v|--version` 选项的 `wasmedge` 的别名。`wasmedge run` 工具的用法如下：

```bash
$ wasmedge run -h
USAGE
   wasmedge run [OPTIONS] [--] WASM_OR_SO [ARG ...]
```

## 选项

`wasmedge run` 是不带 `-v|--version` 选项的 `wasmedge` 的别名。

换句话说，如果用户希望执行以下命令。

```bash
wasmedge --reactor fibonacci.wasm fib 10
```

也可以使用子命令 `run`，在执行过程和结果上不会有任何区别。

```bash
wasmedge run --reactor fibonacci.wasm fib 10
```
