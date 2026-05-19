---
sidebar_position: 7
---

# 安裝程式指南

## 概觀

WasmEdge 安裝程式設計用來安裝核心工具 (`wasmedge`、`wasmedge compile`)、函式庫 (`libwasmedge`)、擴充功能 (`wasmedge-tensorflow`),以及外掛 (`wasi-nn`、`wasi-crytpo`)。

## 相依套件

在安裝程式的第一個版本中,WasmEdge 提供純 shell 指令稿的實作。然而,維護不易,且在我們想納入擴充功能與外掛矩陣時並不適合。

為了降低維護成本並提升開發效能,我們決定改用以 python 撰寫且同時相容於 Python 2 與 3 的全新安裝程式。

為了與舊版相容,我們使用相同的進入點 `install.sh`。

## 用法

```bash
curl -sSf https://raw.githubusercontent.com/WasmEdge/WasmEdge/master/utils/install.sh | bash -s -- ${OPTIONS}
```

## 角色

### `install.sh`

安裝程式進入點。

#### 流程

1. 檢查是否已安裝 `git`;否則,以錯誤訊息 `Please install git` 結束。
2. 如果有提供 `PYTHON_EXECUTABLE`,嘗試使用 `$PYTHON_EXECUTABLE` 執行 `install.py`。否則,前往步驟 3。
3. 如果未設定 `PYTHON_EXECUTABLE`,則需要使用 `which` 指令決定 python-X 執行檔。如果找不到,則安裝程式結束,否則進入下一個步驟。
4. 檢查是否已安裝 `python3`。若是,前往步驟 6。否則,前往步驟 5。
5. 檢查是否已安裝 `python2`。若是,前往步驟 6。否則,前往步驟 6。
6. 檢查是否已安裝 `python`。若是,前往步驟 7。否則,以錯誤訊息 `Please install python or provide python path via $PYTHON_EXECUTABLE` 結束。
7. 印出偵測到的 python 版本 `Using Python: $PYTHON_EXECUTABLE`。
8. 使用 `curl` 或 `wget` 下載 `install.py`。如果因網路問題導致 `install.py` 的 URL 無法存取,則以錯誤訊息 `$INSTALL_PY_URL not reachable` 結束。如果 `curl` 與 `wget` 都無法使用,則以錯誤訊息 `curl or wget could not be found` 結束。
9. 以所有收到的引數執行 `install.py`。

### `install.py`

實際處理所有作業的安裝程式。它支援 python2.7 (未在更早版本上測試) 與最新的 python 3.x 版本。

## 選項

### 說明訊息

- 短選項:`-h`
- 完整選項:`--help`
- 描述:顯示此說明訊息並結束。

### 詳細模式

- 短選項:`-D`
- 完整選項:`--debug`
- 描述:啟用詳細除錯訊息

### 指定要安裝的 WasmEdge 版本

- 短選項:`-v VERSION`
- 完整選項:`--version VERSION`
- 描述:安裝指定 VERSION 的 WasmEdge
- 可用值:VERSION `{{ wasmedge_version }}` 或其他有效的發行版本。
- 注意 - 如果提供無效或不存在的版本,安裝程式會以錯誤結束。

### 安裝路徑

- 短選項:`-p PATH`
- 完整選項:`--path PATH`
- 描述:將 WasmEdge 安裝到指定 PATH。預設路徑為 `$HOME/.wasmedge`。
- 注意 - 任何非以 `/usr` 開頭的路徑,在安裝程式內部都會被視為非系統路徑。兩者的目錄結構不同。
- 注意 - 如果路徑不存在,將會建立該資料夾。

### 解除安裝

#### 安裝前執行解除安裝程式

- 短選項:`-r {yes,no}`
- 完整選項:`--remove-old {yes, no}`
- 描述:在安裝前執行解除安裝指令稿。預設為 `yes`。

#### 使用指定版本的解除安裝程式

- 短選項:`-u UNINSTALL_SCRIPT_TAG`
- 完整選項:`--uninstall-script-tag UNINSTALL_SCRIPT_TAG`
- 描述:使用指定的 GitHub 標籤來解除安裝指令稿

### 安裝擴充功能

- 短選項:`-e [EXTENSIONS [EXTENSIONS ...]]`
- 完整選項:`--extension [EXTENSIONS [EXTENSIONS ...]]`
- 描述:安裝 wasmedge-extension 工具。
- 可用值 (區分大小寫):支援的擴充功能 `'tensorflow', 'image', 'all'`。

