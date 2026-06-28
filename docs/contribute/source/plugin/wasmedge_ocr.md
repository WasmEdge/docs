---
sidebar_position: 5
---

# Build with WasmEdge-OCR Plug-in

The WasmEdge-OCR plug-in provides optical character recognition (OCR) capabilities to WebAssembly applications running on WasmEdge. It is powered by [Tesseract](https://github.com/tesseract-ocr/tesseract), an open-source OCR engine, and [Leptonica](http://leptonica.org/), its image processing dependency.

## Prerequisites

Install Tesseract and Leptonica development libraries on your system.

For Ubuntu 20.04:

```bash
sudo apt update
sudo apt install -y libtesseract-dev libleptonica-dev
```

For macOS:

```bash
brew install tesseract leptonica
```

## Build WasmEdge with WasmEdge-OCR Plug-in

To enable the WasmEdge-OCR plug-in, developers need to [build WasmEdge from source](../build_from_src.md) with the cmake option `-DWASMEDGE_PLUGIN_OCR=ON`.

```bash
cd <path/to/your/wasmedge/source/folder>
cmake -GNinja -Bbuild -DCMAKE_BUILD_TYPE=Release -DWASMEDGE_PLUGIN_OCR=ON
cmake --build build
cmake --install build
```

<!-- prettier-ignore -->
:::note
If the built `wasmedge` CLI tool cannot find the WasmEdge-OCR plug-in, you can set the `WASMEDGE_PLUGIN_PATH` environment variable to the plug-in installation path (such as `/usr/local/lib/wasmedge/`, or the built plug-in path `build/plugins/wasmedge_ocr/`) to try to fix this issue.
:::

Then you will have an executable `wasmedge` runtime under `/usr/local/bin` and the WasmEdge-OCR plug-in under `/usr/local/lib/wasmedge/libwasmedgePluginWasmEdgeOCR.so` after installation.

For more information, you can refer to the [GitHub repository](https://github.com/WasmEdge/WasmEdge/tree/master/plugins/wasmedge_ocr).
