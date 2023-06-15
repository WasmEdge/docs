---
sidebar_position: 1
---

# Install and uninstall WasmEdge

In this chapter, we will discuss ways to install and uninstall the WasmEdge Runtime on various OSes and platforms. We will cover how to install plugins to WasmEdge.

<!-- prettier-ignore -->
:::note
Docker Desktop 4.15+ already has WasmEdge bundled in its distribution binary. If you use Docker Desktop, you will not need to install WasmEdge separately. Check out [how to run WasmEdge apps in Docker Desktop.](docker_wasm)
:::

## Install

You can install the WasmEdge Runtime on any generic Linux system. If you are using Windows 10 or Fedora / Red Hat Linux systems, you can also install with their default package managers.

### Generic Linux

The easiest way to install WasmEdge is to run the following command. Your system should have `git` and `curl` as prerequisites.

```bash
curl -sSf https://raw.githubusercontent.com/WasmEdge/WasmEdge/master/utils/install.sh | bash
```

Run the following command to make the installed binary available in the current session.

```bash
source $HOME/.wasmedge/env
```

#### Install for all users

By default, WasmEdge is installed in the `$HOME/.wasmedge` directory. You can install it into a system directory, such as `/usr/local` to make it available to all users. To specify an install directory, you can run the `install.sh` script with the `-p` flag. You will need to run the following commands as the `root` user or `sudo` since they write into system directories.

```bash
curl -sSf https://raw.githubusercontent.com/WasmEdge/WasmEdge/master/utils/install.sh | bash -s -- -p /usr/local
```

#### Install a specific version of WasmEdge

The WasmEdge installer script will install the latest official release by default. You could install a specific version of WasmEdge, including pre-releases or old releases by passing the `-v` argument to the installer script. Here is an example.

```bash
VERSION=0.12.1
curl -sSf https://raw.githubusercontent.com/WasmEdge/WasmEdge/master/utils/install.sh | bash -s -- -v $VERSION
```

