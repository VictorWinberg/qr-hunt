import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import relativeTime from "dayjs/plugin/relativeTime";
import { total } from "./dayjs-custom";

import { EVENT_TYPE } from "@/constants";
import i18n from "@/plugins/i18n";
import EventBus from "./event-bus";

dayjs.extend(isoWeek);
dayjs.extend(relativeTime);
dayjs.extend(total);

dayjs.Ls.en.weekStart = 1;

const allowedLocales = ["en", "sv", "es"];
const loadDayjsLocale = async (locale) => {
  if (!allowedLocales.includes(locale)) {
    dayjs.locale('en'); // Always set fallback immediately if not allowed
    return;
  }

  switch (locale) {
    case 'en':
      await import(/* webpackInclude: /(en)\.js$/ */ 'dayjs/locale/en');
      break;
    case 'sv':
      await import(/* webpackInclude: /(sv)\.js$/ */ 'dayjs/locale/sv');
      break;
    case 'es':
      await import(/* webpackInclude: /(es)\.js$/ */ 'dayjs/locale/es');
      break;
    default:
      locale = 'en'; // Force fallback if somehow an unexpected "allowed" locale is requested
      break;
  }

  dayjs.locale(locale);
};

loadDayjsLocale(i18n.locale);
EventBus.$on(EVENT_TYPE.AUTH_CHANGE, ({ locale }) => {
  if (locale) loadDayjsLocale(locale);
});

export default dayjs;
