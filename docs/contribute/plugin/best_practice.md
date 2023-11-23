---
sidebar_position: 6
---

# Best Practice 

When developing a WasmEdge plugin, it's important to follow certain best practices to ensure the plugin is robust, reliable, and efficient. Here are some key best practices to follow:

## Using the Latest Version of WasmEdge

Always use the latest version of WasmEdge to take advantage of the most recent features, improvements, and security updates. 

### Installing the Latest Version

To install the latest version of WasmEdge, follow the installation instructions in the [WasmEdge documentation](https://wasmedge.org/docs/start/install/).

### Updating Existing Plugins

If you have existing plugins that were developed with an older version of WasmEdge, you may need to update them to work with the latest version. This could involve updating the plugin code to use new features or changes in the [WasmEdge API](https://wasmedge.org/docs/category/api-reference/), or updating the build process to use the latest version of WasmEdge.

Remember, using the latest version of WasmEdge not only ensures that you're leveraging the most recent features, but also provides the latest security updates to protect your applications.


## Choosing the Appropriate Programming Language

WasmEdge plugins can be developed in several languages including [C](develop_plugin_c.md), [C++](develop_plugin_cpp.md), and [Rust](develop_plugin_rustsdk.md). The choice of language depends on the specific requirements of the plugin and the developer's expertise. The C API is recommended for most use cases due to its simplicity and wide support. However, complex plugins might benefit from the enhanced features of C++ or Rust.
   
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
   First, you need to build both the [build WasmEdge](../source/build_from_src.md) and the [wasmedge-image](../source/plugin/image.md) plugin. To do this, you can clone the WasmEdge repository and build it using the following commands:

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

<!-- prettier-ignore -->
:::note
If you want to develop your own tests follow [Writing Tests for WasmEdge Plugins](test_plugin.md) for details.
::: 

## Securing the Plugin

Security is a vital part of any software development process. It involves several aspects, including securing the code, verifying inputs, handling errors properly, and using secure coding practices. When developing a WasmEdge plugin, it's essential to follow these best practices:

   - **Validate Inputs:** Always validate the inputs to your functions. This can prevent many types of attacks, including buffer overflow attacks and code injection attacks.

      ```cpp
      WasmEdge_Result Add(void *, const WasmEdge_CallingFrameContext *,
                           const WasmEdge_Value *In, WasmEdge_Value *Out) {
         if (In[0].Type != WasmEdge_ValType_I32 || In[1].Type != WasmEdge_ValType_I32) {
         return WasmEdge_Result_Error;
         }
         // Rest of the function...
      }
      ```

   - **Handle Errors:** Always handle errors properly. Don't ignore return values that indicate an error, and don't continue execution after an error occurs.

      ```cpp
      WasmEdge_Result Add(void *, const WasmEdge_CallingFrameContext *,
                           const WasmEdge_Value *In, WasmEdge_Value *Out) {
         // Check the input types...
         int32_t Val1 = WasmEdge_ValueGetI32(In[0]);
         int32_t Val2 = WasmEdge_ValueGetI32(In[1]);
         if (Val1 == INT32_MIN || Val2 == INT32_MIN) {
         return WasmEdge_Result_Error;
         }
         // Rest of the function...
      }
      ```

   - **Use Secure Coding Practices:** Follow secure coding practices in your chosen language. For example, avoid using unsafe functions, use strong types, and avoid using global variables.

## Publishing the Plugin

Once you have developed, tested, and documented your WasmEdge plugin, it’s time to publish it for others to use. You need to follow following steps for publishing your plugin:

## Exporting the SDKs in Rust

In addition to C and C++ SDKs, you can also create an SDK for Rust developers. This involves creating a Rust library that provides a Rust interface to your plugin's functionality.

### Creating a Rust Library

You can create a Rust library that provides a Rust interface to your plugin's functionality. This involves writing Rust code that calls the functions in your plugin and provides a Rust-friendly API.

In the wasmedge-image plugin's case, you might have something like this:

```rust 
// lib.rs
extern crate wasmedge_image;

use wasmedge_image::Image;

pub fn load_image(path: &str) -> Result<Image, wasmedge_image::Error> {
    Image::open(path)
}
```
In this Rust library, a single `load_image` function is provided that calls the `open` function from the `wasmedge-image` plugin.

### Building the Rust Library

You can build your Rust library using Cargo, the Rust package manager. This will produce a `.so` file that can be loaded by the WasmEdge runtime.

```bash 
cargo build --release
```

### Packaging the Rust SDK

Package the Rust library and the header file into a tarball or a similar package format. This makes it easy for other developers to download and install your SDK.

```bash 
tar czvf wasmedge_image_rust_sdk.tar.gz libwasmedge_image.so wasmedge_image.h
```

With this package, other Rust developers can easily use your plugin in their applications. They just need to include your header file in their code, and link against your Rust library when they compile their application.

Now, When you're ready to publish your plugin and the corresponding SDK, can publish your plugin on the official WasmEdge [plugin repository](https://github.com/WasmEdge/WasmEdge/tree/master/plugins) by creating a pull request into it or any other repository of your choice. Make sure to include the documentation and any other resources (like test files) with your plugin.
   
## Contributing to the WasmEdge Community

As an open-source contributor, you can share your plugin with the community by submitting it to the official WasmEdge repository. This allows others to benefit from your work, and also opens up opportunities for collaboration and improvement.

By following these best practices, you can ensure a successful and efficient plugin development process for WasmEdge.
