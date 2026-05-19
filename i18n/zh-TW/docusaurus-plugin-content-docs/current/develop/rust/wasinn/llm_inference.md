---
sidebar_position: 1
---

# LLM 推論

WasmEdge 現已支援以 Rust 執行開源大型語言模型（LLM）。我們將以[這個範例專案](https://github.com/second-state/LlamaEdge/tree/main/chat)示範如何在 WasmEdge 與 Rust 中使用 llama-3.1-8B 模型進行 AI 推論。

此外，WasmEdge 也能支援任何開源 LLM。請查閱[支援的模型](https://github.com/second-state/LlamaEdge/blob/main/models.md)以取得詳細資料。

## 必要條件

除了[一般的 WasmEdge 與 Rust 需求](../../rust/setup.md)之外，請確認您已[安裝具有 ggml 的 Wasi-NN 外掛](../../../start/install.md#wasi-nn-plug-in-with-ggml-backend)。

## 快速開始

由於此範例已內含由 Rust 程式編譯而成的 WASM 檔案，因此我們可以直接使用 WasmEdge CLI 來執行它。

首先，取得最新的 llama-chat wasm 應用程式。

```bash
curl -LO https://github.com/LlamaEdge/LlamaEdge/releases/latest/download/llama-chat.wasm
```

接著取得模型。在此範例中，我們將使用 GGUF 格式的 llama-3.1-8B 模型。您也可以使用其他類型的 LLM，請參考[此處](https://github.com/second-state/llamaedge/blob/main/chat/README.md#get-model)。

```bash
curl -LO https://huggingface.co/second-state/Meta-Llama-3.1-8B-Instruct-GGUF/resolve/main/Meta-Llama-3.1-8B-Instruct-Q5_K_M.gguf
```

在 WasmEdge 中執行推論應用程式。

```bash
wasmedge --dir .:. --nn-preload default:GGML:AUTO:Meta-Llama-3.1-8B-Instruct-Q5_K_M.gguf llama-chat.wasm -p llama-3-chat
```

執行命令後，您可能需要稍候片刻，等待輸入提示出現。當您看到 `[USER]:` 提示後即可輸入您的問題：

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

## 建置與執行

讓我們從 Rust 原始碼建置 wasm 檔案。首先，git clone `llamaedge` 儲存庫。

```bash
git clone https://github.com/LlamaEdge/LlamaEdge.git
cd chat
```

接著，使用 `cargo` 建置範例專案。

```bash
cargo build --target wasm32-wasip1 --release
```

輸出的 WASM 檔案為 `target/wasm32-wasip1/release/llama-chat.wasm`。接著使用 WasmEdge 載入 llama-3.1-8b 模型，並向該模型提問。

```bash
wasmedge --dir .:. --nn-preload default:GGML:AUTO:Meta-Llama-3.1-8B-Instruct-Q5_K_M.gguf llama-chat.wasm -p llama-3-chat
```

執行命令後，您可能需要稍候片刻，等待輸入提示出現。當您看到 `[You]:` 提示後即可輸入您的問題：

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

## 選項

您可以透過 CLI 選項設定聊天推論應用程式。

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

`--prompt-template` 選項或許是最值得關注的。它讓應用程式能在 llama2 以外，支援其他不同的開源 LLM 模型。可在[此處](https://github.com/LlamaEdge/LlamaEdge/tree/main/api-server/chat-prompts)查看更多提示範本。

`--ctx-size` 選項可指定應用程式的脈絡視窗大小，其上限受限於模型本身的脈絡視窗大小。

`--log-stat` 會讓 WasmEdge 在執行階段印出模型的紀錄與統計資料。

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

## 提升效能

您可以先對 wasm 檔案進行 AOT 編譯，讓推論程式執行得更快。

```bash
wasmedge compile llama-chat.wasm llama-chat.wasm
wasmedge --dir .:.  --nn-preload default:GGML:AUTO:Meta-Llama-3.1-8B-Instruct-Q5_K_M.gguf llama-chat.wasm -p llama-3-chat
```

## 了解程式碼

[main.rs](https://github.com/second-state/llamaedge/blob/main/chat/src/main.rs) 是建立互動式聊天機器人的完整 Rust 程式碼，並使用 LLM。此 Rust 程式會管理使用者輸入、追蹤對話歷史、將文字轉換為模型的聊天範本，並透過 WASI NN 標準 API 執行推論作業。聊天互動的程式邏輯有些複雜。在本節中，我們將使用[簡易範例](https://github.com/second-state/llamaedge/tree/main/simple)來說明如何設定並執行一次推論。下列是此簡易範例的使用方式。

```bash
# Download the compiled simple inference wasm
curl -LO https://github.com/second-state/llamaedge/releases/latest/download/llama-simple.wasm

# Give it a prompt and ask it to use the model to complete it.
wasmedge --dir .:. --nn-preload default:GGML:AUTO:Meta-Llama-3.1-8B-Instruct-Q5_K_M.gguf llama-simple.wasm \
  --prompt 'Robert Oppenheimer most important achievement is ' --ctx-size 512

output: in 1942, when he led the team that developed the first atomic bomb, which was dropped on Hiroshima, Japan in 1945.
```

首先，我們會解析命令列引數，並使用 `Command` 結構自訂聊天機器人的行為。它會擷取下列參數：`prompt`（引導對話的提示）、`model_alias`（已載入模型的清單）以及 `ctx_size`（聊天脈絡的大小）。

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

接著，程式會使用 `GraphBuilder` 建立一個新的 Graph，並載入由 `model_name` 指定的模型。

```rust
// load the model to wasi-nn
     let graph =
        wasi_nn::GraphBuilder::new(wasi_nn::GraphEncoding::Ggml, wasi_nn::ExecutionTarget::AUTO)
            .build_from_cache(&model_name)
            .expect("Failed to load the model");
```

接下來，我們會從已載入的 Graph 建立一個執行脈絡。此脈絡是可變的，因為在設定輸入張量並執行推論時我們會修改它。

```rust
 // initialize the execution context
    let mut context = graph
        .init_execution_context()
        .expect("Failed to init context");
```

接著，將提示轉換為位元組，並設定為模型推論的輸入張量。

```rust
 // set input tensor
    let tensor_data = prompt.as_str().as_bytes().to_vec();
    context
        .set_input(0, wasi_nn::TensorType::U8, &[1], &tensor_data)
        .expect("Failed to set prompt as the input tensor");
```

接著，執行模型推論。

```rust
  // execute the inference
    context.compute().expect("Failed to complete inference");
```

推論完成後，從計算脈絡擷取結果，並透過 `String::from_utf8_lossy` 將輸出轉換為字串，藉此處理無效的 UTF8 序列。

```rust
  let mut output_buffer = vec![0u8; *CTX_SIZE.get().unwrap()];
    let mut output_size = context
        .get_output(0, &mut output_buffer)
        .expect("Failed to get output tensor");
    output_size = std::cmp::min(*CTX_SIZE.get().unwrap(), output_size);
    let output = String::from_utf8_lossy(&output_buffer[..output_size]).to_string();
```

最後，將提示與推論輸出印到主控台。

```rust
println!("\nprompt: {}", &prompt);
println!("\noutput: {}", output);
```

## 資源

* 如果您要尋找與 llama 模型進行多輪對話的範例，請參考前面提及的 chat 範例原始碼[這裡](https://github.com/second-state/llamaedge/tree/main/chat)。
* 如果您想為您的 llama2 模型（或 Llama2 模型本身）建構與 OpenAI 相容的 API，請參考 [API 伺服器的原始碼](https://github.com/second-state/llamaedge/tree/main/api-server)。
* 若要進一步了解，請參考[這篇文章](https://medium.com/stackademic/fast-and-portable-llama2-inference-on-the-heterogeneous-edge-a62508e82359)。
