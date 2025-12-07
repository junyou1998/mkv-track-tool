<script setup lang="ts">
import { watch, ref } from 'vue';
import { useFileStore } from '../stores/fileStore';
import CustomSelect from './CustomSelect.vue';

const fileStore = useFileStore();

const selectedLanguage = ref('');
const selectedType = ref('all');

// Define options for Select
const typeOptions = [
  { label: '所有軌道類型', value: 'all' },
  { label: '音訊 (Audio)', value: 'audio' },
  { label: '字幕 (Subtitle)', value: 'subtitles' }
];

watch([selectedLanguage, selectedType], ([newLang, newType]) => {
  fileStore.setPreviewCriteria({
    language: newLang,
    type: newType,
    action: null // Don't trigger action preview just by selecting language
  });
});

function setActionPreview(action: 'remove' | 'default' | null) {
  if (!selectedLanguage.value) return;
  fileStore.setPreviewCriteria({ action });
}

function applyRemove() {
  if (!selectedLanguage.value) return;
  fileStore.removeTracksByLanguage(selectedLanguage.value, selectedType.value === 'all' ? undefined : selectedType.value);
  setActionPreview(null);
}

function applyDefault() {
  if (!selectedLanguage.value) return;

  if (selectedType.value === 'all') {
    ['audio', 'subtitles'].forEach(t => {
      fileStore.setDefaultTrackByLanguage(selectedLanguage.value, t);
    });
  } else {
    fileStore.setDefaultTrackByLanguage(selectedLanguage.value, selectedType.value);
  }
  setActionPreview(null);
}
</script>

<template>
  <div class="px-4 py-2 space-y-4">
    <!-- Batch Operations -->
    <div class="space-y-3">
      <h3 class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">批量操作</h3>

      <!-- Filter Controls -->
      <div class="space-y-5">
        <!-- Language Select -->
        <div class="space-y-2">
          <label class="block text-xs font-bold text-gray-500 dark:text-gray-400 tracking-wide ml-1">目標語言</label>
          <CustomSelect v-model="selectedLanguage" :options="fileStore.availableLanguages" placeholder="選擇語言" />
        </div>

        <!-- Type Select -->
        <div class="space-y-2">
          <label class="block text-xs font-bold text-gray-500 dark:text-gray-400 tracking-wide ml-1">軌道類型</label>
          <CustomSelect v-model="selectedType" :options="typeOptions" placeholder="選擇類型" />
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="grid grid-cols-2 gap-2 pt-2">
        <button @click="applyDefault" @mouseenter="setActionPreview('default')" @mouseleave="setActionPreview(null)"
          :disabled="!selectedLanguage"
          class="px-3 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-500 text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg text-xs font-medium transition-all shadow-sm flex flex-col items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed group cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mb-0.5 group-hover:scale-110 transition-transform"
            fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          設為預設
        </button>
        <button @click="applyRemove" @mouseenter="setActionPreview('remove')" @mouseleave="setActionPreview(null)"
          :disabled="!selectedLanguage"
          class="px-3 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:border-red-500 dark:hover:border-red-500 text-gray-700 dark:text-gray-200 hover:text-red-600 dark:hover:text-red-400 rounded-lg text-xs font-medium transition-all shadow-sm flex flex-col items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed group cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mb-0.5 group-hover:scale-110 transition-transform"
            fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          批量移除
        </button>
      </div>

      <!-- Reset Button -->
      <button @click="fileStore.resetAllChanges" :disabled="fileStore.files.length === 0"
        class="w-full mt-2 py-2 bg-gray-100 dark:bg-gray-700/50 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-lg text-xs font-medium transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed group">
        <svg xmlns="http://www.w3.org/2000/svg"
          class="h-4 w-4 group-hover:-rotate-180 transition-transform duration-500" fill="none" viewBox="0 0 24 24"
          stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        重置所有變更
      </button>
    </div>
  </div>
</template>
