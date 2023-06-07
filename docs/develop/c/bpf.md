---
sidebar_position: 5
---

# Bpf userspace program example with wasm_bpf plugin

Currently, there is a WasmEdge plugin called `wasm_bpf` which provided APIs to perform operations on eBPF program, such ad loading, attaching and polling.

The detailed description could be found at [https://github.com/WasmEdge/WasmEdge/blob/master/plugins/wasm_bpf/README.md](https://github.com/WasmEdge/WasmEdge/blob/master/plugins/wasm_bpf/README.md).

Here we will provide several examples to demonstrate the `wasm_bpf` plugin

## Prerequisites

For simplicity, we will just reuse the `Makefile` of [wasm-bpf](https://github.com/eunomia-bpf/wasm-bpf), since `wasmEdge_bpfPlugin` has the exactly same API as `wasm-bpf`

1. Clone the [`wasm-bpf`](https://github.com/eunomia-bpf/wasm-bpf) repo.
2. Run `make install-deps` and `make /opt/wasi-sdk` at the root of the project. This will install the build prerequisites.
3. [Install WasmEdge](../build-and-run/install)
4. Build and install the `wasm_bpf` plugin. Currently, we have to build `wasm_bpf` plugin manually. The building instructions could be found at [https://github.com/WasmEdge/WasmEdge/tree/master/plugins/wasm_bpf#build-wasm_bpf-plug-in](https://github.com/WasmEdge/WasmEdge/tree/master/plugins/wasm_bpf#build-wasm_bpf-plug-in)

## The bootstrap example

`bootstrap` is a simple eBPF program to track the entry and exit of all processes. It will print a line of message when there is an entry of exiting event of a process.

Run `make` in `wasm-bpf/examples/bootstrap`, and you will find the `bootstrap.wasm`, which can be executed by `WasmEdge`.

```bash
WASMEDGE_PLUGIN_PATH=./build/plugins/wasm_bpf/ wasmedge bootstrap.wasm
```

`WASMEDGE_PLUGIN_PATH` should be changed due to your build directory of the plugin.

Example output:

```bash
TIME     EVENT COMM             PID     PPID    FILENAME/EXIT CODE
13:38:00 EXEC  bash             121487  40189   /usr/bin/bash
13:38:00 EXEC  groups           121489  121487  /usr/bin/groups
13:38:00 EXIT  groups           121489  121487  [0] (3ms)
13:38:00 EXEC  lesspipe         121490  121487  /usr/bin/lesspipe
13:38:00 EXEC  basename         121491  121490  /usr/bin/basename
13:38:00 EXIT  basename         121491  121490  [0] (8ms)
13:38:00 EXEC  dirname          121493  121492  /usr/bin/dirname
13:38:00 EXIT  dirname          121493  121492  [0] (1ms)
13:38:00 EXIT  lesspipe         121492  121490  [0]
```

### Details of `bootstrap`

`bootstrap` was created in the similar spirit as libbpf-tools from BCC package, but is designed to be more stand-alone and with simpler Makefile to simplify adoption to user's particular needs. It demonstrates the use of typical BPF features:

cooperating BPF programs (tracepoint handlers for process `exec` and `exit` events, in this particular case); BPF map for maintaining the state; BPF ring buffer for sending data to user-space; global variables for application behavior parameterization. it utilizes BPF CO-RE and vmlinux.h to read extra process information from kernel's struct task_struct.

#### Some code snippets

A bpf program from `bootstrap.bpf.c`. It tracks the exeution of processes, wraps the event in a struct, and send the struct to the userspace program through ringbuf.

```c
SEC("tp/sched/sched_process_exec")
int handle_exec(struct trace_event_raw_sched_process_exec* ctx) {
    struct task_struct* task;
    unsigned fname_off;
    struct event* e;
    pid_t pid;
    u64 ts;

    /* remember time exec() was executed for this PID */
    pid = bpf_get_current_pid_tgid() >> 32;
    ts = bpf_ktime_get_ns();
    bpf_map_update_elem(&exec_start, &pid, &ts, BPF_ANY);

    /* don't emit exec events when minimum duration is specified */
    if (min_duration_ns)
        return 0;

    /* reserve sample from BPF ringbuf */
    e = bpf_ringbuf_reserve(&rb, sizeof(*e), 0);
    if (!e)
        return 0;

    /* fill out the sample with data */
    task = (struct task_struct*)bpf_get_current_task();

    e->exit_event = false;
    e->pid = pid;
    e->ppid = BPF_CORE_READ(task, real_parent, tgid);
    bpf_get_current_comm(&e->comm, sizeof(e->comm));

    fname_off = ctx->__data_loc_filename & 0xFFFF;
    bpf_probe_read_str(&e->filename, sizeof(e->filename),
                       (void*)ctx + fname_off);

    /* successfully submit it to user-space for post-processing */
    bpf_ringbuf_submit(e, 0);
    return 0;
}
```

The core process of the userspace program (which is compiled to Wasm). It invokes APIs from `wasm_bpf` to open, load, attach the bpf program, and poll data from the ringbuf.

```c
/* Load and verify BPF application */
    skel = bootstrap_bpf__open();
    if (!skel) {
        fprintf(stderr, "Failed to open and load BPF skeleton\n");
        return 1;
    }

    /* Parameterize BPF code with minimum duration parameter */
    skel->rodata->min_duration_ns = env.min_duration_ms * 1000000ULL;

    /* Load & verify BPF programs */
    err = bootstrap_bpf__load(skel);
    if (err) {
        fprintf(stderr, "Failed to load and verify BPF skeleton\n");
        goto cleanup;
    }

    /* Attach tracepoints */
    err = bootstrap_bpf__attach(skel);
    if (err) {
        fprintf(stderr, "Failed to attach BPF skeleton\n");
        goto cleanup;
    }

    /* Set up ring buffer polling */
    rb = bpf_buffer__open(skel->maps.rb, handle_event, NULL);
    if (!rb) {
        err = -1;
        fprintf(stderr, "Failed to create ring buffer\n");
        goto cleanup;
    }
    /* Process events */
    printf("%-8s %-5s %-16s %-7s %-7s %s\n", "TIME", "EVENT", "COMM", "PID",
           "PPID", "FILENAME/EXIT CODE");
    while (!exiting) {
        // poll buffer
        err = bpf_buffer__poll(rb, 100 /* timeout, ms */);
        /* Ctrl-C will cause -EINTR */
        if (err == -EINTR) {
            err = 0;
            break;
        }
        if (err < 0) {
            printf("Error polling perf buffer: %d\n", err);
            break;
        }
    }
```

## Other examples

Each directory under `wasm-bpf/examples` represents an example able to be run using `WasmEdge`. You can run `make` in their directory and run the corresponding Wasm with `WasmEdge`
