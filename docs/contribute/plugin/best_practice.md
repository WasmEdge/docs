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

   To run tests for the WasmEdge plugin, you'll need to follow a few steps. In this case, we'll use the `wasmedge-image` plugin as an example.

      - **Step 1: Build the WasmEdge Runtime and WasmEdge-image Plugin** 
      First, you need to build both the WasmEdge runtime and the wasmedge-image plugin. To do this, you can clone the WasmEdge repository and build it using the following commands:

      ```bash
      git clone https://github.com/WasmEdge/WasmEdge.git
      cd WasmEdge
      mkdir build && cd build
      cmake ..
      make
      sudo make install
      ```

      You also need to build the `wasmedge-image` plugin. Use the following command:

      ```bash
      cd ../plugins/wasmedge_image
      mkdir build && cd build
      cmake ..
      make
      sudo make install
      ```

      - **Step 2: Run the Tests**
      The WasmEdge repository provides a set of tests for various plugins, including `wasmedge-image`. You can find the test cases in the `test/plugins/wasmedge_image` directory of the repository.

         To run these tests, you can use the `ctest` command from the build directory:

         ```bash
         cd ../../../test/plugins/wasmedge_image
         mkdir build && cd build
         cmake ..
         make
         ctest
         ```

   This will run all the unit tests and integration tests for the `wasmedge-image `plugin. These tests ensure that the plugin behaves as expected, meets the requirements, and performs optimally. They also verify that the plugin correctly integrates with the WebAssembly program and that the WebAssembly program can call the plugin's functions correctly.

   - **Step 3: Analyze the Test Results**
   After running the tests, analyze the results to identify any issues or bugs. If any test fails, you should debug the issue, fix the problem, and then rerun the tests to ensure that the fix works as expected.

   By following these steps, you can effectively run tests for the `wasmedge-image` plugin or any other WasmEdge plugin.

6. **Publishing the Plugin:**
   Once you have developed, tested, and documented your WasmEdge plugin, it’s time to publish it for others to use. You can publish your plugin on the official WasmEdge plugin repository or any other repository of your choice.
   
8. **Contributing to the WasmEdge Community:**
   As an open-source contributor, you can share your plugin with the community by submitting it to the official WasmEdge repository. This allows others to benefit from your work, and also opens up opportunities for collaboration and improvement.

By following these best practices, you can ensure a successful and efficient plugin development process for WasmEdge.
