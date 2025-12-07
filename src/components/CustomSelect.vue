<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';

const props = defineProps<{
    modelValue: string | null;
    options: (string | { label: string; value: string })[];
    placeholder?: string;
}>();

const emit = defineEmits(['update:modelValue']);

const isOpen = ref(false);
const containerRef = ref<HTMLElement | null>(null);

// Normalize options to { label, value } format
const normalizedOptions = computed(() => {
    return props.options.map(opt => {
        if (typeof opt === 'string') {
            return { label: opt, value: opt };
        }
        return opt;
    });
});

const selectedLabel = computed(() => {
    if (!props.modelValue) return props.placeholder || 'Select...';

    const found = normalizedOptions.value.find(opt => opt.value === props.modelValue);
    return found ? found.label : props.modelValue;
});

function toggle() {
    isOpen.value = !isOpen.value;
}

function select(value: string) {
    emit('update:modelValue', value);
    isOpen.value = false;
}

// Click outside to close
function handleClickOutside(event: MouseEvent) {
    if (containerRef.value && !containerRef.value.contains(event.target as Node)) {
        isOpen.value = false;
    }
}

onMounted(() => {
    document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside);
});
</script>

<template>
    <div ref="containerRef" class="relative w-full text-sm">
        <!-- Trigger Button -->
        <button type="button" @click="toggle"
            class="w-full relative cursor-pointer bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl pl-3 pr-10 py-2.5 text-left shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 group hover:border-gray-300 dark:hover:border-gray-600"
            :class="{
                'text-gray-500 dark:text-gray-400': !modelValue,
                'text-gray-900 dark:text-gray-100 font-medium': modelValue,
                'ring-2 ring-blue-500/10 border-blue-500 dark:border-blue-500': isOpen
            }">
            <span class="block truncate">{{ selectedLabel }}</span>
            <span class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg class="h-4 w-4 text-gray-400 group-hover:text-gray-500 transition-all duration-300"
                    :class="{ 'rotate-180 text-blue-500': isOpen }" xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clip-rule="evenodd" />
                </svg>
            </span>
        </button>

        <!-- Dropdown Menu -->
        <Transition enter-active-class="transition ease-out duration-200"
            enter-from-class="transform opacity-0 -translate-y-2 scale-95"
            enter-to-class="transform opacity-100 translate-y-0 scale-100"
            leave-active-class="transition ease-in duration-150"
            leave-from-class="transform opacity-100 translate-y-0 scale-100"
            leave-to-class="transform opacity-0 -translate-y-2 scale-95">
            <div v-if="isOpen"
                class="absolute z-50 mt-2 w-full bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 py-1 overflow-hidden ring-1 ring-black/5 dark:ring-white/5">
                <ul
                    class="max-h-60 overflow-auto scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent p-1">
                    <li v-for="option in normalizedOptions" :key="option.value" @click="select(option.value)"
                        class="relative cursor-pointer select-none py-2 px-3 rounded-lg transition-all duration-150 group"
                        :class="[
                            modelValue === option.value
                                ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                                : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                        ]">
                        <div class="flex items-center justify-between">
                            <span class="block truncate"
                                :class="{ 'font-semibold': modelValue === option.value, 'font-medium': modelValue !== option.value }">
                                {{ option.label }}
                            </span>

                            <span v-if="modelValue === option.value"
                                class="flex items-center text-blue-600 dark:text-blue-400">
                                <svg class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path fill-rule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clip-rule="evenodd" />
                                </svg>
                            </span>
                        </div>
                    </li>

                    <!-- Empty State -->
                    <li v-if="normalizedOptions.length === 0" class="text-gray-400 text-center py-4 italic text-xs">
                        無可用選項
                    </li>
                </ul>
            </div>
        </Transition>
    </div>
</template>
