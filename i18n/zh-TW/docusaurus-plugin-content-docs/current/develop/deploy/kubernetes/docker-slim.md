---
sidebar_position: 11
---

# WasmEdge DockerSlim

`wasmedge/slim:{version}` Docker 映像檔在每次發佈時都會提供使用 [DockerSlim](https://dockersl.im) 建置的精簡 WasmEdge 映像檔。

- 映像檔 `wasmedge/slim-runtime:{version}` 僅包含 WasmEdge 執行環境與 `wasmedge` 命令。
- 映像檔 `wasmedge/slim:{version}` 包含下列命令列工具:
  - `wasmedge`
  - `wasmedge compile`
- 映像檔 `wasmedge/slim-tf:{version}` 包含下列命令列工具:
  - `wasmedge`
  - `wasmedge compile`
  - `wasmedge-tensorflow-lite`
  - `wasmedge-tensorflow`
  - `show-tflite-tensor`
- 發佈版 docker 映像檔的工作目錄為 `/app`。

<!-- prettier-ignore -->
:::note
`wasmedgec` 的用法等同於 `wasmedge compile`。我們決定在未來棄用 `wasmedgec`。
:::

## 範例

使用 `wasmedge compile` 與 `wasmedge`([連結](https://github.com/WasmEdge/WasmEdge/tree/master/examples/wasm)):

```bash
$ docker pull wasmedge/slim:{{ wasmedge_version }}

$ docker run -it --rm -v $PWD:/app wasmedge/slim:{{ wasmedge_version }} wasmedge compile hello.wasm hello.aot.wasm
[2022-07-07 08:15:49.154] [info] compile start
[2022-07-07 08:15:49.163] [info] verify start
[2022-07-07 08:15:49.169] [info] optimize start
[2022-07-07 08:15:49.808] [info] codegen start
[2022-07-07 08:15:50.419] [info] output start
[2022-07-07 08:15:50.421] [info] compile done
[2022-07-07 08:15:50.422] [info] output start

$ docker run -it --rm -v $PWD:/app wasmedge/slim:{{ wasmedge_version }} wasmedge hello.aot.wasm world
hello
world
```

使用 `wasmedge-tensorflow-lite`([連結](https://github.com/WasmEdge/WasmEdge/tree/master/examples/js)):

```bash
$ docker pull wasmedge/slim-tf:{{ wasmedge_version }}
$ wget https://raw.githubusercontent.com/second-state/wasmedge-quickjs/main/example_js/tensorflow_lite_demo/aiy_food_V1_labelmap.txt
$ wget https://raw.githubusercontent.com/second-state/wasmedge-quickjs/main/example_js/tensorflow_lite_demo/food.jpg
$ wget https://raw.githubusercontent.com/second-state/wasmedge-quickjs/main/example_js/tensorflow_lite_demo/lite-model_aiy_vision_classifier_food_V1_1.tflite
$ wget https://raw.githubusercontent.com/second-state/wasmedge-quickjs/main/example_js/tensorflow_lite_demo/main.js

$ docker run -it --rm -v $PWD:/app wasmedge/slim-tf:{{ wasmedge_version }} wasmedge-tensorflow-lite --dir .:. qjs_tf.wasm main.js
label:
Hot dog
confidence:
0.8941176470588236
```
