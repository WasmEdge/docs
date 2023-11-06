---
sidebar_position: 2
---

# 安装和卸载 WasmEdge

本章将讨论在各种操作系统和平台上安装和卸载 WasmEdge 运行时的方法。同时也将介绍如何为 WasmEdge 安装插件。

<!-- prettier-ignore -->
:::note
Docker Desktop 4.15+ 已经在其分发二进制文件中打包了 WasmEdge。如果你使用 Docker Desktop，则无需再单独安装 WasmEdge。详情请查看[如何在 Docker Desktop 中运行 WasmEdge 应用](build-and-run/docker_wasm.md)。
:::

## 安装

你可以在任何通用的 Linux 和 MacOS 平台上安装 WasmEdge 运行时。如果你使用 Windows 10 或 Fedora/Red Hat Linux 系统，可以使用默认软件包管理器进行安装。

### 通用的 Linux 和 MacOS 平台

确保系统中已经安装了 `git` 和 `curl`，然后运行以下的命令安装 WasmEdge：

```bash
curl -sSf https://raw.githubusercontent.com/WasmEdge/WasmEdge/master/utils/install.sh | bash
```

运行以下命令让刚才安装的二进制文件可以在当前会话中使用。

```bash
source $HOME/.wasmedge/env
```

#### 全局安装

WasmEdge 默认被安装在 `$HOME/.wasmedge` 目录中。你也可以将其安装到系统目录，如 `/usr/local`，以使其对所有用户可用。若要指定安装目录，应使用 `install.sh -p` 进行安装，由于这些命令会执行会写入系统目录的操作，所以需要以 `root` 用户或使用 `sudo` 执行：

```bash
curl -sSf https://raw.githubusercontent.com/WasmEdge/WasmEdge/master/utils/install.sh | bash -s -- -p /usr/local
```

#### 安装特定版本的 WasmEdge

WasmEdge 安装程序脚本默认会安装最新的官方发布版本。 你可以通过使用 `-v` 参数来安装特定版本的 WasmEdge，包括预发布版本或旧版本。如下所示：

```bash
VERSION={{ wasmedge_version }}
curl -sSf https://raw.githubusercontent.com/WasmEdge/WasmEdge/master/utils/install.sh | bash -s -- -v $VERSION
```

