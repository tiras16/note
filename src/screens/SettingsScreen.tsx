import React, { useLayoutEffect } from "react";
import { View, Text, Switch, Linking, TouchableOpacity, SafeAreaView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../context/ThemeContext";
import Constants from "expo-constants";
import Ionicons from "@expo/vector-icons/Ionicons";

const Icon = Ionicons as any;

export const SettingsScreen = () => {
  const navigation = useNavigation();
  const { isDark, toggleTheme } = useTheme();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  return (
    <SafeAreaView className="flex-1 bg-[#F3F0F7]">
      {/* Header */}
      <View className="flex-row justify-between items-center px-6 pt-2 pb-6">
         <TouchableOpacity onPress={() => navigation.goBack()}>
           <Icon name="arrow-back" size={28} color="#7E57C2" />
         </TouchableOpacity>
         <Text className="text-xl font-bold text-[#5E35B1]">Settings</Text>
         <View className="w-7" />
      </View>

      <View className="px-6">
        <View className="bg-white rounded-3xl p-4 mb-4 shadow-sm">
          <View className="flex-row justify-between items-center py-2">
            <View className="flex-row items-center">
                <View className="bg-[#EDE7F6] p-2 rounded-full mr-3">
                    <Icon name="moon" size={22} color="#5E35B1" />
                </View>
                <Text className="text-lg text-gray-800 font-medium">Dark Mode</Text>
            </View>
            <Switch 
                value={isDark} 
                onValueChange={toggleTheme}
                trackColor={{ false: "#D1C4E9", true: "#7E57C2" }}
                thumbColor={isDark ? "#fff" : "#f4f3f4"}
            />
          </View>
        </View>

        <View className="bg-white rounded-3xl p-4 mb-4 shadow-sm">
          <View className="py-3 border-b border-gray-100 flex-row items-center justify-between">
             <View className="flex-row items-center">
                <View className="bg-[#EDE7F6] p-2 rounded-full mr-3">
                    <Icon name="information-circle" size={22} color="#5E35B1" />
                </View>
                <Text className="text-gray-800 font-medium text-lg">App Version</Text>
             </View>
             <Text className="text-[#9FA8DA] text-lg font-bold">{Constants.expoConfig?.version || "1.0.0"}</Text>
          </View>
          
          <TouchableOpacity 
            className="py-3 pt-4 flex-row items-center justify-between"
            onPress={() => Linking.openURL("https://example.com/privacy")}
          >
             <View className="flex-row items-center">
                <View className="bg-[#EDE7F6] p-2 rounded-full mr-3">
                    <Icon name="shield-checkmark" size={22} color="#5E35B1" />
                </View>
                <Text className="text-gray-800 font-medium text-lg">Privacy Policy</Text>
             </View>
             <Icon name="chevron-forward" size={20} color="#B0BEC5" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};
