---
sidebar_position: 10
---

# Kwasm

[Kwasm](https://kwasm.sh/) 是一款 Kubernetes Operator,可為你的 Kubernetes 節點添加 WebAssembly 支援。

## 快速入門

你需要一個運作中的 Kubernetes 叢集來安裝 Kwasm operator。這裡我們使用 [kind](https://kind.sigs.k8s.io/) 建立一個全新的叢集:

```bash
kind create cluster
```

你也需要[安裝 helm](https://helm.sh/docs/intro/install/) 來設定 Kwasm:

```bash
helm repo add kwasm http://kwasm.sh/kwasm-operator/
helm repo update
helm install -n kwasm --create-namespace kwasm kwasm/kwasm-operator
kubectl annotate node --all kwasm.sh/kwasm-node=true
```

套用 wasm job 的 yaml 檔案:

```bash
kubectl apply -f https://raw.githubusercontent.com/KWasm/kwasm-node-installer/main/example/test-job.yaml
```

job 完成後,檢查記錄:

```bash
kubectl logs job/wasm-test
```
