import 'react-native-gesture-handler';
import React from "react";
import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";
import { AuthProvider } from "./src/context/AuthProvider";
import RootNavigation from "./src/navigation/RootNavigation";
import { getSetting } from "./src/models/AsyncStorage";
import i18n from "i18n-js";
import * as Sentry from "sentry-expo";
import en from "./src/translations/en";
import fr from "./src/translations/fr";
import rw from "./src/translations/rw";

Sentry.init({
  dsn: "https://224387e53504459fbf783f311b4da145@o1123793.ingest.sentry.io/6161977",
  enableInExpoDevelopment: true,

  // If `true`, Sentry will try to print out useful debugging information if something goes wrong with sending the event. Set it to `false` in production
  debug: true,
});

// Set the key-value pairs for the different languages you want to support.
i18n.translations = {
  en,
  fr,
  rw,
};

// Set the locale once at the beginning of your app.
i18n.locale = "en";

getSetting("app_language").then((lang) => (i18n.locale = lang));

// When a value is missing from a language it'll fallback to another language with the key present.
i18n.fallbacks = true;
/*
 * COLORS
 * 
gray-100	color: #f7fafc;	Aa
gray-200	color: #edf2f7;	Aa
gray-300	color: #e2e8f0;	Aa
gray-400	color: #cbd5e0;	Aa
gray-500	color: #a0aec0;	Aa
gray-600	color: #718096;	Aa
gray-700	color: #4a5568;	Aa
gray-800	color: #2d3748;	Aa
gray-900	color: #1a202c;	Aa
Yego - #f1c40f
 **/
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
    primary: "#1f2937",
    accent: "#f1c40f",
    textInput: "#fff",
  },
};
export default function Main() {
  return (
    <PaperProvider theme={theme}>
      <App />
    </PaperProvider>
  );
}
