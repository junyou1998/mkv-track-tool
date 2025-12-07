var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
import { app, BrowserWindow, ipcMain, dialog } from "electron";
import { spawn } from "child_process";
import path from "path";
import fs from "fs";
import ffmpeg from "fluent-ffmpeg";
import ffmpegStatic from "ffmpeg-static";
import ffprobeStatic from "ffprobe-static";
import { fileURLToPath } from "node:url";
import path$1 from "node:path";
if (ffmpegStatic) {
  ffmpeg.setFfmpegPath(ffmpegStatic);
}
if (ffprobeStatic && ffprobeStatic.path) {
  ffmpeg.setFfprobePath(ffprobeStatic.path);
}
class MkvTool {
  constructor() {
    __publicField(this, "binPath");
    this.binPath = this.resolveBinPath();
  }
  resolveBinPath() {
    const platform = process.platform;
    let binName = "mkvmerge";
    if (platform === "win32") {
      binName = "mkvmerge.exe";
    }
    if (app.isPackaged) {
      return path.join(process.resourcesPath, "bin", binName);
    }
    const localBin = path.join(process.cwd(), "bin", platform, binName);
    if (fs.existsSync(localBin)) {
      return localBin;
    }
    const brewPathArm = path.join("/opt/homebrew/bin", binName);
    if (fs.existsSync(brewPathArm)) {
      return brewPathArm;
    }
    const brewPathIntel = path.join("/usr/local/bin", binName);
    if (fs.existsSync(brewPathIntel)) {
      return brewPathIntel;
    }
    return binName;
  }
  async scanFile(filePath) {
    return new Promise((resolve, reject) => {
      const args = ["-J", filePath];
      const child = spawn(this.binPath, args);
      let stdout = "";
      let stderr = "";
      child.stdout.on("data", (data) => {
        stdout += data.toString();
      });
      child.stderr.on("data", (data) => {
        stderr += data.toString();
      });
      child.on("close", (code) => {
        if (code !== 0) {
          reject(new Error(`mkvmerge failed with code ${code}: ${stderr}`));
          return;
        }
        try {
          const json = JSON.parse(stdout);
          resolve(json);
        } catch (err) {
          reject(new Error(`Failed to parse mkvmerge output: ${err}`));
        }
      });
      child.on("error", (err) => {
        reject(new Error(`Failed to spawn mkvmerge: ${err.message}. Path: ${this.binPath}`));
      });
    });
  }
  async processFile(filePath, options) {
    return new Promise((resolve, reject) => {
      const dir = options.outputDir || path.dirname(filePath);
      const processedDir = path.join(dir, "processed");
      if (!fs.existsSync(processedDir)) {
        fs.mkdirSync(processedDir, { recursive: true });
      }
      const fileName = path.basename(filePath);
      const outputPath = path.join(processedDir, fileName);
      const args = ["-o", outputPath];
      const types = ["video", "audio", "subtitles"];
      const typeMap = {
        "video": "--video-tracks",
        "audio": "--audio-tracks",
        "subtitles": "--subtitle-tracks"
      };
      const noTypeMap = {
        "video": "--no-video",
        "audio": "--no-audio",
        "subtitles": "--no-subtitles"
      };
      types.forEach((type) => {
        const allOfType = options.allTracks.filter((t) => t.type === type);
        if (allOfType.length === 0) return;
        const selectedOfType = allOfType.filter((t) => options.selectedTracks.includes(t.id));
        if (selectedOfType.length === 0) {
          args.push(noTypeMap[type]);
        } else if (selectedOfType.length < allOfType.length) {
          const ids = selectedOfType.map((t) => t.id).join(",");
          args.push(typeMap[type], ids);
        }
      });
      options.modifications.forEach((mod) => {
        if (mod.default !== void 0) {
          args.push("--default-track", `${mod.trackId}:${mod.default ? "1" : "0"}`);
        }
        if (mod.forced !== void 0) {
          args.push("--forced-track", `${mod.trackId}:${mod.forced ? "1" : "0"}`);
        }
      });
      args.push(filePath);
      const child = spawn(this.binPath, args);
      let stderr = "";
      child.stderr.on("data", (data) => {
        stderr += data.toString();
      });
      child.on("close", (code) => {
        if (code !== 0) {
          reject(new Error(`mkvmerge failed with code ${code}: ${stderr}`));
        } else {
          resolve(outputPath);
        }
      });
      child.on("error", (err) => {
        reject(new Error(`Failed to spawn mkvmerge: ${err.message}`));
      });
    });
  }
  async generateThumbnail(filePath) {
    return new Promise((resolve, reject) => {
      const tempDir = app.getPath("temp");
      const filename = `thumb_${Date.now()}_${Math.random().toString(36).substring(7)}.png`;
      const output = path.join(tempDir, filename);
      ffmpeg(filePath).screenshots({
        count: 1,
        folder: tempDir,
        filename,
        timestamps: ["10%"],
        // Capture at 10%
        size: "320x?"
        // Resize width to 320, keep aspect
      }).on("end", () => {
        try {
          const data = fs.readFileSync(output);
          const base64 = `data:image/png;base64,${data.toString("base64")}`;
          fs.unlink(output, () => {
          });
          resolve(base64);
        } catch (e) {
          reject(e);
        }
      }).on("error", (err) => {
        console.error("Thumbnail generation error:", err);
        reject(err);
      });
    });
  }
}
const __dirname$1 = path$1.dirname(fileURLToPath(import.meta.url));
process.env.APP_ROOT = path$1.join(__dirname$1, "..");
if (process.env.VITE_DEV_SERVER_URL) {
  app.setName("MKV Track Tool");
}
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
const MAIN_DIST = path$1.join(process.env.APP_ROOT, "dist-electron");
const RENDERER_DIST = path$1.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path$1.join(process.env.APP_ROOT, "public") : RENDERER_DIST;
let win;
let isProcessing = false;
function createWindow() {
  win = new BrowserWindow({
    width: 1200,
    height: 800,
    titleBarStyle: "hiddenInset",
    icon: path$1.join(process.env.VITE_PUBLIC, "icon.png"),
    webPreferences: {
      preload: path$1.join(__dirname$1, "preload.mjs")
    }
  });
  win.on("close", (e) => {
    if (isProcessing) {
      e.preventDefault();
      const choice = dialog.showMessageBoxSync(win, {
        type: "warning",
        buttons: ["取消", "強制退出"],
        defaultId: 0,
        cancelId: 0,
        title: "任務進行中",
        message: "目前仍有任務正在進行中。",
        detail: "現在關閉軟體可能會導致檔案損壞或處理不完整。\n您確定要強制退出嗎？"
      });
      if (choice === 1) {
        isProcessing = false;
        app.quit();
      }
    }
  });
  win.webContents.on("did-finish-load", () => {
    win == null ? void 0 : win.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  });
  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path$1.join(RENDERER_DIST, "index.html"));
  }
}
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
  }
});
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
app.whenReady().then(() => {
  const mkvTool = new MkvTool();
  ipcMain.handle("scan-file", async (_event, filePath) => {
    return await mkvTool.scanFile(filePath);
  });
  ipcMain.handle("process-file", async (_event, filePath, options) => {
    return await mkvTool.processFile(filePath, options);
  });
  ipcMain.handle("get-thumbnail", async (_event, filePath) => {
    try {
      return await mkvTool.generateThumbnail(filePath);
    } catch (error) {
      console.error("Failed to generate thumbnail:", error);
      return null;
    }
  });
  ipcMain.on("set-processing-state", (_event, state) => {
    isProcessing = state;
  });
  if (process.platform === "darwin") {
    app.dock.setIcon(path$1.join(process.env.VITE_PUBLIC, "icon.png"));
  }
  createWindow();
});
export {
  MAIN_DIST,
  RENDERER_DIST,
  VITE_DEV_SERVER_URL
};
