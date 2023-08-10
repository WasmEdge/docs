---
sidebar_position: 3
---

# Deploy with youki

youki is an OCI container runtime written in Rust. youki has WasmEdge baked in. This chapter will walk you through deploying WASM images with youki.

## Prerequisites

1. Build and configure youki with WasmEdge support

   We will use Ubuntu 20.04 as an example. For other OS, please [see here](https://containers.github.io/youki/user/basic_setup.html).

   Run the following command line to build and install youki on your machine.

   ```bash
   $ sudo apt-get install   \
       pkg-config         \
       libsystemd-dev     \
       libdbus-glib-1-dev \
       build-essential    \
       libelf-dev \
       libseccomp-dev \
       libclang-dev
   ```

   Next, configure, build, and install a `youki` binary with WasmEdge support.

   ```bash
   git clone https://github.com/containers/youki.git
   go into the cloned directory
   cd youki
   make youki-dev
   ./youki -h
   ./scripts/build.sh -o . -r -f wasm-wasmedge
   export LD_LIBRARY_PATH=$HOME/.wasmedge/lib
   ```

2. [Install WasmEdge](../../../start/install.md#install)

3. Configure the `config.json` from youki to run WASM modules.

   To run a webassembly module with youki, the `config.json` has to include either runc.oci.handler or module.wasm.image/variant=compat". It also needs you to specify a valid .wasm (webassembly binary) or .wat (webassembly test) module as an entrypoint for the container.

   ```json
   "ociVersion": "1.0.2-dev",
   "annotations": {
       "run.oci.handler": "wasm"
   },
   "process": {
       "args": [
           "wasi_example_main.wasm",
           ],
   ```

## Run a simple WebAssembly app

Now we can run a simple WebAssembly app. [A separate article](https://github.com/second-state/wasmedge-containers-examples/blob/main/simple_wasi_app.md) explains how to compile, package, and publish the WebAssembly program as a container image to Docker hub.

```bash
sudo ctr i pull docker.io/wasmedge/example-wasi:latest
```

Run the example with Youki and Podman.

```bash
sudo podman --runtime /PATH/WHARE/YOU/BUILT/WITH/WASM-WASMEDGE/youki run /wasi_example_main.wasm 50000000
```

That's it.
