---
sidebar_position: 2
---

# 在 Rust 中使用外掛擴充執行環境

WasmEdge 外掛是讓 WasmEdge 執行環境用來載入並建立主機模組實例的共享函式庫。透過外掛，WasmEdge 執行環境可以更輕鬆地進行擴充。

## 從路徑載入外掛

開發者可以透過從特定路徑載入外掛來開始使用 WasmEdge 外掛。要從預設路徑載入外掛，可以使用以下 API：

```rust
impl PluginManager
pub fn load(path: Option<&Path>) -> WasmEdgeResult<()>
```

- 若未提供路徑，會使用預設的外掛路徑。

  - `WASMEDGE_PLUGIN_PATH` 環境變數中指定的路徑。
  - 相對於 WasmEdge 安裝路徑的 `../plugin/` 目錄。
  - 若 WasmEdge 安裝於 `/usr` 目錄中，則為函式庫路徑下的 `./wasmedge/` 目錄。

- 若有提供路徑，則：

  - 若路徑指向一個檔案，則表示會從該檔案載入單一外掛。
  - 若路徑指向一個目錄，則該方法會從這些檔案中載入外掛。

要取得所有已載入外掛的名稱作為回傳值 -

```rust
pub fn names() -> Vec<String>
```

<!-- prettier-ignore -->
:::note
`path` - 外掛檔案或包含外掛檔案之目錄的路徑。若為 `None`，則會使用預設的外掛路徑。
:::

## 列出已載入的外掛

外掛載入後，開發者可以使用以下方式列出已載入的外掛名稱：

```rust
pub fn names() -> Vec<String>
```

## 依名稱取得外掛 Context

開發者可以使用以下方法依名稱取得外掛 context：

```rust
pub fn find(name: impl AsRef<str>) -> Option<Plugin>
```

這裡的 `name` 是目標外掛的名稱。

## 從外掛取得模組實例

有了外掛 context，開發者可以透過提供模組名稱來取得模組實例：

```rust
pub fn mod_names(&self) -> Vec<String>
```

若使用者 [透過安裝程式安裝了 WasmEdge 外掛](/contribute/installer.md#plugins)，預設外掛路徑中可能會有數個外掛。

在使用外掛之前，開發者應先 [從路徑載入外掛](#從路徑載入外掛)。

## 外掛模組實例

要使用以下參數初始化 `wasmedge_process` 外掛模組實例 -

```rust
pub fn init_wasmedge_process(allowed_cmds: Option<Vec<&str>>, allowed: bool)
```

這裡，`allowed_cmds` 是命令的白名單，而 `allowed` 決定 wasmedge_process 是否被允許執行白名單上的所有命令。
