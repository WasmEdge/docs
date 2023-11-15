---
sidebar_position: 5
---

# Best Practice 

When developing a WasmEdge plugin, it's important to follow certain best practices to ensure the plugin is robust, reliable, and efficient. Here are some key best practices to follow:

1. **Choosing the Appropriate Programming Language:**
   WasmEdge plugins can be developed in several languages including C, C++, and Rust. The choice of language depends on the specific requirements of the plugin and the developer's expertise. The C API is recommended for most use cases due to its simplicity and wide support. However, complex plugins might benefit from the enhanced features of C++ or Rust.
   
3. **Writing and Compiling the Plugin:**
   To create a plugin, you need to define a function in C or C++, and declare it with the `extern "C"` keyword to ensure that the function is exported using C-compatible naming conventions. Then, compile the function as a shared library.

4. **Registering the Plugin with WasmEdge Runtime:**
   After compiling the shared library, you need to register the function with the WasmEdge runtime. 

5. **Testing the Plugin:**
   Testing is a crucial part of the plugin development process. It ensures that the plugin behaves as expected, meets the requirements, and performs optimally. WasmEdge provides a set of tests for various plugins in its [repository](https://github.com/WasmEdge/WasmEdge/tree/master/test/plugins) that you can use as references for writing your own tests.

      - **Unit Testing:** Unit testing involves testing individual functions or units of code in isolation. In the context of a WasmEdge plugin, this means testing the native host functions that you have defined. WasmEdge provides a [unit test example](https://github.com/WasmEdge/WasmEdge/tree/master/test/plugins/unittest) in its repository. This example uses Google Test to define and run a series of tests for a plugin, with each test corresponding to a specific function in the plugin. You can use this example as a template for creating your own unit tests.

      - **Integration Testing:**  Integration testing involves testing the interaction between the plugin and a WebAssembly program. This ensures that the plugin correctly integrates with the WebAssembly program and that the WebAssembly program can call the plugin’s functions correctly. To perform integration testing, you can create a test WebAssembly program that uses the plugin’s functions and verifies the results.

      - **Fuzz Testing:** Fuzz testing involves generating random input to the plugin to test its robustness and resilience. The goal of fuzz testing is to discover edge cases and unexpected behavior that may cause the plugin to fail or crash.

   While testing, remember to use the [test cases](https://github.com/WasmEdge/WasmEdge/tree/master/test/plugins) provided in the WasmEdge repository as a guide to structure and implement your tests.

6. **Publishing the Plugin:**
   Once you have developed, tested, and documented your WasmEdge plugin, it’s time to publish it for others to use. You can publish your plugin on the official WasmEdge plugin repository or any other repository of your choice.
   
8. **Contributing to the WasmEdge Community:**
   As an open-source contributor, you can share your plugin with the community by submitting it to the official WasmEdge repository. This allows others to benefit from your work, and also opens up opportunities for collaboration and improvement.

By following these best practices, you can ensure a successful and efficient plugin development process for WasmEdge.
