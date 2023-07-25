---
sidebar_position: 2
---

# Docker Images for Building WasmEdge

WasmEdge supports a wide range of Linux distributions dated back to 2014. The official release contains statically linked binaries and libraries for older Linux systems.

The table below shows build targets in WasmEdge's official release packages.

Developers can use the `docker pull wasmedge/wasmedge:{tag_name}` command to pull the docker image for WasmEdge building.

| tag name | arch | based operating system | LLVM version | ENVs | compatibility | comments |
| --- | --- | --- | --- | --- | --- | --- |
| `latest` | x86_64 | Ubuntu 22.04 LTS | 15.0.7 | CC=clang, CXX=clang++ | Ubuntu 22.04+ | This is for CI, will always use the latest Ubuntu LTS release |
| `ubuntu-build-gcc` | x86_64 | Ubuntu 22.04 LTS | 15.0.7 | CC=gcc, CXX=g++ | Ubuntu 22.04+ | This is for CI, will always use the latest Ubuntu LTS release |
| `ubuntu-build-clang` | x86_64 | Ubuntu 22.04 LTS | 15.0.7 | CC=clang, CXX=clang++ | Ubuntu 22.04+ | This is for CI, will always use the latest Ubuntu LTS release |
| `ubuntu2004_x86_64` | x86_64 | Ubuntu 20.04 LTS | 10.0.0 | CC=gcc, CXX=g++ | Ubuntu 20.04+ | This is for developers who familiar with Ubuntu 20.04 LTS release |
| `ubuntu2104_armv7l` | armhf | Ubuntu 21.04 | 12.0.0 | CC=gcc, CXX=g++ | Ubuntu 21.04+ | This is for armhf release |
| `manylinux2014_x86_64` | x86_64 | CentOS 7, 7.9.2009 | 16.0.5 | CC=gcc, CXX=g++ | Ubuntu 16.04+, CentOS 7+ | This is for developers who familiar with CentOS on x86_64 architecture |
| `manylinux2014_aarch64` | aarch64 | CentOS 7, 7.9.2009 | 16.0.5 | CC=gcc, CXX=g++ | Ubuntu 16.04+, CentOS 7+ | This is for developers who familiar with CentOS on aarch64 architecture |
