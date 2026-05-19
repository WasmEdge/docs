---
sidebar_position: 5
---

# 比較

## WebAssembly 與 Docker 之間的關係為何?

請參考我們的資訊圖 [WebAssembly vs. Docker](https://wasmedge.org/wasm_linux_container/)。WebAssembly 在雲原生與邊緣原生應用程式中與 Docker 並肩運作。

## Native clients (NaCl)、應用程式執行環境與 WebAssembly 之間有何差異?

我們建立了方便的對照表進行比較。

|  | NaCl | 應用程式執行環境(例如 Node 與 Python) | 類 Docker 容器 | WebAssembly |
| --- | --- | --- | --- | --- |
| 效能 | 極佳 | 差 | 普通 | 極佳 |
| 資源佔用 | 極佳 | 差 | 差 | 極佳 |
| 隔離性 | 差 | 普通 | 普通 | 極佳 |
| 安全性 | 差 | 普通 | 普通 | 極佳 |
| 可攜性 | 差 | 極佳 | 普通 | 極佳 |
| 安全 | 差 | 普通 | 普通 | 極佳 |
| 語言與框架選擇 | 不適用 | 不適用 | 極佳 | 普通 |
| 易用性 | 普通 | 極佳 | 極佳 | 普通 |
| 可管理性 | 差 | 差 | 極佳 | 極佳 |

## WebAssembly 與 eBPF 之間有何差異?

`eBPF` 是 Linux 核心空間 VM 的位元組碼格式,適用於網路或安全性相關任務。WebAssembly 則是使用者空間 VM 的位元組碼格式,適用於商業應用程式。[詳情請參考此處](https://medium.com/codex/ebpf-and-webassembly-whose-vm-reigns-supreme-c2861ce08f89)。
