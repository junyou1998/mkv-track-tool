import { spawn } from 'child_process';
import path from 'path';
import { app } from 'electron';
import fs from 'fs';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegStatic from 'ffmpeg-static';
import ffprobeStatic from 'ffprobe-static';

if (ffmpegStatic) {
  ffmpeg.setFfmpegPath(ffmpegStatic);
}
if (ffprobeStatic && ffprobeStatic.path) {
  ffmpeg.setFfprobePath(ffprobeStatic.path);
}

export interface MkvTrack {
  id: number;
  type: string;
  codec: string;
  language: string;
  properties: {
    track_name?: string;
    default_track?: boolean;
    forced_track?: boolean;
    pixel_dimensions?: string;
    [key: string]: any;
  };
}

export interface MkvInfo {
  fileName: string;
  container: {
    properties: {
      duration: number; // in nanoseconds
      [key: string]: any;
    };
  };
  tracks: MkvTrack[];
}

export interface ProcessOptions {
  selectedTracks: number[];
  modifications: { trackId: number; default?: boolean; forced?: boolean }[];
  outputDir?: string;
  allTracks: MkvTrack[];
}

export class MkvTool {
  private binPath: string;

  constructor() {
    this.binPath = this.resolveBinPath();
  }

  private resolveBinPath(): string {
    const platform = process.platform;
    let binName = 'mkvmerge';
    if (platform === 'win32') {
      binName = 'mkvmerge.exe';
    }

    // In production, binaries should be in resources/bin
    if (app.isPackaged) {
      return path.join(process.resourcesPath, 'bin', binName);
    }

    // In development, check local bin, then common system paths
    const localBin = path.join(process.cwd(), 'bin', platform, binName);
    if (fs.existsSync(localBin)) {
      return localBin;
    }

    // Check Homebrew path on macOS (Apple Silicon & Intel)
    const brewPathArm = path.join('/opt/homebrew/bin', binName);
    if (fs.existsSync(brewPathArm)) {
      return brewPathArm;
    }
    
    const brewPathIntel = path.join('/usr/local/bin', binName);
    if (fs.existsSync(brewPathIntel)) {
      return brewPathIntel;
    }

    // Fallback to PATH
    return binName;
  }

  public async scanFile(filePath: string): Promise<MkvInfo> {
    return new Promise((resolve, reject) => {
      const args = ['-J', filePath];
      const child = spawn(this.binPath, args);

      let stdout = '';
      let stderr = '';

      child.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      child.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      child.on('close', (code) => {
        if (code !== 0) {
          reject(new Error(`mkvmerge failed with code ${code}: ${stderr}`));
          return;
        }

        try {
          const json = JSON.parse(stdout);
          resolve(json as MkvInfo);
        } catch (err) {
          reject(new Error(`Failed to parse mkvmerge output: ${err}`));
        }
      });
      
      child.on('error', (err) => {
        reject(new Error(`Failed to spawn mkvmerge: ${err.message}. Path: ${this.binPath}`));
      });
    });
  }

  public async processFile(filePath: string, options: ProcessOptions): Promise<string> {
    return new Promise((resolve, reject) => {
      const dir = options.outputDir || path.dirname(filePath);
      const processedDir = path.join(dir, 'processed');

      if (!fs.existsSync(processedDir)) {
        fs.mkdirSync(processedDir, { recursive: true });
      }

      const fileName = path.basename(filePath);
      const outputPath = path.join(processedDir, fileName);

      // Construct args
      // -o output input --audio-tracks id,id --subtitle-tracks id,id
      // But mkvmerge uses --audio-tracks <n>,<m> to KEEP those tracks.
      // And we can use --default-track <id>:<bool>
      
      const args = ['-o', outputPath];

      // Track selection logic
      // We need to generate --video-tracks, --audio-tracks, --subtitle-tracks
      // based on selectedTracks and allTracks.
      
      const types = ['video', 'audio', 'subtitles'];
      const typeMap: Record<string, string> = {
        'video': '--video-tracks',
        'audio': '--audio-tracks',
        'subtitles': '--subtitle-tracks'
      };
      const noTypeMap: Record<string, string> = {
        'video': '--no-video',
        'audio': '--no-audio',
        'subtitles': '--no-subtitles'
      };

      types.forEach(type => {
        const allOfType = options.allTracks.filter(t => t.type === type);
        if (allOfType.length === 0) return; // No tracks of this type in source

        const selectedOfType = allOfType.filter(t => options.selectedTracks.includes(t.id));

        if (selectedOfType.length === 0) {
          // None selected -> Remove all of this type
          args.push(noTypeMap[type]);
        } else if (selectedOfType.length < allOfType.length) {
          // Some selected -> Specify IDs
          const ids = selectedOfType.map(t => t.id).join(',');
          args.push(typeMap[type], ids);
        }
        // If selectedOfType.length === allOfType.length -> Do nothing (copy all is default)
      });

      // Modifications
      // --default-track <id>:<bool>
      // --forced-track <id>:<bool>
      options.modifications.forEach(mod => {
        if (mod.default !== undefined) {
          args.push('--default-track', `${mod.trackId}:${mod.default ? '1' : '0'}`);
        }
        if (mod.forced !== undefined) {
          args.push('--forced-track', `${mod.trackId}:${mod.forced ? '1' : '0'}`);
        }
      });

      args.push(filePath);

      const child = spawn(this.binPath, args);

      let stderr = '';

      child.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      child.on('close', (code) => {
        if (code !== 0) {
          reject(new Error(`mkvmerge failed with code ${code}: ${stderr}`));
        } else {
          resolve(outputPath);
        }
      });

      child.on('error', (err) => {
        reject(new Error(`Failed to spawn mkvmerge: ${err.message}`));
      });
    });
  }


  public async generateThumbnail(filePath: string): Promise<string> {
    return new Promise((resolve, reject) => {
      // Create a unique temp path
      const tempDir = app.getPath('temp');
      const filename = `thumb_${Date.now()}_${Math.random().toString(36).substring(7)}.png`; // safer filename
      const output = path.join(tempDir, filename);

      ffmpeg(filePath)
        // .seekInput('00:00:05') // Seek to 5s potentially faster than timestamps?
        .screenshots({
          count: 1,
          folder: tempDir,
          filename: filename,
          timestamps: ['10%'], // Capture at 10%
          size: '320x?' // Resize width to 320, keep aspect
        })
        .on('end', () => {
          // Read file and convert to base64
          try {
            const data = fs.readFileSync(output);
            const base64 = `data:image/png;base64,${data.toString('base64')}`;
             // Clean up
             fs.unlink(output, () => {});
             resolve(base64);
          } catch (e) {
            reject(e);
          }
        })
        .on('error', (err) => {
            console.error('Thumbnail generation error:', err);
            reject(err);
        });
    });
  }
}
