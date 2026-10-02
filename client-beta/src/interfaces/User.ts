export interface UserProfile {
  id?: number;
  name?: string;
  email?: string;
  photo?: string;
  lvl?: number | null;
  lvlXp?: number | null;
  reqLvlXp?: number | null;
  maxStreak?: number;
  streak?: number;
  isAdmin?: boolean;
  isOwner?: boolean;
  locale?: string | null;
  [key: string]: unknown;
}

export interface LeaderboardRow {
  id: number;
  rank: number;
  name?: string;
  username?: string;
  photo?: string;
  dist: number;
  score: number;
}
