---
sidebar_position: 2
---

# Types of Testing

Testing WasmEdge applications and Wasm code written in C++ involves a multi-layered approach to ensure robustness, performance, and compatibility. Below are the types of testing you can perform,

## Unit Testing

### Native Code
- Use native testing frameworks like **Google Test** for C++ to test your code before compiling it to WebAssembly.
  ```cpp
  #include <gtest/gtest.h>
  TEST(MyFunctionTest, HandlesPositiveInput) {
    EXPECT_EQ(my_function(1, 2), 3);
  }

### Wasm Code

Use WasmEdge API to write tests that load and execute WebAssembly modules, verifying their behavio

```cpp
#include <wasmedge.h>
TEST(WasmEdgeTest, RunMyProgram) {
  WasmEdge::Configure Conf;
  WasmEdge::VM VM(Conf);
  EXPECT_TRUE(VM.loadWasm("my_program.wasm"));
  EXPECT_TRUE(VM.validate());
  EXPECT_TRUE(VM.instantiate());
  auto Result = VM.execute("my_function", {3_u32, 4_u32});
  EXPECT_TRUE(Result);
  EXPECT_EQ(Result.value().get<uint32_t>(), 7);
}
```

## Integration Testing

### API Testing

Test the interaction between your WebAssembly modules and the host environment, whether it's a web browser, Node.js, or a cloud-based application.

Here's a C++ code snippet that uses the WasmEdge API to load a WebAssembly module and execute a function. This function could be one that interacts with an external API.

```cpp
#include <wasmedge.h>
#include <gtest/gtest.h>

TEST(WasmEdgeIntegrationTest, TestAPIInteraction) {
    WasmEdge::Configure Conf;
    WasmEdge::VM VM(Conf);

    // Load Wasm module
    ASSERT_TRUE(VM.loadWasm("path/to/your_module.wasm"));
    ASSERT_TRUE(VM.validate());
    ASSERT_TRUE(VM.instantiate());

    // Execute a function that is supposed to interact with an external API
    auto Result = VM.execute("call_external_api_function", { /* parameters */ });

    // Validate the result
    ASSERT_TRUE(Result);
    EXPECT_EQ(Result.value().get<int>(), /* expected_value */);
}
```

### Testing Data Flow with Mock Database

Suppose your WebAssembly module interacts with a database. You can mock this database interaction to test the data flow.

```cpp
#include <wasmedge.h>
#include <gtest/gtest.h>
#include <mock_database_library.h>

TEST(WasmEdgeIntegrationTest, TestDataFlow) {
    // Setup mock database
    MockDatabase mockDB;
    mockDB.setReturnValue("some_query", "expected_result");

    WasmEdge::Configure Conf;
    WasmEdge::VM VM(Conf);

    // Load Wasm module
    ASSERT_TRUE(VM.loadWasm("path/to/your_module.wasm"));
    ASSERT_TRUE(VM.validate());
    ASSERT_TRUE(VM.instantiate());

    // Execute a DB function
    auto Result = VM.execute("call_database_function", { /* parameters */ });

    // Validation
    ASSERT_TRUE(Result);
    EXPECT_EQ(Result.value().get<std::string>(), "expected_result");
}
```

### Error Handling

Let's assume you have a WebAssembly function divide that takes two integers and returns the result of division. This function should handle division by zero gracefully. Here's how you can test it,

```cpp
#include <gtest/gtest.h>
#include <wasmedge.h>

TEST(WasmEdgeIntegrationTest, TestDivideFunction) {
  WasmEdge::Configure Conf;
  WasmEdge::VM VM(Conf);

  // Load Wasm module
  ASSERT_TRUE(VM.loadWasm("path/to/your/divide_module.wasm"));
  ASSERT_TRUE(VM.validate());
  ASSERT_TRUE(VM.instantiate());

  // Test zero division
  auto Result = VM.execute("divide", {4_u32, 0_u32});

  // Validate that the function handles the error gracefully
  ASSERT_FALSE(Result);
}

```

## End-to-End Testing

End-to-End testing involves testing the flow of an application from start to finish to ensure the entire process of a user's interaction performs as designed. In the context of WasmEdge, this means testing not just the WebAssembly modules but also their interaction with the host environment, external APIs, databases, and even user interfaces if applicable.

In the below example, we will try to mock an external API and Database interaction

```cpp
#include <gtest/gtest.h>
#include <wasmedge.h>
#include <map> // For mocking the database

// Mock for the external API
std::string mock_fetch_data() {
  return "sample_data";
}

// Mock for the database
std::map<int, std::string> mock_database;

void mock_store_data(int id, const std::string& processed_data) {
  mock_database[id] = processed_data;
}

TEST(WasmEdgeE2ETest, TestProcessDataFunction) {
  WasmEdge::Configure Conf;
  WasmEdge::VM VM(Conf);

  // Load Wasm Module
  ASSERT_TRUE(VM.loadWasm("path/to/your/process_data_module.wasm"));
  ASSERT_TRUE(VM.validate());
  ASSERT_TRUE(VM.instantiate());

  // Register the mock API and Database functions
  VM.registerHostFunction("mock_fetch_data", mock_fetch_data);
  VM.registerHostFunction("mock_store_data", mock_store_data);

  // Run the 'process_data' function
  auto Result = VM.execute("process_data", {1});

  // Validate that the data is processed and stored correctly
  ASSERT_TRUE(Result);
  ASSERT_EQ(mock_database[1], "processed_sample_data");
}

int main(int argc, char **argv) {
  ::testing::InitGoogleTest(&argc, argv);
  return RUN_ALL_TESTS();
}

```

## Performance Testing

Performance testing aims to evaluate the system's responsiveness, stability, and speed under different conditions. For WasmEdge applications, this could mean testing:

1. **Execution Time:** How long it takes for a WebAssembly function to execute.
2. **Resource Utilization:** How much CPU, memory, and other resources are used.
3. **Scalability:** How well the application performs as the load increases.
4. **Concurrency:** How the system behaves with multiple users or requests.

For example, Let's consider you have a Wasm function `compute` that performs some complex calculations

```cpp
#include <benchmark/benchmark.h>
#include <wasmedge.h>

static void BM_WasmEdgeComputeFunction(benchmark::State& state) {
  WasmEdge::Configure Conf;
  WasmEdge::VM VM(Conf);

  // Load Wasm module
  VM.loadWasm("path/to/your/compute_module.wasm");
  VM.validate();
  VM.instantiate();

  // Benchmark the 'compute' function
  for (auto _ : state) {
    auto Result = VM.execute("compute", {1000_u32}); 
    if (!Result) {
      state.SkipWithError("Function execution failed");
      break;
    }
  }
}
BENCHMARK(BM_WasmEdgeComputeFunction);

BENCHMARK_MAIN();
```


## Further Testing

1. **Environment-Specific Behavior:** Given that WasmEdge can run on various environments (cloud, edge, browser, etc.), your tests may need to cover these different scenarios as well.

2. **Security:** Testing of vulnerabilities that can be exploited when the WebAssembly module interacts with external services or databases may also be needed for your use cases.
