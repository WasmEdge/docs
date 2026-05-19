---
sidebar_position: 8
---

# Knative

Knative 是一個與平台無關的無伺服器部署解決方案。

## 快速入門

你可以參考 [Kubernetes + containerd] 來建置 Kubernetes 叢集。然而,由於在本文件中預設執行環境從 runc 替換為 crun,它不適合既有的 k8s 叢集。

這裡我們將 crun 設定為 kubernetes 叢集中的 runtimeClass,**而不是替換預設的執行環境**。接著部署 Knative serving 服務並執行 WASM 無伺服器服務。

## 編譯 crun

請參閱 [crun](../../deploy/oci-runtime/crun.md) 文件以建置並編譯具備 WasmEdge 支援的 crun。

```bash
# 安裝相依套件
$ sudo apt update
$ sudo apt install -y make git gcc build-essential pkgconf libtool \
    libsystemd-dev libprotobuf-c-dev libcap-dev libseccomp-dev libyajl-dev \
    go-md2man libtool autoconf python3 automake

# 編譯 crun
$ git clone https://github.com/containers/crun
$ cd crun
$ ./autogen.sh
$ ./configure --with-wasmedge
$ make
$ sudo make install
```

## 安裝並設定 Containerd

為了簡化操作,我們使用 apt 來安裝 containerd。這裡是 [ubuntu 文件](https://docs.docker.com/engine/install/ubuntu/)。安裝 containerd 後,編輯設定 `/etc/containerd/config.toml`。

```bash
$ cat /etc/containerd/config.toml

# 註解此行讓 cri 可以運作
# disabled_plugins = ["cri"]

# 加入下列區段以設定 crun 執行環境,確認 BinaryName 等於你的 crun 二進位檔路徑
[plugins]
  [plugins.cri]
    [plugins.cri.containerd]
      [plugins.cri.containerd.runtimes]
...
        [plugins.cri.containerd.runtimes.crun]
           runtime_type = "io.containerd.runc.v2"
           pod_annotations = ["*.wasm.*", "wasm.*", "module.wasm.image/*", "*.module.wasm.image", "module.wasm.image/variant.*"]
           privileged_without_host_devices = false
           [plugins.cri.containerd.runtimes.crun.options]
             BinaryName = "/usr/local/bin/crun"
...

# 重新啟動 containerd 服務
$ sudo systemctl restart containerd

# 確認 crun 是否運作
$ ctr image pull docker.io/wasmedge/example-wasi:latest
$ ctr run --rm --runc-binary crun --runtime io.containerd.runc.v2 --label module.wasm.image/variant=compat-smart docker.io/wasmedge/example-wasi:latest wasm-example /wasi_example_main.wasm 50000000
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

## 使用 kubeadm 建立叢集

參考三份文件:[安裝 kubeadm](https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/install-kubeadm/)、[使用 kubeadm 建立叢集](https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/)、[安裝 flannel cni](https://github.com/flannel-io/flannel#deploying-flannel-manually),來建立 kubernetes 叢集。

```bash
# 安裝 kubeadm
$ sudo apt-get update
$ sudo apt-get install -y apt-transport-https ca-certificates curl
$ sudo curl -fsSLo /usr/share/keyrings/kubernetes-archive-keyring.gpg https://packages.cloud.google.com/apt/doc/apt-key.gpg
$ echo "deb [signed-by=/usr/share/keyrings/kubernetes-archive-keyring.gpg] https://apt.kubernetes.io/ kubernetes-xenial main" | sudo tee /etc/apt/sources.list.d/kubernetes.list
$ sudo apt-get update
$ sudo apt-get install -y kubelet kubeadm kubectl
$ sudo apt-mark hold kubelet kubeadm kubectl

# 建立 kubernetes 叢集
$ swapoff -a
$ kubeadm init --pod-network-cidr=10.244.0.0/16 --cri-socket unix:///var/run/containerd/containerd.sock
$ export KUBECONFIG=/etc/kubernetes/admin.conf

# 安裝 cni
$ kubectl apply -f https://raw.githubusercontent.com/flannel-io/flannel/master/Documentation/kube-flannel.yml

# 解除 master node 的 taint
$ kubectl taint nodes --all node-role.kubernetes.io/control-plane-

# 新增 crun runtimeClass
$ cat > runtime.yaml <<EOF
apiVersion: node.k8s.io/v1
kind: RuntimeClass
metadata:
  name: crun
handler: crun
EOF
$ kubectl apply -f runtime.yaml

# 驗證設定是否運作
$ kubectl run -it --rm --restart=Never wasi-demo --image=wasmedge/example-wasi:latest --annotations="module.wasm.image/variant=compat-smart" --overrides='{"kind":"Pod", "apiVersion":"v1", "spec": {"hostNetwork": true, "runtimeClassName": "crun"}}' /wasi_example_main.wasm 50000000
Random number: 1534679888
Random bytes: [88, 170, 82, 181, 231, 47, 31, 34, 195, 243, 134, 247, 211, 145, 28, 30, 162, 127, 234, 208, 213, 192, 205, 141, 83, 161, 121, 206, 214, 163, 196, 141, 158, 96, 137, 151, 49, 172, 88, 234, 195, 137, 44, 152, 7, 130, 41, 33, 85, 144, 197, 25, 104, 236, 201, 91, 210, 17, 59, 248, 80, 164, 19, 10, 46, 116, 182, 111, 112, 239, 140, 16, 6, 249, 89, 176, 55, 6, 41, 62, 236, 132, 72, 70, 170, 7, 248, 176, 209, 218, 214, 160, 110, 93, 232, 175, 124, 199, 33, 144, 2, 147, 219, 236, 255, 95, 47, 15, 95, 192, 239, 63, 157, 103, 250, 200, 85, 237, 44, 119, 98, 211, 163, 26, 157, 248, 24, 0]
Printed from wasi: This is from a main function
This is from a main function
The env vars are as follows.
The args are as follows.
/wasi_example_main.wasm
50000000
File content is This is in a file
pod "wasi-demo" deleted
```

## 設定 Knative Serving

參考[使用 YAML 檔案安裝 Knative Serving](https://knative.dev/docs/install/yaml-install/serving/install-serving-with-yaml/),安裝 knative serving 服務。

```bash
# 安裝 Knative Serving 元件
$ kubectl apply -f https://github.com/knative/serving/releases/download/knative-v1.7.2/serving-crds.yaml
$ kubectl apply -f https://github.com/knative/serving/releases/download/knative-v1.7.2/serving-core.yaml

# 安裝網路層
$ kubectl apply -f https://github.com/knative/net-kourier/releases/download/knative-v1.7.0/kourier.yaml
$ kubectl patch configmap/config-network \
  --namespace knative-serving \
  --type merge \
  --patch '{"data":{"ingress-class":"kourier.ingress.networking.knative.dev"}}'
$ kubectl --namespace kourier-system get service kourier

# 驗證安裝
$ kubectl get pods -n knative-serving

# 在 Knative 中開啟 runtimeClass 功能旗標
$ kubectl patch configmap/config-features -n knative-serving --type merge --patch '{"data":{"kubernetes.podspec-runtimeclassname":"enabled"}}'
```

## Knative Serving 中的 WASM 案例

現在我們可以執行 WASM 無伺服器服務。

```bash
# 套用無伺服器服務設定
# 我們需要設定 annotations、runtimeClassName 與 ports。
$ cat > http-wasm-serverless.yaml <<EOF
apiVersion: serving.knative.dev/v1
kind: Service
metadata:
  name: http-wasm
  namespace: default
spec:
  template:
    metadata:
      annotations:
        module.wasm.image/variant: compat-smart
    spec:
      runtimeClassName: crun
      timeoutSeconds: 1
      containers:
      - name: http-server
        image: docker.io/wasmedge/example-wasi-http:latest
        ports:
        - containerPort: 1234
          protocol: TCP
        livenessProbe:
          tcpSocket:
            port: 1234
EOF

$ kubectl apply -f http-wasm-serverless.yaml

# 稍等片刻,檢查無伺服器服務是否可用
$ kubectl get ksvc http-wasm
NAME          URL                                              LATESTCREATED       LATESTREADY         READY   REASON
http-wasm     http://http-wasm.default.knative.example.com     http-wasm-00001     http-wasm-00001     True

# 嘗試呼叫此服務
# 由於我們未設定 DNS,僅能透過 Kourier(Knative Serving ingress 連接埠)呼叫此服務。
# 取得 Kourier 連接埠,在以下範例中為 31997
$ kubectl --namespace kourier-system get service kourier
NAME      TYPE           CLUSTER-IP      EXTERNAL-IP       PORT(S)                      AGE
kourier   LoadBalancer   10.105.58.134                     80:31997/TCP,443:31019/TCP   53d
$ curl -H "Host: http-wasm.default.knative.example.com" -d "name=WasmEdge" -X POST http://localhost:31997

# 檢查新啟動的 pod
$ kubectl get pods
NAME                                           READY   STATUS    RESTARTS   AGE
http-wasm-00001-deployment-748bdc7cf-96l4r     2/2     Running   0          19s
```
