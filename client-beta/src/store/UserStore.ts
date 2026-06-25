import { defineStore } from 'pinia';
import { ref, type Ref } from 'vue';

import type { LeaderboardRow, UserProfile } from '@/interfaces/User';

import { api } from '@/utils/api';
import { emitAuthChange } from '@/utils/app-events';

function readStoredCoords(): { lat: number; lng: number } | null {
  try {
    const raw = localStorage.getItem('userCoords');
    return raw ? (JSON.parse(raw) as { lat: number; lng: number }) : null;
  } catch {
    return null;
  }
}

export default defineStore('user', () => {
  const user: Ref<UserProfile> = ref({});
  const coords: Ref<{ lat: number; lng: number } | null> = ref(readStoredCoords());
  const isAuthenticated = ref(false);
  const status = ref<'pending' | 'success' | 'unauthenticated'>('pending');
  const leaderboard: Ref<LeaderboardRow[] | null> = ref(null);

  function setAuth(authPayload: UserProfile & { isAuthenticated?: boolean }): void {
    const { isAuthenticated: auth = false, ...rest } = authPayload;
    if (auth) {
      isAuthenticated.value = true;
      status.value = 'success';
      user.value = rest;
    } else {
      isAuthenticated.value = false;
      status.value = 'unauthenticated';
      user.value = {};
    }
    emitAuthChange();
  }

  function setCoords({ latitude, longitude }: GeolocationCoordinates): void {
    const next = { lat: latitude, lng: longitude };
    coords.value = next;
    localStorage.setItem('userCoords', JSON.stringify(next));
  }

  function setLeaderboard(rows: LeaderboardRow[] | null): void {
    leaderboard.value = rows;
  }

  async function refreshSession(): Promise<void> {
    const userRes = await api.get('/api/user');
    if (userRes.err) return;
    setAuth(userRes.data as UserProfile & { isAuthenticated?: boolean });
  }

  return {
    user,
    coords,
    isAuthenticated,
    status,
    leaderboard,
    setAuth,
    setCoords,
    setLeaderboard,
    refreshSession
  };
});
