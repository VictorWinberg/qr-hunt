import dayjs from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear";
dayjs.extend(weekOfYear);

dayjs.Ls.en.weekStart = 1;

export default dayjs;
