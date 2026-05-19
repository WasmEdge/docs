---
sidebar_position: 3
---

# 從 NDK 原生應用程式呼叫 WasmEdge 函式

在本節中,我們將示範如何使用 C 與 Android SDK 建置 Android 原生應用程式。原生應用程式使用 WasmEdge C SDK 內嵌 WasmEdge 執行環境,並透過 WasmEdge 呼叫 WASM 函式。

<!-- prettier-ignore -->
:::note
`WasmEdge-Image`、`WasmEdge-Tensorflow` 與 `WasmEdge-tensorflow-tools` 在 0.12.1 版之後已棄用。我們未來將更新為使用 WasmEdge 外掛。
:::

## 先決條件

### Android

目前,WasmEdge 在 Android 裝置上僅支援 arm64-v8a 架構。您需要一台 arm64-v8a Android 模擬器或一台[已開啟開發者選項](https://developer.android.com/studio/debug/dev-options) 的實體裝置。WasmEdge 需要 Android 6.0 以上版本。

### Android 開發 CLI

在 Ubuntu Linux 中,您可以使用 `apt-get` 指令安裝 Android 偵錯與測試工具 `adb`。在 Ubuntu 開發機器上使用 `adb shell` 指令,您可以開啟 CLI shell 以在連接的 Android 裝置上執行指令。

```bash
sudo apt-get install adb
```

### Android NDK

要使用 wasmedge-tensorflow c api 編譯程式,您需要安裝 [Android NDK](https://developer.android.google.cn/ndk/downloads)。在此範例中,我們使用最新的 LTS 版本 (r23b)。

## 原始碼回顧

[`test.c`](https://github.com/second-state/wasm-learning/blob/master/android/test.c) 使用 wasmedge-tensorflow c api 來執行 WebAssembly 函式。WebAssembly 檔案 `birds_v1.wasm` 是從 Rust 原始碼編譯而來,[說明請見此處](/develop/rust/wasinn/tensorflow_lite)。

```c
#include <wasmedge/wasmedge.h>
#include <wasmedge/wasmedge-image.h>
#include <wasmedge/wasmedge-tensorflowlite.h>

#include <stdio.h>

int main(int argc, char *argv[]) {
  /*
   * argv[0]: ./a.out
   * argv[1]: WASM file
   * argv[2]: tflite model file
   * argv[3]: image file
   * Usage: ./a.out birds_v1.wasm lite-model_aiy_vision_classifier_birds_V1_3.tflite bird.jpg
   */

  /* Create the VM context. */
  WasmEdge_ConfigureContext *ConfCxt = WasmEdge_ConfigureCreate();
  WasmEdge_ConfigureAddHostRegistration(ConfCxt, WasmEdge_HostRegistration_Wasi);
  WasmEdge_VMContext *VMCxt = WasmEdge_VMCreate(ConfCxt, NULL);
  WasmEdge_ConfigureDelete(ConfCxt);

  /* Create the image and TFLite import objects. */
  WasmEdge_ModuleInstanceContext *ImageImpObj = WasmEdge_Image_ModuleInstanceCreate();
  WasmEdge_ModuleInstanceContext *TFLiteImpObj = WasmEdge_TensorflowLite_ModuleInstanceCreate();
  WasmEdge_ModuleInstanceContext *TFDummyImpObj = WasmEdge_Tensorflow_ModuleInstanceCreateDummy();

  /* Register into VM. */
  WasmEdge_VMRegisterModuleFromImport(VMCxt, ImageImpObj);
  WasmEdge_VMRegisterModuleFromImport(VMCxt, TFLiteImpObj);
  WasmEdge_VMRegisterModuleFromImport(VMCxt, TFDummyImpObj);

  /* Init WASI. */
  const char *Preopens[] = {".:."};
  const char *Args[] = {argv[1], argv[2], argv[3]};
  WasmEdge_ModuleInstanceContext *WASIImpObj = WasmEdge_VMGetImportModuleContext(VMCxt, WasmEdge_HostRegistration_Wasi);
  WasmEdge_ModuleInstanceInitWASI(WASIImpObj, Args, 3, NULL, 0, Preopens, 1);

  /* Run WASM file. */
  WasmEdge_String FuncName = WasmEdge_StringCreateByCString("_start");
  WasmEdge_Result Res = WasmEdge_VMRunWasmFromFile(VMCxt, argv[1], FuncName, NULL, 0, NULL, 0);
  WasmEdge_StringDelete(FuncName);

  /* Check the result. */
  if (!WasmEdge_ResultOK(Res)) {
    printf("Run WASM failed: %s\n", WasmEdge_ResultGetMessage(Res));
    return -1;
  }

  WasmEdge_ModuleInstanceDelete(ImageImpObj);
  WasmEdge_ModuleInstanceDelete(TFLiteImpObj);
  WasmEdge_ModuleInstanceDelete(TFDummyImpObj);
  WasmEdge_VMDelete(VMCxt);
  return 0;
}
```

## 建置

### 安裝相依套件

在您的 Ubuntu 開發機器上使用下列指令下載 Android 版的 WasmEdge。

```bash
wget https://github.com/WasmEdge/WasmEdge/releases/download/0.12.1/WasmEdge-0.12.1-android_aarch64.tar.gz
wget https://github.com/second-state/WasmEdge-image/releases/download/0.12.1/WasmEdge-image-0.12.1-android_aarch64.tar.gz
wget https://github.com/second-state/WasmEdge-tensorflow/releases/download/0.12.1/WasmEdge-tensorflowlite-0.12.1-android_aarch64.tar.gz
wget https://github.com/second-state/WasmEdge-tensorflow-deps/releases/download/0.12.1/WasmEdge-tensorflow-deps-TFLite-0.12.1-android_aarch64.tar.gz
tar -zxf WasmEdge-0.12.1-android_aarch64.tar.gz
tar -zxf WasmEdge-image-0.12.1-android_aarch64.tar.gz -C WasmEdge-0.12.1-Android/
tar -zxf WasmEdge-tensorflowlite-0.12.1-android_aarch64.tar.gz -C WasmEdge-0.12.1-Android/
tar -zxf WasmEdge-tensorflow-deps-TFLite-0.12.1-android_aarch64.tar.gz -C WasmEdge-0.12.1-Android/lib/
```

### 編譯

下列指令會在您的 Ubuntu 開發機器上將 C 程式編譯為 `a.out`。

```bash
(/path/to/ndk)/toolchains/llvm/prebuilt/(HostPlatform)/bin/aarch64-linux-(AndroidApiVersion)-clang test.c -I./WasmEdge-0.12.1-Android/include -L./WasmEdge-0.12.1-Android/lib -lwasmedge-image_c -lwasmedge-tensorflowlite_c -ltensorflowlite_c -lwasmedge
```

## 執行

### 將檔案推送至 Android

從您的 Ubuntu 開發機器上使用 `adb` 將編譯後的程式、Tensorflow Lite 模型檔案、測試影像檔案,以及 Android 版的 WasmEdge 共用函式庫檔案安裝至 Android 裝置上。

```bash
adb push a.out /data/local/tmp
adb push birds_v1.wasm /data/local/tmp
adb push lite-model_aiy_vision_classifier_birds_V1_3.tflite /data/local/tmp
adb push bird.jpg /data/local/tmp
adb push ./WasmEdge-0.12.1-Android/lib /data/local/tmp
```

### 執行範例

現在,您可以透過遠端 shell 指令在 Android 裝置上執行已編譯的 C 程式。從您的 Ubuntu 開發機器上執行 `adb shell`。

```bash
$ adb shell
sirius:/ $ cd /data/local/tmp
sirius:/data/local/tmp $ export LD_LIBRARY_PATH=/data/local/tmp/lib:$LD_LIBRARY_PATH
sirius:/data/local/tmp $ ./a.out birds_v1.wasm lite-model_aiy_vision_classifier_birds_V1_3.tflite bird.jpg
INFO: Initialized TensorFlow Lite runtime.
166 : 0.84705883
```
