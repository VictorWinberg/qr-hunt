const { haveCalled } = require("../utils");

module.exports = {
  USER_HAS_SIGNED_UP: ({ req, res }) => {
    return haveCalled(req, res)("/auth/google/callback", "GET", 302);
  },
  THANKFUL: ({ req, res }) => {
    return haveCalled(req, res)("/api/achievements/thankful", "POST", 204);
  },
  FOUND_BUG: ({ err }) => {
    return Boolean(err);
  },
  FIRST_QRSPOT_FOUND: ({ req, res }) => {
    return [haveCalled(req, res)("/api/scan/:id"), (res.body || {}).qrspot];
  },
  QR_CODE_NOT_FOUND: ({ req, res }) => {
    return [haveCalled(req, res)("/api/scan/:id"), !(res.body || {}).qrcode];
  },
  FIRST_QRSPOT_CREATED: ({ req, res }) => {
    return haveCalled(req, res)("/api/qrspots", "POST");
  },
  COLLECT_THREE_IN_DAY: () => {
    return false;
  },
  COLLECT_MANY_IN_DAY: () => {
    return false;
  },
  COLLECT_AT_LEET: ({ req, res }) => {
    const date = new Date();
    return [
      haveCalled(req, res)("/api/qrshards", "POST"),
      date.getHours() == 13 && date.getMinutes() == 37
    ];
  },
  COLLECT_AT_MORNING: ({ req, res }) => {
    const hours = new Date().getHours();
    return [
      haveCalled(req, res)("/api/qrshards", "POST"),
      hours >= 5 && hours < 8
    ];
  },
  COLLECT_AT_LUNCH: ({ req, res }) => {
    const hours = new Date().getHours();
    return [
      haveCalled(req, res)("/api/qrshards", "POST"),
      hours >= 12 && hours < 13
    ];
  },
  COLLECT_AT_NIGHT: ({ req, res }) => {
    const hours = new Date().getHours();
    return [
      haveCalled(req, res)("/api/qrshards", "POST"),
      hours >= 22 || hours < 5
    ];
  },
  MAX_STREAK: ({ req, res, db }) => {
    const { id, streak, max_streak } = req.user;

    if (
      streak >= 3 &&
      streak > max_streak &&
      haveCalled(req, res)("/api/user", "GET")
    ) {
      const User = require("../user/user-model")(db);
      User.update(id, { max_streak: streak }).catch(console.error);
      return true;
    }
    return false;
  },
  LEVEL_UP: async ({ req, res, db }) => {
    if (!haveCalled(req, res)("/api/user", "GET")) return false;

    const { user } = req;
    const Achievement = require("./achievement-model")(db);

    const response = await Achievement.getByName(user.id, "LEVEL_UP");
    const { achievement, err } = response;
    if (err) return false;

    return (user.lvl > 0 && !achievement) || user.lvl > achievement.count;
  },
  FIRST_RECOLLECT: () => {
    return false;
  },
  FIRST_HINT_USED: () => {
    return false;
  }
};
