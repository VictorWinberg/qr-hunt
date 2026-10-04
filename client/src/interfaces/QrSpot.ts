export interface QrSpotRecord {
  id?: number;
  lat?: number;
  lng?: number;
  title?: string;
  note?: string;
  hint?: string;
  missing?: boolean;
  qrcode?: string;
  collectedAt?: string | null;
  lastVisitedAt?: string | null;
  isOwner?: boolean;
  [key: string]: unknown;
}
