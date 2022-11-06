import { EVENT_TYPE } from "@/constants";
import Vue from "vue";
import VueI18n, { LocaleMessages } from "vue-i18n";
import EventBus from "./event-bus";

Vue.use(VueI18n);

function loadLocaleMessages(): LocaleMessages {
  const locales = require.context(
    "../locales",
    true,
    /[A-Za-z0-9-_,\s]+\.json$/i
  );
  const messages: LocaleMessages = {};
  locales.keys().forEach(key => {
    const matched = key.match(/([A-Za-z0-9-_]+)\./i);
    if (matched && matched.length > 1) {
      const locale = matched[1];
      messages[locale] = locales(key);
    }
  });
  return messages;
}

const i18n = new VueI18n({
  locale: navigator.language.split("-")[0],
  fallbackLocale: "en",
  messages: loadLocaleMessages()
});

EventBus.$on(EVENT_TYPE.AUTH_CHANGE, ({ isAuthenticated, locale }) => {
  if (isAuthenticated && locale) {
    i18n.locale = locale;
  }
});

export default i18n;
