---
sidebar_position: 12
---

# K3s

[K3s](https://k3s.io/) 是一款輕量且通過認證的 Kubernetes 發行版,專為資源受限的環境(如邊緣、IoT 與 CI/CD)所設計。它預設綁定 containerd 作為容器執行環境,並可自動偵測像 WasmEdge 這樣的 WebAssembly 執行環境。

<!-- prettier-ignore -->
:::note
本指南是基於 containerd + runwasi(containerd-shim-wasmedge)。
:::

## 必備條件

- 一台具備 systemd 的 Linux 機器(x86_64 或 aarch64)
- Root 或 sudo 存取權限

## 安裝 WasmEdge

使用[簡易安裝指令碼](../../../start/install.md)在你的節點上安裝 WasmEdge。

```bash
curl -sSf https://raw.githubusercontent.com/WasmEdge/WasmEdge/master/utils/install.sh | bash
```

## 安裝 containerd-shim-wasmedge

K3s 會在系統 PATH 中尋找 `containerd-shim-wasmedge-v1` 二進位檔。你可以從預建的發佈版二進位檔安裝,或從原始碼建置。

### 選項 A:預建二進位檔

從 [runwasi 發佈頁面](https://github.com/containerd/runwasi/releases)下載最新發佈版本並安裝。

```bash
# 偵測架構並下載對應的二進位檔
ARCH=$(uname -m) # x86_64 或 aarch64
wget https://github.com/containerd/runwasi/releases/download/containerd-shim-wasmedge%2Fv0.6.0/containerd-shim-wasmedge-${ARCH}-linux-musl.tar.gz
tar xzf containerd-shim-wasmedge-${ARCH}-linux-musl.tar.gz
sudo install -m 755 containerd-shim-wasmedge-v1 /usr/local/bin/
```

### 選項 B:從原始碼建置

請確保你已安裝 [Rust](https://www.rust-lang.org/tools/install),接著從 [runwasi](https://github.com/containerd/runwasi) 專案建置 shim。

```bash
git clone https://github.com/containerd/runwasi.git
cd runwasi
./scripts/setup-linux.sh
make build-wasmedge
INSTALL="sudo install" LN="sudo ln -sf" make install-wasmedge
```

## 安裝並啟動 K3s

在 shim 二進位檔就位後再安裝 K3s,如此一來 K3s 可在啟動時偵測到 WasmEdge 執行環境。

```bash
curl -sfL https://get.k3s.io | sh -
```

K3s 將自動偵測系統 PATH 中的 `containerd-shim-wasmedge-v1`,並建立對應名為 `wasmedge` 的 Kubernetes `RuntimeClass`。

驗證 K3s 是否運作中且 RuntimeClass 存在:

```bash
sudo kubectl get nodes
sudo kubectl get runtimeclass
```

預期輸出:

```bash
$ sudo kubectl get nodes
NAME     STATUS   ROLES           AGE   VERSION
ubuntu   Ready    control-plane   45s   v1.34.6+k3s1

$ sudo kubectl get runtimeclass
NAME                  HANDLER               AGE
crun                  crun                  45s
lunatic               lunatic               45s
nvidia                nvidia                45s
nvidia-experimental   nvidia-experimental   45s
slight                slight                45s
spin                  spin                  45s
wasmedge              wasmedge              45s
wasmer                wasmer                45s
wasmtime              wasmtime              45s
wws                   wws                   45s
```

確認 `wasmedge` 是否在清單中。

<!-- prettier-ignore -->
:::note
若 `wasmedge` RuntimeClass 未出現,請確認 `containerd-shim-wasmedge-v1` 二進位檔位於 K3s 服務 PATH 列出的目錄(例如 `/usr/local/bin`),然後使用 `sudo systemctl restart k3s` 重新啟動 K3s。
:::

## 執行一個簡單的 WebAssembly 應用程式

[另一篇文章](https://github.com/second-state/wasmedge-containers-examples/blob/main/simple_wasi_app.md)說明如何將一個簡單的 WebAssembly WASI 程式編譯、打包並以容器映像檔的形式發佈到 Docker Hub。如下所示,在 K3s 叢集中從 Docker Hub 執行基於 WebAssembly 的映像檔。

```bash
sudo kubectl run --restart=Never wasi-demo \
  --image=wasmedge/example-wasi:latest \
  --overrides='{"kind":"Pod","apiVersion":"v1","spec":{"runtimeClassName":"wasmedge"}}' \
  -- /wasi_example_main.wasm 50000000
```

檢查 pod 狀態並查看輸出:

```bash
sudo kubectl get pod wasi-demo
sudo kubectl logs wasi-demo
```

來自容器化應用程式的輸出會印到主控台。

```bash
$ sudo kubectl get pod wasi-demo
NAME        READY   STATUS      RESTARTS   AGE
wasi-demo   0/1     Completed   0          7s

$ sudo kubectl logs wasi-demo
Random number: -817406905
Random bytes: [7, 7, 147, 202, 106, 102, 198, 6, 42, 39, 198, 92, 59, 247, 54, 99, 249, 117, 113, 143, 240, 85, 226, 102, 44, 165, 66, 251, 220, 107, 106, 70, 168, 144, 114, 113, 77, 132, 114, 33, 155, 254, 169, 196, 218, 119, 171, 145, 106, 36, 205, 130, 43, 208, 152, 127, 60, 57, 26, 160, 178, 75, 3, 215, 98, 32, 223, 67, 176, 35, 182, 141, 2, 190, 15, 72, 167, 44, 46, 148, 240, 1, 110, 148, 19, 134, 182, 21, 127, 141, 106, 65, 27, 84, 121, 217, 171, 36, 88, 47, 197, 96, 193, 102, 143, 105, 67, 77, 40, 187, 40, 151, 60, 140, 238, 143, 8, 89, 129, 117, 103, 157, 102, 34, 65, 5, 195, 246]
Printed from wasi: This is from a main function
This is from a main function
The env vars are as follows.
The args are as follows.
/wasi_example_main.wasm
50000000
File content is This is in a file
```

驗證後清除 pod:

```bash
sudo kubectl delete pod wasi-demo
```

## 執行一個基於 WebAssembly 的 HTTP 服務

[另一篇文章](https://github.com/second-state/wasmedge-containers-examples/blob/main/http_server_wasi_app.md)說明如何將一個簡單的 WebAssembly HTTP 服務應用程式編譯、打包並以容器映像檔的形式發佈到 Docker Hub。使用 YAML 檔案建立部署:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: http-server
spec:
  replicas: 1
  selector:
    matchLabels:
      app: http-server
  template:
    metadata:
      labels:
        app: http-server
    spec:
      runtimeClassName: wasmedge
      containers:
        - name: http-server
          image: wasmedge/example-wasi-http:latest
          ports:
            - containerPort: 1234
              protocol: TCP
---
apiVersion: v1
kind: Service
metadata:
  name: http-server
spec:
  type: NodePort
  selector:
    app: http-server
  ports:
    - port: 1234
      targetPort: 1234
```

將上述內容儲存為 `k3s-http-server.yaml` 並套用:

```bash
sudo kubectl apply -f k3s-http-server.yaml
```

等待 pod 就緒,然後取得 NodePort:

```bash
sudo kubectl get svc http-server
```

使用 NodePort 存取 HTTP 服務:

```bash
curl -d "name=WasmEdge" -X POST http://localhost:<NodePort>
echo: name=WasmEdge
```

驗證後清除部署與服務:

```bash
sudo kubectl delete -f k3s-http-server.yaml
```

就是這樣!