如果你对 `master` 分支的 `HEAD` 构建感兴趣（这基本上是 WasmEdge 的每夜构建版本）。在这种情况下，可以直接从我们的 Github Action 的 CI artifact 下载发布包。[以下是一个示例链接](https://github.com/WasmEdge/WasmEdge/actions/runs/2969775464#artifacts)。

#### 带插件安装 WasmEdge

WasmEdge 插件是预构建的原生模块，为 WasmEdge 运行时提供额外功能。要在安装运行时的同时也安装插件，可以在安装程序中使用 `--plugins` 参数。例如，下面的命令安装 `WASI-NN TensorFlow-Lite backend` 插件，使 WasmEdge 应用能够在具有 `WASI-NN` 提案的 Tensorflow-Lite 模型上运行推理。

```bash
curl -sSf https://raw.githubusercontent.com/WasmEdge/WasmEdge/master/utils/install.sh | bash -s -- --plugins wasi_nn-tensorflowlite
```

若要安装多个插件，可以使用 `--plugins` 选项并传递插件列表。例如，以下命令安装了 `wasi-nn TensorFlow-Lite backend` 和 `wasmedge_tensorflow` 插件。

```bash
curl -sSf https://raw.githubusercontent.com/WasmEdge/WasmEdge/master/utils/install.sh | bash -s -- --plugins wasi_nn-tensorflowlite wasmedge_tensorflow
```

安装程序会从 GitHub 上的 WasmEdge 发布中下载插件文件，解压然后复制到 `~/.wasmedge/plugin/` 文件夹（用户安装）或 `/usr/local/lib/wasmedge/` 文件夹（系统安装）。

<!-- prettier-ignore -->
:::note
WasmEdge 的 AI 插件，如用于 `WASI-NN` 插件的 `OpenVINO backend` 或 `PyTorch backend`，还依赖于 `OpenVINO` 或 `PyTorch` 运行时库的其他依赖项。请参阅[下一节](#安装_WasmEdge_插件和依赖)获取安装插件依赖项的命令。
:::

### Windows

对于 `Windows 10` 系统，你可以使用 Windows 软件包管理器客户端（即 `winget.exe`）在终端中使用下面的命令来安装 WasmEdge。

```bash
winget install wasmedge
```

如果要安装插件，可以从 WasmEdge 发布页面下载插件二进制模块，解压然后复制到 `C:\Program Files\WasmEdge\lib` 目录下。

### Fedora 和 Red Hat Linux

WasmEdge 现在是 Fedora 36、Fedora 37、Fedora 38、Fedora EPEL 8 和 Fedora EPEL 9 的官方软件包。要在 Fedora 上安装 WasmEdge，请运行以下命令：

```bash
dnf install wasmedge
```

更多用法，请查阅 Fedora 文档。

若要安装插件，可以从 WasmEdge 发布页面下载插件的二进制模块，解压然后复制到 `/usr/local/lib/wasmedge/` 目录下。

## 安装内容

如果安装目录为 `$HOME/.wasmedge`，则在安装完成后会有以下目录和文件：

- `$HOME/.wasmedge/bin` 目录中包含 WasmEdge 运行时可执行文件。你可以在文件系统中复制和移动它们。

  - `wasmedge` 工具是标准的 WasmEdge 运行时。你可以通过命令行界面 (CLI) 使用它。
    - 运行一个 WASM 文件：`wasmedge --dir .:. app.wasm`
  - `wasmedgec` 工具是提前（AOT）编译器，用于将 `.wasm` 文件编译成本机的 `.so` 文件（在 MacOS 上则编译成 `.dylib`，在 Windows 上则编译成 `.dll`，或编译成在各平台上通用的 `.wasm` 格式）。`wasmedge` 可以执行编译后的文件。

    - 使用 AOT 编译 WASM 文件：`wasmedgec app.wasm app.so`
    - 以 AOT 模式运行 WASM：`wasmedge --dir .:. app.so`

    <!-- prettier-ignore -->
    :::note
    `wasmedgec` 的用法等同于 `wasmedge compile`。我们决定在未来废弃 `wasmedgec`。
    :::

- `$HOME/.wasmedge/lib` 目录包含 WasmEdge 共享库和依赖库。这对于 WasmEdge SDK 在主机应用程序中启动 WasmEdge 程序和函数很有用。
- `$HOME/.wasmedge/include` 目录包含 WasmEdge 头文件。这对于 WasmEdge SDK 很有用。
- `$HOME/.wasmedge/plugin` 目录包含 WasmEdge 插件。这些是 WasmEdge SDK 的可加载扩展，在运行 WasmEdge CLI 时会自动加载。

<!-- prettier-ignore -->
:::note
如果进行全局安装，则安装路径为 `/usr/local`。
如果使用 `winget` 安装，则文件位于 `C:\Program Files\WasmEdge`。
:::

## 安装 WasmEdge 插件和依赖项

WasmEdge 使用插件来扩展其功能。如果您想使用更多 WasmEdge 的功能，可以按下面的说明安装 WasmEdge 以及其插件和扩展：

### TLS 插件

WasmEdge TLS 插件利用本机 OpenSSL 库来支持 WasmEdge sockets 的 HTTPS 和 TLS 请求。如果要在 Linux 上安装 WasmEdge TLS 插件，则在安装 WasmEdge 后运行以下命令：

```bash
wget https://github.com/WasmEdge/WasmEdge/releases/download/0.13.4/WasmEdge-plugin-wasmedge_rustls-0.13.4-manylinux2014_x86_64.tar.gz
tar xf WasmEdge-plugin-wasmedge_rustls-0.13.4-manylinux2014_x86_64.tar.gz

# If you only installed WasmEdge for the local user
cp libwasmedge_rustls.so ~/.wasmedge/plugin/

# If you installed Wasmedge at /usr/local for all users
sudo mkdir -p /usr/local/lib/wasmedge/
sudo cp libwasmedge_rustls.so /usr/local/lib/wasmedge/
```

安装完成后，在 [Rust 中的 HTTPS 请求](../develop/rust/http_service/client.md) 章节中查看如何使用 Rust 运行 HTTPS 服务。

### WASI-NN 插件

WasmEdge 支持多种 `WASI-NN` 的后端。

- [ggml 后端](#wasi-nn-plug-in-with-pytorch-backend)：支持 `Ubuntu 20.04 以上`、macOS (M1 和 M2) 和 `GPU (NVIDIA)`。
- [PyTorch 后端](#wasi-nn-plug-in-with-pytorch-backend)：支持 `Ubuntu 20.04 以上` 和 `manylinux2014_x86_64`。
- [OpenVINO™ 后端](#wasi-nn-plug-in-with-openvino-backend)：支持 `Ubuntu 20.04 以上`。
- [TensorFlow-Lite 后端](#wasi-nn-plug-in-with-tensorflow-lite-backend)：支持 `Ubuntu 20.04 以上`，`manylinux2014_x86_64` 和 `manylinux2014_aarch64`。

注意这些后端是互斥的。开发者只能选择并安装一个后端用于 `WASI-NN` 插件。

#### 带有 ggml 后端的 WASI-NN 插件

`WASI-NN` 插件与 `ggml` 后端允许 WasmEdge 应用执行 Llama 2 系列大模型的推理。要在 Linux 上安装带有 `WASI-NN ggml backend` 的 WasmEdge，请在[运行安装命令](#generic-linux-and-macos)时使用 `--plugins wasi_nn-ggml` 参数。

注意，WasmEdge 0.13.5 的安装程序将自动检测 CUDA。如果检测到 CUDA，安装程序将始终尝试安装支持 CUDA 的插件版本。

如果您的机器上只有CPU可用，那么需要安装 OpenBLAS 版本的插件。

```
apt update && apt install -y libopenblas-dev # You may need sudo if the user is not root.
```
安装完成后，请在 [Rust 中的大模型推理](../develop/rust/wasinn/llm_inference) 章节中了解如何使用 `ggml` 运行 LLM 推理程序。

#### 带有 PyTorch 后端的 WASI-NN 插件

`WASI-NN` 插件与 `PyTorch` 后端允许 WasmEdge 应用执行 `PyTorch` 模型推理。要在 Linux 上安装带有 `WASI-NN PyTorch 后端` 的 WasmEdge，请在[运行安装命令](#generic-linux-and-macos)时使用 `--plugins wasi_nn-pytorch` 参数。

`WASI-NN` 插件带有 `PyTorch` 后端依赖于 `libtorch` C++ 库来进行人工智能/机器学习计算。你需要安装[PyTorch 1.8.2 LTS](https://pytorch.org/get-started/locally/)的依赖项，以确保其正常工作。

```bash
export PYTORCH_VERSION="1.8.2"
# For the Ubuntu 20.04 or above, use the libtorch with cxx11 abi.
export PYTORCH_ABI="libtorch-cxx11-abi"
# For the manylinux2014, please use the without cxx11 abi version:
#   export PYTORCH_ABI="libtorch"
curl -s -L -O --remote-name-all https://download.pytorch.org/libtorch/lts/1.8/cpu/${PYTORCH_ABI}-shared-with-deps-${PYTORCH_VERSION}%2Bcpu.zip
unzip -q "${PYTORCH_ABI}-shared-with-deps-${PYTORCH_VERSION}%2Bcpu.zip"
rm -f "${PYTORCH_ABI}-shared-with-deps-${PYTORCH_VERSION}%2Bcpu.zip"
export LD_LIBRARY_PATH=${LD_LIBRARY_PATH}:$(pwd)/libtorch/lib
```

<!-- prettier-ignore -->
:::note
对于 `Ubuntu 20.04` 或更高版本，WasmEdge 安装程序将安装 `Ubuntu` 版本的 WasmEdge 及其插件。
对于其他系统，WasmEdge 安装程序将安装 `manylinux2014` 版本，并且你应该使用不带 `cxx11-abi` 的 `libtorch`。
:::

安装完成后，请在 [Rust 中的 WASI-NN PyTorch 后端](../develop/rust/wasinn/pytorch) 章节中了解如何使用 `PyTorch` 运行人工智能推理。

#### 带有 OpenVINO 后端的 WASI-NN 插件

`WASI-NN` 插件与 `OpenVINO™` 后端允许 WasmEdge 应用执行 `OpenVINO™` 模型推理。要在 Linux 上安装带有 `WASI-NN OpenVINO™ 后端` 的 WasmEdge，请在[运行安装命令](#generic-linux-and-macos)时使用 `--plugins wasi_nn-openvino` 参数。

`WASI-NN` 插件带有 `OpenVINO™` 后端依赖于 `OpenVINO™` C 库来进行人工智能/机器学习计算。[OpenVINO™](https://docs.openvino.ai/2023.0/openvino_docs_install_guides_installing_openvino_apt.html)（2023）依赖项。以下说明适用于 Ubuntu 20.04 及以上版本。

```bash
wget https://apt.repos.intel.com/intel-gpg-keys/GPG-PUB-KEY-INTEL-SW-PRODUCTS.PUB
sudo apt-key add GPG-PUB-KEY-INTEL-SW-PRODUCTS.PUB
echo "deb https://apt.repos.intel.com/openvino/2023 ubuntu20 main" | sudo tee /etc/apt/sources.list.d/intel-openvino-2023.list
sudo apt update
sudo apt-get -y install openvino
ldconfig
```

安装完成后，请在 [Rust 中的 WASI-NN OpenVINO™ 后端](../develop/rust/wasinn/openvino) 章节查看如何使用 `OpenVINO™` 运行人工智能推理。

#### 带有 TensorFlow-Lite 后端的 WASI-NN 插件

`WASI-NN` 插件与 `Tensorflow-Lite` 后端允许 WasmEdge 应用执行 `Tensorflow-Lite` 模型推理。要在 Linux 上安装带有 `WASI-NN Tensorflow-Lite 后端` 的 WasmEdge，请在[运行安装命令](#generic-linux-and-macos)时使用 `--plugins wasi_nn-tensorflowlite` 参数。

`WASI-NN` 插件带有 `Tensorflow-Lite` 后端依赖于 `libtensorflowlite_c` 共享库来进行人工智能/机器学习计算，并将由安装程序自动安装。

<!-- prettier-ignore -->
:::note
如果安装了该插件，但并非使用上面的方式，可以参考[此处](#tensorflow-lite-dependencies)安装依赖项。
:::note

安装完成后，查看 [Rust 中的 WASI-NN TensorFlow-Lite 后端](../develop/rust/wasinn/tensorflow_lite) 章节了解如何使用 `TensorFlow-Lite` 运行人工智能推理。

### WASI-Crypto 插件

[WASI-crypto](https://github.com/WebAssembly/wasi-crypto) 是 WASI 的密码学 API 提案。若要使用 WASI-Crypto 提案，请在[运行安装命令](#generic-linux-and-macos)时使用 `--plugins wasi_crypto` 参数。

安装完成后，查看 [Rust 中的 WASI-Crypto](../develop/rust/wasicrypto.md)  章节了解如何运行 `WASI-crypto` 函数。

### WasmEdge 图像插件

wasmEdge-Image 插件可以帮助开发人员加载和解码 JPEG 和 PNG 图像，并将其转换为张量。要安装此插件，请在[运行安装命令](#generic-linux-and-macos)时使用 `--plugins wasmedge_image` 参数。

安装完成后，查看 [Rust 中的 TensorFlow 接口（图像部分）](../develop/rust/wasinn/tf_plugin.md#image-loading-and-conversion) 章节了解如何运行 `WasmEdge-Image` 函数。

### WasmEdge TensorFlow 插件

WasmEdge-TensorFlow 插件可以帮助开发人员执行与 Python 中相似的 `TensorFlow` 模型推理。要安装此插件，请在[运行安装命令](#generic-linux-and-macos)时使用 `--plugins wasmedge_tensorflow` 参数。

WasmEdge-TensorFlow 插件依赖于 `libtensorflow_cc` 共享库。

<!-- prettier-ignore -->
:::note
如果安装了该插件，但并非使用上面的方式，可以参考[此处](#tensorflow-dependencies)安装依赖项。
:::note

安装完成后，查看 [Rust 中的 TensorFlow 接口](../develop/rust/wasinn/tf_plugin.md) 章节了解如何运行 `WasmEdge-TensorFlow` 函数。

### WasmEdge TensorFlow-Lite 插件

wasmEdge-TensorFlowLite 插件可以帮助开发人员执行与 Python 中类似的 `TensorFlow-Lite` 模型推理。要安装此插件，请在[运行安装命令](#generic-linux-and-macos)时使用 `--plugins wasmedge_tensorflowlite` 参数。

WasmEdge-TensorflowLite 插件依赖于 `libtensorflowlite_c` 共享库来执行人工智能/机器学习计算（由安装程序自动安装）。

<!-- prettier-ignore -->
:::note
如果安装了该插件，但并非使用上面的方式，可以参考[此处](#tensorflow-lite-dependencies)安装依赖项。
:::note

Then, go to [TensorFlow interface in Rust chapter](../develop/rust/wasinn/tf_plugin.md) to see how to run `WasmEdge-TensorFlowLite` functions.
安装完成后，查看 [Rust 中的 TensorFlow 接口](../develop/rust/wasinn/tf_plugin.md) 章节了解如何运行 `WasmEdge-TensorFlowLite` 函数。

## 安装 WasmEdge 扩展和依赖项

<!-- prettier-ignore -->
:::note
WasmEdge 扩展自 `0.13.0` 版本起已被弃用，并由插件取代。支持扩展的最新版本是 `0.12.1`。当 WasmEdge 安装程序不再支持 `0.12.x` 版本时，本章节将被移除。
:::note

要安装 WasmEdge 扩展，请在使用 `-e` 选项指定查看，并安装 `0.13.0` 之前的版本。你也可以使用 `-e all` 安装所有支持的扩展。

### WasmEdge 图像扩展

WasmEdge 图像扩展（在 `0.13.0 `后被 [WasmEdge-Image 插件](#wasmedge-image-plug-in) 取代）可以帮助开发者加载和解码 JPEG 和 PNG 图像，并将其转换为张量。要安装此扩展，请在[运行安装命令](#generic-linux-and-macos)时使用 `-e image` 参数。

### WasmEdge Tensorflow 和 TensorFlow-Lite 带有 CLI 工具的扩展

WasmEdge Tensorflow 扩展和 CLI 工具（在 `0.13.0` 后被 [WasmEdge-Tensorflow 插件](#wasmedge-tensorflow-plug-in) 和 [WasmEdge-TensorflowLite 插件](#wasmedge-tensorflow-lite-plug-in) 取代）可以帮助开发者执行类似于 Python 中的 `TensorFlow` 和 `TensorFlow-Lite` 模型推理。要安装此扩展，请在[运行安装命令](#generic-linux-and-macos)时使用 `-e tensorflow` 参数。

## 卸载

使用下面的指令卸载 WasmEdge：

```bash
bash <(curl -sSf https://raw.githubusercontent.com/WasmEdge/WasmEdge/master/utils/uninstall.sh)
```

如果 `wasmedge` 可执行文件不在系统路径 `PATH` 中，并且没有被安装在默认的 `$HOME/.wasmedge` 文件夹中，则必须提供安装路径才能卸载。

```bash
bash <(curl -sSf https://raw.githubusercontent.com/WasmEdge/WasmEdge/master/utils/uninstall.sh) -p /path/to/parent/folder
```

如果你希望以非交互的方式执行卸载，可以使用 `--quick` 或 `-q` 参数。

```bash
bash <(curl -sSf https://raw.githubusercontent.com/WasmEdge/WasmEdge/master/utils/uninstall.sh) -q
```

<!-- prettier-ignore -->
:::note
如果 `wasmedge` 可执行文件的父文件夹包含 `.wasmedge`，则该文件夹也会被删除。例如，脚本会一并删除默认的 `$HOME/.wasmedge` 文件夹。
:::

如果你在 Fedora 和 Red Hat Linux 上使用 `dnf` 安装了 WasmEdge，运行以下命令来卸载它：

```bash
dnf remove wasmedge
```

如果你在 Windows 上使用 `winget` 安装 WasmEdge，运行以下命令来卸载它：

```bash
winget uninstall wasmedge
```

## 附录：安装 TensorFlow 依赖项

### TensorFlow 依赖

如果未使用安装程序安装 `WasmEdge-Tensorflow` 插件，你可以使用以下命令下载共享库：

```bash
VERSION=TF-2.12.0-CC
# For the WasmEdge versions before 0.13.0, please use the `TF-2.6.0-CC` version.
PLATFORM=manylinux2014_x86_64
# For the Linux aarch64 platforms, please use the `manylinux2014_aarch64`.
# For the MacOS x86_64 platforms, please use the `darwin_x86_64`.
# For the MacOS arm64 platforms, please use the `darwin_arm64`.
curl -s -L -O --remote-name-all https://github.com/second-state/WasmEdge-tensorflow-deps/releases/download/TF-2.12.0-CC/WasmEdge-tensorflow-deps-TF-TF-$VERSION-$PLATFORM.tar.gz
tar -zxf WasmEdge-tensorflow-deps-TF-TF-$VERSION-$PLATFORM.tar.gz
rm -f WasmEdge-tensorflow-deps-TF-TF-$VERSION-$PLATFORM.tar.gz
```

在 `Linux` 平台上，共享库将被提取到当前目录 `./libtensorflow_cc.so.2.12.0` 和 `./libtensorflow_framework.so.2.12.0`，而在 `MacOS` 平台上，共享库将提取到 `./libtensorflow_cc.2.12.0.dylib` 和 `./libtensorflow_framework.2.12.0.dylib`。你可以手动将库移动到安装路径：

```bash
# If you installed wasmedge locally as above
mv libtensorflow_cc.so.2.12.0 ~/.wasmedge/lib
mv libtensorflow_framework.so.2.12.0 ~/.wasmedge/lib
ln -s libtensorflow_cc.so.2.12.0 ~/.wasmedge/lib/libtensorflow_cc.so.2
ln -s libtensorflow_cc.so.2 ~/.wasmedge/lib/libtensorflow_cc.so
ln -s libtensorflow_framework.so.2.12.0 ~/.wasmedge/lib/libtensorflow_framework.so.2
ln -s libtensorflow_framework.so.2 ~/.wasmedge/lib/libtensorflow_framework.so

# Or, if you installed wasmedge for all users in /usr/local/
mv libtensorflow_cc.so.2.12.0 /usr/local/lib
mv libtensorflow_framework.so.2.12.0 /usr/local/lib
ln -s libtensorflow_cc.so.2.12.0 /usr/local/lib/libtensorflow_cc.so.2
ln -s libtensorflow_cc.so.2 /usr/local/lib/libtensorflow_cc.so
ln -s libtensorflow_framework.so.2.12.0 /usr/local/lib/libtensorflow_framework.so.2
ln -s libtensorflow_framework.so.2 /usr/local/lib/libtensorflow_framework.so

# Or on MacOS platforms
mv libtensorflow_cc.2.12.0.dylib ~/.wasmedge/lib
mv libtensorflow_framework.2.12.0.dylib ~/.wasmedge/lib
ln -s libtensorflow_cc.2.12.0.dylib ~/.wasmedge/lib/libtensorflow_cc.2.dylib
ln -s libtensorflow_cc.2.dylib ~/.wasmedge/lib/libtensorflow_cc.dylib
ln -s libtensorflow_framework.2.12.0.dylib ~/.wasmedge/lib/libtensorflow_framework.2.dylib
ln -s libtensorflow_framework.2.dylib ~/.wasmedge/lib/libtensorflow_framework.dylib
```

### TensorFlow-Lite 依赖

如果未使用安装程序安装 `WasmEdge-TensorflowLite` 插件，您可以使用以下命令下载共享库：

```bash
VERSION=TF-2.12.0-CC
# For the WasmEdge versions before 0.13.0, please use the `TF-2.6.0-CC` version.
PLATFORM=manylinux2014_x86_64
# For the Linux aarch64 platforms, please use the `manylinux2014_aarch64`.
# For the MacOS x86_64 platforms, please use the `darwin_x86_64`.
# For the MacOS arm64 platforms, please use the `darwin_arm64`.
curl -s -L -O --remote-name-all https://github.com/second-state/WasmEdge-tensorflow-deps/releases/download/$VERSION/WasmEdge-tensorflow-deps-TFLite-$VERSION-$PLATFORM.tar.gz
tar -zxf WasmEdge-tensorflow-deps-TFLite-$VERSION-$PLATFORM.tar.gz
rm -f WasmEdge-tensorflow-deps-TFLite-$VERSION-$PLATFORM.tar.gz
```

The shared library will be extracted in the current directory `./libtensorflowlite_c.so` (or `.dylib` for MacOS) and `./libtensorflowlite_flex.so` (after the `WasmEdge 0.13.0` version). You can move the library to the installation path:

共享库将被提取到当前目录 `./libtensorflowlite_c.so`（在 MacOS 则是 `.dylib`），以及 `./libtensorflowlite_flex.so`（自 `WasmEdge 0.13.0` 版本之后）。你可以手动将这些库移动到安装路径：

```bash
# If you installed wasmedge locally as above
mv libtensorflowlite_c.so ~/.wasmedge/lib
mv libtensorflowlite_flex.so ~/.wasmedge/lib

# Or, if you installed wasmedge for all users in /usr/local/
mv libtensorflowlite_c.so /usr/local/lib
mv libtensorflowlite_flex.so /usr/local/lib

# Or on MacOS platforms
mv libtensorflowlite_c.dylib ~/.wasmedge/lib
mv libtensorflowlite_flex.dylib ~/.wasmedge/lib
```

## Troubleshooting

Some users, especially in China, reported encountering the Connection refused error when trying to download the `install.sh` from the `githubusercontent.com`.

Please make sure your network connection can access `github.com` and `githubusercontent.com` via VPN.

## 故障排除

一些用户，特别是在中国用户，在从 `githubusercontent.com` 上下载 `install.sh` 时遇到了“连接被拒绝”的错误。

请确保你的网络可以访问 `github.com` 和 `githubusercontent.com`（可以使用代理或 VPN、或 github 代理）。

```bash
# The error message
curl -sSf https://raw.githubusercontent.com/WasmEdge/WasmEdge/master/utils/install.sh | bash
curl: (7) Failed to connect to raw.githubusercontent.com port 443: Connection refused
```
