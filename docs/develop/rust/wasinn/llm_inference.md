---
sidebar_position: 1
---

# LLM inference

WasmEdge now supports running open-source Large Language Models (LLMs) in Rust. We will use [this example project](https://github.com/second-state/LlamaEdge/tree/main/chat) to show how to make AI inferences with the llama-3.1-8B model in WasmEdge and Rust.

Basically, WasmEdge can support any open-source LLMs. Please check [the supported models](https://github.com/second-state/LlamaEdge/blob/main/models.md) for details.

## Prerequisite

Besides the [regular WasmEdge and Rust requirements](../../rust/setup.md), please make sure that you have the [Wasi-NN plugin with ggml installed](../../../start/install.md#wasi-nn-plug-in-with-ggml-backend).

## Quick start

Because the example already includes a compiled WASM file from the Rust code, we could use WasmEdge CLI to execute the example directly.

First, get the latest llama-chat wasm application

```bash
curl -LO https://github.com/LlamaEdge/LlamaEdge/releases/latest/download/llama-chat.wasm
```

Next, let's get the model. In this example, we are going to use the llama-3.1-8B model in GGUF format. You can also use other kinds of LLMs, check out [here](https://github.com/second-state/llamaedge/blob/main/chat/README.md#get-model).

```bash
curl -LO https://huggingface.co/second-state/Meta-Llama-3.1-8B-Instruct-GGUF/resolve/main/Meta-Llama-3.1-8B-Instruct-Q5_K_M.gguf
```

Run the inference application in WasmEdge.

```bash
wasmedge --dir .:. --nn-preload default:GGML:AUTO:Meta-Llama-3.1-8B-Instruct-Q5_K_M.gguf llama-chat.wasm -p llama-a-chat
```

After executing the command, you may need to wait a moment for the input prompt to appear. You can enter your question once you see the `[USER]:` prompt:

```bash
[USER]:
I have two apples, each costing 5 dollars. What is the total cost of these apples?
[ASSISTANT]:
The total cost of the two apples is 10 dollars.
[USER]:
How about four apples?
[ASSISTANT]:
The total cost of four apples is 20 dollars.
```

## Build and run

Let's build the wasm file from the rust source code. First, git clone the `llamaedge` repo.

```bash
git clone https://github.com/LlamaEdge/LlamaEdge.git
cd chat
```

Second, use `cargo` to build the example project.

```bash
cargo build --target wasm32-wasi --release
```

The output WASM file is `target/wasm32-wasi/release/llama-chat.wasm`. Next, use WasmEdge to load the llama-3.1-8b model and then ask the model questions.

```bash
wasmedge --dir .:. --nn-preload default:GGML:AUTO:Meta-Llama-3.1-8B-Instruct-Q5_K_M.gguf llama-chat.wasm -p llama-3-chat
```

After executing the command, you may need to wait a moment for the input prompt to appear. You can enter your question once you see the `[You]:` prompt:

```bash
[You]:
Which one is greater? 9.11 or 9.8?

[Bot]:
9.11 is greater.

[You]:
why

[Bot]:
11 is greater than 8.
```

## Options

You can configure the chat inference application through CLI options.

```bash
  -m, --model-alias <ALIAS>
          Model alias [default: default]
  -c, --ctx-size <CTX_SIZE>
          Size of the prompt context [default: 512]
  -n, --n-predict <N_PRDICT>
          Number of tokens to predict [default: 1024]
  -g, --n-gpu-layers <N_GPU_LAYERS>
          Number of layers to run on the GPU [default: 100]
  -b, --batch-size <BATCH_SIZE>
          Batch size for prompt processing [default: 512]
  -r, --reverse-prompt <REVERSE_PROMPT>
          Halt generation at PROMPT, return control.
  -s, --system-prompt <SYSTEM_PROMPT>
          System prompt message string [default: "[Default system message for the prompt template]"]
  -p, --prompt-template <TEMPLATE>
          Prompt template. [default: llama-2-chat] [possible values: llama-2-chat, codellama-instruct, mistral-instruct-v0.1, mistrallite, openchat, belle-llama-2-chat, vicuna-chat, chatml]
      --log-prompts
          Print prompt strings to stdout
      --log-stat
          Print statistics to stdout
      --log-all
          Print all log information to stdout
      --stream-stdout
          Print the output to stdout in the streaming way
  -h, --help
          Print help
```

The `--prompt-template` option is perhaps the most interesting. It allows the application to support different open source LLM models beyond llama2. Check out more prompt templates [here](https://github.com/LlamaEdge/LlamaEdge/tree/main/api-server/chat-prompts).

Furthermore, the following command tells WasmEdge to print out logs and statistics of the model at runtime.

```bash
wasmedge --dir .:. --nn-preload default:GGML:AUTO:Meta-Llama-3.1-8B-Instruct-Q5_K_M.gguf \
  llama-chat.wasm --prompt-template llama-3-chat --log-stat
..................................................................................................
llama_new_context_with_model: n_ctx      = 512
llama_new_context_with_model: freq_base  = 10000.0
llama_new_context_with_model: freq_scale = 1
llama_new_context_with_model: kv self size  =  256.00 MB
llama_new_context_with_model: compute buffer total size = 76.63 MB
[2023-11-07 02:07:44.019] [info] [WASI-NN] GGML backend: llama_system_info: AVX = 0 | AVX2 = 0 | AVX512 = 0 | AVX512_VBMI = 0 | AVX512_VNNI = 0 | FMA = 0 | NEON = 1 | ARM_FMA = 1 | F16C = 0 | FP16_VA = 1 | WASM_SIMD = 0 | BLAS = 0 | SSE3 = 0 | SSSE3 = 0 | VSX = 0 | 

llama_print_timings:        load time =   11523.19 ms
llama_print_timings:      sample time =       2.62 ms /   102 runs   (    0.03 ms per token, 38961.04 tokens per second)
llama_print_timings: prompt eval time =   11479.27 ms /    49 tokens (  234.27 ms per token,     4.27 tokens per second)
llama_print_timings:        eval time =   13571.37 ms /   101 runs   (  134.37 ms per token,     7.44 tokens per second)
llama_print_timings:       total time =   25104.57 ms
[ASSISTANT]:
Ah, a fellow Peanuts enthusiast! Snoopy is Charlie Brown's lovable and imaginative beagle, known for his wild and wacky adventures in the comic strip and television specials. He's a loyal companion to Charlie Brown and the rest of the Peanuts gang, and his antics often provide comic relief in the series. Is there anything else you'd like to know about Snoopy? 🐶
```

## Improving performance

You can make the inference program run faster by AOT compiling the wasm file first.

```bash
wasmedge compile llama-chat.wasm llama-chat.wasm
wasmedge --dir .:.  --nn-preload default:GGML:AUTO:Meta-Llama-3.1-8B-Instruct-Q5_K_M.gguf llama-chat.wasm
```

## Understand the code

The [main.rs](https://github.com/second-state/llamaedge/blob/main/chat/src/main.rs) is the full Rust code to create an interactive chatbot using a LLM. The Rust program manages the user input, tracks the conversation history, transforms the text into the llama2 and other model’s chat templates, and runs the inference operations using the WASI NN standard API. The code logic for the chat interaction is somewhat complex. In this section, we will use the [simple example](https://github.com/second-state/llamaedge/tree/main/simple) to explain how to set up and perform one inference round trip. Here is how you use the simple example.

```bash
# Download the compiled simple inference wasm
curl -LO https://github.com/second-state/llamaedge/releases/latest/download/llama-simple.wasm

# Give it a prompt and ask it to use the model to complete it.
wasmedge --dir .:. --nn-preload default:GGML:AUTO:Meta-Llama-3.1-8B-Instruct-Q5_K_M.gguf llama-simple.wasm \
  --prompt 'Robert Oppenheimer most important achievement is ' --ctx-size 512

output: in 1942, when he led the team that developed the first atomic bomb, which was dropped on Hiroshima, Japan in 1945.
```

First, let's parse command line arguments to customize the chatbot's behavior using `Command` struct. It extracts the following parameters: `prompt` (a prompt that guides the conversation), `model_alias` (a list for the loaded model), and `ctx_size` (the size of the chat context).

```rust
fn main() -> Result<(), String> {
    let matches = Command::new("Simple LLM inference")
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

Next, execute the model inference.

```rust
  // execute the inference
    context.compute().expect("Failed to complete inference");
```

After the inference is finished, extract the result from the computation context and losing invalid UTF8 sequences handled by converting the output to a string using `String::from_utf8_lossy`.

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

## Resources

* If you're looking for multi-turn conversations with llama 2 models, please check out the above mentioned chat example source code [here](https://github.com/second-state/llamaedge/tree/main/chat).
* If you want to construct OpenAI-compatible APIs specifically for your llama2 model, or the Llama2 model itself, please check out the source code [for the API server](https://github.com/second-state/llamaedge/tree/main/api-server).
* To learn more, please check out [this article](https://medium.com/stackademic/fast-and-portable-llama2-inference-on-the-heterogeneous-edge-a62508e82359).
