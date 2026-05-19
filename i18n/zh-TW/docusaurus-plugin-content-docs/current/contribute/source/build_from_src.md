---
sidebar_position: 1
---

# 建置指南

請依照本指南從原始碼建置並測試 WasmEdge。

- [Linux](os/linux.md)
- [MacOS](os/macos.md)
- [Windows](os/windows.md)
- [Android](/category/build-and-run-wasmedge-on-android)
- [OpenWrt](os/openwrt.md)
- [RISC-V](os/riscv64.md)
- [OpenHarmony](os/openharmony.md)
- [seL4](os/sel4)
- [Raspberry Pi](os/raspberrypi.md)
- [S390x](os/s390x.md)

<!-- prettier-ignore -->
:::note
如果您只想取得 `master` 分支 `HEAD` 的最新建置版本,且不想自行建置,可以直接從我們 Github Action 的 CI artifact 下載發行套件。[範例請見此](https://github.com/WasmEdge/WasmEdge/actions/runs/1521549504#artifacts)。
:::

## 將會建置的內容

WasmEdge 提供各種工具,可啟用不同的執行環境以達到最佳效能。您會發現有多個與 wasmedge 相關的工具:

1. `wasmedge` 是通用的 wasm 執行環境。
   - `wasmedge` 在直譯器模式下執行 `WASM` 檔案,或在預先編譯模式下執行已編譯的 `WASM` 檔案。
   - 若要停用所有工具的建置,可將 CMake 選項 `WASMEDGE_BUILD_TOOLS` 設為 `OFF`。
2. `wasmedgec` 是預先編譯的 `WASM` 編譯器。

   - `wasmedgec` 將一般 `WASM` 檔案編譯成已編譯的 `WASM` 檔案。
   - 若僅要停用預先編譯器的建置,可將 CMake 選項 `WASMEDGE_BUILD_AOT_RUNTIME` 設為 `OFF`。

   <!-- prettier-ignore -->
   :::note
   `wasmedgec` 的用法等同於 `wasmedge compile`。我們將在未來棄用 `wasmedgec`。
   :::

3. `libwasmedge.so` 是 WasmEdge C API 共用函式庫。 (在 MacOS 上為 `libwasmedge.dylib`,在 Windows 上為 `wasmedge.dll`)
   - `libwasmedge.so`、`libwasmedge.dylib` 或 `wasmedge.dll` 為預先編譯器與 WASM 執行環境提供 C API。
   - 如果 CMake 選項 `WASMEDGE_BUILD_AOT_RUNTIME` 設為 `OFF`,與預先編譯器相關的 API 將永遠失敗。
   - 若僅要停用共用函式庫的建置,可將 CMake 選項 `WASMEDGE_BUILD_SHARED_LIB` 設為 `OFF`。
4. `ssvm-qitc` 用於 AI 應用程式,支援 ONNC 執行環境以處理 ONNX 格式的 AI 模型。
   - 如果您想嘗試 `ssvm-qitc`,請參閱 [ONNC-Wasm](https://github.com/ONNC/onnc-wasm) 專案來設定工作環境並試試多種範例。
   - 這裡是我們的 [ONNC-WASM 專案教學 (YouTube 影片)](https://www.youtube.com/watch?v=cbiPuHMS-iQ)。

## CMake 建置選項

開發者可以設定 CMake 選項以自訂 WasmEdge 的建置。

1. `WASMEDGE_BUILD_TESTS`: 建置 WasmEdge 測試。預設為 `OFF`。
2. `WASMEDGE_USE_LLVM`: 以 LLVM 為基礎建置執行環境,以支援預先編譯與即時編譯。預設為 `ON`。
3. `WASMEDGE_BUILD_SHARED_LIB`: 建置 WasmEdge 共用函式庫 (`libwasmedge.so`、`libwasmedge.dylib` 或 `wasmedge.dll`)。預設為 `ON`。
   - 預設情況下,WasmEdge 共用函式庫會連結至 LLVM 共用函式庫。
4. `WASMEDGE_BUILD_STATIC_LIB`: 建置 WasmEdge 靜態函式庫 (`libwasmedge.a`,僅 Linux 與 MacOS 平台,實驗性)。預設為 `OFF`。
   - 若此選項設為 `ON`,選項 `WASMEDGE_FORCE_DISABLE_LTO` 將被強制設為 `ON`。
   - 若此選項設為 `ON`,Linux 平台上的 `libz` 與 `libtinfo` 將以靜態方式連結。
   - 在連結 `libwasmedge.a` 時,開發者也應在 Linux 與 MacOS 平台上加入 `-ldl`、`-pthread`、`-lm` 與 `-lstdc++` 連結器選項,並在 Linux 平台上加入 `-lrt`。
5. `WASMEDGE_BUILD_TOOLS`: 建置 `wasmedge` 與 `wasmedgec` 工具。預設為 `ON`。
   - `wasmedge` 與 `wasmedgec` 工具預設會連結至 WasmEdge 共用函式庫。
   - 若此選項設為 `ON` 且 `WASMEDGE_USE_LLVM` 設為 `OFF`,則不會建置 AOT 編譯器的 `wasmedgec` 工具。
   - 若此選項設為 `ON` 但選項 `WASMEDGE_LINK_TOOLS_STATIC` 設為 `OFF`,選項 `WASMEDGE_BUILD_SHARED_LIB` 將被強制設為 `ON`。
   - 若此選項與選項 `WASMEDGE_LINK_TOOLS_STATIC` 皆設為 `ON`,則 `WASMEDGE_LINK_LLVM_STATIC` 與 `WASMEDGE_BUILD_STATIC_LIB` 將會皆設為 `ON`,且 `wasmedge` 與 `wasmedgec` 工具將會改為連結至 WasmEdge 靜態函式庫。在此情況下,外掛在工具中將無法運作。
6. `WASMEDGE_BUILD_PLUGINS`: 建置 WasmEdge 外掛。預設為 `ON`。
7. `WASMEDGE_BUILD_EXAMPLE`: 建置 WasmEdge 範例。預設為 `OFF`。
8. `WASMEDGE_FORCE_DISABLE_LTO`: 強制關閉連結時最佳化。預設為 `OFF`。
9. `WASMEDGE_LINK_LLVM_STATIC`: 以靜態方式連結 LLVM 與 lld 函式庫 (僅 Linux 與 MacOS 平台)。預設為 `OFF`。
10. `WASMEDGE_LINK_TOOLS_STATIC`: 使 `wasmedge` 與 `wasmedgec` 工具以靜態方式連結 WasmEdge 函式庫與 LLVM 函式庫 (僅 Linux 與 MacOS 平台)。預設為 `OFF`。
    - 若選項 `WASMEDGE_BUILD_TOOLS` 與此選項皆設為 `ON`,則 `WASMEDGE_LINK_LLVM_STATIC` 會被設為 `ON`。
11. `WASMEDGE_ENABLE_UB_SANITIZER`: 啟用未定義行為偵測器。預設為 `OFF`。
12. `WASMEDGE_PLUGIN_WASI_NN_BACKEND`: 建置 WasmEdge WASI-NN 外掛 (僅 Linux 平台)。預設為空。
    - 若選項 `WASMEDGE_BUILD_PLUGINS` 設為 `OFF`,此選項無效。
    - 要以後端建置 WASI-NN 外掛,請使用 `-DWASMEDGE_PLUGIN_WASI_NN_BACKEND=<backend_name>`。
    - 要以多個後端建置 WASI-NN 外掛,請使用 `-DWASMEDGE_PLUGIN_WASI_NN_BACKEND=<backend_name1>,<backend_name2>`。
13. `WASMEDGE_PLUGIN_WASI_CRYPTO`: 建置 WasmEdge WASI-Crypto 外掛 (僅 Linux 與 MacOS 平台)。預設為 `OFF`。
    - 若選項 `WASMEDGE_BUILD_PLUGINS` 設為 `OFF`,此選項無效。
14. `WASMEDGE_PLUGIN_WASI_LOGGING`: 建置 WasmEdge WASI-Logging 外掛 (僅 Linux 與 MacOS 平台)。預設為 `ON`。
    - 在 WasmEdge `0.14.1` 中,WASI-Logging 外掛已整合至 WasmEdge 函式庫中,且不會產生外掛共用函式庫目標。
    - 若選項 `WASMEDGE_BUILD_PLUGINS` 設為 `OFF`,此選項無效。
15. `WASMEDGE_PLUGIN_WASM_BPF`: 建置 WasmEdge wasm_bpf 外掛 (僅 Linux 平台)。預設為 `OFF`。
    - 若選項 `WASMEDGE_BUILD_PLUGINS` 設為 `OFF`,此選項無效。
16. `WASMEDGE_PLUGIN_IMAGE`: 建置 WasmEdge image 外掛 (僅 Linux 與 MacOS 平台)。預設為 `OFF`。
    - 若選項 `WASMEDGE_BUILD_PLUGINS` 設為 `OFF`,此選項無效。
17. `WASMEDGE_PLUGIN_TENSORFLOW`: 建置 WasmEdge TensorFlow 外掛 (僅 Linux 與 MacOS 平台)。預設為 `OFF`。
    - 若選項 `WASMEDGE_BUILD_PLUGINS` 設為 `OFF`,此選項無效。
18. `WASMEDGE_PLUGIN_TENSORFLOWLITE`: 建置 WasmEdge TensorFlow-Lite 外掛 (僅 Linux 與 MacOS 平台)。預設為 `OFF`。
    - 若選項 `WASMEDGE_BUILD_PLUGINS` 設為 `OFF`,此選項無效。

## 建置具有外掛的 WasmEdge

開發者可依照步驟從原始碼建置具有外掛的 WasmEdge。

- [WASI-NN (具有多種後端)](plugin/wasi_nn.md)
- [WASI-Crypto](plugin/wasi_crypto.md)
- [WasmEdge-Image](plugin/image.md)
- [WasmEdge-TensorFlow](plugin/tensorflow.md)
- [WasmEdge-TensorFlowLite](plugin/tensorflowlite.md)
- [WASI-Logging](plugin/wasi_logging.md)

## 執行測試

僅當建置選項 `WASMEDGE_BUILD_TESTS` 設為 `ON` 時測試才可用。

使用者可使用這些測試來驗證所建置 WasmEdge 執行檔的正確性。

```bash
cd <path/to/wasmedge/build_folder>
LD_LIBRARY_PATH=$(pwd)/lib/api ctest
```
