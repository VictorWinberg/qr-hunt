<template>
  <div>
    <h2 class="text-h6 mb-4">{{ t('achievements.title') }}</h2>
    <div class="user-achievements">
      <achievements-card
        v-for="a in achievements"
        :key="a.name"
        :name="a.name"
        :title="a.title"
        :icon="a.icon"
        :count="a.count"
        class="user-achievements__card"
        @click="selectAchievement(a)"
      />
    </div>
    <teleport to="body">
      <achievements-card
        v-if="selectedAchievement"
        :name="selectedAchievement.name"
        :title="selectedAchievement.title"
        :icon="selectedAchievement.icon"
        :count="selectedAchievement.count"
        class="user-achievements__card user-achievements__card--selected"
        overlay
        @click="selectAchievement(null)"
      />
    </teleport>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';

import AchievementsCard from '@/components/AchievementsCard.vue';
import { api } from '@/utils/api';
import { onApiMutation } from '@/utils/app-events';

const { t } = useI18n();
const route = useRoute();

interface Achievement {
  name: string;
  title?: string;
  icon?: string;
  count: number;
}

const achievements = ref<Achievement[]>([]);
const selectedAchievement = ref<Achievement | null>(null);

let offApi: (() => void) | undefined;

async function fetchAchievements(): Promise<void> {
  const id = route.params.id;
  const res =
    typeof id === 'string' && id
      ? await api.get('/api/user_achievements/' + id)
      : await api.get('/api/achievements');
  if (res.err) return;
  achievements.value = res.data as Achievement[];
}

function selectAchievement(a: Achievement | null): void {
  if (a && selectedAchievement.value?.name === a.name) {
    selectedAchievement.value = null;
  } else {
    selectedAchievement.value = a;
  }
}

watch(() => route.params.id, fetchAchievements);

onMounted(() => {
  void fetchAchievements();
  offApi = onApiMutation(fetchAchievements);
});

onUnmounted(() => {
  offApi?.();
});
</script>

<style scoped lang="scss">
.user-achievements {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, max-content));
  grid-gap: 0.5rem;
  justify-content: center;
}

.user-achievements__card {
  position: relative;
  display: flex;
  justify-content: center;
  width: 100px;
}

.user-achievements__card--selected {
  position: fixed;
  top: 50%;
  left: 50%;
  z-index: 3000;
  margin: 0;
  transform: translate(-50%, -50%) scale(2.5);
}
</style>
