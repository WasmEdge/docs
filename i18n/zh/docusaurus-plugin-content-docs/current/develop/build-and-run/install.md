---
sidebar_position: 1
---

# Install and uninstall WasmEdge

In this chapter, we will discuss ways to install and uninstall the WasmEdge Runtime on various OSes and platforms.
We will cover how to install plugins to WasmEdge.

:::note
Docker Desktop 4.15+ already have WasmEdge bundled in its distribution binary. If you use Docker Desktop, you will not need to install WasmEdge separately. [Check out how to run WasmEdge apps in Docker Desktop.](docker_wasm)
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

#### Install the Specific Version of WasmEdge

The WasmEdge installer script will install the latest official release by default.
You could install the specific version of WasmEdge, including pre-releases or old releases by passing the `-v` argument to the installer script. Here is an example.

```bash
curl -sSf https://raw.githubusercontent.com/WasmEdge/WasmEdge/master/utils/install.sh | bash -s -- -e all -v {{ wasmedge_version }}
```

If you are interested in the latest builds from the `HEAD` of the `master` branch, which is basically WasmEdge's nightly builds, you can download the release package directly from our Github Action's CI artifact. [Here is an example](https://github.com/WasmEdge/WasmEdge/actions/runs/2969775464#artifacts).

### Windows

For `Windows 10`, you could use Windows Package Manager Client (aka `winget.exe`) to install WasmEdge with one single command in your terminal.

```bash
winget install wasmedge
```

### Fedora and Red Hat Linux

WasmEdge now is an official package on Fedora 36, Fedora 37, Fedora 38, Fedora EPEL 8, and Fedora EPEL 9. Check out the stable version [here](https://src.fedoraproject.org/rpms/wasmedge).

To install WasmEdge on Fedora, using the following command line. For more usages, please check out Fedora docs. 

```bash
dnf install wasmedge
```

## What's installed

After installation, you have the following directories and files. Here we assume that you installed into the `$HOME/.wasmedge` directory. You could also change it to `/usr/local` if you did a system-wide install.
If you used `winget` to install WasmEdge, the files are located at `C:\Program Files\WasmEdge`.

* The `$HOME/.wasmedge/bin` directory contains the WasmEdge Runtime CLI executable files. You can copy and move them around on your file system.
  * The `wasmedge` tool is the standard WasmEdge runtime. You can use it from the CLI.
    * Execute a WASM file: `wasmedge --dir .:. app.wasm`
  * The `wasmedgec` tool is the ahead-of-time (AOT) compiler to compile a `.wasm` file into a native `.so` file (or `.dylib` on MacOS, `.dll` on Windows, or `.wasm` as the universal WASM format on all platforms). The `wasmedge` can then execute the output file.
    * Compile a WASM file into a AOT-compiled WASM: `wasmedgec app.wasm app.so`
    * Execute the WASM in AOT mode: `wasmedge --dir .:. app.so`
* The `$HOME/.wasmedge/lib` directory contains WasmEdge shared libraries, as well as dependency libraries. They are useful for WasmEdge SDKs to launch WasmEdge programs and functions from host applications.
* The `$HOME/.wasmedge/include` directory contains the WasmEdge header files. They are useful for WasmEdge SDKs.

## Install WasmEdge and its plugins and extensions

WasmEdge uses plugin to extend WasmEdge. If want to use WasmEdge's more features, let's see how to install WasmEdge and its plugin and extensions.

### TensorFlow and Image Processing Extension

If you would like to install WasmEdge with its [Tensorflow and image processing extensions](https://www.secondstate.io/articles/wasi-tensorflow/), please run the following command. It will install WasmEdge with the `tensorflow` and `image` extensions on your system. For the usage of those two extensions, please refer to [TensorFlow Inference in Rust](../rust/ai_inference/tensorflow) chapter.

```bash
curl -sSf https://raw.githubusercontent.com/WasmEdge/WasmEdge/master/utils/install.sh | bash -s -- -e all
```

Next, run `source $HOME/.wasmedge/env` to make the installed binary available in the current session.

Then, go to [TensorFlow-lite in Rust chapter](../rust/ai_inference/tensorflow) to see how to run AI inference with TensorFlow Lite.

### WasmEdge-Httpsreq plugin
In order to achieve the goal of supporting HTTPS requests, we now create a WasmEdge-HttpsReq plug-in using the OpenSSL library. To install the WasmEdge-Httpsreq plugin, run the following command line.

```bash
curl -sSf https://raw.githubusercontent.com/WasmEdge/WasmEdge/master/utils/install.sh | bash -s -- -v 0.11.2 --plugins wasmedge_httpsreq
```
Next, run `source $HOME/.wasmedge/env` to make the installed binary available in the current session.

Then, go to [HTTPS request in Rust chapter](../rust/https-service to see how to run HTTPs services with Rust.

### WASI-NN plugin with OpenVINO™ backend

WASI-NN plugin is WasmEdge's implementation of the WASI-NN proposal.

Note, to use the WASI-NN plugin for WasmEdge, your OS should be at least `Ubuntu 20.04`. The WasmEdge version should be at least `wasmedge 0.10.1`.

First, install the [OpenVINO™](https://docs.openvino.ai/2021.4/openvino_docs_install_guides_installing_openvino_linux.html#)(2021) dependency.

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

And then get WasmEdge and the WASI-NN plug-in with OpenVINO backend. The version of WasmEdge should be the same as wasi-nn-openvio version.


```bash
curl -sSf https://raw.githubusercontent.com/WasmEdge/WasmEdge/master/utils/install.sh | bash -s -- -v 0.11.2 --plugins wasi_nn-openvino
```
Next, run `source $HOME/.wasmedge/env` to make the installed binary available in the current session.

Then, go to the [OpenVINO in Rust](../rust/ai_inference/openvino) chapter to see how to run AI inference with OpenVINO.

### WASI-NN plugin with Pytorch backend

Note, to use Pytorch, the WasmEdge version should be at least `0.11.2`. The WASI-NN plugin for Pytorch supports both `manylinux2014` and `ubuntu20.04`.

:::note
The one-liner WasmEdge installer would install the `manylinux2014` version for Ubuntu. If you install WasmEdge with the installer or for the `manylinux2014` version, you should get the `manylinux2014` version plug-in and `libtorch`.
:::

First, install the  [PyTorch 1.8.2 LTS](https://pytorch.org/get-started/locally/) dependency:

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

And then get the WasmEdge and the WASI-NN plug-in with PyTorch backend. The version and platform of WasmEdge should be the same as `wasi-nn-pytorch`.

Let's take `ubuntu20.04` as an example.

```bash
curl -sSf https://raw.githubusercontent.com/WasmEdge/WasmEdge/master/utils/install.sh | bash -s -- -v 0.11.2 --plugins wasi_nn-pytorch
```
Next, run `source $HOME/.wasmedge/env` to make the installed binary available in the current session.

Then, go to the [Pytorch in Rust chapter](../rust/ai_inference/pytorch) to see how to run AI inference with Pytorch.

> Note: Please check that the Ubuntu version of WasmEdge and plug-in should use the cxx11-abi version of PyTorch, and the manylinux2014 version of WasmEdge and plug-in should use the PyTorch without cxx11-abi.

### WASI-NN plugin with TensorFlow Lite

The WASI-NN plugin for TensorFlow Lite supports both `manylinux2014`,`ubuntu20.04`, `android_aarch64`, and `manylinux2014_aarch64`. The version and platform of WasmEdge should be the same as WASI-NN plugin with TensorFlow lite.

First, install the TensorFlow-Lite 2.6.0 dependency:

```bash
curl -s -L -O --remote-name-all https://github.com/second-state/WasmEdge-tensorflow-deps/releases/download/0.11.2/WasmEdge-tensorflow-deps-TFLite-0.11.2-manylinux2014_x86_64.tar.gz
tar -zxf WasmEdge-tensorflow-deps-TFLite-0.11.2-manylinux2014_x86_64.tar.gz
rm -f WasmEdge-tensorflow-deps-TFLite-0.11.2-manylinux2014_x86_64.tar.gz
```

The shared library will be extracted in the current directory `./libtensorflowlite_c.so`.

Then you can move the library to the installation path:

```bash
mv libtensorflowlite_c.so /usr/local/lib
```

Or set the environment variable `export LD_LIBRARY_PATH=$(pwd):${LD_LIBRARY_PATH}`.

Get the WasmEdge and the WASI-NN plug-in with TensorFlow-Lite backend:

```bash
curl -sSf https://raw.githubusercontent.com/WasmEdge/WasmEdge/master/utils/install.sh | bash -s -- -v 0.11.2 --plugins wasi_nn-tensorflowlite
```
Next, run `source $HOME/.wasmedge/env` to make the installed binary available in the current session.

Then, go to [TensorFlow-lite in Rust chapter](../rust/ai_inference/tensorflow_lite) to see how to run AI inference with TensorFlow Lite.


### WASI-Crypto Plugin

[WASI-crypto](https://github.com/WebAssembly/wasi-crypto) is Cryptography API proposals for WASI. To use WASI-Crypto proposal, run the following command line.

```bash
curl -sSf https://raw.githubusercontent.com/WasmEdge/WasmEdge/master/utils/install.sh | bash -s -- -v 0.11.2 --plugins wasi_crypto
```
Next, run `source $HOME/.wasmedge/env` to make the installed binary available in the current session.

Then, go to [WASI-Crypto in Rust chapter](../rust/wasicrypto.md) to see how to run WASI crypto functions.

## Uninstall

To uninstall WasmEdge, you can run the following command.

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

:::note
If a parent folder of the `wasmedge` binary contains `.wasmedge`, the folder will be considered for removal. For example, the script removes the default `$HOME/.wasmedge` folder altogether.
:::

If you used `dnf` to install WasmEdge on Fedora and Red Hat Linux, run the following command to uninstall it.

```bash
dnf remove wasmedge
```

If you used `winget` to install WasmEdge on Windows, run the following command to uninstall it.

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
