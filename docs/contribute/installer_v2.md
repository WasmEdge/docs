---
sidebar_position: 7
---

# Installer V2 Guide

## Overview

WasmEdge installer V2 is designed for installing the Core Tools (`wasmedge`, `wasmedge compile`), the Libraries (`libwasmedge`),  and the WASI-NN GGML/GGUF Plugin..

## Dependencies

This is a pure shell script implementation. The only dependecies are `curl` or `wget` for downloading the tarballs, and `tar` for extracting them.


## Usage

```bash
curl -sSf https://raw.githubusercontent.com/WasmEdge/WasmEdge/master/utils/install_v2.sh | bash -s -- ${OPTIONS}
```

## Roles

### `install_v2.sh`

The installer entry point.

## Options

### Help Msg

- Short Option: `-h`
- Full Option: `--help`
- Description: Show the help message and exit.

### Verbose

- Short Option: `-V`
- Full Option: `--verbose`
- Description: Enable verbosity debug

### Specify the version of WasmEdge to install

- Short Option: `-v VERSION`
- Full Option: `--version=VERSION`
- Description: Install the given VERSION of WasmEdge
- Available Value: VERSION `{{ wasmedge_version }}` or other valid release versions.
- Note - If supplied an invalid or nonexistent version, the installer exits with an error.

### Installation path

- Short Option: `-p PATH`
- Full Option: `--path=PATH`
- Description: Install WasmEdge into the given PATH. The default Path is `$HOME/.wasmedge`.
- Note - Any paths other than the ones starting with `/usr` are treated as non-system paths in the internals of the installer. The consequences are different directory structures for both.

### Temporary directory

- Short Option: `-t PATH`
- Full Option: `--tmpdir=PATH`
- Description: Download the tarballs into the given PATH. The default Path is `/tmp`.
- Note - If the `/tmp` directory is not writable, the installer exits with an error. Please use this option to change the temporary directory.

### GGML/GGUF related options

#### Install CUDA version of the GGUF plugin

- Short Option: `-c cuda_version`
- Full Option: `--ggmlcuda=cuda_version[11/12]`
- Description: Install the specified CUDA version of the GGUF plugin. E.g. `11` for cuda-11, `12` for cuda-12.
- Note - The installer will try to detect the CUDA version if not specified. However, if the detection failed, you can specify the version using this option.

#### Specify the plugin version to install

- Short Option: `-b ggmlversion`
- Full Option: `--ggmlbn=ggmlversion`
- Description: Install the specified GGUF plugin. E.g. `b2963`.
- Note - Please use this option when you really know what you are doing.

### Platform and OS

- Short Option: `-o OS`
- Full Option: `--os=OS`
- Description: Install the given `OS` version of WasmEdge. This value should be case insensitive to make the maximum compatibility.
- Available Value (case insensitive): "Linux", "Darwin".

### Machine and Arch

- Short Option: `-a ARCH`
- Full Option: `--arch=ARCH`
- Description: Install the `ARCH` version of WasmEdge.
- Available Value: "x86\_64", "aarch64", "arm64".

## Behavior

- WasmEdge installation appends all the files it installs to a file which is located in the installer directory named `env` with its path as `$INSTALLATION_PATH/env`.

### Shell and it's configuration

- Source string in shell configuration is given as `. $INSTALLATION_PATH/env` so that it exports the necessary environment variables for WasmEdge.
- Shell configuration file is appended with source string if it cannot find the source string in that file.
- Currently, it detects only `Bash` and `zsh` shells.
- If the above shells are found, then their respective configuration files `$HOME/.bashrc` and `$HOME/.zshrc` are updated along with `$HOME/.zprofile` and `$HOME/.bash_profile` in the case of Linux.
- In the case of `Darwin`, only `$HOME/.zprofile` is updated with the source string.
