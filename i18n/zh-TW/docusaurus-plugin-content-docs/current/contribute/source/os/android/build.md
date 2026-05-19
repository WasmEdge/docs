---
sidebar_position: 1
---

# 為 Android 建置 WasmEdge

WasmEdge 執行環境的發行版隨附 Android 作業系統的預建執行檔。為什麼選擇 Android 上的 WasmEdge?

- 為 Android 應用程式提供原生速度與沙箱安全性
- 支援多種開發語言 — 例如 C、[Rust](/category/develop-wasm-apps-in-rust)、[Go](../../../../category/develop-wasm-apps-in-go) 與 [JS](../../../../category/develop-wasm-apps-in-javascript)
- 在您的 Android 應用程式中[內嵌第三方函式](../../../../embed/overview.md)
- [由 Kubernetes 管理的](../../../../category/deploy-wasmedge-apps-in-kubernetes) Android 應用程式

然而,WasmEdge 安裝程式並不支援 Android。使用者必須先將發行檔案下載到電腦,然後使用 `adb` 工具將檔案傳輸至 Android 裝置或模擬器。我們將示範如何做到。

- [Android 的 WasmEdge CLI 工具](./cli.md)
- [從 NDK 原生應用程式呼叫 WasmEdge 函式](./ndk.md)
- [從 Android APK 應用程式呼叫 WasmEdge 函式](./apk.md)

## 為 Android 平台從原始碼建置

請依照本指南從原始碼以 Android NDK 建置並測試 WasmEdge。

<!-- prettier-ignore -->
:::note
目前我們僅支援直譯器模式的執行環境。
:::

## 準備環境

我們建議開發者[使用我們的 Docker 映像檔](../linux.md##prepare-the-environment) 並依照步驟準備建置環境。

- 下載並解壓縮 [Android NDK 23b](https://developer.android.com/ndk/downloads)。
- 確認 cmake 為 [CMake 3.21](https://cmake.org/download/) 或更新版本。
- 下載並安裝 [ADB 平台工具](https://developer.android.com/studio/releases/platform-tools)。
  - 如果您使用 Debian 或 Ubuntu Linux 發行版,可以透過 `apt` 安裝 ADB 平台工具。
- 一台已[啟用開發者選項與 USB 偵錯](https://developer.android.com/studio/debug/dev-options) 且至少為 Android 6.0 或更高版本的 Android 裝置。

## 為 Android 平台建置 WasmEdge

取得 WasmEdge 原始碼。

```bash
git clone https://github.com/WasmEdge/WasmEdge.git
cd WasmEdge
```

將 Android NDK 路徑加入環境變數。

```bash
export ANDROID_NDK_HOME=path/to/you/ndk/dir
```

執行 WasmEdge 原始碼中的建置指令稿。此指令稿將自動為 Android 建置 WasmEdge,結果位於 `build` 資料夾中。

```bash
./examples/android/standalone/build_for_android.sh
```

## 在 Android 平台上測試 WasmEdge CLI

### 將 WasmEdge CLI 與相關測試資料推送至 Android 平台

1. 使用 USB 線或 Wi-Fi 連接裝置。接著您可以透過 `adb devices` 指令檢查已連接的裝置。

   ```bash
   $ adb devices
   List of devices attached
   0a388e93      device
   ```

2. 使用 `adb push` 指令將整個 `build/tools/wasmedge` 資料夾推送至 Android 裝置上的 `/data/local/tmp` 資料夾中。

   ```bash
   cp -r examples build/tools/wasmedge/examples
   cd build
   adb push ./tools/wasmedge /data/local/tmp
   ```

### 在 Android 平台上執行 WasmEdge CLI

1. 請使用 `adb shell` 指令進入 Android 裝置。
2. 依照步驟在 Android 裝置上測試 WasmEdge CLI。

```bash
$ cd /data/local/tmp/wasmedge/examples
$ ../wasmedge hello.wasm 1 2 3
hello
1
2
3

$ ../wasmedge --reactor add.wasm add 2 2
4

$ ../wasmedge --reactor fibonacci.wasm fib 8
34

$ ../wasmedge --reactor factorial.wasm fac 12
479001600

$ cd js
$ ./../wasmedge --dir .:. qjs.wasm hello.js 1 2 3
Hello 1 2 3
```

## 注意事項

- 對於 Android 10 或更新版本,SELinux 將不允許不受信任的應用程式透過系統呼叫執行 `home` 或 `/data/local/tmp` 資料夾中的執行檔。
- Android SELinux 政策將不允許不受信任的應用程式存取 `/data/local/tmp` 資料夾。
