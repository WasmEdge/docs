---
sidebar_position: 5
---

# Fuzzing

Fuzzing is a dynamic code analysis technique used to discover coding errors and security loopholes in software applications. It involves providing invalid, unexpected, or random data as inputs to a software program. This guide will walk you through the process of setting up and running fuzz tests on WasmEdge applications.

## Prerequisites

- WasmEdge Runtime and API
- C++ Compiler (e.g., GCC or Clang)
- Fuzzing tool (e.g., AFL, libFuzzer)
- Basic knowledge of C++ and WebAssembly

## How to Fuzz Test

### Step 1: Install Fuzzing Tool

For this guide, we'll use [AFL (American Fuzzy Lop)](https://github.com/google/AFL) as the fuzzing tool. Install it using the package manager for your OS. 

For Ubuntu:

```bash
sudo apt-get install afl
```

### Step 2: Prepare the WasmEdge Application

Ensure that your WasmEdge application is compiled and ready for testing. Identify the functions that you want to fuzz. These are typically functions that handle file I/O, data parsing, or any form of external input.

### Step 3: Write a Fuzzing Target

Create a C++ file that will serve as your fuzzing target. This file should include the WasmEdge API and should call the function you want to fuzz.

```cpp
#include <wasmedge.h>

extern "C" int LLVMFuzzerTestOneInput(const uint8_t *Data, size_t Size) {
  WasmEdge::Configure Conf;
  WasmEdge::VM VM(Conf);

  if (VM.loadWasm(Data, Size)) {
    VM.validate();
    VM.instantiate();
    VM.execute("your_function", {/* optional args */});
  }

  return 0;
}
```

### Step 4: Compile the Fuzzing Target

Compile the fuzzing target with AFL's version of the compiler and enable the fuzzing mode.

```bash
afl-g++ -o fuzz_target fuzz_target.cpp -lwasmedge_c_api
```

### Step 5: Run the Fuzzer

Run AFL to start fuzzing.

```bash
afl-fuzz -i input_dir/ -o output_dir/ ./fuzz_target @@
```

Here, `input_dir` is a directory containing sample input files, and `output_dir` is where AFL will store the results.

### Step 6: Analyze Results

AFL will generate a lot of data, including:

- Queue: Test cases that exhibit new behaviors.
- Crashes: Inputs that caused the program to crash.
- Hangs: Inputs where the program took too long to execute.

Review these files to understand the vulnerabilities or bugs in your application.

## Best Practices

- **Start Small:** Use simple input files initially to help the fuzzer understand the basic program behavior.
- **Code Coverage:** Use tools like afl-cov to measure code coverage and ensure that the fuzzer is exercising all code paths.
- **Continuous Fuzzing:** Integrate fuzzing into your CI/CD pipeline to catch issues early.


Fuzzing is an effective way to discover vulnerabilities and bugs that might not be apparent through conventional testing methods. By following this guide, you can set up a robust fuzzing workflow for your WasmEdge applications, thereby enhancing their security and reliability.

:::note
If you need a Wasm specific fuzzer, this https://github.com/wasmerio/wasm-fuzz/ can give more infomation and details pertaining to your use cases
:::

### Further References

- https://github.com/wasmerio/wasm-fuzz/blob/master/afl.md
- https://github.com/rust-fuzz/afl.rs
- https://rust-fuzz.github.io/book/introduction.html
- https://lcamtuf.coredump.cx/afl/
- https://afl-1.readthedocs.io/en/latest/
- https://en.wikipedia.org/wiki/American_fuzzy_lop_(fuzzer)