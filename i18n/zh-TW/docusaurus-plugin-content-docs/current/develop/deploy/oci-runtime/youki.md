---
sidebar_position: 3
---

# 使用 youki 部署

youki 是以 Rust 撰寫的 OCI 容器執行環境。youki 已內建 WasmEdge。本章將引導你使用 youki 部署 WASM 映像檔。

## 必備條件

1. 建置並設定具備 WasmEdge 支援的 youki

   我們以 Ubuntu 20.04 為例。其他作業系統請[參閱此處](https://containers.github.io/youki/user/basic_setup.html)。

   執行下列命令列以在你的機器上建置並安裝 youki。

   ```bash
   $ sudo apt-get install \
      curl                \
      git                 \
      pkg-config          \
      libsystemd-dev      \
      libdbus-glib-1-dev  \
      build-essential     \
      libelf-dev          \
      libzstd-dev         \
      libseccomp-dev      \
      libclang-dev

   # 若你尚未安裝 rust toolchain,執行:
   $ curl https://sh.rustup.rs -sSf | sudo sh -s -- -y
   ```

   接著,設定、建置並安裝具備 WasmEdge 支援的 `youki` 二進位檔。

   ```bash
   git clone --recurse-submodules https://github.com/containers/youki.git
   cd youki
   ./scripts/build.sh -o . -r -f wasm-wasmedge
   ./youki -h
   export LD_LIBRARY_PATH=$HOME/.wasmedge/lib
   ```

2. [安裝 WasmEdge](../../../start/install.md#install)

3. 設定 youki 的 `config.json` 以執行 WASM 模組。

   若要以 youki 執行 webassembly 模組,`config.json` 必須包含 runc.oci.handler 或 module.wasm.image/variant=compat。它也需要你指定一個有效的 .wasm(webassembly 二進位檔)或 .wat(webassembly 測試)模組作為容器的進入點。

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

## 執行一個簡單的 WebAssembly 應用程式

現在我們可以執行一個簡單的 WebAssembly 應用程式。[另一篇文章](https://github.com/second-state/wasmedge-containers-examples/blob/main/simple_wasi_app.md)說明如何將 WebAssembly 程式編譯、打包並以容器映像檔的形式發佈到 Docker Hub。

```bash
sudo ctr i pull docker.io/wasmedge/example-wasi:latest
```

以 Youki 與 Podman 執行範例。

```bash
sudo podman --runtime /PATH/WHARE/YOU/BUILT/WITH/WASM-WASMEDGE/youki run /wasi_example_main.wasm 50000000
```

就是這樣。
