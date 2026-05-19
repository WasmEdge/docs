---
sidebar_position: 2
---

# YoMo 框架

[YoMo](https://yomo.run/) 是一個程式設計框架，讓開發者能建構分散式雲端系統（Geo-Distributed Cloud System）。YoMo 的通訊層建構於 QUIC 協定之上，帶來高速的資料傳輸。此外，它內建了串流無伺服器「串流函式」，大幅改善了分散式雲端系統的開發體驗。由 YoMo 建構的分散式雲端系統，提供近場運算能力與終端裝置之間的超高速通訊機制。它在 Metaverse、VR/AR、IoT 等場景中有許多使用案例。

YoMo 是以 Go 語言撰寫的。在串流無伺服器方面，使用 Golang 的外掛與共享函式庫來動態載入使用者的程式碼，這對開發者也存在一定的限制。隨著無伺服器架構對隔離性有著嚴格的需求，WebAssembly 是執行使用者定義函式的絕佳選擇。

例如在 AR/VR 裝置或智慧工廠中的即時 AI 推論裡，攝影機透過 YoMo 將即時的非結構化資料傳送到近場 MEC（多重存取邊緣運算）裝置中的運算節點。當 AI 推論完成後，YoMo 會即時將 AI 運算結果傳送至終端裝置。因此，所託管的 AI 推論函式會被自動執行。

然而，對 YoMo 而言，一項挑戰是要整合並管理由多位外部開發者所撰寫的處理函式於邊緣運算節點中。它需要對這些函式進行執行環境的隔離，又不能犧牲效能。傳統的軟體容器解決方案（如 Docker）需要更新才能勝任此任務。它們必須更輕量、更快速，才能處理即時任務。

WebAssembly 提供了輕量且高效能的軟體容器。它非常適合作為 YoMo 資料處理處理函式的執行環境。

本文將示範如何建立一個基於 Tensorflow 的影像分類 Rust 函式，將其編譯為 WebAssembly，然後使用 YoMo 將它作為串流資料處理函式來執行。我們使用 [WasmEdge](https://wasmedge.org/) 作為我們的 WebAssembly 執行環境，因為相較於其他 WebAssembly 執行環境，它提供了最高的效能與彈性。它是唯一能可靠支援 Tensorflow 的 WebAssembly VM。YoMo 透過 [WasmEdge 的 Golang API](../go/intro.md) 管理 WasmEdge VM 實例及其中包含的 WebAssembly 位元組碼應用程式。

<!-- prettier-ignore -->
:::note
原始碼：<https://github.com/yomorun/yomo-wasmedge-tensorflow>
:::

查看 [WasmEdge 在 YoMo 中執行影像分類函式的實際操作](https://www.youtube.com/watch?v=E0ltsn6cLIU)

## 前置條件

您需要先 [安裝 Golang](https://golang.org/doc/install)，但我假設您已經安裝好了。

<!-- prettier-ignore -->
:::note
Golang 版本需要新於 1.15，我們的範例才能正常運作。
:::

您還需要安裝 YoMo CLI 應用程式。它負責協調與調度資料串流與處理函式的呼叫。

```bash
$ go install github.com/yomorun/cli/yomo@latest
$ yomo version
YoMo CLI version: v0.1.3
```

接下來，請安裝 WasmEdge 及其 Tensorflow 共享函式庫。[WasmEdge](https://wasmedge.org/) 是由 CNCF 託管的領先 WebAssembly 執行環境。我們將使用它從 YoMo 中嵌入並執行 WebAssembly 程式。

```bash
curl -sSf https://raw.githubusercontent.com/WasmEdge/WasmEdge/master/utils/install.sh | bash
```

最後，由於我們的範例 WebAssembly 函式是以 Rust 撰寫的，您需要安裝 [Rust 編譯器](https://www.rust-lang.org/tools/install)。

關於本範例的其餘部分，請 fork 並複製 [原始碼儲存庫](https://github.com/yomorun/yomo-wasmedge-tensorflow)。

```bash
git clone https://github.com/yomorun/yomo-wasmedge-tensorflow.git
```

## 影像分類函式

用來處理 YoMo 影像串流的 [影像分類函式](https://github.com/yomorun/yomo-wasmedge-tensorflow/tree/main/flow/rust_mobilenet_food) 是以 Rust 撰寫的。它利用 WasmEdge Tensorflow API 來處理輸入的影像。

```rust
#[wasmedge_bindgen]
pub fn infer(image_data: Vec<u8>) -> Result<Vec<u8>, String> {
  let start = Instant::now();

  // Load the TFLite model and its metadata (the text label for each recognized object number)
  let model_data: &[u8] = include_bytes!("lite-model_aiy_vision_classifier_food_V1_1.tflite");
  let labels = include_str!("aiy_food_V1_labelmap.txt");

  // Pre-process the image to a format that this model can use
  let flat_img = wasmedge_tensorflow_interface::load_jpg_image_to_rgb8(&image_data[..], 192, 192);
  println!("RUST: Loaded image in ... {:?}", start.elapsed());

  // Run the TFLite model using the WasmEdge Tensorflow API
  let mut session = wasmedge_tensorflow_interface::Session::new(&model_data, wasmedge_tensorflow_interface::ModelType::TensorFlowLite);
  session.add_input("input", &flat_img, &[1, 192, 192, 3])
         .run();
  let res_vec: Vec<u8> = session.get_output("MobilenetV1/Predictions/Softmax");

  // Find the object index in res_vec that has the greatest probability
  // Translate the probability into a confidence level
  // Translate the object index into a label from the model metadata food_name
  let mut i = 0;
  let mut max_index: i32 = -1;
  let mut max_value: u8 = 0;
  while i < res_vec.len() {
    let cur = res_vec[i];
    if cur > max_value {
      max_value = cur;
      max_index = i as i32;
    }
    i += 1;
  }
  println!("RUST: index {}, prob {}", max_index, max_value);

  let confidence: String;
  if max_value > 200 {
    confidence = "is very likely".to_string();
  } else if max_value > 125 {
    confidence = "is likely".to_string();
  } else {
    confidence = "could be".to_string();
  }

  let ret_str: String;
  if max_value > 50 {
    let mut label_lines = labels.lines();
    for _i in 0..max_index {
      label_lines.next();
    }
    let food_name = label_lines.next().unwrap().to_string();
    ret_str = format!(
      "It {} a <a href='https://www.google.com/search?q={}'>{}</a> in the picture",
      confidence, food_name, food_name
    );
  } else {
    ret_str = "It does not appears to be a food item in the picture.".to_string();
  }

  println!(
    "RUST: Finished post-processing in ... {:?}",
    start.elapsed()
  );
  return Ok(ret_str.as_bytes().to_vec());
}
```

您應該為 Rust 加入 `wasm32-wasip1` 目標，以將此函式編譯成 WebAssembly 位元組碼。

```bash
rustup target add wasm32-wasip1

cd flow/rust_mobilenet_food
cargo build --target wasm32-wasip1 --release
# The output WASM will be target/wasm32-wasip1/release/rust_mobilenet_food_lib.wasm

# Copy the wasm bytecode file to the flow/ directory
cp target/wasm32-wasip1/release/rust_mobilenet_food_lib.wasm ../
```

為了發揮 WasmEdge 的最佳效能，您應該將 `.wasm` 檔案編譯為 `.so` 來啟用 AOT 模式。

```bash
wasmedge compile rust_mobilenet_food_lib.wasm rust_mobilenet_food_lib.so
```

## 與 YoMo 整合

在 YoMo 這一端，我們使用 WasmEdge Golang API 來啟動並執行 WasmEdge VM 以執行影像分類函式。原始碼專案中的 [app.go](https://github.com/yomorun/yomo-wasmedge-tensorflow/blob/main/flow/app.go) 檔案如下。

```go
package main

import (
  "crypto/sha1"
  "fmt"
  "log"
  "os"
  "sync/atomic"

  "github.com/second-state/WasmEdge-go/wasmedge"
  bindgen "github.com/second-state/wasmedge-bindgen/host/go"
  "github.com/yomorun/yomo"
)

var (
  counter uint64
)

const ImageDataKey = 0x10

func main() {
  // Connect to Zipper service
  sfn := yomo.NewStreamFunction("image-recognition", yomo.WithZipperAddr("localhost:9900"))
  defer sfn.Close()

  // set only monitoring data
  sfn.SetObserveDataID(ImageDataKey)

  // set handler
  sfn.SetHandler(Handler)

  // start
  err := sfn.Connect()
  if err != nil {
    log.Print("❌ Connect to zipper failure: ", err)
    os.Exit(1)
  }

  select {}
}

// Handler processes the data in the stream
func Handler(img []byte) (byte, []byte) {
  // Initialize WasmEdge's VM
  vmConf, vm := initVM()
  bg := bindgen.Instantiate(vm)
  defer bg.Release()
  defer vm.Release()
  defer vmConf.Release()

  // recognize the image
  res, err := bg.Execute("infer", img)
  if err == nil {
    fmt.Println("GO: Run bindgen -- infer:", string(res))
  } else {
    fmt.Println("GO: Run bindgen -- infer FAILED")
  }

  // print logs
  hash := genSha1(img)
  log.Printf("✅ received image-%d hash %v, img_size=%d \n", atomic.AddUint64(&counter, 1), hash, len(img))

  return 0x11, nil
}

// genSha1 generate the hash value of the image
func genSha1(buf []byte) string {
  h := sha1.New()
  h.Write(buf)
  return fmt.Sprintf("%x", h.Sum(nil))
}

// initVM initialize WasmEdge's VM
func initVM() (*wasmedge.Configure, *wasmedge.VM) {
  wasmedge.SetLogErrorLevel()
  // Set Tensorflow not to print debug info
  os.Setenv("TF_CPP_MIN_LOG_LEVEL", "3")
  os.Setenv("TF_CPP_MIN_VLOG_LEVEL", "3")

  // Create configure
  vmConf := wasmedge.NewConfigure(wasmedge.WASI)

  // Create VM with configure
  vm := wasmedge.NewVMWithConfig(vmConf)

  // Init WASI
  var wasi = vm.GetImportObject(wasmedge.WASI)
  wasi.InitWasi(
    os.Args[1:],     // The args
    os.Environ(),    // The envs
    []string{".:."}, // The mapping directories
  )

  // Register WasmEdge-tensorflow and WasmEdge-image
  var tfobj = wasmedge.NewTensorflowImportObject()
  var tfliteobj = wasmedge.NewTensorflowLiteImportObject()
  vm.RegisterImport(tfobj)
  vm.RegisterImport(tfliteobj)
  var imgobj = wasmedge.NewImageImportObject()
  vm.RegisterImport(imgobj)

  // Instantiate wasm
  vm.LoadWasmFile("rust_mobilenet_food_lib.so")
  vm.Validate()

  return vmConf, vm
}
```

## 實際執行

最後，我們可以啟動 YoMo 並看看整個資料處理流程。從專案資料夾啟動 YoMo CLI 應用程式。[yaml 檔案](https://github.com/yomorun/yomo-wasmedge-tensorflow/blob/main/zipper/workflow.yaml) 定義了 YoMo 應該監聽的連接埠，以及收到資料時要觸發的工作流程處理函式。請注意，流程名稱 `image-recognition` 與前述資料處理函式 [app.go](https://github.com/yomorun/yomo-wasmedge-tensorflow/blob/main/flow/app.go) 中的名稱相符。

```bash
yomo serve -c ./zipper/workflow.yaml
```

執行前述的 [app.go](https://github.com/yomorun/yomo-wasmedge-tensorflow/blob/main/flow/app.go) 程式以啟動處理函式。

```bash
cd flow
go run --tags "tensorflow image" app.go
```

[啟動一個模擬的資料來源](https://github.com/yomorun/yomo-wasmedge-tensorflow/blob/main/source/main.go)，透過將影片送至 YoMo。影片是一系列的影像框架。[app.go](https://github.com/yomorun/yomo-wasmedge-tensorflow/blob/main/flow/app.go) 中的 WasmEdge 函式會針對影片中的每一個影像框架被呼叫。

```bash
# Download a video file
wget -P source 'https://github.com/yomorun/yomo-wasmedge-tensorflow/releases/download/v0.1.0/hot-dog.mp4'

# Stream the video to YoMo
go run ./source/main.go ./source/hot-dog.mp4
```

您可以在主控台看到來自 WasmEdge 處理函式的輸出。它會印出影片中每個影像框架中所偵測到的物件名稱。

## 後續發展

本文展示了如何在 YoMo 框架中使用 WasmEdge Tensorflow API 與 Golang SDK 來近乎即時地處理影像串流。

我們即將與 YoMo 合作，將 WasmEdge 部署到智慧工廠的生產環境中，用於各種裝配線任務。WasmEdge 就是邊緣運算的軟體執行環境！
