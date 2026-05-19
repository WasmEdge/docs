---
sidebar_position: 5
---

# Docker + WASM + GPU

這是一種全新的做法,採用 Docker + Crun 搭配 Wasmedge 與 [CDI](https://github.com/cncf-tags/container-device-interface) 來啟用主機 GPU 裝置的使用。之所以未延續前一章使用 runwasi 作為 Docker 內 wasm 執行環境的做法,是因為考量到目前對 CDI 的支援階段與相容性方式。

## 必備條件

開始之前,你需要

- GPU 裝置(此處我們以 NVIDIA 顯示卡為例,且目前僅在 Linux 上的 NVIDIA GPU 進行過測試)
  - 安裝 NVIDIA GPU 驅動程式
  - 安裝 NVIDIA Container Toolkit 或安裝 nvidia-container-toolkit-base 套件其中之一。
- Docker 版本 > 4.29(包含 Moby 25)

關於 NVIDIA 驅動程式與 toolkit 的安裝,我們在此不詳述,但可提供一些參考文件,以及驗證你的環境是否正常的方法。

[Ubuntu 上的 Nvidia 驅動程式安裝](https://ubuntu.com/server/docs/nvidia-drivers-installation)、[Toolkit 安裝指南](https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/latest/install-guide.html)、[Nvidia CDI 支援參考](https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/latest/cdi-support.html)

```bash
# 檢查你的驅動程式與裝置
> nvidia-smi -L

# 檢查你的 toolkit
> nvidia-ctk --version
```

安裝最新的 docker-ce

```bash
> curl -fsSL https://get.docker.com -o get-docker.sh
> sh get-docker.sh

# 檢查你的 docker
> docker --version
```

## CDI 設定

[產生 CDI 規格檔案](https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/latest/cdi-support.html#procedure)

```bash
> sudo nvidia-ctk cdi generate --output=/etc/cdi/nvidia.yaml

# 檢查你的 cdi 設定是否正常
> nvidia-ctk cdi list

# 範例輸出
INFO[0000] Found 2 CDI devices
nvidia.com/gpu=0
nvidia.com/gpu=all
```

[在 docker 設定中啟用 CDI](https://docs.docker.com/reference/cli/dockerd/#enable-cdi-devices)(/etc/docker/daemon.json)

```json
{
  "features": {
     "cdi": true
  },
  "cdi-spec-dirs": ["/etc/cdi/", "/var/run/cdi"]
}
```

```bash
# 重新載入 docker daemon
> sudo systemctl reload docker

# 測試你的 cdi 設定是否正常
> docker run --rm --device nvidia.com/gpu=all ubuntu:22.04 nvidia-smi -L

# 範例輸出 
GPU 0: NVIDIA GeForce GTX 1080 (UUID: GPU-********-****-****-****-************)
```

## 設定你的容器執行環境(crun + wasmedge + 外掛系統)

建置啟用 wasmedge 的 crun

```bash
> sudo apt install -y make git gcc build-essential pkgconf libtool libsystemd-dev libprotobuf-c-dev libcap-dev libseccomp-dev libyajl-dev go-md2man libtool autoconf python3 automake

> git clone https://github.com/containers/crun
> cd crun
> ./autogen.sh
> ./configure --with-wasmedge
> make

# 檢查你的 crun
> ./crun --version
```

替換容器執行環境

```json
{
  "runtimes": {
    "crun": {
      "path": "<你自行建置的 crun 二進位檔路徑>"
    }
  },
  "features": {
    "cdi": true
  },
  "cdi-spec-dirs": ["/etc/cdi/", "/var/run/cdi"]
}
```

```bash
# 重新載入 docker daemon
> sudo systemctl reload docker
```

將 ggml 外掛下載至主機

```bash
> curl -sSf https://raw.githubusercontent.com/WasmEdge/WasmEdge/master/utils/install.sh | bash -s -- --plugins wasi_nn-ggml

# 確認所有外掛相依項目都正常
> ldd ~/.wasmedge/plugin/libwasmedgePluginWasiNN.so
```

## 以我們的 wasm 應用程式示範 llama

> 此示範映像檔是從[這裡](https://github.com/second-state/WasmEdge-WASINN-examples/tree/master/wasmedge-ggml/llama)建置的 Wasm 應用程式,並上傳至[這裡](https://github.com/captainvincent/runwasi/pkgs/container/runwasi-demo/195178675?tag=wasmedge-ggml-llama)。

下載推論模型

```bash
> curl -LO https://huggingface.co/second-state/Llama-2-7B-Chat-GGUF/resolve/main/llama-2-7b-chat.Q5_K_M.gguf
```

以 Docker 執行 llama2 推論

```bash
docker run -v ~/.wasmedge/plugin/libwasmedgePluginWasiNN.so:/.wasmedge/plugin/libwasmedgePluginWasiNN.so \
  -v /usr/local/cuda/targets/x86_64-linux/lib/libcudart.so.12:/lib/x86_64-linux-gnu/libcudart.so.12 \
  -v /usr/local/cuda/targets/x86_64-linux/lib/libcublas.so.12:/lib/x86_64-linux-gnu/libcublas.so.12 \
  -v /usr/local/cuda/targets/x86_64-linux/lib/libcublasLt.so.12:/lib/x86_64-linux-gnu/libcublasLt.so.12 \
  -v /lib/x86_64-linux-gnu/libcuda.so.1:/lib/x86_64-linux-gnu/libcuda.so.1 \
  -v .:/resource \
  --env WASMEDGE_PLUGIN_PATH=/.wasmedge/plugin \
  --env WASMEDGE_WASINN_PRELOAD=default:GGML:AUTO:/resource/llama-2-7b-chat.Q5_K_M.gguf \
  --env n_gpu_layers=100 \
  --rm --device nvidia.com/gpu=all --runtime=crun --annotation=module.wasm.image/variant=compat-smart --platform wasip1/wasm \
  ghcr.io/captainvincent/runwasi-demo:wasmedge-ggml-llama default \
  $'[INST] <<SYS>>\nYou are a helpful, respectful and honest assistant. Always answer as helpfully as possible, while being safe.  Your answers should not include any harmful, unethical, racist, sexist, toxic, dangerous, or illegal content. Please ensure that your responses are socially unbiased and positive in nature. If a question does not make any sense, or is not factually coherent, explain why instead of answering something not correct. If you do not know the answer to a question, please do not share false information.\n<</SYS>>\nWhat is the capital of Japan?[/INST]'
```

範例結果

```bash
ggml_init_cublas: GGML_CUDA_FORCE_MMQ:   no
ggml_init_cublas: CUDA_USE_TENSOR_CORES: yes
ggml_init_cublas: found 1 CUDA devices:
  Device 0: NVIDIA GeForce GTX 1080, compute capability 6.1, VMM: yes
Prompt:
[INST] <<SYS>>
You are a helpful, respectful and honest assistant. Always answer as helpfully as possible, while being safe.  Your answers should not include any harmful, unethical, racist, sexist, toxic, dangerous, or illegal content. Please ensure that your responses are socially unbiased and positive in nature. If a question does not make any sense, or is not factually coherent, explain why instead of answering something not correct. If you do not know the answer to a question, please do not share false information.
<</SYS>>
What is the capital of Japan?[/INST]
Response:
[INFO] llama_commit: "4ffcdce2"
[INFO] llama_build_number: 2334
[INFO] Number of input tokens: 140
Thank you for asking! The capital of Japan is Tokyo. I'm glad you asked! It's important to be informed and curious about different countries and their capitals. Is there anything else I can help you with?
[INFO] Number of input tokens: 140
[INFO] Number of output tokens: 48
```
