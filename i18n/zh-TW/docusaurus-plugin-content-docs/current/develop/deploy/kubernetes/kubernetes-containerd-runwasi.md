---
sidebar_position: 3
---

# Kubernetes + Containerd + Runwasi

## 快速入門

[GitHub 儲存庫](https://github.com/second-state/wasmedge-containers-examples/)包含在 Kubernetes + containerd + runwasi 上執行我們範例應用程式的指令碼與 GitHub Actions。

- 簡易 WebAssembly 範例 [快速入門](https://github.com/second-state/wasmedge-containers-examples/blob/main/kubernetes_containerd/README.md) | [Github Actions](https://github.com/second-state/wasmedge-containers-examples/blob/main/.github/workflows/kubernetes-containerd.yml)
- 基於 WebAssembly 的 HTTP 服務 [快速入門](https://github.com/second-state/wasmedge-containers-examples/blob/main/kubernetes_containerd/http_server/README.md) | [Github Actions](https://github.com/second-state/wasmedge-containers-examples/blob/main/.github/workflows/kubernetes-containerd-server.yml)

本節剩餘部分,我們將詳細解釋這些步驟。

## 此設定的必備條件

請確保你已完成下列步驟,然後再進行此設定。

- 安裝最新版本的 [Wasmedge](../../../start/install.md)
- 依[此處的說明](../../deploy/cri-runtime/containerd-crun.md)確保你已設定 containerd。
- 確保你已安裝並[設定 runwasi](../../deploy/cri-runtime/containerd.md) 以供 containerd-shim-wasmedge 使用

## 安裝並啟動 Kubernetes

在終端機視窗執行下列命令。它會設定 Kubernetes 以供本機開發。

```bash
# 安裝 go
$ wget https://golang.org/dl/go1.17.1.linux-amd64.tar.gz
$ sudo rm -rf /usr/local/go
$ sudo tar -C /usr/local -xzf go1.17.1.linux-amd64.tar.gz
$ source /home/${USER}/.profile

# 複製 k8s
$ git clone https://github.com/kubernetes/kubernetes.git
$ cd kubernetes
$ git checkout v1.22.2

# 使用 k8s 中的 hack script 安裝 etcd
$ sudo CGROUP_DRIVER=systemd CONTAINER_RUNTIME=remote CONTAINER_RUNTIME_ENDPOINT='unix:///var/run/containerd/containerd.sock' ./hack/install-etcd.sh
$ export PATH="/home/${USER}/kubernetes/third_party/etcd:${PATH}"
$ sudo cp third_party/etcd/etcd* /usr/local/bin/

# 執行上述命令後,你可以找到下列檔案:/usr/local/bin/etcd  /usr/local/bin/etcdctl  /usr/local/bin/etcdutl

# 使用 containerd 建置並執行 k8s
$ sudo apt-get install -y build-essential
$ sudo CGROUP_DRIVER=systemd CONTAINER_RUNTIME=remote CONTAINER_RUNTIME_ENDPOINT='unix:///var/run/containerd/containerd.sock' ./hack/local-up-cluster.sh

... ...
Local Kubernetes cluster is running. Press Ctrl-C to shut it down.
```

不要關閉你的終端機視窗。Kubernetes 正在執行!

## 執行並測試 Kubernetes 叢集

最後,我們可以在 Kubernetes 中將 WebAssembly 程式作為 pod 內的容器來執行。在本節,我們將從**另一個終端機視窗**開始並使用此叢集。

```bash
export KUBERNETES_PROVIDER=local

sudo cluster/kubectl.sh config set-cluster local --server=https://localhost:6443 --certificate-authority=/var/run/kubernetes/server-ca.crt
sudo cluster/kubectl.sh config set-credentials myself --client-key=/var/run/kubernetes/client-admin.key --client-certificate=/var/run/kubernetes/client-admin.crt
sudo cluster/kubectl.sh config set-context local --cluster=local --user=myself
sudo cluster/kubectl.sh config use-context local
sudo cluster/kubectl.sh
```

我們來檢查狀態以確認叢集正在執行。

```bash
$ sudo cluster/kubectl.sh cluster-info

# 預期輸出
Cluster "local" set.
User "myself" set.
Context "local" created.
Switched to context "local".
Kubernetes control plane is running at https://localhost:6443
CoreDNS is running at https://localhost:6443/api/v1/namespaces/kube-system/services/kube-dns:dns/proxy

To further debug and diagnose cluster problems, use 'kubectl cluster-info dump'.
```

## 為 Wasmedge 執行環境設定 containerd 與 Kubernetes

接下來我們會設定 containerd 以加入 containerd-shim-wasmedge 的支援。
請確保你已[設定 runwasi](../../deploy/cri-runtime/containerd.md) 以搭配 WasmEdge 容器映像檔運作。

```bash
# 以 root 使用者身分執行下列命令
sudo bash -c "containerd config default > /etc/containerd/config.toml"
echo '[plugins."io.containerd.grpc.v1.cri".containerd.runtimes.wasmedge] runtime_type = "io.containerd.wasmedge.v1"' | sudo tee -a /etc/containerd/config.toml > /dev/null
sudo systemctl restart containerd
```

接下來我們會在 Kubernetes 中建立一個 RuntimeClass,以指定標記為 `runtime=wasm` 的物件使用 wasmedge 執行環境

```bash
sudo cluster/kubectl.sh apply -f - <<< '{"apiVersion":"node.k8s.io/v1","kind":"RuntimeClass","metadata":{"name":"wasm"},"scheduling":{"nodeSelector":{"runtime":"wasm"}},"handler":"wasmedge"}'
```

現在我們會將 kubernetes 節點標記為 `runtime=wasm`。請注意,我們變更 containerd 設定的節點就是我們要標記的節點。

下方是我們如何標記節點的範例:

```bash
sudo cluster/kubectl.sh get nodes
# 上述命令的範例輸出
NAME        STATUS     ROLES    AGE    VERSION
127.0.0.1   Ready   <none>   3h4m   v1.22.2
# 執行下列命令以標記節點 
sudo cluster/kubectl.sh label nodes 127.0.0.1 runtime=wasm
# 上述命令成功的輸出看起來像這樣
node/127.0.0.1 labeled
```

### 一個基於 WebAssembly 的 HTTP 服務

[另一篇文章](https://github.com/second-state/wasmedge-containers-examples/blob/main/http_server_wasi_app.md)說明如何將一個簡單的 WebAssembly HTTP 服務應用程式編譯、打包並以容器映像檔的形式發佈到 Docker Hub。如下所示,在 Kubernetes 叢集中從 Docker Hub 執行基於 WebAssembly 的映像檔。

```bash
sudo cluster/kubectl.sh apply -f - <<< '{"apiVersion":"apps/v1","kind":"Deployment","metadata":{"name":"http-server-deployment"},"spec":{"replicas":1,"selector":{"matchLabels":{"app":"http-server"}},"template":{"metadata":{"labels":{"app":"http-server"}},"spec":{"hostNetwork":true,"runtimeClassName":"wasm","containers":[{"name":"http-server","image":"wasmedge/example-wasi-http:latest","ports":[{"containerPort":1234}]}]}}}}'
```

由於我們在 `kubectl run` 命令中使用 `hostNetwork`,HTTP 伺服器映像檔在 IP 位址 `127.0.0.1` 的本地網路上執行。現在,你可以使用 `curl` 命令存取 HTTP 服務。

```bash
$ curl -d "name=WasmEdge" -X POST http://127.0.0.1:1234
echo: name=WasmEdge
```

就是這樣!
