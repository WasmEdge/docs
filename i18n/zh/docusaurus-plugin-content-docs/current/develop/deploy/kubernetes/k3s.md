---
sidebar_position: 12
---

# K3s

[K3s](https://k3s.io/) is a lightweight, certified Kubernetes distribution designed for resource-constrained environments such as edge, IoT, and CI/CD. It bundles containerd as the default container runtime and can automatically detect WebAssembly runtimes like WasmEdge.

<!-- prettier-ignore -->
:::note
This guide is based on containerd + runwasi (containerd-shim-wasmedge).
:::

## Prerequisites

- A Linux machine (x86_64 or aarch64) with systemd
- Root or sudo access

## Install WasmEdge

Use the [simple install script](../../../start/install.md) to install WasmEdge on your node.

```bash
curl -sSf https://raw.githubusercontent.com/WasmEdge/WasmEdge/master/utils/install.sh | bash
```

## Install the containerd-shim-wasmedge

K3s looks for the `containerd-shim-wasmedge-v1` binary in the system PATH. You can install it from a pre-built release binary or build it from source.

### Option A: Pre-built binary

Download the latest release from the [runwasi releases page](https://github.com/containerd/runwasi/releases) and install it.

```bash
# Detect architecture and download the appropriate binary
ARCH=$(uname -m) # x86_64 or aarch64
wget https://github.com/containerd/runwasi/releases/download/containerd-shim-wasmedge%2Fv0.6.0/containerd-shim-wasmedge-${ARCH}-linux-musl.tar.gz
tar xzf containerd-shim-wasmedge-${ARCH}-linux-musl.tar.gz
sudo install -m 755 containerd-shim-wasmedge-v1 /usr/local/bin/
```

### Option B: Build from source

Make sure you have [Rust](https://www.rust-lang.org/tools/install) installed, then build the shim from the [runwasi](https://github.com/containerd/runwasi) project.

```bash
git clone https://github.com/containerd/runwasi.git
cd runwasi
./scripts/setup-linux.sh
make build-wasmedge
INSTALL="sudo install" LN="sudo ln -sf" make install-wasmedge
```

## Install and start K3s

Install K3s after the shim binary is in place, so that K3s can detect the WasmEdge runtime at startup.

```bash
curl -sfL https://get.k3s.io | sh -
```

K3s will automatically detect `containerd-shim-wasmedge-v1` in the system PATH and create a corresponding Kubernetes `RuntimeClass` named `wasmedge`.

Verify that K3s is running and the RuntimeClass exists:

```bash
sudo kubectl get nodes
sudo kubectl get runtimeclass
```

Expected output:

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

Make sure `wasmedge` is in the list.

<!-- prettier-ignore -->
:::note
If the `wasmedge` RuntimeClass does not appear, make sure the `containerd-shim-wasmedge-v1` binary is in a directory listed in the K3s service's PATH (e.g., `/usr/local/bin`), then restart K3s with `sudo systemctl restart k3s`.
:::

## Run a simple WebAssembly app

[A separate article](https://github.com/second-state/wasmedge-containers-examples/blob/main/simple_wasi_app.md) explains how to compile, package, and publish a simple WebAssembly WASI program as a container image to Docker Hub. Run the WebAssembly-based image from Docker Hub in the K3s cluster as follows.

```bash
sudo kubectl run --restart=Never wasi-demo \
  --image=wasmedge/example-wasi:latest \
  --overrides='{"kind":"Pod","apiVersion":"v1","spec":{"runtimeClassName":"wasmedge"}}' \
  -- /wasi_example_main.wasm 50000000
```

Check the pod status and view the output:

```bash
sudo kubectl get pod wasi-demo
sudo kubectl logs wasi-demo
```

The output from the containerized application is printed into the console.

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

Clean up the pod after verifying:

```bash
sudo kubectl delete pod wasi-demo
```

## Run a WebAssembly-based HTTP service

[A separate article](https://github.com/second-state/wasmedge-containers-examples/blob/main/http_server_wasi_app.md) explains how to compile, package, and publish a simple WebAssembly HTTP service application as a container image to Docker Hub. Create a deployment using a YAML file:

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

Save the above as `k3s-http-server.yaml` and apply it:

```bash
sudo kubectl apply -f k3s-http-server.yaml
```

Wait for the pod to be ready, then get the NodePort:

```bash
sudo kubectl get svc http-server
```

Access the HTTP service using the NodePort:

```bash
curl -d "name=WasmEdge" -X POST http://localhost:<NodePort>
echo: name=WasmEdge
```

Clean up the deployment and service after verifying:

```bash
sudo kubectl delete -f k3s-http-server.yaml
```

That's it!
