---
sidebar_position: 6
---

# Podman + WASM + GPU

Podman + Crun with Wasmedge + [CDI](https://github.com/cncf-tags/container-device-interface) to enable the usage of host GPU devices. Most of the steps are the same with [docker + wasm + gpu](./docker_wasm_gpu.md), except for the installation of Podman and execution command. If the following steps have already been executed before, you could just skip them.

## Prerequisite

Before we start, you need

- GPU device (Here we will take NVIDIA graphics cards as our example and we have only conducted tests on NVIDIA GPUs on linux for now)
  - Install NVIDIA GPU Driver
  - Install either the NVIDIA Container Toolkit or you installed the nvidia-container-toolkit-base package.
- Podman >= 4.x

Regarding the installation of the NVIDIA driver and toolkit, we won't go into detail here, but we could provide a few reference documents and the ways to verify your environment is ok. 

[Nvidia drivers installation on ubuntu](https://ubuntu.com/server/docs/nvidia-drivers-installation), [Toolkit install guide](https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/latest/install-guide.html), [Nvidia CDI supoort reference](https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/latest/cdi-support.html)

```bash
# check your driver and device
> nvidia-smi -L

# Check your toolkit
> nvidia-ctk --version
```

Install podman >= 4.0

The current testing phase involves directly installing Podman from Linuxbrew to meet version requirements. There may be more elegant methods in the future, and we will update the documentation accordingly.

```bash
> brew install podman

# Check your podman version and you could add it to your $PATH, too.
> $HOME/.linuxbrew/opt/podman/bin/podman --version
```


## CDI setup

[Generate the CDI specification file](https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/latest/cdi-support.html#procedure)

```bash
> sudo nvidia-ctk cdi generate --output=/etc/cdi/nvidia.yaml

# Check you cdi config is good
> nvidia-ctk cdi list

# Example output
INFO[0000] Found 2 CDI devices
nvidia.com/gpu=0
nvidia.com/gpu=all
```

## Setup your container runtime (crun + wasmedge + plugin system)

Build crun with wasmedge  and plugin system both enable 

```bash
> sudo apt install -y make git gcc build-essential pkgconf libtool libsystemd-dev libprotobuf-c-dev libcap-dev libseccomp-dev libyajl-dev go-md2man libtool autoconf python3 automake

> git clone -b enable-wasmedge-plugin https://github.com/second-state/crun
> cd crun
> ./autogen.sh
> ./configure --with-wasmedge
> make

# Check your crun
> ./crun --version
```

Download ggml plugin into host
```bash
> curl -sSf https://raw.githubusercontent.com/WasmEdge/WasmEdge/master/utils/install.sh | bash -s -- --plugins wasi_nn-ggml

# Make sure all your plugin dependencies is good
> ldd ~/.wasmedge/plugin/libwasmedgePluginWasiNN.so
```

## Demo llama with our wasm application 

> The demo image is built the Wasm application from [here](https://github.com/second-state/WasmEdge-WASINN-examples/tree/master/wasmedge-ggml/llama), and upload it to [here](https://github.com/captainvincent/runwasi/pkgs/container/runwasi-demo/195178675?tag=wasmedge-ggml-llama).

Download inference model
```bash
> curl -LO https://huggingface.co/second-state/Llama-2-7B-Chat-GGUF/resolve/main/llama-2-7b-chat.Q5_K_M.gguf
```

Podman run llama2 inference

> You need to replace the  `<podman path>` and `<crun path>` with your binary path in the following command.

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

Example Result
```
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
