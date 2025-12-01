import React, { useLayoutEffect } from "react";
import {
  View,
  Text,
  Switch,
  Linking,
  TouchableOpacity,
  Platform,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context"; // Changed import
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../context/ThemeContext";
import Constants from "expo-constants";
import Ionicons from "@expo/vector-icons/Ionicons";

import { useTranslation } from "react-i18next";

const Icon = Ionicons as any;

export const SettingsScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const { isDark, toggleTheme } = useTheme();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  return (
    <SafeAreaView
      className="flex-1 bg-[#F3F0F7] dark:bg-gray-900"
      style={{
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
      }}
    >
      {/* Header */}
      <View className="flex-row justify-between items-center px-6 pt-2 pb-6">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={28} color="#7E57C2" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-[#5E35B1] dark:text-purple-400">
          {t("settings.title")}
        </Text>
        <View className="w-7" />
      </View>

      <View className="px-6">
        <TouchableOpacity
          onPress={() => navigation.navigate("Premium")}
          className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-[#7E57C2] rounded-3xl p-4 mb-4 shadow-md flex-row items-center justify-between"
        >
          <View className="flex-row items-center">
            <View className="bg-white/20 p-2 rounded-full mr-3">
              <Icon name="diamond" size={24} color="white" />
            </View>
            <View>
              <Text className="text-white font-bold text-lg">
                {t("settings.upgradeCardTitle")}
              </Text>
              <Text className="text-purple-100 text-xs">
                {t("settings.upgradeCardSubtitle")}
              </Text>
            </View>
          </View>
          <Icon name="chevron-forward" size={24} color="white" />
        </TouchableOpacity>

        <View className="bg-white dark:bg-gray-800 rounded-3xl p-4 mb-4 shadow-sm">
          <View className="flex-row justify-between items-center py-2">
            <View className="flex-row items-center">
              <View className="bg-[#EDE7F6] dark:bg-purple-900 p-2 rounded-full mr-3">
                <Icon name="moon" size={22} color="#5E35B1" />
              </View>
              <Text className="text-lg text-gray-800 dark:text-gray-200 font-medium">
                {t("settings.darkMode")}
              </Text>
            </View>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: "#D1C4E9", true: "#7E57C2" }}
              thumbColor={isDark ? "#fff" : "#f4f3f4"}
            />
          </View>
        </View>

        <View className="bg-white dark:bg-gray-800 rounded-3xl p-4 mb-4 shadow-sm">
          <View className="py-3 border-b border-gray-100 dark:border-gray-700 flex-row items-center justify-between">
            <View className="flex-row items-center">
              <View className="bg-[#EDE7F6] dark:bg-purple-900 p-2 rounded-full mr-3">
                <Icon name="information-circle" size={22} color="#5E35B1" />
              </View>
              <Text className="text-gray-800 dark:text-gray-200 font-medium text-lg">
                {t("settings.appVersion")}
              </Text>
            </View>
            <Text className="text-[#9FA8DA] dark:text-purple-300 text-lg font-bold">
              {Constants.expoConfig?.version || "1.0.0"}
            </Text>
          </View>

          <TouchableOpacity
            className="py-3 pt-4 flex-row items-center justify-between"
            onPress={() =>
              Linking.openURL("https://tiras16.github.io/note/privacy.html")
            }
          >
            <View className="flex-row items-center">
              <View className="bg-[#EDE7F6] dark:bg-purple-900 p-2 rounded-full mr-3">
                <Icon name="shield-checkmark" size={22} color="#5E35B1" />
              </View>
              <Text className="text-gray-800 dark:text-gray-200 font-medium text-lg">
                {t("settings.privacyPolicy")}
              </Text>
            </View>
            <Icon name="chevron-forward" size={20} color="#B0BEC5" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};
