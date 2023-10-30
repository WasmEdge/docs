---
sidebar_position: 1
---

# Llama 2 inference

WasmEdge now supports running llama2 series of models in Rust. We will use [this example project](https://github.com/second-state/llama-utils/tree/main/chat) to show how to make AI inferences with the llama2 model in WasmEdge and Rust.

WasmEdge now supports Llama2, Codellama-instruct, BELLE-Llama, Mistral-7b-instruct, Wizard-vicuna, and raguile-chatml. 

## Prerequisite

Besides the [regular WasmEdge and Rust requirements](../../rust/setup.md), please make sure that you have the [Wasi-NN plugin with ggml installed](../../../start/install.md#wasi-nn-plug-in-with-ggml-backend).

## Quick start
Because the example already includes a compiled WASM file from the Rust code, we could use WasmEdge CLI to execute the example directly. First, git clone the `llama-utils` repo.

```
git clone https://github.com/second-state/llama-utils.git
cd chat
```

Next, let's get the model. In this example, we are going to use the llama2 7b chat model in GGUF format. You can also use other kinds of llama2 models, check out [here](https://github.com/second-state/llama-utils/blob/main/chat/README.md#get-model).

```
git clone curl -LO https://huggingface.co/TheBloke/Llama-2-7b-Chat-GGUF/resolve/main/llama-2-7b-chat.Q5_K_M.gguf
```

Run the inference application in WasmEdge.

```
wasmedge --dir .:. \
  --nn-preload default:GGML:CPU:llama-2-7b-chat.Q5_K_M.gguf \
  chat.wasm --model-alias default --prompt-template llama-2-chat
```
After executing the command, you may need to wait a moment for the input prompt to appear. You can enter your question once you see the `[USER]:` prompt:

```
[USER]:
What's the capital of France?
[ASSISTANT]:
The capital of France is Paris.
[USER]:
what about Norway?
[ASSISTANT]:
The capital of Norway is Oslo.
[USER]:
I have two apples, each costing 5 dollars. What is the total cost of these apples?
[ASSISTANT]:
The total cost of the two apples is 10 dollars.
[USER]:
What if I have 3 apples?
[ASSISTANT]:
If you have 3 apples, each costing 5 dollars, the total cost of the apples is 15 dollars.
```

## Build and run
Let's build the wasm file from the rust source code. First, git clone the `llama-utils` repo.

```
git clone https://github.com/second-state/llama-utils.git
cd chat
```
Second, use `cargo` to build the example project.

```
cargo build --target wasm32-wasi --release
```

The output WASM file is `target/wasm32-wasi/release/chat.wasm`. 

We also need to get the model. Here we use the llama-2-13b model.

```
curl -LO https://huggingface.co/TheBloke/Llama-2-13B-chat-GGUF/resolve/main/llama-2-13b-chat.Q5_K_M.gguf
```
Next, use WasmEdge to load the Codellama-instruct model and then ask the model to write code by chatting.

```
wasmedge --dir .:. \
  --nn-preload default:GGML:CPU:llama-2-13b-chat.Q5_K_M.gguf \
  chat.wasm --model-alias default --prompt-template llama-2-chat
```
After executing the command, you may need to wait a moment for the input prompt to appear. You can enter your question once you see the `[USER]:` prompt:

```
[USER]:
Who is the "father of the atomic bomb"?
[ASSISTANT]:
The "father of the atomic bomb" is a term commonly associated with physicist J. Robert Oppenheimer. Oppenheimer was a leading figure in the development of the atomic bomb during World War II, serving as the director of the Manhattan Project, which was responsible for the development and deployment of the first nuclear weapons. He is often referred to as the "father of the atomic bomb" due to his significant contributions to the field of nuclear physics and his leadership in the development of the bomb.
```

## Optional: Configure the model

You can use environment variables to configure the model execution.

| Option	|Default	|Function |
| -------|-----------|----- |
|                         |
LLAMA_LOG|	0	|The backend will print diagnostic information when this value is set to 1|
|LLAMA_N_CTX	|512|	The context length is the max number of tokens in the entire conversation|
|LLAMA_N_PREDICT |512|The number of tokens to generate in each response from the model|

For example, the following command specifies a context length of 4k tokens, which is standard for llama2, and the max number of tokens in each response to be 1k. It also tells WasmEdge to print out logs and statistics of the model at runtime.

```
LLAMA_LOG=1 LLAMA_N_CTX=4096 LLAMA_N_PREDICT=1024 wasmedge --dir .:. \
    --nn-preload default:GGML:CPU:llama-2-7b-chat.Q5_K_M.gguf \
    wasmedge-ggml-llama-interactive.wasm default

llama_model_loader: loaded meta data with 19 key-value pairs and 291 tensors from llama-2-7b-chat.Q5_K_M.gguf (version GGUF V2 (latest))
llama_model_loader: - tensor    0:                token_embd.weight q5_K     [  4096, 32000,     1,     1 ]
... ...
llm_load_tensors: mem required  = 4560.96 MB (+  256.00 MB per state)
...................................................................................................
Question:
Who is the "father of the atomic bomb"?
llama_new_context_with_model: kv self size  =  256.00 MB
... ...
llama_print_timings:      sample time =     3.35 ms /   104 runs   (    0.03 ms per token, 31054.05 tokens per second)
llama_print_timings: prompt eval time =  4593.10 ms /    54 tokens (   85.06 ms per token,    11.76 tokens per second)
llama_print_timings:        eval time =  3710.33 ms /   103 runs   (   36.02 ms per token,    27.76 tokens per second)
Answer:
The "father of the atomic bomb" is a term commonly associated with physicist J. Robert Oppenheimer. Oppenheimer was a leading figure in the development of the atomic bomb during World War II, serving as the director of the Manhattan Project, which was responsible for the development and deployment of the first nuclear weapons. He is often referred to as the "father of the atomic bomb" due to his significant contributions to the field of nuclear physics and his leadership in the development of the bomb.
```
## Improve performance

You can make the inference program run faster by AOT compiling the wasm file first.

```
wasmedge compile chat.wasm chat.wasm
wasmedge --dir .:. \
  --nn-preload default:GGML:CPU:llama-2-13b-chat.Q5_K_M.gguf \
  chat.wasm --model-alias default --prompt-template llama-2-chat
```

## Understand the code

The [main.rs](https://github.com/second-state/llama-utils/blob/main/chat/src/main.rs
) is the full Rust code to create an interactive chatbot using a LLM. The Rust program manages the user input, tracks the conversation history, transforms the text into the llama2 and other model’s chat templates, and runs the inference operations using the WASI NN standard API.

First, let's parse command line arguments to customize the chatbot's behavior. It extracts the following parameters: `model_alias` (a list for the loaded model), `ctx_size` (the size of the chat context), and `prompt_template` (a template that guides the conversation). 

```
fn main() -> Result<(), String> {
    let matches = Command::new("Llama API Server")
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
        .arg(
            Arg::new("prompt_template")
                .short('p')
                .long("prompt-template")
                .value_parser([
                    "llama-2-chat",
                    "codellama-instruct",
                    "mistral-instruct-v0.1",
                    "belle-llama-2-chat",
                    "vicuna-chat",
                    "chatml",
                ])
                .value_name("TEMPLATE")
                .help("Sets the prompt template.")
                .required(true),
        )
        .get_matches();

```

After that, the program will initialize the context size based on the value provided as `ctx_size`.

```
    let ctx_size = matches.get_one::<u32>("ctx_size").unwrap();
    if CTX_SIZE.set(*ctx_size as usize).is_err() {
        return Err(String::from("Fail to parse prompt context size"));
    }
    println!("[INFO] Prompt context size: {size}", size = ctx_size);
```

Then, the program will parse and create the prompt template. The program parses the `prompt_template` parameter and converts it into an enum called `PromptTemplateType`. The code then uses the parsed PromptTemplateType to create an appropriate chat prompt template. This template is essential for generating prompts during the conversation. The prompt template is defined [here](https://github.com/second-state/llama-utils/blob/main/chat/src/main.rs#L193-L214).

```
let prompt_template = matches
        .get_one::<String>("prompt_template")
        .unwrap()
        .to_string();
    let template_ty = match PromptTemplateType::from_str(&prompt_template) {
        Ok(template) => template,
        Err(e) => {
            return Err(format!(
                "Fail to parse prompt template type: {msg}",
                msg = e.to_string()
            ))
        }
    };
    println!("[INFO] Prompt template: {ty:?}", ty = &template_ty);

    let template = create_prompt_template(template_ty);

    let mut chat_request = ChatCompletionRequest::default();
```

Next step is to load the model. The program will load the model to `wasi-nn`. The model is identified by the `model_alias` provided via the command line.

```
    let graph = match wasi_nn::GraphBuilder::new(
        wasi_nn::GraphEncoding::Ggml,
        wasi_nn::ExecutionTarget::CPU,
    )
    .build_from_cache(model_name.as_ref())
    {
        Ok(graph) => graph,
        Err(e) => {
            return Err(format!(
                "Fail to load model into wasi-nn: {msg}",
                msg = e.to_string()
            ))
        }
    };
```
Now we have finished the preparation work: loaded the model and prompt. Let's initiate a chat to chat with the model. The `read_input` function reads lines of text from the standard input until it receives a non-empty and non-whitespace line. The `chat_request` variable is an instance of a data structure that manages and stores information related to the ongoing conversation between the user and the AI assistant.

```

loop {
        println!("[USER]:");
        let user_message = read_input();
        chat_request
            .messages
            .push(ChatCompletionRequestMessage::new(
                ChatCompletionRole::User,
                user_message,
            ));

        // build prompt
        let prompt = match template.build(&mut chat_request.messages) {
            Ok(prompt) => prompt,
            Err(e) => {
                return Err(format!(
                    "Fail to build chat prompts: {msg}",
                    msg = e.to_string()
                ))
            }
        };

        // read input tensor
        let tensor_data = prompt.trim().as_bytes().to_vec();
        if context
            .set_input(0, wasi_nn::TensorType::U8, &[1], &tensor_data)
            .is_err()
        {
            return Err(String::from("Fail to set input tensor"));
        };

        // execute the inference
        if context.compute().is_err() {
            return Err(String::from("Fail to execute model inference"));
        }

        // retrieve the output
        let mut output_buffer = vec![0u8; *CTX_SIZE.get().unwrap()];
        let mut output_size = match context.get_output(0, &mut output_buffer) {
            Ok(size) => size,
            Err(e) => {
                return Err(format!(
                    "Fail to get output tensor: {msg}",
                    msg = e.to_string()
                ))
            }
        };
        output_size = std::cmp::min(*CTX_SIZE.get().unwrap(), output_size);
        let output = String::from_utf8_lossy(&output_buffer[..output_size]).to_string();
        println!("[ASSISTANT]:\n{}", output.trim());

        // put the answer into the `messages` of chat_request
        chat_request
            .messages
            .push(ChatCompletionRequestMessage::new(
                ChatCompletionRole::Assistant,
                output,
            ));
    }

    Ok(())
}

fn read_input() -> String {
    loop {
        let mut answer = String::new();
        std::io::stdin()
            .read_line(&mut answer)
            .ok()
            .expect("Failed to read line");
        if !answer.is_empty() && answer != "\n" && answer != "\r\n" {
            return answer;
        }
    }
}
```

For the reason why we need to run LLama2 model with WasmEdge, please check out [this article](https://medium.com/stackademic/fast-and-portable-llama2-inference-on-the-heterogeneous-edge-a62508e82359).
