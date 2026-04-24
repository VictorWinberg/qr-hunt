<template>
  <v-dialog
    :model-value="open"
    class="dialog-root"
    max-width="520"
    scrollable
    @update:model-value="onUpdate"
  >
    <v-card v-if="cardPayload" class="position-relative">
      <v-btn class="dialog-close" icon="mdi-close" variant="text" @click="close" />
      <v-card-title class="text-h5 pr-10">{{ cardPayload.title }}</v-card-title>
      <v-card-text>
        <!-- eslint-disable-next-line vue/no-v-html -->
        <div class="dialog-subtitle" v-html="cardPayload.subtitle" />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          v-for="(opt, idx) in cardPayload.options"
          :key="idx"
          :color="btnColor(opt.type)"
          :disabled="opt.type === 'disabled' && !opt.action"
          :variant="opt.type === 'disabled' ? 'text' : 'flat'"
          @click="runOption(opt)"
        >
          {{ opt.name }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { computed } from 'vue';

import type { DialogOption } from '@/interfaces/Dialog';

import useDialog from '@/store/DialogStore';

const dialog = useDialog();
const { payload } = storeToRefs(dialog);

const open = computed(() => payload.value !== false);

const cardPayload = computed(() =>
  typeof payload.value === 'object' && payload.value !== null ? payload.value : null
);

function close(): void {
  dialog.close();
}

function onUpdate(v: boolean): void {
  if (!v) close();
}

function btnColor(type: string): string | undefined {
  if (type === 'success') return 'success';
  if (type === 'danger') return 'error';
  return undefined;
}

async function runOption(opt: DialogOption): Promise<void> {
  if (opt.action) await opt.action();
}
</script>

<style scoped lang="scss">
.dialog-close {
  position: absolute;
  top: 4px;
  right: 4px;
  z-index: 1;
}

.dialog-subtitle {
  word-break: break-word;
}
</style>
