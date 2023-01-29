---
sidebar_position: 1
---

# 8.5.1 Deploy with containerd

Work in progress.

The containerd-shim [runwasi](https://github.com/containerd/runwasi/) project will support WasmEdge soon. This is [an ongoing PR](https://github.com/containerd/runwasi/pull/26) to track the progress. But before this, we have [a forked version](https://github.com/second-state/runwasi) that works well on the Docker platform.

## Prerequisites

1. [Install Rust](https://www.rust-lang.org/tools/install). That's because we need to compile the runwasi project.

2. Install containerd

Use the following commands to install containerd on your system. Here I use Ubuntu 20.04 as the platform. For other platform, please refer to 

```
export VERSION="1.5.7"
echo -e "Version: $VERSION"
echo -e "Installing libseccomp2 ..."
sudo apt install -y libseccomp2
echo -e "Installing wget"
sudo apt install -y wget

wget https://github.com/containerd/containerd/releases/download/v${VERSION}/cri-containerd-cni-${VERSION}-linux-amd64.tar.gz
wget https://github.com/containerd/containerd/releases/download/v${VERSION}/cri-containerd-cni-${VERSION}-linux-amd64.tar.gz.sha256sum
sha256sum --check cri-containerd-cni-${VERSION}-linux-amd64.tar.gz.sha256sum

sudo tar --no-overwrite-dir -C / -xzf cri-containerd-cni-${VERSION}-linux-amd64.tar.gz
sudo systemctl daemon-reload
```

3. Install WasmEdge

Run the following command lines to install WasmEdge.

```
$ curl -sSf https://raw.githubusercontent.com/WasmEdge/WasmEdge/master/utils/install.sh | bash
$ sudo -E sh -c 'echo "$HOME/.wasmedge/lib" > /etc/ld.so.conf.d/libwasmedge.conf'
$ sudo ldconfig
```
4. Download the runwasi project and test
After that, run the following command line to download the runwasi project and test.
```
$ git clone https://github.com/second-state/runwasi.git
$ cd runwasi
$ cargo test -- --nocapture
# the output should be the following connent.
running 3 tests
test instance::tests::test_maybe_open_stdio ... ok
test instance::wasitest::test_delete_after_create ... ok
test instance::wasitest::test_wasi ... ok
```

5. Build the wasmedge-containerd-shim
```
rustup default nightly
make build FEATURES=wasmedge
sudo make install RUNTIME=wasmedge
```

## Run a simple Wasi app

WIP