#### Tensorflow 擴充功能函式庫版本

- 完整選項:`--tf-version TF_VERSION`
- 描述:安裝指定 VERSION 的 Tensorflow 與 Tensorflow lite 擴充功能函式庫。僅在 `Extensions` 設為 `all` 或 `tensorflow` 時可用。
- 注意 - 如果未指定,則與 WasmEdge 版本相同。

#### Tensorflow 擴充功能相依套件版本

- 完整選項:`--tf-deps-version TF_DEPS_VERSION`
- 描述:安裝指定 VERSION 的 Tensorflow 與 Tensorflow lite 擴充功能相依套件。僅在 `Extensions` 設為 `all` 或 `tensorflow` 時可用。
- 注意 - 如果未指定,則與 WasmEdge 版本相同。

#### Tensorflow 擴充功能工具版本

- 完整選項:`--tf-tools-version TF_TOOLS_VERSION`
- 描述:安裝指定 VERSION 的 Tensorflow 與 Tensorflow lite 擴充功能工具。僅在 `Extensions` 設為 `all` 或 `tensorflow` 時可用。
- 注意 - 如果未指定,則與 WasmEdge 版本相同。

#### Image 擴充功能版本

- 完整選項:`--image-version IMAGE_VERSION`
- 描述:安裝指定 VERSION 的 Image 擴充功能。僅在 `Extensions` 設為 `all` 或 `image` 時可用。
- 注意 - 如果未指定,則與 WasmEdge 版本相同。

### 外掛

- 注意 - 目前 `--plugins` 為實驗性選項。

- 完整選項:`--plugins wasi_crypto:0.12.0`

- 注意 - 此引數的格式為 `<plugin_name>:<version_number>`。`<version_number>` 並非必填。例如,`--plugins wasi_crypto` 為有效選項。
- 注意 - `<plugin_name>` 區分大小寫。允許的值請參閱[此處](plugin/intro.md) `Rust Crate` 欄位。其邏輯為發行版本名稱應相同。
- 注意 - 如果未指定,則與 WasmEdge 版本相同。

### DIST

- 完整選項:`--dist ubuntu20.04` 或 `--dist manylinux2014`
- 注意 - `ubuntu20.04` 與 `manylinux2014` 值不區分大小寫,目前僅支援這兩個值。
- 注意 - 為 `Darwin` 指定 `--dist` 值並無作用。
- 注意 - 對於 `Linux` 平台,如果發行版完全符合 `Ubuntu 20.04` (使用 `lsb_release` 與 python 的 `platform.dist()` 功能進行檢查),則未指定時會設為 `ubuntu20.04`,否則會直接使用。然而,WasmEdge 不同的發行套件僅在 `0.11.1` 發行之後才提供,在此之前指定此選項並無作用。

### 平台與作業系統

- 完整選項:`--platform PLATFORM` 或 `--os OS`
- 描述:安裝指定 `PLATFORM` 或 `OS` 版本的 WasmEdge。此值應不區分大小寫以達到最大相容性。
- 可用值 (不區分大小寫):「Linux」、「Darwin」、「Windows」。

### 機器與架構

- 完整選項:`--machine MACHINE` 或 `--arch ARCH`
- 描述:安裝 `MACHINE` 或 `ARCH` 版本的 WasmEdge。
- 可用值:「x86_64」、「aarch64」。

## 行為

- 如果 `$HOME/.wasmedge` (即預設安裝路徑) 存在安裝,無論是否呼叫解除安裝程式,都會被移除。
- WasmEdge 安裝會將其所安裝的所有檔案附加至安裝程式目錄中名為 `env` 的檔案,路徑為 `$INSTALLATION_PATH/env`。

### Shell 及其設定

- Shell 設定中的 source 字串為 `. $INSTALLATION_PATH/env`,可匯出 WasmEdge 所需的環境變數。
- 若在 shell 設定檔中找不到 source 字串,則會附加上去。
- 目前僅偵測 `Bash` 與 `zsh` shell。
- 如果找到上述 shell,則會更新其各自的設定檔 `$HOME/.bashrc` 與 `$HOME/.zshrc`,在 Linux 情況下還會更新 `$HOME/.zprofile` 與 `$HOME/.bash_profile`。
- 在 `Darwin` 情況下,僅 `$HOME/.zprofile` 會以 source 字串更新。
