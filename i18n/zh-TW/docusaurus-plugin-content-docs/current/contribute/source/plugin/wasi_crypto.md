---
sidebar_position: 1
---

# 建置具有 WASI-Crypto 外掛的版本

WebAssembly System Interface (WASI) Crypto 是一組為 WebAssembly 模組提供加密操作的 API 提案。它旨在跨不同平台提供一致、可攜且安全的加密操作介面。WasmEdge WASI-Crypto 外掛是此提案的實作,為在 WasmEdge 執行環境上執行的 WebAssembly 應用程式提供加密功能。

## 先決條件

目前,WasmEdge 使用 `OpenSSL 1.1` 或 `3.0` 進行 WASI-Crypto 實作。

要在 `Ubuntu 20.04` 上安裝 `OpenSSL 1.1` 開發套件,我們建議使用下列指令:

```bash
sudo apt update
sudo apt install -y libssl-dev
```

對於舊版系統 (例如 `CensOS 7.6`),或者您想從原始碼建置 `OpenSSL 1.1`,您可以參考下列指令:

```bash
# Download and extract the OpenSSL source to the current directory.
curl -s -L -O --remote-name-all https://www.openssl.org/source/openssl-1.1.1n.tar.gz
echo "40dceb51a4f6a5275bde0e6bf20ef4b91bfc32ed57c0552e2e8e15463372b17a openssl-1.1.1n.tar.gz" | sha256sum -c
tar -xf openssl-1.1.1n.tar.gz
cd ./openssl-1.1.1n
# OpenSSL configure need newer perl.
curl -s -L -O --remote-name-all https://www.cpan.org/src/5.0/perl-5.34.0.tar.gz
tar -xf perl-5.34.0.tar.gz
cd perl-5.34.0
mkdir localperl
./Configure -des -Dprefix=$(pwd)/localperl/
make -j
make install
export PATH="$(pwd)/localperl/bin/:$PATH"
cd ..
# Configure by previous perl.
mkdir openssl
./perl-5.34.0/localperl/bin/perl ./config --prefix=$(pwd)/openssl --openssldir=$(pwd)/openssl
make -j
make test
make install
cd ..
# The OpenSSL installation directory is at `$(pwd)/openssl-1.1.1n/openssl`.
# Then you can use the `-DOPENSSL_ROOT_DIR=` option of cmake to assign the directory.
```

對於 MacOS 平台,您應該安裝 `openssl`:

```bash
brew install openssl
```

<!-- prettier-ignore -->
:::note
我們即將更新本章節以使用 `OpenSSL 3.0`。
:::

## 建置具有 WASI-Crypto 外掛的 WasmEdge

要啟用 WasmEdge WASI-Crypto,開發者需要[從原始碼建置 WasmEdge](../os/linux.md) 並加上 cmake 選項 `-DWASMEDGE_PLUGIN_WASI_CRYPTO=ON`。

```bash
cd <path/to/your/wasmedge/source/folder>
# For using self-get OpenSSL, you can assign the cmake option `-DOPENSSL_ROOT_DIR=<path/to/openssl>`.
# On MacOS, it may be: `-DOPENSSL_ROOT_DIR=$(brew --prefix)/opt/openssl`
cmake -GNinja -Bbuild -DCMAKE_BUILD_TYPE=Release -DWASMEDGE_PLUGIN_WASI_CRYPTO=On
cmake --build build
# For the WASI-Crypto plug-in, you should install this project.
cmake --install build
```

<!-- prettier-ignore -->
:::note
如果建置出的 `wasmedge` CLI 工具找不到 WASI-Crypto 外掛,您可以將 `WASMEDGE_PLUGIN_PATH` 環境變數設為外掛安裝路徑 (例如 `/usr/local/lib/wasmedge/`,或建置出的外掛路徑 `build/plugins/wasi_crypto/`) 以嘗試解決此問題。
:::

然後,安裝完成後,您將在 `/usr/local/bin` 下擁有可執行的 `wasmedge` 執行環境,並在 `/usr/local/lib/wasmedge/libwasmedgePluginWasiCrypto.so` 下擁有 WASI-Crypto 外掛。

如需更多資訊,您可以參閱 [GitHub 儲存庫](https://github.com/WasmEdge/WasmEdge/tree/master/plugins/wasi_crypto)。
