import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";
import { COLOR_ACCENT, COLOR_PRIMARY } from "./AppStyles";
import { initializeApp, getApps } from "firebase/app";
import { EntryStackScreen } from "./screens/EntryStackScreen";
import { GroupScreen } from "./screens/AuthStack/GroupScreen.main";
import {CreateAGroupScreen} from "./screens/AuthStack/CreateAGroupScreen.main";
import { RootStackScreen } from "./screens/RootStack/RootStackScreen";
import {
  BaseButton,
  GestureHandlerRootView
} from 'react-native-gesture-handler';



const firebaseConfig = require("./keys.json");

if (getApps().length == 0) {
  initializeApp(firebaseConfig);
}


const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: COLOR_PRIMARY,
    accent: COLOR_ACCENT,
  },
};

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <EntryStackScreen />
      </PaperProvider>
    </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}