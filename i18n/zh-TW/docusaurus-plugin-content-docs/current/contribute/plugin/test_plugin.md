---
sidebar_position: 5
---

# 撰寫 WasmEdge 外掛測試

本指南旨在協助您為新開發的 WasmEdge 外掛撰寫測試。我們將涵蓋建立測試案例、以程式碼實作測試案例,以及使用熱門的 C++ 測試框架 Google Test 執行測試的步驟。

## 了解您的外掛

開始撰寫測試前,請確保您了解外掛的功能與結構。WasmEdge 外掛程式碼通常包含下列部分:

- **外掛與模組描述**: 這些是提供外掛及其所含模組之中繼資料的結構。
- **主機函式與模組**: 這些是由外掛提供的功能,以 C++ 類別與方法實作。
- **模組建立函式**: 這些函式會在外掛被 WasmEdge 執行環境載入時建立外掛模組的實例。

## 建立測試案例

撰寫測試的第一步是建立測試案例。每個測試案例應該專注於外掛的特定功能。例如,如果您的外掛提供將兩個數字相加的函式,您可能會有涵蓋一般輸入、邊界案例 (例如最大整數值) 與錯誤處理 (例如傳入非整數值) 的測試案例。

## 實作測試案例

擁有測試案例後,即可開始以程式碼實作。每個測試案例應該以 C++ 函式實作,並使用 Google Test 巨集執行斷言。

以下是您可能實作測試案例的範例:

    ```cpp
    #include "gtest/gtest.h"
    #include "your_plugin.h"

    TEST(YourPluginTest, ConvertsNormalString) {
    YourPlugin plugin;
    std::string input = "123";
    int expected = 123;
    EXPECT_EQ(expected, plugin.convert(input));
    }
    ```

在此範例中,`YourPluginTest` 是測試套件名稱,`ConvertsNormalString` 是測試案例名稱。`EXPECT_EQ` 巨集用於驗證 `plugin.convert(input)` 的結果與 `expected` 相同。

## 編譯並執行測試

最後一個步驟是編譯並執行測試。WasmEdge 使用 CMake 來管理其建置流程,因此您可以將測試檔案加入測試目錄中的 `CMakeLists.txt` 檔案:

    ```cmake
    add_executable(your_plugin_test your_plugin_test.cpp)
    target_link_libraries(your_plugin_test gtest_main your_plugin)
    add_test(NAME your_plugin_test COMMAND your_plugin_test)
    ```

接著,您可以使用下列指令建置並執行測試:

    ```bash
    mkdir build
    cd buildtest_plugin.md
    cmake ..
    make
    ctest
    ```

如果一切設定正確,這將編譯您的測試、執行測試並回報結果。

請記住,測試是迭代的流程。當您開發新功能或修復錯誤時,也應該更新測試以反映這些變更。這能確保您的外掛在演進過程中持續正常運作。

我們希望此指南能協助您開始為 WasmEdge 外掛撰寫測試!
