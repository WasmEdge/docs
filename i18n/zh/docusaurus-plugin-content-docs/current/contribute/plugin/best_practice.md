---
sidebar_position: 6
---

# Best Practice 

When developing a WasmEdge plugin, it's important to follow certain best practices to ensure the plugin is robust, reliable, and efficient. Here are some key best practices to follow:

## Choosing the Appropriate Programming Language

WasmEdge plugins can be developed in several languages including C, C++, and Rust. The choice of language depends on the specific requirements of the plugin and the developer's expertise. The C API is recommended for most use cases due to its simplicity and wide support. However, complex plugins might benefit from the enhanced features of C++ or Rust.
   
## Writing and Compiling the Plugin

To create a plugin, you need to define a function in C or C++, and declare it with the `extern "C"` keyword to ensure that the function is exported using C-compatible naming conventions. 

```ccp
extern "C" void my_function() {
    // Your plugin code goes here
}
```

In this code, we define a function named my_function and use the extern "C" keyword to ensure that the function name is compatible with C naming conventions. This is necessary because the WasmEdge runtime uses C-style linking.

Then compile the function as a shared library. You can compile this function into a shared library using a compiler such as g++. The specific command would depend on your operating system and setup, but here's a basic example for Linux:

```bash
g++ -shared -o my_plugin.so my_plugin.cpp
```

In this command, `g++` is the compiler, `-shared` tells the compiler to create a shared library, -`o my_plugin.so` specifies the output file name, and `my_plugin.cpp` is the source file containing your function.

Remember to replace `my_plugin.cpp` and `my_plugin.so` with your actual source file name and desired output file name.

Please note that this is a simplified example. In a real-world scenario, your plugin would likely contain more complex code, and you might need to include additional compiler flags or link against other libraries.

## Testing the Plugin

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

By following these steps, you can effectively run tests for the `wasmedge-image` plugin or any other WasmEdge plugin. Also if you want to develop your own tests follow [Writing Tests for WasmEdge Plugins](test_plugin.md) for details.

## Publishing the Plugin

Once you have developed, tested, and documented your WasmEdge plugin, it’s time to publish it for others to use. You can publish your plugin on the official WasmEdge plugin repository or any other repository of your choice.
   
## Contributing to the WasmEdge Community

As an open-source contributor, you can share your plugin with the community by submitting it to the official WasmEdge repository. This allows others to benefit from your work, and also opens up opportunities for collaboration and improvement.

By following these best practices, you can ensure a successful and efficient plugin development process for WasmEdge.
