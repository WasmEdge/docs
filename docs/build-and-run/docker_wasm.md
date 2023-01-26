---
sidebar_position: 4
---

# Docker + Wasm

Docker announced its support for WebAssembly in the partnership with WasmEdge. So for WasmEdge developers, you can use Docker Desktop and Docker CLI to build, publish and run WasmEdge apps.

## Configure the toolchain

The easiest way to use docker's WasmEdge integration is to download [the newest Docker Desktop](https://docs.docker.com/desktop/release-notes/). 

Before you start, make sure you have turned on the containerd image store feature in your Docker Desktop. 

![](https://i.imgur.com/AH0ITnc.png)


## Run the Wasm app image 

Then, use `docker run`  to run the packaged Wasm image.

```
docker run -dp 8080:8080 \
  --name=wasm-example \
  --runtime=io.containerd.wasmedge.v1 \
  --platform=wasi/wasm32 \
  michaelirwin244/wasm-example
```

Here, you may notice that we have two new flags.
* `--runtime=io.containerd.wasmedge.v1` – This informs the Docker engine that we want to use the Wasm containerd shim instead of the standard Linux container runtime.
* `--platform=wasi/wasm32` – This specifies the architecture of the wasi/wasm32 image we want to use. By leveraging a Wasm architecture, you don’t need to build separate images for the different machine architectures. The WasmEdge takes care of the final step of converting the Wasm binary to machine instructions.

Next, open http://localhost:8080 in your browser or use `curl localhost:8080`. The server will respond the following messages.

```
Hello world from Rust running with Wasm! Send POST data to /echo to have it echoed back to you%   
```
That's all. Next let's dive into how to build a wasm app image.

## Build a Wasm app image

Now, we have known how to use Docker Desktop to run a Wasm image. Let's go back to dive into how to build a wasm app image.

Let's say you already have a compiled wasm file. To build a docker image, we also need to set up the `Dockerfile` like the following content.

```
FROM scratch
ENTRYPOINT [ "hello_world.wasm" ]
COPY ./target/wasm32-wasi/release/hello-world.wasm /hello-world.wasm
```
After that, use `docker buildx` to build a wasm app image.

```
docker buildx build --platform wasi/wasm32 -t docker-wasm:0.1 .
```

Use `docker push` to publish the docker image.

```
docker image push dockerid/docker-wasm:0.1
```
After that, you could follow the [Run the Wasm app image guide](#run-the-wasm-app-image) to run your Wasm image.

## Run a multi-service application with Wasm

How about when we need to run an applications including multiple containers? `docker compose up` could run serveral contaienrs at one time.

Let's take the [microservice-rust-mysql](https://github.com/second-state/microservice-rust-mysql) as an example. It includes three containers. Two are Linux containers and one is Wasm container. In this case, we use `docker compose up` to run three containers at once. Make sure your Docker Desktop is running and your repo includes a `docker-compose.yml` file.

> For the instruction on setting up `docker-compose.yml` file, please check out this article.

```
// git clone the template project

$ git clone https://github.com/second-state/microservice-rust-mysql.git

// Use `docker compose` to run the example

$ docker compose up
```

Then, go back to Docker Desktop Dash board, you will see there're three containers running.

![](docker.jpeg)


In this section, we learned how to run the Wasm app image and build the Wasm app image with the help of Docker Desktop. If you don't want to use Docker CLI, please check out this article to [build the Docker Engine with support of WasmEdge from Scratch](https://github.com/chris-crone/wasm-day-na-22).


Want to learn more about Docker and Wasm, go to [containerd](/docs/deploy/oci-runtime/containerd.md) chapter for more details.

