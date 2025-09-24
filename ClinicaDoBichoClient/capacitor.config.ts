import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'ClinicaDoBichoClient',
  webDir: 'www',
  server: {
    androidScheme: 'http', // <--- habilita HTTP
    allowNavigation: [],
    cleartext: true
  },
  android: {
    allowMixedContent: true // <--- só para dev, remove em produção
  }
};

export default config;
