import React, { useLayoutEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Platform,
  StatusBar,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient"; // Eğer yüklüyse, değilse düz renk kullanacağız.

import { useTranslation } from "react-i18next";

const Icon = Ionicons as any;

import { useNotes } from "../context/NotesContext";
import { ActivityIndicator } from "react-native";

export const PremiumScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { setIsPremium, isPremium } = useNotes();
  const [selectedPlan, setSelectedPlan] = React.useState<"monthly" | "annual">("annual");
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubscribe = () => {
    if (isPremium) {
      Alert.alert(t("common.info"), "You are already a Premium member!");
      return;
    }

    setIsLoading(true);
    // Mock Payment Process
    setTimeout(() => {
      setIsLoading(false);
      setIsPremium(true);
      Alert.alert("Success", "Welcome to Premium! All features are unlocked.", [
        { text: "OK", onPress: () => navigation.goBack() }
      ]);
    }, 2000);
  };

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const features = [
    {
      name: t("premium.features.createNotes"),
      free: t("premium.features.10notes"),
      premium: t("premium.features.unlimited"),
    },
    { name: t("premium.features.aiSummarize"), free: true, premium: true },
    { name: t("premium.features.richText"), free: true, premium: true },
    { name: t("premium.features.darkMode"), free: true, premium: true },
    { name: t("premium.features.aiWriter"), free: false, premium: true },
    { name: t("premium.features.aiSearch"), free: false, premium: true },
    { name: t("premium.features.noteLocking"), free: false, premium: true },
    { name: t("premium.features.exportPdf"), free: false, premium: true },
    { name: t("premium.features.smartTags"), free: false, premium: true },
  ];

  const renderIcon = (status: boolean | string) => {
    if (status === true)
      return <Icon name="checkmark-circle" size={22} color="#4CAF50" />;
    if (status === false)
      return <Icon name="close-circle" size={22} color="#EF5350" />;
    return <Text className="text-gray-500 font-medium text-xs">{status}</Text>;
  };

  return (
    <SafeAreaView
      className="flex-1 bg-white dark:bg-gray-900"
      style={{
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
      }}
    >
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header Image / Gradient Area */}
        <View className="h-60 bg-[#7E57C2] justify-center items-center relative rounded-b-[40px] mb-6 overflow-hidden">
          {/* Back Button */}
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="absolute top-4 left-6 z-10 bg-white/20 p-2 rounded-full"
          >
            <Icon name="close" size={24} color="white" />
          </TouchableOpacity>

          <View className="items-center">
            <View className="bg-white/20 p-4 rounded-full mb-4 backdrop-blur-sm">
              <Icon name="diamond" size={50} color="white" />
            </View>
            <Text className="text-white text-3xl font-bold tracking-wider">
              {t("premium.title")}
            </Text>
            <Text className="text-purple-100 text-base mt-1 font-medium">
              {t("premium.subtitle")}
            </Text>
          </View>
        </View>

        {/* Pricing Card */}
        <View className="mx-6 -mt-16 bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6 border border-gray-100 dark:border-gray-700 mb-8">
          {/* Plan Toggle */}
          <View className="flex-row bg-gray-100 dark:bg-gray-700 p-1 rounded-xl mb-6">
            <TouchableOpacity
              onPress={() => setSelectedPlan("monthly")}
              className={`flex-1 py-3 rounded-lg items-center ${
                selectedPlan === "monthly"
                  ? "bg-white dark:bg-gray-600 shadow-sm"
                  : ""
              }`}
            >
              <Text
                className={`font-bold text-sm ${
                  selectedPlan === "monthly"
                    ? "text-[#7E57C2] dark:text-white"
                    : "text-gray-500 dark:text-gray-400"
                }`}
              >
                {t("premium.monthlyPlan")}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setSelectedPlan("annual")}
              className={`flex-1 py-3 rounded-lg items-center ${
                selectedPlan === "annual"
                  ? "bg-white dark:bg-gray-600 shadow-sm"
                  : ""
              }`}
            >
              <Text
                className={`font-bold text-sm ${
                  selectedPlan === "annual"
                    ? "text-[#7E57C2] dark:text-white"
                    : "text-gray-500 dark:text-gray-400"
                }`}
              >
                {t("premium.annualPlan")}
              </Text>
              <View className="absolute -top-2 -right-2 bg-green-500 px-2 py-0.5 rounded-full">
                <Text className="text-[10px] text-white font-bold">
                  {t("premium.savePercent")}
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          <View className="flex-row justify-center items-baseline mb-4">
            <Text className="text-4xl font-extrabold text-gray-900 dark:text-white">
              {selectedPlan === "monthly"
                ? t("premium.priceMonthly")
                : t("premium.priceAnnual")}
            </Text>
            <Text className="text-gray-500 dark:text-gray-400 font-medium ml-1">
              {selectedPlan === "monthly"
                ? t("premium.month")
                : t("premium.year")}
            </Text>
          </View>
          <TouchableOpacity
            className="bg-[#7E57C2] py-4 rounded-2xl shadow-lg active:opacity-90 flex-row justify-center items-center"
            onPress={handleSubscribe}
            disabled={isLoading || isPremium}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white text-center font-bold text-lg">
                {isPremium ? "Active Plan" : t("premium.subscribe")}
              </Text>
            )}
          </TouchableOpacity>
          <Text className="text-center text-gray-400 text-xs mt-3">
            {t("premium.disclaimer")}
          </Text>
        </View>

        {/* Comparison Table */}
        <View className="px-6 mb-10">
          <Text className="text-xl font-bold text-gray-800 dark:text-white mb-6 text-center">
            {t("premium.comparisonTitle")}
          </Text>

          {/* Table Header */}
          <View className="flex-row justify-between items-center mb-4 px-2">
            <View className="flex-1">
              <Text className="font-bold text-gray-400 text-xs uppercase">
                {t("premium.featureHeader")}
              </Text>
            </View>
            <View className="w-20 items-center">
              <Text className="font-bold text-gray-400 text-xs uppercase">
                {t("premium.freeHeader")}
              </Text>
            </View>
            <View className="w-20 items-center">
              <Text className="font-bold text-[#7E57C2] text-xs uppercase">
                {t("premium.premiumHeader")}
              </Text>
            </View>
          </View>

          {/* Rows */}
          {features.map((feature, index) => (
            <View
              key={index}
              className={`flex-row justify-between items-center py-4 px-2 ${
                index !== features.length - 1
                  ? "border-b border-gray-100 dark:border-gray-800"
                  : ""
              }`}
            >
              <View className="flex-1">
                <Text className="font-medium text-gray-700 dark:text-gray-200 text-base">
                  {feature.name}
                </Text>
              </View>
              <View className="w-20 items-center">
                {renderIcon(feature.free)}
              </View>
              <View className="w-20 items-center">
                {renderIcon(feature.premium)}
              </View>
            </View>
          ))}
        </View>

        {/* Footer Links */}
        <View className="flex-row justify-center gap-6 mb-10">
          <TouchableOpacity
            onPress={() => Alert.alert(t("common.info"), "Restore Purchase")}
          >
            <Text className="text-gray-400 text-xs font-medium">
              {t("premium.restore")}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => Alert.alert(t("common.info"), "Terms of Service")}
          >
            <Text className="text-gray-400 text-xs font-medium">
              {t("premium.tos")}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => Alert.alert(t("common.info"), "Privacy Policy")}
          >
            <Text className="text-gray-400 text-xs font-medium">
              {t("premium.privacy")}
            </Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

