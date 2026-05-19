---
sidebar_position: 6
---

# Podman + WASM + GPU

Podman + Crun 搭配 Wasmedge 與 [CDI](https://github.com/cncf-tags/container-device-interface) 來啟用主機 GPU 裝置的使用。大部分步驟與 [docker + wasm + gpu](./docker_wasm_gpu.md) 相同,僅 Podman 的安裝與執行命令不同。若你已先執行過下列步驟,可以直接跳過。

## 必備條件

開始之前,你需要

- GPU 裝置(此處我們以 NVIDIA 顯示卡為例,且目前僅在 Linux 上的 NVIDIA GPU 進行過測試)
  - 安裝 NVIDIA GPU 驅動程式
  - 安裝 NVIDIA Container Toolkit 或安裝 nvidia-container-toolkit-base 套件其中之一。
- Podman >= 4.x

關於 NVIDIA 驅動程式與 toolkit 的安裝,我們在此不詳述,但可提供一些參考文件,以及驗證你的環境是否正常的方法。

[Ubuntu 上的 Nvidia 驅動程式安裝](https://ubuntu.com/server/docs/nvidia-drivers-installation)、[Toolkit 安裝指南](https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/latest/install-guide.html)、[Nvidia CDI 支援參考](https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/latest/cdi-support.html)

```bash
# 檢查你的驅動程式與裝置
> nvidia-smi -L

# 檢查你的 toolkit
> nvidia-ctk --version
```

安裝 podman >= 4.0

目前的測試階段是透過 Linuxbrew 直接安裝 Podman 以符合版本需求。未來可能會有更優雅的方式,我們會視情況更新文件。

```bash
> brew install podman

# 檢查你的 podman 版本,你也可以將其加入 $PATH。
> $HOME/.linuxbrew/opt/podman/bin/podman --version
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

以 Podman 執行 llama2 推論

> 你需要將下列命令中的 `<podman path>` 與 `<crun path>` 替換為你的二進位檔路徑。

```bash
sudo <podman path> run -v ~/.wasmedge/plugin/libwasmedgePluginWasiNN.so:/.wasmedge/plugin/libwasmedgePluginWasiNN.so \
  -v /usr/local/cuda/targets/x86_64-linux/lib/libcudart.so.12:/lib/x86_64-linux-gnu/libcudart.so.12 \
  -v /usr/local/cuda/targets/x86_64-linux/lib/libcublas.so.12:/lib/x86_64-linux-gnu/libcublas.so.12 \
  -v /usr/local/cuda/targets/x86_64-linux/lib/libcublasLt.so.12:/lib/x86_64-linux-gnu/libcublasLt.so.12 \
  -v /lib/x86_64-linux-gnu/libcuda.so.1:/lib/x86_64-linux-gnu/libcuda.so.1 \
  -v .:/resource \
  --env WASMEDGE_PLUGIN_PATH=/.wasmedge/plugin \
  --env WASMEDGE_WASINN_PRELOAD=default:GGML:AUTO:/resource/llama-2-7b-chat.Q5_K_M.gguf \
  --env n_gpu_layers=100 \
  --rm --device nvidia.com/gpu=all --runtime <crun path> --annotation module.wasm.image/variant=compat-smart --platform wasip1/wasm \
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
Thank you for your kind request! The capital of Japan is Tokyo. I'm glad to help! Please let me know if you have any other questions.
[INFO] Number of input tokens: 140
[INFO] Number of output tokens: 34
```
