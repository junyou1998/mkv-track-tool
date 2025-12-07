# MKV Track Tool

[繁體中文](README.md) | [简体中文](README.zh-CN.md) | **English** | [日本語](README.ja.md)

A simple, efficient, and open-source cross-platform MKV track management tool (Windows / macOS).
Designed to solve the tedious task of organizing MKV tracks, it supports batch removal of specific language tracks, setting default audio/subtitles, and provides intuitive real-time previews.

<img src="public/icon.png" width="128" alt="App Icon" />

## ✨ Key Features

-   **Intuitive Operation**: Drag & Drop support, automatically scanning and listing all video, audio, and subtitle tracks.
-   **Batch Processing**:
    -   **One-Click Removal**: Quickly remove unwanted language tracks (e.g., keep Japanese audio, remove others).
    -   **Set Default**: Batch set specific language audio or subtitles as "Default".
    -   **Modify Properties**: Support modifying "Forced" and "Default" flags for tracks.
-   **Real-time Preview**: Hover over operation buttons to see which tracks will be removed or modified, highlighted for peace of mind.
-   **Safe Output**: Processed files are saved to a `processed` subfolder by default, never overwriting your original files.
-   **Modern Interface**: Built with Vue 3 + Tailwind CSS, full support for macOS Light/Dark modes (follows system).
-   **Multilingual**: Built-in support for Traditional Chinese, Simplified Chinese, English, and Japanese.

## 📥 Installation

### Note for macOS Users

Since this software is not signed by Apple (as I am an independent developer), you may see an error saying **"App is damaged and can't be opened"** when launching it for the first time. This is due to macOS security mechanisms, not because the software is actually damaged.

Please open the Terminal and run the following command to fix it:

```bash
sudo xattr -r -d com.apple.quarantine /Applications/MKV\ Track\ Tool.app
```

Enter your password after execution to open it normally.

### Windows

Simply download the corresponding installer (`.exe`) and run it.

## 🚀 Quick Start

1. **Add Files**: Drag MKV files into the application window or click the "Drag files here" area to select files.
2. **Batch Settings** (Left Sidebar):
    - **Select Target Language**: e.g., select "Japanese (ja)".
    - **Select Track Type**: e.g., select "Audio".
    - **Execute Operation**: Click "Set Default" or "Batch Remove".
3. **Fine-tuning** (Right List):
    - You can also manually toggle the "Keep" switch or "Default/Forced" tags for individual tracks in the list.
4. **Start Processing**: Click the "Start Processing" button in the top right corner.
5. **Done**: The processed files will be saved in the `processed` folder within the original file path.

## 🛠️ Tech Stack

This project is built using modern web technologies:

-   **Core Framework**: [Electron](https://www.electronjs.org/)
-   **Frontend**: [Vue 3](https://vuejs.org/) (Composition API)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **Build Tool**: [Vite](https://vitejs.dev/)
-   **State Management**: [Pinia](https://pinia.vuejs.org/)
-   **I18n**: [Vue I18n](https://vue-i18n.intlify.dev/)
-   **Underlying Tool**: [MKVToolNix](https://mkvtoolnix.download/) (mkvmerge)

## ☕ Support Development

If you find this tool helpful, feel free to buy me a coffee to support my continued development and maintenance!

<a href="https://www.buymeacoffee.com/junyou" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" ></a>

## 📄 License

MIT License
