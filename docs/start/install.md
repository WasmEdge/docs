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

#### Install via Nix

For nix/nixos users, we also provide a `flake.nix` in repository, so you can install WasmEdge via:

```bash
nix profile install github:WasmEdge/WasmEdge
```

#### Install WasmEdge with plug-ins

WasmEdge plug-ins are pre-built native modules that provide additional functionalities to the WasmEdge Runtime. To install plug-ins with the runtime, you can pass the `--plugins` parameter in the installer. For example, the command below installs the `wasi_nn-ggml` plug-in to enable LLM (Large Language Model) inference.

```bash
curl -sSf https://raw.githubusercontent.com/WasmEdge/WasmEdge/master/utils/install.sh | bash -s -- --plugins wasi_nn-ggml
```

To install multiple plug-ins, you can pass a list of plug-ins with the `--plugins` option. For example, the following command installs the `wasi_logging` and the `wasi_nn-ggml` plug-ins. The `wasi_logging` plug-in allows the Rust [log::Log](https://crates.io/crates/log) API to compile into Wasm and run in WasmEdge.

```bash
curl -sSf https://raw.githubusercontent.com/WasmEdge/WasmEdge/master/utils/install.sh | bash -s -- --plugins wasi_logging wasi_nn-ggml
```

The installer downloads the plug-in files from the WasmEdge release on GitHub, unzips them, and then copies them over to the `~/.wasmedge/plugin/` folder (for user install) and to the `/usr/local/lib/wasmedge/` folder (for system install).

<!-- prettier-ignore -->
:::note
The `WASI-NN` related plug-ins are all EXCLUSIVE. Users can only install one of the WASI-NN backends.

After WasmEdge `0.14.1`, the WASI-Logging plug-in is bundled into the WasmEdge shared library and is not necessary to be installed.

Some of plug-ins need dependencies. Please follow the guide in the comment column to install the dependencies.
:::

The following lists are the WasmEdge official released plug-ins. Users can install them easily by the parameters of `--plugins` option of installer.

| Plug-in | Parameter | Supported Platforms | Versions | Comment |
|---------|-----------|---------------------|----------|---------|
| WASI-Logging | `wasi_logging` | All | Since `0.13.0` | Bundled into WasmEdge library since `0.14.1`. |
| WASI-Crypto | `wasi_crypto` | Linux (`x86_64`, `aarch64`), MacOS (`x86_64`, `arm64`) | Since `0.10.1` | |
| WASI-NN OpenVINO backend | `wasi_nn-openvino` | Linux (`x86_64`, Ubuntu only) | Since `0.10.1` | Users should install the [OpenVINO dependency](#openvino-dependencies). |
| WASI-NN PyTorch backend | `wasi_nn-pytorch` | Linux (`x86_64`) | Since `0.11.1` | Users should install the [PyTorch dependency](#pytorch-dependencies). |
| WASI-NN TensorFlow-Lite backend | `wasi_nn-tensorflowlite` | Linux (`x86_64`, `aarch64`), MacOS (`x86_64`, `arm64`) | Since `0.11.2` | [Dependency](#tensorflow-lite-dependencies) installed automatically by installer. |
| WASI-NN GGML backend | `wasi_nn-ggml` | Linux (`x86_64`, `aarch64`), MacOS (`x86_64`, `arm64`) | Since `0.13.4` | [Notes for the dependency](#ggml-dependencies) |
| WASI-NN Piper backend | `wasi_nn-piper` | Linux (`x86_64`, `aarch64`) | Since `0.14.1` | Users should install the [Piper dependency](#piper-dependencies). |
| WASI-NN Whisper backend | `wasi_nn-whisper` | Linux (`x86_64`, `aarch64`), MacOS (`x86_64`, `arm64`) | Since `0.14.1` | |
| WASI-NN Burn.rs backend (Squeezenet) | `wasi_nn_burnrs-squeezenet` | Linux (`x86_64`, Ubuntu only) | Since `0.14.1` | |
| WASI-NN Burn.rs backend (Whisper) | `wasi_nn_burnrs-whisper` | Linux (`x86_64`, Ubuntu only) | Since `0.14.1` | |
| Ffmpeg | `wasmedge_ffmpeg` | Linux (`x86_64`, `aarch64`), MacOS (`x86_64`, `arm64`) | Since `0.14.0` | |
| Image | `wasmedge_image` | Linux (`x86_64`, `aarch64`), MacOS (`x86_64`, `arm64`) | Since `0.13.0` | |
| LLM | `wasmedge_llmc` | Linux (`x86_64`, `aarch64`) | Since `0.14.1` | |
| OpenCV mini | `wasmedge_opencvmini` | Linux (`x86_64`, `aarch64`), MacOS (`x86_64`, `arm64`) | Since `0.13.3` | |
| Process | `wasmedge_process` | Linux (`x86_64`, `aarch64`) | Since `0.10.0` | |
| Stable Diffusion | `wasmedge_stablediffusion` | Linux (`x86_64`, `aarch64`), MacOS (`x86_64`, `arm64`) | Since `0.14.1` | |
| TensorFlow | `wasmedge_tensorflow` | Linux (`x86_64`, `aarch64`), MacOS (`x86_64`, `arm64`) | Since `0.13.0` | [Dependency](#tensorflow-dependencies) installed automatically by installer. |
| TensorFlow-Lite | `wasmedge_tensorflowlite` | Linux (`x86_64`, `aarch64`), MacOS (`x86_64`, `arm64`) | Since `0.13.0` | [Dependency](#tensorflow-lite-dependencies) installed automatically by installer. |
| Zlib | `wasmedge_zlib` | Linux (`x86_64`, `aarch64`), MacOS (`x86_64`, `arm64`) | Since `0.13.5` | |
| WASM-eBPF | `wasm_bpf` | Linux (`x86_64`) | Since `0.13.2` | |
| Rust TLS | `wasmedge_rustls` | Linux (`x86_64`) | Since `0.13.0` | Until `0.13.5`. DEPRECATED. |

For further details of each plug-ins, please follow the [plug-in page](wasmedge/extensions/plugins.md).

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

## Appendix: Installing the Dependencies

### GGML Dependencies

The installer from WasmEdge 0.13.5 will detect CUDA automatically. If CUDA is detected, the installer will always attempt to install a CUDA-enabled version of the WASI-NN GGML plug-in.

If CPU is the only available hardware on your machine, the installer will install OpenBLAS version of plugin instead.

```bash
apt update && apt install -y libopenblas-dev # You may need sudo if the user is not root.
```

### TensorFlow-Lite Dependencies

If you install the WASI-NN TensorflowLite or `WasmEdge-TensorFlowLite` plug-in WITHOUT installer, you can download the shared libraries with the following commands:

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

### OpenVINO Dependencies

The WASI-NN plug-in with OpenVINO backend depends on the OpenVINO C library to perform AI/ML computations. The following commands are for Ubuntu 20.04 and above to install [OpenVINO](https://docs.openvino.ai/2023.0/openvino_docs_install_guides_installing_openvino_apt.html)(2023) dependencies.

```bash
wget https://apt.repos.intel.com/intel-gpg-keys/GPG-PUB-KEY-INTEL-SW-PRODUCTS.PUB
sudo apt-key add GPG-PUB-KEY-INTEL-SW-PRODUCTS.PUB
echo "deb https://apt.repos.intel.com/openvino/2023 ubuntu20 main" | sudo tee /etc/apt/sources.list.d/intel-openvino-2023.list
sudo apt update
sudo apt-get -y install openvino
ldconfig
```

### PyTorch Dependencies

The WASI-NN plug-in with PyTorch backend depends on the `libtorch` C++ library to perform AI/ML computations. You need to install the [PyTorch 1.8.2 LTS](https://pytorch.org/get-started/locally/) dependencies for it to work properly.

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

### Piper Dependencies

The WASI-NN plug-in with Piper backend depends on the ONNX Runtime C++ API. For installation instructions, please refer to the installation table on the [official website](https://onnxruntime.ai/getting-started).

Example of installing ONNX Runtime 1.14.1 on Ubuntu:

```bash
curl -LO https://github.com/microsoft/onnxruntime/releases/download/v1.14.1/onnxruntime-linux-x64-1.14.1.tgz
tar zxf onnxruntime-linux-x64-1.14.1.tgz
mv onnxruntime-linux-x64-1.14.1/include/* /usr/local/include/
mv onnxruntime-linux-x64-1.14.1/lib/* /usr/local/lib/
rm -rf onnxruntime-linux-x64-1.14.1.tgz onnxruntime-linux-x64-1.14.1
ldconfig
```

## Troubleshooting

Some users, especially in China, reported encountering the Connection refused error when trying to download the `install.sh` from the `githubusercontent.com`.

Please make sure your network connection can access `github.com` and `githubusercontent.com` via VPN.

```bash
# The error message
curl -sSf https://raw.githubusercontent.com/WasmEdge/WasmEdge/master/utils/install.sh | bash
curl: (7) Failed to connect to raw.githubusercontent.com port 443: Connection refused
```
