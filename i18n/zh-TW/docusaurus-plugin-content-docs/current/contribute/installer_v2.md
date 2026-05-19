---
sidebar_position: 7
---

# 安裝程式 V2 指南

## 概觀

WasmEdge 安裝程式 V2 設計用來安裝核心工具 (`wasmedge`、`wasmedge compile`)、函式庫 (`libwasmedge`),以及 WASI-NN GGML/GGUF 外掛。

## 相依套件

這是純 shell 指令稿實作。唯一的相依套件為下載壓縮檔的 `curl` 或 `wget`,以及用來解壓縮的 `tar`。


## 用法

```bash
curl -sSf https://raw.githubusercontent.com/WasmEdge/WasmEdge/master/utils/install_v2.sh | bash -s -- ${OPTIONS}
```

## 角色

### `install_v2.sh`

安裝程式進入點。

## 選項

### 說明訊息

- 短選項:`-h`
- 完整選項:`--help`
- 描述:顯示說明訊息並結束。

### 詳細模式

- 短選項:`-V`
- 完整選項:`--verbose`
- 描述:啟用詳細除錯訊息

### 指定要安裝的 WasmEdge 版本

- 短選項:`-v VERSION`
- 完整選項:`--version=VERSION`
- 描述:安裝指定 VERSION 的 WasmEdge
- 可用值:VERSION `{{ wasmedge_version }}` 或其他有效的發行版本。
- 注意 - 如果提供無效或不存在的版本,安裝程式會以錯誤結束。

### 安裝路徑

- 短選項:`-p PATH`
- 完整選項:`--path=PATH`
- 描述:將 WasmEdge 安裝到指定 PATH。預設路徑為 `$HOME/.wasmedge`。
- 注意 - 任何非以 `/usr` 開頭的路徑,在安裝程式內部都會被視為非系統路徑。兩者的目錄結構不同。

### 暫存目錄

- 短選項:`-t PATH`
- 完整選項:`--tmpdir=PATH`
- 描述:將壓縮檔下載至指定 PATH。預設路徑為 `/tmp`。
- 注意 - 如果 `/tmp` 目錄不可寫入,安裝程式會以錯誤結束。請使用此選項變更暫存目錄。

### GGML/GGUF 相關選項

#### 安裝 CUDA 版本的 GGUF 外掛

- 短選項:`-c cuda_version`
- 完整選項:`--ggmlcuda=cuda_version[11/12]`
- 描述:安裝指定 CUDA 版本的 GGUF 外掛。例如,`11` 代表 cuda-11,`12` 代表 cuda-12。
- 注意 - 若未指定,安裝程式會嘗試偵測 CUDA 版本。但如果偵測失敗,您可以使用此選項指定版本。

#### 指定要安裝的外掛版本

- 短選項:`-b ggmlversion`
- 完整選項:`--ggmlbn=ggmlversion`
- 描述:安裝指定的 GGUF 外掛。例如,`b2963`。
- 注意 - 當您確切了解您正在做什麼時,才請使用此選項。

### 平台與作業系統

- 短選項:`-o OS`
- 完整選項:`--os=OS`
- 描述:安裝指定 `OS` 版本的 WasmEdge。此值應不區分大小寫以達到最大相容性。
- 可用值 (不區分大小寫):「Linux」、「Darwin」。

### 機器與架構

- 短選項:`-a ARCH`
- 完整選項:`--arch=ARCH`
- 描述:安裝 `ARCH` 版本的 WasmEdge。
- 可用值:「x86\_64」、「aarch64」、「arm64」。

## 行為

- WasmEdge 安裝會將其所安裝的所有檔案附加至安裝程式目錄中名為 `env` 的檔案,路徑為 `$INSTALLATION_PATH/env`。

### Shell 及其設定

- Shell 設定中的 source 字串為 `. $INSTALLATION_PATH/env`,可匯出 WasmEdge 所需的環境變數。
- 若在 shell 設定檔中找不到 source 字串,則會附加上去。
- 目前僅偵測 `Bash` 與 `zsh` shell。
- 如果找到上述 shell,則會更新其各自的設定檔 `$HOME/.bashrc` 與 `$HOME/.zshrc`,在 Linux 情況下還會更新 `$HOME/.zprofile` 與 `$HOME/.bash_profile`。
- 在 `Darwin` 情況下,僅 `$HOME/.zprofile` 會以 source 字串更新。
