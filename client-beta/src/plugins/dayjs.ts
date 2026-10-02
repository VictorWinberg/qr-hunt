import dayjs, { type ConfigType } from 'dayjs';
import 'dayjs/locale/en';
import 'dayjs/locale/es';
import 'dayjs/locale/sv';
import isoWeek from 'dayjs/plugin/isoWeek';
import relativeTime from 'dayjs/plugin/relativeTime';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

import { totalPlugin } from '@/plugins/dayjs-total';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isoWeek);
dayjs.extend(relativeTime);
dayjs.extend(totalPlugin);

export const TZ = 'Europe/Stockholm';

export function parse(date: ConfigType) {
  return dayjs(date).tz(TZ);
}

export function now() {
  return dayjs().tz(TZ);
}

if (dayjs.Ls?.en) {
  dayjs.Ls.en.weekStart = 1;
}

const allowedLocales = ['en', 'sv', 'es'] as const;

/** Keep relative-time phrases aligned with vue-i18n (e.g. `fromNow()` in QRSpotView). */
export function loadDayjsLocale(locale: string): void {
  const lc = (allowedLocales as readonly string[]).includes(locale) ? locale : 'en';
  dayjs.locale(lc);
}

export default dayjs;
