---
sidebar_position: 10
---

# Kwasm

[Kwasm](https://kwasm.sh/) is a Kubernetes Operator that adds WebAssembly support to your Kubernetes nodes.

## Quick start

You will need a running Kubernetes cluster to install Kwasm operator. Here we use a fresh cluster created by [kind](https://kind.sigs.k8s.io/):

```bash
kind create cluster
```

You will also need to [install helm](https://helm.sh/docs/intro/install/) to setup Kwasm:

```bash
helm repo add kwasm http://kwasm.sh/kwasm-operator/
helm repo update
helm install -n kwasm --create-namespace kwasm kwasm/kwasm-operator
kubectl annotate node --all kwasm.sh/kwasm-node=true
```

Apply the yaml file for the wasm job:

```bash
kubectl apply -f https://raw.githubusercontent.com/KWasm/kwasm-node-installer/main/example/test-job.yaml
```

After the job is finished, check the log:

```bash
kubectl logs job/wasm-test
```
