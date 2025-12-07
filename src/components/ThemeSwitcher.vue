<script setup lang="ts">
import { computed } from 'vue';
import { useTheme } from '../composables/useTheme';
import { useI18n } from 'vue-i18n';

const { theme, setTheme } = useTheme();
const { t } = useI18n(); // Optional: if we want to translate title, but for now icon is enough or we use generic names.

const nextTheme = computed(() => {
    switch (theme.value) {
        case 'light': return 'dark';
        case 'dark': return 'system';
        case 'system': return 'light';
        default: return 'light';
    }
});

function toggleTheme() {
    setTheme(nextTheme.value);
}

const currentIcon = computed(() => {
    switch (theme.value) {
        case 'light':
            // Sun icon
            return 'M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z';
        case 'dark':
            // Moon icon
            return 'M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z';
        case 'system':
            // Desktop icon
            return 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z';
        default: return '';
    }
});

const themeLabel = computed(() => {
    switch (theme.value) {
        case 'light': return t('theme.light');
        case 'dark': return t('theme.dark');
        case 'system': return t('theme.system');
        default: return '';
    }
});
</script>

<template>
    <button @click="toggleTheme" 
        class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1 rounded-md hover:bg-gray-200/50 dark:hover:bg-gray-700/50 cursor-pointer"
        :title="themeLabel">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="currentIcon" />
        </svg>
    </button>
</template>
