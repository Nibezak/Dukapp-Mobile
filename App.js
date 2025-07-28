import 'react-native-gesture-handler';
import React from 'react';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { AuthProvider } from './src/context/AuthProvider';
import RootNavigation from './src/navigation/RootNavigation';
import { getSetting } from './src/models/AsyncStorage';
import i18n from 'i18n-js';

import en from './src/translations/en';
import fr from './src/translations/fr';
import rw from './src/translations/rw';

import { Theme } from './src/helpers/theme';
import { useState } from 'react';
import { createContext } from 'react';
import { LogBox, StatusBar } from 'react-native'; // Import StatusBar

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';

// Set the key-value pairs for the different languages you want to support.
i18n.translations = {
  en,
  fr,
  rw,
};

// Set the locale once at the beginning of your app.
i18n.locale = 'en';

getSetting('app_language').then((lang) => {
  i18n.locale = lang;
});

// When a value is missing from a language, it'll fallback to another language with the key present.
i18n.fallbacks = true;

// log an event when the app is launched

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

export const ThemeContext = createContext();
LogBox.ignoreAllLogs();

export default function Main() {
  const [theme, setTheme] = useState(Theme.light);
  const [currentTheme, setCurrentTheme] = useState(Theme.light);

  useEffect(() => {
    if (currentTheme && currentTheme === 'light') {
      setTheme(Theme.light);
    } else {
      setTheme(Theme.light);
    }
  }, [currentTheme]);

  return (
    <>
      {/* Hide the status bar */}
      {/* <StatusBar hidden /> */}

      {/* Your app content */}
      <ThemeContext.Provider value={{ theme, setTheme }}>
        <App />
      </ThemeContext.Provider>
    </>
  );
}
