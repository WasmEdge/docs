---
sidebar_position: 2
---

# containerd + crun

## 快速入門

[GitHub 儲存庫](https://github.com/second-state/wasmedge-containers-examples/)包含在 containerd 上執行我們範例應用程式的指令碼與 GitHub Actions。

- 簡易 WebAssembly 範例 [快速入門](https://github.com/second-state/wasmedge-containers-examples/blob/main/containerd/README.md) | [Github Actions](https://github.com/second-state/wasmedge-containers-examples/blob/main/.github/workflows/containerd.yml)
- HTTP 服務範例 [快速入門](https://github.com/second-state/wasmedge-containers-examples/blob/main/containerd/http_server/README.md) | [Github Actions](https://github.com/second-state/wasmedge-containers-examples/blob/main/.github/workflows/containerd-server.yml)

下方各節中,我們將解釋快速入門指令碼中的步驟。

- [containerd + crun](#containerd--crun)
  - [快速入門](#快速入門)
  - [安裝 containerd](#安裝-containerd)
  - [執行一個簡單的 WebAssembly 應用程式](#執行一個簡單的-webassembly-應用程式)
  - [執行一個 HTTP 伺服器應用程式](#執行一個-http-伺服器應用程式)

## 安裝 containerd

使用下列命令在你的系統上安裝 containerd。

```bash
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

設定 containerd 使用 `crun` 作為底層 OCI 執行環境。這會變更 `/etc/containerd/config.toml` 檔案。

```bash
sudo mkdir -p /etc/containerd/
sudo bash -c "containerd config default > /etc/containerd/config.toml"
wget https://raw.githubusercontent.com/second-state/wasmedge-containers-examples/main/containerd/containerd_config.diff
sudo patch -d/ -p0 < containerd_config.diff
```

啟動 containerd 服務。

```bash
sudo systemctl start containerd
```

接下來,在執行下列範例之前,請確保已[建置並安裝具備 WasmEdge 支援的 `crun` 二進位檔](../oci-runtime/crun.md)。

## 執行一個簡單的 WebAssembly 應用程式

現在,我們可以使用 containerd 執行一個簡單的 WebAssembly 程式。[另一篇文章](https://github.com/second-state/wasmedge-containers-examples/blob/main/simple_wasi_app.md)說明如何將 WebAssembly 程式編譯、打包並以容器映像檔的形式發佈到 Docker Hub。本節將開始從 Docker Hub 拉取這個基於 WebAssembly 的容器映像檔,並使用 containerd 工具進行操作。

```bash
sudo ctr i pull docker.io/wasmedge/example-wasi:latest
```

現在,你可以用 ctr(containerd cli)單行命令執行範例。

```bash
sudo ctr run --rm --runc-binary crun --runtime io.containerd.runc.v2 --label module.wasm.image/variant=compat-smart docker.io/wasmedge/example-wasi:latest wasm-example /wasi_example_main.wasm 50000000
```

啟動容器會執行 WebAssembly 程式。你可以在主控台中看見輸出。

```bash
Creating POD ...
Random number: -1678124602
Random bytes: [12, 222, 246, 184, 139, 182, 97, 3, 74, 155, 107, 243, 20, 164, 175, 250, 60, 9, 98, 25, 244, 92, 224, 233, 221, 196, 112, 97, 151, 155, 19, 204, 54, 136, 171, 93, 204, 129, 177, 163, 187, 52, 33, 32, 63, 104, 128, 20, 204, 60, 40, 183, 236, 220, 130, 41, 74, 181, 103, 178, 43, 231, 92, 211, 219, 47, 223, 137, 70, 70, 132, 96, 208, 126, 142, 0, 133, 166, 112, 63, 126, 164, 122, 49, 94, 80, 26, 110, 124, 114, 108, 90, 62, 250, 195, 19, 189, 203, 175, 189, 236, 112, 203, 230, 104, 130, 150, 39, 113, 240, 17, 252, 115, 42, 12, 185, 62, 145, 161, 3, 37, 161, 195, 138, 232, 39, 235, 222]
Printed from wasi: This is from a main function
This is from a main function
The env vars are as follows.
The args are as follows.
/wasi_example_main.wasm
50000000
File content is This is in a file
```

接下來,你可以在 [Kubernetes](../kubernetes/kubernetes-containerd-crun.md#a-simple-webassembly-app) 中執行!

## 執行一個 HTTP 伺服器應用程式

最後,我們可以在 containerd 中執行一個簡單的基於 WebAssembly 的 HTTP 微服務。[另一篇文章](https://github.com/second-state/wasmedge-containers-examples/blob/main/http_server_wasi_app.md)說明如何將 WebAssembly 程式編譯、打包並以容器映像檔的形式發佈到 Docker Hub。本節將從 Docker Hub 拉取這個基於 WebAssembly 的容器映像檔,並使用 containerd 工具進行操作。

```bash
sudo ctr i pull docker.io/wasmedge/example-wasi-http:latest
```

現在,你可以用 ctr(containerd cli)單行命令執行範例。請注意,我們以 `--net-host` 執行容器,讓 WasmEdge 容器內部的 HTTP 伺服器能從外部 shell 存取。

```bash
sudo ctr run --rm --net-host --runc-binary crun --runtime io.containerd.runc.v2 --label module.wasm.image/variant=compat-smart docker.io/wasmedge/example-wasi-http:latest http-server-example /http_server.wasm
```

啟動容器會執行 WebAssembly 程式。你可以在主控台中看見輸出。

```bash
new connection at 1234

# 於該 IP 位址測試 HTTP 服務
curl -d "name=WasmEdge" -X POST http://127.0.0.1:1234
echo: name=WasmEdge
```

接下來,你可以在 [Kubernetes](../kubernetes/kubernetes-containerd-crun.md#a-webassembly-based-http-service) 中執行!
