---
sidebar_position: 3
---

# Podman

## Fedora 平台

Fedora 是執行帶有容器的 WASM 應用程式最容易的平台,因為 crun 的 fedora 套件已將 WasmEdge 作為預設執行環境支援。我們無須做任何變更即可在 fedora 平台上執行 WasmEdge 應用程式。若你使用其他 Linux 發行版,請前往[下一節](#其他-linux-發行版)。

### 安裝 podman 與 WasmEdge

```bash
sudo dnf -y install podman
sudo dnf -y install wasmedge
```

### 在 Fedora 上執行一個簡單的 WASI 應用程式

現在,我們可以執行 wasm 應用程式。

```bash
podman run --rm --annotation module.wasm.image/variant=compat-smart docker.io/wasmedge/example-wasi:latest /wasi_example_main.wasm 50000000
```

就是這樣。

## 其他 Linux 發行版

### 必備條件

1. 安裝並設定 Podman

   使用下列命令在你的系統上安裝 podman。這裡以 Ubuntu 為例。其他類型的 podman,請參閱 [Podman 的安裝說明](https://podman.io/getting-started/installation)。

   ```bash
   sudo apt-get -y update
   sudo apt-get -y install podman
   ```

2. [安裝 WasmEdge](../../start/install.md#install)

3. 建置並設定具備 WasmEdge 支援的 crun

   接下來,設定並建置具備 WasmEdge 支援的 `crun` 二進位檔。

   ```bash
   git clone https://github.com/containers/crun
   cd crun
   ./autogen.sh
   ./configure --with-wasmedge
   make
   sudo make install
   # 取代 crun(請小心,你可能會想先備份)
   mv crun $(which crun)
   ```

   接著,你可以使用 `crun -v` 確認 crun 是否安裝成功。

   ```bash
   crun --version
   # 輸出
   crun version 1.7.2.0.0.0.26-51af
   commit: 51af1448f60b69326cf26e726e14b38fcb253943
   rundir: /run/user/0/crun
   spec: 1.0.0
   +SYSTEMD +SELINUX +APPARMOR +CAP +SECCOMP +EBPF +WASM:wasmedge +YAJL
   ```

### 執行一個簡單的 WASI 應用程式

現在,我們可以執行 wasm 應用程式。

```bash
podman run --rm --annotation module.wasm.image/variant=compat-smart docker.io/wasmedge/example-wasi:latest /wasi_example_main.wasm 50000000
```

如需更多資訊,可以參考 [crun](../deploy/oci-runtime/crun) 章節。

有個很棒的開源專案來自名為 [Kwasm](https://github.com/KWasm/podman-wasm) 的社群,介紹 podman 與 WASM。趕快去看看吧!
