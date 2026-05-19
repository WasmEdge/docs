---
sidebar_position: 5
---

# 無伺服器 Software-As-A-Service 函式

WasmEdge 能透過無伺服器函式，而非傳統的網路 API，來支援客製化的 SaaS 擴充功能或應用程式。這大幅提升了 SaaS 使用者與開發者的生產力。

- WasmEdge 可以嵌入到 SaaS 產品中，以執行使用者定義的函式。在此情境下，WasmEdge 函式 API 取代了 SaaS 網頁 API。內嵌的 WasmEdge 函式比透過網路傳輸的 RPC 函式更快速、更安全、也更易於使用。
- 邊緣伺服器可以提供以 WasmEdge 為基礎的容器，與既有的 SaaS 或 PaaS API 互動，而不需要使用者執行自己的伺服器（例如回呼伺服器）。無伺服器 API 服務可以與 SaaS 共處於相同的網路中，以提供最佳的效能與安全性。

下方的範例展示了以 WasmEdge 為基礎的無伺服器函式如何串接不同服務的 SaaS API，並依據每位使用者的商業邏輯處理跨 SaaS API 的資料流。

## Slack

- [為 Slack 建構無伺服器聊天機器人](http://reactor.secondstate.info/en/docs/user_guideline.html)

## Lark

也就是所謂的 `飛書`，又稱中國版 Slack。由 Tiktok 的母公司 Byte Dance 所打造。

- [為 Lark 建構無伺服器聊天機器人](http://reactor.secondstate.info/en/docs/user_guideline.html)
