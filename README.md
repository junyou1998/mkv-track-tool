# MKV Batch Tool

A high-performance MKV batch processing tool built with Electron, Vue 3, and Tailwind CSS.

## Features
- Drag & Drop interface for multiple MKV files.
- Batch remove tracks (e.g., English Audio/Subs).
- Batch set default tracks (e.g., Japanese Audio/Subs).
- Fast processing using `mkvmerge` (no re-encoding).
- Cross-platform support (macOS, Windows).

## Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Binaries**
   This tool requires `mkvmerge` to be bundled.
   - **Development**: Place `mkvmerge` (and `mkvmerge.exe` for Windows) in `bin/<platform>/`.
     - macOS: `bin/darwin/mkvmerge`
     - Windows: `bin/win32/mkvmerge.exe`
   - **Production**: The build process should copy these to `resources/bin`.

   You can download MKVToolNix from [https://mkvtoolnix.download/](https://mkvtoolnix.download/).

3. **Run Development**
   ```bash
   npm run dev
   ```

4. **Build**
   ```bash
   npm run build
   ```

## Architecture
- **Frontend**: Vue 3 + Tailwind CSS + Pinia
- **Backend**: Electron Main Process + `mkvmerge` wrapper
- **Communication**: IPC (scan-file, process-file)
