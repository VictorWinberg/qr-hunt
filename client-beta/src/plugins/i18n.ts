import { createI18n } from 'vue-i18n';

import en from '@/locales/en.json';
import { languages } from '@/locales/languages';
import sv from '@/locales/sv.json';
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
  messages: { en, sv }
});

function syncLocaleFromUser(): void {
  const user = useUser();
  if (user.isAuthenticated && user.user.locale) {
    (i18n.global.locale as { value: string }).value = String(user.user.locale);
  }
}

onAuthChange(syncLocaleFromUser);

export { languages };
