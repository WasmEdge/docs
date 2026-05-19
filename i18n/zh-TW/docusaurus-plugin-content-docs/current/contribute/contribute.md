---
sidebar_position: 8
---

# 貢獻指南

* [新貢獻者指南](#contributing-guide)
  * [貢獻方式](#ways-to-contribute)
  * [尋找議題](#find-an-issue)
  * [尋求協助](#ask-for-help)
  * [Pull Request 生命週期](#pull-request-lifecycle)
  * [開發環境設定](#development-environment-setup)
  * [提交格式](#commit-format)
  * [Pull Request 檢查清單](#pull-request-checklist)

歡迎您!我們很高興您想為本專案做出貢獻!💖

當您開始投入時,正是給予我們回饋的最佳時機。我們需要協助的領域包括:

* 設定新開發者環境時遇到的問題
* 快速入門指南或文件中遺漏的部分
* 自動化指令稿中的錯誤

如果有任何不合理或無法執行的地方,請建立錯誤回報並讓我們知道!

## 貢獻方式

我們歡迎多種不同類型的貢獻,包括:

* 新功能
* 回報錯誤
* 建置、CI/CD
* 錯誤修復
* 文件
* 議題分類
* 在 Slack/郵件論壇/GitHub 議題上回答問題
* 網頁設計
* 溝通 / 社群媒體 / 部落格文章
* 發行管理

並非所有事情都透過 GitHub pull request 進行。請參加我們的[會議](https://docs.google.com/document/d/1iFlVl7R97Lze4RDykzElJGDjjWYDlkI8Rhf8g4dQ5Rk/edit?usp=sharing) 或[聯絡我們](https://groups.google.com/g/wasmedge),讓我們討論如何一起合作。

### 參加會議

我們的任何會議都絕對歡迎所有人參加。您不需要邀請即可加入我們。事實上,我們希望您加入我們,即使您並沒有想要貢獻的內容。光是出席就已足夠!

您可以[在此](https://docs.google.com/document/d/1iFlVl7R97Lze4RDykzElJGDjjWYDlkI8Rhf8g4dQ5Rk/edit?usp=sharing) 進一步了解我們的會議資訊。您不必開啟視訊。第一次參加時,自我介紹就已足夠。隨著時間推移,我們希望您能自在地表達意見、對他人想法提供回饋,甚至分享自己的想法與經驗。

## 尋找議題

我們有適合新貢獻者的「good first issues」與適合所有貢獻者的「help wanted」議題。[good first issue](https://github.com/WasmEdge/WasmEdge/labels/good%20first%20issue) 提供額外資訊以協助您完成首次貢獻。[help wanted](https://github.com/WasmEdge/WasmEdge/labels/help%20wanted) 議題適合非核心維護者進行,並適合在您第一個 pull request 之後接續處理。

有時候不會有這些標籤的議題。沒關係!可能仍有您可以處理的事情。如果您想貢獻但不知道從何開始,或找不到合適的議題,可以在該議題下方留言,例如「我想處理這個。能否告訴 XYZ (列出您想溝通的內容)」,或將問題傳送至我們的 Discord 伺服器或 Slack 頻道。

一旦您找到想處理的議題,請發表留言表示您想處理它。例如「我想處理這個」就可以了。

## 尋求協助

貢獻時若有問題,聯絡我們最佳的方式是:

* 原始的 GitHub 議題
* 郵件論壇:寄送電子郵件至[我們的郵件清單](https://groups.google.com/g/wasmedge)
* Discord:加入 [WasmEdge Discord 伺服器](https://discord.gg/h4KDyB8XTt)
* Slack:加入 [CNCF Slack](https://slack.cncf.io/) 上的 #WasmEdge 頻道

在開立任何議題之前,請先查詢現有的[議題](https://github.com/WasmEdge/WasmEdge/issues),避免重複提交。如果您找到符合的議題,可以「訂閱」以收到更新通知。如果您有與此議題相關的額外有用資訊,請留言告知。

回報議題時,請務必包含:

* 系統版本
* WasmEdge 的設定檔

由於議題對所有人公開,提交記錄與設定檔時,請務必移除任何敏感資訊,例如使用者名稱、密碼、IP 位址和公司名稱。您可以將這些部分以「REDACTED」或其他字串如「\*\*\*\*」替換。如有需要,請務必包含重現問題的步驟。這能協助我們更快理解並修復您的議題。

## Pull Request 生命週期

我們隨時歡迎 pull request,即使只包含微小修正,例如錯字或幾行程式碼。如果需要投入大量心力,請先記錄為議題並展開討論再開始作業。

請將 pull request 拆解為一個個小變更後再提交。包含許多功能與程式碼變更的 pull request 可能需要花費大量心力進行審閱。建議您逐步漸進地提交 pull request。

一般而言,一旦您的 pull request 開啟後,將會指派一位或多位審閱者。這些審閱者會進行徹底的程式碼審閱,檢查正確性、錯誤、改進機會、文件與註解,以及程式碼風格。如果您的 PR 尚未準備好接受審閱,請將其標示為草稿。

審閱者將在三個工作天內提供回饋意見。

第一次審閱完成後,PR 貢獻者應於 5 個工作天內進行審視並根據意見進行修改。

如果您完成了調整,請將問題標示為已解決,審閱者將於 2 個工作天內再次審閱您的 PR。

如果 PR 貢獻者在 30 天內未回應 PR,維護者將會關閉該 PR。歡迎原 PR 貢獻者再次開啟。

如果 PR 貢獻者因某些原因不想維護該 PR,請允許維護者編輯此 PR,如果您仍希望此 PR 被合併。

當您的 PR 合併後,您的貢獻將於下一次發行中實作。我們會在發行說明中加入貢獻者的 GitHub 名稱。

## 開發環境設定

WasmEdge 是在 Ubuntu 20.04 上開發,以利用 AOT 編譯器的進階 LLVM 功能。WasmEdge 團隊也為較舊的 Linux 發行版建置並發行靜態連結的 WasmEdge 執行檔。

我們的開發環境需要 `libLLVM-12` 與 `>=GLIBCXX_3.4.26`。

如果您使用的作業系統比 Ubuntu 20.04 更舊,請使用我們的[特殊 docker 映像檔]來建置 WasmEdge。如果您要尋找適用於較舊作業系統的預建執行檔,我們也提供多個以 `manylinux2014` 發行版為基礎的預建執行檔。

要從原始碼建置 WasmEdge,請參考:[從原始碼建置 WasmEdge](/category/build-wasmedge-from-source)。

## 提交格式

提交訊息應遵循 [Conventional Commit](https://www.conventionalcommits.org/en/v1.0.0/) 規範。

有效的提交應如下:

```
<type>: <short description of the change>

<optional detailed description>

Signed-off-by: Your Name <your.email@example.com>
```

請從 [Conventional Commit](https://www.conventionalcommits.org/en/v1.0.0/#specification) 查看完整規範。

:::note

請參閱 [@commitlint/@config-conventional](https://github.com/conventional-changelog/commitlint/tree/master/%40commitlint/config-conventional) 以了解允許的 `<type>` 值。

:::

提交訊息範例:

```
docs: updates Contribution Guide

Signed-off-by: Alice Chen <alice.chen@example.com>
```

:::note

WasmEdge 自 2025 年 4 月 9 日起開始強制執行 conventional commit,請參閱 [WasmEdge#3850](https://github.com/WasmEdge/WasmEdge/pull/3850)。

:::

### DCO - 簽署您的提交

授權對開放原始碼專案而言相當重要。它在某種程度上保證了軟體將持續依據作者所期望的條款提供。我們要求貢獻者對提交至本專案儲存庫的提交進行簽署。[開發者原創證明 (DCO)](https://probot.github.io/apps/dco/) 是一種證明您已撰寫並有權貢獻您提交至本專案之程式碼的方式。

您可透過在提交訊息中加入下列內容來簽署。您的簽署必須與該提交所對應的 git 使用者與電子郵件相符。

    docs: this commit updates something at somedoc.md

    Signed-off-by: Your Name <your.name@example.com>

Git 有 `-s` 命令列選項可自動執行此動作:

    git commit -s -m 'This is my commit message'

如果您忘記這麼做且尚未將變更推送至遠端儲存庫,可以執行下列指令來修改提交並加入簽署:

    git commit --amend -s

## Pull Request 檢查清單

當您提交 pull request 或推送新的提交時,我們的自動化系統將會對您的新程式碼執行一些檢查。我們要求您的 pull request 通過這些檢查,但在我們能夠接受並合併之前,還有其他更多的條件。建議您在提交程式碼之前先在本機檢查下列項目:

* DCO:您是否已簽署提交
* 行為準則:您是否遵循 CNCF 行為準則

## 回報議題

## 撰寫文件

如果您建立或變更功能,請更新文件。良好的文件與程式碼本身同等重要。文件以 Markdown 撰寫。詳情請參閱 [Writing on GitHub](https://help.github.com/categories/writing-on-github/)。

## 設計新功能

您可以針對現有 WasmEdge 功能提出新的設計。也可以設計新功能;請透過 GitHub 議題提交提案。

WasmEdge 維護者將會儘快審閱此提案,以確保整體架構一致,並避免 roadmap 中的工作重複。

WasmEdge 的新功能將透過 GitHub 議題或社群會議進行討論。
