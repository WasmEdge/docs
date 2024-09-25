---
sidebar_position: 3
---

# Kubernetes + Containerd + Runwasi

## Quick start

The [GitHub repo](https://github.com/second-state/wasmedge-containers-examples/) contains scripts and GitHub Actions for running our example apps on Kubernetes + containerd + runwasi.

- Simple WebAssembly example [Quick start](https://github.com/second-state/wasmedge-containers-examples/blob/main/kubernetes_containerd/README.md) | [Github Actions](https://github.com/second-state/wasmedge-containers-examples/blob/main/.github/workflows/kubernetes-containerd.yml)
- WebAssembly-based HTTP service [Quick start](https://github.com/second-state/wasmedge-containers-examples/blob/main/kubernetes_containerd/http_server/README.md) | [Github Actions](https://github.com/second-state/wasmedge-containers-examples/blob/main/.github/workflows/kubernetes-containerd-server.yml)

In the rest of this section, we will explain the steps in detail.

## Prerequisites for this setup

Please ensure that you have completed the following steps before proceeding with this setup.

- Install the latest version of [Wasmedge](../../../start/install.md)
- Ensure that you have containerd setup following the [instructions here](../../deploy/cri-runtime/containerd-crun.md).
- Ensure that you have installed and [setup runwasi](../../deploy/cri-runtime/containerd.md) for containerd-shim-wasmedge

## Install and start Kubernetes

Run the following commands from a terminal window. It sets up Kubernetes for local development.

```bash
# Install go
$ wget https://golang.org/dl/go1.17.1.linux-amd64.tar.gz
$ sudo rm -rf /usr/local/go
$ sudo tar -C /usr/local -xzf go1.17.1.linux-amd64.tar.gz
$ source /home/${USER}/.profile

# Clone k8s
$ git clone https://github.com/kubernetes/kubernetes.git
$ cd kubernetes
$ git checkout v1.22.2

# Install etcd with hack script in k8s
$ sudo CGROUP_DRIVER=systemd CONTAINER_RUNTIME=remote CONTAINER_RUNTIME_ENDPOINT='unix:///var/run/containerd/containerd.sock' ./hack/install-etcd.sh
$ export PATH="/home/${USER}/kubernetes/third_party/etcd:${PATH}"
$ sudo cp third_party/etcd/etcd* /usr/local/bin/

# After run the above command, you can find the following files: /usr/local/bin/etcd  /usr/local/bin/etcdctl  /usr/local/bin/etcdutl

# Build and run k8s with containerd
$ sudo apt-get install -y build-essential
$ sudo CGROUP_DRIVER=systemd CONTAINER_RUNTIME=remote CONTAINER_RUNTIME_ENDPOINT='unix:///var/run/containerd/containerd.sock' ./hack/local-up-cluster.sh

... ...
Local Kubernetes cluster is running. Press Ctrl-C to shut it down.
```

Do NOT close your terminal window. Kubernetes is running!

## Run and test the Kubernetes Cluster

Finally, we can run WebAssembly programs in Kubernetes as containers in pods. In this section, we will start from **another terminal window** and start using the cluster.

```bash
export KUBERNETES_PROVIDER=local

sudo cluster/kubectl.sh config set-cluster local --server=https://localhost:6443 --certificate-authority=/var/run/kubernetes/server-ca.crt
sudo cluster/kubectl.sh config set-credentials myself --client-key=/var/run/kubernetes/client-admin.key --client-certificate=/var/run/kubernetes/client-admin.crt
sudo cluster/kubectl.sh config set-context local --cluster=local --user=myself
sudo cluster/kubectl.sh config use-context local
sudo cluster/kubectl.sh
```

Let's check the status to make sure that the cluster is running.

```bash
$ sudo cluster/kubectl.sh cluster-info

# Expected output
Cluster "local" set.
User "myself" set.
Context "local" created.
Switched to context "local".
Kubernetes control plane is running at https://localhost:6443
CoreDNS is running at https://localhost:6443/api/v1/namespaces/kube-system/services/kube-dns:dns/proxy

To further debug and diagnose cluster problems, use 'kubectl cluster-info dump'.
```

## Configure containerd and Kubernetes for Wasmedge Runtime

Next we will configure containerd to add support for the containerd-shim-wasmedge.
Please ensure that you have [setup runwasi](../../deploy/cri-runtime/containerd.md) to work with WasmEdge container images.

```bash
# Run the following command as root user
sudo bash -c "containerd config default > /etc/containerd/config.toml"
echo '[plugins."io.containerd.grpc.v1.cri".containerd.runtimes.wasmedge] runtime_type = "io.containerd.wasmedge.v1"' | sudo tee -a /etc/containerd/config.toml > /dev/null
sudo systemctl restart containerd
```

Next we will create a RuntimeClass in Kubernetes to specify usage of wasmedge runtime for objects labeled as `runtime=wasm`

```bash
sudo cluster/kubectl.sh apply -f - <<< '{"apiVersion":"node.k8s.io/v1","kind":"RuntimeClass","metadata":{"name":"wasm"},"scheduling":{"nodeSelector":{"runtime":"wasm"}},"handler":"wasmedge"}'
```

Now we will label the kubernetes node as `runtime=wasm`. Note that the node where we changed the containerd configurations will be the one which we will label.

An example of how we can label the node is given below:

```bash
sudo cluster/kubectl.sh get nodes
# Sample output from the command above
NAME        STATUS     ROLES    AGE    VERSION
127.0.0.1   Ready   <none>   3h4m   v1.22.2
# Run the following command to label the node 
sudo cluster/kubectl.sh label nodes 127.0.0.1 runtime=wasm
# A successful output from the above command looks like this
node/127.0.0.1 labeled
```

### A WebAssembly-based HTTP service

[A separate article](https://github.com/second-state/wasmedge-containers-examples/blob/main/http_server_wasi_app.md) explains how to compile, package, and publish a simple WebAssembly HTTP service application as a container image to Docker hub. Run the WebAssembly-based image from Docker Hub in the Kubernetes cluster as follows.

```bash
sudo cluster/kubectl.sh apply -f - <<< '{"apiVersion":"apps/v1","kind":"Deployment","metadata":{"name":"http-server-deployment"},"spec":{"replicas":1,"selector":{"matchLabels":{"app":"http-server"}},"template":{"metadata":{"labels":{"app":"http-server"}},"spec":{"hostNetwork":true,"runtimeClassName":"wasm","containers":[{"name":"http-server","image":"wasmedge/example-wasi-http:latest","ports":[{"containerPort":1234}]}]}}}}'
```

Since we are using `hostNetwork` in the `kubectl run` command, the HTTP server image is running on the local network with IP address `127.0.0.1`. Now, you can use the `curl` command to access the HTTP service.

```bash
$ curl -d "name=WasmEdge" -X POST http://127.0.0.1:1234
echo: name=WasmEdge
```

That's it!
