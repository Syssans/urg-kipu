import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'fr.kipu.urgences',
  appName: 'Kipu',
  webDir: 'dist-native',
  backgroundColor: '#0a0a0b',
  ios: {
    // The CSS already pads for the notch and home bar (env(safe-area-inset-*)).
    contentInset: 'never',
    backgroundColor: '#0a0a0b',
  },
  plugins: {
    SplashScreen: { launchAutoHide: true, launchShowDuration: 0, backgroundColor: '#0a0a0b' },
  },
}

export default config
