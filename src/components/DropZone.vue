<script setup lang="ts">
import { ref } from 'vue';
import { useFileStore } from '../stores/fileStore';

const fileStore = useFileStore();
const isDragging = ref(false);

function onDrop(e: DragEvent) {
  isDragging.value = false;
  if (e.dataTransfer?.files) {
    for (const file of e.dataTransfer.files) {
      if (file.name.toLowerCase().endsWith('.mkv')) {
        fileStore.addFile(file);
      }
    }
  }
}

function onDragOver() {
  isDragging.value = true;
}

function onDragLeave() {
  isDragging.value = false;
}

function openFileDialog() {
  const input = document.createElement('input');
  input.type = 'file';
  input.multiple = true;
  input.accept = '.mkv';
  input.onchange = (e: any) => {
    if (e.target.files) {
      for (const file of e.target.files) {
        fileStore.addFile(file);
      }
    }
  };
  input.click();
}
</script>

<template>
  <div
    class="relative border-2 border-dashed rounded-2xl p-6 text-center transition-all duration-300 cursor-pointer group overflow-hidden bg-gray-50/50 dark:bg-gray-800/30"
    :class="[
      isDragging || fileStore.isGlobalDragging
        ? 'border-blue-500 bg-blue-500/10 scale-[1.02]'
        : 'border-gray-300 dark:border-gray-700 hover:border-blue-500/50 hover:bg-gray-50 dark:hover:bg-gray-800/50'
    ]" @drop.prevent="onDrop" @dragover.prevent="onDragOver" @dragleave.prevent="onDragLeave" @click="openFileDialog">
    <div
      class="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity">
    </div>

    <div class="relative z-10 flex flex-col items-center gap-3 py-2">
      <!-- Folder Icon -->
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
        class="w-12 h-12 text-blue-300 dark:text-blue-500/80 drop-shadow-sm group-hover:scale-105 transition-transform duration-300">
        <path
          d="M19.5 21a3 3 0 003-3v-4.5a3 3 0 00-3-3h-15a3 3 0 00-3 3V18a3 3 0 003 3h15zM1.5 10.146V6a3 3 0 013-3h5.379a2.25 2.25 0 011.59.659l2.122 2.121c.14.141.331.22.53.22H19.5a3 3 0 013 3v1.146A4.483 4.483 0 0019.5 9h-15a4.483 4.483 0 00-3 1.146z" />
      </svg>

      <div class="space-y-1">
        <h3 class="text-sm font-medium text-gray-700 dark:text-gray-200">
          {{ $t('dropzone.title') }} <span class="text-blue-500 font-semibold hover:underline">{{ $t('dropzone.click_select') }}</span>
        </h3>
        <p class="text-[10px] text-gray-400">{{ $t('dropzone.support_hint') }}</p>
      </div>
    </div>
  </div>
</template>
