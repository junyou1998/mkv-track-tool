import { app, BrowserWindow, ipcMain, dialog } from 'electron'
import { MkvTool } from './mkvTool'
// import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

// const require = createRequire(import.meta.url)
const __dirname = path.dirname(fileURLToPath(import.meta.url))

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.mjs
// │
process.env.APP_ROOT = path.join(__dirname, '..')

// Set App Name for Development
if (process.env.VITE_DEV_SERVER_URL) {
  app.setName('MKV Track Tool');
}

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST

let win: BrowserWindow | null
let isProcessing = false; // Track processing state

function createWindow() {
  win = new BrowserWindow({
    width: 1200,
    height: 800,
    titleBarStyle: 'hiddenInset',
    icon: path.join(process.env.VITE_PUBLIC, 'icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
    },
  })

  // Prevent closing when processing
  win.on('close', (e) => {
    if (isProcessing) {
      e.preventDefault(); // Cancel the close
      const choice = dialog.showMessageBoxSync(win!, {
        type: 'warning',
        buttons: ['取消', '強制退出'],
        defaultId: 0,
        cancelId: 0,
        title: '任務進行中',
        message: '目前仍有任務正在進行中。',
        detail: '現在關閉軟體可能會導致檔案損壞或處理不完整。\n您確定要強制退出嗎？'
      });

      if (choice === 1) {
        isProcessing = false; // Allow close
        app.quit(); // Force quit
      }
    }
  });

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date).toLocaleString())
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(RENDERER_DIST, 'index.html'))
  }
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    win = null
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

app.whenReady().then(() => {
  const mkvTool = new MkvTool();

  ipcMain.handle('scan-file', async (_event, filePath: string) => {
    return await mkvTool.scanFile(filePath);
  });

  ipcMain.handle('process-file', async (_event, filePath: string, options: any) => {
    return await mkvTool.processFile(filePath, options);
  });

  ipcMain.handle('get-thumbnail', async (_event, filePath: string) => {
    try {
      return await mkvTool.generateThumbnail(filePath);
    } catch (error) {
      console.error('Failed to generate thumbnail:', error);
      return null;
    }
  });

  ipcMain.on('set-processing-state', (_event, state: boolean) => {
    isProcessing = state;
  });

  if (process.platform === 'darwin') {
    app.dock.setIcon(path.join(process.env.VITE_PUBLIC, 'icon.png'));
  }

  createWindow();
})
