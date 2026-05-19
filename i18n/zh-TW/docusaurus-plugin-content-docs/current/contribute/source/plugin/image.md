---
sidebar_position: 4
---

# 建置具有 WasmEdge-Image 外掛的 WasmEdge

WasmEdge Image 外掛是擴充 WasmEdge 執行環境功能的軟體元件,使其能夠載入並解碼 JPEG 與 PNG 影像並將其轉換為 tensor。此外掛對於需要在其 WebAssembly 應用程式中處理影像資料的開發者相當有用。

## 先決條件

WasmEdge-Image 外掛的先決條件與 [Linux 平台](../os/linux.md) 或 [MacOS 平台](../os/macos.md) 上的 WasmEdge 建置環境相同。

如果開發者使用自己的環境建置,請確保已安裝 `zlib` 與 `libboost-all-dev`。

```bash
sudo apt update
sudo apt install zlib1g-dev libboost-all-dev
```

在 MacOS 平台上,需要 `libjpeg` 與 `libpng`。

```bash
brew install jpeg-turbo libpng
```

## 建置具有 WasmEdge-Image 外掛的 WasmEdge

要啟用 WasmEdge WasmEdge-Image,開發者需要[從原始碼建置 WasmEdge](../build_from_src.md) 並加上 cmake 選項 `-DWASMEDGE_PLUGIN_IMAGE=On`。

```bash
cd <path/to/your/wasmedge/source/folder>
cmake -GNinja -Bbuild -DCMAKE_BUILD_TYPE=Release -DWASMEDGE_PLUGIN_IMAGE=On
cmake --build build
# For the WasmEdge-Image plug-in, you should install this project.
cmake --install build
```

<!-- prettier-ignore -->
:::note
如果建置出的 `wasmedge` CLI 工具找不到 WasmEdge-Image 外掛,您可以將 `WASMEDGE_PLUGIN_PATH` 環境變數設為外掛安裝路徑 (例如 `/usr/local/lib/wasmedge/`,或建置出的外掛路徑 `build/plugins/wasmedge_image/`) 以嘗試解決此問題。
:::

然後,安裝完成後,您將在 `/usr/local/bin` 下擁有可執行的 `wasmedge` 執行環境,並在 `/usr/local/lib/wasmedge/libwasmedgePluginWasmEdgeImage.so` 下擁有 WasmEdge-Image 外掛。

如需更多資訊,您可以參閱 [GitHub 儲存庫](https://github.com/WasmEdge/WasmEdge/tree/master/plugins/wasmedge_image)。
