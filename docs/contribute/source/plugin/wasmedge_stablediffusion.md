---
sidebar_position: 11
---

# Build with WasmEdge Stable Diffusion Plug-in

The WasmEdge Stable Diffusion plug-in enables WebAssembly applications to run image generation and image-to-image inference workloads using the [stable-diffusion.cpp](https://github.com/leejet/stable-diffusion.cpp) backend. It supports CPU inference out of the box, with optional CUDA and Metal acceleration for GPU-backed environments.

## Prerequisites

The Stable Diffusion plug-in has no mandatory system library dependencies — the `stable-diffusion.cpp` source is fetched automatically via CMake's `FetchContent` during the build. However, for GPU-accelerated builds, the following are required:

- **CUDA** (for NVIDIA GPUs): Install the [CUDA Toolkit](https://developer.nvidia.com/cuda-downloads) appropriate for your platform.
- **Metal** (for Apple Silicon): Available by default on macOS with Xcode command-line tools installed.
- **OpenMP** (optional, for multi-threaded CPU inference): Install via your system package manager.

For Ubuntu:

```bash
sudo apt update
sudo apt install -y build-essential
# Optional: for OpenMP support
sudo apt install -y libomp-dev
```

For macOS:

```bash
xcode-select --install
```

## Build WasmEdge with the Stable Diffusion Plug-in

To enable the WasmEdge Stable Diffusion plug-in, developers need to [build WasmEdge from source](../build_from_src.md) with the cmake option `-DWASMEDGE_PLUGIN_STABLEDIFFUSION=ON`.

```bash
cd <path/to/your/wasmedge/source/folder>
cmake -GNinja -Bbuild -DCMAKE_BUILD_TYPE=Release \
  -DWASMEDGE_PLUGIN_STABLEDIFFUSION=ON
cmake --build build
cmake --install build
```

### Optional: Enable CUDA Acceleration

```bash
cmake -GNinja -Bbuild -DCMAKE_BUILD_TYPE=Release \
  -DWASMEDGE_PLUGIN_STABLEDIFFUSION=ON \
  -DWASMEDGE_PLUGIN_STABLEDIFFUSION_CUDA=ON
cmake --build build
cmake --install build
```

### Optional: Enable Metal Acceleration (Apple Silicon)

```bash
cmake -GNinja -Bbuild -DCMAKE_BUILD_TYPE=Release \
  -DWASMEDGE_PLUGIN_STABLEDIFFUSION=ON \
  -DWASMEDGE_PLUGIN_STABLEDIFFUSION_METAL=ON
cmake --build build
cmake --install build
```

### Optional: Enable OpenMP

```bash
cmake -GNinja -Bbuild -DCMAKE_BUILD_TYPE=Release \
  -DWASMEDGE_PLUGIN_STABLEDIFFUSION=ON \
  -DWASMEDGE_PLUGIN_STABLEDIFFUSION_OPENMP=ON
cmake --build build
cmake --install build
```

<!-- prettier-ignore -->
:::note
If the built `wasmedge` CLI tool cannot find the Stable Diffusion plug-in, you can set the `WASMEDGE_PLUGIN_PATH` environment variable to the plug-in installation path (such as `/usr/local/lib/wasmedge/`, or the built plug-in path `build/plugins/wasmedge_stablediffusion/`) to try to fix this issue.
:::

Then you will have an executable `wasmedge` runtime under `/usr/local/bin` and the Stable Diffusion plug-in under `/usr/local/lib/wasmedge/libwasmedgePluginStableDiffusion.so` after installation.

## More Information

- [WasmEdge Stable Diffusion Plug-in source on GitHub](https://github.com/WasmEdge/WasmEdge/tree/master/plugins/wasmedge_stablediffusion)
- [stable-diffusion.cpp upstream](https://github.com/leejet/stable-diffusion.cpp)
