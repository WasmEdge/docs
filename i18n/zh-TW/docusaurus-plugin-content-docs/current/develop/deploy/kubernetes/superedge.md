---
sidebar_position: 5
---

# SuperEdge

SuperEdge 是一個用於邊緣運算的開源容器管理系統。它以非侵入式的方式將原生 Kubernetes 延伸至邊緣。

<!-- prettier-ignore -->
:::note
本示範基於 containerd + crun。
:::

## 安裝 Superedge

- 下載安裝套件

<!-- prettier-ignore -->
:::note
依你安裝節點的 CPU 架構(amd64 或 arm64)選擇安裝套件。
:::

```bash
arch=amd64 version=v0.6.0 && rm -rf edgeadm-linux-* && wget https://superedge-1253687700.cos.ap-guangzhou.myqcloud.com/$version/$arch/edgeadm-linux-containerd-$arch-$version.tgz && tar -xzvf edgeadm-linux-* && cd edgeadm-linux-$arch-$version && ./edgeadm
```

- 安裝使用 containerd 執行環境的邊緣 Kubernetes master 節點

```bash
./edgeadm init --kubernetes-version=1.18.2 --image-repository superedge.tencentcloudcr.com/superedge --service-cidr=10.96.0.0/12 --pod-network-cidr=192.168.0.0/16 --install-pkg-path ./kube-linux-*.tar.gz --apiserver-cert-extra-sans=<Master Public IP> --apiserver-advertise-address=<Master Intranet IP> --enable-edge=true --runtime=containerd
```

- 加入使用 containerd 執行環境的邊緣節點

```bash
./edgeadm join <Master Public/Intranet IP Or Domain>:Port --token xxxx --discovery-token-ca-cert-hash sha256:xxxxxxxxxx --install-pkg-path <edgeadm kube-* install package address path> --enable-edge=true --runtime=containerd
```

如需其他安裝、部署與管理事項,請參閱我們的[**教學**](https://superedge.io/docs/installation/)

## 安裝 WasmEdge

使用簡易安裝指令碼在你的邊緣節點上安裝 WasmEdge。

```bash
curl -sSf https://raw.githubusercontent.com/WasmEdge/WasmEdge/master/utils/install.sh | bash
```

## 建置並安裝具備 WasmEdge 的 Crun

[crun](https://github.com/containers/crun) 專案已內建 WasmEdge 支援。目前,最簡單的方式是從原始碼自行建置。首先,請確保你的 Ubuntu 20.04 上已安裝 crun 的相依套件。其他 Linux 發行版請[參閱此處](https://github.com/containers/crun#readme)。

```bash
sudo apt update
sudo apt install -y make git gcc build-essential pkgconf libtool \
    libsystemd-dev libprotobuf-c-dev libcap-dev libseccomp-dev libyajl-dev \
    go-md2man libtool autoconf python3 automake
```

接著,設定、建置並安裝具備 WasmEdge 支援的 crun 二進位檔。

```bash
git clone https://github.com/containers/crun
cd crun
./autogen.sh
./configure --with-wasmedge
make
sudo make install
```

## 以 crun 執行環境重新設定 containerd

Superedge 的 containerd 節點具有預設設定。我們應依下列步驟修改設定檔(/etc/containerd/config.toml)。

首先,我們產生 `config.toml.diff` 差異檔案並套用此 patch。

```bash
cat > config.toml.diff << EOF
--- /etc/containerd/config.toml 2022-02-14 15:05:40.061562127 +0800
+++ /etc/containerd/config.toml.crun    2022-02-14 15:03:35.846052853 +0800
@@ -24,17 +24,23 @@
   max_concurrent_downloads = 10

   [plugins.cri.containerd]
-        default_runtime_name = "runc"
-    [plugins.cri.containerd.runtimes.runc]
+        default_runtime_name = "crun"
+    [plugins.cri.containerd.runtimes.crun]
       runtime_type = "io.containerd.runc.v2"
-      pod_annotations = []
+      pod_annotations = ["*.wasm.*", "wasm.*", "module.wasm.image/*", "*.module.wasm.image", "module.wasm.image/variant.*"]
       container_annotations = []
       privileged_without_host_devices = false
-      [plugins.cri.containerd.runtimes.runc.options]
-        BinaryName = "runc"
+      [plugins.cri.containerd.runtimes.crun.options]
+        BinaryName = "crun"
   # cni
   [plugins.cri.cni]
     bin_dir = "/opt/cni/bin"
     conf_dir = "/etc/cni/net.d"
     conf_template = ""

+  [plugins."io.containerd.runtime.v1.linux"]
+    no_shim = false
+    runtime = "crun"
+    runtime_root = ""
+    shim = "containerd-shim"
+    shim_debug = false
EOF
```

```bash
sudo patch -d/ -p0 < config.toml.diff
sudo systemctl restart containerd
```

## 在 Superedge 中建立 Wasmedge 應用程式

我們可以執行推送至 [dockerhub](https://hub.docker.com/r/hydai/wasm-wasi-example) 的 wasm 映像檔。如果你想學習如何將 WebAssembly 程式編譯、打包並以容器映像檔的形式發佈到 Docker Hub,請[參閱此處](https://github.com/second-state/wasmedge-containers-examples/blob/main/simple_wasi_app.md)。

```bash
cat > wasmedge-app.yaml << EOF
apiVersion: v1
kind: Pod
metadata:
  annotations:
    module.wasm.image/variant: compat-smart
  labels:
    run: wasi-demo
  name: wasi-demo
spec:
  containers:
  - args:
    - /wasi_example_main.wasm
    - "50000000"
    image: wasmedge/example-wasi:latest
    imagePullPolicy: IfNotPresent
    name: wasi-demo
  hostNetwork: true
  restartPolicy: Never
EOF

kubectl create -f wasmedge-app.yaml
```

執行 `kubectl logs wasi-demo` 命令會顯示輸出。

```bash
Random number: -1643170076
Random bytes: [15, 223, 242, 238, 69, 114, 217, 106, 80, 214, 44, 225, 20, 182, 2, 189, 226, 184, 97, 40, 154, 6, 56, 202, 45, 89, 184, 80, 5, 89, 73, 222, 143, 132, 17, 79, 145, 64, 33, 17, 250, 102, 91, 94, 26, 200, 28, 161, 46, 93, 123, 36, 100, 167, 43, 159, 82, 112, 255, 165, 37, 232, 17, 139, 97, 14, 28, 169, 225, 156, 147, 22, 174, 148, 209, 57, 82, 213, 19, 215, 11, 18, 32, 217, 188, 142, 54, 127, 237, 237, 230, 137, 86, 162, 185, 66, 88, 95, 226, 53, 174, 76, 226, 25, 151, 186, 156, 16, 62, 63, 230, 148, 133, 102, 33, 138, 20, 83, 31, 60, 246, 90, 167, 189, 103, 238, 106, 51]
Printed from wasi: This is from a main function
This is from a main function
The env vars are as follows.
The args are as follows.
/wasi_example_main.wasm
50000000
File content is This is in a file
```
