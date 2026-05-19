---
sidebar_position: 4
---

# 疑難排解指南

本指南旨在提供您在使用 WasmEdge 時可能遇到的常見問題之解決方案,協助您有效地進行疑難排解,並盡快回到開發工作。

## 安裝問題

如果您在安裝過程中遇到錯誤,請務必檢查以下事項:

1. **支援的平台**:請確認您執行的是 [受支援的作業系統與架構](https://wasmedge.org/docs/start/install/)。

2. **相依套件**:確保所有必要的相依套件皆已安裝且為最新版本。這包括正確版本的編譯器、建置系統(例如 CMake),以及 WasmEdge 所相依的任何函式庫。

3. **環境**:檢查環境變數與路徑。某些問題可能是由不正確的路徑或缺少環境變數所造成。

## 執行階段錯誤

執行階段錯誤可能因各種原因而發生。以下是一些常見原因與解決方案:

1. **使用方式不正確**:如果在執行 Wasm 檔案時出現錯誤,請確認您正確使用 wasmedge 指令。請查看 [CLI 文件](https://wasmedge.org/docs/start/build-and-run/cli/) 確認您使用的語法與選項正確。

2. **不相容的 Wasm 檔案**:並非所有 Wasm 檔案都與 WasmEdge 相容。如果 Wasm 檔案使用了 WasmEdge 不支援的特性或指令,它可能會執行失敗。請確認 Wasm 檔案與 WasmEdge 相容。

3. **外掛問題**:如果您正在使用外掛,而外掛造成問題,請確保外掛已正確安裝與設定。請查看 [外掛文件](https://wasmedge.org/docs/category/wasmedge-plugin-system) 了解任何特定需求或已知問題。

## 效能問題

如果 WasmEdge 執行速度緩慢或消耗過多記憶體,請考慮以下事項:

1. **最佳化**:如果效能是考量重點,請務必使用 [AOT 編譯器](https://wasmedge.org/docs/start/build-and-run/aot/)。AOT 編譯器可大幅加快 Wasm 檔案的執行速度。

2. **記憶體使用量**:如果記憶體使用量過高,請考慮 Wasm 檔案或其處理的資料是否過大。您可能需要最佳化 Wasm 檔案,或調整其處理資料的方式。

## 為 WasmEdge 貢獻

如果您在為 WasmEdge 貢獻時遇到困難,請務必:

1. **遵循貢獻指南**:確保您的貢獻遵循 [指南](https://wasmedge.org/docs/contribute/)。

2. **了解程式碼**:在進行變更之前,請確保您對 [WasmEdge 程式碼庫](https://github.com/WasmEdge/WasmEdge) 有良好的理解。

3. **測試您的變更**:在提交 pull request 之前,務必測試您的變更。這有助於及早發現問題,並讓審查流程更順暢。

如果以上任何步驟都無法協助您解決問題,請至 WasmEdge 的 [discord 伺服器](https://discord.gg/h4KDyB8XTt) 詢問,以取得進一步協助。
