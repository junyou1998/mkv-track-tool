<script setup lang="ts">
import DropZone from './components/DropZone.vue';
import FileList from './components/FileList.vue';
import SidebarActions from './components/SidebarActions.vue';
import ThemeSwitcher from './components/ThemeSwitcher.vue';
import AboutModal from './components/AboutModal.vue';
import LanguageSwitcher from './components/LanguageSwitcher.vue';
import { useFileStore } from './stores/fileStore';
import { ref, onMounted, onUnmounted } from 'vue';

const fileStore = useFileStore();
const showAboutModal = ref(false);
const dragCounter = ref(0); // Reactive counter not needed for logic but good for debugging if needed, but simple var is fine. Wait, in vue setup script let is fine.
// Actually, let's keep consistency with previous code.

function onGlobalDragEnter(e: DragEvent) {
  e.preventDefault();
  dragCounter.value++;
  if (e.dataTransfer?.types.includes('Files')) {
    fileStore.setGlobalDrag(true);
  }
}

function onGlobalDragLeave(e: DragEvent) {
  e.preventDefault();
  dragCounter.value--;
  if (dragCounter.value === 0) {
    fileStore.setGlobalDrag(false);
  }
}

function onGlobalDrop(e: DragEvent) {
  e.preventDefault();
  dragCounter.value = 0;
  fileStore.setGlobalDrag(false);
  if (e.dataTransfer?.files) {
    for (const file of e.dataTransfer.files) {
      if (file.name.toLowerCase().endsWith('.mkv')) {
        fileStore.addFile(file);
      }
    }
  }
}

function onGlobalDragOver(e: DragEvent) {
  e.preventDefault();
}

onMounted(() => {
  window.addEventListener('dragenter', onGlobalDragEnter);
  window.addEventListener('dragleave', onGlobalDragLeave);
  window.addEventListener('dragover', onGlobalDragOver);
  window.addEventListener('drop', onGlobalDrop);
});

onUnmounted(() => {
  window.removeEventListener('dragenter', onGlobalDragEnter);
  window.removeEventListener('dragleave', onGlobalDragLeave);
  window.removeEventListener('dragover', onGlobalDragOver);
  window.removeEventListener('drop', onGlobalDrop);
});
</script>

<template>
  <div
    class="flex h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white font-sans overflow-hidden transition-colors duration-300 relative">

    <!-- Global Drag Overlay (Transparent with Border) -->
    <Transition enter-active-class="transition duration-300 ease-out" enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100" leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95">
      <div v-show="fileStore.isGlobalDragging"
        class="absolute inset-4 z-[100] flex items-center justify-center pointer-events-none">

        <!-- Center Floating Badge -->
        <div
          class="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md px-8 py-6 rounded-2xl shadow-2xl flex flex-col items-center gap-3 transform -translate-y-8">
          <div class="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
              class="w-10 h-10 text-blue-500">
              <path fill-rule="evenodd"
                d="M10.5 3.75a6 6 0 00-5.98 6.496A5.25 5.25 0 006.75 20.25H18a4.5 4.5 0 002.206-8.423 3.75 3.75 0 00-4.133-4.303A6.001 6.001 0 0010.5 3.75zm2.03 5.47a.75.75 0 00-1.06 0l-3 3a.75.75 0 101.06 1.06l1.72-1.72v4.94a.75.75 0 001.5 0v-4.94l1.72 1.72a.75.75 0 101.06-1.06l-3-3z"
                clip-rule="evenodd" />
            </svg>
          </div>
          <span class="text-lg font-bold text-gray-700 dark:text-gray-200">{{ $t('app.release_to_import') }}</span>
        </div>
      </div>
    </Transition>

    <!-- Drag Region (Top Strip) -->
    <div class="fixed top-0 left-0 w-full h-8 z-50" style="-webkit-app-region: drag"></div>

    <!-- Left Sidebar -->
    <aside
      class="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col shadow-xl z-20 transition-colors duration-300">
      <!-- App Header -->
      <div class="p-6 pb-4 pt-8">
        <h1 class="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
          {{ $t('app.title') }}
        </h1>
        <p class="text-xs text-gray-400 mt-1">{{ $t('app.version') }} v1.0.0</p>
      </div>

      <!-- Scrollable Sidebar Content -->
      <div class="flex-1 overflow-y-auto px-4 py-2 space-y-6">
        <!-- Drop Zone -->
        <DropZone />

        <!-- Vertical Actions -->
        <SidebarActions />
      </div>

      <!-- Pinned Actions (Clear) -->
      <div class="px-4 py-2 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <button @click="fileStore.clearFiles"
          class="w-full py-2 px-4 bg-gray-100 dark:bg-gray-700/50 hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 group cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 group-hover:scale-110 transition-transform" fill="none"
            viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          {{ $t('app.clear_list') }}
        </button>
      </div>

      <!-- Sidebar Footer -->
      <div
        class="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50 gap-2">
        <ThemeSwitcher />
        <LanguageSwitcher />
        <div class="flex-1"></div>
        <button @click="showAboutModal = true" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors cursor-pointer p-1 rounded-md hover:bg-gray-200/50 dark:hover:bg-gray-700/50">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
      </div>
    </aside>

    <AboutModal v-model="showAboutModal" />

    <!-- Main Content Area -->
    <main class="flex-1 flex flex-col overflow-hidden relative bg-gray-50 dark:bg-gray-900">
      <!-- Main Header -->
      <header
        class="h-16 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center px-6 bg-white dark:bg-gray-800/50 backdrop-blur-sm z-10 transition-colors duration-300">
        <div class="flex items-center gap-4 w-full">
          <div class="flex items-center gap-3">
            <h2 class="text-sm font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wide">{{ $t('app.queue') }}</h2>
            <span class="px-2 py-0.5 rounded-full text-xs font-medium transition-colors" :class="{
              'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400': fileStore.files.length === 0,
              'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400': fileStore.files.length > 0 && !fileStore.isProcessing,
              'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400': fileStore.isProcessing
            }">
              {{ fileStore.files.length === 0 ? $t('app.idle') : (fileStore.isProcessing ? $t('app.processing') : $t('app.ready')) }}
            </span>
          </div>

          <div class="flex-1"></div>

          <!-- Progress Status (Visible when processing) -->
          <div v-if="fileStore.isProcessing" class="flex items-center gap-4 min-w-[300px]">
            <div class="flex-1">
              <div class="flex justify-between text-xs mb-1.5">
                <span class="font-medium text-blue-600 dark:text-blue-400">{{ $t('app.processing_progress') }}</span>
                <span class="text-gray-500">{{ fileStore.queueStats.completed }} / {{ fileStore.queueStats.total
                }}</span>
              </div>
              <div class="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                <div class="h-full bg-blue-500 rounded-full transition-all duration-300 ease-out"
                  :style="{ width: `${fileStore.queueStats.percent}%` }"></div>
              </div>
            </div>
          </div>

          <!-- Start Button (Visible when NOT processing) -->
          <button v-else @click="fileStore.processAllFiles" :disabled="fileStore.files.length === 0"
            class="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-semibold shadow-md shadow-blue-500/20 transition-all flex items-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 group-hover:scale-110 transition-transform"
              fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {{ fileStore.files.length === 0 ? $t('app.no_files') : $t('app.start_processing') }}
          </button>
        </div>
      </header>

      <!-- Scrollable File List -->
      <div class="flex-1 overflow-y-auto p-6">
        <FileList />
      </div>
    </main>
  </div>
</template>
