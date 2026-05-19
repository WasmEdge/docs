---
sidebar_position: 8
---

# WasmEdge 的 TensorFlow 與 TensorFlow-Lite 外掛

開發者可以使用 [WASI-NN](https://github.com/WebAssembly/wasi-nn) 對模型進行推論。然而，對於 TensorFlow 與 TensorFlow-Lite 的使用者來說，WASI-NN API 在擷取輸入與輸出張量時，可能不夠友善。因此 WasmEdge 提供了 TensorFlow 相關的外掛與 rust SDK，可用於在 WASM 中對模型進行推論。

<!-- prettier-ignore -->
:::info
此外掛並非 WASI-NN 相容外掛。若您要尋找可搭配 [WASI-NN crate](https://crates.io/crates/wasi-nn) 使用的外掛，請改參考 [tensorflow-lite 後端](tensorflow_lite.md)。
:::

## 必要條件

請確認[您已安裝 Rust 與 WasmEdge](../setup.md)。

開發者會將 [`wasmedge_tensorflow_interface` crate](https://crates.io/crates/wasmedge_tensorflow_interface) 加入其 `Rust -> Wasm` 應用程式作為相依性。例如，在應用程式的 `Cargo.toml` 檔案中加入下列這一行。

```toml
[dependencies]
wasmedge_tensorflow_interface = "0.3.0"
```

開發者會將 `wasmedge_tensorflow_interface` 的函式引入 `Rust -> Wasm` 應用程式的程式碼範圍中。例如，將下列程式碼加入 `main.rs` 的開頭。

```rust
use wasmedge_tensorflow_interface;
```

## 影像載入與轉換

在這個 crate 中，我們提供了多個函式，可使用 `WasmEdge-Image` 主機函式將影像解碼並轉換為張量。

若要在 WASM 中使用這些函式並於 WasmEdge 中執行，使用者應[安裝具備 WasmEdge-Image 外掛的 WasmEdge](../../../start/install.md#wasmedge-image-plug-in)。

對於 `JPEG` 影像的解碼，有：

```rust
// Function to decode JPEG from buffer and resize to RGB8 format.
pub fn load_jpg_image_to_rgb8(img_buf: &[u8], w: u32, h: u32) -> Vec<u8>
// Function to decode JPEG from buffer and resize to BGR8 format.
pub fn load_jpg_image_to_bgr8(img_buf: &[u8], w: u32, h: u32) -> Vec<u8>
// Function to decode JPEG from buffer and resize to RGB32F format.
pub fn load_jpg_image_to_rgb32f(img_buf: &[u8], w: u32, h: u32) -> Vec<f32>
// Function to decode JPEG from buffer and resize to BGR32F format.
pub fn load_jpg_image_to_rgb32f(img_buf: &[u8], w: u32, h: u32) -> Vec<f32>
```

對於 `PNG` 影像的解碼，有：

```rust
// Function to decode PNG from buffer and resize to RGB8 format.
pub fn load_png_image_to_rgb8(img_buf: &[u8], w: u32, h: u32) -> Vec<u8>
// Function to decode PNG from buffer and resize to BGR8 format.
pub fn load_png_image_to_bgr8(img_buf: &[u8], w: u32, h: u32) -> Vec<u8>
// Function to decode PNG from buffer and resize to RGB32F format.
pub fn load_png_image_to_rgb32f(img_buf: &[u8], w: u32, h: u32) -> Vec<f32>
// Function to decode PNG from buffer and resize to BGR32F format.
pub fn load_png_image_to_rgb32f(img_buf: &[u8], w: u32, h: u32) -> Vec<f32>
```

開發者可以依下列方式載入、解碼並調整影像大小：

```rust
let mut file_img = File::open("sample.jpg").unwrap();
let mut img_buf = Vec::new();
file_img.read_to_end(&mut img_buf).unwrap();
let flat_img = wasmedge_tensorflow_interface::load_jpg_image_to_rgb32f(&img_buf, 224, 224);
// The flat_img is a vec<f32> which contains normalized image in rgb32f format and resized to 224x224.
```

## 推論 TensorFlow 與 TensorFlow-Lite 模型

要使用 `TFSession` 結構在 WasmEdge 中推論 TensorFlow 模型，使用者應安裝 [WasmEdge-TensorFlow 外掛及相依套件](../../../start/install.md#wasmedge-tensorflow-plug-in)。

要使用 `TFLiteSession` 結構並在 WasmEdge 中推論 TensorFlow-Lite 模型，使用者應安裝 [WasmEdge-TensorFlowLite 外掛及相依套件](../../../start/install.md#wasmedge-tensorflow-lite-plug-in)。

### 建立 Session

首先，開發者應建立一個 session，以載入 TensorFlow 或 TensorFlow-Lite 模型。

```rust
// The mod_buf is a vec<u8> which contains the model data.
let mut session = wasmedge_tensorflow_interface::TFSession::new(&mod_buf);
```

上述函式會建立用於 TensorFlow frozen 模型的 session。開發者可以使用 `new_from_saved_model` 函式從 saved-models 建立：

```rust
// The mod_path is a &str which is the path to saved-model directory.
// The second argument is the list of tags.
let mut session = wasmedge_tensorflow_interface::TFSession::new_from_saved_model(model_path, &["serve"]);
```

或使用 `TFLiteSession` 來建立用於推論 `tflite` 模型的 session。

```rust
// The mod_buf is a vec<u8> which contains the model data.
let mut session = wasmedge_tensorflow_interface::TFLiteSession::new(&mod_buf);
```

### 準備輸入張量

```rust
// The flat_img is a vec<f32> which contains normalized image in rgb32f format.
session.add_input("input", &flat_img, &[1, 224, 224, 3])
       .add_output("MobilenetV2/Predictions/Softmax");
```

### 執行 TensorFlow 模型

```rust
session.run();
```

### 轉換輸出張量

```rust
let res_vec: Vec<f32> = session.get_output("MobilenetV2/Predictions/Softmax");
```

## 建置與執行

當您完成程式碼後，可以依下列命令編譯為 WASM。

```bash
cargo build --target=wasm32-wasip1
```

輸出的 WASM 檔案會位於 `target/wasm32-wasip1/debug/` 或 `target/wasm32-wasip1/release`。

關於 WASM 的執行，請參考 [WasmEdge CLI](../../../start/build-and-run/cli.md)。

## 範例

<!-- prettier-ignore -->
:::info
建置中
:::
