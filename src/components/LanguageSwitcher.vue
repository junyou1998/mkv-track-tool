<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { availableLocales, setLocale } from '../i18n';

const { locale } = useI18n();
const isOpen = ref(false);

function changeLocale(code: string) {
  setLocale(code);
  isOpen.value = false;
}
</script>

<template>
  <div class="relative">
    <button @click="isOpen = !isOpen" 
      class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1 rounded-md hover:bg-gray-200/50 dark:hover:bg-gray-700/50 cursor-pointer"
      :title="$t('app.change_language')">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
      </svg>
    </button>

    <!-- Dropdown -->
    <div v-if="isOpen" 
      class="absolute bottom-full left-0 mb-2 w-32 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50">
      <div class="py-1">
        <button v-for="lang in availableLocales" :key="lang.code"
          @click="changeLocale(lang.code)"
          class="w-full text-left px-4 py-2 text-xs hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          :class="locale === lang.code ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-gray-700 dark:text-gray-300'">
          {{ lang.name }}
        </button>
      </div>
    </div>
    
    <!-- Backdrop -->
    <div v-if="isOpen" @click="isOpen = false" class="fixed inset-0 z-40"></div>
  </div>
</template>
