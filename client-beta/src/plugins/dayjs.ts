import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';

import { totalPlugin } from '@/plugins/dayjs-total';

dayjs.extend(isoWeek);
dayjs.extend(totalPlugin);

if (dayjs.Ls?.en) {
  dayjs.Ls.en.weekStart = 1;
}

export default dayjs;
