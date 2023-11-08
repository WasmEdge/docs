---
sidebar_position: 4
---

# Troubleshooting Guide

This guide aims to provide solutions to common problems you may encounter when using WasmEdge, helping you to troubleshoot effectively and get back to your development work as quickly as possible.

## Installation Issues

If you encounter errors during the installation process, make sure to check the following:

1. **Supported Platform**: Make sure you are running a [supported operating system and architecture](https://wasmedge.org/docs/start/install/).

2. **Dependencies**: Ensure that all necessary dependencies are installed and up-to-date. This includes the correct versions of your compiler, build system (like CMake), and any libraries that WasmEdge depends on.

3. **Environment**: Check your environment variables and paths. Some issues can be caused by incorrect paths or missing environment variables.

## Runtime Errors

Runtime errors can occur for a variety of reasons. Here are some common causes and solutions:

1. **Incorrect Usage**: If you're getting errors when executing a Wasm file, make sure that you're using the wasmedge command correctly. Check the [CLI documentation](https://wasmedge.org/docs/start/build-and-run/cli/) to make sure you're using the correct syntax and options.

2. **Incompatible Wasm Files**: Not all Wasm files are compatible with WasmEdge. If the Wasm file uses features or instructions that are not supported by WasmEdge, it may fail to execute. Make sure the Wasm file is compatible with WasmEdge.

3. **Plugin Issues**: If you're using plugins and they're causing issues, make sure the plugins are correctly installed and configured. Check the [plugin documentation](https://wasmedge.org/docs/category/wasmedge-plugin-system) for any specific requirements or known issues.

## Performance Issues

If WasmEdge is running slowly or consuming too much memory, consider the following:

1. **Optimization**: Make sure you're using the AOT compiler if performance is a concern. The AOT compiler can significantly speed up the execution of Wasm files.

2. **Memory Usage**: If memory usage is too high, consider whether the Wasm file or the data it's processing is too large. You may need to optimize the Wasm file or adjust the way it processes data.

## Contributing to WasmEdge

If you're having trouble contributing to WasmEdge, make sure to:

1. **Follow the Contribution Guidelines**: Ensure that your contributions follow the guidelines provided in the WasmEdge repository.

2. **Understand the Code**: Make sure you have a good understanding of the WasmEdge codebase before making changes.

3. **Test Your Changes**: Always test your changes before submitting a pull request. This can help catch issues early and make the review process smoother.

If any of the above steps do not help you, you should ask about your problem in Wasmedge's [discord server](https://discord.gg/h4KDyB8XTt) for furthur help. 