If you are interested in the latest builds from the `HEAD` of the `master` branch, which is basically WasmEdge's nightly builds, you can download the release package directly from our Github Action's CI artifact. [Here is an example](https://github.com/WasmEdge/WasmEdge/actions/runs/2969775464#artifacts).

#### Install WasmEdge with plugins

WasmEdge plugins are pre-build native modules that provide additional functionalities to the WasmEdge Runtime. To install plugins with the runtime, you can pass the `--plugins` parameter in the installer. For example, the command below installs the Tensorflow Lite plugin, which allows WasmEdge apps to run inference on Tensorflow Lite models.

```bash
curl -sSf https://raw.githubusercontent.com/WasmEdge/WasmEdge/master/utils/install.sh | bash -s -- --plugins wasi_nn-tensorflowlite
```

To install multiple plugins, you can pass a list of plugins seperated by commas. For example, the following command installs both the HTTPS request and Tensorflow Lite plugins.

```bash
curl -sSf https://raw.githubusercontent.com/WasmEdge/WasmEdge/master/utils/install.sh | bash -s -- --plugins wasi_nn-tensorflowlite,wasmedge_httpsreq
```

The installer downloads the plugin files from the WasmEdge release on GitHub, unzips them, and then copies them over to the `~/.wasmedge/plugin/` folder (for user install) and to the `/usr/local/lib/wasmedge/` folder (for system install).

<!-- prettier-ignore -->
:::note
AI plugins for WasmEdge, such as the Tensorflow Lite or PyTorch plugins, have additional dependencies on the Tensorflow or PyTorch runtime libraries. See the next section for commands to install plugin dependencies.
:::

To see a list of supported plugins and their specific install commands, [see the next section](#install-wasmedge-plugins-and-dependencies).

### Windows

For `Windows 10`, you could use Windows Package Manager Client (aka `winget.exe`) to install WasmEdge with one single command in your terminal.

```bash
winget install wasmedge
```

To install plugins, you can download plugin binary modules from the WasmEdge release page, unzip them, and then copy them over to `C:\Program Files\WasmEdge\lib`.

### Fedora and Red Hat Linux

WasmEdge now is an official package on Fedora 36, Fedora 37, Fedora 38, Fedora EPEL 8, and Fedora EPEL 9. Check out the stable version [here](https://src.fedoraproject.org/rpms/wasmedge). To install WasmEdge on Fedora, run the following command:

```bash
dnf install wasmedge
```

For more usages, please check out Fedora docs.

To install plugins, you can download plugin binary modules from the WasmEdge release page, unzip them, and then copy them over to `/usr/local/lib\wasmedge\`.

## What's installed

If you installed into the `$HOME/.wasmedge` directory, you will have the following directories and files after installation:

- The `$HOME/.wasmedge/bin` directory contains the WasmEdge Runtime CLI executable files. You can copy and move them around on your file system.
  - The `wasmedge` tool is the standard WasmEdge runtime. You can use it from the CLI.
    - Execute a WASM file: `wasmedge --dir .:. app.wasm`
  - The `wasmedgec` tool is the ahead-of-time (AOT) compiler to compile a `.wasm` file into a native `.so` file (or `.dylib` on MacOS, `.dll` on Windows, or `.wasm` as the universal WASM format on all platforms). The `wasmedge` can then execute the output file.
    - Compile a WASM file into a AOT-compiled WASM: `wasmedgec app.wasm app.so`
    - Execute the WASM in AOT mode: `wasmedge --dir .:. app.so`
- The `$HOME/.wasmedge/lib` directory contains WasmEdge shared libraries, as well as dependency libraries. They are useful for WasmEdge SDKs to launch WasmEdge programs and functions from host applications.
- The `$HOME/.wasmedge/include` directory contains the WasmEdge header files. They are useful for WasmEdge SDKs.

<!-- prettier-ignore -->
:::note
You could also change it to `/usr/local` if you did a system-wide install.
If you used `winget` to install WasmEdge, the files are located at `C:\Program Files\WasmEdge`.
:::

## Install WasmEdge plugins and dependencies

WasmEdge uses plugins to extend its functionality. If you want to use more of WasmEdge's features, you can install WasmEdge along with its plugins and extensions as described below:

### TLS plugin

The WasmEdge TLS plugin utilizes the native OpenSSL library to support HTTPS and TLS requests from WasmEdge sockets. To install the WasmEdge TLS plugin on Linux, run the following commands after you have installed WasmEdge.

```bash
wget https://github.com/second-state/wasmedge_rustls_plugin/releases/download/0.1.0/WasmEdge-plugin-wasmedge_rustls-0.1.0-alpha-ubuntu20.04_x86_64.tar
tar -xf WasmEdge-plugin-wasmedge_rustls-*.tar

# If you only installed WasmEdge for the local user
cp *.so ~/.wasmedge/plugin/

# If you installed Wasmedge at /usr/local for all users
sudo mkdir -p /usr/local/lib/wasmedge/
sudo cp *.so /usr/local/lib/wasmedge/
```

Then, go to [HTTPS request in Rust chapter](../rust/http_service/client) to see how to run HTTPs services with Rust.

### WASI-NN plugin with PyTorch backend

WASI-NN plugin for PyTorch allows WasmEdge applications to perform PyTorch model inference. To use Pytorch, the WasmEdge version should be at least `0.11.2`. To install WasmEdge with PyTorch plugin on Linux, run the following installer command.

```bash
curl -sSf https://raw.githubusercontent.com/WasmEdge/WasmEdge/master/utils/install.sh | bash -s -- --plugins wasi_nn-pytorch
```

Run `source $HOME/.wasmedge/env` to make the installed binary available in the current session.

Now, the WasmEdge PyTorch plugin depends on the PyTorch C library to perform AI/ML computations. You need to install the [PyTorch 1.8.2 LTS](https://pytorch.org/get-started/locally/) dependencies in order for it to work properly.

```bash
export PYTORCH_VERSION="1.8.2"
# For the Ubuntu 20.04 or above, use the libtorch with cxx11 abi.
# export PYTORCH_ABI="libtorch-cxx11-abi"
# For the manylinux2014, please use the without cxx11 abi version:
export PYTORCH_ABI="libtorch"
curl -s -L -O --remote-name-all https://download.pytorch.org/libtorch/lts/1.8/cpu/${PYTORCH_ABI}-shared-with-deps-${PYTORCH_VERSION}%2Bcpu.zip
unzip -q "${PYTORCH_ABI}-shared-with-deps-${PYTORCH_VERSION}%2Bcpu.zip"
rm -f "${PYTORCH_ABI}-shared-with-deps-${PYTORCH_VERSION}%2Bcpu.zip"
export LD_LIBRARY_PATH=${LD_LIBRARY_PATH}:$(pwd)/libtorch/lib
```

<!-- prettier-ignore -->
:::note
The one-liner WasmEdge installer would install the `manylinux2014` version even if you run it on Ubuntu. If you install WasmEdge with the installer, you should get the `manylinux2014` version plug-in and `libtorch`.
:::

Then, go to the [PyTorch in Rust chapter](../rust/ai_inference/pytorch) to see how to run AI inference with Pytorch.

### WASI-NN plugin with TensorFlow Lite

WASI-NN plugin for Tensorflow Lite allows WasmEdge applications to perform Tensorflow Lite model inference. To install WasmEdge with Tensorflow Lite plugin on Linux, run the following installer command.

```bash
VERSION=0.12.1
curl -sSf https://raw.githubusercontent.com/WasmEdge/WasmEdge/master/utils/install.sh | bash -s -- -v $VERSION --plugins wasi_nn-tensorflowlite
```

Run `source $HOME/.wasmedge/env` to make the installed binary available in the current session.

Now, the WasmEdge Tensorflow Lite plugin depends on the Tensorflow Lite C library to perform AI/ML computations. You need to install the TensorFlow-Lite 2.6.0 dependencies.

```bash
VERSION=0.12.1
curl -s -L -O --remote-name-all https://github.com/second-state/WasmEdge-tensorflow-deps/releases/download/$VERSION/WasmEdge-tensorflow-deps-TFLite-$VERSION-manylinux2014_x86_64.tar.gz
tar -zxf WasmEdge-tensorflow-deps-TFLite-$VERSION-manylinux2014_x86_64.tar.gz
rm -f WasmEdge-tensorflow-deps-TFLite-$VERSION-manylinux2014_x86_64.tar.gz
```

The shared library will be extracted in the current directory `./libtensorflowlite_c.so`. You can move the library to the installation path:

```bash
# If you installed wasmedge locally as above
mv libtensorflowlite_c.so ~/.wasmedge/lib

# Or, if you installed wasmedge for all users in /usr/local/
mv libtensorflowlite_c.so /usr/local/lib
```

Or, you can set the environment variable: `export LD_LIBRARY_PATH=$(pwd):${LD_LIBRARY_PATH}`.

<!-- prettier-ignore -->
:::note
The WASI-NN plugin for TensorFlow Lite supports `manylinux2014_x86_64`, `manylinux2014_aarch64` and `android_aarch64`. The version and platform of WasmEdge should be the same as WASI-NN plugin with TensorFlow lite.
:::

Then, go to [TensorFlow-lite in Rust chapter](../rust/ai_inference/tensorflow_lite) to see how to run AI inference with TensorFlow Lite.

### WASI-NN plugin with OpenVINO™ backend

WASI-NN plugin for OpenVINO allows WasmEdge applications to perform OpenVINO model inference. To use OpenVINO, the WasmEdge version should be at least `0.10.1`. To install WasmEdge with OpenVINO plugin on Linux, run the following installer command.

```bash
curl -sSf https://raw.githubusercontent.com/WasmEdge/WasmEdge/master/utils/install.sh | bash -s -- --plugins wasi_nn-openvino
```

Run `source $HOME/.wasmedge/env` to make the installed binary available in the current session.

Now, the WasmEdge OpenVINO plugin depends on the OpenVINO C library to perform AI/ML computations. You need to install the [OpenVINO™](https://docs.openvino.ai/2021.4/openvino_docs_install_guides_installing_openvino_linux.html#)(2021) dependencies. The following instructions are for Ubuntu 20.04 and above.

```bash
export OPENVINO_VERSION="2021.4.582"
export OPENVINO_YEAR="2021"
curl -sSL https://apt.repos.intel.com/openvino/$OPENVINO_YEAR/GPG-PUB-KEY-INTEL-OPENVINO-$OPENVINO_YEAR | sudo gpg --dearmor > /usr/share/keyrings/GPG-PUB-KEY-INTEL-OPENVINO-$OPENVINO_YEAR.gpg
echo "deb [signed-by=/usr/share/keyrings/GPG-PUB-KEY-INTEL-OPENVINO-$OPENVINO_YEAR.gpg] https://apt.repos.intel.com/openvino/$OPENVINO_YEAR all main" | sudo tee /etc/apt/sources.list.d/intel-openvino-$OPENVINO_YEAR.list
sudo apt update
sudo apt install -y intel-openvino-runtime-ubuntu20-$OPENVINO_VERSION
source /opt/intel/openvino_2021/bin/setupvars.sh
ldconfig
```

Then, go to the [OpenVINO in Rust](../rust/ai_inference/openvino) chapter to see how to run AI inference with OpenVINO.

### WASI-Crypto Plugin

[WASI-crypto](https://github.com/WebAssembly/wasi-crypto) is Cryptography API proposals for WASI. To use WASI-Crypto proposal, run the following command line.

```bash
curl -sSf https://raw.githubusercontent.com/WasmEdge/WasmEdge/master/utils/install.sh | bash -s -- --plugins wasi_crypto
```

Run `source $HOME/.wasmedge/env` to make the installed binary available in the current session.

Then, go to [WASI-Crypto in Rust chapter](../rust/wasicrypto) to see how to run WASI crypto functions.

### WasmEdge-Httpsreq plugin

:::caution This is being deprecated. Please install the [TLS plugin](#tls-plugin) instead! :::

The WasmEdge-HttpsReq plugin utilizes the native OpenSSL library to support HTTPS requests from WasmEdge apps. To install the WasmEdge-Httpsreq plugin, run the following command line.

```bash
curl -sSf https://raw.githubusercontent.com/WasmEdge/WasmEdge/master/utils/install.sh | bash -s -- --plugins wasmedge_httpsreq
```

Run `source $HOME/.wasmedge/env` to make the installed binary available in the current session.

Then, go to [HTTPS request in Rust chapter](../rust/http_service/client#synchronous-client-with-http-req) to see how to run HTTPs services with Rust.

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
If a parent folder of the `wasmedge` binary contains `.wasmedge`, the folder will be considered for removal. For example, the script removes the default `$HOME/.wasmedge` folder altogether.
:::

If you used `dnf` to install WasmEdge on Fedora and Red Hat Linux, run the following command to uninstall it:

```bash
dnf remove wasmedge
```

If you used `winget` to install WasmEdge on Windows, run the following command to uninstall it:

```bash
winget uninstall wasmedge
```

## Troubleshooting

Some users, especially in China, reported that they had encountered the Connection refused error when trying to download the `install.sh` from the `githubusercontent.com`.

Please make sure your network connection can access the `github.com` and `githubusercontent.com` via VPN.

```bash
# The error message
curl -sSf https://raw.githubusercontent.com/WasmEdge/WasmEdge/master/utils/install.sh | bash
curl: (7) Failed to connect to raw.githubusercontent.com port 443: Connection refused
```
