---
sidebar_position: 4
---

# OpenYurt

OpenYurt 是一款智慧型邊緣運算平台,旨在將雲端原生生態系延伸至邊緣運算與 IoT 場景。

本文將介紹如何在 [OpenYurt](https://github.com/openyurtio/openyurt) 上以 Containerd 執行一個 WasmEdge 簡易示範應用程式。

<!-- prettier-ignore -->
:::note
本示範基於 containerd + crun。
:::

## 建立 OpenYurt 叢集

這裡,我們介紹兩種建立 OpenYurt 叢集的方法。第一種是從零建立 OpenYurt 叢集,並使用 `yurtctl convert` 將 K8s 叢集轉換為 OpenYurt 叢集。第二種是使用 OpenYurt Experience Center 的能力,可以輕鬆達成一個 OpenYurt 叢集。

### 必備條件

|        | 作業系統 / 核心                       | 私有 IP / 公開 IP            |
| ------ | ----------------------------------- | ---------------------------- |
| Master | Ubuntu 20.04.3 LTS/5.4.0-91-generic | 192.168.3.169/120.55.126.18  |
| Node   | Ubuntu 20.04.3 LTS/5.4.0-91-generic | 192.168.3.170/121.43.113.152 |

部分步驟可能會因作業系統差異而略有不同。請參閱 [OpenYurt](https://github.com/openyurtio/openyurt) 與 [crun](https://github.com/containers/crun) 的安裝。

我們使用 `yurtctl convert` 將 K8s 叢集轉換為 OpenYurt 叢集,因此需要先建立一個 K8s 叢集。如果你使用 `yurtctl init/join` 來建立 OpenYurt 叢集,可以跳過此步驟(介紹安裝 K8s)。

要了解 `yurtctl convert/revert` 與 `yurtctl init/join` 的差異,可以參考下列兩篇文章。

[如何使用 `Yurtctl init/join`](https://openyurt.io/docs/v0.6.0/installation/yurtctl-init-join)

[OpenYurt 與 Kubernetes 之間的轉換:`yurtctl convert/revert`](https://openyurt.io/docs/v0.6.0/installation/yurtctl-convert-revert)

- 首先關閉 master 與 node 的交換空間。

```bash
sudo swapoff -a
//驗證
free -m
```

- 將兩個節點的 /etc/hosts 檔案設定如下。

```bash
192.168.3.169  oy-master
120.55.126.18  oy-master
92.168.3.170   oy-node
121.43.113.152 oy-node
```

- 載入 br_netfilter 核心模組並修改核心參數。

```bash
//載入模組
sudo modprobe br_netfilter
//驗證
lsmod | grep br_netfilter
// 建立 k8s.conf
cat <<EOF | sudo tee /etc/sysctl.d/k8s.conf
net.bridge.bridge-nf-call-ip6tables = 1
net.bridge.bridge-nf-call-iptables = 1
EOF
sudo sysctl --system
```

- 設定 rp-filter 的值(將 `/etc/sysctl.d/10-network-security.conf` 中兩個參數的值從 2 調整為 1,並將 /proc/sys/net/ipv4/ip_forward 的值設定為 1)

```bash
sudo vi /etc/sysctl.d/10-network-security.conf
echo 1 > /proc/sys/net/ipv4/ip_forward
sudo sysctl --system
```

#### 安裝 containerd 並修改 containerd 的預設設定

使用下列命令在你的邊緣節點上安裝 containerd 以執行一個簡單的 WasmEdge 示範。

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

由於 crun 專案預設支援 WasmEdge,我們需要為 runc 設定 containerd 設定。因此我們需要將 /etc/containerd/config.toml 中的 runc 參數修改為 curn 並加入 pod_annotation。

```bash
sudo mkdir -p /etc/containerd/
sudo bash -c "containerd config default > /etc/containerd/config.toml"
wget https://raw.githubusercontent.com/second-state/wasmedge-containers-examples/main/containerd/containerd_config.diff
sudo patch -d/ -p0 < containerd_config.diff
```

之後,重新啟動 containerd 讓設定生效。

```bash
systemctl start containerd
```

#### 安裝 WasmEdge

使用[簡易安裝指令碼](../../../start/install.md#install)在你的邊緣節點上安裝 WasmEdge。

```bash
curl -sSf https://raw.githubusercontent.com/WasmEdge/WasmEdge/master/utils/install.sh | bash
```

#### 建置並安裝 crun

我們需要一個在邊緣節點上支援 WasmEdge 的 crun 二進位檔。目前,最直接的方式是從原始碼自行建置。首先,請確保你的 Ubuntu 20.04 上已安裝 crun 的相依套件。其他 Linux 發行版請[參閱此處](https://github.com/containers/crun#readme)。

- 建置所需的相依套件

```bash
sudo apt update
sudo apt install -y make git gcc build-essential pkgconf libtool \
  libsystemd-dev libprotobuf-c-dev libcap-dev libseccomp-dev libyajl-dev \
  go-md2man libtool autoconf python3 automake
```

- 設定、建置並安裝具備 WasmEdge 支援的 crun 二進位檔。

```bash
git clone https://github.com/containers/crun
cd crun
./autogen.sh
./configure --with-wasmedge
make
sudo make install
```

### 從零建立 OpenYurt 叢集

在本示範中,我們將使用兩台機器來建立一個 OpenYurt 叢集。一個模擬的雲端節點稱為 Master,另一個模擬的邊緣節點稱為 Node。這兩個節點構成最簡單的 OpenYurt 叢集,OpenYurt 元件在其上執行。

#### 建立 K8s 叢集

Kubernetes 版本 1.18.9

```bash
$ sudo apt-get update && sudo apt-get install -y ca-certificates curl software-properties-common apt-transport-https
// 加入 K8s 來源
$ curl -s https://mirrors.aliyun.com/kubernetes/apt/doc/apt-key.gpg | sudo apt-key add -
$ sudo tee /etc/apt/sources.list.d/kubernetes.list <<EOF
$ deb https://mirrors.aliyun.com/kubernetes/apt/ kubernetes-xenial main
// 安裝 K8s 元件 1.18.9
$ sudo apt-get update && sudo apt-get install -y kubelet=1.18.9-00 kubeadm=1.18.9-00 kubectl=1.18.9-00
// 初始化 master 節點
$ sudo kubeadm init --pod-network-cidr 172.16.0.0/16 \
--apiserver-advertise-address=192.168.3.167 \
--image-repository registry.cn-hangzhou.aliyuncs.com/google_containers
// 加入工作節點
$ kubeadm join 192.168.3.167:6443 --token 3zefbt.99e6denc1cxpk9fg \
   --discovery-token-ca-cert-hash sha256:8077d4e7dd6eee64a999d56866ae4336073ed5ffc3f23281d757276b08b9b195
```

#### 安裝 yurtctl

使用下列命令列安裝 yurtctl。yurtctl CLI 工具可協助安裝/解除安裝 OpenYurt,並將標準的 Kubernetes 叢集轉換為 OpenYurt 叢集。

```bash
git clone https://github.com/openyurtio/openyurt.git
cd openyurt
make build WHAT=cmd/yurtctl
```

#### 安裝 OpenYurt 元件

OpenYurt 包含多個元件。YurtHub 是節點上元件與 Kube-apiserver 之間的流量代理。邊緣端的 YurtHub 會快取自雲端回傳的資料。Yurt controller 補充上游節點控制器以支援邊緣運算需求。TunnelServer 透過反向代理與每個邊緣節點上執行的 TunnelAgent 守護程式相連接,以在雲端控制平面與連接到內網的邊緣節點之間建立安全的網路存取。如需更多詳情,請參閱 [OpenYurt 文件](https://github.com/openyurtio/openyurt)。

```bash
yurtctl convert --deploy-yurttunnel --cloud-nodes oy-master --provider kubeadm\
--yurt-controller-manager-image="openyurt/yurt-controller-manager:v0.5.0"\
--yurt-tunnel-agent-image="openyurt/yurt-tunnel-agent:v0.5.0"\
--yurt-tunnel-server-image="openyurt/yurt-tunnel-server:v0.5.0"\
--node-servant-image="openyurt/node-servant:latest"\
--yurthub-image="openyurt/yurthub:v0.5.0"
```

我們需要在這裡將 `openyurt/node-server-version` 改為 latest:`--node-servant-image="openyurt/node-servant:latest"`

建議安裝 OpenYurt 元件 0.6.0 版本,並已證實能成功執行 WasmEdge 示範。如何安裝 OpenYurt:0.6.0,你可以參閱[此處](https://github.com/openyurtio/openyurt/releases/tag/v0.6.0)

### 使用 OpenYurt Experience Center 快速建立 OpenYurt 叢集

建立 OpenYurt 叢集較簡單的方式是使用 OpenYurt Experience Center。你所需要做的就是註冊一個用於測試的帳號,然後你就會取得一個 OpenYurt 叢集。接著你可以使用 `yurtctl join` 命令列加入一個邊緣節點。如需更多 OpenYurt Experience Center 詳情請[參閱此處](https://openyurt.io/docs/installation/openyurt-experience-center/overview/)。

## 執行一個簡單的 WebAssembly 應用程式

接下來,讓我們透過 OpenYurt 叢集將一個 WebAssembly 程式以 pod 內容器的形式執行。本節將先從 Docker Hub 拉取此基於 WebAssembly 的容器映像檔。如果你想學習如何將 WebAssembly 程式編譯、打包並以容器映像檔的形式發佈到 Docker Hub,請參閱 [WasmEdge Book](https://github.com/second-state/wasmedge-containers-examples/blob/main/simple_wasi_app.md)。

由於 kubectl run(版本 1.18.9)缺少 annotations 參數,我們需要在這裡調整命令列。如果你預設使用 OpenYurt Experience Center 搭配 OpenYurt 0.6.0 與 Kubernetes 1.20.11,請參閱 WasmEdge book 中的 [Kubernetes 章節]來執行 wasm 應用程式。

```bash
// kubectl 1.18.9
$ sudo kubectl run -it --rm --restart=Never wasi-demo --image=wasmedge/example-wasi:latest  --overrides='{"kind":"Pod","metadata":{"annotations":{"module.wasm.image/variant":"compat-smart"}} , "apiVersion":"v1", "spec": {"hostNetwork": true}}' /wasi_example_main.wasm 50000000

// kubectl 1.20.11
$ sudo kubectl run -it --rm --restart=Never wasi-demo --image=wasmedge/example-wasi:latest --annotations="module.wasm.image/variant=compat-smart" --overrides='{"kind":"Pod", "apiVersion":"v1", "spec": {"hostNetwork": true}}' /wasi_example_main.wasm 50000000

```

來自容器化應用程式的輸出會印到主控台。所有 Kubernetes 版本的輸出皆相同。

```bash
Random number: 1123434661
Random bytes: [25, 169, 202, 211, 22, 29, 128, 133, 168, 185, 114, 161, 48, 154, 56, 54, 99, 5, 229, 161, 225, 47, 85, 133, 90, 61, 156, 86, 3, 14, 10, 69, 185, 225, 226, 181, 141, 67, 44, 121, 157, 98, 247, 148, 201, 248, 236, 190, 217, 245, 131, 68, 124, 28, 193, 143, 215, 32, 184, 50, 71, 92, 148, 35, 180, 112, 125, 12, 152, 111, 32, 30, 86, 15, 107, 225, 39, 30, 178, 215, 182, 113, 216, 137, 98, 189, 72, 68, 107, 246, 108, 210, 148, 191, 28, 40, 233, 200, 222, 132, 247, 207, 239, 32, 79, 238, 18, 62, 67, 114, 186, 6, 212, 215, 31, 13, 53, 138, 97, 169, 28, 183, 235, 221, 218, 81, 84, 235]
Printed from wasi: This is from a main function
This is from a main function
The env vars are as follows.
The args are as follows.
/wasi_example_main.wasm
50000000
File content is This is in a file
pod "wasi-demo" deleted
```

你現在可以透過 Kubernetes 命令列查看 pod 狀態。

```bash
crictl ps -a
```

記錄顯示從排程到執行 WebAssembly 工作負載的事件。

```bash
CONTAINER           IMAGE               CREATED             STATE               NAME                 ATTEMPT             POD ID
0c176ed65599a       0423b8eb71e31       8 seconds ago       Exited              wasi-demo
```
