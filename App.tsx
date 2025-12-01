import "react-native-gesture-handler"; // Must be at the top
import "./global.css";
import "./src/i18n"; // Initialize i18n
import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { RootNavigator } from "./src/navigation/RootNavigator";
import { NotesProvider } from "./src/context/NotesContext";
import { ThemeProvider } from "./src/context/ThemeContext";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Image, View, StyleSheet, Dimensions } from "react-native";

export default function App() {
  const [isShowSplash, setIsShowSplash] = useState(true);

  useEffect(() => {
    // 2 saniye sonra splash screen'i kapat
    const timer = setTimeout(() => {
      setIsShowSplash(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (isShowSplash) {
    return (
      <View style={styles.splashContainer}>
        <Image
          source={require("./assets/splash.png")}
          style={styles.splashImage}
          resizeMode="cover" // Görsel tam ekran kaplasın
        />
        <StatusBar style="light" /> 
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <NotesProvider>
            <RootNavigator />
            <StatusBar style="auto" />
          </NotesProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    backgroundColor: "#ffffff", // Görsel yüklenirken arka plan rengi
    alignItems: "center",
    justifyContent: "center",
  },
  splashImage: {
    width: width,
    height: height,
  },
});
