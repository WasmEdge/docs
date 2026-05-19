---
sidebar_position: 1
---

# 使用情境

具備 AOT 編譯器最佳化的 WasmEdge,是目前市場上速度最快的 WebAssembly 執行環境之一。因此 WasmEdge 被廣泛應用於邊緣運算、汽車、Jamstack、無伺服器、SaaS、service mesh,甚至區塊鏈應用程式中。

- 現代網頁應用程式具備在瀏覽器與/或邊緣雲端上呈現的豐富 UI。WasmEdge 與熱門的網頁 UI 框架(例如 React、Vue、Yew 與 Percy)搭配,在邊緣伺服器上支援同構 [伺服器端渲染 (SSR)](../../embed/use-case/ssr-modern-ui.md) 函式。它也能在邊緣雲端上支援網頁應用程式的 Unity3D 動畫與 AI 生成互動式影片的伺服器端渲染。

- WasmEdge 為微服務提供輕量、安全且高效能的執行環境。它與 Dapr 等應用服務框架以及 Kubernetes 等服務協調器完全相容。WasmEdge 微服務可以在邊緣伺服器上執行,並能存取分散式快取,以支援現代網頁應用程式中無狀態與有狀態的商業邏輯函式。相關內容:公有雲中的無伺服器函式即服務 (Function-as-a-Service)。

- [無伺服器 SaaS (Software-as-a-Service)](/category/serverless-platforms) 函式讓使用者得以擴充並客製化其 SaaS 體驗,而無需自行運作 API 回呼伺服器。無伺服器函式可以嵌入 SaaS 中,或駐留在 SaaS 伺服器旁的邊緣伺服器上。開發者只需上傳函式,即可回應 SaaS 事件或連接 SaaS API。

- [智慧裝置應用程式](./wasm-smart-devices.md) 可以嵌入 WasmEdge 作為中介層執行環境,在 UI 上呈現互動式內容、連接原生裝置驅動程式並存取特定的硬體功能(例如用於 AI 推論的 GPU)。WasmEdge 執行環境相較於原生編譯的機器碼,具備安全性、安全防護、可攜性、可管理性與開發者生產力等優勢。WasmEdge 可在 Android、OpenHarmony 與 seL4 RTOS 裝置上執行。

- WasmEdge 可以透過嵌入 JS 執行引擎或直譯器,支援高效能的 DSL (領域特定語言),或作為雲原生 JavaScript 執行環境。

- 開發者可以利用 [Kubernetes](../../develop/deploy/kubernetes/kubernetes-containerd-crun.md)、Docker 與 CRI-O 等容器工具,部署、管理並執行輕量的 WebAssembly 應用程式。

- WasmEdge 應用程式可以插入現有的應用程式框架或平台中。

如果您對 WasmEdge 有任何好點子,歡迎開啟 GitHub issue 一起討論。
