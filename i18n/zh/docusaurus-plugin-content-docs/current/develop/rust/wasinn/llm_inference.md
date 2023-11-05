---
sidebar_position: 1
---

# Llama 2 inference

WasmEdge now supports running llama2 series of models in Rust. We will use [this example project](https://github.com/second-state/llama-utils/tree/main/chat) to show how to make AI inferences with the llama2 model in WasmEdge and Rust.

WasmEdge now supports Llama2, Codellama-instruct, BELLE-Llama, Mistral-7b-instruct, Wizard-vicuna, OpenChat 3.5B and raguile-chatml. 

## Prerequisite

Besides the [regular WasmEdge and Rust requirements](../../rust/setup.md), please make sure that you have the [Wasi-NN plugin with ggml installed](../../../start/install.md#wasi-nn-plug-in-with-ggml-backend).

## Quick start
Because the example already includes a compiled WASM file from the Rust code, we could use WasmEdge CLI to execute the example directly. First, git clone the `llama-utils` repo.

```bash
git clone https://github.com/second-state/llama-utils.git
cd chat
```

Next, let's get the model. In this example, we are going to use the llama2 7b chat model in GGUF format. You can also use other kinds of llama2 models, check out [here](https://github.com/second-state/llama-utils/blob/main/chat/README.md#get-model).

```bash
git clone curl -LO https://huggingface.co/wasmedge/llama2/blob/main/llama-2-7b-chat-q5_k_m.gguf
```

Run the inference application in WasmEdge.

```bash
wasmedge --dir .:. \
  --nn-preload default:GGML:CPU:llama-2-7b.Q5_K_M.gguf llama-chat.wasm default \
  --prompt 'Robert Oppenheimer most important achievement is ' \
  --ctx-size 4096
```

After executing the command, you may need to wait a moment for the input prompt to appear. Once the execution is complete, the following output will be generated.

```bash
Robert Oppenheimer most important achievement is
1945 Manhattan Project.
Robert Oppenheimer was born in New York City on April 22, 1904. He was the son of Julius Oppenheimer, a wealthy German-Jewish textile merchant, and Ella Friedman Oppenheimer.
Robert Oppenheimer was a brilliant student. He attended the Ethical Culture School in New York City and graduated from the Ethical Culture Fieldston School in 1921. He then attended Harvard University, where he received his bachelor's degree.
```

## Build and run

Let's build the wasm file from the rust source code. First, git clone the `llama-utils` repo.

```bash
git clone https://github.com/second-state/llama-utils.git
cd chat
```

Second, use `cargo` to build the example project.

```bash
cargo build --target wasm32-wasi --release
```

The output WASM file is `target/wasm32-wasi/release/llama-chat.wasm`. 

We also need to get the model. Here we use the llama-2-13b model.

```bash
curl -LO https://huggingface.co/wasmedge/llama2/blob/main/llama-2-13b-q5_k_m.gguf
```

Next, use WasmEdge to load the llama-2-13b model and then ask the model to questions.

```bash
wasmedge --dir .:. \
  --nn-preload default:GGML:CPU:llama-2-13b.Q5_K_M.gguf llama-chat.wasm default \
  --prompt 'Robert Oppenheimer most important achievement is ' \
  --ctx-size 4096
```

After executing the command, you may need to wait a moment for the input prompt to appear. You can enter your question once you see the `[USER]:` prompt:

```bash
Robert Oppenheimer most important achievement is
1945 Manhattan Project.
Robert Oppenheimer was born in New York City on April 22, 1904. He was the son of Julius Oppenheimer, a wealthy German-Jewish textile merchant, and Ella Friedman Oppenheimer.
Robert Oppenheimer was a brilliant student. He attended the Ethical Culture School in New York City and graduated from the Ethical Culture Fieldston School in 1921. He then attended Harvard University, where he received his bachelor's degree
```

## Optional: Configure the model

You can use environment variables to configure the model execution.

| Option |Default |Function |
| -------|-----------|----- |
| LLAMA_LOG |	0	|The backend will print diagnostic information when this value is set to 1|
|LLAMA_N_CTX |512|	The context length is the max number of tokens in the entire conversation|
|LLAMA_N_PREDICT |512|The number of tokens to generate in each response from the model|

For example, the following command specifies a context length of 4k tokens, which is standard for llama2, and the max number of tokens in each response to be 1k. It also tells WasmEdge to print out logs and statistics of the model at runtime.

```
LLAMA_LOG=1 LLAMA_N_CTX=4096 LLAMA_N_PREDICT=128 wasmedge --dir .:. \
  --nn-preload default:GGML:CPU:llama-2-7b.Q5_K_M.gguf llama-simple.wasm default \
  --prompt 'Robert Oppenheimer most important achievement is ' \
  --ctx-size 4096

...................................................................................................
[2023-10-08 23:13:10.272] [info] [WASI-NN] GGML backend: set n_ctx to 4096
llama_new_context_with_model: kv self size  = 2048.00 MB
llama_new_context_with_model: compute buffer total size =  297.47 MB
llama_new_context_with_model: max tensor size =   102.54 MB
[2023-10-08 23:13:10.472] [info] [WASI-NN] GGML backend: llama_system_info: AVX = 0 | AVX2 = 0 | AVX512 = 0 | AVX512_VBMI = 0 | AVX512_VNNI = 0 | FMA = 0 | NEON = 1 | ARM_FMA = 1 | F16C = 0 | FP16_VA = 1 | WASM_SIMD = 0 | BLAS = 0 | SSE3 = 0 | SSSE3 = 0 | VSX = 0 |
[2023-10-08 23:13:10.472] [info] [WASI-NN] GGML backend: set n_predict to 128
[2023-10-08 23:13:16.014] [info] [WASI-NN] GGML backend: llama_get_kv_cache_token_count 128

llama_print_timings:        load time =  1431.58 ms
llama_print_timings:      sample time =     3.53 ms /   118 runs   (    0.03 ms per token, 33446.71 tokens per second)
llama_print_timings: prompt eval time =  1230.69 ms /    11 tokens (  111.88 ms per token,     8.94 tokens per second)
llama_print_timings:        eval time =  4295.81 ms /   117 runs   (   36.72 ms per token,    27.24 tokens per second)
llama_print_timings:       total time =  5742.71 ms
Robert Oppenheimer most important achievement is
1945 Manhattan Project.
Robert Oppenheimer was born in New York City on April 22, 1904. He was the son of Julius Oppenheimer, a wealthy German-Jewish textile merchant, and Ella Friedman Oppenheimer.
Robert Oppenheimer was a brilliant student. He attended the Ethical Culture School in New York City and graduated from the Ethical Culture Fieldston School in 1921. He then attended Harvard University, where he received his bachelor's degree.
```

## Improve performance

You can make the inference program run faster by AOT compiling the wasm file first.

```bash
wasmedge compile llama-chat.wasm llama-chat.wasm
wasmedge --dir .:. \
  --nn-preload default:GGML:CPU:llama-2-13b-q5_k_m.gguf \
  llama-chat.wasm --model-alias default --prompt-template llama-2-chat
```

## Understand the code

The [main.rs](https://github.com/second-state/llama-utils/blob/main/chat/src/main.rs
) is the full Rust code to create an interactive chatbot using a LLM. The Rust program manages the user input, tracks the conversation history, transforms the text into the llama2 and other model’s chat templates, and runs the inference operations using the WASI NN standard API.

First, let's parse command line arguments to customize the chatbot's behavior using `Command` struct. It extracts the following parameters: `prompt` (a prompt that guides the conversation), `model_alias` (a list for the loaded model), and `ctx_size` (the size of the chat context). 

```rust
fn main() -> Result<(), String> {
    let matches = Command::new("Llama API Server")
        .arg(
            Arg::new("prompt")
                .short('p')
                .long("prompt")
                .value_name("PROMPT")
                .help("Sets the prompt.")
                .required(true),
        )
        .arg(
            Arg::new("model_alias")
                .short('m')
                .long("model-alias")
                .value_name("ALIAS")
                .help("Sets the model alias")
                .default_value("default"),
        )
        .arg(
            Arg::new("ctx_size")
                .short('c')
                .long("ctx-size")
                .value_parser(clap::value_parser!(u32))
                .value_name("CTX_SIZE")
                .help("Sets the prompt context size")
                .default_value(DEFAULT_CTX_SIZE),
        )
        .get_matches();

    // model alias
    let model_name = matches
        .get_one::<String>("model_alias")
        .unwrap()
        .to_string();

    // prompt context size
    let ctx_size = matches.get_one::<u32>("ctx_size").unwrap();
    CTX_SIZE
        .set(*ctx_size as usize)
        .expect("Fail to parse prompt context size");

    // prompt
    let prompt = matches.get_one::<String>("prompt").unwrap().to_string();
```

After that, the program will create a new Graph using the `GraphBuilder` and loads the model specified by the `model_name` .

```rust
// load the model to wasi-nn
     let graph =
        wasi_nn::GraphBuilder::new(wasi_nn::GraphEncoding::Ggml, wasi_nn::ExecutionTarget::AUTO)
            .build_from_cache(&model_name)
            .expect("Failed to load the model");
```

Next, We create an execution context from the loaded Graph. The context is mutable because we will be changing it when we set the input tensor and execute the inference.

```rust
 // initialize the execution context
    let mut context = graph
        .init_execution_context()
        .expect("Failed to init context");
```

Next, The prompt is converted into bytes and set as the input tensor for the model inference.

```rust
 // set input tensor
    let tensor_data = prompt.as_str().as_bytes().to_vec();
    context
        .set_input(0, wasi_nn::TensorType::U8, &[1], &tensor_data)
        .expect("Failed to set prompt as the input tensor");
```

Next, excute the model inference.

```rust
  // execute the inference
    context.compute().expect("Failed to complete inference");
```

After the inference is fiished, extract the result from the computation context and losing invalid UTF8 sequences handled by converting the output to a string using `String::from_utf8_lossy`.

```rust
  let mut output_buffer = vec![0u8; *CTX_SIZE.get().unwrap()];
    let mut output_size = context
        .get_output(0, &mut output_buffer)
        .expect("Failed to get output tensor");
    output_size = std::cmp::min(*CTX_SIZE.get().unwrap(), output_size);
    let output = String::from_utf8_lossy(&output_buffer[..output_size]).to_string();
```

Finally, print the prompt and the inference output to the console.

```rust
println!("\nprompt: {}", &prompt);
println!("\noutput: {}", output);
```

The code explanation above is simple one time chat with llama 2 model. But we have more!

* If you're looking for continuous conversations with llama 2 models, please check out the source code [here](https://github.com/second-state/llama-utils/tree/main/chat).
* If you want to construct OpenAI-compatible APIs specifically for your llama2 model, or the Llama2 model itself, please check out the surce code [here](https://github.com/second-state/llama-utils/tree/main/api-server).
* For the reason why we need to run LLama2 model with WasmEdge, please check out [this article](https://medium.com/stackademic/fast-and-portable-llama2-inference-on-the-heterogeneous-edge-a62508e82359).
