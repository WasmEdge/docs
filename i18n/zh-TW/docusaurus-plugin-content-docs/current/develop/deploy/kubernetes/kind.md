---
sidebar_position: 7
---

# Kind

KinD 是一款在 Docker 內執行的 Kubernetes 發行版,非常適合本機開發或整合測試。它執行 containerd 作為 CRI 並以 crun 作為 OCI Runtime。

<!-- prettier-ignore -->
:::note
本示範基於 containerd + crun。
:::

## 快速入門

作為必備條件,我們需要先安裝 KinD。為此,可以使用[快速入門指南](https://kind.sigs.k8s.io/docs/user/quick-start/#installing-from-release-binaries)與[發佈頁面](https://github.com/kubernetes-sigs/kind/releases)安裝最新版本的 KinD CLI。

若已安裝 KinD,我們可以直接從[這裡](https://github.com/Liquid-Reply/kind-crun-wasm)的範例開始:

```bash
# 建立一個「KinD 中的 WASM」叢集
kind create cluster --image ghcr.io/liquid-reply/kind-crun-wasm:v1.23.0
# 執行範例
kubectl run -it --rm --restart=Never wasi-demo --image=wasmedge/example-wasi:latest --annotations="module.wasm.image/variant=compat-smart" /wasi_example_main.wasm 50000000
```

本節剩餘部分將說明如何建立具備 wasmedge 支援的 KinD 節點映像檔。

## 建置 crun

KinD 使用 `kindest/node` 映像檔作為控制平面與工作節點。該映像檔包含 containerd 作為 CRI 並以 runc 作為 OCI Runtime。為了啟用 WasmEdge 支援,我們以 `crun` 取代 `runc`。

我們只需要節點映像檔所需的 crun 二進位檔,而不是整個建置工具鏈。因此我們使用多階段 dockerfile,在第一階段建立 crun,並只將 crun 二進位檔複製到節點映像檔。

```Dockerfile
FROM ubuntu:21.10 AS builder
WORKDIR /data
RUN DEBIAN_FRONTEND=noninteractive apt update \
    && DEBIAN_FRONTEND=noninteractive apt install -y curl make git gcc build-essential pkgconf libtool libsystemd-dev libprotobuf-c-dev libcap-dev libseccomp-dev libyajl-dev go-md2man libtool autoconf python3 automake \
    && curl https://raw.githubusercontent.com/WasmEdge/WasmEdge/master/utils/install.sh | bash -s -- -p /usr/local \
    && git clone --single-branch --branch feat/handler_per_container https://github.com/liquid-reply/crun \
    && cd crun \
    && ./autogen.sh \
    && ./configure --with-wasmedge --enable-embedded-yajl\
    && make

...
```

現在我們有了一個位於 `/data/crun/crun` 啟用 wasmedge 的全新 `crun` 二進位檔,可以在下一步從這個容器複製出來。

## 替換 crun 並設定 containerd

runc 與 crun 都實作 OCI 執行環境規範並具備相同的 CLI 參數。因此我們可以將 runc 二進位檔替換為先前建立的 crun-wasmedge 二進位檔。

由於 crun 使用共享函式庫,我們需要安裝 libyajl、wasmedge 與 criu,才能讓我們的 crun 運作。

現在我們有了使用 crun 而非 runc 的 KinD。接著我們需要兩個設定變更。第一個是 `/etc/containerd/config.toml`,我們在其中加入可以傳遞給執行環境的 `pod_annotations`:

```toml
[plugins."io.containerd.grpc.v1.cri".containerd.runtimes.runc]
  pod_annotations = ["*.wasm.*", "wasm.*", "module.wasm.image/*", "*.module.wasm.image", "module.wasm.image/variant.*"]
```

第二個是 `/etc/containerd/cri-base.json`,我們在其中移除一個會造成問題的 hook。

結果 dockerfile 如下:

```Dockerfile
...

FROM kindest/node:v1.23.0

COPY config.toml /etc/containerd/config.toml
COPY --from=builder /data/crun/crun /usr/local/sbin/runc
COPY --from=builder /usr/local/lib/libwasmedge.so /usr/local/lib/libwasmedge.so

RUN echo "Installing Packages ..." \
    && bash -c 'cat <<< $(jq "del(.hooks.createContainer)" /etc/containerd/cri-base.json) > /etc/containerd/cri-base.json' \
    && ldconfig
```

## 建置並測試

最後,我們可以建置新的 `node-wasmedge` 映像檔。我們從該映像檔建立 kind 叢集並執行簡單應用程式範例來測試它。

```bash
docker build -t node-wasmedge .
kind create cluster --image node-wasmedge
# 現在你可以執行範例來驗證你的叢集
kubectl run -it --rm --restart=Never wasi-demo --image=wasmedge/example-wasi:latest --annotations="module.wasm.image/variant=compat-smart" /wasi_example_main.wasm 50000000
```
