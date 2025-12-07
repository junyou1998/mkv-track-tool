# MKV Track Tool

**繁體中文** | [简体中文](README.zh-CN.md) | [English](README.en.md) | [日本語](README.ja.md)

一個簡單、高效且開源的跨平台 MKV 軌道管理工具 (支援 Windows / macOS )。
專為解決繁瑣的 MKV 封裝檔軌道整理而生，支援批量移除特定語言軌道、設定預設音訊/字幕，並提供直觀的即時預覽功能。

<img src="public/icon.png" width="128" alt="App Icon" />

## ✨ 主要功能

-   **直觀操作**：支援拖曳檔案 (Drag & Drop)，自動掃描並列出所有視訊、音訊及字幕軌道。
-   **批量處理**：
    -   **一鍵移除**：快速移除所有不需要的語言軌道 (例如保留日語音訊，移除其他)。
    -   **設定預設**：批量設定特定語言的音訊或字幕為「預設軌道 (Default)」。
    -   **屬性修改**：支援修改軌道的「強制 (Forced)」與「預設 (Default)」標記。
-   **即時預覽**：滑鼠懸停於操作按鈕時，即時以高亮顯示將被移除或修改的軌道，操作更安心。
-   **安全輸出**：預設將處理後的檔案輸出至 `processed` 子資料夾，絕不覆蓋原始檔案。
-   **現代化介面**：採用 Vue 3 + Tailwind CSS 打造的質感介面，完整支援 macOS 淺色/深色模式 (可跟隨系統)。
-   **多國語系**：內建繁體中文、簡體中文、英文與日文支援。

## 📥 安裝說明

### macOS 使用者注意事項

由於本軟體未經 Apple 開發者簽章（因為我是一般獨立開發者），在 macOS 上安裝後首次開啟可能會出現 **「應用程式已損毀，無法打開」** 的錯誤訊息。這是 macOS 的安全機制所致，並非軟體真的損壞。

請開啟終端機 (Terminal)，並執行以下指令來修復：

```bash
sudo xattr -r -d com.apple.quarantine /Applications/MKV\ Track\ Tool.app
```

執行後輸入密碼即可正常開啟。

### Windows

直接下載對應的安裝檔 (`.exe`) 執行即可。

## 🚀 快速開始

1. **加入檔案**：將想要處理的 MKV 檔案拖曳至應用程式視窗，或點擊「拖放檔案至此」區域選擇檔案。
2. **批量設定** (左側邊欄)：
    - **選擇目標語言**：例如選擇「Japanese (ja)」。
    - **選擇軌道類型**：例如選擇「音訊 (Audio)」。
    - **執行操作**：點擊「設為預設」或「批量移除」。
3. **個別微調** (右側列表)：
    - 您也可以直接在右側列表中，點擊個別軌道的「保留」開關，或是切換「預設/強制」標籤。
4. **開始處理**：確認無誤後，點擊右上角的「開始處理」按鈕。
5. **完成**：處理完成的檔案將會儲存在原檔案路徑下的 `processed` 資料夾中。

## 🛠️ 使用技術

本專案使用以下現代化網頁技術構建：

-   **核心框架**：[Electron](https://www.electronjs.org/)
-   **前端框架**：[Vue 3](https://vuejs.org/) (Composition API)
-   **語言**：[TypeScript](https://www.typescriptlang.org/)
-   **建置工具**：[Vite](https://vitejs.dev/)
-   **狀態管理**：[Pinia](https://pinia.vuejs.org/)
-   **多國語系**：[Vue I18n](https://vue-i18n.intlify.dev/)
-   **底層工具**：[MKVToolNix](https://mkvtoolnix.download/) (mkvmerge)

## ☕ 贊助開發

如果您覺得這個工具對您有幫助，歡迎贊助我一杯咖啡，這將成為我持續開發與維護的動力！

<a href="https://www.buymeacoffee.com/junyou" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" ></a>

## 📄 授權

MIT License
