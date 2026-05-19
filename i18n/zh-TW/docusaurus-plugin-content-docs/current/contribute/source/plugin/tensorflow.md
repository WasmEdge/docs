---
sidebar_position: 5
---

# 建置具有 WasmEdge-Tensorflow 外掛的 WasmEdge

WasmEdge-TensorFlow 外掛是擴充 WasmEdge 執行環境功能的軟體元件。它允許開發者以類似 Python 的 API 執行 TensorFlow 模型推論。此外掛專為 Rust 編譯成 WebAssembly 的應用程式設計,且其運作仰賴 TensorFlow C 函式庫。

## 先決條件

WasmEdge-Tensorflow 外掛的先決條件與 [Linux 平台](../os/linux.md) 或 [MacOS 平台](../os/macos.md) 上的 WasmEdge 建置環境相同。

## 建置具有 WasmEdge-Tensorflow 外掛的 WasmEdge

要啟用 WasmEdge WasmEdge-Tensorflow,開發者需要[從原始碼建置 WasmEdge](../build_from_src.md) 並加上 cmake 選項 `-DWASMEDGE_PLUGIN_TENSORFLOW=On`。

```bash
cd <path/to/your/wasmedge/source/folder>
cmake -GNinja -Bbuild -DCMAKE_BUILD_TYPE=Release -DWASMEDGE_PLUGIN_TENSORFLOW=On
cmake --build build
# For the WasmEdge-Tensorflow plug-in, you should install this project.
cmake --install build
```

<!-- prettier-ignore -->
:::note
如果建置出的 `wasmedge` CLI 工具找不到 WasmEdge-Tensorflow 外掛,您可以將 `WASMEDGE_PLUGIN_PATH` 環境變數設為外掛安裝路徑 (例如 `/usr/local/lib/wasmedge/`,或建置出的外掛路徑 `build/plugins/wasmedge_tensorflow/`) 以嘗試解決此問題。
:::

然後,安裝完成後,您將在 `/usr/local/bin` 下擁有可執行的 `wasmedge` 執行環境,並在 `/usr/local/lib/wasmedge/libwasmedgePluginWasmEdgeTensorflow.so` 下擁有 WasmEdge-Tensorflow 外掛。

## 安裝 TensorFlow 相依套件

要在 `Linux` 與 `MacOS` 平台上安裝必要的 `libtensorflow_cc.so` 與 `libtensorflow_framework.so`,我們建議使用下列指令:

```bash
curl -s -L -O --remote-name-all https://github.com/second-state/WasmEdge-tensorflow-deps/releases/download/TF-2.12.0-CC/WasmEdge-tensorflow-deps-TF-TF-2.12.0-CC-manylinux2014_x86_64.tar.gz
# For the Linux aarch64 platforms, please use the `WasmEdge-tensorflow-deps-TF-TF-2.12.0-CC-manylinux2014_aarch64.tar.gz`.
# For the MacOS x86_64 platforms, please use the `WasmEdge-tensorflow-deps-TF-TF-2.12.0-CC-darwin_x86_64.tar.gz`.
# For the MacOS arm64 platforms, please use the `WasmEdge-tensorflow-deps-TF-TF-2.12.0-CC-darwin_arm64.tar.gz`.
tar -zxf WasmEdge-tensorflow-deps-TF-TF-2.12.0-CC-manylinux2014_x86_64.tar.gz
rm -f WasmEdge-tensorflow-deps-TF-TF-2.12.0-CC-manylinux2014_x86_64.tar.gz
```

共用函式庫將會在 `Linux` 平台上解壓縮至目前目錄的 `./libtensorflow_cc.so.2.12.0` 與 `./libtensorflow_framework.so.2.12.0`,或在 `MacOS` 平台上解壓縮至 `./libtensorflow_cc.2.12.0.dylib` 與 `./libtensorflow_framework.2.12.0.dylib`。

<!-- prettier-ignore -->
:::note
建置外掛後,您也可以在 `build/_deps/wasmedge_tensorflow_lib_tf-src/` 目錄下找到這些共用函式庫。
:::

接著您可以將函式庫移動到安裝路徑並建立符號連結:

```bash
mv libtensorflow_cc.so.2.12.0 /usr/local/lib
mv libtensorflow_framework.so.2.12.0 /usr/local/lib
ln -s libtensorflow_cc.so.2.12.0 /usr/local/lib/libtensorflow_cc.so.2
ln -s libtensorflow_cc.so.2 /usr/local/lib/libtensorflow_cc.so
ln -s libtensorflow_framework.so.2.12.0 /usr/local/lib/libtensorflow_framework.so.2
ln -s libtensorflow_framework.so.2 /usr/local/lib/libtensorflow_framework.so
```

如果在 `MacOS` 平台上:

```bash
mv libtensorflow_cc.2.12.0.dylib /usr/local/lib
mv libtensorflow_framework.2.12.0.dylib /usr/local/lib
ln -s libtensorflow_cc.2.12.0.dylib /usr/local/lib/libtensorflow_cc.2.dylib
ln -s libtensorflow_cc.2.dylib /usr/local/lib/libtensorflow_cc.dylib
ln -s libtensorflow_framework.2.12.0.dylib /usr/local/lib/libtensorflow_framework.2.dylib
ln -s libtensorflow_framework.2.dylib /usr/local/lib/libtensorflow_framework.dylib
```

或者在目前目錄建立符號連結並設定環境變數 `export LD_LIBRARY_PATH=$(pwd):${LD_LIBRARY_PATH}`。

如需更多資訊,您可以參閱 [GitHub 儲存庫](https://github.com/WasmEdge/WasmEdge/tree/master/plugins/wasmedge_tensorflow)。
