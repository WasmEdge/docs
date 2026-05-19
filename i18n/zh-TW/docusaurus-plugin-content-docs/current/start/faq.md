---
sidebar_position: 4
---

# 常見問題

本常見問題頁面旨在解答關於 WasmEdge 最常見的技術問題。如果您的問題沒有直接在此回答,請參考 WasmEdge [文件](https://wasmedge.org/docs/),或透過 discord 加入 WasmEdge 社群討論。

## 1. WasmEdge 如何處理模組之間的記憶體共用?

WasmEdge 遵循 WebAssembly 規範,該規範目前不支援不同模組之間的共用記憶體。每個模組都有自己的線性記憶體空間。這是因為 WebAssembly 模組是隔離的,無法直接存取彼此的記憶體 1。然而,可以透過主機函式手動將資料從一個模組複製到另一個模組。

## 2. WasmEdge 能支援模型訓練嗎?

目前 WasmEdge 支援 [模型推論](https://www.secondstate.io/articles/fast-llm-inference/)。它使用 WASI-NN API 來使用預先訓練好的模型進行預測。然而,目前尚未支援模型訓練。它僅允許執行預先訓練好的模型。

## 3. WasmEdge 的內部流程為何?

WasmEdge 執行環境遵循一般流程:解析 Wasm 檔案、驗證已解析的 Wasm 檔案、將已驗證的 Wasm 檔案編譯為原生程式碼,然後執行編譯後的程式碼。更多詳細資訊請參考 WasmEdge 執行環境 [文件](https://wasmedge.org/docs/)。

## 4. 為什麼我的外掛會崩潰?

如果您的外掛崩潰,可能有多種原因。可能與不正確使用 WasmEdge API 有關,或外掛可能與您所使用的 WasmEdge 版本不相容。建議使用除錯工具對外掛進行除錯,以取得更詳細的錯誤資訊。您也應該查看 [外掛文件](https://wasmedge.org/docs/contribute/plugin/test_plugin)。

## 5. 如何建立 VM 以呼叫 Wasm 函式庫中的 `infer()`?

您可以使用 WASI-NN API 呼叫 Wasm 函式庫中的 `infer()` 函式。首先,您需要準備模型、輸入與輸出。然後,可以使用這些參數呼叫 `infer()` 函式。

## 6. WasmEdge 是否可以透過 WASI-NN 使用 Tensorflow 作為推論後端?

可以,WasmEdge 可以透過 WASI-NN API 將 Tensorflow 作為 [推論](https://wasmedge.org/docs/embed/go/ai/) 後端。

## 7. 如何在 WasmEdge 執行環境中讀取主機檔案?

WasmEdge 提供 WASI (WebAssembly System Interface) API 來與主機系統互動,包括檔案操作。您可以使用 [WASI API](https://wasmedge.org/docs/embed/go/reference/0.11.x?_highlight=wasi&_highlight=api#preregistrations) 來開啟並讀取主機系統上的檔案。

## 8. WasmEdge 與 Second State 之間的關係是什麼

WasmEdge 與 Second State 之間的關係源於後者將其 WasmEdge Runtime 專案貢獻給 Cloud Native Computing Foundation (CNCF)。隨後,Second State 成為 WasmEdge 的維護者之一。隨著 WasmEdge 希望擴大其社群,目前持續尋找更多維護者。

請注意,本常見問題頁面並非詳盡無遺,WasmEdge 社群隨時準備好回答您可能遇到的任何問題。如果您需要協助,請不要猶豫,加入我們的 [Discord 伺服器](https://discord.gg/h4KDyB8XTt)。
