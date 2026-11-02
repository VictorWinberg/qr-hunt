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

export const MAX_COLLECT_DISTANCE = 10000;

export const ROUTE_PLAN_MODE = {
  COUNT: "count",
  TIME: "time"
} as const;

export const ROUTE_PLAN_COUNT = {
  min: 1,
  max: 20,
  step: 1,
  default: 5
} as const;

export const ROUTE_PLAN_TIME = {
  min: 15,
  max: 120,
  step: 15,
  default: 45
} as const;
