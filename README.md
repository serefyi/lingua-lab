# Lingua Lab

英文單項練習網站概念版。依照用途選擇商業英文、學術英文或道地英文分析，再挑聽、說、讀、寫其中一項進行短練習。

## 本機預覽

直接以瀏覽器開啟 `index.html` 即可。聽力內容使用瀏覽器的 Speech Synthesis API；支援狀況與聲音依瀏覽器而異。

## GitHub Pages

`.github/workflows/pages.yml` 會在推送至 `main` 時部署此靜態網站。建立 GitHub repository 後，請在 repository 的 **Settings → Pages → Build and deployment** 將來源設為 **GitHub Actions**。部署完成後可由 workflow 的 deployment 輸出取得網站網址。

目前練習內容與回饋是前端示範，不連接 AI 評分服務，也不會保存回答紀錄。
