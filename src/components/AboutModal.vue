<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits(['update:modelValue']);

function close() {
  emit('update:modelValue', false);
}

const isChecking = ref(false);
const updateStatus = ref('');

function checkUpdate() {
  isChecking.value = true;
  updateStatus.value = '';
  
  // Mock check
  setTimeout(() => {
    isChecking.value = false;
    updateStatus.value = t('about.latest');
    
    // Future integration: 
    // fetch('https://api.github.com/repos/junyou1998/mkv-track-tool/releases/latest')
  }, 1500);
}
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="modelValue" class="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" @click.self="close">
        
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative transform transition-all scale-100">
            
            <!-- Close Button -->
            <button @click="close" class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <!-- Header -->
            <div class="px-6 py-4 border-b border-gray-100 dark:border-gray-700/50">
                <h2 class="text-lg font-bold text-gray-800 dark:text-gray-100">{{ $t('about.title') }}</h2>
            </div>
            
            <!-- Content -->
            <div class="p-8 flex flex-col items-center text-center">
                
                <!-- App Icon -->
                <div class="w-24 h-24 mb-6 relative group">
                    <img src="/icon.png" alt="App Icon" class="w-full h-full object-contain filter drop-shadow-xl transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                </div>
                
                <!-- App Name & Version -->
                <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">{{ $t('app.title') }}</h1>
                
                <div class="flex flex-col items-center gap-2 mb-6">
                   <div class="flex items-center gap-2">
                       <span class="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full text-xs font-bold tracking-wide">v1.0.0</span>
                       <a href="https://github.com/junyou1998/mkv-track-tool/releases" target="_blank" class="text-xs text-gray-400 hover:text-blue-500 hover:underline transition-colors dark:hover:text-blue-400">{{ $t('about.changelog') }}</a>
                   </div>
                   
                   <!-- Check Update Button -->
                    <button 
                        @click="checkUpdate" 
                        :disabled="isChecking"
                        class="text-xs text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                    >
                        <svg v-if="isChecking" class="animate-spin h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        {{ isChecking ? $t('about.checking') : $t('about.check_update') }}
                    </button>
                    <span v-if="updateStatus" class="text-xs text-green-500 font-medium animate-fade-in">{{ updateStatus }}</span>
                </div>
                
                <p class="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-8 max-w-xs">
                    {{ $t('about.description') }}
                </p>
                
                <div class="w-full border-t border-gray-100 dark:border-gray-700/50 mb-6"></div>
                
                <!-- Developer Info -->
                <div class="text-left w-full space-y-4">
                    <div class="flex items-center gap-2 mb-2">
                        <span class="text-xl">👨‍💻</span>
                        <h3 class="font-bold text-gray-800 dark:text-gray-200">{{ $t('about.developer_info') }}</h3>
                    </div>
                    
                    <p class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                        {{ $t('about.developer_desc') }}
                    </p>
                    
                    <div class="flex flex-col items-center gap-4 mt-6">
                        <a href="https://www.buymeacoffee.com/junyou" target="_blank" rel="noopener noreferrer"
                            class="transition-transform hover:scale-105 active:scale-95 block">
                            <img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png"
                                alt="Buy Me A Coffee" style="height: 60px !important; width: 217px !important;">
                        </a>
                        
                        <div class="flex items-center gap-1.5 text-xs text-gray-400">
                             <span>{{ $t('about.thank_you') }}</span>
                             <span class="text-red-400 animate-pulse">❤️</span>
                        </div>
                    </div>
                </div>
                
                <!-- Footer Links -->
                <div class="mt-8 pt-4 border-t border-gray-100 dark:border-gray-700/50 w-full flex justify-center gap-4 text-xs text-gray-400">
                    <a href="https://github.com/junyou1998/mkv-track-tool" target="_blank" class="hover:text-gray-600 dark:hover:text-gray-300 flex items-center gap-1 transition-colors">
                        <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd" /></svg>
                        GitHub Repository
                    </a>
                </div>
            </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
