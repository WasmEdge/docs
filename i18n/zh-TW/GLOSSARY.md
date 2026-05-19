# 繁體中文（台灣）翻譯詞彙表

本文件列出 WasmEdge 文件繁體中文翻譯所採用的台灣用語對照表與翻譯規則，供所有翻譯者參考，以維持用詞一致性。

> 本檔案僅供翻譯者與貢獻者參考，Docusaurus 不會將此檔案編譯為網站頁面。

---

## 一、翻譯原則

1. **完全使用繁體中文（zh-TW）與台灣慣用語**。避免簡體字、香港或中國大陸用語。
2. **品牌名與專有名詞保留英文**：WasmEdge、Wasm、WebAssembly、WASI、CNCF、Docker、Kubernetes、Rust、Go、Python、JavaScript、TypeScript、Node.js、LLM、GPU、CPU、HTTP、TCP、UDP、JSON、YAML、TOML、API、SDK、CLI 等。
3. **版本號、檔案路徑、URL、指令、變數名稱、函式名稱保留原文**。
4. **程式碼區塊（` ``` `）內的所有內容保留原文**，包含註解（除非註解原本就是給使用者讀的說明）。
5. **內嵌程式碼（`` ` ``）保留原文**，例如 `WasmEdge_VMCreate`、`--enable-jit`。
6. **Markdown / MDX 語法保留**：標題符號、列表符號、表格、admonition（`:::note` `:::tip` `:::info` `:::caution` `:::danger`）、Mermaid 圖表（` ```mermaid ` 區塊內絕對不可翻譯）。
7. **特殊佔位符保留**：`{{ENV_VAR}}` 樣式的佔位符（由 `env-plugin.js` 在建置時替換）必須原樣保留。
8. **內部連結路徑保留原文**：`[連結文字](./other-page.md)` 的路徑不要翻譯，Docusaurus 會自動解析為對應 locale 的頁面。連結文字本身才需要翻譯。
9. **HTML 標籤保留**：`<br />`、`<a>`、`<img>` 等。
10. **frontmatter 鍵保留原文**：`sidebar_position`、`displayed_sidebar`、`slug`、`id`、`tags`。如果有 `title`、`description`、`sidebar_label`、`keywords` 欄位，其「值」需要翻譯。

---

## 二、台灣用語對照表

### 程式設計核心詞彙

| 英文 | 台灣（zh-TW） | 避免使用（zh-CN） |
|---|---|---|
| Software | 軟體 | 軟件 |
| Hardware | 硬體 | 硬件 |
| Memory | 記憶體 | 內存 |
| Information | 資訊 | 信息 |
| Data | 資料 | 数据 |
| File | 檔案 | 文件（檔案意義時） |
| Folder / Directory | 資料夾 / 目錄 | 文件夹 |
| Source code | 原始碼 | 源代码 |
| Code | 程式碼 | 代码 |
| Program | 程式 | 程序 |
| Function | 函式 | 函数 |
| Method | 方法 | 方法 |
| Variable | 變數 | 变量 |
| Constant | 常數 | 常量 |
| Object | 物件 | 对象 |
| Class | 類別 | 类 |
| Instance | 實例 / 實體 | 实例 |
| Interface | 介面 | 接口 |
| Property | 屬性 | 属性 |
| Attribute | 屬性 | 特性 |

### 系統與執行環境

| 英文 | 台灣（zh-TW） | 避免使用（zh-CN） |
|---|---|---|
| Default | 預設 | 默认 |
| Settings | 設定 | 设置 |
| Configuration | 設定 / 組態 | 配置 |
| Run / Execute | 執行 | 运行 |
| Build | 建置 / 編譯 | 构建 |
| Compile | 編譯 | 编译 |
| Install | 安裝 | 安装 |
| Uninstall | 解除安裝 / 移除 | 卸载 |
| Update | 更新 | 更新 |
| Upgrade | 升級 | 升级 |
| Deploy | 部署 | 部署 |
| Runtime | 執行環境 / 執行階段 | 运行时 |
| Process | 行程 | 进程 |
| Thread | 執行緒 | 线程 |
| Schedule | 排程 | 调度 |

### 資料結構與類型

| 英文 | 台灣（zh-TW） | 避免使用（zh-CN） |
|---|---|---|
| Array | 陣列 | 数组 |
| String | 字串 | 字符串 |
| Integer | 整數 | 整数 |
| Float / Double | 浮點數 | 浮点数 |
| Boolean | 布林值 | 布尔值 |
| Pointer | 指標 | 指针 |
| Reference | 參照 / 參考 | 引用 |
| Stack | 堆疊 | 栈 |
| Heap | 堆積 | 堆 |
| Queue | 佇列 | 队列 |
| List | 串列 / 清單 | 列表 |
| Map | 對應 / 映射 | 映射 |
| Tuple | 元組 | 元组 |
| Bytes | 位元組 | 字节 |
| Bit | 位元 | 比特 |
| Byte | 位元組 | 字节 |
| Bytecode | 位元組碼 | 字节码 |

### 網路與基礎建設

| 英文 | 台灣（zh-TW） | 避免使用（zh-CN） |
|---|---|---|
| Network | 網路 | 网络 |
| Internet | 網際網路 | 互联网 |
| Server | 伺服器 | 服务器 |
| Client | 用戶端 / 客戶端 | 客户端 |
| Database | 資料庫 | 数据库 |
| Cache | 快取 | 缓存 |
| Storage | 儲存 / 儲存空間 | 存储 |
| Cloud | 雲端 | 云 |
| Cluster | 叢集 | 集群 |
| Container | 容器 | 容器 |
| Image (container) | 映像檔 | 镜像 |
| Endpoint | 端點 | 端点 |
| Hosting | 託管 | 托管 |
| Port | 連接埠 | 端口 |
| Socket | Socket | 套接字 |
| Bandwidth | 頻寬 | 带宽 |
| Latency | 延遲 | 延迟 |
| Throughput | 吞吐量 | 吞吐量 |

### 軟體開發概念

| 英文 | 台灣（zh-TW） | 避免使用（zh-CN） |
|---|---|---|
| Plugin / Plug-in | 外掛 | 插件 |
| Extension | 擴充功能 | 扩展 |
| Library | 函式庫 | 库 |
| Framework | 框架 | 框架 |
| Module | 模組 | 模块 |
| Package | 套件 | 包 |
| Project | 專案 | 项目 |
| Repository | 儲存庫 | 仓库 |
| Branch | 分支 | 分支 |
| Commit | 提交 | 提交 |
| Merge | 合併 | 合并 |
| Pull request | Pull Request | 拉取请求 |
| Algorithm | 演算法 | 算法 |
| Loop | 迴圈 | 循环 |
| Recursion | 遞迴 | 递归 |
| Performance | 效能 | 性能 |
| Quality | 品質 | 质量 |
| Optimize | 最佳化 / 最佳化 | 优化 |
| Debug | 除錯 | 调试 |
| Test | 測試 | 测试 |
| Unit test | 單元測試 | 单元测试 |

### 介面與互動

| 英文 | 台灣（zh-TW） | 避免使用（zh-CN） |
|---|---|---|
| Click | 點擊 / 按一下 | 点击 |
| Button | 按鈕 | 按钮 |
| Menu | 選單 | 菜单 |
| Window | 視窗 | 窗口 |
| Dialog | 對話框 | 对话框 |
| Tab | 分頁 | 标签页 / 选项卡 |
| Navigation | 導覽 | 导航 |
| Sidebar | 側邊欄 | 侧边栏 |
| Print / Output | 輸出 | 输出 |
| Input | 輸入 | 输入 |

### 安全與權限

| 英文 | 台灣（zh-TW） | 避免使用（zh-CN） |
|---|---|---|
| Authentication | 身分驗證 | 认证 |
| Authorization | 授權 | 授权 |
| Encryption | 加密 | 加密 |
| Decryption | 解密 | 解密 |
| Token | 權杖 / Token | 令牌 |
| Sandbox | 沙箱 | 沙盒 |
| Permission | 權限 | 权限 |

### WasmEdge 與 WebAssembly 專屬

| 英文 | 台灣（zh-TW） | 說明 |
|---|---|---|
| WebAssembly | WebAssembly | 保留原文 |
| Wasm | Wasm | 保留原文 |
| WASI | WASI | 保留原文 |
| WasmEdge | WasmEdge | 保留原文 |
| Embed | 嵌入 | 將 Wasm 嵌入主機應用程式 |
| Host application | 主機應用程式 | |
| Runtime | 執行環境 | 完整詞 WasmEdge Runtime 通常保留原文 |
| Native (binary) | 原生（二進位） | 例如「原生二進位檔」 |

---

## 三、常見翻譯模式

### 描述性句型

| 英文 | 建議翻譯 |
|---|---|
| In this chapter, we will... | 本章節將...... |
| Here's how to... | 以下說明如何...... |
| For more details, see... | 詳細資訊請參閱...... |
| You can... | 您可以...... |
| Note that... | 請注意...... |
| Make sure... | 請確保...... |
| If you... | 若您...... |

### 標題大小寫
- 英文標題使用 Title Case（首字母大寫）；繁體中文標題不使用大小寫，直接翻譯即可。
- 英文書名、論文名稱、規範名稱在翻譯中保留原文（如 W3C、IEEE 754、Unicode、RFC 7159）。

### 標點符號
- 中文使用全形標點：，、。；：「」『』（）！？
- 中英文交替時，英文兩側「不」加全形空格（除非為避免閱讀困難），保留半形空格即可。
- 程式碼、URL、版本號周圍保留半形空格。

---

## 四、絕對不可翻譯的內容

1. ` ```code ` 區塊內的所有內容（含註解，除非註解是對使用者的說明）。
2. ` ```mermaid ` 區塊（Mermaid 圖表語法）。
3. ` `inline code` ` 內嵌程式碼。
4. URL 與檔案路徑。
5. frontmatter 的 `sidebar_position`、`displayed_sidebar`、`slug`、`id`、`tags`、`keywords` 的鍵與技術值。
6. `{{ENV_VAR}}` 樣式的環境變數佔位符。
7. HTML 標籤本身（標籤內的可見文字才需翻譯）。
8. 品牌名稱（WasmEdge、Wasm、Docker、Kubernetes、CNCF 等）。
9. 函式、變數、類別、命令名稱。
10. 版本號（如 0.13.5、v1.2.3）。

---

## 五、驗證檢查項目

翻譯完成後，請執行：

1. **建置檢查**：`npm run build`（`onBrokenLinks: 'throw'` 會抓出失效連結）。
2. **檔案對應檢查**：`docs/` 與 `i18n/zh-TW/docusaurus-plugin-content-docs/current/` 結構必須完全相同。
3. **簡體字掃描**：搜尋常見簡體字（如 `软`、`认`、`学`、`国`、`这`、`么`、`时`、`实`、`体`、`发`、`点`、`见`、`让`、`处`、`种`、`从`、`广`），翻譯內容中不應出現。
4. **大陸用語掃描**：搜尋 `软件`、`默认`、`内存`、`信息`（資訊意義下）、`程序`（程式意義下）、`网络`、`插件`、`文件夹`、`代码`、`数组`、`字符串`、`缓存`、`性能`、`算法`、`循环`、`线程`、`对象`、`变量`、`类`（類別意義下）、`字节`、`运行`（執行意義下）、`配置`（設定意義下）、`构建`、`安装`、`存储`、`服务器`、`客户端`、`数据库`、`镜像`（容器意義下）、`端口`、`选项卡`、`菜单`、`窗口` 等大陸用語。

---

## 六、貢獻

若您發現詞彙缺漏或翻譯不一致，請發起 Pull Request 更新本檔案，並同步檢視 `i18n/zh-TW/` 中受影響的檔案。
