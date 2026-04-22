export const QR_SPOT_PANEL = {
  HIDE: 'HIDE',
  SHOW_INFO: 'SHOW_INFO',
  SHOW_DETAILS: 'SHOW_DETAILS'
} as const;

export type QrSpotPanel = (typeof QR_SPOT_PANEL)[keyof typeof QR_SPOT_PANEL];

export const QR_SPOT_MODE = {
  VIEW: 'VIEW',
  EDIT: 'EDIT',
  CREATE: 'CREATE',
  REPLACE_CODE: 'REPLACE_CODE'
} as const;

export type QrSpotMode = (typeof QR_SPOT_MODE)[keyof typeof QR_SPOT_MODE];
