import { defineStore } from 'pinia';
import { ref, type Ref } from 'vue';

import type { DialogPayload } from '@/interfaces/Dialog';

export default defineStore('dialog', () => {
  const payload: Ref<DialogPayload | false> = ref(false);

  function setDialog(value: DialogPayload | false): void {
    payload.value = value;
  }

  function close(): void {
    payload.value = false;
  }

  return { payload, setDialog, close };
});
