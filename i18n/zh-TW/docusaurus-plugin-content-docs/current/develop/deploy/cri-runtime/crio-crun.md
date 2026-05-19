---
sidebar_position: 3
---

# CRI-O + crun

## 快速入門

[GitHub 儲存庫](https://github.com/second-state/wasmedge-containers-examples/)包含在 CRI-O 上執行我們範例應用程式的指令碼與 GitHub Actions。

- 簡易 WebAssembly 範例 [快速入門](https://github.com/second-state/wasmedge-containers-examples/blob/main/crio/README.md) | [Github Actions](https://github.com/second-state/wasmedge-containers-examples/blob/main/.github/workflows/crio.yml)
- HTTP 服務範例 [快速入門](https://github.com/second-state/wasmedge-containers-examples/blob/main/crio/http_server/README.md) | [Github Actions](https://github.com/second-state/wasmedge-containers-examples/blob/main/.github/workflows/crio-server.yml)

下方各節中,我們將解釋快速入門指令碼中的步驟。

- [CRI-O + crun](#cri-o--crun)
  - [快速入門](#快速入門)
  - [安裝 CRI-O](#安裝-cri-o)
  - [設定 CRI-O 使用 crun](#設定-cri-o-使用-crun)
  - [執行一個簡單的 WebAssembly 應用程式](#執行一個簡單的-webassembly-應用程式)
  - [執行一個 HTTP 伺服器應用程式](#執行一個-http-伺服器應用程式)

## 安裝 CRI-O

使用下列命令在你的系統上安裝 CRI-O。

```bash
export OS="xUbuntu_20.04"
export VERSION="1.21"
apt update
apt install -y libseccomp2 || sudo apt update -y libseccomp2
echo "deb https://download.opensuse.org/repositories/devel:/kubic:/libcontainers:/stable/$OS/ /" > /etc/apt/sources.list.d/devel:kubic:libcontainers:stable.list
echo "deb https://download.opensuse.org/repositories/devel:/kubic:/libcontainers:/stable:/cri-o:/$VERSION/$OS/ /" > /etc/apt/sources.list.d/devel:kubic:libcontainers:stable:cri-o:$VERSION.list

curl -L https://download.opensuse.org/repositories/devel:kubic:libcontainers:stable:cri-o:$VERSION/$OS/Release.key | apt-key add -
curl -L https://download.opensuse.org/repositories/devel:/kubic:/libcontainers:/stable/$OS/Release.key | apt-key add -

apt-get update
apt-get install criu libyajl2
apt-get install cri-o cri-o-runc cri-tools containernetworking-plugins
systemctl start crio
```

## 設定 CRI-O 使用 crun

CRI-O 預設使用 `runc` 執行環境,我們需要將其設定為改用 `crun`。這透過新增至兩個設定檔來完成。

<!-- prettier-ignore -->
:::note
在開始下列步驟之前,請確保你已[建置並安裝具備 WasmEdge 支援的 `crun` 二進位檔](../oci-runtime/crun.md)。
:::

首先,建立 `/etc/crio/crio.conf` 檔案,並加入下列內容。這告訴 CRI-O 預設使用 `crun`。

```conf
[crio.runtime]
default_runtime = "crun"
```

`crun` 執行環境又定義於 `/etc/crio/crio.conf.d/01-crio-runc.conf` 檔案中。

```conf
[crio.runtime.runtimes.runc]
runtime_path = "/usr/lib/cri-o-runc/sbin/runc"
runtime_type = "oci"
runtime_root = "/run/runc"
# 上方為原始內容

# 在此加入我們的 crunw 執行環境
[crio.runtime.runtimes.crun]
runtime_path = "/usr/bin/crun"
runtime_type = "oci"
runtime_root = "/run/crun"
```

接下來,重新啟動 CRI-O 以套用設定變更。

```bash
systemctl restart crio
```

## 執行一個簡單的 WebAssembly 應用程式

現在,我們可以使用 CRI-O 執行一個簡單的 WebAssembly 程式。[另一篇文章](https://github.com/second-state/wasmedge-containers-examples/blob/main/simple_wasi_app.md)說明如何將 WebAssembly 程式編譯、打包並以容器映像檔的形式發佈到 Docker Hub。在本節,我們將開始從 Docker Hub 拉取這個基於 WebAssembly 的容器映像檔,並使用 CRI-O 工具進行操作。

```bash
sudo crictl pull docker.io/hydai/wasm-wasi-example:with-wasm-annotation
```

接著,我們必須建立兩個簡單的設定檔,指定 CRI-O 應如何在沙箱中執行此 WebAssembly 映像檔。我們已備有那兩個檔案 [container_wasi.json](https://github.com/second-state/wasmedge-containers-examples/blob/main/crio/container_wasi.json) 與 [sandbox_config.json](https://github.com/second-state/wasmedge-containers-examples/blob/main/crio/sandbox_config.json)。你可以將其下載至本機目錄,如下所示。

```bash
wget https://raw.githubusercontent.com/second-state/wasmedge-containers-examples/main/crio/sandbox_config.json
wget https://raw.githubusercontent.com/second-state/wasmedge-containers-examples/main/crio/container_wasi.json
```

現在你可以使用 CRI-O 依指定的設定建立一個 pod 與一個容器。

```bash
# 建立 POD。輸出將與範例不同。
$ sudo crictl runp sandbox_config.json
7992e75df00cc1cf4bff8bff660718139e3ad973c7180baceb9c84d074b516a4
# 設定輔助變數供稍後使用。
$ POD_ID=7992e75df00cc1cf4bff8bff660718139e3ad973c7180baceb9c84d074b516a4

# 建立容器實例。輸出將與範例不同。
$ sudo crictl create $POD_ID container_wasi.json sandbox_config.json
# 設定輔助變數供稍後使用。
CONTAINER_ID=1d056e4a8a168f0c76af122d42c98510670255b16242e81f8e8bce8bd3a4476f
```

啟動容器會執行 WebAssembly 程式。你可以在主控台中看見輸出。

```bash
# 列出容器;狀態應為 `Created`
$ sudo crictl ps -a
CONTAINER           IMAGE                                          CREATED              STATE               NAME                     ATTEMPT             POD ID
1d056e4a8a168       wasmedge/example-wasi:latest                   About a minute ago   Created             podsandbox1-wasm-wasi   0                   7992e75df00cc

# 啟動容器
$ sudo crictl start $CONTAINER_ID

# 重新檢查容器狀態。
# 若容器尚未完成工作,你會看到 Running 狀態
# 因為這個範例非常小。此時你可能會看到 Exited。
$ sudo crictl ps -a
CONTAINER           IMAGE                                          CREATED              STATE               NAME                     ATTEMPT             POD ID
1d056e4a8a168       wasmedge/example-wasi:latest                   About a minute ago   Running             podsandbox1-wasm-wasi   0                   7992e75df00cc

# 當容器結束時。你可以看到狀態變成 Exited。
$ sudo crictl ps -a
CONTAINER           IMAGE                                          CREATED              STATE               NAME                     ATTEMPT             POD ID
1d056e4a8a168       wasmedge/example-wasi:latest                   About a minute ago   Exited              podsandbox1-wasm-wasi   0                   7992e75df00cc

# 檢查容器的記錄。它應該顯示來自 WebAssembly 程式的輸出
$ sudo crictl logs $CONTAINER_ID

Test 1: Print Random Number
Random number: 960251471

Test 2: Print Random Bytes
Random bytes: [50, 222, 62, 128, 120, 26, 64, 42, 210, 137, 176, 90, 60, 24, 183, 56, 150, 35, 209, 211, 141, 146, 2, 61, 215, 167, 194, 1, 15, 44, 156, 27, 179, 23, 241, 138, 71, 32, 173, 159, 180, 21, 198, 197, 247, 80, 35, 75, 245, 31, 6, 246, 23, 54, 9, 192, 3, 103, 72, 186, 39, 182, 248, 80, 146, 70, 244, 28, 166, 197, 17, 42, 109, 245, 83, 35, 106, 130, 233, 143, 90, 78, 155, 29, 230, 34, 58, 49, 234, 230, 145, 119, 83, 44, 111, 57, 164, 82, 120, 183, 194, 201, 133, 106, 3, 73, 164, 155, 224, 218, 73, 31, 54, 28, 124, 2, 38, 253, 114, 222, 217, 202, 59, 138, 155, 71, 178, 113]

Test 3: Call an echo function
Printed from wasi: This is from a main function
This is from a main function

Test 4: Print Environment Variables
The env vars are as follows.
PATH: /usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
TERM: xterm
HOSTNAME: crictl_host
PATH: /usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
The args are as follows.
/var/lib/containers/storage/overlay/006e7cf16e82dc7052994232c436991f429109edea14a8437e74f601b5ee1e83/merged/wasi_example_main.wasm
50000000

Test 5: Create a file `/tmp.txt` with content `This is in a file`

Test 6: Read the content from the previous file
File content is This is in a file

Test 7: Delete the previous file
```

接下來,你可以嘗試在 [Kubernetes](../kubernetes/kubernetes-cri-o.md) 中執行此應用程式!

## 執行一個 HTTP 伺服器應用程式

最後,我們可以在 CRI-O 中執行一個簡單的基於 WebAssembly 的 HTTP 微服務。[另一篇文章](https://github.com/second-state/wasmedge-containers-examples/blob/main/http_server_wasi_app.md)說明如何將 WebAssembly 程式編譯、打包並以容器映像檔的形式發佈到 Docker Hub。在本節,我們將開始從 Docker Hub 拉取這個基於 WebAssembly 的容器映像檔,並使用 CRI-O 工具進行操作。

```bash
sudo crictl pull docker.io/avengermojo/http_server:with-wasm-annotation
```

接著,我們必須建立兩個簡單的設定檔,指定 CRI-O 應如何在沙箱中執行此 WebAssembly 映像檔。我們已備有那兩個檔案 [container_http_server.json](https://raw.githubusercontent.com/second-state/wasmedge-containers-examples/main/crio/http_server/container_http_server.json) 與 [sandbox_config.json](https://github.com/second-state/wasmedge-containers-examples/blob/main/crio/sandbox_config.json)。你可以將其下載至本機目錄,如下所示。

<!-- prettier-ignore -->
:::note
`sandbox_config.json` 檔案對於簡易 WASI 與 HTTP 伺服器範例都相同。另一個 `container_*.json` 檔案則是應用程式相關的,因為它包含應用程式的 Docker Hub URL。
:::

```bash
wget https://raw.githubusercontent.com/second-state/wasmedge-containers-examples/main/crio/sandbox_config.json
wget https://raw.githubusercontent.com/second-state/wasmedge-containers-examples/main/crio/http_server/container_http_server.json
```

現在你可以使用 CRI-O 依指定的設定建立一個 pod 與一個容器。

```bash
# 建立 POD。輸出將與範例不同。
$ sudo crictl runp sandbox_config.json
7992e75df00cc1cf4bff8bff660718139e3ad973c7180baceb9c84d074b516a4
# 設定輔助變數供稍後使用。
$ POD_ID=7992e75df00cc1cf4bff8bff660718139e3ad973c7180baceb9c84d074b516a4

# 建立容器實例。輸出將與範例不同。
$ sudo crictl create $POD_ID container_http_server.json sandbox_config.json
# 設定輔助變數供稍後使用。
CONTAINER_ID=1d056e4a8a168f0c76af122d42c98510670255b16242e81f8e8bce8bd3a4476f
```

啟動容器會執行 WebAssembly 程式。你可以在主控台中看見輸出。

```bash
# 啟動容器
$ sudo crictl start $CONTAINER_ID

# 檢查容器狀態。它應該為 Running。
# 若不是,稍等幾秒後再次檢查
$ sudo crictl ps -a
CONTAINER           IMAGE                                          CREATED                  STATE               NAME                ATTEMPT             POD ID
4eeddf8613691       wasmedge/example-wasi-http:latest              Less than a second ago   Running             http_server         0                   1d84f30e7012e

# 檢查容器的記錄,以確認 HTTP 伺服器是否在連接埠 1234 接聽
$ sudo crictl logs $CONTAINER_ID
new connection at 1234

# 取得指派給容器的 IP 位址
$ sudo crictl inspect $CONTAINER_ID | grep IP.0 | cut -d: -f 2 | cut -d'"' -f 2
10.85.0.2

# 於該 IP 位址測試 HTTP 服務
$ curl -d "name=WasmEdge" -X POST http://10.85.0.2:1234
echo: name=WasmEdge
```

接下來,你可以在 [Kubernetes](../kubernetes/kubernetes-cri-o.md) 中執行!
