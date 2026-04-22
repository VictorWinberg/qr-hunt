import { createI18n } from 'vue-i18n';

import en from '@/locales/en.json';
import es from '@/locales/es.json';
import { languages } from '@/locales/languages';
import sv from '@/locales/sv.json';
import { loadDayjsLocale } from '@/plugins/dayjs';
import useUser from '@/store/UserStore';
import { onAuthChange } from '@/utils/app-events';

const browserLocale = navigator.language.split('-')[0] ?? 'en';
const initialLocale = (languages as readonly string[]).includes(browserLocale)
  ? browserLocale
  : 'en';

export const i18n = createI18n({
  legacy: false,
  locale: initialLocale,
  fallbackLocale: 'en',
  messages: { en, sv, es }
});

loadDayjsLocale(initialLocale);

function syncLocaleFromUser(): void {
  const user = useUser();
  if (user.isAuthenticated && user.user.locale) {
    (i18n.global.locale as { value: string }).value = String(user.user.locale);
  }
}

function syncDayjsWithI18n(): void {
  syncLocaleFromUser();
  loadDayjsLocale((i18n.global.locale as { value: string }).value);
}

onAuthChange(syncDayjsWithI18n);

export { languages };
