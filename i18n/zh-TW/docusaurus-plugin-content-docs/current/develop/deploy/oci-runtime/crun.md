---
sidebar_position: 2
---

# 使用 crun 部署

[crun 專案](https://github.com/containers/crun)已內建 WasmEdge 支援。本章將引導你使用 crun 部署 WASM 映像檔。

## Fedora 平台

crun 的 fedora 套件已將 WasmEdge 作為預設的 WebAssembly 執行環境。因此在 Fedora Linux 發行版上是最容易透過 crun 部署 WasmEdge 的方式。其他 Linux 發行版請參閱[下一節](#其他-linux-平台)。

首先,在你的 fedora 機器上安裝 crun 與 WasmEdge。

```bash
sudo dnf -y install wasmedge
sudo dnf -y install crun
```

接著,執行 `crun -v` 檢查是否安裝成功。

```bash
crun -v
# 輸出
crun version 1.7.2
commit: 0356bf4aff9a133d655dc13b1d9ac9424706cac4
rundir: /run/user/501/crun
spec: 1.0.0
+SYSTEMD +SELINUX +APPARMOR +CAP +SECCOMP +EBPF +CRIU +LIBKRUN +WASM:wasmedge +YAJL
```

你可以看到 crun 已經帶有 WasmEdge 套件。

接下來,你可以在你的 [fedora 機器](../../../start/getting-started/quick_start_redhat.md)上執行 WASM 應用程式。

## 其他 Linux 平台

### 快速入門

[GitHub 儲存庫](https://github.com/second-state/wasmedge-containers-examples/)包含在 CRI-O 上執行我們範例應用程式的指令碼與 GitHub Actions。

- 簡易 WebAssembly 範例 [快速入門](https://github.com/second-state/wasmedge-containers-examples/blob/main/crio/README.md) | [Github Actions](https://github.com/second-state/wasmedge-containers-examples/blob/main/.github/workflows/crio.yml)
- HTTP 服務範例 [快速入門](https://github.com/second-state/wasmedge-containers-examples/blob/main/crio/http_server/README.md) | [Github Actions](https://github.com/second-state/wasmedge-containers-examples/blob/main/.github/workflows/crio-server.yml)

### 必備條件

1. 請確認你已安裝 [WasmEdge](../../../start/install.md#install)

2. 建置並設定具備 WasmEdge 支援的 crun

目前,最簡單的方式是從原始碼自行建置。首先,請確保你的 Ubuntu 20.04 上已安裝 `crun` 的相依套件。其他 Linux 發行版請[參閱此處](https://github.com/containers/crun#readme)。

```bash
sudo apt update
sudo apt install -y make git gcc build-essential pkgconf libtool \
    libsystemd-dev libprotobuf-c-dev libcap-dev libseccomp-dev libyajl-dev \
    go-md2man libtool autoconf python3 automake
```

接著,設定、建置並安裝具備 WasmEdge 支援的 `crun` 二進位檔。

```bash
git clone https://github.com/containers/crun
cd crun
./autogen.sh
./configure --with-wasmedge
make
sudo make install
```
