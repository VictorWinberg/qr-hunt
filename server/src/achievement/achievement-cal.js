const { google } = require("googleapis");
const fs = require("fs");
const path = require("path");
const dayjs = require("dayjs");
const isBetween = require("dayjs/plugin/isBetween");
const NodeCache = require("node-cache");

const ACHIEVEMENT_EVENTS = require("./achievement-cal.json");
const cache = new NodeCache({ stdTTL: 60 * 60 * 24 * 7 }); // cache one week
dayjs.extend(isBetween);

const calendarIds = [
  "sv.swedish#holiday@group.v.calendar.google.com",
  "lsjl8fapajvr46qjf31mc1llc4@group.calendar.google.com"
];

const hasCredentials = async filePath => {
  return await new Promise(resolve => {
    fs.access(filePath, fs.constants.F_OK, error => {
      resolve(!error);
    });
  });
};

const calendarEvents = async () => {
  if (cache.has("calendarEvents")) {
    return cache.get("calendarEvents");
  }

  const filePath = path.join(__dirname, "../../../credentials.json");

  if (!(await hasCredentials(filePath))) {
    console.error("Error: Credentials file not found");
    cache.set("calendarEvents", [], 60 * 60);
    return [];
  }

  const auth = new google.auth.GoogleAuth({
    keyFile: filePath,
    scopes: ["https://www.googleapis.com/auth/calendar.events"]
  });

  const calendar = google.calendar({ version: "v3", auth });

  const items = await Promise.all(
    calendarIds.map(async calendarId => {
      const { data } = await calendar.events.list({
        calendarId,
        timeMin: dayjs().toISOString(),
        timeMax: dayjs()
          .add(1, "year")
          .toISOString(),
        singleEvents: true
      });

      return data.items;
    })
  );

  const events = items.flat().map(({ summary, start, end }) => ({
    summary,
    start,
    end
  }));
  cache.set("calendarEvents", events);
  return events;
};

module.exports = async date => {
  const events = await calendarEvents();

  const event = events.find(({ start, end }) =>
    date.isBetween(start.date, end.date, "day", "[)")
  );
  if (!event) return;

  return ACHIEVEMENT_EVENTS[event.summary];
};
