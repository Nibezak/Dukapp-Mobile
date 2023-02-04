import 'react-native-gesture-handler';
import React from 'react';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { AuthProvider } from './src/context/AuthProvider';
import RootNavigation from './src/navigation/RootNavigation';
import { getSetting } from './src/models/AsyncStorage';
import i18n from 'i18n-js';
import * as firebase from 'expo-firebase-analytics';
import en from './src/translations/en';
import fr from './src/translations/fr';
import rw from './src/translations/rw';
import registerNNPushToken from 'native-notify';

// Set the key-value pairs for the different languages you want to support.
i18n.translations = {
  en,
  fr,
  rw,
};

// Set the locale once at the beginning of your app.
i18n.locale = 'en';

getSetting('app_language').then((lang) => (i18n.locale = lang));

// When a value is missing from a language it'll fallback to another language with the key present.
i18n.fallbacks = true;

// log an event when the app is launched
firebase.logEvent('app_launch');

function App() {
  return (
    <AuthProvider>
      <RootNavigation />
    </AuthProvider>
  );
}

const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: '#1f2937',
    accent: '#f1c40f',
    textInput: '#fff',
  },
};

export default function Main() {
  registerNNPushToken(5821, 'VZzLGzSIMPpBmmQN0CMG2I');
  return (
    <PaperProvider theme={theme}>
      <App />
    </PaperProvider>
  );
}
