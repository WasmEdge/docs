---
sidebar_position: 1
---

# Testing

This module will teach you about writing tests for Web-Assembly (Wasm) Code for adding test suites for new plugins or modules for WasmEdge Software. This is an important aspect if you want to submit plugins to the WasmEdge community and we would require you to write test suites to cater to the plugin functionalities.

## Writing Tests for Wasm Code Targeting WebAssembly

Testing is a crucial part of software development, ensuring that code behaves as expected. In this guide, we'll explore how to write tests for Wasm code, using Google Test (gtest) and a specific example related to the WasmEdge runtime.

### Prerequisites
- Familiarity with C++ and WebAssembly.
- Basic understanding of Google Test (gtest) framework.
- WasmEdge runtime environment set up for testing.

### Code Explanation and Comments

The provided code snippet demonstrates how to set up and execute tests for a WebAssembly code or the plugins you create, specifically using the WasmEdge runtime. The code is structured into two main parts: the test setup and the test cases themselves.

```cpp
#include "common/defines.h"
#include "runtime/instance/module.h"
#include "wasi_logging/func.h"
#include "wasi_logging/module.h"

#include <gtest/gtest.h>
#include <iostream>
#include <spdlog/sinks/ostream_sink.h>
#include <spdlog/spdlog.h>
#include <sstream>

namespace {

// Function to create a module instance for testing.
WasmEdge::Runtime::Instance::ModuleInstance *createModule() {
  // ... Code omitted for brevity ...
}

// Helper function to fill memory with a byte value.
void fillMemContent(WasmEdge::Runtime::Instance::MemoryInstance &MemInst,
                    uint32_t Offset, uint32_t Cnt, uint8_t C = 0) noexcept {
  // ... Code omitted for brevity ...
}

// Helper function to fill memory with a string.
void fillMemContent(WasmEdge::Runtime::Instance::MemoryInstance &MemInst,
                    uint32_t Offset, const std::string &Str) noexcept {
  // ... Code omitted for brevity ...
}

} // namespace
```

### Test Cases

```cpp
TEST(WasiLoggingTests, func_log) {
  // ... Code omitted for brevity ...

  // Test cases for different logging levels and conditions.
  // Each test case uses the `EXPECT_TRUE` or `EXPECT_FALSE` macros
  // to validate the behavior of the `HostFuncInst.run` method.
  
  // ... Code omitted for brevity ...
}
```

You can call the main function to run all the tests using the below given example

```cpp
GTEST_API_ int main(int argc, char **argv) {
  testing::InitGoogleTest(&argc, argv);
  return RUN_ALL_TESTS();
}
```

## Where to add the tests?

After writing tests for your specific modules or plugins, you can add them under `https://github.com/WasmEdge/WasmEdge/tree/master/test` and for more specific placement of the tests, 

For example,

- You can add the tests for new plugins or update existing ones under `https://github.com/WasmEdge/WasmEdge/tree/master/test/plugins`

## Documenting the Tests in Markdown

When documenting these tests in Markdown, you should focus on explaining the purpose of each test, the setup required, and the expected outcomes. Here's an example of how you might structure this documentation:


```md

# WasmEdge Module Tests

## Overview

This document outlines the tests for the `WasiLogging` module in a WebAssembly environment using the WasmEdge runtime.

## Test Setup

- **Module Creation**: A module instance is created for testing purposes using the `createModule` function.
- **Memory Manipulation**: The `fillMemContent` functions are used to manipulate memory content, essential for setting up test scenarios.

## Test Cases

### `func_log` Tests

- **Purpose**: These tests validate the logging functionality at different levels and conditions.
- **Test Scenarios**:
  - **Clear Memory**: Ensures memory is correctly cleared before each test.
  - **Set Strings in Memory**: Tests the ability to write strings to memory.
  - **Logging at Different Levels**: Validates logging behavior at various levels (info, warning, error, etc.).
  - **Stderr Context**: Checks if the logging correctly handles the stderr context.
  - **Unknown Level**: Ensures that an unknown logging level is handled appropriately.

## Running Tests

- Compile the test code with your C++ compiler targeting WebAssembly.
- Run the tests using a command-line tool that supports Google Test.

## Conclusion

These tests ensure the robustness and reliability of the module in a WebAssembly environment

```

> Note: You can add the documentation in the plugin test folders you create

### Blogs

- [Google Test GitHub Repository](https://github.com/google/googletest): While not a traditional blog, the Google Test GitHub repository is a rich resource for learning about testing in C++
- [Modern C++ Testing with Catch2](https://www.jetbrains.com/help/clion/unit-testing-tutorial.html)
- [C++ Testing - Catch2 and Google Test](https://www.learncpp.com/cpp-tutorial/introduction-to-testing-your-code/): LearnCpp.com provides a tutorial on testing in C++ using frameworks like Catch2 and Google Test.

### Further Reading

- Here is an example test case explaination for [test/plugins/wasi_logging](./example.md)