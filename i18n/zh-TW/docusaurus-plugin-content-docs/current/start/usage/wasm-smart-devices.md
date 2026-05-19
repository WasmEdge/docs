---
sidebar_position: 4
---

# WasmEdge 於智慧裝置上

智慧裝置應用程式可以嵌入 WasmEdge 作為中介層執行環境,在 UI 上呈現互動式內容、連接原生裝置驅動程式並存取特定的硬體功能(例如用於 AI 推論的 GPU)。WasmEdge 執行環境相較於原生編譯的機器碼,具備安全性、安全防護、可攜性、可管理性、OTA 升級能力與開發者生產力等優勢。WasmEdge 可在以下裝置作業系統上執行。

- [Android](/category/build-and-run-wasmedge-on-android)
- [OpenHarmony](../../contribute/source/os/openharmony.md)
- [Raspberry Pi](../../contribute/source/os/raspberrypi.md)
- [seL4 RTOS](../../contribute/source/os/sel4.md)

藉由在裝置與邊緣伺服器上同時使用 WasmEdge,我們可以為豐富用戶端的行動應用程式支援 [同構伺服器端渲染 (SSR)](../../develop/rust/ssr.md) 與 [微服務](../../start/build-and-run/docker_wasm.md#deploy-the-microservice-example),讓應用程式同時具備可攜性與可升級性。
