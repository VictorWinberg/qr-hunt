<template>
  <div>
    <div class="update-header d-flex align-center ga-2 mb-4">
      <v-btn icon="mdi-arrow-left" variant="text" @click="confirmLeave" />
      <div class="text-h5 update-header__title text-truncate">
        <span v-if="mode === QR_SPOT_MODE.CREATE">{{ t('qr-spot.create-title') }}</span>
        <span v-else>{{ qrSpot.title }}</span>
      </div>
    </div>
    <v-form class="d-flex flex-column ga-3" @submit.prevent="saveSpot">
      <v-text-field
        id="title"
        v-model="form.title"
        autocomplete="off"
        density="comfortable"
        hide-details
        :label="mode === QR_SPOT_MODE.CREATE ? t('qr-spot.create-name') : t('qr-spot.update-name')"
        variant="outlined"
      />
      <v-textarea
        id="note"
        v-model="form.note"
        autocomplete="off"
        :label="t('qr-spot.create-description')"
        rows="3"
        variant="outlined"
      />
      <v-text-field
        id="hint"
        v-model="form.hint"
        autocomplete="off"
        hide-details
        :label="mode === QR_SPOT_MODE.CREATE ? t('qr-spot.create-hint') : t('qr-spot.update-hint')"
        variant="outlined"
      />
      <v-checkbox v-model="form.missing" hide-details label="Missing?" />
      <div v-if="qrSpot.lat != null && qrSpot.lng != null" class="text-body-2">
        {{ t('qr-spot.coordinates') }}
        <br />
        <strong>{{ t('qr-spot.coordinates-lat') }}</strong>
        {{ Math.round(Number(qrSpot.lat) * 1000) / 1000 }},
        <strong>{{ t('qr-spot.coordinates-lng') }}</strong>
        {{ Math.round(Number(qrSpot.lng) * 1000) / 1000 }}
        <v-btn
          class="ml-2"
          icon="mdi-sync"
          size="small"
          variant="tonal"
          @click="qrStore.updateQrSpotLocation()"
        />
      </div>
      <div v-else class="text-body-2">
        {{ t('qr-spot.loading-coordinates') }}
        <v-img :src="spinner" alt="" class="mt-2" max-width="50" />
      </div>
      <v-btn class="text-decoration-underline text-none" variant="text" @click="replaceQRCode">
        {{ t('qr-spot.replace-qrcode') }}
      </v-btn>
      <v-btn block color="primary" :disabled="!valid" type="submit">{{ t('common.save') }}</v-btn>
      <v-btn block color="error" type="button" @click="deleteSpot">{{ t('common.delete') }}</v-btn>
    </v-form>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { computed, reactive, watch } from 'vue';
import { useI18n } from 'vue-i18n';

import spinner from '@/assets/spinner.svg?url';
import { QR_SPOT_MODE, QR_SPOT_PANEL } from '@/constants';
import useDialog from '@/store/DialogStore';
import useQrSpot from '@/store/QrSpotStore';
import useScan from '@/store/ScanStore';
import { api } from '@/utils/api';
import { emitQrSpotsUpdate } from '@/utils/app-events';

const { t } = useI18n();
const qrStore = useQrSpot();
const scanStore = useScan();
const dialog = useDialog();
const { qrSpot, mode } = storeToRefs(qrStore);

const form = reactive({
  title: '',
  note: '',
  hint: '',
  missing: false
});

watch(
  qrSpot,
  spot => {
    form.title = String(spot.title ?? '');
    form.note = String(spot.note ?? '');
    form.hint = String(spot.hint ?? '');
    form.missing = Boolean(spot.missing);
  },
  { immediate: true, deep: true }
);

const valid = computed(() => {
  const { lat, lng } = qrSpot.value;
  return Boolean(form.title && lat != null && lng != null);
});

function confirmLeave(): void {
  dialog.setDialog({
    title: 'Are you sure?',
    subtitle: 'All unsaved changes will be lost.',
    options: [
      {
        name: 'Cancel',
        type: 'disabled',
        action: async () => dialog.close()
      },
      {
        name: 'Yes',
        type: 'success',
        action: async () => {
          dialog.close();
          qrStore.setMode(QR_SPOT_MODE.VIEW);
        }
      }
    ]
  });
}

async function saveSpot(): Promise<void> {
  if (mode.value === QR_SPOT_MODE.CREATE) {
    await qrStore.create({ ...form });
  } else if (mode.value === QR_SPOT_MODE.EDIT) {
    await qrStore.edit({ ...form });
  }
}

function deleteSpot(): void {
  dialog.setDialog({
    title: 'Delete QR Spot',
    subtitle: 'Are you sure you want to delete your QR Spot?',
    options: [
      {
        name: 'Cancel',
        type: 'disabled',
        action: async () => dialog.close()
      },
      {
        name: 'Delete',
        type: 'danger',
        action: async () => {
          dialog.close();
          const id = qrSpot.value.id;
          if (!id) return;
          const res = await api.delete('/api/qrspots/' + id);
          if (res.err) return;
          qrStore.setMode(QR_SPOT_MODE.VIEW);
          qrStore.setModalState(QR_SPOT_PANEL.HIDE);
          emitQrSpotsUpdate();
        }
      }
    ]
  });
}

function replaceQRCode(): void {
  qrStore.setMode(QR_SPOT_MODE.REPLACE_CODE);
  scanStore.toggleScan();
}
</script>

<style scoped lang="scss">
/* Let title truncate beside the back button in a flex row */
.update-header__title {
  flex: 1 1 auto;
  min-width: 0;
}
</style>
