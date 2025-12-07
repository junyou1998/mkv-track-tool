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
      duration: number;
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

export interface TrackModification {
  trackId: number;
  default?: boolean;
  forced?: boolean;
}

export interface FileItem {
  id: string; // UUID
  path: string;
  name: string;
  size: number;
  info?: MkvInfo;
  status: 'pending' | 'scanning' | 'ready' | 'processing' | 'done' | 'error';
  error?: string;
  selectedTracks: number[]; // IDs of tracks to KEEP
  modifications: TrackModification[];
  thumbnail?: string; // base64 data URI
}
