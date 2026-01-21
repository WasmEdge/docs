---
sidebar_position: 1
---

# Testing WasmEdge

Testing is an indispensable aspect of software development that aims to ensure the reliability, security, and performance of an application. For WasmEdge applications, which are designed to run in various environments ranging from edge devices to cloud servers, testing takes on added significance and confidence while deploying production grade application or tools

## Why is Testing Important for WasmEdge Applications?

### Reliability

WasmEdge applications often run in environments where failure is not an option, such as IoT devices or edge servers. Rigorous testing ensures that the application can handle various scenarios reliably.

### Performance 

Given that WasmEdge is designed for both edge and cloud computing, performance is a critical factor. Testing helps in identifying bottlenecks and optimizing code for better performance.

### Security

WebAssembly, and by extension WasmEdge, offers a sandboxed execution environment. Testing helps in ensuring that the security features are implemented correctly and that the application is resistant to common vulnerabilities.

### Compatibility

WasmEdge applications can run on various platforms. Testing ensures that your application behaves consistently across different environments.

### Maintainability

Well-tested code is easier to maintain and extend. It provides a safety net that helps developers make changes without fear of breaking existing functionality.

### Quality Assurance

Comprehensive testing is key to ensuring that the application meets all functional and non-functional requirements, thereby assuring quality.

## Testing a Simple Function in a WebAssembly Module

Let's assume you have a WebAssembly module that contains a function add which takes two integers and returns their sum. Here's how you can test it,

```cpp
#include <gtest/gtest.h>
#include <wasmedge.h>

TEST(WasmEdgeIntegrationTest, TestAddFunction) {
  WasmEdge::Configure Conf;
  WasmEdge::VM VM(Conf);

  // Load Wasm module
  ASSERT_TRUE(VM.loadWasm("path/to/your/add_module.wasm"));
  ASSERT_TRUE(VM.validate());
  ASSERT_TRUE(VM.instantiate());

  // Execute function
  auto Result = VM.execute("add", {3_u32, 4_u32});

  // Validate the result
  ASSERT_TRUE(Result);
  EXPECT_EQ(Result.value().get<uint32_t>(), 7);
}
```
