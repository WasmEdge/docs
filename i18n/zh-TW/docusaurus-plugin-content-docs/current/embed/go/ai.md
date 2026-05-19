---
sidebar_position: 5
---

# 使用 TensorFlow 進行 AI 推論

<!-- prettier-ignore -->
:::note
WasmEdge 延伸功能在 v0.12.1 版之後已被棄用。我們未來將更新為使用 WasmEdge 外掛。
:::

在本節中,我們會示範如何在 Rust 中建立一個 TensorFlow 或 TensorFlow-Lite 推論函式進行影像分類,並把它嵌入到 Go 應用程式中。專案原始碼[可在這裡取得](https://github.com/second-state/WasmEdge-go-examples/blob/master/go_TfliteFood/)。

## 以 Rust 撰寫的 WASM 應用程式

用於影像分類的 Rust 函式[可在這裡取得](https://github.com/second-state/WasmEdge-go-examples/blob/master/go_TfliteFood/rust_tflite_food/src/lib.rs)。它使用 WasmEdge Tensorflow Lite 外掛,以及用於傳遞呼叫參數的 [wasmedge_bindgen](function.md)。

```rust
#[wasmedge_bindgen]
fn infer(image_data: Vec<u8>) -> Result<Vec<u8>, String> {
  let img = image::load_from_memory(&image_data).unwrap().to_rgb8();
  let flat_img = image::imageops::thumbnail(&img, 192, 192);

  let model_data: &[u8] = include_bytes!("lite-model_aiy_vision_classifier_food_V1_1.tflite");
  let labels = include_str!("aiy_food_V1_labelmap.txt");

  let mut session = wasmedge_tensorflow_interface::TFLiteSession::new(model_data);
  session.add_input("input", &flat_img).run();
  let res_vec: Vec<u8> = session.get_output("MobilenetV1/Predictions/Softmax");
  ... ...
}
```

## 將 Rust 程式碼編譯為 Wasm

你可以用標準的 `Cargo` 命令建置一個 WebAssembly 函式。

```bash
git clone https://github.com/second-state/WasmEdge-go-examples.git
cd go_TfliteFood/rust_tflite_food
cargo build --target wasm32-wasip1 --release
cp target/wasm32-wasip1/release/rust_tflite_food_lib.wasm ../
cd ../
```

你可以使用我們的 AOT 編譯器 `wasmedge compile` 來處理 WebAssembly 檔案以加快其執行速度。[了解更多](../../start/build-and-run/aot.md)。

```bash
wasmedge compile rust_tflite_food_lib.wasm rust_tflite_food_lib.wasm
```

## Go 主機應用程式

[Go 主機應用程式](https://github.com/second-state/WasmEdge-go-examples/blob/master/go_TfliteFood/tflite_food.go)的原始碼示範如何建立帶有 Tensorflow 延伸功能的 WasmEdge 執行環境,以及如何將影像資料傳給 WasmEdge 中的 Rust 函式來執行推論。

```go
import (
  "fmt"
  "io/ioutil"
  "os"

  "github.com/second-state/WasmEdge-go/wasmedge"
  bindgen "github.com/second-state/wasmedge-bindgen/host/go"
)

func main() {
  fmt.Println("Go: Args:", os.Args)
  // Expected Args[0]: program name (./mobilenet)
  // Expected Args[1]: wasm file (rust_mobilenet_lib.wasm)
  // Expected Args[2]: input image name (grace_hopper.jpg)

  // Set not to print debug info
  wasmedge.SetLogErrorLevel()

  // Set Tensorflow not to print debug info
  os.Setenv("TF_CPP_MIN_LOG_LEVEL", "3")
  os.Setenv("TF_CPP_MIN_VLOG_LEVEL", "3")

  // Load WasmEdge-image and WasmEdge-tensorflow from default path
  wasmedge.LoadPluginDefaultPaths()

  // Create configure
  var conf = wasmedge.NewConfigure(wasmedge.WASI)

  // Create VM with configure
  var vm = wasmedge.NewVMWithConfig(conf)

  // Init WASI
  var wasi = vm.GetImportModule(wasmedge.WASI)
  wasi.InitWasi(
    os.Args[1:],     // The args
    os.Environ(),    // The envs
    []string{".:."}, // The mapping preopens
  )

  // Load and validate the wasm
  vm.LoadWasmFile(os.Args[1])
  vm.Validate()

  // Instantiate the bindgen and vm
  bg := bindgen.New(vm)
  bg.Instantiate()

  img, _ := ioutil.ReadFile(os.Args[2])
  if res, _, err := bg.Execute("infer", img); err != nil {
    fmt.Println(err)
  } else {
    fmt.Println(res[0].(string))
  }

  bg.Release()
  vm.Release()
  conf.Release()
}
```

## 從你的 Go 主機建置並執行 wasm 應用程式

<!-- prettier-ignore -->
:::note
請確認你已安裝 [Go、WasmEdge 與帶有 TensorFlow 延伸功能的 WasmEdge Go SDK](intro.md)。
:::

使用 WasmEdge Go SDK 建置 Go 主機應用程式。

```bash
go build
```

現在你可以執行這個 Go 應用程式。它會呼叫 WasmEdge 中的 WebAssembly 函式對輸入影像進行推論。

```bash
./tflite_food rust_tflite_food_lib.wasm food.jpg
```

結果如下。

```bash
Go: Args: [./tflite_food rust_tflite_food_lib.wasm food.jpg]
It is very likely a Hot dog in the picture
```
