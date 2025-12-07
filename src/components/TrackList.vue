<script setup lang="ts">
import { computed } from 'vue';
import type { FileItem, MkvTrack } from '../types';
import { useFileStore } from '../stores/fileStore';

const props = defineProps<{
    file: FileItem;
}>();

const fileStore = useFileStore();

// Helper to check if a track is selected (kept)
function isSelected(trackId: number) {
    return props.file.selectedTracks.includes(trackId);
}

// Toggle track selection
function toggleSelection(trackId: number) {
    const index = props.file.selectedTracks.indexOf(trackId);
    if (index === -1) {
        props.file.selectedTracks.push(trackId);
    } else {
        props.file.selectedTracks.splice(index, 1);
    }
}

// Helper to check modification state
function getModification(trackId: number) {
    return props.file.modifications.find(m => m.trackId === trackId);
}

function isDefault(track: MkvTrack) {
    const mod = getModification(track.id);
    if (mod && mod.default !== undefined) return mod.default;
    return track.properties.default_track;
}

function isForced(track: MkvTrack) {
    const mod = getModification(track.id);
    if (mod && mod.forced !== undefined) return mod.forced;
    return track.properties.forced_track;
}

function toggleDefault(track: MkvTrack) {
    const current = isDefault(track);
    let mod = getModification(track.id);
    if (!mod) {
        mod = { trackId: track.id };
        props.file.modifications.push(mod);
    }
    mod.default = !current;
}

function toggleForced(track: MkvTrack) {
    const current = isForced(track);
    let mod = getModification(track.id);
    if (!mod) {
        mod = { trackId: track.id };
        props.file.modifications.push(mod);
    }
    mod.forced = !current;
}

const tracks = computed(() => props.file.info?.tracks || []);

function getTrackIcon(type: string) {
    switch (type) {
        case 'video': return '🎬';
        case 'audio': return '🔊';
        case 'subtitles': return '💬';
        default: return '📄';
    }
}

// Preview & Diff Logic
function getRowClass(track: MkvTrack) {
    const isRemoved = !isSelected(track.id);
    const isMatchingPreview = fileStore.isTrackMatchingPreview(track);
    const previewAction = fileStore.previewCriteria.action;

    if (isRemoved) return 'bg-red-500/10 text-gray-400 line-through decoration-red-500/50';

    if (isMatchingPreview) {
        if (previewAction === 'remove') return 'bg-red-500/20 animate-pulse';
        if (previewAction === 'default') return 'bg-blue-500/20 animate-pulse';
    }

    return 'hover:bg-gray-50 dark:hover:bg-gray-800/30';
}
</script>

<template>
    <div
        class="bg-gray-50 dark:bg-gray-900/50 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 mt-2 transition-colors duration-300">
        <table class="w-full text-xs text-left">
            <thead
                class="text-[10px] text-gray-500 uppercase bg-gray-100 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
                <tr>
                    <th class="px-3 py-2 w-12 text-center">{{ $t('tracks.keep') }}</th>
                    <th class="px-3 py-2 w-10 text-center">{{ $t('tracks.type') }}</th>
                    <th class="px-3 py-2">{{ $t('tracks.info') }}</th>
                    <th class="px-3 py-2">{{ $t('tracks.language') }}</th>
                    <th class="px-3 py-2 text-right">{{ $t('tracks.tags') }}</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-gray-700/50">
                <tr v-for="track in tracks" :key="track.id" class="transition-colors duration-200"
                    :class="getRowClass(track)">
                    <!-- Keep Toggle -->
                    <td class="px-3 py-1.5 text-center">
                        <button @click="toggleSelection(track.id)"
                            class="w-4 h-4 rounded border flex items-center justify-center transition-colors"
                            :class="isSelected(track.id) ? 'bg-blue-500 border-blue-500 text-white' : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'">
                            <svg v-if="isSelected(track.id)" xmlns="http://www.w3.org/2000/svg" class="h-3 w-3"
                                viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clip-rule="evenodd" />
                            </svg>
                        </button>
                    </td>

                    <!-- Type Icon -->
                    <td class="px-3 py-1.5 text-base text-center" :title="track.type">
                        {{ getTrackIcon(track.type) }}
                    </td>

                    <!-- Track Info -->
                    <td class="px-3 py-1.5">
                        <div class="font-medium text-gray-700 dark:text-gray-300 truncate max-w-[200px]">
                            {{ track.properties.track_name || track.codec }}
                        </div>
                        <div class="text-[10px] text-gray-500">
                            ID: {{ track.id }} • {{ track.codec }}
                            <span v-if="track.properties.pixel_dimensions"> • {{ track.properties.pixel_dimensions
                                }}</span>
                        </div>
                    </td>

                    <!-- Language -->
                    <td class="px-3 py-1.5">
                        <span
                            class="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-[10px] border border-gray-200 dark:border-gray-700">
                            {{ track.language || track.properties.language || 'und' }}
                        </span>
                    </td>

                    <!-- Flags -->
                    <td class="px-3 py-1.5 text-right">
                        <div class="flex items-center justify-end gap-2">
                            <button @click="toggleDefault(track)"
                                class="px-1.5 py-0.5 rounded text-[10px] border transition-colors flex items-center gap-1"
                                :class="isDefault(track) ? 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20 hover:bg-yellow-500/20' : 'border-transparent text-gray-500 dark:text-gray-600 hover:text-gray-700 dark:hover:text-gray-400 opacity-50 hover:opacity-100'"
                                :title="$t('tracks.default')">
                                <span v-if="isDefault(track)" class="w-1.5 h-1.5 rounded-full bg-yellow-400"></span>
                                {{ $t('tracks.default') }}
                            </button>

                            <button @click="toggleForced(track)"
                                class="px-1.5 py-0.5 rounded text-[10px] border transition-colors flex items-center gap-1"
                                :class="isForced(track) ? 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20 hover:bg-red-500/20' : 'border-transparent text-gray-500 dark:text-gray-600 hover:text-gray-700 dark:hover:text-gray-400 opacity-50 hover:opacity-100'"
                                :title="$t('tracks.forced')">
                                <span v-if="isForced(track)" class="w-1.5 h-1.5 rounded-full bg-red-400"></span>
                                {{ $t('tracks.forced') }}
                            </button>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
