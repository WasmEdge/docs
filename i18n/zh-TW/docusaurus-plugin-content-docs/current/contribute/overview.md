---
sidebar_position: 1
displayed_sidebar: contributeSidebar
---

# 貢獻並擴充 WasmEdge

我們隨時歡迎您的貢獻！WebAssembly 生態系仍處於早期階段。WasmEdge 由 CNCF 託管,目標是成為 WebAssembly 及其邊緣相關擴充功能的開放原始碼「參考實作」。WasmEdge 採開放方式開發,並由我們的使用者、貢獻者與維護者持續改進。正是因為有您,我們才能將優秀的軟體帶給社群。我們非常期待與您一同合作!

為了協助新貢獻者了解 WasmEdge 的開發流程,本指南將包含:

- [於不同平台從原始碼建置 WasmEdge 與 WasmEdge 外掛](/category/build-wasmedge-from-source)
- [WasmEdge 外掛系統介紹](/category/wasmedge-plugin-system)
- [測試 WasmEdge](test.md)
- [WasmEdge 模糊測試 (Fuzzing)](fuzzing.md)
- [WasmEdge 內部說明](internal.md)
- [WasmEdge 安裝程式系統說明](installer.md)
- [WasmEdge 安裝程式 v2 系統說明](installer_v2.md)
- [貢獻步驟](contribute.md)
- [WasmEdge 發行流程](release.md)
- [加入 WasmEdge 社群](community.md)

## 貢獻流程

如何貢獻 WasmEdge

### 簽署提交 (開發者原創證明)

要貢獻本專案,您必須同意所做的每一次提交皆遵守開發者原創證明 (Developer Certificate of Origin,DCO)。DCO 是一份簡單的聲明,表明您作為貢獻者擁有合法權利進行該項貢獻。

請參閱 [DCO](https://developercertificate.org) 檔案以了解您必須同意之條款的完整內容,以及其[運作方式](https://github.com/probot/dco#how-it-works)。為了表明您同意 DCO 條款,只需在每次 git 提交訊息中加入一行:

```text
Signed-off-by: John Doe <john.doe@example.com>
```

在大多數情況下,您可以使用 `git commit` 的 `-s` 或 `--signoff` 旗標自動將此簽署資訊加入提交中。您必須使用真實姓名與可聯絡的電子郵件地址 (抱歉,不接受化名或匿名貢獻)。提交簽署範例:

```bash
git commit -s -m “my commit message w/signoff”
```

為確保所有提交皆已簽署,您可以選擇在全域 `.gitconfig` 中加入以下別名:

```text
[alias]
  amend = commit -s --amend
  cm = commit -s -m
  commit = commit -s
```

或者您可以設定您的 IDE,例如 Visual Studio Code,讓它自動為您簽署提交:

![VSCode sign-off](https://user-images.githubusercontent.com/7570704/64490167-98906400-d25a-11e9-8b8a-5f465b854d49.png)

## 貢獻想法

如果您正在尋找可貢獻的事項,我們有以下議題

- 標示為 [`good first issue`](https://github.com/WasmEdge/WasmEdge/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22) 的議題,這些是建議開發者透過完成簡單任務來貢獻 WasmEdge 的建議。這些任務將協助貢獻者學習 WasmEdge 的開發流程。

- 標示為 [`help wanted`](https://github.com/WasmEdge/WasmEdge/issues?q=is%3Aissue+is%3Aopen+label%3A%22help+wanted%22) 的議題,我們需要社群提供建議與意見。

- 每年的 [Roadmap](https://github.com/WasmEdge/WasmEdge/blob/master/docs/ROADMAP.md),詳細列出未來的新功能。歡迎您選擇其中一項。

如果您發現缺少了什麼,請不要猶豫,建立一個議題讓我們知道。再次強調,WasmEdge 採開放開發。

## 指導 (Mentoring)

WasmEdge 維護者可為 WasmEdge、WebAssembly、C++、Rust、編譯器等領域提供指導。如果您有興趣修復某個開放議題,只要在該議題下方留言告知我們即可。WasmEdge 維護者將會及時回覆您的問題。

除了一般的 GitHub 議題外,WasmEdge 專案也會參與一些開放原始碼指導專案,例如 [Google Summer of Code (GSoC)](https://summerofcode.withgoogle.com/)、[Google Season of Docs (GSoD)](https://developers.google.com/season-of-docs)、[LFX Mentorship](https://mentorship.lfx.linuxfoundation.org/#projects_all) 以及 [Open Source Promotion Plan (OSPP)](https://summer-ospp.ac.cn/)。請加入我們的 [Discord 伺服器](https://discord.gg/U4B5sFTkFc) 或在 Twitter 上追蹤 [@realwasmedge](https://twitter.com/realwasmedge) 以取得申請細節的相關通知。
