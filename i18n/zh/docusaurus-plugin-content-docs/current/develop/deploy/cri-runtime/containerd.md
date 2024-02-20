---
sidebar_position: 1
---

# Deploy with containerd's runwasi

The containerd-shim [runwasi](https://github.com/containerd/runwasi/) project supports WasmEdge.

## Prerequisites

1. [Install Rust](https://www.rust-lang.org/tools/install) because we need to compile the runwasi project.

2. Download the runwasi project
   ```bash
   $ git clone https://github.com/containerd/runwasi.git
   ```

3. Build and install the wasmedge-containerd-shim

   ```bash
   cd runwasi
   make build-wasmedge
   INSTALL="sudo install" LN="sudo ln -sf" make install-wasmedge
   ```

## Run a simple Wasi app

   ```bash
   make load
   sudo ctr run --rm --runtime=io.containerd.wasmedge.v1 ghcr.io/containerd/runwasi/wasi-demo-app:latest testwasm /wasi-demo-app.wasm echo 'hello'
   ```
