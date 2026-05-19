---
sidebar_position: 4
---

# 從 Android APK 應用程式呼叫 WasmEdge 函式

在本節中,我們將示範如何建置「一般」Android 應用程式 (即可安裝於 Android 裝置上的 APK 檔案)。此 APK 應用程式內嵌 WasmEdge 執行環境。它可以透過內嵌的 WasmEdge 呼叫 WebAssembly 函式。其優點是開發者可以安全地將以多種不同語言 (例如 Rust、JS、Grain、TinyGo 等) 撰寫的高效能函式內嵌至 Kotlin 應用程式中。

## 快速入門

示範專案[可在此取得](https://github.com/WasmEdge/WasmEdge/tree/master/examples/android/app)。您可以使用 Gradle 工具或 Android Studio IDE 建置此專案。

### 使用 Gradle 建置專案

1. 設定環境變數 `ANDROID_HOME=path/to/your/android/sdk`
2. 執行指令 `./gradlew assembleRelease`
3. 以 `apksigner` 簽署您的 APK 檔案。apk 檔案位於 `./app/build/outputs/apk/release`。`apksigner` 工具位於 `$ANDROID_HOME/build-tools/$VERSION/apksigner`。

### 使用 Android Studio 建置專案

使用 [Android Studio](https://developer.android.com/studio) 2020.3.1 或更新版本開啟此資料夾。

要產生 Release APK,請點擊 `Menu -> Build -> Generate Signed Bundle/APK`,選擇 APK,設定 keystore 設定並等待建置完成。

## 原始碼回顧

Android UI 應用程式以 Kotlin 撰寫,並使用 JNI (Java Native Interface) 載入內嵌 WasmEdge 的 C 共用函式庫。

### Android UI

Android UI 應用程式[位於此處](https://github.com/WasmEdge/WasmEdge/blob/master/examples/android/app/app/src/main/java/org/wasmedge/example_app/MainActivity.kt)。它使用 Android SDK 以 Kotlin 撰寫。

```java
class MainActivity : AppCompatActivity() {
  lateinit var lib: NativeLib

  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    setContentView(R.layout.activity_main)

    val tv = findViewById<TextView>(R.id.tv_text)

    lib = NativeLib(this)

    Thread {
      val lines = Vector<String>()
      val idxArr = arrayOf(20, 25, 28, 30, 32)
      for (idx: Int in idxArr) {
        lines.add("running fib(${idx}) ...")
        runOnUiThread {
          tv.text = lines.joinToString("\n")
        }
        val begin = System.currentTimeMillis()
        val retVal = lib.wasmFibonacci(idx)
        val end = System.currentTimeMillis()
        lines.removeLast()
        lines.add("fib(${idx}) -> ${retVal}, ${end - begin}ms")
        runOnUiThread {
          tv.text = lines.joinToString("\n")
        }
      }
    }.start()
  }
}
```

### 原生函式庫

Android UI 應用程式呼叫 `NativeLib` Kotlin 物件以存取 WasmEdge 函式。
`NativeLib` 原始碼[可在此取得](https://github.com/WasmEdge/WasmEdge/blob/master/examples/android/app/lib/src/main/java/org/wasmedge/native_lib/NativeLib.kt)。它使用 JNI (Java Native Interface) 載入名為 `wasmedge_lib` 的 C 共用函式庫。
接著它呼叫 `wasmedge_lib` 中的 `nativeWasmFibonacci` 函式來執行 `fibonacci.wasm` WebAssembly 位元組碼。

請確認您已使用 WABT 工具或任何其他 WebAssembly 編譯器,從範例資料夾中的 `fibonacci.wat` 建置 `fibonacci.wasm` 檔案。

```java
class NativeLib(ctx : Context) {
  private external fun nativeWasmFibonacci(imageBytes : ByteArray, idx : Int ) : Int

  companion object {
    init {
      System.loadLibrary("wasmedge_lib")
    }
  }

  private var fibonacciWasmImageBytes : ByteArray = ctx.assets.open("fibonacci.wasm").readBytes()

  fun wasmFibonacci(idx : Int) : Int{
    return nativeWasmFibonacci(fibonacciWasmImageBytes, idx)
  }
}
```

### C 共用函式庫

C 共用函式庫原始碼 `wasmedge_lib.cpp` [可在此取得](https://github.com/WasmEdge/WasmEdge/blob/master/examples/android/app/lib/src/main/cpp/wasmedge_lib.cpp)。它使用 WasmEdge C SDK 內嵌 WasmEdge VM 並執行 WebAssembly 函式。

```c
extern "C" JNIEXPORT jint JNICALL
Java_org_wasmedge_native_1lib_NativeLib_nativeWasmFibonacci(
    JNIEnv *env, jobject, jbyteArray image_bytes, jint idx) {
  jsize buffer_size = env->GetArrayLength(image_bytes);
  jbyte *buffer = env->GetByteArrayElements(image_bytes, nullptr);

  WasmEdge_ConfigureContext *conf = WasmEdge_ConfigureCreate();
  WasmEdge_ConfigureAddHostRegistration(conf, WasmEdge_HostRegistration_Wasi);

  WasmEdge_VMContext *vm_ctx = WasmEdge_VMCreate(conf, nullptr);

  const WasmEdge_String &func_name = WasmEdge_StringCreateByCString("fib");
  std::array<WasmEdge_Value, 1> params{WasmEdge_ValueGenI32(idx)};
  std::array<WasmEdge_Value, 1> ret_val{};

  const WasmEdge_Result &res = WasmEdge_VMRunWasmFromBuffer(
      vm_ctx, (uint8_t *)buffer, buffer_size, func_name, params.data(),
      params.size(), ret_val.data(), ret_val.size());

  WasmEdge_VMDelete(vm_ctx);
  WasmEdge_ConfigureDelete(conf);
  WasmEdge_StringDelete(func_name);

  env->ReleaseByteArrayElements(image_bytes, buffer, 0);
  if (!WasmEdge_ResultOK(res)) {
    return -1;
  }
  return WasmEdge_ValueGetI32(ret_val[0]);
}
```

### WebAssembly 函式

`fibonacci.wat` 是一個[手寫的 WebAssembly 指令稿](https://github.com/WasmEdge/WasmEdge/blob/master/examples/wasm/fibonacci.wat),用於計算費氏數列。它可以使用 [WABT 工具](https://github.com/WebAssembly/wabt) 編譯為 WebAssembly。

### 建置相依套件

Android Studio 與 Gradle 使用 CMake 來建置 C 共用函式庫。[CMakeLists.txt 檔案](https://github.com/WasmEdge/WasmEdge/blob/master/examples/android/app/lib/src/main/cpp/CMakeLists.txt) 將 WasmEdge 原始碼建置成 Android 共用函式庫檔案,並將它們內嵌至最終的 APK 應用程式中。在此情況下,無須另外將 WasmEdge 共用函式庫安裝至 Android 裝置上。
