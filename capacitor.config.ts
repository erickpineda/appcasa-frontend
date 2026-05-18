import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.appcasa.app',
  appName: 'AppCasa',
  webDir: 'www',
  server: {
    androidScheme: 'https',
  },
  plugins: {
    LocalNotifications: {
      smallIcon: 'ic_stat_icon_config_sample',
      iconColor: '#1E4D9B',
      sound: 'beep.wav',
    },
    SplashScreen: {
      launchShowDuration: 1500,
      backgroundColor: '#1E4D9B',
      showSpinner: false,
    },
  },
};

export default config;
