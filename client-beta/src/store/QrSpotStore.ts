import { defineStore } from 'pinia';
import { ref, type Ref } from 'vue';

import type { QrSpotRecord } from '@/interfaces/QrSpot';

import { QR_SPOT_MODE, QR_SPOT_PANEL, type QrSpotMode, type QrSpotPanel } from '@/constants';
import useDialog from '@/store/DialogStore';
import useGlobal from '@/store/GlobalStore';
import { api } from '@/utils/api';
import { emitQrSpotsUpdate } from '@/utils/app-events';

export default defineStore('qrSpot', () => {
  const map: Ref<google.maps.Map | null> = ref(null);
  const qrSpot: Ref<QrSpotRecord> = ref({});
  const mode: Ref<QrSpotMode> = ref(QR_SPOT_MODE.VIEW);
  const panel: Ref<QrSpotPanel> = ref(QR_SPOT_PANEL.HIDE);

  function setMap(value: google.maps.Map | null): void {
    map.value = value;
  }

  function setQRSpot(value: QrSpotRecord): void {
    qrSpot.value = value;
  }

  function setMode(value: QrSpotMode): void {
    mode.value = value;
  }

  function setModalState(value: QrSpotPanel): void {
    panel.value = value;
  }

  const dialogStore = useDialog();

  async function prompt({ qrcode }: { qrcode: string }): Promise<void> {
    if (mode.value === QR_SPOT_MODE.REPLACE_CODE) {
      dialogStore.setDialog({
        title: 'Replace QR Code',
        subtitle: 'Do you want to replace a QR Code?',
        options: [
          {
            name: 'Replace',
            type: 'success',
            action: async () => {
              dialogStore.close();
              setMode(QR_SPOT_MODE.EDIT);
              await edit({ qrcode });
            }
          }
        ]
      });
      return;
    }

    setQRSpot({ qrcode });
    dialogStore.setDialog({
      title: 'New QR Spot',
      subtitle: 'Do you want to create a QR Spot?',
      options: [
        {
          name: 'Create',
          type: 'success',
          action: async () => {
            dialogStore.close();
            setMode(QR_SPOT_MODE.CREATE);
            setModalState(QR_SPOT_PANEL.SHOW_DETAILS);
            updateQrSpotLocation();
          }
        }
      ]
    });
  }

  function select(qrspot: QrSpotRecord): void {
    const m = map.value;
    if (!m) return;
    m.panTo(new google.maps.LatLng(Number(qrspot.lat), Number(qrspot.lng)));
    if (panel.value !== QR_SPOT_PANEL.SHOW_INFO) {
      m.setZoom(m.getZoom()! + 2);
      m.setTilt(45);
    }
    setQRSpot(qrspot);
    setModalState(QR_SPOT_PANEL.SHOW_INFO);
  }

  function deselect(): void {
    const m = map.value;
    if (panel.value !== QR_SPOT_PANEL.HIDE && m) {
      m.setZoom(m.getZoom()! - 2);
      m.setTilt(0);
    }
    setModalState(QR_SPOT_PANEL.HIDE);
    setMode(QR_SPOT_MODE.VIEW);
  }

  async function create(payload: Partial<QrSpotRecord>): Promise<void> {
    const { data, err } = await api.post('/api/qrspots', {
      body: JSON.stringify({ ...qrSpot.value, ...payload })
    });
    if (err) return;
    emitQrSpotsUpdate();
    setQRSpot(data as QrSpotRecord);
    setMode(QR_SPOT_MODE.VIEW);
  }

  async function edit(payload: Partial<QrSpotRecord>): Promise<void> {
    const id = qrSpot.value.id;
    if (!id) return;
    const { data, err } = await api.put('/api/qrspots/' + id, {
      body: JSON.stringify({ ...qrSpot.value, ...payload })
    });
    if (err) return;
    emitQrSpotsUpdate();
    setQRSpot(data as QrSpotRecord);
    setMode(QR_SPOT_MODE.VIEW);
  }

  function updateQrSpotLocation(): void {
    setQRSpot({ ...qrSpot.value, lat: undefined, lng: undefined });

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const { latitude: lat, longitude: lng } = coords;
        setQRSpot({ ...qrSpot.value, lat, lng });
      },
      err => {
        useGlobal().setMessage('GeolocationError: ' + err.message + ' - retrying ...');
        updateQrSpotLocation();
      },
      {
        timeout: 10 * 1000,
        maximumAge: 10 * 1000
      }
    );
  }

  return {
    map,
    qrSpot,
    mode,
    panel,
    setMap,
    setQRSpot,
    setMode,
    setModalState,
    prompt,
    select,
    deselect,
    create,
    edit,
    updateQrSpotLocation
  };
});
