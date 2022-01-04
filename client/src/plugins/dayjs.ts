import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
dayjs.extend(isoWeek);

dayjs.Ls.en.weekStart = 1;

export default dayjs;
