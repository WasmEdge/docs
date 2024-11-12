---
sidebar_position: 2
---

# Docker Images for Building WasmEdge

You can pull a Docker image with the following command to [build WasmEdge from source](build_from_src.md).

```bash
docker pull wasmedge/wasmedge:{tag_name}
```

## Weekly-Built Docker Images

Images listed below are used in WasmEdge CI workflows for testing and/or release. All of them contain preinstalled dependencies for building WasmEdge (core).

| `{tag name}` | Arch | Based OS | LLVM version | ENVs | Compatibility | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `latest` | x86_64 | Ubuntu 24.04 LTS | 18.1.3 | CC=clang, CXX=clang++ | Ubuntu 24.04+ | Latest Ubuntu LTS, currently Ubuntu 24.04 LTS |
| `ubuntu-build-clang` | x86_64 | Ubuntu 24.04 LTS | 18.1.3 | CC=clang, CXX=clang++ | Ubuntu 24.04+ | `latest` with `clang` as the default toolchain |
| `ubuntu-build-gcc` | x86_64 | Ubuntu 24.04 LTS | 18.1.3 | CC=gcc, CXX=g++ | Ubuntu 24.04+ | `latest` with `gcc` as the default toolchain |
| `ubuntu-20.04` | x86_64 | Ubuntu 20.04 LTS | 12.0.0 | CC=clang, CXX=clang++ | Ubuntu 20.04+ | Ubuntu 20.04 LTS |
| `ubuntu-20.04-build-clang` | x86_64 | Ubuntu 20.04 LTS | 12.0.0 | CC=clang, CXX=clang++ | Ubuntu 20.04+ | `ubuntu-20.04` with `clang` as the default toolchain |
| `ubuntu-20.04-build-gcc` | x86_64 | Ubuntu 20.04 LTS | 12.0.0 | CC=gcc, CXX=g++ | Ubuntu 20.04+ | `ubuntu-20.04` with `gcc` as the default toolchain |
| `ubuntu-20.04-aarch64` | aarch64 | Ubuntu 20.04 LTS | 12.0.0 | CC=clang, CXX=clang++ | Ubuntu 20.04+ | `ubuntu-20.04` for aarch64 |
| `manylinux_2_28_x86_64` | x86_64 | AlmaLinux 8.10 | 17.0.6 || Ubuntu 20.04+, CentOS 8.4+ | manylinux_2_28 for x86_64 |
| `manylinux_2_28_aarch64` | aarch64 | AlmaLinux 8.10 | 17.0.6 || Ubuntu 20.04+, CentOS 8.4+ | manylinux_2_28 for aarch64 |

Images that end with `-plugins-deps` contain extra dependencies for building plugins.

| `{tag name}` | Arch | Based OS | LLVM version | Base Image |
| --- | --- | --- | --- | --- |
| `ubuntu-build-clang-plugins-deps` | x86_64 | Ubuntu 24.04 LTS | 18.1.3 | `ubuntu-build-clang` |
| `ubuntu-build-gcc-plugins-deps` | x86_64 | Ubuntu 24.04 LTS | 18.1.3 | `ubuntu-build-gcc` |
| `ubuntu-20.04-build-clang-plugins-deps` | x86_64 | Ubuntu 20.04 LTS | 12.0.0 | `ubuntu-build-clang` |
| `ubuntu-20.04-build-gcc-plugins-deps` | x86_64 | Ubuntu 20.04 LTS | 12.0.0 | `ubuntu-build-gcc` |
| `manylinux_2_28_x86_64-plugins-deps` | x86_64 | AlmaLinux 8.10 | 17.0.6 | `manylinux_2_28_x86_64` |
| `manylinux_2_28_aarch64-plugins-deps` | aarch64 | AlmaLinux 8.10 | 17.0.6 | `manylinux_2_28_aarch64` |

## Deprecated Docker Images

Images listed below are no longer maintained but still available.

| `{tag name}` | Arch | Based OS | LLVM version | ENVs | Compatibility | Note |
| --- | --- | --- | --- | --- | --- | --- |
| `ubuntu2004_x86_64` | x86_64 | Ubuntu 20.04 LTS | 10.0.0 | CC=gcc, CXX=g++ | Ubuntu 20.04+ ||
| `ubuntu2104_armv7l` | armhf | Ubuntu 21.04 | 12.0.0 | CC=gcc, CXX=g++ | Ubuntu 21.04+ ||
| `manylinux2014_x86_64` | x86_64 | CentOS 7, 7.9.2009 | 17.0.6 || Ubuntu 16.04+, CentOS 7+ | Deprecated[¹] |
| `manylinux2014_aarch64` | aarch64 | CentOS 7, 7.9.2009 | 17.0.6 || Ubuntu 16.04+, CentOS 7+ | Deprecated[¹] |

- [¹] Deprecation notice of CentOS 7 at [WasmEdge#3154](https://github.com/WasmEdge/WasmEdge/discussions/3154)

[¹]: https://github.com/WasmEdge/WasmEdge/discussions/3154
