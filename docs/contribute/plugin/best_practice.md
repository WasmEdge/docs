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
   Testing is a crucial step in the development process to ensure that the plugin behaves as expected. There are various testing techniques such as unit testing, integration testing, and fuzz testing that can be used. Unit testing involves testing individual functions or units of code, integration testing involves testing the interaction between the plugin and the Wasm program, and fuzz testing involves generating random input to the plugin to test its robustness and resilience.
   
6. **Publishing the Plugin:**
   Once you have developed, tested, and documented your WasmEdge plugin, it’s time to publish it for others to use. You can publish your plugin on the official WasmEdge plugin repository or any other repository of your choice.
   
8. **Contributing to the WasmEdge Community:**
   As an open-source contributor, you can share your plugin with the community by submitting it to the official WasmEdge repository. This allows others to benefit from your work, and also opens up opportunities for collaboration and improvement.

By following these best practices, you can ensure a successful and efficient plugin development process for WasmEdge.
