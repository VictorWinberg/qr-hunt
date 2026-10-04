/**
 * Vuetify Plugin
 */
import { createVuetify, type VuetifyOptions } from 'vuetify';
import { en } from 'vuetify/locale';

import { loadFonts } from '@/plugins/webfontloader';

import 'vuetify/styles';
import '@mdi/font/css/materialdesignicons.css';

loadFonts();

const vuetifyConfig: VuetifyOptions = {
  locale: {
    locale: 'en',
    fallback: 'en',
    messages: { en }
  },
  display: {
    thresholds: {
      md: 960,
      lg: 1280,
      xl: 1920,
      xxl: 2560
    }
  },
  theme: {
    defaultTheme: 'dark',
    themes: {
      light: {
        dark: false,
        colors: {
          background: '#f5f5f5',
          surface: '#ffffff',
          primary: '#966840',
          secondary: '#575759',
          error: '#660d00'
        }
      },
      dark: {
        dark: true,
        colors: {
          background: '#242424',
          surface: '#575759',
          primary: '#c99f67',
          secondary: '#575759',
          error: '#660d00'
        }
      }
    }
  }
};

export default createVuetify(vuetifyConfig);
