---
sidebar_position: 9
---

# 發行流程

## 為新版本建立發行流程議題

- [ ] 持續新增功能、議題與文件,並在議題中建立檢查清單。
- [ ] 新增新版本的 GitHub 專案。

## 撰寫 Changelog

- [ ] 確保每一項變更都已記錄於 changelog 中。
- [ ] 確保 `Changelog.md` 具有正確的版本號與發行日期。
- [ ] 將此版本的 changelog 複製至 `.CurrentChangelog.md`。(我們的發行 CI 會以此檔案作為發行說明。)
- [ ] 記錄貢獻者名單。
- [ ] 建立 pull request,確認 CI 全部通過,並合併它。

## 建立 Alpha 預先發行

- [ ] 此階段主要功能已完成。第一個 Alpha 預先發行之後將不再合併重大功能。
- [ ] 確保發行流程議題中的功能皆已完成。
- [ ] 使用 git tag 建立新的發行標籤 `major.minor.patch-alpha.version`,並將此標籤推送至 GitHub。
- [ ] 等待 CI 建置並將發行執行檔與發行說明推送至 GitHub 發行頁面。
- [ ] 勾選 `Pre-release` 核取方塊並發佈此預先發行。
- [ ] 若無重大議題,此步驟將於約 3 天後自動關閉並進入 Beta 或 RC 階段。

## 建立 Beta 預先發行

- [ ] 此階段供必要時的議題修復。將不再接受新功能。
- [ ] 確保發行流程議題中的所有功能皆已完成。
- [ ] 使用 git tag 建立新的發行標籤 `major.minor.patch-beta.version`,並將此標籤推送至 GitHub。
- [ ] 等待 CI 建置並將發行執行檔與發行說明推送至 GitHub 發行頁面。
- [ ] 勾選 `Pre-release` 核取方塊並發佈此預先發行。
- [ ] 若無重大議題,此步驟將於約 3 天後自動關閉並進入 RC 階段。

## 建立 RC 預先發行

- [ ] 此階段議題修復已完成。`RC` 預先發行供安裝、語言繫結與套件測試使用。
- [ ] 確保發行流程議題中的所有議題皆已完成。
- [ ] 更新 `CMakeLists.txt` 中的 `WASMEDGE_CAPI_VERSION`。
- [ ] 更新 `docs/.env` 中的 `wasmedge_version`。
- [ ] 使用 git tag 建立新的發行標籤 `major.minor.patch-rc.version`,並將此標籤推送至 GitHub。
- [ ] 等待 CI 建置並將發行執行檔與發行說明推送至 GitHub 發行頁面。
- [ ] 勾選 `Pre-release` 核取方塊並發佈此預先發行。
- [ ] 若無重大議題,此步驟將於約三天後自動關閉並宣告正式發行。

## 建立正式發行

- [ ] 確保 `Changelog.md`、`.CurrentChangelog.md` 與 `SECURITY.md` 具有正確的版本號與發行日期。
- [ ] 使用 git tag 建立新的發行標籤 `major.minor.patch`,並將此標籤推送至 GitHub。
- [ ] 等待 CI 建置並將發行執行檔與發行說明推送至 GitHub 發行頁面。
- [ ] 發佈此發行版本。
- [ ] 關閉發行流程議題與 GitHub 專案。

## 更新擴充功能

下列專案將會隨著 `Alpha`、`Beta`、`RC` 預先發行與正式發行一同更新:

- [ ] [WasmEdge-Go SDK](https://github.com/second-state/WasmEdge-go)
- [ ] [WasmEdge-core NAPI 套件](https://github.com/second-state/wasmedge-core)
- [ ] [WasmEdge-extensions NAPI 套件](https://github.com/second-state/wasmedge-extensions)
