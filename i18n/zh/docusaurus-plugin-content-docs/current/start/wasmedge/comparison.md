---
sidebar_position: 5
---

# 对比

## WebAssembly 与 Docker 之间的关系是什么？

请查看我们的信息图表 [WebAssembly vs. Docker](https://wasmedge.org/wasm_docker/)。在云原生和边缘原生应用中，WebAssembly 与 Docker 并驾齐驱。

## Native clients（NaCl）、应用程序运行时和 WebAssembly 之间有何区别？

我们创建了一个便捷的表格进行对比。

|  | NaCl | Application runtimes (eg Node &amp; Python) | Docker-like container | WebAssembly |
| --- | --- | --- | --- | --- |
| Performance | Great | Poor | OK | Great |
| Resource footprint | Great | Poor | Poor | Great |
| Isolation | Poor | OK | OK | Great |
| Safety | Poor | OK | OK | Great |
| Portability | Poor | Great | OK | Great |
| Security | Poor | OK | OK | Great |
| Language and framework choice | N/A | N/A | Great | OK |
| Ease of use | OK | Great | Great | OK |
| Manageability | Poor | Poor | Great | Great |

## WebAssembly 与 eBPF 有何区别？

`eBPF` 是适用于网络或安全相关任务的 Linux 内核空间虚拟机的字节码格式。而 WebAssembly 是适用于业务应用的用户空间虚拟机的字节码格式。[点击此处查看详细信息](https://medium.com/codex/ebpf-and-webassembly-whose-vm-reigns-supreme-c2861ce08f89)。
