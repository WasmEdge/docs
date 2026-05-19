---
sidebar_position: 2
---

# Kubernetes + CRI-O + crun

## 快速入門

[WasmEdge Containers Example](https://github.com/second-state/wasmedge-containers-examples/) 包含在 Kubernetes + CRI-O + crun 上執行我們範例應用程式的指令碼與 GitHub Actions。

- 簡易 WebAssembly 範例 [快速入門](https://github.com/second-state/wasmedge-containers-examples/blob/main/kubernetes_crio/README.md) | [Github Actions](https://github.com/second-state/wasmedge-containers-examples/blob/main/.github/workflows/kubernetes-crio.yml)
- 基於 WebAssembly 的 HTTP 服務 [快速入門](https://github.com/second-state/wasmedge-containers-examples/blob/main/kubernetes_crio/http_server/README.md) | [Github Actions](https://github.com/second-state/wasmedge-containers-examples/blob/main/.github/workflows/kubernetes-crio-server.yml)

本節剩餘部分,我們將詳細解釋這些步驟。我們假設你已經[安裝並設定 CRI-O](../../deploy/oci-runtime/crun.md)以搭配 WasmEdge 容器映像檔運作。

## 安裝並啟動 Kubernetes

在終端機視窗執行下列命令。它會設定 Kubernetes 以供本機開發。

```bash
# 安裝 go
$ wget https://golang.org/dl/go1.17.1.linux-amd64.tar.gz
$ sudo rm -rf /usr/local/go
sudo tar -C /usr/local -xzf go1.17.1.linux-amd64.tar.gz
source /home/${USER}/.profile

# 複製 k8s
git clone https://github.com/kubernetes/kubernetes.git
cd kubernetes
git checkout v1.22.2

# 使用 k8s 中的 hack script 安裝 etcd
sudo CGROUP_DRIVER=systemd CONTAINER_RUNTIME=remote CONTAINER_RUNTIME_ENDPOINT='unix:///var/run/crio/crio.sock' ./hack/install-etcd.sh
export PATH="/home/${USER}/kubernetes/third_party/etcd:${PATH}"
sudo cp third_party/etcd/etcd* /usr/local/bin/

# 執行上述命令後,你可以找到下列檔案:/usr/local/bin/etcd  /usr/local/bin/etcdctl  /usr/local/bin/etcdutl

# 使用 CRI-O 建置並執行 k8s
sudo apt-get install -y build-essential
sudo CGROUP_DRIVER=systemd CONTAINER_RUNTIME=remote CONTAINER_RUNTIME_ENDPOINT='unix:///var/run/crio/crio.sock' ./hack/local-up-cluster.sh

... ...
Local Kubernetes cluster is running. Press Ctrl-C to shut it down.
```

不要關閉你的終端機視窗。Kubernetes 正在執行!

## 在 Kubernetes 中執行 WebAssembly 容器映像檔

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

### 一個簡單的 WebAssembly 應用程式

[另一篇文章](https://github.com/second-state/wasmedge-containers-examples/blob/main/simple_wasi_app.md)說明如何將一個簡單的 WebAssembly WASI 程式編譯、打包並以容器映像檔的形式發佈到 Docker Hub。如下所示,在 Kubernetes 叢集中從 Docker Hub 執行基於 WebAssembly 的映像檔。

```bash
sudo cluster/kubectl.sh run -it --rm --restart=Never wasi-demo --image=wasmedge/example-wasi:latest --annotations="module.wasm.image/variant=compat-smart" /wasi_example_main.wasm 50000000
```

來自容器化應用程式的輸出會印到主控台。

```bash
Random number: 401583443
Random bytes: [192, 226, 162, 92, 129, 17, 186, 164, 239, 84, 98, 255, 209, 79, 51, 227, 103, 83, 253, 31, 78, 239, 33, 218, 68, 208, 91, 56, 37, 200, 32, 12, 106, 101, 241, 78, 161, 16, 240, 158, 42, 24, 29, 121, 78, 19, 157, 185, 32, 162, 95, 214, 175, 46, 170, 100, 212, 33, 27, 190, 139, 121, 121, 222, 230, 125, 251, 21, 210, 246, 215, 127, 176, 224, 38, 184, 201, 74, 76, 133, 233, 129, 48, 239, 106, 164, 190, 29, 118, 71, 79, 203, 92, 71, 68, 96, 33, 240, 228, 62, 45, 196, 149, 21, 23, 143, 169, 163, 136, 206, 214, 244, 26, 194, 25, 101, 8, 236, 247, 5, 164, 117, 40, 220, 52, 217, 92, 179]
Printed from wasi: This is from a main function
This is from a main function
The env vars are as follows.
The args are as follows.
/wasi_example_main.wasm
50000000
File content is This is in a file
pod "wasi-demo-2" deleted
```

### 一個基於 WebAssembly 的 HTTP 服務

[另一篇文章](https://github.com/second-state/wasmedge-containers-examples/blob/main/http_server_wasi_app.md)說明如何將一個簡單的 WebAssembly HTTP 服務應用程式編譯、打包並以容器映像檔的形式發佈到 Docker Hub。由於 HTTP 服務容器需要 Kubernetes 提供的網路支援,我們將使用 [k8s-http_server.yaml](https://github.com/second-state/wasmedge-containers-examples/blob/main/kubernetes_crio/http_server/k8s-http_server.yaml) 檔案指定其準確設定。

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: http-server
  namespace: default
  annotations:
    module.wasm.image/variant: compat-smart
spec:
  hostNetwork: true
  containers:
    - name: http-server
      image: wasmedge/example-wasi-http:latest
      command: ['/http_server.wasm']
      ports:
        - containerPort: 1234
          protocol: TCP
      livenessProbe:
        tcpSocket:
          port: 1234
        initialDelaySeconds: 3
        periodSeconds: 30
```

如下所示,在 Kubernetes 叢集中使用上述 `k8s-http_server.yaml` 檔案從 Docker Hub 執行基於 WebAssembly 的映像檔。

```bash
sudo ./kubernetes/cluster/kubectl.sh apply -f k8s-http_server.yaml
```

下列命令會顯示正在執行的容器應用程式及其 IP 位址。由於我們在 yaml 設定中使用 `hostNetwork`,HTTP 伺服器映像檔在 IP 位址 `127.0.0.1` 的本地網路上執行。

```bash
$ sudo cluster/kubectl.sh get pod --all-namespaces -o wide

NAMESPACE     NAME                       READY   STATUS             RESTARTS      AGE   IP          NODE        NOMINATED NODE   READINESS GATES
default       http-server                1/1     Running            1 (26s ago)     60s     127.0.0.1   127.0.0.1   <none>           <none>
```

現在,你可以使用 `curl` 命令存取 HTTP 服務。

```bash
$ curl -d "name=WasmEdge" -X POST http://127.0.0.1:1234
echo: name=WasmEdge
```

就是這樣!
