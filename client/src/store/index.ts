import { createPinia, type Pinia } from 'pinia';

import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

// Pinia Stores
import useConfig from '@/store/ConfigStore';
import useDialog from '@/store/DialogStore';
import useGlobal from '@/store/GlobalStore';
import useQrSpot from '@/store/QrSpotStore';
import useScan from '@/store/ScanStore';
import useUser from '@/store/UserStore';

/** Pinia Store */
const pinia: Pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

export default pinia;

export { useConfig, useDialog, useGlobal, useQrSpot, useScan, useUser };
