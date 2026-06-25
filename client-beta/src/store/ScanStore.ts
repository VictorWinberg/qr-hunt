import { defineStore } from 'pinia';
import { ref } from 'vue';

import { QR_SPOT_PANEL } from '@/constants';
import useDialog from '@/store/DialogStore';
import useGlobal from '@/store/GlobalStore';
import useQrSpot from '@/store/QrSpotStore';
import { api } from '@/utils/api';
import { emitQrSpotsUpdate } from '@/utils/app-events';

export default defineStore('scan', () => {
  const scanning = ref(false);

  function toggleScan(): void {
    scanning.value = !scanning.value;
  }

  function stopScan(): void {
    scanning.value = false;
  }

  async function handleQR(qrcode: string | null): Promise<void> {
    if (!qrcode) {
      useGlobal().setMessage('Warn: QR Code not caught on camera');
      return;
    }

    const scanUrl = '/api/scan/' + encodeURIComponent(qrcode);
    const { data, err } = await api.get(scanUrl);
    if (err) return;
    const scanData = data as {
      qrcode?: string;
      qrspot?: Record<string, unknown>;
      collectable?: boolean;
    };

    if (!scanData.qrcode) {
      useGlobal().setMessage('Error: 404 - Not found (QR Code)');
      return;
    }

    const qrSpotStore = useQrSpot();
    const dialog = useDialog();

    if (!scanData.qrspot) {
      await qrSpotStore.prompt({ qrcode });
      return;
    }

    qrSpotStore.select(scanData.qrspot as never);

    if (scanData.collectable) {
      dialog.setDialog({
        title: 'Collect QR',
        subtitle: 'Do you want to collect this QR Shard?',
        options: [
          {
            name: 'Collect',
            type: 'success',
            action: async () => {
              const coordsRaw = localStorage.getItem('userCoords');
              const { err: postErr } = await api.post('/api/qrshards', {
                body: JSON.stringify({
                  qrspotId: (scanData.qrspot as { id: number }).id,
                  userCoords: coordsRaw ? JSON.parse(coordsRaw) : null
                })
              });

              if (postErr) return;
              emitQrSpotsUpdate();
              dialog.close();
              qrSpotStore.setModalState(QR_SPOT_PANEL.SHOW_DETAILS);
            }
          }
        ]
      });
      return;
    }

    dialog.setDialog({
      title: 'Collect QR',
      subtitle: 'QR Code is already collected for today',
      options: [{ name: 'Collect', type: 'disabled' }]
    });
  }

  return { scanning, toggleScan, stopScan, handleQR };
});
