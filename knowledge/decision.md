# 決策紀錄

## 2026-11-20：第一版練習範圍與回饋方式

- **情境**：目前只有概念版網站，尚無使用者訪談或實際學習成效資料；需要先把路線圖轉成可執行的版本。
- **推薦與採用**：第一版服務需要為工作或學習加強實用英文的個人學習者；保留商業英文、學術英文、道地英文分析與聽說讀寫的交叉選擇，先以會議／商務郵件、論文／課堂、自然口語／禮貌請求作為練習主題。此為產品假設，之後以使用回饋修正。
- **回饋原則**：在沒有可靠評分模型時，不產生分數或假稱 AI 評估；提供依技能與情境編寫的自我檢查提示，清楚標示為練習建議。
- **練習紀錄**：先只在使用者裝置記錄完成次數及最近練習時間，不保存作答內容、不傳送資料。細緻成效追蹤需另行設計。
- **理由**：讓靜態 GitHub Pages 版本即可使用，避免未經驗證的評分及不必要的後端與敏感資料保存。
- **再檢視條件**：有實際使用者回饋、可靠的評估規準，或產品需要跨裝置保存紀錄時重新評估。
- **實作落地**：第一版主題、三階難度與 3／5／10 分鐘時長已實作；完成摘要只留存完成總數、技能累計及最近完成時間。

## 2026-11-20：Pages workflow 維護

- **決策**：將 checkout/configure-pages/upload-pages-artifact/deploy-pages 升級至 Node.js 24 相容主版本，並在發布流程加入 `node --check app.js`。
- **理由**：原 workflow 每次成功部署仍會發出 Node.js 20 棄用警告；最新官方 releases 已提供 Node 24 主版本。deploy-pages v5 要求 workflow 有 `actions: read`，因此一併只授予必要的讀取權限。
- **來源**：[checkout releases](https://github.com/actions/checkout/releases)、[configure-pages releases](https://github.com/actions/configure-pages/releases)、[upload-pages-artifact releases](https://github.com/actions/upload-pages-artifact/releases)、[deploy-pages releases](https://github.com/actions/deploy-pages/releases)。
- **再檢視條件**：若 GitHub Actions runner 或官方 Pages action 發佈不相容變更，再調整版本與權限。

## 待釐清、但目前不阻塞的決策

- **AI 個人化評估是否接入雲端模型**：建議先維持無 AI 評分的自我檢查；若未來接入，優先透過受控的伺服器端代理，不在公開前端放置 API 金鑰，並在送出作答前清楚說明資料用途。需在選定服務、成本上限與隱私要求後再實作。
- **測試使用者與產品定位驗證**：建議先請少量有商務或學術英文需求的學習者試用，觀察題目是否實用、回饋是否可採取行動，再決定擴充順序。
