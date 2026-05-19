---
sidebar_position: 6
---

# 建置具有 WasmEdge-TensorflowLite 外掛的 WasmEdge

WasmEdge-TensorflowLite 外掛是擴充 WasmEdge 執行環境功能的軟體元件,用於執行 TensorFlow-Lite 模型推論。它允許 WebAssembly 應用程式在 WasmEdge 執行環境上執行時存取 TensorFlow-Lite 功能。此外掛在 WasmEdge 執行環境與 TensorFlow-Lite 後端之間提供橋樑,讓開發者能夠在 WebAssembly 應用程式中執行機器學習模型。

## 先決條件

WasmEdge-TensorflowLite 外掛的先決條件與 [Linux 平台](../os/linux.md) 或 [MacOS 平台](../os/macos.md) 上的 WasmEdge 建置環境相同。

## 建置具有 WasmEdge-TensorflowLite 外掛的 WasmEdge

要啟用 WasmEdge WasmEdge-TensorflowLite,開發者需要[從原始碼建置 WasmEdge](../build_from_src.md) 並加上 cmake 選項 `-DWASMEDGE_PLUGIN_TENSORFLOWLITE=On`。

```bash
cd <path/to/your/wasmedge/source/folder>
cmake -GNinja -Bbuild -DCMAKE_BUILD_TYPE=Release -DWASMEDGE_PLUGIN_TENSORFLOWLITE=On
cmake --build build
# For the WasmEdge-TensorflowLite plug-in, you should install this project.
cmake --install build
```

<!-- prettier-ignore -->
:::note
如果建置出的 `wasmedge` CLI 工具找不到 WasmEdge-TensorflowLite 外掛,您可以將 `WASMEDGE_PLUGIN_PATH` 環境變數設為外掛安裝路徑 (例如 `/usr/local/lib/wasmedge/`,或建置出的外掛路徑 `build/plugins/wasmedge_tensorflowlite/`) 以嘗試解決此問題。
:::

然後,安裝完成後,您將在 `/usr/local/bin` 下擁有可執行的 `wasmedge` 執行環境,並在 `/usr/local/lib/wasmedge/libwasmedgePluginWasmEdgeTensorflowLite.so` 下擁有 WasmEdge-TensorflowLite 外掛。

## 安裝 TensorFlowLite 相依套件

要在 `Linux` 與 `MacOS` 平台上安裝必要的 `libtensorflowlite_c.so` 與 `libtensorflowlite_flex.so`,我們建議使用下列指令:

```bash
curl -s -L -O --remote-name-all https://github.com/second-state/WasmEdge-tensorflow-deps/releases/download/TF-2.12.0-CC/WasmEdge-tensorflow-deps-TFLite-TF-2.12.0-CC-manylinux2014_x86_64.tar.gz
# For the Linux aarch64 platforms, please use the `WasmEdge-tensorflow-deps-TFLite-TF-2.12.0-CC-manylinux2014_aarch64.tar.gz`.
# For the MacOS x86_64 platforms, please use the `WasmEdge-tensorflow-deps-TFLite-TF-2.12.0-CC-darwin_x86_64.tar.gz`.
# For the MacOS arm64 platforms, please use the `WasmEdge-tensorflow-deps-TFLite-TF-2.12.0-CC-darwin_arm64.tar.gz`.
tar -zxf WasmEdge-tensorflow-deps-TFLite-TF-2.12.0-CC-manylinux2014_x86_64.tar.gz
rm -f WasmEdge-tensorflow-deps-TFLite-TF-2.12.0-CC-manylinux2014_x86_64.tar.gz
```

共用函式庫將會在 `Linux` 平台上解壓縮至目前目錄的 `./libtensorflowlite_c.so` 與 `./libtensorflowlite_flex.so`,或在 `MacOS` 平台上解壓縮至 `./libtensorflowlite_c.dylib` 與 `./libtensorflowlite_flex.dylib`。

<!-- prettier-ignore -->
:::note
建置外掛後,您也可以在 `build/_deps/wasmedge_tensorflow_lib_tflite-src/` 目錄下找到這些共用函式庫。
:::

接著您可以將函式庫移動到安裝路徑:

```bash
mv libtensorflowlite_c.so /usr/local/lib
mv libtensorflowlite_flex.so /usr/local/lib
```

如果在 `MacOS` 平台上:

```bash
mv libtensorflowlite_c.dylib /usr/local/lib
mv libtensorflowlite_flex.dylib /usr/local/lib
```

或設定環境變數 `export LD_LIBRARY_PATH=$(pwd):${LD_LIBRARY_PATH}`。

如需更多資訊,您可以參閱 [GitHub 儲存庫](https://github.com/WasmEdge/WasmEdge/tree/master/plugins/wasmedge_tensorflowlite)。
