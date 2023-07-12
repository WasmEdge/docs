---
sidebar_position: 4
---

# Develop WasmEdge Plug-in in Rust SDK with witc

By developing a plugin, one can extend the functionality of WasmEdge and customize it to suit the specific needs. WasmEdge provides a Rust based API for registering extension modules and host functions.

<!-- prettier-ignore -->
:::note
It is recommended that developers choose the WasmEdge [C API](develop_plugin_c.md) for plugin development because of the support, compatibility and flexibility provided by the WasmEdge runtime.
:::

## Set up the development environment

To start developing WasmEdge plugins, it is essential to set up the development environment properly. This section provides step-by-step instructions for WasmEdge plugin development -

- **Build WasmEdge from source**: For developing WasmEdge plugin in C++ language, you will need to build WasmEdge from source. Follow the[build WasmEdge from source](../source/build_from_src.md) for instructions. Once you complete C++ plugin code, you can use witc[^1] to generate Rust Plugin SDK.
- **Install WasmEdge with plugins (optional)**: Installing WasmEdge with existing plugins can provide you with additional functionality and serve as a reference for your own plugin development. If you want to utilize or test the compatibility of your new plugin with existing plugins, you can install them using the provided installer script. The installed plugins will be available for your development environment.

  To see a list of supported plugins and their specific install commands, see the [Install WasmEdge](develop/build-and-run/install) plugins and dependencies section.

- **Install a compatible compiler**: Rust has its own built-in compiler, which can be installed using rustup:

  ```bash
  curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
  source $HOME/.cargo/env
  ```

- **Install necessary tools and dependencies**: You can use any text editor or IDE of your choice to write code. Here are some popular options:

  - [Visual Studio Code](https://code.visualstudio.com/)
  - [Atom](https://atom.io/)
  - [Sublime Text](https://www.sublimetext.com/)

  For debugging, you can use GDB, LLDB, or other debuggers that support WebAssembly. To install GDB, run `sudo apt-get install gdb`.

- **Enable specific backends or additional components (if applicable):** Some plugins may require enabling specific backends or additional components to extend their functionality. The following links provide instructions for enabling specific backends in WasmEdge:

  - [OpenVINO™](https://docs.openvino.ai/2021.4/openvino_docs_install_guides_installing_openvino_linux.html#)(2021)
  - [TensorFlow Lite](/contribute/source/plugin/wasi_nn#build-wasmedge-with-wasi-nn-tensorflow-lite-backend)
  - [PyTorch 1.8.2 LTS](https://pytorch.org/get-started/locally/)

By following these steps, you can set up the development environment for creating WasmEdge plugins effectively. This will allow you to develop, test, and debug your plugins in a Linux environment.

## Write the plugin code

To develop a WasmEdge Plug-in in Rust using the witc tool, you can follow these steps:

- **Generate Rust Plugin Code**: Consider you have a file named wasmedge_opencvmini.wit with the following content:

```wit
imdecode: func(buf: list<u8>) -> u32
imshow: func(window-name: string, mat-key: u32) -> unit
waitkey: func(delay: u32) -> unit
```

You can use the witc tool to generate Rust plugin code for it by running the following command:

```shell
witc plugin wasmedge_opencvmini.wit
```

- **Create SDK Crate**: Now, you need to create an SDK crate for your plugin. Run the following command to create a new crate named opencvmini-sdk:

```shell
cargo new --lib opencvmini-sdk && cd opencvmini-sdk
```

- **Create Module File**: The witc tool puts the Rust code to stdout. To capture the generated code, create a new module file named src/generated.rs and run the following command:

```shell
witc plugin wasmedge_opencvmini.wit > src/generated.rs
```

- **Write Wrapper Functions**: In the `src/lib.rs` file of your crate, write the following code of `mod generated` to access the generated code and create wrapper functions:

```rust
mod generated;

pub fn imdecode(buf: &[u8]) -> u32 {
    unsafe { generated::imdecode(buf.as_ptr(), buf.len()) }
}
pub fn imshow(window_name: &str, mat_key: u32) -> () {
    unsafe { generated::imshow(window_name.as_ptr(), window_name.len(), mat_key) }
}
pub fn waitkey(delay: u32) -> () {
    unsafe { generated::waitkey(delay) }
}
```

This code imports the generated module and provides safe wrapper functions for each generated function.

[^1]: <https://github.com/second-state/witc>
