import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import relativeTime from "dayjs/plugin/relativeTime";
import { total } from "./dayjs-custom";

dayjs.extend(isoWeek);
dayjs.extend(relativeTime);
dayjs.extend(total);

dayjs.Ls.en.weekStart = 1;

export default dayjs;
