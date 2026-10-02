const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone");
const isBetween = require("dayjs/plugin/isBetween");

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isBetween);

const TZ = "Europe/Stockholm";

function parse(date) {
  return dayjs(date).tz(TZ);
}

function now() {
  return dayjs().tz(TZ);
}

module.exports = { dayjs, TZ, parse, now };
