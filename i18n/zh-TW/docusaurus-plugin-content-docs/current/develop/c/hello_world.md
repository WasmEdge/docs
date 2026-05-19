---
sidebar_position: 1
---

# Hello World

本章將以 Hello World 為範例，示範如何將 C 程式編譯為 WASM 位元組碼並在 WasmEdge 中執行。

## 先決條件

開始之前，請確認您已安裝以下軟體：

1. [安裝 WasmEdge](../../start/install.md#install)

2. Emscripten，一個用於將 C/C++ 編譯成 WebAssembly 的工具鏈。詳細說明請參閱 [emcc 官方儲存庫](https://github.com/emscripten-core/emsdk)。

```bash
git clone --depth 1 https://github.com/emscripten-core/emsdk.git
cd emsdk
./emsdk install latest
./emsdk activate latest
source ./emsdk_env.sh
```

## 範例：Hello World

### 將 C 程式碼編譯為 Wasm

由於第一步永遠是「Hello World」程式，以下是其 C 程式實作。

```c
// hello.c

#include<stdio.h>
int main(int argc,char **argv){
  printf("Hello World!\n");
  return 0;
}
```

將上述內容儲存至任意檔案，接著使用 emscripten 將其編譯為 WebAssembly。

```bash
emcc hello.c -o hello.wasm
```

<!-- prettier-ignore -->
:::note
請確認您加上 `-s STANDALONE_WASM` 旗標，或將輸出指定為 wasm `-o your_file_name.wasm`。
:::

接著在 wasmedge 執行環境中執行該 wasm。

```bash
$ wasmedge hello.wasm
Hello World
```

### 在 WasmEdge 中執行

使用 WasmEdge CLI 執行已編譯的 wasm，您將得到 hello world 的輸出。

```bash
$ wasmedge hello.wasm
Hello, world!
```

### AoT 模式

透過 WasmEdge 的 AoT 編譯器，您可以獲得更高的效能。

```bash
# 使用 wasmedge aot 編譯器編譯 wasm 檔案
$ wasmedgec hello.wasm hello.wasm
# 使用 wasmedge 執行原生二進位檔
$ wasmedge hello.wasm
```

## 範例：Add 函式

我們也可以傳遞命令列引數。例如，此範例中的 add 函式接收兩個引數並印出它們的總和。

```c
// add.c

#include <stdio.h>
#include <stdlib.h>
int main(int argc, char *argv[])
{
  int a,b;
  if(argc==3){
    a = atoi(argv[1]);
    b = atoi(argv[2]);
    printf("%d\n",a+b);
  }
  return 0;
}
```

同樣使用 emcc 編譯成 wasm

```bash
emcc add.c -o add.wasm
```

在 wasmedge 執行環境中執行此應用程式

```bash
$ wasmedge add.wasm 2 3
5
```

我們還可以透過 wasmedge AOT 編譯進一步提升效能，此功能可帶來接近原生的效能表現。

```bash
$ wasmedgec add.wasm add_aot.wasm
$ wasmedge add_aot.wasm 4 9
13
```

## 範例：費氏數列函式

我們也可以將專案拆分為獨立的標頭檔與實作檔。

```c
// fibonacci.h

int fib(int n);
```

```c
// fibonacci.c

#include <stdio.h>
#include "fibonacci.h"

int fib(int n){
  int f1 = 0;
  int f2 = 1;
  if(n<=2){
    if(n==1) return f1;
    else return f2;
  }
  else
    for(int i=2; i<n; i++ ){
      int temp = f2;
      f2=f1+f2;
      f1=temp;
    }
  return f2;
}
```

```c
// main.c

#include <stdio.h>
#include <stdlib.h>
#include "fibonacci.h"

int main(int argc, char *argv[])
{
  if (argc<2) {
    return 0;
  }
  int n = atoi(argv[1]);
  printf("%d",fib(n));
  return 0;
}
```

使用 emcc 將程式編譯為 wasm

```bash
emcc main.c fibonacci.c -o fib.wasm
```

在 wasmedge 執行環境中執行

```bash
$ wasmedge fib.wasm 6
5
```
