---
sidebar_position: 5
---

# 使用 wasm_bpf 外掛的 Bpf 使用者空間程式範例

WasmEdge 提供了一個名為 `wasm_bpf` 的外掛，提供了用於操作 eBPF 程式的 API，例如載入、附加（attaching）以及輪詢（polling）。

詳細說明可參閱 [https://github.com/WasmEdge/WasmEdge/blob/master/plugins/wasm_bpf/README.md](https://github.com/WasmEdge/WasmEdge/blob/master/plugins/wasm_bpf/README.md)。

接下來我們將提供幾個範例來示範 `wasm_bpf` 外掛。

## 先決條件

為了簡化說明，我們將重複使用 [wasm-bpf](https://github.com/eunomia-bpf/wasm-bpf) 的 `Makefile`，因為 `wasmEdge_bpfPlugin` 擁有與 `wasm-bpf` 完全相同的 API。

1. 複製（clone）[`wasm-bpf`](https://github.com/eunomia-bpf/wasm-bpf) 儲存庫。
2. 在專案根目錄執行 `make install-deps` 與 `make /opt/wasi-sdk`。這會安裝建置所需的先決條件。
3. [安裝 WasmEdge](../../start/install.md#install)
4. 建置並安裝 `wasm_bpf` 外掛。目前我們必須手動建置 `wasm_bpf` 外掛。建置說明可參閱 [https://github.com/WasmEdge/WasmEdge/tree/master/plugins/wasm_bpf#build-wasm_bpf-plug-in](https://github.com/WasmEdge/WasmEdge/tree/master/plugins/wasm_bpf#build-wasm_bpf-plug-in)。

## bootstrap 範例

`bootstrap` 是一個簡單的 eBPF 程式，用於追蹤所有行程的進入與離開。當有行程進入或結束事件發生時，它會印出一行訊息。

在 `wasm-bpf/examples/bootstrap` 目錄中執行 `make`，您會看到 `bootstrap.wasm`，它可以由 `WasmEdge` 執行。

```bash
WASMEDGE_PLUGIN_PATH=./build/plugins/wasm_bpf/ wasmedge bootstrap.wasm
```

`WASMEDGE_PLUGIN_PATH` 應根據您的外掛建置目錄做相應變更。

範例輸出：

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

### `bootstrap` 的細節

`bootstrap` 是以類似 BCC 套件中 libbpf-tools 的精神建立的，但其設計更加獨立，並使用較簡單的 Makefile，以便使用者更容易因應特定需求做出調整。它示範了典型 BPF 功能的使用：

協作式的 BPF 程式（在此案例中為行程 `exec` 與 `exit` 事件的 tracepoint 處理器）；用於維護狀態的 BPF map；用於將資料傳送到使用者空間的 BPF ring buffer；以及用於應用程式行為參數化的全域變數。它利用 BPF CO-RE 與 vmlinux.h 從核心的 struct task_struct 讀取額外的行程資訊。

#### 程式碼片段

來自 `bootstrap.bpf.c` 的 bpf 程式。它追蹤行程的執行，將事件封裝在 struct 中，並透過 ringbuf 將該 struct 傳送至使用者空間的程式。

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

使用者空間程式的核心流程（編譯為 Wasm）。它從 `wasm_bpf` 呼叫 API 來開啟、載入、附加 bpf 程式，並從 ringbuf 輪詢資料。

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

## 其他範例

`wasm-bpf/examples` 目錄下的每個資料夾都代表一個能夠透過 `WasmEdge` 執行的範例。您可以在對應的目錄中執行 `make`，然後使用 `WasmEdge` 執行對應的 WASM。
