---
sidebar_position: 1
---

# 使用 containerd 的 runwasi 部署

containerd-shim [runwasi](https://github.com/containerd/runwasi/) 專案支援 WasmEdge。

## 必備條件

1. [安裝 Rust](https://www.rust-lang.org/tools/install),因為我們需要編譯 runwasi 專案。

2. 下載 runwasi 專案

   ```bash
   git clone https://github.com/containerd/runwasi.git
   ```

3. 建置並安裝 wasmedge-containerd-shim

   ```bash
   # 參考:https://github.com/containerd/runwasi/blob/main/CONTRIBUTING.md#setting-up-your-local-environment
   cd runwasi
   ./scripts/setup-linux.sh
   make build-wasmedge
   INSTALL="sudo install" LN="sudo ln -sf" make install-wasmedge
   ```

## 執行一個簡單的 Wasi 應用程式

   ```bash
   make load
   sudo ctr run --rm --runtime=io.containerd.wasmedge.v1 ghcr.io/containerd/runwasi/wasi-demo-app:latest testwasm /wasi-demo-app.wasm echo 'hello'
   ```
