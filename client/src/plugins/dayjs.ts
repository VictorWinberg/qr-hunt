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

const allowedLocales = ["en", "se", "es"];
const loadDayjsLocale = locale => {
  if (allowedLocales.includes(locale)) {
    import(`dayjs/locale/${locale}`).then(() => { dayjs.locale(locale) })
  } else {
    dayjs.locale("en");
  }
};

loadDayjsLocale(i18n.locale);
EventBus.$on(EVENT_TYPE.AUTH_CHANGE, ({ locale }) => {
  if (locale) loadDayjsLocale(locale);
});

export default dayjs;
