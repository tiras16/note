import React, { useState, useLayoutEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Modal,
  Platform,
  StatusBar,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context"; // Changed import
import { useNavigation } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { aiClient } from "../services/aiClient";
import * as Clipboard from "expo-clipboard";
import { useNotes } from "../context/NotesContext";
import RenderHtml from "react-native-render-html";
import { PremiumModal } from "../components/PremiumModal"; // Added

import { useTranslation } from "react-i18next";

const Icon = Ionicons as any;

export const AiWriterScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { addNote, isPremium } = useNotes();
  const { width } = useWindowDimensions();

  const [prompt, setPrompt] = useState("");
  const [type, setType] = useState("Email");
  const [tone, setTone] = useState("Formal");
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      Alert.alert(t("aiWriter.emptyPrompt"));
      return;
    }

    setLoading(true);

    // Simulate Premium Check
    if (!isPremium) {
      // Fake a short delay then show modal
      setTimeout(() => {
        setLoading(false);
        setShowPremiumModal(true);
      }, 1500);
      return;
    }

    try {
      const text = await aiClient.generateText(prompt, type, tone);
      setResult(text);
    } catch (error) {
      Alert.alert(t("common.error"), t("aiWriter.generationError"));
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (result) {
      // Strip HTML for clipboard
      const stripped = result.replace(/<[^>]+>/g, "");
      await Clipboard.setStringAsync(stripped);
      Alert.alert(t("aiWriter.copySuccess"));
    }
  };

  const handleSave = async () => {
    if (result) {
      await addNote(`AI Draft: ${prompt.substring(0, 20)}...`, result);
      Alert.alert(t("aiWriter.savedSuccess"), t("aiWriter.savedMessage"));
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView
      className="flex-1 bg-[#F3F0F7] dark:bg-gray-900"
      style={{
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
      }}
    >
      {/* Header */}
      <View className="flex-row items-center px-6 pt-2 pb-6">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={28} color="#7E57C2" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-[#5E35B1] dark:text-purple-400 ml-4">
          {t("aiWriter.title")}
        </Text>
      </View>

      <ScrollView className="flex-1 px-6">
        {/* Input Section */}
        <View className="bg-white dark:bg-gray-800 p-5 rounded-3xl shadow-sm mb-6">
          <Text className="text-gray-500 dark:text-gray-400 mb-2 font-medium">
            {t("aiWriter.promptLabel")}
          </Text>
          <TextInput
            className="text-lg text-gray-800 dark:text-gray-200 min-h-[80px]"
            placeholder={t("aiWriter.promptPlaceholder")}
            placeholderTextColor="#B0BEC5"
            multiline
            value={prompt}
            onChangeText={setPrompt}
          />
        </View>

        {/* Options */}
        <View className="flex-row justify-between mb-6">
          <View className="flex-1 mr-2">
            <Text className="text-gray-500 dark:text-gray-400 mb-2 font-medium">
              {t("aiWriter.typeLabel")}
            </Text>
            <View className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden">
              {["Email", "Paragraph", "Message"].map((tKey) => (
                <TouchableOpacity
                  key={tKey}
                  onPress={() => setType(tKey)}
                  className={`p-3 ${
                    type === tKey ? "bg-[#EDE7F6] dark:bg-purple-900" : ""
                  }`}
                >
                  <Text
                    className={`${
                      type === tKey
                        ? "text-[#5E35B1] dark:text-purple-300 font-bold"
                        : "text-gray-600 dark:text-gray-400"
                    }`}
                  >
                    {t(`aiWriter.types.${tKey.toLowerCase()}`)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View className="flex-1 ml-2">
            <Text className="text-gray-500 dark:text-gray-400 mb-2 font-medium">
              {t("aiWriter.toneLabel")}
            </Text>
            <View className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden">
              {["Formal", "Neutral", "Friendly"].map((tKey) => (
                <TouchableOpacity
                  key={tKey}
                  onPress={() => setTone(tKey)}
                  className={`p-3 ${
                    tone === tKey ? "bg-[#EDE7F6] dark:bg-purple-900" : ""
                  }`}
                >
                  <Text
                    className={`${
                      tone === tKey
                        ? "text-[#5E35B1] dark:text-purple-300 font-bold"
                        : "text-gray-600 dark:text-gray-400"
                    }`}
                  >
                    {t(`aiWriter.tones.${tKey.toLowerCase()}`)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Generate Button */}
        <TouchableOpacity
          className="bg-[#7E57C2] p-4 rounded-2xl shadow-md flex-row justify-center items-center mb-8"
          onPress={handleGenerate}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <>
              <Icon name="pencil" size={22} color="white" />
              <Text className="text-white font-bold ml-2 text-lg">
                {t("aiWriter.generateButton")}
              </Text>
            </>
          )}
        </TouchableOpacity>

        {/* Result Area */}
        {result && (
          <View className="bg-white dark:bg-gray-800 p-6 rounded-3xl border-2 border-[#D1C4E9] dark:border-purple-900 mb-10">
            <RenderHtml
              contentWidth={width - 96}
              source={{ html: result }}
              tagsStyles={{
                body: { color: "#4B5563", fontSize: 16, lineHeight: 24 },
                p: { marginBottom: 10 },
              }}
            />

            <View className="flex-row justify-end gap-3 mt-4">
              <TouchableOpacity
                onPress={handleCopy}
                className="bg-gray-100 dark:bg-gray-700 p-3 rounded-xl"
              >
                <Icon name="copy-outline" size={20} color="#5E35B1" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSave}
                className="bg-[#EDE7F6] dark:bg-purple-900 px-4 py-3 rounded-xl"
              >
                <Text className="text-[#5E35B1] dark:text-purple-300 font-bold">
                  {t("aiWriter.saveButton")}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>

      <PremiumModal
        visible={showPremiumModal}
        onClose={() => setShowPremiumModal(false)}
        featureName={t("premium.features.aiWriter")}
      />
    </SafeAreaView>
  );
};
