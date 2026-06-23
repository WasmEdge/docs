---
sidebar_position: 4
---

# Build with WasmEdge-FFmpeg Plug-in

The WasmEdge-FFmpeg plug-in provides WebAssembly bindings to the [FFmpeg](https://ffmpeg.org/) multimedia framework, enabling WasmEdge applications to encode, decode, transcode, mux, demux, stream, filter, and play audio and video content. It wraps the core FFmpeg libraries: `libavcodec`, `libavformat`, `libavfilter`, `libavdevice`, `libavutil`, `libswresample`, and `libswscale`.

## Prerequisites

Install the FFmpeg development libraries on your system.

For Ubuntu 20.04:

```bash
sudo apt update
sudo apt install -y libavdevice-dev libavfilter-dev libavformat-dev \
  libavcodec-dev libswresample-dev libswscale-dev libavutil-dev
```

For macOS:

```bash
brew install ffmpeg
```

## Build WasmEdge with WasmEdge-FFmpeg Plug-in

To enable the WasmEdge-FFmpeg plug-in, developers need to [build WasmEdge from source](../os/linux.md) with the cmake option `-DWASMEDGE_PLUGIN_FFMPEG=ON`.

```bash
cd <path/to/your/wasmedge/source/folder>
cmake -GNinja -Bbuild -DCMAKE_BUILD_TYPE=Release -DWASMEDGE_PLUGIN_FFMPEG=ON
cmake --build build
cmake --install build
```

<!-- prettier-ignore -->
:::note
If the built `wasmedge` CLI tool cannot find the WasmEdge-FFmpeg plug-in, you can set the `WASMEDGE_PLUGIN_PATH` environment variable to the plug-in installation path (such as `/usr/local/lib/wasmedge/`, or the built plug-in path `build/plugins/wasmedge_ffmpeg/`) to try to fix this issue.
:::

Then you will have an executable `wasmedge` runtime under `/usr/local/bin` and the WasmEdge-FFmpeg plug-in under `/usr/local/lib/wasmedge/libwasmedgePluginWasmEdgeFFmpeg.so` after installation.

For more information, you can refer to the [GitHub repository](https://github.com/WasmEdge/WasmEdge/tree/master/plugins/wasmedge_ffmpeg).
