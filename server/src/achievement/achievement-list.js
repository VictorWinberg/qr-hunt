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
  FIRST_RECOLLECT: () => {
    return false;
  },
  FIRST_HINT_USED: () => {
    return false;
  }
};
