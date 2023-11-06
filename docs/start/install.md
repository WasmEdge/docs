---
sidebar_position: 2
---

# Install and uninstall WasmEdge

This chapter will discuss ways to install and uninstall the WasmEdge Runtime on various OSes and platforms. We will cover how to install plug-ins to WasmEdge.

<!-- prettier-ignore -->
:::note
Docker Desktop 4.15+ already has WasmEdge bundled in its distribution binary. If you use Docker Desktop, you will not need to install WasmEdge separately. Check out [how to run WasmEdge apps in Docker Desktop.](build-and-run/docker_wasm.md)
:::

## Install

You can install the WasmEdge Runtime on any generic Linux and MacOS platforms. If you use Windows 10 or Fedora / Red Hat Linux systems, you can install with their default package managers.

### Generic Linux and MacOS

The easiest way to install WasmEdge is to run the following command. Your system should have `git` and `curl` as prerequisites.

```bash
curl -sSf https://raw.githubusercontent.com/WasmEdge/WasmEdge/master/utils/install.sh | bash
```

Run the following command to make the installed binary available in the current session.

```bash
source $HOME/.wasmedge/env
```

#### Install for all users

WasmEdge is installed in the `$HOME/.wasmedge` directory by default. You can install it into a system directory, such as `/usr/local` to make it available to all users. To specify an install directory, run the `install.sh` script with the `-p` flag. You will need to run the following commands as the `root` user or `sudo` since they are written write into system directories.

```bash
curl -sSf https://raw.githubusercontent.com/WasmEdge/WasmEdge/master/utils/install.sh | bash -s -- -p /usr/local
```

#### Install a specific version of WasmEdge

The WasmEdge installer script will install the latest official release by default. You could install a specific version of WasmEdge, including pre-releases or old releases by passing the `-v` argument to the installer script. Here is an example.

```bash
VERSION={{ wasmedge_version }}
curl -sSf https://raw.githubusercontent.com/WasmEdge/WasmEdge/master/utils/install.sh | bash -s -- -v $VERSION
```

