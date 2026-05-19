---
sidebar_position: 6
---

# 伺服器端渲染現代 Web UI

傳統的 Web 應用程式遵循用戶端與伺服器的模型。在過去應用程式伺服器的時代，整個 UI 都是從伺服器動態產生的。瀏覽器是個薄用戶端，僅即時顯示渲染後的網頁。然而，隨著瀏覽器變得更強大、更精密，用戶端可以承擔更多工作量，以改善應用程式的使用者體驗、效能與安全性。

這催生了 Jamstack 的時代。如今前端與後端服務之間有明確的分離。前端是由 React.js、Vue.js、Yew 或 Percy 等 UI 框架所產生的靜態網站（HTML + JavaScript + WebAssembly），而後端則由微服務組成。然而，隨著 Jamstack 越來越受歡迎，用戶端（瀏覽器與應用程式）的多樣性使得在所有使用情境中都達到優秀的效能變得困難。

解決方案就是伺服器端渲染（SSR）。也就是讓邊緣伺服器執行「用戶端」的 UI 程式碼（即 React 產生的 JavaScript 或 Percy 產生的 WebAssembly），並將渲染後的 HTML DOM 物件送回瀏覽器。在這種情況下，邊緣伺服器必須執行與瀏覽器相同的程式碼（即 [JavaScript](../../develop/javascript/hello_world.md) 與 WebAssembly）以渲染 UI。這稱為同構（isomorphic）Jamstack 應用程式。WasmEdge 執行環境提供了一個輕量、高效能、相容 OCI 且支援多語言的容器，能在邊緣伺服器上執行所有 SSR 函式。

- [React JS SSR 函式](../../develop/javascript/ssr.md)
- Vue JS SSR 函式（即將推出）
- Yew Rust 編譯為 WebAssembly 的 SSR 函式（即將推出）
- [Percy Rust 編譯為 WebAssembly 的 SSR 函式](../../develop/rust/ssr.md)

我們也在探索在以 WasmEdge 為基礎的邊緣伺服器上渲染更複雜的 UI 與互動內容，再將渲染結果串流到用戶端應用程式的方式。可能的範例包括

- 在邊緣伺服器上渲染 Unity3D 動畫（基於 [Unity3D 的 WebAssembly 渲染](https://docs.unity3d.com/2020.1/Documentation/Manual/webgl-gettingstarted.html)）
- 在邊緣伺服器上渲染互動式影片（由 AI 產生）

當然，邊緣雲端不僅可用於 UI 元件的 SSR，能延伸的範圍遠不止於此。它還能託管商業邏輯的高效能微服務與無伺服器函式。請繼續閱讀下一章。
