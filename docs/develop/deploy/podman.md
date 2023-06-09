---
sidebar_position: 3
---

# Podman

## Fedora Platform

The easiest platform to run Wasm app with container is Fedora, because the crun fedora package has supported WasmEdge as a default runtime. We don't need to make any changes to run WasmEdge apps on fedora platform. If you use other Linux distributions, go to [next section](#other-linux-distributions).

### Install podman and WasmEdge

```bash
sudo dnf -y install podman
sudo dnf -y install wasmedge
```

### Run A simple WASI app on Fedora

Now, we could run wasm apps.

```bash
podman run --rm --annotation module.wasm.image/variant=compat-smart docker.io/wasmedge/example-wasi:latest /wasi_example_main.wasm 50000000
```

That's it.

## Other Linux distributions

### Prerequisites

1. Install and configure Podman

    Use the following commands to install podman on your system. Here I use Ubuntu as an example. For more different types of podman, please refer to [Podman's installation instruction](https://podman.io/getting-started/installation).

    ```bash
    sudo apt-get -y update
    sudo apt-get -y install podman
    ```

2. [Install WasmEdge](../build-and-run/install)

3. Build and configure crun with WasmEdge support

    Next, configure and build a `crun` binary with WasmEdge support.

    ```bash
    ./autogen.sh
    ./configure --with-wasmedge
    make
    sudo make install
    # replace crun (be careful, you may want to do a bakup first)
    mv crun $(which crun)
    ```

    Then, you can use `crun -v` to check out if crun is installed successfully.

    ```bash
    crun --version
    # Output
    crun version 1.7.2.0.0.0.26-51af
    commit: 51af1448f60b69326cf26e726e14b38fcb253943
    rundir: /run/user/0/crun
    spec: 1.0.0
    +SYSTEMD +SELINUX +APPARMOR +CAP +SECCOMP +EBPF +WASM:wasmedge +YAJL
    ```

### Run A simple WASI app

Now, we could run wasm apps.

```bash
podman run --rm --annotation module.wasm.image/variant=compat-smart docker.io/wasmedge/example-wasi:latest /wasi_example_main.wasm 50000000
```

For more information, you could refered to [crun](../deploy/oci-runtime/crun) chapter.

There is a great open source project introducing podman and Wasm from community called [Kwasm](https://github.com/KWasm/podman-wasm). Check it out!
