<script setup lang="ts">
import { useFileStore } from '../stores/fileStore';
import { storeToRefs } from 'pinia';
import { ref } from 'vue';
import TrackList from './TrackList.vue';

const fileStore = useFileStore();
const { files } = storeToRefs(fileStore);



function formatSize(bytes: number) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function getStatusColor(status: string) {
  switch (status) {
    case 'ready': return 'text-green-400 bg-green-400/10 border-green-400/20';
    case 'processing': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
    case 'done': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
    case 'error': return 'text-red-400 bg-red-400/10 border-red-400/20';
    default: return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
  }
}

function getStatusText(status: string) {
  switch (status) {
    case 'ready': return '準備就緒';
    case 'processing': return '處理中';
    case 'done': return '已完成';
    case 'error': return '錯誤';
    case 'pending': return '等待中';
    case 'scanning': return '掃描中';
    default: return status;
  }
}

// Hover Preview Logic
const hoverPreview = ref<{
  show: boolean;
  x: number;
  y: number;
  src: string;
}>({
  show: false,
  x: 0,
  y: 0,
  src: ''
});

function handleMouseEnter(event: MouseEvent, src: string | undefined) {
  if (!src) return;
  hoverPreview.value.src = src;
  hoverPreview.value.show = true;
  updatePreviewPosition(event);
}

function handleMouseMove(event: MouseEvent) {
  if (!hoverPreview.value.show) return;
  updatePreviewPosition(event);
}

function handleMouseLeave() {
  hoverPreview.value.show = false;
}

function updatePreviewPosition(event: MouseEvent) {
  // Offset from cursor
  const offset = 20;
  // Check bounds (simple check, can improved)
  const x = event.clientX + offset;
  const y = event.clientY + offset;

  hoverPreview.value.x = x;
  hoverPreview.value.y = y;
}
</script>

<template>
  <div v-if="files.length > 0"
    class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden transition-colors duration-300">

    <div class="divide-y divide-gray-200 dark:divide-gray-700/50">
      <div v-for="file in files" :key="file.id"
        class="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors group">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4 overflow-hidden">
            <div
              class="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400 overflow-hidden relative cursor-pointer"
              @mouseenter="handleMouseEnter($event, file.thumbnail)" @mousemove="handleMouseMove($event)"
              @mouseleave="handleMouseLeave">
              <img v-if="file.thumbnail" :src="file.thumbnail" class="w-full h-full object-cover" alt="Thumbnail">
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>

            <div class="min-w-0">
              <div class="font-medium text-gray-800 dark:text-gray-200 truncate" :title="file.path">{{ file.name }}
              </div>
              <div class="text-xs text-gray-500 flex items-center gap-3 mt-1">
                <span>{{ formatSize(file.size) }}</span>
                <span v-if="file.info" class="flex items-center gap-1">
                  <span class="w-1 h-1 rounded-full bg-gray-500"></span>
                  {{ file.info.tracks.length }} tracks
                </span>
              </div>
            </div>
          </div>

          <div class="flex items-center gap-4">
            <span class="px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize"
              :class="getStatusColor(file.status)">
              {{ getStatusText(file.status) }}
            </span>

            <button @click.stop="fileStore.removeFile(file.id)"
              class="p-2 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
              title="移除檔案">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Error Message -->
        <div v-if="file.error" class="mt-2 text-xs text-red-400 bg-red-400/5 p-2 rounded border border-red-400/10">
          {{ file.error }}
        </div>

        <!-- Always Expanded Track List -->
        <div class="pl-14 pr-4 pb-2">
          <TrackList :file="file" />
        </div>
      </div>
    </div>

    <!-- Hover Preview Floating Window -->
    <Teleport to="body">
      <div v-if="hoverPreview.show"
        class="fixed z-[9999] pointer-events-none rounded-xl overflow-hidden shadow-2xl border-4 border-white dark:border-gray-800 bg-black/90 backdrop-blur-sm transition-all duration-75 ease-out"
        :style="{
          left: `${hoverPreview.x}px`,
          top: `${hoverPreview.y}px`,
          maxWidth: '400px'
        }">
        <img :src="hoverPreview.src" class="w-full h-auto object-contain block" />
      </div>
    </Teleport>
  </div>
</template>
