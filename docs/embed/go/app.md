---
sidebar_position: 2
---

# Embed a standalone WASM app

The WasmEdge Go SDK can [embed standalone WebAssembly applications](https://github.com/second-state/WasmEdge-go-examples/tree/master/go_ReadFile) — ---

sidebar_position: 5

---

# AI Inference with TensorFlow

<!-- prettier-ignore -->
:::note

The WasmEdge extensions have been deprecated after the v0.12.1 version. We'll update to use the WasmEdge plug-in in the future.

:::

This section will show you how to create a TensorFlow inference function in Rust for image classification and then embed it into a Go application. The project source code is [available here](https://github.com/second-state/WasmEdge-go-examples/tree/master/wasmedge-bindgen/go_TfliteFood).

## The WASM app in Rust

The Rust function for image classification is [available here](https://github.com/second-state/WasmEdge-go-examples/blob/master/wasmedge-bindgen/go_TfliteFood/rust_tflite_food/src/lib.rs). It utilizes the [WasmEdge Tensorflow Lite plug-in](../../develop/rust/tensorflow.md) as well as the [wasmedge_bindgen](function.md) for passing call parameters.

```rust

#[wasmedge_bindgen]

fn infer(image_data: Vec<u8>) -> Result<Vec<u8>, String> {

  ... ...

  let flat_img = image::imageops::thumbnail(&img, 192, 192);



  let model_data: &[u8] = include_bytes!("lite-model_aiy_vision_classifier_food_V1_1.tflite");

  let labels = include_str!("aiy_food_V1_labelmap.txt");



  let mut session = wasmedge_tensorflow_interface::Session::new(

    model_data,

    wasmedge_tensorflow_interface::ModelType::TensorFlowLite,

  );

  session

    .add_input("input", &flat_img, &[1, 192, 192, 3])

    .run();

  let res_vec: Vec<u8> = session.get_output("MobilenetV1/Predictions/Softmax");

  ... ...

}

```

## Compile the Rust code to Wasm

You can build the standard `Cargo` command into a WebAssembly function.

```bash

git clone https://github.com/second-state/WasmEdge-go-examples.git

cd rust_tflite_food

cargo build --target wasm32-wasi --release

cp target/wasm32-wasi/release/rust_tflite_food_lib.wasm ../

cd ../

```

You can use our AOT compiler `wasmedge compile` to instrument the WebAssembly file to make it run much faster. [Learn more](../../start/build-and-run/aot.md).

```bash

wasmedge compile rust_tflite_food_lib.wasm rust_tflite_food_lib.wasm

```

## Go host app

The [Go host app](https://github.com/second-state/WasmEdge-go-examples/blob/master/wasmedge-bindgen/go_TfliteFood/tflite_food.go) source code shows how to instantiate a WasmEdge runtime with the Tensorflow extension, and how to pass the image data to the Rust function in WasmEdge to run the inference.

```go

func main() {

  // Expected Args[0]: program name (./tflite_food)

  // Expected Args[1]: wasm file (rust_tflite_food_lib.wasm)

  // Expected Args[2]: input image name (food.jpg)



  wasmedge.SetLogErrorLevel()



  // Set Tensorflow not to print debug info

  os.Setenv("TF_CPP_MIN_LOG_LEVEL", "3")

  os.Setenv("TF_CPP_MIN_VLOG_LEVEL", "3")



  var conf = wasmedge.NewConfigure(wasmedge.WASI)

  var vm = wasmedge.NewVMWithConfig(conf)

  var wasi = vm.GetImportModule(wasmedge.WASI)

  wasi.InitWasi(

    os.Args[1:],     // The args

    os.Environ(),    // The envs

    []string{".:."}, // The mapping preopens

  )



  // Register WasmEdge-tensorflow

  var tfmod = wasmedge.NewTensorflowModule()

  var tflitemod = wasmedge.NewTensorflowLiteModule()

  vm.RegisterModule(tfmod)

  vm.RegisterModule(tflitemod)



  // Load and validate the wasm

  vm.LoadWasmFile(os.Args[1])

  vm.Validate()



  // Instantiate the bindgen and vm

  bg := bindgen.Instantiate(vm)



  img, _ := ioutil.ReadFile(os.Args[2])

  if res, err := bg.Execute("infer", img); err != nil {

    fmt.Println(err)

  } else {

    fmt.Println(string(res))

  }



  bg.Release()

  vm.Release()

  conf.Release()

  tfmod.Release()

  tflitemod.Release()

}

```

## Build and run the wasm app from your go host

<!-- prettier-ignore -->
:::note

Ensure you have installed [Go, WasmEdge, and WasmEdge Go SDK with the TensorFlow extension](intro.md).

:::

The following command builds the Go host application with the WasmEdge Go SDK and its TensorFlow extension.

```bash

go build -tags tensorflow

```

Now you can run the Go application. It calls the WebAssembly function in WasmEdge to run inference on the input image.

```bash

./tflite_food rust_tflite_food_lib.wasm food.jpg

```

The results are as follows.

```bash

Go: Args: [./tflite_food rust_tflite_food_lib.wasm food.jpg]

It is very likely a Hot dog in the picture

```

ie a Rust application with a `main()` function compiled into WebAssembly.

## The WASM app in Rust

Our [demo Rust application](https://github.com/second-state/WasmEdge-go-examples/tree/master/go_ReadFile/rust_readfile) reads from a file. Note that the STDIN and STDOUT now pass the WebAssembly program's input and output data.

```rust
use std::env;
use std::fs::File;
use std::io::{self, BufRead};

fn main() {
  // Get the argv.
  let args: Vec<String> = env::args().collect();
  if args.len() <= 1 {
    println!("Rust: ERROR - No input file name.");
    return;
  }

  // Open the file.
  println!("Rust: Opening input file \"{}\"...", args[1]);
  let file = match File::open(&args[1]) {
    Err(why) => {
      println!("Rust: ERROR - Open file \"{}\" failed: {}", args[1], why);
      return;
    },
    Ok(file) => file,
  };

  // Read lines.
  let reader = io::BufReader::new(file);
  let mut texts:Vec<String> = Vec::new();
  for line in reader.lines() {
    if let Ok(text) = line {
      texts.push(text);
    }
  }
  println!("Rust: Read input file \"{}\" succeeded.", args[1]);

  // Get stdin to print lines.
  println!("Rust: Please input the line number to print the line of file.");
  let stdin = io::stdin();
  for line in stdin.lock().lines() {
    let input = line.unwrap();
    match input.parse::<usize>() {
      Ok(n) => if n > 0 && n <= texts.len() {
        println!("{}", texts[n - 1]);
      } else {
        println!("Rust: ERROR - Line \"{}\" is out of range.", n);
      },
      Err(e) => println!("Rust: ERROR - Input \"{}\" is not an integer: {}", input, e),
    }
  }
  println!("Rust: Process end.");
}
```

## Compile the Rust code into Wasm

Next, let's compile the application into WebAssembly.

```bash
git clone https://github.com/second-state/WasmEdge-go-examples.git
cd rust_readfile
cargo build --target wasm32-wasi
# The output file will be target/wasm32-wasi/debug/rust_readfile.wasm
```

## The Go Host app

The Go source code to run the WebAssembly function in WasmEdge is as follows.

```go
package main

import (
  "os"
  "github.com/second-state/WasmEdge-go/wasmedge"
)

func main() {
  wasmedge.SetLogErrorLevel()

  var conf = wasmedge.NewConfigure(wasmedge.REFERENCE_TYPES)
  conf.AddConfig(wasmedge.WASI)
  var vm = wasmedge.NewVMWithConfig(conf)
  var wasi = vm.GetImportModule(wasmedge.WASI)
  wasi.InitWasi(
    os.Args[1:],     // The args
    os.Environ(),    // The envs
    []string{".:."}, // The mapping directories
  )

  // Instantiate wasm. _start refers to the main() function
  vm.RunWasmFile(os.Args[1], "_start")

  vm.Release()
  conf.Release()
}
```

## Run the compiled WASM file from Go host

::note Make sure you have installed [Go, WasmEdge, and WasmEdge Go SDK](intro.md). ::

Next, let's build the Go application with the WasmEdge Go SDK.

```bash
go build
```

Run the Golang application.

```bash
$ ./read_file rust_readfile/target/wasm32-wasi/debug/rust_readfile.wasm file.txt
Rust: Opening input file "file.txt"...
Rust: Read input file "file.txt" succeeded.
Rust: Please input the line number to print the line of file.
# Input "5" and press Enter.
5
# The output will be the 5th line of `file.txt`:
abcDEF___!@#$%^
# To terminate the program, send the EOF (Ctrl + D).
^D
# The output will print the terminate message:
Rust: Process end.
```

More examples can be found at [the WasmEdge-go-examples GitHub repo.](https://github.com/second-state/WasmEdge-go-examples)
