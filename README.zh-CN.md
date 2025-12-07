# MKV Track Tool

[繁體中文](README.md) | **简体中文** | [English](README.en.md) | [日本語](README.ja.md)

一个简单、高效且开源的跨平台 MKV 轨道管理工具 (支持 Windows / macOS )。
专为解决繁琐的 MKV 封装文件轨道整理而生，支持批量移除特定语言轨道、设定默认音频/字幕，并提供直观的即时预览功能。

<img src="public/icon.png" width="128" alt="App Icon" />

## ✨ 主要功能

-   **直观操作**：支持拖拽文件 (Drag & Drop)，自动扫描并列出所有视频、音频及字幕轨道。
-   **批量处理**：
    -   **一键移除**：快速移除所有不需要的语言轨道 (例如保留日语音频，移除其他)。
    -   **设定默认**：批量设定特定语言的音频或字幕为“默认轨道 (Default)”。
    -   **属性修改**：支持修改轨道的“强制 (Forced)”与“默认 (Default)”标记。
-   **即时预览**：鼠标悬停于操作按钮时，即时以高亮显示将被移除或修改的轨道，操作更安心。
-   **安全输出**：默认将处理后的文件输出至 `processed` 子文件夹，绝不覆盖原始文件。
-   **现代化界面**：采用 Vue 3 + Tailwind CSS 打造的质感界面，完整支持 macOS 浅色/深色模式 (可跟随系统)。
-   **多语言**：内置繁体中文、简体中文、英文与日文支持。

## 📥 安装说明

### macOS 用户注意事项

由于本软件未经 Apple 开发者签名（因为我是一般独立开发者），在 macOS 上安装后首次开启可能会出现 **“应用程序已损坏，无法打开”** 的错误提示。这是 macOS 的安全机制所致，并非软件真的损坏。

请开启终端 (Terminal)，并执行以下指令来修复：

```bash
sudo xattr -r -d com.apple.quarantine /Applications/MKV\ Track\ Tool.app
```

执行后输入密码即可正常开启。

### Windows

直接下载对应的安装包 (`.exe`) 执行即可。

## 🚀 快速开始

1. **加入文件**：将想要处理的 MKV 文件拖拽至应用程序窗口，或点击“拖放文件至此”区域选择文件。
2. **批量设定** (左侧边栏)：
    - **选择目标语言**：例如选择“Japanese (ja)”。
    - **选择轨道类型**：例如选择“音频 (Audio)”。
    - **执行操作**：点击“设为默认”或“批量移除”。
3. **个别微调** (右侧列表)：
    - 您也可以直接在右侧列表中，点击个别轨道的“保留”开关，或是切换“默认/强制”标签。
4. **开始处理**：确认无误后，点击右上角的“开始处理”按钮。
5. **完成**：处理完成的文件将会保存在原文件路径下的 `processed` 文件夹中。

## 🛠️ 使用技术

本专案使用以下现代化网页技术构建：

-   **核心框架**：[Electron](https://www.electronjs.org/)
-   **前端框架**：[Vue 3](https://vuejs.org/) (Composition API)
-   **语言**：[TypeScript](https://www.typescriptlang.org/)
-   **构建工具**：[Vite](https://vitejs.dev/)
-   **状态管理**：[Pinia](https://pinia.vuejs.org/)
-   **多语言**：[Vue I18n](https://vue-i18n.intlify.dev/)
-   **底层工具**：[MKVToolNix](https://mkvtoolnix.download/) (mkvmerge)

## ☕ 赞助开发

如果您觉得这个工具对您有帮助，欢迎赞助我一杯咖啡，这将成为我持续开发与维护的动力！

<a href="https://www.buymeacoffee.com/junyou" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" ></a>

## 📄 授权

MIT License
