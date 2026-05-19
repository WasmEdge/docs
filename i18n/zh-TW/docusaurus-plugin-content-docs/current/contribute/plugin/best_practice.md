---
sidebar_position: 6
---

# 最佳實踐

開發 WasmEdge 外掛時,遵循最佳實踐相當重要,可確保外掛運作良好、可靠且有效率。以下是一些須遵循的關鍵最佳實踐:

## 使用最新版本的 WasmEdge

請務必使用最新版本的 WasmEdge,以善用最近期的功能、改進與安全性更新。

### 安裝最新版本

要安裝最新版本的 WasmEdge,請依照 [WasmEdge 文件](https://wasmedge.org/docs/start/install/) 中的安裝說明。

### 更新現有外掛

如果您現有的外掛是以較舊版本的 WasmEdge 開發,您可能需要更新它們才能與最新版本相容。這可能需要更新外掛程式碼以使用新功能或 [WasmEdge API](https://wasmedge.org/docs/category/api-reference/) 的變更,或者更新建置流程以使用最新版本的 WasmEdge。

請記住,使用最新版本的 WasmEdge 不僅能確保您運用最新的功能,還能提供最新的安全性更新以保護您的應用程式。

## 選擇適當的程式語言

WasmEdge 外掛可以使用多種語言開發,包括 [C](develop_plugin_c.md)、[C++](develop_plugin_cpp.md) 與 [Rust](develop_plugin_rustsdk.md)。語言的選擇取決於外掛的特定需求與開發者的專業。在大多數使用案例中建議使用 C API,因為其簡單性與廣泛的支援。然而,複雜的外掛可能會受益於 C++ 或 Rust 的增強功能。

## 撰寫並編譯外掛

建立 WasmEdge 外掛時:

   1. **撰寫程式碼**: 開發外掛時,請撰寫清晰、可維護的程式碼,並妥善記錄以利理解與未來維護。

   2. **編譯為共用函式庫**: 使用 `gcc` (適用於 C) 或 `g++` (適用於 C++) 等編譯器將程式碼編譯為共用函式庫。例如,在 Linux 環境中,您可使用 `gcc -shared -fPIC -o my_plugin.so my_plugin.c` 來編譯 C 外掛。

   3. **錯誤處理與輸入驗證**: 進行有效的錯誤處理以捕捉並管理潛在問題。徹底驗證所有輸入,以確保外掛的穩定性與安全性。

## 測試外掛

測試是外掛開發流程中不可或缺的部分。它能確保外掛行為符合預期、滿足需求並達到最佳效能。WasmEdge 在其[儲存庫](https://github.com/WasmEdge/WasmEdge/tree/master/test/plugins) 中提供了多種外掛的測試組合,您可以用來作為撰寫自有測試的參考。

要為 WasmEdge 外掛執行測試,您需要遵循以下幾個步驟。在這個範例中,我們會使用 `wasmedge-image` 外掛為例。

- **步驟 1:建置 WasmEdge 執行環境與 WasmEdge-image 外掛**
   首先,您需要建置 [WasmEdge](../source/build_from_src.md) 與 [wasmedge-image](../source/plugin/image.md) 外掛。

- **步驟 2:執行測試**
   WasmEdge 儲存庫提供了多種外掛的測試組合,包括 `wasmedge-image`。您可以在儲存庫的 `test/plugins/wasmedge_image` 目錄中找到這些測試案例。

   要執行這些測試,您可以從建置目錄使用 `ctest` 指令:

   ```bash
   cd ../../../test/plugins/wasmedge_image
   mkdir build && cd build
   cmake ..
   make
   ctest
   ```

   這將執行 `wasmedge-image` 外掛的所有單元測試與整合測試。這些測試可確保外掛行為符合預期、滿足需求並達到最佳效能。它們也會驗證外掛是否正確地與 WebAssembly 程式整合,以及 WebAssembly 程式能否正確呼叫外掛的函式。

- **步驟 3:分析測試結果**
   執行測試後,請分析結果以識別任何議題或錯誤。若有任何測試失敗,您應該對議題進行除錯、修復問題,然後重新執行測試以確保修復如預期般運作。

藉由遵循這些步驟,您可以有效地為 `wasmedge-image` 外掛或任何其他 WasmEdge 外掛執行測試。

<!-- prettier-ignore -->
:::note
如果您想開發自己的測試,請參閱[撰寫 WasmEdge 外掛測試](test_plugin.md) 以取得詳細資訊。
:::

## 保護外掛安全

安全性是任何軟體開發流程中至關重要的部分。它涉及多個面向,包括保護程式碼、驗證輸入、妥善處理錯誤,以及使用安全的程式設計實踐。開發 WasmEdge 外掛時,務必遵循這些最佳實踐:

- **驗證輸入:** 請務必驗證函式的輸入。這可以避免多種類型的攻擊,包括緩衝區溢位攻擊與程式碼注入攻擊。

   ```c
   WasmEdge_Result Add(void *, const WasmEdge_CallingFrameContext *,
                        const WasmEdge_Value *In, WasmEdge_Value *Out) {
      if (In[0].Type != WasmEdge_ValType_I32 || In[1].Type != WasmEdge_ValType_I32) {
      return WasmEdge_Result_Error;
      }
      // Rest of the function...
   }
   ```

- **處理錯誤:** 請務必妥善處理錯誤。不要忽略表示錯誤的回傳值,並且不要在錯誤發生後繼續執行。

   ```c
   WasmEdge_Result Add(void *, const WasmEdge_CallingFrameContext *,
                        const WasmEdge_Value *In, WasmEdge_Value *Out) {
      // Check the input types...
      int32_t Val1 = WasmEdge_ValueGetI32(In[0]);
      int32_t Val2 = WasmEdge_ValueGetI32(In[1]);
      if (Val1 == INT32_MIN || Val2 == INT32_MIN) {
      return WasmEdge_Result_Error;
      }
      // Rest of the function...
   }
   ```

- **使用安全的程式設計實踐:** 在您所選的語言中遵循安全的程式設計實踐。例如,避免使用不安全的函式、使用強型別、避免使用全域變數。

## 發佈外掛

當您完成 WasmEdge 外掛的開發、測試與文件撰寫後,就可以發佈以供他人使用了。要發佈您的外掛,您需要遵循以下步驟:

## 為 Rust 匯出 SDK

除了 C 與 C++ SDK,您也可以為 Rust 開發者建立 SDK。這需要建立一個 Rust 函式庫,以提供 Rust 介面存取您外掛的功能。

### 建立 Rust 函式庫

您可以建立一個 Rust 函式庫,提供 Rust 介面存取您外掛的功能。這需要撰寫呼叫外掛中函式的 Rust 程式碼,並提供對 Rust 友善的 API。

以 [wasmedge-image](../source/plugin/image.md) 外掛為例,您可能會有類似這樣的程式碼:

```rust
// lib.rs
extern crate wasmedge_image;

use wasmedge_image::Image;

pub fn load_image(path: &str) -> Result<Image, wasmedge_image::Error> {
Image::open(path)
}
```

在此 Rust 函式庫中,提供了單一的 `load_image` 函式,該函式呼叫 `wasmedge-image` 外掛中的 `open` 函式。

### 建置 Rust 函式庫

您可以使用 Rust 套件管理器 Cargo 來建置您的 Rust 函式庫。這會產生可由 WasmEdge 執行環境載入的 `.so` 檔案。

```bash
cargo build --release
```

### 封裝 Rust SDK

將 Rust 函式庫與標頭檔封裝成 tarball 或類似的套件格式。這使其他開發者可輕鬆下載並安裝您的 SDK。

```bash
tar czvf wasmedge_image_rust_sdk.tar.gz libwasmedge_image.so wasmedge_image.h
```

藉由此套件,其他 rust 開發者可以輕鬆地在其應用程式中使用您的外掛。他們只需在程式碼中引入您的標頭檔,並在編譯應用程式時連結您的 rust 函式庫即可。

現在,當您準備好要發佈外掛與對應的 SDK 時,可以在官方 WasmEdge [外掛儲存庫](https://github.com/WasmEdge/WasmEdge/tree/master/plugins) 中建立 pull request 來發佈您的外掛,或發佈到任何您選擇的儲存庫。請確保將文件與其他資源 (例如測試檔案) 一同包含於您的外掛中。

## 為 WasmEdge 社群貢獻

身為開放原始碼貢獻者,您可以透過將外掛提交至官方 [WasmEdge 儲存庫](https://github.com/WasmEdge/WasmEdge) 與社群分享。這讓他人能受益於您的成果。

藉由遵循這些最佳實踐,您可以為 WasmEdge 確保成功且有效率的外掛開發流程。
