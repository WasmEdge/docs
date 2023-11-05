---
sidebar_position: 2
---

# Mediapipe solutions

Mediapipe is a collection of highly popular AI models developed by Google. They focus on intelligent processing of media files and streams. The `mediapipe-rs` crate is a Rust library for data processing using the Mediapipe suite of models. The crate provides Rust APIs to pre-process the data in media files or streams, run AI model inference to analyze the data, and then post-process or manipulate the media data based on the AI output.

## Prerequisite

Besides the [regular WasmEdge and Rust requirements](../../rust/setup.md), please make sure that you have the [WASI-NN plugin with TensorFlow Lite installed](../../../start/install.md#wasi-nn-plug-in-with-tensorflow-lite-backend).

## Quick start

Clone the following demo project to your local computer or dev environment.

```bash
git clone https://github.com/juntao/demo-object-detection
cd demo-object-detection/
```

Build an inference application using the Mediapipe object detection model.

```bash
cargo build --target wasm32-wasi --release
wasmedge compile target/wasm32-wasi/release/demo-object-detection.wasm demo-object-detection.wasm
```

Run the inference application against an image. The input `example.jpg` image is shown below.

![The input image](https://raw.githubusercontent.com/juntao/demo-object-detection/main/example.jpg)

```bash
wasmedge --dir .:. demo-object-detection.wasm example.jpg output.jpg
```

The inference result `output.jpg` image is shown below.

![The output image](https://raw.githubusercontent.com/WasmEdge/mediapipe-rs/main/assets/doc/cat_and_dog_detection.jpg)

The console output from the above inference command shows the detected objects and their boundaries.

```bash
DetectionResult:
  Detection #0:
    Box: (left: 0.47665566, top: 0.05484602, right: 0.87270254, bottom: 0.87143743)
    Category #0:
      Category name: "dog"
      Display name:  None
      Score:         0.7421875
      Index:         18
  Detection #1:
    Box: (left: 0.12402746, top: 0.37931007, right: 0.5297544, bottom: 0.8517805)
    Category #0:
      Category name: "cat"
      Display name:  None
      Score:         0.7421875
      Index:         17
```

## Understand the code

The [main.rs](https://github.com/juntao/demo-object-detection/blob/main/src/main.rs) is the complete example Rust source. All `mediapipe-rs` APIs follow a common pattern. A Rust struct is designed to work with a model. It contains functions required to pre- and post-process data for the model. For example, we can create an `detector` instance using the builder pattern, which can build from any "object detection" model in the Mediapipe model library.

```rust
let model_data: &[u8] = include_bytes!("mobilenetv2_ssd_256_uint8.tflite");
let detector = ObjectDetectorBuilder::new()
        .max_results(2)
        .build_from_buffer(model_data)?;
```

The `detect()` function takes in an image, pre-processes it into a tensor array, runs inference on the mediapipe object detection model, and the post-processes the returned tensor array into a human readable format stored in the `detection_result`.

```rust
let mut input_img = image::open(img_path)?;
let detection_result = detector.detect(&input_img)?;
println!("{}", detection_result);
```

Furthermore, the `mediapipe-rs` crate provides additional utility functions to post-process the data. For example, the `draw_detection()` utility function draws the data in `detection_result` onto the input image.

```rust
draw_detection(&mut input_img, &detection_result);
input_img.save(output_path)?;
```

## Available mediapipe models

`AudioClassifierBuilder` builds from an audio classification model and uses `classify()` to process audio data. [See an example](https://github.com/WasmEdge/mediapipe-rs/blob/main/examples/audio_classification.rs).

`GestureRecognizerBuilder` builds from a hand gesture recognition model and uses `recognize()` to process image data. [See an example](https://github.com/WasmEdge/mediapipe-rs/blob/main/examples/gesture_recognition.rs).

`ImageClassifierBuilder` builds from an image classification model and uses `classify()` to process image data. [See an example](https://github.com/WasmEdge/mediapipe-rs/blob/main/examples/image_classification.rs).

`ImageEmbedderBuilder` builds from an image embedding model and uses `embed()` to compute a vector representation (embedding) for an input image. [See an example](https://github.com/WasmEdge/mediapipe-rs/blob/main/examples/image_embedding.rs).

`ObjectDetectorBuilder` builds from an object detection model and uses `detect()` to process image data. [See an example](https://github.com/WasmEdge/mediapipe-rs/blob/main/examples/object_detection.rs).

`TextClassifierBuilder` builds from a text classification model and uses `classify()` to process text data. [See an example](https://github.com/WasmEdge/mediapipe-rs/blob/main/examples/text_classification.rs).
