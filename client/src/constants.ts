export const QR_SPOT_PANEL = {
  HIDE: "HIDE",
  SHOW_INFO: "SHOW_INFO",
  SHOW_DETAILS: "SHOW_DETAILS"
};

export const QR_SPOT_MODE = {
  VIEW: "VIEW",
  EDIT: "EDIT",
  CREATE: "CREATE",
  REPLACE_CODE: "REPLACE_CODE"
};

export const EVENT_TYPE = {
  QR_SPOTS_UPDATE: "QR_SPOTS_UPDATE",
  API_REQUEST_UPDATE: "API_REQUEST_UPDATE",
  AUTH_CHANGE: "AUTH_CHANGE"
};

/** Mirrors server/src/user/user-route.js MAX_COLLECT_DISTANCE */
export const MAX_COLLECT_DISTANCE = 10000;

export const ROUTE_PLAN_MODE = {
  COUNT: "count",
  TIME: "time"
} as const;
