---
sidebar_position: 1
---

# Use Cases

Featuring AOT compiler optimization, WasmEdge is one of the fastest WebAssembly runtimes on the market today. Therefore WasmEdge is widely used in edge computing, automotive, Jamstack, serverless, SaaS, service mesh, and even blockchain applications.

- Modern web apps feature rich UIs that are rendered in the browser and/or on the edge cloud. WasmEdge works with popular web UI frameworks, such as React, Vue, Yew, and Percy, to support isomorphic [server-side rendering (SSR)](../../embed/use-case/ssr-modern-ui.md) functions on edge servers. It could also support server-side rendering of Unity3D animations and AI-generated interactive videos for web applications on the edge cloud.

- WasmEdge provides a lightweight, secure and high-performance runtime for microservices. It is fully compatible with application service frameworks such as Dapr, and service orchestrators like Kubernetes. WasmEdge microservices can run on edge servers, and have access to distributed cache, to support both stateless and stateful business logic functions for modern web apps. Also related: Serverless function-as-a-service in public clouds.

- [Serverless SaaS (Software-as-a-Service)](/category/serverless-platforms) functions enables users to extend and customize their SaaS experience without operating their own API callback servers. The serverless functions can be embedded into the SaaS or reside on edge servers next to the SaaS servers. Developers simply upload functions to respond to SaaS events or to connect SaaS APIs.

- [Smart device apps](./wasm-smart-devices.md) could embed WasmEdge as a middleware runtime to render interactive content on the UI, connect to native device drivers, and access specialized hardware features (i.e, the GPU for AI inference). The benefits of the WasmEdge runtime over native-compiled machine code include security, safety, portability, manageability, and developer productivity. WasmEdge runs on Android, OpenHarmony, and seL4 RTOS devices.

- WasmEdge could support high performance DSLs (Domain Specific Languages) or act as a cloud-native JavaScript runtime by embedding a JS execution engine or interpreter.

- Developers can leverage container tools such as [Kubernetes](../../develop/deploy/kubernetes/kubernetes-containerd-crun.md), Docker and CRI-O to deploy, manage, and run lightweight WebAssembly applications.

- WasmEdge applications can be plugged into existing application frameworks or platforms.

If you have any great ideas on WasmEdge, don't hesitate to open a GitHub issue to discuss together.
