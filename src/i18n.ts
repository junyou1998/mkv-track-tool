import { createI18n } from 'vue-i18n';
import en from './locales/en.json';
import zhTW from './locales/zh-TW.json';
import zhCN from './locales/zh-CN.json';
import ja from './locales/ja.json';

const messages = {
  'en': en,
  'zh-TW': zhTW,
  'zh-CN': zhCN,
  'ja': ja
};

// Auto detect language
function getBrowserLocale() {
  const storedLocale = localStorage.getItem('user-locale');
  if (storedLocale && Object.keys(messages).includes(storedLocale)) {
    return storedLocale;
  }

  const navigatorLocale = navigator.language;
  
  if (navigatorLocale.startsWith('zh')) {
    // Distinguish between Traditional and Simplified
    if (navigatorLocale === 'zh-TW' || navigatorLocale === 'zh-HK') {
      return 'zh-TW';
    }
    return 'zh-CN';
  }
  
  if (navigatorLocale.startsWith('ja')) {
    return 'ja';
  }

  return 'en';
}

const i18n = createI18n({
  legacy: false, // Use Composition API
  locale: getBrowserLocale(),
  fallbackLocale: 'en',
  globalInjection: true,
  messages,
});

export default i18n;

export const availableLocales = [
  { code: 'zh-TW', name: '繁體中文' },
  { code: 'zh-CN', name: '简体中文' },
  { code: 'en', name: 'English' },
  { code: 'ja', name: '日本語' }
];

export function setLocale(locale: string) {
  if (Object.keys(messages).includes(locale)) {
    // @ts-ignore
    i18n.global.locale.value = locale;
    localStorage.setItem('user-locale', locale);
    document.querySelector('html')?.setAttribute('lang', locale);
  }
}
