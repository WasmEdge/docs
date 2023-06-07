---
sidebar_position: 4
---

# Docker + Wasm

The Docker Desktop distributes with the WasmEdge Runtime embedded. That allows developers to build, share and run very lightweight containers (i.e., a `scratch` empty container with only the `.wasm` file without any Linux OS libraries or files) through Docker tools. Those "Wasm containers" are fully OCI-compliant and hence can be managed by Docker Hub. They are cross-platform and can run on any OS / CPU Docker supports (the OS and CPU platform is `wasi/wasm`). But most importantly, they are 1/10 of the size of a comparable Linux container and start up in 1/10 of the time, as the Wasm containers do not need to bundle and start Linux libraries and services.

Together with Docker's capability to containerize developer and deployment environments, you can create and deploy complex applications without installing any dependencies. For example, you could setup a complete Rust and WasmEdge development environment without installing either tool on your local dev machine. You can also deploy a complex WasmEdge app that needs to connect to a MySQL database without having to install MySQL locally.

In this guide, we will cover how to:

- [Create and run a Rust program](#create-and-run-a-rust-program)
- [Create and run a node.js server](#create-and-run-a-nodejs-server)
- [Create and deploy a database driven microservice in Rust](#create-and-deploy-a-database-driven-microservice-in-rust)

## Prerequisite

Install [Docker Desktop](https://www.docker.com/products/docker-desktop/) and turn on the containerd image store feature in your Docker Desktop settings.

![Docker config](docker_config.png)

## Create and run a Rust program

With Docker + wasm, you can use the entire Rust toolchain in a Docker container to build the Wasm bytecode application, and then publish and run the Wasm application. The [example Rust source code and build instructions are available here](https://github.com/second-state/rust-examples/tree/main/hello).

### Build the rust example

In the project directory, run the following command to build the Rust source code into Wasm and then package the Wasm file into an empty container image. Notice that you do not need to install the Rust compiler toolchain here.

```bash
docker buildx build --platform wasi/wasm -t secondstate/rust-example-hello .
```

The [Dockerfile](https://github.com/second-state/rust-examples/blob/main/hello/Dockerfile) shows how it is done. The Dockerfile has three parts. The first part sets up a Docker container for the Rust build environment.

```dockerfile
FROM --platform=$BUILDPLATFORM rust:1.64 AS buildbase
WORKDIR /src
RUN <<EOT bash
    set -ex
    apt-get update
    apt-get install -y \
        git \
        clang
    rustup target add wasm32-wasi
EOT
```

The second part uses the Rust build environment to compile the Rust source code and generate the Wasm file.

```dockerfile
FROM buildbase AS build
COPY Cargo.toml .
COPY src ./src
# Build the Wasm binary
RUN cargo build --target wasm32-wasi --release
```

The third part is the essential. It copies the Wasm file into an empty `scratch` container and then set the Wasm file as the `ENTRYPOINT` of the container. It is the container image `rust-example-hello` built by the command in this section.

```dockerfile
FROM scratch
ENTRYPOINT [ "hello.wasm" ]
COPY --link --from=build /src/target/wasm32-wasi/release/hello.wasm /hello.wasm
```

The Wasm container image is only 0.5MB. It is much smaller than a natively compiled Rust program in a minimal Linux container.

### Publish the rust example

To publish the Wasm container image to Docker Hub, do the following.

```bash
docker push secondstate/rust-example-hello
```

### Run the rust example

You can use the regular Docker `run` command to run the Wasm container application. Notice that you do need to specify the `runtime` and `platform` flags to tell Docker that this is a non-Linux container and requires WasmEdge to run it.

```bash
$ docker run --rm --runtime=io.containerd.wasmedge.v1 --platform=wasi/wasm secondstate/rust-example-hello:latest
Hello WasmEdge!
```

That's it.

### Further reading for the rust example

To see more Dockerized Rust example apps for WasmEdge, check out the following.

- [Use Rust standard libraries](https://github.com/second-state/rust-examples/tree/main/wasi)
- [Create a HTTP server in hyper and tokio](https://github.com/second-state/rust-examples/tree/main/server)

## Create and run a node.js server

WasmEdge provides a node.js compatible JavaScript runtime. You can create lightweight Wasm container images that runs node.js apps. Compared with standard node.js Linux container images, the Wasm images are 1/100 of the size, completely portable, and starts up in 1/10 of the time.

In this guide, the example app is an HTTP web server written in node.js. Its [source code and build instructions are available here](https://github.com/second-state/wasmedge-quickjs/tree/main/example_js/docker_wasm/server).

### Build the node.js example

In the project directory, run the following command to package the WasmEdge JavaScript runtime and the JS HTTP server program into an empty container image.

```bash
docker buildx build --platform wasi/wasm -t secondstate/node-example-hello .
```

The [Dockerfile](https://github.com/second-state/wasmedge-quickjs/blob/main/example_js/docker_wasm/server/Dockerfile) shows how it is done. The Dockerfile has three parts. The first part sets up a Docker container for the `wget` and `unzip` utilities.

```dockerfile
FROM --platform=$BUILDPLATFORM rust:1.64 AS buildbase
WORKDIR /src
RUN <<EOT bash
    set -ex
    apt-get update
    apt-get install -y \
        wget unzip
EOT
```

The second part uses `wget` and `unzip` to download and extract the WasmEdge JavaScript runtime files and the JS application files into a build container.

```dockerfile
FROM buildbase AS build
COPY server.js .
RUN wget https://github.com/second-state/wasmedge-quickjs/releases/download/v0.5.0-alpha/wasmedge_quickjs.wasm
RUN wget https://github.com/second-state/wasmedge-quickjs/releases/download/v0.5.0-alpha/modules.zip
RUN unzip modules.zip
```

The third part is the essential. It copies the WasmEdge JavaScript runtime files and the JS application files into an empty `scratch` container and then set the `ENTRYPOINT`. It is the container image `node-example-hello` built by the command in this section.

```dockerfile
FROM scratch
ENTRYPOINT [ "wasmedge_quickjs.wasm", "server.js" ]
COPY --link --from=build /src/wasmedge_quickjs.wasm /wasmedge_quickjs.wasm
COPY --link --from=build /src/server.js /server.js
COPY --link --from=build /src/modules /modules
```

The Wasm container image for the entire node.js app is only 1MB. It is much smaller than a standard node.js image, which is 300+MB.

### Publish the node.js example

To publish the Wasm container image to Docker Hub, do the following.

```bash
docker push secondstate/node-example-hello
```

### Run and test the node.js example

You can use the regular Docker `run` command to run the Wasm container application. Notice that you do need to specify the `runtime` and `platform` flags to tell Docker that this is a non-Linux container and requires WasmEdge to run it. Since this is an HTTP server app, you also need to map the container port 8080 to host so that you can access the server from the host.

```bash
$ docker run -dp 8080:8080 --rm --runtime=io.containerd.wasmedge.v1 --platform=wasi/wasm secondstate/node-example-server:latest
listen 8080 ...
```

From another terminal, test the server application.

```bash
$ curl http://localhost:8080/echo -X POST -d "Hello WasmEdge"
Hello WasmEdge
```

That's it.

### Further reading for the node.js example

- [Use the fetch() API](https://github.com/second-state/wasmedge-quickjs/blob/main/example_js/wasi_http_fetch.js)
- [Image classification using Tensorflow Lite](https://github.com/second-state/wasmedge-quickjs/tree/main/example_js/tensorflow_lite_demo)

## Create and deploy a database driven microservice in Rust

Docker + wasm allows us to build and run Wasm containers. However, in most complex applications, the Wasm container is only part of the application. It needs to work together with other Linux containers in the system. The [Docker compose](https://docs.docker.com/compose/) tool is widely used to compose and manage multi-container deployments. It is installed with Docker Desktop.

In our [example microservice application](https://github.com/second-state/microservice-rust-mysql), there is an Nginx web server and a MySQL database. The Wasm container is only for the Rust application that accesses the database and processes the HTTP requests (i.e., the application server).

<!-- prettier-ignore -->
:::note
For more Docker compose examples, including Linux containers + Wasm containers mixed deployments, check out the [awesome-compose](https://github.com/docker/awesome-compose) repo.
:::

### Build the microservice example

In the project directory, run the following command to build all three containers: `client`, `server` and `db`.

```bash
docker compose up
```

There is a [docker-compose.yml](https://github.com/second-state/microservice-rust-mysql/blob/main/docker-compose.yml) file. It defines the 3 containers needed in this application.

```yaml
services:
    client:
        image: nginx:alpine
        ports:
            - 8090:80
        volumes:
            - ./client:/usr/share/nginx/html
    server:
        image: demo-microservice
        platform: wasi/wasm
        build:
            context: .
        ports:
            - 8080:8080
        environment:
            DATABASE_URL: mysql://root:whalehello@db:3306/mysql
            RUST_BACKTRACE: full
        restart: unless-stopped
        runtime: io.containerd.wasmedge.v1
    db:
        image: mariadb:10.9
        environment:
            MYSQL_ROOT_PASSWORD: whalehello
```

- The `client` container is an Nginx web server
  - Linux container with mapped HTTP port and volume for the static HTML/JS files
- The `server` container is a Rust container for the business logic
  - The Wasm container is built from [Rust source code](https://github.com/second-state/microservice-rust-mysql/blob/main/src/main.rs) using this [Dockerfile](https://github.com/second-state/microservice-rust-mysql/blob/main/Dockerfile)
  - Wasm container with mapped web service port and an environment variable for the database connection string
- The `db` container is a MySQL database
  - Linux container with a pre-set database password

### Deploy the microservice example

Start and run all three containers in the correct order with one command.

```bash
docker compose up
```

Go back to Docker Desktop Dash board, you will see there're three containers running.

![Docker](docker.jpeg)

### CRUD tests

Open another terminal, and you can use the `curl` command to interact with the web service.

When the microservice receives a `GET` request to the `/init` endpoint, it would initialize the database with the `orders` table.

```bash
curl http://localhost:8080/init
```

When the microservice receives a `POST` request to the `/create_order` endpoint, it would extract the JSON data from the `POST` body and insert an `Order` record into the database table. For multiple records, use the `/create_orders` endpoint and `POST` a JSON array of `Order` objects.

```bash
curl http://localhost:8080/create_orders -X POST -d @orders.json
```

When the microservice receives a `GET` request to the `/orders` endpoint, it would get all rows from the `orders` table and return the result set in a JSON array in the HTTP response.

```bash
curl http://localhost:8080/orders
```

When the microservice receives a `POST` request to the `/update_order` endpoint, it would extract the JSON data from the `POST` body and update the `Order` record in the database table that matches the `order_id` in the input data.

```bash
curl http://localhost:8080/update_order -X POST -d @update_order.json
```

When the microservice receives a `GET` request to the `/delete_order` endpoint, it would delete the row in the `orders` table that matches the `id` `GET` parameter.

```bash
curl http://localhost:8080/delete_order?id=2
```

That's it. Feel free to fork this project and use it as a template for your own lightweight microservices!

### Further reading for the microservice example

To learn how Docker + Wasm works under the hood, visit the [containerd](../deploy/cri-runtime/containerd.md) chapter for more details.
