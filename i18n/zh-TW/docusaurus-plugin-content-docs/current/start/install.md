---
sidebar_position: 2
---

# 安裝與解除安裝 WasmEdge

本章將討論如何在各種作業系統與平台上安裝及解除安裝 WasmEdge Runtime。我們也會說明如何為 WasmEdge 安裝外掛。

<!-- prettier-ignore -->
:::note
Docker Desktop 4.15 以上版本已將 WasmEdge 內建於其發行二進位檔中。如果您使用 Docker Desktop,則不需要另外安裝 WasmEdge。請參考 [如何在 Docker Desktop 中執行 WasmEdge 應用程式。](build-and-run/docker_wasm.md)
:::

## 安裝

您可以在任何一般的 Linux 與 MacOS 平台上安裝 WasmEdge Runtime。如果您使用 Windows 10 或 Fedora / Red Hat Linux 系統,可以透過其預設的套件管理員來安裝。

### 一般 Linux 與 MacOS

安裝 WasmEdge 最簡單的方式是執行以下指令。您的系統需要先安裝 `git` 與 `curl` 作為先決條件。

```bash
curl -sSf https://raw.githubusercontent.com/WasmEdge/WasmEdge/master/utils/install.sh | bash
```

執行以下指令讓已安裝的二進位檔在目前的 shell session 中可用。

```bash
source $HOME/.wasmedge/env
```

#### 為所有使用者安裝

WasmEdge 預設安裝在 `$HOME/.wasmedge` 目錄中。您可以將它安裝到系統目錄(例如 `/usr/local`),讓所有使用者都能使用。若要指定安裝目錄,請執行 `install.sh` 腳本時加上 `-p` 旗標。由於這些指令會寫入系統目錄,您需要以 `root` 使用者或 `sudo` 來執行。

```bash
curl -sSf https://raw.githubusercontent.com/WasmEdge/WasmEdge/master/utils/install.sh | bash -s -- -p /usr/local
```

#### 安裝特定版本的 WasmEdge

WasmEdge 安裝腳本預設會安裝最新的官方正式版本。您可以透過傳遞 `-v` 參數給安裝腳本來安裝特定版本的 WasmEdge,包括預發行版本或舊版本。以下是範例。

```bash
VERSION={{ wasmedge_version }}
curl -sSf https://raw.githubusercontent.com/WasmEdge/WasmEdge/master/utils/install.sh | bash -s -- -v $VERSION
```

