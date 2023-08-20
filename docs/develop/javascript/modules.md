---
sidebar_position: 7
---

# Built-in modules

The WasmEdge QuickJS runtime supports [ES6](es6) and [NPM](npm) modules for application developers. However, those approaches could be more convenient for system developers. They need an easier way to add multiple JavaScript modules and APIs into the runtime without using build tools like rollup.js. The WasmEdge QuickJS modules system allows developers to drop JavaScript files into a `modules` folder and have the JavaScript functions defined in the files immediately available to all JavaScript programs in the runtime. A good use case for this module's system is to support [Node.js](nodejs) APIs in WasmEdge.

In this article, we will use the [wasmedge-quickjs/modules](https://github.com/second-state/wasmedge-quickjs/tree/main/modules) as an example to showcase how to import NodeJS API or a third-party module.

## Prerequisites

[See here](./hello_world#prerequisites)

## The modules system

The modules system collects JavaScript files in the `modules` directory in the WasmEdge QuickJS distribution. To use the JavaScript functions and APIs defined in those modules, you need to map this directory to the `/modules` directory inside the WasmEdge Runtime instance. The following example shows how to do this on the WasmEdge CLI. You can do this with any of the host language SDKs that support the embedded use of WasmEdge.

```bash
wasmedge --dir /host/os/path/to/modules:/modules wasmedge_quickjs.wasm example_js/hello.js WasmEdge Runtime
```

## Add your own JavaScript modules

The [module_demo](https://github.com/second-state/wasmedge-quickjs/tree/main/example_js/module_demo) shows how you can use the modules system to add your own JavaScript APIs. To run the demo, first copy the two files in the demo's [modules](https://github.com/second-state/wasmedge-quickjs/tree/main/example_js/module_demo/modules) directory to your WasmEdge QuickJS's `modules` directory.

```bash
cp example_js/module_demo/modules/* modules/
```

The two JavaScript files in the `modules` directory provide two simple functions. Below is the [modules/my_mod_1.js](https://github.com/second-state/wasmedge-quickjs/blob/main/example_js/module_demo/modules/my_mod_1.js) file.

```javascript
export function hello_mod_1() {
  console.log('hello from "my_mod_1.js"');
}
```

And the [modules/my_mod_2.js](https://github.com/second-state/wasmedge-quickjs/blob/main/example_js/module_demo/modules/my_mod_2.js) file.

```javascript
export function hello_mod_2() {
  console.log('hello from "my_mod_2.js"');
}
```

Then, just run the [demo.js](https://github.com/second-state/wasmedge-quickjs/blob/main/example_js/module_demo/demo.js) file to call the two exported functions from the modules.

```javascript
import { hello_mod_1 } from 'my_mod_1';
import { hello_mod_2 } from 'my_mod_2';

hello_mod_1();
hello_mod_2();
```

Here is the command to run the demo and the output.

```bash
$ wasmedge --dir .:. wasmedge_quickjs.wasm example_js/module_demo/demo.js
hello from "my_mod_1.js"
hello from "my_mod_2.js"
```

Following the above tutorials, you can easily add third-party JavaScript functions and APIs to your WasmEdge QuickJS runtime.

We included JavaScript files to support [Node.js APIs](nodejs) for the official distribution. You can use [those files](https://github.com/second-state/wasmedge-quickjs/tree/main/modules) as further examples.
