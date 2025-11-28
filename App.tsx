import "./global.css";
import React from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { RootNavigator } from "./src/navigation/RootNavigator";
import { NotesProvider } from "./src/context/NotesContext";
import { ThemeProvider } from "./src/context/ThemeContext";

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <NotesProvider>
          <RootNavigator />
          <StatusBar style="auto" />
        </NotesProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
