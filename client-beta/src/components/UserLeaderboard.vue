<template>
  <div>
    <div class="leaderboard__head">
      <h2 class="text-h6 text-center leaderboard__head-title">{{ t('leaderboard.title') }}</h2>
      <div class="leaderboard__nav">
        <v-btn
          class="leaderboard__period text-subtitle-1 text-none mx-auto d-block"
          color="on-surface"
          density="compact"
          variant="text"
          @click="togglePeriod"
        >
          <span v-if="period === 'total'">{{ t('leaderboard.total') }}</span>
          <span v-else-if="period === 'month'">
            {{ monthNames[month - 1] }} {{ date.format('YYYY') }}
          </span>
          <span v-else>{{ date.format('YYYY') }}</span>
        </v-btn>
        <v-btn
          class="nav-btn nav-btn--left"
          color="on-surface"
          density="compact"
          :disabled="first"
          icon="mdi-chevron-left"
          variant="text"
          @click="nav(-1)"
        />
        <v-btn
          class="nav-btn nav-btn--right"
          color="on-surface"
          density="compact"
          :disabled="last"
          icon="mdi-chevron-right"
          variant="text"
          @click="nav(1)"
        />
      </div>
    </div>
    <v-table
      v-if="leaderboard === null"
      density="comfortable"
      class="leaderboard__table leaderboard__table--skeleton"
      aria-busy="true"
    >
      <thead>
        <tr>
          <th>{{ t('leaderboard.table-rank') }}</th>
          <th />
          <th>{{ t('leaderboard.table-user') }}</th>
          <th class="text-end">{{ t('leaderboard.table-distance') }}</th>
          <th class="text-end">{{ t('leaderboard.table-score') }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="n in 2" :key="`leaderboard-skeleton-${n}`">
          <td>
            <v-skeleton-loader boilerplate type="text" width="1.75rem" class="d-inline-block" />
          </td>
          <td style="width: 0; padding: 0 8px 0 0">
            <v-skeleton-loader boilerplate type="avatar" width="32" height="32" />
          </td>
          <td>
            <v-skeleton-loader boilerplate type="text" max-width="220" class="leaderboard__sk-name" />
          </td>
          <td class="text-end">
            <v-skeleton-loader
              boilerplate
              type="text"
              width="2.75rem"
              class="d-inline-block leaderboard__sk-end"
            />
          </td>
          <td class="text-end">
            <v-skeleton-loader
              boilerplate
              type="text"
              width="2.25rem"
              class="d-inline-block leaderboard__sk-end"
            />
          </td>
        </tr>
      </tbody>
    </v-table>
    <v-table
      v-else-if="leaderboard && leaderboard.length"
      density="comfortable"
      class="leaderboard__table"
    >
      <thead>
        <tr>
          <th>{{ t('leaderboard.table-rank') }}</th>
          <th />
          <th>{{ t('leaderboard.table-user') }}</th>
          <th class="text-end">{{ t('leaderboard.table-distance') }}</th>
          <th class="text-end">{{ t('leaderboard.table-score') }}</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="row in leaderboard"
          :key="row.id"
          class="cursor-pointer"
          role="link"
          @click="goUser(row.id)"
        >
          <td>{{ row.rank }}</td>
          <td style="width: 0; padding: 0 8px 0 0">
            <v-avatar size="32" :image="row.photo" />
          </td>
          <td>{{ row.name || row.username }}</td>
          <td class="text-end">{{ (row.dist / 1000).toFixed(1) }}</td>
          <td class="text-end">{{ row.score }}</td>
        </tr>
      </tbody>
    </v-table>
    <h4 v-else class="text-body-1">{{ emptyText }}</h4>
  </div>
</template>

<script lang="ts" setup>
import { useUser } from '@/store';
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

import type { LeaderboardRow } from '@/interfaces/User';

import dayjs from '@/plugins/dayjs';
import { api } from '@/utils/api';
import { onApiMutation } from '@/utils/app-events';

const { t, tm } = useI18n();
const router = useRouter();
const userStore = useUser();

const date = ref(dayjs().startOf('month'));
const period = ref<'month' | 'year' | 'total'>('month');

const monthNames = tm('common.month-names') as string[];

const month = computed(() => Number(date.value.format('M')));

const first = computed(() => date.value.subtract(1, period.value as never).isBefore('2021'));
const last = computed(() => date.value.add(1, period.value as never).isAfter(dayjs()));

const leaderboard = computed(() => userStore.leaderboard);

const emptyTexts = computed(() => tm('leaderboard.empty-alternative-texts') as string[]);

const emptyText = computed(() => {
  const texts = emptyTexts.value;
  return texts[Math.floor(Math.random() * texts.length)] ?? '';
});

let offApi: (() => void) | undefined;

async function fetchLeaderboard(): Promise<void> {
  const from = date.value.format('YYYY-MM-DD');
  const to = date.value.add(1, period.value as never).format('YYYY-MM-DD');
  const res = await api.get(`/api/leaderboard/${from}/${to}`);
  if (!res.err) userStore.setLeaderboard(res.data as LeaderboardRow[]);
}

function nav(dir: number): void {
  userStore.setLeaderboard(null);
  date.value = date.value.add(dir, period.value as never);
  void fetchLeaderboard();
}

function togglePeriod(): void {
  userStore.setLeaderboard(null);
  const next: Record<string, 'month' | 'year' | 'total'> = {
    month: 'year',
    year: 'total',
    total: 'month'
  };
  period.value = next[period.value];
  date.value = dayjs().startOf(period.value as never);
  void fetchLeaderboard();
}

function goUser(id: number): void {
  void router.push(`/users/${id}`);
}

onMounted(() => {
  void fetchLeaderboard();
  offApi = onApiMutation(fetchLeaderboard);
});

onUnmounted(() => {
  offApi?.();
});
</script>

<style scoped lang="scss">
.leaderboard__head {
  margin-bottom: 0.75rem;
}

.leaderboard__head-title {
  margin-bottom: 0.125rem;
  line-height: 1.3;
}

.leaderboard__nav {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 2.25rem;
}

.leaderboard__period {
  min-width: 0;
}

.nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);

  &--left {
    left: 0;
  }

  &--right {
    right: 0;
  }
}

.cursor-pointer {
  cursor: pointer;
}

.leaderboard__table {
  max-width: 800px;
  margin: auto;
}

.leaderboard__table--skeleton :deep(.v-skeleton-loader) {
  margin: 0;
}

.leaderboard__sk-name {
  max-width: 220px;
}

.leaderboard__sk-end {
  margin-inline-start: auto;
}
</style>
