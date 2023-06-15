---
sidebar_position: 2
---

# Deploy with crun

The [crun project](https://github.com/containers/crun) has WasmEdge support baked in. This chapter will walk you through deploying Wasm images with crun.

## Fedora Platform

The crun fedora package has WasmEdge as the default WebAssembly Runtime. So the easiest way to deploy WasmEdge with crun in on the Fedora Linux distributions. For the other Linux distributions, please refer to the [next section](#other-linux-platforms).

First, install crun and WasmEdge on your fedora machine.

```bash
sudo dnf -y install wasmedge
sudo dnf -y install crun
```

Next, run `crun -v` to check if you installed successfully.

```bash
crun -v
# Output
crun version 1.7.2
commit: 0356bf4aff9a133d655dc13b1d9ac9424706cac4
rundir: /run/user/501/crun
spec: 1.0.0
+SYSTEMD +SELINUX +APPARMOR +CAP +SECCOMP +EBPF +CRIU +LIBKRUN +WASM:wasmedge +YAJL
```

You can see that crun has WasmEdge package already.

Next, you can run Wasm apps on your [fedora machine](/develop/getting-started/quick_start_redhat.md).

## Other Linux Platforms

### Quick start

The [GitHub repo](https://github.com/second-state/wasmedge-containers-examples/) contains scripts and Github Actions for running our example apps on CRI-O.

- Simple WebAssembly example [Quick start](https://github.com/second-state/wasmedge-containers-examples/blob/main/crio/README.md) | [Github Actions](https://github.com/second-state/wasmedge-containers-examples/blob/main/.github/workflows/crio.yml)
- HTTP service example [Quick start](https://github.com/second-state/wasmedge-containers-examples/blob/main/crio/http_server/README.md) | [Github Actions](https://github.com/second-state/wasmedge-containers-examples/blob/main/.github/workflows/crio-server.yml)

### Prerequisites

1. Make sure you have installed [WasmEdge](../../build-and-run/install)

2. Build and configure crun with WasmEdge support

For now, the easiest approach is just built it yourself from source. First, let's make sure that `crun` dependencies are installed on your Ubuntu 20.04. For other Linux distributions, please [see here](https://github.com/containers/crun#readme).

```bash
sudo apt update
sudo apt install -y make git gcc build-essential pkgconf libtool \
    libsystemd-dev libprotobuf-c-dev libcap-dev libseccomp-dev libyajl-dev \
    go-md2man libtool autoconf python3 automake
```

Next, configure, build, and install a `crun` binary with WasmEdge support.

```bash
git clone https://github.com/containers/crun
cd crun
./autogen.sh
./configure --with-wasmedge
make
sudo make install
```
