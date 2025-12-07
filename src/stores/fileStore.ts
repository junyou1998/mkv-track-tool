import { defineStore } from 'pinia';
import { ref, computed, toRaw } from 'vue';
import type { FileItem } from '../types';
import { v4 as uuidv4 } from 'uuid';

export const useFileStore = defineStore('file', () => {
  const files = ref<FileItem[]>([]);

  function addFile(file: File) {
    // Check if file already exists
    if (files.value.some(f => f.path === file.path)) return;

    const newItem: FileItem = {
      id: uuidv4(),
      path: file.path, // Electron exposes path on File object
      name: file.name,
      size: file.size,
      status: 'pending',
      selectedTracks: [],
      modifications: [],
      thumbnail: undefined
    };
    files.value.push(newItem);
    scanFile(newItem.id);
  }

  async function scanFile(id: string) {
    const file = files.value.find(f => f.id === id);
    if (!file) return;

    file.status = 'scanning';
    try {
      // @ts-ignore
      const info = await window.ipcRenderer.invoke('scan-file', file.path);
      file.info = info;
      file.status = 'ready';
      // Default select all tracks
      file.selectedTracks = info.tracks.map((t: any) => t.id);

      // Generate thumbnail
      window.ipcRenderer.invoke('get-thumbnail', file.path).then(thumb => {
        if (thumb) {
          file.thumbnail = thumb;
        }
      });
    } catch (err: any) {
      console.error(err);
      file.status = 'error';
      file.error = err.message;
    }
  }

  function removeFile(id: string) {
    files.value = files.value.filter(f => f.id !== id);
  }

  function clearFiles() {
    files.value = [];
  }

  function removeTracksByLanguage(language: string, type?: string) {
    files.value.forEach(file => {
      if (!file.info) return;
      file.info.tracks.forEach(track => {
        const trackLang = track.language || track.properties.language;
        if (trackLang === language && (!type || track.type === type)) {
          // Remove from selectedTracks
          file.selectedTracks = file.selectedTracks.filter(id => id !== track.id);
        }
      });
    });
  }

  function setDefaultTrackByLanguage(language: string, type: string) {
    files.value.forEach(file => {
      if (!file.info) return;
      const track = file.info.tracks.find(t => {
        const trackLang = t.language || t.properties.language;
        return trackLang === language && t.type === type;
      });
      
      if (track) {
        // Add to modifications
        const existingMod = file.modifications.find(m => m.trackId === track.id);
        if (existingMod) {
          existingMod.default = true;
        } else {
          file.modifications.push({ trackId: track.id, default: true });
        }
        
        // Unset default for other tracks of same type
        file.info.tracks.forEach(t => {
          if (t.type === type && t.id !== track.id) {
             const mod = file.modifications.find(m => m.trackId === t.id);
             if (mod) mod.default = false;
             else file.modifications.push({ trackId: t.id, default: false });
          }
        });
      }
    });
  }

  // Progress Tracking
  const isProcessing = ref(false);

  const queueStats = computed(() => {
    const total = files.value.length;
    const pending = files.value.filter(f => f.status === 'ready' || f.status === 'pending').length;
    const processing = files.value.filter(f => f.status === 'processing').length;
    const completed = files.value.filter(f => f.status === 'done' || f.status === 'error').length;
    
    return {
      total,
      pending,
      processing,
      completed,
      remaining: pending + processing,
      percent: total === 0 ? 0 : Math.round((completed / total) * 100)
    };
  });

  async function processAllFiles() {
    isProcessing.value = true;
    window.ipcRenderer.send('set-processing-state', true);
    
    for (const file of files.value) {
      if (file.status !== 'ready') continue;
      
      file.status = 'processing';
      try {
        // @ts-ignore
        await window.ipcRenderer.invoke('process-file', file.path, {
          selectedTracks: toRaw(file.selectedTracks),
          modifications: toRaw(file.modifications).map(m => toRaw(m)),
          allTracks: toRaw(file.info?.tracks || [])
        });
        file.status = 'done';
      } catch (err: any) {
        console.error(err);
        file.status = 'error';
        file.error = err.message;
      }
    }
    isProcessing.value = false;
    window.ipcRenderer.send('set-processing-state', false);
  }

  const availableLanguages = computed(() => {
    const langs = new Set<string>();
    files.value.forEach(file => {
      if (file.info) {
        file.info.tracks.forEach(track => {
          if (track.language) langs.add(track.language);
          if (track.properties.language) langs.add(track.properties.language);
        });
      }
    });
    return Array.from(langs).sort();
  });

  // Batch Preview Logic
  const previewCriteria = ref<{
    language: string;
    type: string; // 'all' | 'audio' | 'subtitles'
    action: 'remove' | 'default' | null;
  }>({
    language: '',
    type: 'all',
    action: null
  });

  function setPreviewCriteria(criteria: Partial<typeof previewCriteria.value>) {
    previewCriteria.value = { ...previewCriteria.value, ...criteria };
  }

  function isTrackMatchingPreview(track: any) {
    if (!previewCriteria.value.language || !previewCriteria.value.action) return false;
    
    const langMatch = track.language === previewCriteria.value.language || track.properties.language === previewCriteria.value.language;
    if (!langMatch) return false;

    if (previewCriteria.value.type !== 'all' && track.type !== previewCriteria.value.type) return false;

    return true;
  }

  function setGlobalDrag(isDragging: boolean) {
    isGlobalDragging.value = isDragging;
  }

  function resetAllChanges() {
    files.value.forEach(file => {
      if (!file.info) return;
      // Re-select all tracks
      file.selectedTracks = file.info.tracks.map(t => t.id);
      // Clear modifications
      file.modifications = [];
    });
  }

  // Shared drag state
  const isGlobalDragging = ref(false);

  return {
    files,
    isProcessing,
    isGlobalDragging,
    queueStats,
    availableLanguages,
    previewCriteria,
    processAllFiles,
    addFile,
    removeFile,
    removeTracksByLanguage,
    setDefaultTrackByLanguage,
    setPreviewCriteria,
    isTrackMatchingPreview,
    clearFiles,
    setGlobalDrag,
    resetAllChanges
  };
});
