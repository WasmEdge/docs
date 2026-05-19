---
sidebar_position: 5
---

# 在 OpenWRT 上建置

請依照本教學從原始碼在 OpenWrt(x86_64) 中建置並測試 WasmEdge。

<!-- prettier-ignore -->
:::note
目前,我們僅支援直譯器模式的執行環境。
:::

## 準備環境

### OpenWrt

首先,我們需要取得 OpenWrt 的原始碼並安裝編譯 OpenWrt 所需的相關工具。下列指令以 Debian / Ubuntu 系統為例。要在其他主機系統安裝 OpenWrt 編譯工具的指令,請參閱 [Building OpenWrt System Settings](https://openwrt.org/docs/guide-developer/toolchain/install-buildsystem)。

```bash
$ git clone https://github.com/openwrt/openwrt
$ sudo apt update
$ sudo apt install build-essential ccache ecj fastjar file g++ gawk \
gettext git java-propose-classpath libelf-dev libncurses5-dev \
libncursesw5-dev libssl-dev python python2.7-dev python3 unzip wget \
python-distutils-extra python3-setuptools python3-dev rsync subversion \
swig time xsltproc zlib1g-dev
```

然後,取得 OpenWrt 所有最新的套件定義並為所有取得的套件安裝符號連結。

```bash
cd openwrt
./scripts/feeds update -a
./scripts/feeds install -a
```

## 建置 WasmEdge

### 取得 WasmEdge 原始碼

```bash
git clone https://github.com/WasmEdge/WasmEdge.git
cd WasmEdge
```

### 執行建置指令稿

執行 WasmEdge 原始碼中的建置指令稿 `build_for_openwrt.sh`,並以 OpenWrt 原始碼的路徑作為參數。此指令稿會自動將 WasmEdge 加入 OpenWrt 將要建置的套件清單中,並建置 OpenWrt 韌體。產生的 OpenWrt 映像檔位於 `openwrt/bin/targets/x86/64` 資料夾中。

```bash
./utils/openwrt/build_for_openwrt.sh ~/openwrt
```

執行建置指令稿時,會出現 OpenWrt 設定介面。在此介面中,我們需要將 `Target System` 設為 x86、`Target Profile` 設為 Generic x86/64,並在 `Runtime` 欄位中找到 `WasmEdge` 並勾選。設定完成後,指令稿會自動建置 WasmEdge 並編譯 OpenWrt 系統。

## 測試

### 在 VMware 中部署 OpenWrt

為了驗證 WasmEdge 的可用性,我們使用 VMware 虛擬機器來安裝編譯後的 OpenWrt 映像檔。在建立虛擬機器之前,我們必須使用 `QEMU` 指令將 OpenWrt 映像檔轉換為 vmdk 格式。

```bash
cd ~/openwrt/bin/targets/x86/64
sudo apt install qemu
gunzip openwrt-x86-64-generic-squashfs-combined.img.gz
qemu-img convert -f raw -O vmdk openwrt-x86-64-generic-squashfs-combined.img Openwrt.vmdk
```

之後,在 VMware 中建立虛擬機器並安裝 OpenWrt 系統。

### 上傳測試檔案

依主機的閘道設定好 OpenWrt 的 IP 位址後,使用 `scp` 將主機上的 wasm 檔案傳輸至 OpenWrt 系統。

例如,我們將 OpenWrt 的 IP 位址設為 192.168.0.111,接著使用下列指令將 [hello.wasm (從此範例編譯而來)](https://github.com/WasmEdge/WasmEdge/tree/master/examples/wasm) 與 [add.wasm (文字格式)](https://raw.githubusercontent.com/WasmEdge/WasmEdge/master/examples/wasm/add.wat) 這兩個測試檔案上傳至 OpenWrt。

```bash
scp hello.wasm root@192.168.0.111:/
scp add.wasm root@192.168.0.111:/
```

### 測試 Wasmedge 程式

```bash
$ wasmedge hello.wasm second state
hello
second
state
$ wasmedge --reactor add.wasm add 2 2
4
```