如果您對 `master` 分支 `HEAD` 上的最新建置(也就是 WasmEdge 的每日建置)有興趣,可以直接從我們的 GitHub Action CI artifact 下載發行套件。[這是一個範例](https://github.com/WasmEdge/WasmEdge/actions/runs/2969775464#artifacts)。

#### 透過 Nix 安裝

對於 nix/nixos 使用者,我們也在儲存庫中提供 `flake.nix`,因此您可以透過以下方式安裝 WasmEdge:

```bash
nix profile install github:WasmEdge/WasmEdge
```

#### 安裝 WasmEdge 與外掛

WasmEdge 外掛是預先建置的原生模組,能為 WasmEdge Runtime 提供額外功能。若要在安裝執行環境時一併安裝外掛,可以在安裝程式中傳遞 `--plugins` 參數。例如,以下指令會安裝 `wasi_nn-ggml` 外掛以啟用 LLM (大型語言模型) 推論。

```bash
curl -sSf https://raw.githubusercontent.com/WasmEdge/WasmEdge/master/utils/install.sh | bash -s -- --plugins wasi_nn-ggml
```

若要安裝多個外掛,可以將外掛清單透過 `--plugins` 選項傳遞。例如,以下指令會安裝 `wasi_logging` 與 `wasi_nn-ggml` 外掛。`wasi_logging` 外掛讓 Rust 的 [log::Log](https://crates.io/crates/log) API 可以編譯成 Wasm 並在 WasmEdge 中執行。

```bash
curl -sSf https://raw.githubusercontent.com/WasmEdge/WasmEdge/master/utils/install.sh | bash -s -- --plugins wasi_logging wasi_nn-ggml
```

安裝程式會從 GitHub 上的 WasmEdge 發行版下載外掛檔案、解壓縮,然後複製到 `~/.wasmedge/plugin/` 資料夾(對於使用者安裝)以及 `/usr/local/lib/wasmedge/` 資料夾(對於系統安裝)。

<!-- prettier-ignore -->
:::note
`WASI-NN` 相關外掛都是互斥的。使用者只能安裝其中一種 WASI-NN 後端。

在 WasmEdge `0.14.1` 之後,WASI-Logging 外掛已內建於 WasmEdge 共用函式庫中,不需要額外安裝。

部分外掛需要相依套件。請依照備註欄中的指引安裝相依套件。
:::

以下清單為 WasmEdge 官方發行的外掛。使用者可以透過安裝程式的 `--plugins` 選項參數輕鬆安裝。

| 外掛 | 參數 | 支援平台 | 版本 | 備註 |
|---------|-----------|---------------------|----------|---------|
| WASI-Logging | `wasi_logging` | 全部 | 自 `0.13.0` 起 | 自 `0.14.1` 起內建於 WasmEdge 函式庫。 |
| WASI-Crypto | `wasi_crypto` | Linux (`x86_64`, `aarch64`)、MacOS (`x86_64`, `arm64`) | 自 `0.10.1` 起 | |
| WASI-NN OpenVINO 後端 | `wasi_nn-openvino` | Linux (`x86_64`,僅限 Ubuntu) | 自 `0.10.1` 起 | 使用者應安裝 [OpenVINO 相依套件](#openvino-dependencies)。 |
| WASI-NN PyTorch 後端 | `wasi_nn-pytorch` | Linux (`x86_64`) | 自 `0.11.1` 起 | 使用者應安裝 [PyTorch 相依套件](#pytorch-dependencies)。 |
| WASI-NN TensorFlow-Lite 後端 | `wasi_nn-tensorflowlite` | Linux (`x86_64`, `aarch64`)、MacOS (`x86_64`, `arm64`) | 自 `0.11.2` 起 | [相依套件](#tensorflow-lite-dependencies) 由安裝程式自動安裝。 |
| WASI-NN GGML 後端 | `wasi_nn-ggml` | Linux (`x86_64`, `aarch64`)、MacOS (`x86_64`, `arm64`) | 自 `0.13.4` 起 | [相依套件注意事項](#ggml-dependencies) |
| WASI-NN Piper 後端 | `wasi_nn-piper` | Linux (`x86_64`, `aarch64`) | 自 `0.14.1` 起 | 使用者應安裝 [Piper 相依套件](#piper-dependencies)。 |
| WASI-NN Whisper 後端 | `wasi_nn-whisper` | Linux (`x86_64`, `aarch64`)、MacOS (`x86_64`, `arm64`) | 自 `0.14.1` 起 | |
| WASI-NN Burn.rs 後端 (Squeezenet) | `wasi_nn_burnrs-squeezenet` | Linux (`x86_64`,僅限 Ubuntu) | 自 `0.14.1` 起 | |
| WASI-NN Burn.rs 後端 (Whisper) | `wasi_nn_burnrs-whisper` | Linux (`x86_64`,僅限 Ubuntu) | 自 `0.14.1` 起 | |
| Ffmpeg | `wasmedge_ffmpeg` | Linux (`x86_64`, `aarch64`)、MacOS (`x86_64`, `arm64`) | 自 `0.14.0` 起 | |
| Image | `wasmedge_image` | Linux (`x86_64`, `aarch64`)、MacOS (`x86_64`, `arm64`) | 自 `0.13.0` 起 | |
| LLM | `wasmedge_llmc` | Linux (`x86_64`, `aarch64`) | 自 `0.14.1` 起 | |
| OpenCV mini | `wasmedge_opencvmini` | Linux (`x86_64`, `aarch64`)、MacOS (`x86_64`, `arm64`) | 自 `0.13.3` 起 | |
| Process | `wasmedge_process` | Linux (`x86_64`, `aarch64`) | 自 `0.10.0` 起 | |
| Stable Diffusion | `wasmedge_stablediffusion` | Linux (`x86_64`, `aarch64`)、MacOS (`x86_64`, `arm64`) | 自 `0.14.1` 起 | |
| TensorFlow | `wasmedge_tensorflow` | Linux (`x86_64`, `aarch64`)、MacOS (`x86_64`, `arm64`) | 自 `0.13.0` 起 | [相依套件](#tensorflow-dependencies) 由安裝程式自動安裝。 |
| TensorFlow-Lite | `wasmedge_tensorflowlite` | Linux (`x86_64`, `aarch64`)、MacOS (`x86_64`, `arm64`) | 自 `0.13.0` 起 | [相依套件](#tensorflow-lite-dependencies) 由安裝程式自動安裝。 |
| Zlib | `wasmedge_zlib` | Linux (`x86_64`, `aarch64`)、MacOS (`x86_64`, `arm64`) | 自 `0.13.5` 起 | |
| WASM-eBPF | `wasm_bpf` | Linux (`x86_64`) | 自 `0.13.2` 起 | |
| Rust TLS | `wasmedge_rustls` | Linux (`x86_64`) | 自 `0.13.0` 起 | 至 `0.13.5`。已淘汰。 |

關於每個外掛的詳細資訊,請參考 [外掛頁面](wasmedge/extensions/plugins.md)。

### Windows

對於 `Windows 10`,您可以使用 Windows 套件管理員用戶端 (即 `winget.exe`),在終端機中以一行指令安裝 WasmEdge。

```bash
winget install wasmedge
```

若要安裝外掛,您可以從 WasmEdge 發行頁面下載外掛二進位模組,解壓縮後複製到 `C:\Program Files\WasmEdge\lib`。

### Fedora 與 Red Hat Linux

WasmEdge 現在是 Fedora 36、Fedora 37、Fedora 38、Fedora EPEL 8 與 Fedora EPEL 9 的官方套件。請參考 [此處](https://src.fedoraproject.org/rpms/wasmedge) 的穩定版本。若要在 Fedora 上安裝 WasmEdge,請執行以下指令:

```bash
dnf install wasmedge
```

更多用法請參考 Fedora 文件。

若要安裝外掛,您可以從 WasmEdge 發行頁面下載外掛二進位模組,解壓縮後複製到 `/usr/local/lib/wasmedge/`。

## 安裝了哪些內容

如果您安裝到 `$HOME/.wasmedge` 目錄,安裝後會有以下目錄與檔案:

- `$HOME/.wasmedge/bin` 目錄包含 WasmEdge Runtime CLI 執行檔。您可以在檔案系統中自由複製與移動。

  - `wasmedge` 工具是標準的 WasmEdge 執行環境。您可以從 CLI 使用它。
    - 執行 WASM 檔案:`wasmedge --dir .:. app.wasm`
  - `wasmedgec` 工具是預先編譯 (AOT) 編譯器,可將 `.wasm` 檔案編譯為原生的 `.so` 檔案(MacOS 上是 `.dylib`、Windows 上是 `.dll`,或在所有平台上的通用 WASM 格式 `.wasm`)。接著可以由 `wasmedge` 執行輸出檔案。

    - 將 WASM 檔案編譯為 AOT 編譯後的 WASM:`wasmedgec app.wasm app.so`
    - 以 AOT 模式執行 WASM:`wasmedge --dir .:. app.so`

    <!-- prettier-ignore -->
    :::note
    `wasmedgec` 的用法等同於 `wasmedge compile`。我們決定在未來淘汰 `wasmedgec`。
    :::

- `$HOME/.wasmedge/lib` 目錄包含 WasmEdge 共用函式庫與相依函式庫。它們對於 WasmEdge SDK 從主機應用程式啟動 WasmEdge 程式與函式很有用。
- `$HOME/.wasmedge/include` 目錄包含 WasmEdge 標頭檔。它們對 WasmEdge SDK 很有用。
- `$HOME/.wasmedge/plugin` 目錄包含 WasmEdge 外掛。它們是 WasmEdge SDK 可載入的擴充功能,並會在執行 WasmEdge CLI 時自動載入。

<!-- prettier-ignore -->
:::note
如果您執行的是全系統安裝,也可以改為 `/usr/local`。
如果您使用 `winget` 安裝 WasmEdge,檔案位於 `C:\Program Files\WasmEdge`。
:::

## 解除安裝

若要解除安裝 WasmEdge,可以執行以下指令:

```bash
bash <(curl -sSf https://raw.githubusercontent.com/WasmEdge/WasmEdge/master/utils/uninstall.sh)
```

如果 `wasmedge` 二進位檔不在 `PATH` 中,且未安裝在預設的 `$HOME/.wasmedge` 資料夾中,則必須提供安裝路徑。

```bash
bash <(curl -sSf https://raw.githubusercontent.com/WasmEdge/WasmEdge/master/utils/uninstall.sh) -p /path/to/parent/folder
```

如果您希望以非互動模式解除安裝,可以傳遞 `--quick` 或 `-q` 旗標。

```bash
bash <(curl -sSf https://raw.githubusercontent.com/WasmEdge/WasmEdge/master/utils/uninstall.sh) -q
```

<!-- prettier-ignore -->
:::note
如果 `wasmedge` 二進位檔的父資料夾包含 `.wasmedge`,該資料夾會被視為要移除的目標。例如,腳本會整個移除預設的 `$HOME/.wasmedge` 資料夾。
:::

如果您在 Fedora 與 Red Hat Linux 上使用 `dnf` 安裝 WasmEdge,請執行以下指令解除安裝:

```bash
dnf remove wasmedge
```

如果您在 Windows 上使用 `winget` 安裝 WasmEdge,請執行以下指令解除安裝:

```bash
winget uninstall wasmedge
```

## 附錄:安裝相依套件

### GGML 相依套件

從 WasmEdge 0.13.5 起,安裝程式會自動偵測 CUDA。如果偵測到 CUDA,安裝程式會嘗試安裝啟用 CUDA 的 WASI-NN GGML 外掛版本。

如果您的機器上只有 CPU,安裝程式會改為安裝純 CPU 版本的外掛。

```bash
apt update && apt install -y libopenblas-dev # You may need sudo if the user is not root.
```

### TensorFlow-Lite 相依套件

如果您安裝 WASI-NN TensorflowLite 或 `WasmEdge-TensorFlowLite` 外掛時「未透過」安裝程式,可以使用以下指令下載共用函式庫:

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

共用函式庫會被解壓縮到目前目錄,檔名為 `./libtensorflowlite_c.so`(MacOS 上為 `.dylib`)以及 `./libtensorflowlite_flex.so`(`WasmEdge 0.13.0` 版本之後)。您可以將函式庫移到安裝路徑:

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

### TensorFlow 相依套件

如果您安裝 `WasmEdge-Tensorflow` 外掛時「未透過」安裝程式,可以使用以下指令下載共用函式庫:

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

共用函式庫會被解壓縮到目前目錄,在 `Linux` 平台上為 `./libtensorflow_cc.so.2.12.0` 與 `./libtensorflow_framework.so.2.12.0`,在 `MacOS` 平台上為 `./libtensorflow_cc.2.12.0.dylib` 與 `./libtensorflow_framework.2.12.0.dylib`。您可以將函式庫移到安裝路徑:

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

### OpenVINO 相依套件

採用 OpenVINO 後端的 WASI-NN 外掛相依於 OpenVINO C 函式庫來執行 AI/ML 運算。以下指令適用於 Ubuntu 20.04 及以上版本,用來安裝 [OpenVINO](https://docs.openvino.ai/2023.0/openvino_docs_install_guides_installing_openvino_apt.html)(2023)相依套件。

```bash
wget https://apt.repos.intel.com/intel-gpg-keys/GPG-PUB-KEY-INTEL-SW-PRODUCTS.PUB
sudo apt-key add GPG-PUB-KEY-INTEL-SW-PRODUCTS.PUB
echo "deb https://apt.repos.intel.com/openvino/2023 ubuntu20 main" | sudo tee /etc/apt/sources.list.d/intel-openvino-2023.list
sudo apt update
sudo apt-get -y install openvino
ldconfig
```

### PyTorch 相依套件

採用 PyTorch 後端的 WASI-NN 外掛相依於 `libtorch` C++ 函式庫來執行 AI/ML 運算。您需要安裝 [PyTorch 1.8.2 LTS](https://pytorch.org/get-started/locally/) 相依套件,以便正常運作。

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
對於 `Ubuntu 20.04` 或以上版本,WasmEdge 安裝程式會安裝 `Ubuntu` 版本的 WasmEdge 及其外掛。
對於其他系統,WasmEdge 安裝程式會安裝 `manylinux2014` 版本,您應該取得不含 `cxx11-abi` 的 `libtorch`。
:::

### Piper 相依套件

採用 Piper 後端的 WASI-NN 外掛相依於 ONNX Runtime C++ API。安裝說明請參考 [官方網站](https://onnxruntime.ai/getting-started) 的安裝對照表。

在 Ubuntu 上安裝 ONNX Runtime 1.14.1 的範例:

```bash
curl -LO https://github.com/microsoft/onnxruntime/releases/download/v1.14.1/onnxruntime-linux-x64-1.14.1.tgz
tar zxf onnxruntime-linux-x64-1.14.1.tgz
mv onnxruntime-linux-x64-1.14.1/include/* /usr/local/include/
mv onnxruntime-linux-x64-1.14.1/lib/* /usr/local/lib/
rm -rf onnxruntime-linux-x64-1.14.1.tgz onnxruntime-linux-x64-1.14.1
ldconfig
```

## 疑難排解

部分使用者(尤其在中國)回報嘗試從 `githubusercontent.com` 下載 `install.sh` 時遇到 Connection refused 錯誤。

請確認您的網路連線能透過 VPN 存取 `github.com` 與 `githubusercontent.com`。

```bash
# The error message
curl -sSf https://raw.githubusercontent.com/WasmEdge/WasmEdge/master/utils/install.sh | bash
curl: (7) Failed to connect to raw.githubusercontent.com port 443: Connection refused
```
