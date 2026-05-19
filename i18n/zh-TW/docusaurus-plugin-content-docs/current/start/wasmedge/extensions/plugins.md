---
sidebar_position: 2
---

# WasmEdge 外掛

對於那些過於繁重而難以編譯為 WebAssembly 的工作負載,更適合將它們建置為原生主機函式。為了滿足 WebAssembly 執行環境的可攜性,WasmEdge 引入了外掛機制,讓主機函式可以被載入並具備可攜性。

WasmEdge 的外掛機制是一種從可載入共用函式庫擴充主機模組的簡易方式。透過外掛,使用者可以從 WasmEdge 官方甚至其他開發者所發行的共用函式庫中載入並實體化主機函式。

## 官方發行的外掛

以下清單為 WasmEdge 官方發行的外掛。使用者可以透過安裝程式輕鬆地安裝這些外掛。

| 外掛 | 說明 | 平台支援 | 訪客語言支援 | 從原始碼建置 |
|---------|-------------|------------------|------------------------|-------------------|
| [WASI-Logging](https://github.com/WebAssembly/wasi-logging) | 供 WebAssembly 程式記錄訊息的紀錄 API。 | `manylinux2014 (x86_64, aarch64)`<br/>`ubuntu 20.04 (x86_64)`<br/>`darwin (x86_64, arm64)`<br/>(自 `0.13.0` 起) | Rust | [步驟](../../../contribute/source/plugin/wasi_logging.md) |
| [WASI-Crypto](https://github.com/WebAssembly/wasi-crypto) | 執行環境可向 WebAssembly 模組公開的 API,用於進行密碼學運算與金鑰管理。 | `manylinux2014 (x86_64, aarch64)`<br/>`ubuntu 20.04 (x86_64)`<br/>(自 `0.10.1` 起) | [Rust](https://crates.io/crates/wasi-crypto) | [步驟](../../../contribute/source/plugin/wasi_crypto.md) |
| [WASI-NN](https://github.com/WebAssembly/wasi-nn) [(OpenVINO 後端)](../../../develop/rust/wasinn/openvino.md) | 使用 OpenVINO 模型進行 AI 推論。 | `ubuntu 20.04 (x86_64)`<br/>(自 `0.10.1` 起) | [Rust](https://crates.io/crates/wasi-nn)、JavaScript | [步驟](../../../contribute/source/plugin/wasi_nn.md#build-wasmedge-with-wasi-nn-openvino-backend) |
| [WASI-NN](https://github.com/WebAssembly/wasi-nn) [(Pytorch 後端)](../../../develop/rust/wasinn/pytorch.md) | 使用 Pytorch 模型進行 AI 推論。 | `manylinux2014 (x86_64)`<br/>`ubuntu 20.04 (x86_64)`<br/>(自 `0.11.1` 起) | [Rust](https://crates.io/crates/wasi-nn)、JavaScript | [步驟](../../../contribute/source/plugin/wasi_nn.md#build-wasmedge-with-wasi-nn-pytorch-backend) |
| [WASI-NN](https://github.com/WebAssembly/wasi-nn) [(TensorFlow-Lite 後端)](../../../develop/rust/wasinn/tensorflow_lite.md) | 使用 TensorFlow-Lite 模型進行 AI 推論。 | `manylinux2014 (x86_64, aarch64)`<br/>`ubuntu 20.04 (x86_64)`<br/>(自 `0.11.2` 起) | [Rust](https://crates.io/crates/wasi-nn)、JavaScript | [步驟](../../../contribute/source/plugin/wasi_nn.md#build-wasmedge-with-wasi-nn-tensorflow-lite-backend) |
| [WASI-NN](https://github.com/WebAssembly/wasi-nn) [(Ggml 後端)](../../../develop/rust/wasinn/llm_inference.md) | 使用 LLM 介面進行 AI 推論。 | `manylinux2014 (x86_64, aarch64)`<br/>`ubuntu 20.04 (x86_64)`<br/>`darwin (x86_64, arm64)`<br/>(自 `0.13.4` 起) | [Rust](https://github.com/second-state/wasmedge-wasi-nn) | [步驟](../../../contribute/source/plugin/wasi_nn.md#build-wasmedge-with-wasi-nn-llamacpp-backend) |
| [WASI-NN](https://github.com/WebAssembly/wasi-nn) [(Piper 後端)](../../../develop/rust/wasinn/piper.md) | 使用 Piper 模型進行 AI 推論。 | `manylinux_2_28 (x86_64, aarch64)`<br/>`ubuntu 20.04 (x86_64)`<br/>(自 `0.14.1` 起) | [Rust](https://github.com/second-state/wasmedge-wasi-nn) | [步驟](../../../contribute/source/plugin/wasi_nn.md#build-wasmedge-with-wasi-nn-piper-backend) |
| [WASI-NN](https://github.com/WebAssembly/wasi-nn) [(Whisper 後端)](../../../develop/rust/wasinn/whisper.md) | 使用 Whisper 模型進行 AI 推論。 | `manylinux2014 (x86_64, aarch64)`<br/>`ubuntu 20.04 (x86_64)`<br/>`darwin (x86_64, arm64)`<br/>(自 `0.14.1` 起) | [Rust](https://github.com/second-state/wasmedge-wasi-nn) | [步驟](../../../contribute/source/plugin/wasi_nn.md#build-wasmedge-with-wasi-nn-whisper-backend) |
| [WASI-NN](https://github.com/WebAssembly/wasi-nn) Burn.rs 後端 (Squeezenet) | 在 Burn.rs 中使用 Squeezenet 模型進行 AI 推論。 | `ubuntu 20.04 (x86_64)`<br/>(自 `0.14.1` 起) | [Rust](https://github.com/second-state/wasmedge-wasi-nn) | |
| [WASI-NN](https://github.com/WebAssembly/wasi-nn) Burn.rs 後端 (Whisper) | 在 Burn.rs 中使用 Whisper 模型進行 AI 推論。 | `ubuntu 20.04 (x86_64)`<br/>(自 `0.14.1` 起) | [Rust](https://github.com/second-state/wasmedge-wasi-nn) | |
| WasmEdge-ffmpeg | | `manylinux2014 (x86_64, aarch64)`<br/>`ubuntu 20.04 (x86_64)`<br/>`darwin (x86_64, arm64)`<br/>(自 `0.14.0` 起) | | |
| [WasmEdge-Image](../../../contribute/source/plugin/image.md) | 用於處理 AI 推論任務影像的原生函式庫。 | `manylinux2014 (x86_64, aarch64)`<br/>`ubuntu 20.04 (x86_64)`<br/>`darwin (x86_64, arm64)`<br/>(自 `0.13.0` 起) | [Rust](https://crates.io/crates/wasmedge_tensorflow_interface) (0.3.0) | [步驟](../../../contribute/source/plugin/image.md) |
| WasmEdge-LLMC | | `manylinux2014 (x86_64, aarch64)`<br/>`ubuntu 20.04 (x86_64)`<br/>(自 `0.14.1` 起) | | |
| WasmEdge-OpenCV | 用於處理 AI 輸入/輸出影像與影片的熱門實用函式。 | `manylinux2014 (x86_64, aarch64)`<br/>`ubuntu 20.04 (x86_64)`<br/>`darwin (x86_64, arm64)`<br/>(自 `0.13.3` 起) | | |
| [WasmEdge-Process](../../../contribute/source/plugin/process.md) | 讓 WebAssembly 程式可以在主機作業系統中執行原生指令。它支援傳遞引數、環境變數、`STDIN`/`STDOUT` 管線,以及主機存取的安全性原則。 | `manylinux2014 (x86_64, aarch64)`<br/>`ubuntu 20.04 (x86_64)`<br/>(自 `0.10.0` 起) | [Rust](https://crates.io/crates/wasmedge_process_interface) | [步驟](../../../contribute/source/plugin/process.md) |
| WasmEdge-StableDiffusion | | `manylinux2014 (x86_64, aarch64)`<br/>`ubuntu 20.04 (x86_64)`<br/>`darwin (x86_64, arm64)`<br/>(自 `0.14.1` 起) | | |
| [WasmEdge-Tensorflow](../../../contribute/source/plugin/tensorflow.md) | 用於 TensorFlow 模型推論的原生函式庫。| `manylinux2014 (x86_64, aarch64)`<br/>`ubuntu 20.04 (x86_64)`<br/>`darwin (x86_64, arm64)`<br/>(自 `0.13.0` 起) | [Rust](https://crates.io/crates/wasmedge_tensorflow_interface) (0.3.0) | [步驟](../../../contribute/source/plugin/tensorflow.md) |
| [WasmEdge-TensorflowLite](../../../contribute/source/plugin/tensorflowlite.md)| 用於 TensorFlow-Lite 模型推論的原生函式庫。 | `manylinux2014 (x86_64, aarch64)`<br/>`ubuntu 20.04 (x86_64)`<br/>`darwin (x86_64, arm64)`<br/>(自 `0.13.0` 起) | [Rust](https://crates.io/crates/wasmedge_tensorflow_interface) (0.3.0) | [步驟](../../../contribute/source/plugin/tensorflowlite.md) |
| WasmEdge-zlib | ??? | `manylinux2014 (x86_64, aarch64)`<br/>`ubuntu 20.04 (x86_64)`<br/>`darwin (x86_64, arm64)`<br/>(自 `0.13.5` 起) | | |
| [WasmEdge-eBPF](../../../contribute/source/plugin/ebpf.md) | 用於 eBPF 應用程式推論的原生函式庫 | `manylinux2014 (x86_64,  aarch64)`<br/>`ubuntu 20.04 (x86_64)`<br/>(自 `0.13.2` 起) | Rust | [步驟](../../../contribute/source/plugin/ebpf.md) |
| [WasmEdge-rustls](../../../contribute/source/plugin/rusttls.md) (已淘汰) | 用於 Rust 與 TLS 函式庫推論的原生函式庫 | `manylinux2014 (x86_64, aarch64)`<br/>`ubuntu 20.04 (x86_64)`<br/>`darwin (x86_64, arm64)`<br/>(自 `0.13.0` 起,至 `0.13.5`) | [Rust](https://crates.io/crates/wasmedge_rustls_api) | [步驟](../../../contribute/source/plugin/rusttls.md) |
