import { ref, onMounted } from 'vue';

type Theme = 'light' | 'dark' | 'system';

const theme = ref<Theme>('system');

export function useTheme() {
  function applyTheme() {
    const root = document.documentElement;
    const isDark =
      theme.value === 'dark' ||
      (theme.value === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }

  function setTheme(newTheme: Theme) {
    theme.value = newTheme;
    localStorage.setItem('theme', newTheme);
    applyTheme();
  }

  onMounted(() => {
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme) {
      theme.value = savedTheme;
    }
    applyTheme();

    // Listen for system changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      if (theme.value === 'system') {
        applyTheme();
      }
    });
  });

  return {
    theme,
    setTheme
  };
}