Suppose you are interested in the latest builds from the `HEAD` of the `master` branch, which is basically WasmEdge's nightly builds. In that case, you can download the release package directly from our Github Action's CI artifact. [Here is an example](https://github.com/WasmEdge/WasmEdge/actions/runs/2969775464#artifacts).

#### Install WasmEdge with plug-ins

WasmEdge plug-ins are pre-built native modules that provide additional functionalities to the WasmEdge Runtime. To install plug-ins with the runtime, you can pass the `--plugins` parameter in the installer. For example, the command below installs the `WASI-NN TensorFlow-Lite backend` plug-in, which allows WasmEdge apps to run inference on Tensorflow-Lite models with the `WASI-NN` proposal.

```bash
curl -sSf https://raw.githubusercontent.com/WasmEdge/WasmEdge/master/utils/install.sh | bash -s -- --plugins wasi_nn-tensorflowlite
```

To install multiple plug-ins, you can pass a list of plug-ins with the `--plugins` option. For example, the following command installs the `wasi-nn TensorFlow-Lite backend` and the `wasmedge_tensorflow` plug-ins.

```bash
curl -sSf https://raw.githubusercontent.com/WasmEdge/WasmEdge/master/utils/install.sh | bash -s -- --plugins wasi_nn-tensorflowlite wasmedge_tensorflow
```

The installer downloads the plug-in files from the WasmEdge release on GitHub, unzips them, and then copies them over to the `~/.wasmedge/plugin/` folder (for user install) and to the `/usr/local/lib/wasmedge/` folder (for system install).

<!-- prettier-ignore -->
:::note
AI plug-ins for WasmEdge, such as the `OpenVINO backend` or `PyTorch backend` for `WASI-NN` plug-ins, have additional dependencies on the `OpenVINO` or `PyTorch` runtime libraries. [See the next section](#install-wasmedge-plug-ins-and-dependencies) for commands to install the plug-in dependencies.
:::

### Windows

For `Windows 10`, you could use Windows Package Manager Client (aka `winget.exe`) to install WasmEdge with one single command in your terminal.

```bash
winget install wasmedge
```

To install plug-ins, you can download plug-in binary modules from the WasmEdge release page, unzip them, and then copy them to `C:\Program Files\WasmEdge\lib`.

### Fedora and Red Hat Linux

WasmEdge is now an official package on Fedora 36, Fedora 37, Fedora 38, Fedora EPEL 8, and Fedora EPEL 9. Check out the stable version [here](https://src.fedoraproject.org/rpms/wasmedge). To install WasmEdge on Fedora, run the following command:

```bash
dnf install wasmedge
```

For more usages, please check out Fedora docs.

To install plug-ins, you can download plug-in binary modules from the WasmEdge release page, unzip them, and then copy them over to `/usr/local/lib/wasmedge/`.

## What's installed

If you install into the `$HOME/.wasmedge` directory, you will have the following directories and files after installation:

- The `$HOME/.wasmedge/bin` directory contains the WasmEdge Runtime CLI executable files. You can copy and move them around on your file system.

  - The `wasmedge` tool is the standard WasmEdge runtime. You can use it from the CLI.
    - Execute a WASM file: `wasmedge --dir .:. app.wasm`
  - The `wasmedgec` tool is the ahead-of-time (AOT) compiler to compile a `.wasm` file into a native `.so` file (or `.dylib` on MacOS, `.dll` on Windows, or `.wasm` as the universal WASM format on all platforms). The `wasmedge` can then execute the output file.

    - Compile a WASM file into a AOT-compiled WASM: `wasmedgec app.wasm app.so`
    - Execute the WASM in AOT mode: `wasmedge --dir .:. app.so`

    <!-- prettier-ignore -->
    :::note
    The usage of `wasmedgec` is equal to `wasmedge compile`. We decide to deprecate `wasmedgec` in the future.
    :::

- The `$HOME/.wasmedge/lib` directory contains WasmEdge shared libraries and dependency libraries. They are useful for WasmEdge SDKs to launch WasmEdge programs and functions from host applications.
- The `$HOME/.wasmedge/include` directory contains the WasmEdge header files. They are useful for WasmEdge SDKs.
- The `$HOME/.wasmedge/plugin` directory contains the WasmEdge plug-ins. They are loadable extensions for WasmEdge SDKs and will automatically be loaded when running the WasmEdge CLI.

<!-- prettier-ignore -->
:::note
You could also change it to `/usr/local` if you did a system-wide install.
If you used `winget` to install WasmEdge, the files are located at `C:\Program Files\WasmEdge`.
:::

## Install WasmEdge plug-ins and dependencies

WasmEdge uses plug-ins to extend its functionality. If you want to use more of WasmEdge's features, you can install WasmEdge along with its plug-ins and extensions as described below:

### TLS plug-in

The WasmEdge TLS plug-in utilizes the native OpenSSL library to support HTTPS and TLS requests from WasmEdge sockets. To install the WasmEdge TLS plug-in on Linux, run the following commands after you have installed WasmEdge.

```bash
wget https://github.com/WasmEdge/WasmEdge/releases/download/0.13.4/WasmEdge-plugin-wasmedge_rustls-0.13.4-manylinux2014_x86_64.tar.gz
tar xf WasmEdge-plugin-wasmedge_rustls-0.13.4-manylinux2014_x86_64.tar.gz

# If you only installed WasmEdge for the local user
cp libwasmedge_rustls.so ~/.wasmedge/plugin/

# If you installed Wasmedge at /usr/local for all users
sudo mkdir -p /usr/local/lib/wasmedge/
sudo cp libwasmedge_rustls.so /usr/local/lib/wasmedge/
```

Then, go to [HTTPS request in Rust chapter](../develop/rust/http_service/client.md) to see how to run HTTPs services with Rust.

### WASI-NN plug-in

WasmEdge supports various backends for `WASI-NN`.

- [ggml backend](#wasi-nn-plug-in-with-ggml-backend): supported on `Ubuntu above 20.04` (x86_64), macOS (M1 and M2), and GPU (NVIDIA).
- [PyTorch backend](#wasi-nn-plug-in-with-pytorch-backend): supported on `Ubuntu above 20.04` and `manylinux2014_x86_64`.
- [OpenVINO™ backend](#wasi-nn-plug-in-with-openvino-backend): supported on `Ubuntu above 20.04`.
- [TensorFlow-Lite backend](#wasi-nn-plug-in-with-tensorflow-lite-backend): supported on `Ubuntu above 20.04`, `manylinux2014_x86_64`, and `manylinux2014_aarch64`.

Noticed that the backends are exclusive. Developers can only choose and install one backend for the `WASI-NN` plug-in.

#### WASI-NN plug-in with ggml backend

`WASI-NN plug-in` with `ggml` backend allows WasmEdge to run llama2 inference. To install WasmEdge with WASI-NN ggml backend on, please use `--plugin wasi_nn-ggml` when running the installer command.

Please note, the installer from WasmEdge 0.13.5 will detect CUDA automatically. If CUDA is detected, the installer will always attempt to install a CUDA-enabled version of the plug-in.

If CPU is the only available hardware on your machine, the installer will install OpenBLAS version of plugin instead.

```bash
apt update && apt install -y libopenblas-dev # You may need sudo if the user is not root.
```

Then, go to the [Llama2 inference in Rust chapter](../develop/rust/wasinn/llm_inference) to see how to run AI inference with llama2 series of models.

#### WASI-NN plug-in with PyTorch backend

`WASI-NN` plug-in with `PyTorch` backend allows WasmEdge applications to perform `PyTorch` model inference. To install WasmEdge with `WASI-NN PyTorch backend` plug-in on Linux, please use the `--plugins wasi_nn-pytorch` parameter when [running the installer command](#generic-linux-and-macos).

The `WASI-NN` plug-in with `PyTorch` backend depends on the `libtorch` C++ library to perform AI/ML computations. You need to install the [PyTorch 1.8.2 LTS](https://pytorch.org/get-started/locally/) dependencies for it to work properly.

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
For the `Ubuntu 20.04` or above versions, the WasmEdge installer will install the `Ubuntu` version of WasmEdge and its plug-ins.
For other systems, the WasmEdge installer will install the `manylinux2014` version, and you should get the `libtorch` without `cxx11-abi`.
:::

Then, go to the [WASI-NN PyTorch backend in Rust chapter](../develop/rust/wasinn/pytorch) to see how to run AI inference with `Pytorch`.

#### WASI-NN plug-in with OpenVINO backend

`WASI-NN` plug-in with `OpenVINO™` backend allows WasmEdge applications to perform `OpenVINO™` model inference. To install WasmEdge with `WASI-NN OpenVINO™ backend` plug-in on Linux, please use the `--plugins wasi_nn-openvino` parameter when [running the installer command](#generic-linux-and-macos).

The `WASI-NN` plug-in with `OpenVINO™` backend depends on the `OpenVINO™` C library to perform AI/ML computations. [OpenVINO™](https://docs.openvino.ai/2023.0/openvino_docs_install_guides_installing_openvino_apt.html)(2023) dependencies. The following instructions are for Ubuntu 20.04 and above.

```bash
wget https://apt.repos.intel.com/intel-gpg-keys/GPG-PUB-KEY-INTEL-SW-PRODUCTS.PUB
sudo apt-key add GPG-PUB-KEY-INTEL-SW-PRODUCTS.PUB
echo "deb https://apt.repos.intel.com/openvino/2023 ubuntu20 main" | sudo tee /etc/apt/sources.list.d/intel-openvino-2023.list
sudo apt update
sudo apt-get -y install openvino
ldconfig
```

Then, go to the [WASI-NN OpenVINO™ backend in Rust](../develop/rust/wasinn/openvino) chapter to see how to run AI inference with `OpenVINO™`.

#### WASI-NN plug-in with TensorFlow-Lite backend

`WASI-NN` plug-in with `Tensorflow-Lite` backend allows WasmEdge applications to perform `Tensorflow-Lite` model inference. To install WasmEdge with `WASI-NN Tensorflow-Lite backend` plug-in on Linux, please use the `--plugins wasi_nn-tensorflowlite` parameter when [running the installer command](#generic-linux-and-macos).

The `WASI-NN` plug-in with `Tensorflow-Lite` backend depends on the `libtensorflowlite_c` shared library to perform AI/ML computations, and it will be installed by the installer automatically.

<!-- prettier-ignore -->
:::note
If you install this plug-in WITHOUT installer, you can [refer to here to install the dependency](#tensorflow-lite-dependencies).
:::note

Then, go to [WASI-NN TensorFlow-lite backend in Rust chapter](../develop/rust/wasinn/tensorflow_lite) to see how to run AI inference with `TensorFlow-Lite`.

### WASI-Crypto Plug-in

[WASI-crypto](https://github.com/WebAssembly/wasi-crypto) is Cryptography API proposals for WASI. To use WASI-Crypto proposal, please use the `--plugins wasi_crypto` parameter when [running the installer command](#generic-linux-and-macos).

Then, go to [WASI-Crypto in Rust chapter](../develop/rust/wasicrypto.md) to see how to run `WASI-crypto` functions.

### WasmEdge Image Plug-in

The wasmEdge-Image plug-in can help developers to load and decode JPEG and PNG images and convert into tensors. To install this plug-in, please use the `--plugins wasmedge_image` parameter when [running the installer command](#generic-linux-and-macos).

Then, go to [TensorFlow interface (image part) in Rust chapter](../develop/rust/wasinn/tf_plugin.md#image-loading-and-conversion) to see how to run `WasmEdge-Image` functions.

### WasmEdge TensorFlow Plug-in

WasmEdge-TensorFlow plug-in can help developers to perform `TensorFlow` model inference as the similar API in python. To install this plug-in, please use the `--plugins wasmedge_tensorflow` parameter when [running the installer command](#generic-linux-and-macos).

The WasmEdge-Tensorflow plug-in depends on the `libtensorflow_cc` shared library.

<!-- prettier-ignore -->
:::note
If you install this plug-in WITHOUT installer, you can [refer to here to install the dependency](#tensorflow-dependencies).
:::note

Then, go to [TensorFlow interface in Rust chapter](../develop/rust/wasinn/tf_plugin.md) to see how to run `WasmEdge-TensorFlow` functions.

### WasmEdge TensorFlow-Lite Plug-in

The wasmEdge-TensorFlowLite plug-in can help developers to perform `TensorFlow-Lite` model inference as the similar API in python. To install this plug-in, please use the `--plugins wasmedge_tensorflowlite` parameter when [running the installer command](#generic-linux-and-macos).

The WasmEdge-TensorflowLite plug-in depends on the `libtensorflowlite_c` shared library to perform AI/ML computations, and it will be installed by the installer automatically.

<!-- prettier-ignore -->
:::note
If you install this plug-in WITHOUT installer, you can [refer to here to install the dependency](#tensorflow-lite-dependencies).
:::note

Then, go to [TensorFlow interface in Rust chapter](../develop/rust/wasinn/tf_plugin.md) to see how to run `WasmEdge-TensorFlowLite` functions.

## Install WasmEdge extensions and dependencies

<!-- prettier-ignore -->
:::note
The WasmEdge extensions are deprecated and replaced by the plug-ins since `0.13.0`. The latest version supporting the extensions is `0.12.1`. This chapter will be removed when the `0.12.x` versions are no longer supported by the WasmEdge installer.
:::note

To install the WasmEdge extensions, please use the `-e` option and assign the WasmEdge version before `0.13.0`. You can also use the `-e all` to install the supported extensions.

### WasmEdge Image extension

WasmEdge Image extension (replaced by the [WasmEdge-Image plug-in](#wasmedge-image-plug-in) after `0.13.0`) can help developers to load and decode JPEG and PNG images and convert them into tensors. To install this extension, please use the `-e image` parameter when [running the installer command](#generic-linux-and-macos).

### WasmEdge Tensorflow and TensorFlow-Lite extension with CLI tool

WasmEdge Tensorflow extension and the CLI tool (replaced by the [WasmEdge-Tensorflow plug-in](#wasmedge-tensorflow-plug-in) and the [WasmEdge-TensorflowLite plug-in](#wasmedge-tensorflow-lite-plug-in) after `0.13.0`) can help developers to perform `TensorFlow` and `TensorFlow-Lite` model inference as the similar API in python. To install this extension, please use the `-e tensorflow` parameter when [running the installer command](#generic-linux-and-macos).

## Uninstall

To uninstall WasmEdge, you can run the following command:

```bash
bash <(curl -sSf https://raw.githubusercontent.com/WasmEdge/WasmEdge/master/utils/uninstall.sh)
```

If the `wasmedge` binary is not in `PATH` and it wasn't installed in the default `$HOME/.wasmedge` folder, then you must provide the installation path.

```bash
bash <(curl -sSf https://raw.githubusercontent.com/WasmEdge/WasmEdge/master/utils/uninstall.sh) -p /path/to/parent/folder
```

If you wish to uninstall uninteractively, you can pass in the `--quick` or `-q` flag.

```bash
bash <(curl -sSf https://raw.githubusercontent.com/WasmEdge/WasmEdge/master/utils/uninstall.sh) -q
```

<!-- prettier-ignore -->
:::note
If a parent folder of the `wasmedge` binary contains `.wasmedge`, the folder will be considered for removal. For example, the script altogether removes the default `$HOME/.wasmedge` folder.
:::

If you used `dnf` to install WasmEdge on Fedora and Red Hat Linux, run the following command to uninstall it:

```bash
dnf remove wasmedge
```

If you used `winget` to install WasmEdge on Windows, run the following command to uninstall it:

```bash
winget uninstall wasmedge
```

## Appendix: Installing the TensorFlow Dependencies

### TensorFlow Dependencies

If you install the `WasmEdge-Tensorflow` plug-in WITHOUT installer, you can download the shared libraries with the following commands:

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

The shared library will be extracted in the current directory `./libtensorflow_cc.so.2.12.0` and `./libtensorflow_framework.so.2.12.0` on `Linux` platforms, or `./libtensorflow_cc.2.12.0.dylib` and `./libtensorflow_framework.2.12.0.dylib` on `MacOS` platforms. You can move the library to the installation path:

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

### TensorFlow-Lite Dependencies

If you install the `WasmEdge-TensorflowLite` plug-in WITHOUT installer, you can download the shared libraries with the following commands:

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

```bash
# The error message
curl -sSf https://raw.githubusercontent.com/WasmEdge/WasmEdge/master/utils/install.sh | bash
curl: (7) Failed to connect to raw.githubusercontent.com port 443: Connection refused
```
