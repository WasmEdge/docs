---
sidebar_position: 1
---

# 8.6.1 Deploy with containerd's runwasi

<!-- prettier-ignore -->
:::info
Work in Progress
:::

The containerd-shim [runwasi](https://github.com/containerd/runwasi/) project supports WasmEdge.

## Prerequisites

1. [Install Rust](https://www.rust-lang.org/tools/install). Because we need to compile the runwasi project.

2. Install WasmEdge

    Run the following command lines to install WasmEdge.

    ```bash
    curl -sSf https://raw.githubusercontent.com/WasmEdge/WasmEdge/master/utils/install.sh | bash
    sudo -E sh -c 'echo "$HOME/.wasmedge/lib" > /etc/ld.so.conf.d/libwasmedge.conf'
    sudo ldconfig
    ```

3. Download the runwasi project and test

    After that, run the following command line to download the runwasi project and test.

    ```bash
    $ git clone https://github.com/second-state/runwasi.git
    $ cd runwasi
    $ cargo test -- --nocapture
    # the output should be the following connent.
    running 3 tests
    test instance::tests::test_maybe_open_stdio ... ok
    test instance::wasitest::test_delete_after_create ... ok
    test instance::wasitest::test_wasi ... ok
    ```

4. Build the wasmedge-containerd-shim

    ```bash
    rustup default nightly
    make build FEATURES=wasmedge
    sudo make install RUNTIME=wasmedge
    ```

## Run a simple Wasi app

WIP
