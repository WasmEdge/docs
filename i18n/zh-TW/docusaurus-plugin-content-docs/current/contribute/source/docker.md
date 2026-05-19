---
sidebar_position: 2
---

# 用於建置 WasmEdge 的 Docker 映像檔

您可以使用下列指令拉取 Docker 映像檔以[從原始碼建置 WasmEdge](build_from_src.md)。

```bash
docker pull wasmedge/wasmedge:{tag_name}
```

## 每週建置 Docker 映像檔

下方列出的映像檔用於 WasmEdge CI 流程中進行測試與/或發行。所有映像檔皆已預先安裝建置 WasmEdge (核心) 所需的相依套件。

| `{tag name}` | 架構 | 基礎作業系統 | LLVM 版本 | 環境變數 | 相容性 | 描述 |
| --- | --- | --- | --- | --- | --- | --- |
| `latest` | x86_64 | Ubuntu 24.04 LTS | 18.1.3 | CC=clang, CXX=clang++ | Ubuntu 24.04+ | 最新的 Ubuntu LTS,目前為 Ubuntu 24.04 LTS |
| `ubuntu-build-clang` | x86_64 | Ubuntu 24.04 LTS | 18.1.3 | CC=clang, CXX=clang++ | Ubuntu 24.04+ | `latest` 並以 `clang` 作為預設工具鏈 |
| `ubuntu-build-gcc` | x86_64 | Ubuntu 24.04 LTS | 18.1.3 | CC=gcc, CXX=g++ | Ubuntu 24.04+ | `latest` 並以 `gcc` 作為預設工具鏈 |
| `ubuntu-20.04` | x86_64 | Ubuntu 20.04 LTS | 12.0.0 | CC=clang, CXX=clang++ | Ubuntu 20.04+ | Ubuntu 20.04 LTS |
| `ubuntu-20.04-build-clang` | x86_64 | Ubuntu 20.04 LTS | 12.0.0 | CC=clang, CXX=clang++ | Ubuntu 20.04+ | `ubuntu-20.04` 並以 `clang` 作為預設工具鏈 |
| `ubuntu-20.04-build-gcc` | x86_64 | Ubuntu 20.04 LTS | 12.0.0 | CC=gcc, CXX=g++ | Ubuntu 20.04+ | `ubuntu-20.04` 並以 `gcc` 作為預設工具鏈 |
| `ubuntu-20.04-aarch64` | aarch64 | Ubuntu 20.04 LTS | 12.0.0 | CC=clang, CXX=clang++ | Ubuntu 20.04+ | 適用於 aarch64 的 `ubuntu-20.04` |
| `manylinux_2_28_x86_64` | x86_64 | AlmaLinux 8.10 | 17.0.6 || Ubuntu 20.04+, CentOS 8.4+ | 適用於 x86_64 的 manylinux_2_28 |
| `manylinux_2_28_aarch64` | aarch64 | AlmaLinux 8.10 | 17.0.6 || Ubuntu 20.04+, CentOS 8.4+ | 適用於 aarch64 的 manylinux_2_28 |

以 `-plugins-deps` 結尾的映像檔包含建置外掛所需的額外相依套件。

| `{tag name}` | 架構 | 基礎作業系統 | LLVM 版本 | 基礎映像檔 |
| --- | --- | --- | --- | --- |
| `ubuntu-build-clang-plugins-deps` | x86_64 | Ubuntu 24.04 LTS | 18.1.3 | `ubuntu-build-clang` |
| `ubuntu-build-gcc-plugins-deps` | x86_64 | Ubuntu 24.04 LTS | 18.1.3 | `ubuntu-build-gcc` |
| `ubuntu-20.04-build-clang-plugins-deps` | x86_64 | Ubuntu 20.04 LTS | 12.0.0 | `ubuntu-build-clang` |
| `ubuntu-20.04-build-gcc-plugins-deps` | x86_64 | Ubuntu 20.04 LTS | 12.0.0 | `ubuntu-build-gcc` |
| `manylinux_2_28_x86_64-plugins-deps` | x86_64 | AlmaLinux 8.10 | 17.0.6 | `manylinux_2_28_x86_64` |
| `manylinux_2_28_aarch64-plugins-deps` | aarch64 | AlmaLinux 8.10 | 17.0.6 | `manylinux_2_28_aarch64` |

## 已棄用的 Docker 映像檔

下方列出的映像檔已不再維護,但仍然可用。

| `{tag name}` | 架構 | 基礎作業系統 | LLVM 版本 | 環境變數 | 相容性 | 備註 |
| --- | --- | --- | --- | --- | --- | --- |
| `ubuntu2004_x86_64` | x86_64 | Ubuntu 20.04 LTS | 10.0.0 | CC=gcc, CXX=g++ | Ubuntu 20.04+ ||
| `ubuntu2104_armv7l` | armhf | Ubuntu 21.04 | 12.0.0 | CC=gcc, CXX=g++ | Ubuntu 21.04+ ||
| `manylinux2014_x86_64` | x86_64 | CentOS 7, 7.9.2009 | 17.0.6 || Ubuntu 16.04+, CentOS 7+ | 已棄用[¹] |
| `manylinux2014_aarch64` | aarch64 | CentOS 7, 7.9.2009 | 17.0.6 || Ubuntu 16.04+, CentOS 7+ | 已棄用[¹] |

- [¹] CentOS 7 的棄用通知見 [WasmEdge#3154](https://github.com/WasmEdge/WasmEdge/discussions/3154)

[¹]: https://github.com/WasmEdge/WasmEdge/discussions/3154
