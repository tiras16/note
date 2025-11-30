import React, { useState, useLayoutEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  useWindowDimensions,
  Platform,
  StatusBar,
} from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNotes } from "../context/NotesContext";
import { RootStackParamList } from "../navigation/RootNavigator";
import { aiClient } from "../services/aiClient";
import Ionicons from "@expo/vector-icons/Ionicons";
import RenderHtml from "react-native-render-html";
import { useColorScheme } from "nativewind";

const Icon = Ionicons as any;

type NoteDetailRouteProp = RouteProp<RootStackParamList, "NoteDetail">;
type NoteDetailNavProp = StackNavigationProp<RootStackParamList, "NoteDetail">;

export const NoteDetailScreen = () => {
  const navigation = useNavigation<NoteDetailNavProp>();
  const route = useRoute<NoteDetailRouteProp>();
  const { notes, updateNote, addNote, updateTags } = useNotes();
  const { width } = useWindowDimensions();
  const { colorScheme } = useColorScheme();

  const isDark = colorScheme === "dark";

  const noteId = route.params.noteId;
  const note = notes.find((n) => n.id === noteId);

  const [isSummarizing, setIsSummarizing] = useState(false);
  const [isTagging, setIsTagging] = useState(false);
  const [aiSummary, setAiSummary] = useState<string | null>(null);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  if (!note) return null;

  const handleSummarize = async () => {
    setIsSummarizing(true);
    try {
      const strippedContent = note.content.replace(/<[^>]+>/g, "");
      const summary = await aiClient.summarize(strippedContent);
      setAiSummary(summary);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSummarizing(false);
    }
  };

  const handleAutoTag = async () => {
    setIsTagging(true);
    try {
      const strippedContent = note.content.replace(/<[^>]+>/g, "");
      const newTags = await aiClient.generateTags(strippedContent);
      if (newTags.length > 0) {
        await updateTags(note.id, newTags);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsTagging(false);
    }
  };

  const handleSaveSummary = async (appendToCurrent: boolean) => {
    if (!aiSummary) return;
    if (appendToCurrent) {
      const newContent = `${note.content}<br/><br/><p>${aiSummary}</p>`;
      await updateNote(note.id, note.title, newContent);
      setAiSummary(null);
    } else {
      await addNote(`AI Summary: ${note.title}`, `<p>${aiSummary}</p>`);
      setAiSummary(null);
      navigation.navigate("Home");
    }
  };

  // HTML Styles based on theme
  const tagsStyles = {
    body: {
      color: isDark ? "#E5E7EB" : "#4B5563", // Gray-200 : Gray-600
      fontSize: 18,
      lineHeight: 28,
    },
    h1: {
      color: isDark ? "#A78BFA" : "#5E35B1", // Purple-400 : Purple-800
      fontSize: 24,
      marginBottom: 10,
    },
    ul: { marginBottom: 10 },
    li: { marginBottom: 5 },
    p: { marginBottom: 10 },
    strong: {
      color: isDark ? "#A78BFA" : "#5E35B1",
      fontWeight: "bold",
    },
  };

  return (
    <SafeAreaView
      className="flex-1 bg-[#F3F0F7] dark:bg-gray-900"
      style={{
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
      }}
    >
      <View className="flex-row justify-between items-center px-6 pt-2 pb-6">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={28} color="#7E57C2" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-[#5E35B1] dark:text-purple-400">
          Details
        </Text>
        <TouchableOpacity
          onPress={() => navigation.navigate("EditNote", { noteId: note.id })}
        >
          <Icon name="create-outline" size={28} color="#7E57C2" />
        </TouchableOpacity>
      </View>

      <ScrollView
        className="flex-1 px-6"
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <View className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm mb-6 min-h-[200px]">
          <Text className="text-2xl font-bold text-[#5E35B1] dark:text-purple-400 mb-2">
            {note.title}
          </Text>
          <Text className="text-[#9FA8DA] dark:text-purple-300 text-sm mb-6">
            {new Date(note.createdAt).toLocaleString()}
          </Text>

          <RenderHtml
            contentWidth={width - 48}
            source={{ html: note.content || "<p></p>" }}
            tagsStyles={tagsStyles}
          />

          {/* Tags Section */}
          <View className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
            <View className="flex-row flex-wrap items-center gap-2">
              <Icon name="pricetags-outline" size={20} color="#9FA8DA" />

              {note.tags && note.tags.length > 0 ? (
                note.tags.map((tag, index) => (
                  <View
                    key={index}
                    className="bg-[#EDE7F6] dark:bg-purple-900 px-3 py-1 rounded-full mb-1"
                  >
                    <Text className="text-[#5E35B1] dark:text-purple-300 text-xs font-bold">
                      {tag}
                    </Text>
                  </View>
                ))
              ) : (
                <Text className="text-gray-400 text-sm italic">
                  No tags yet
                </Text>
              )}

              {/* Auto Tag Button */}
              <TouchableOpacity
                onPress={handleAutoTag}
                disabled={isTagging}
                className="bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full ml-2 mb-1 flex-row items-center"
              >
                {isTagging ? (
                  <ActivityIndicator size="small" color="#5E35B1" />
                ) : (
                  <Text className="text-[#5E35B1] dark:text-purple-300 text-xs font-bold">
                    ✨ AI Tag
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View className="mb-8">
          <TouchableOpacity
            className="bg-[#7E57C2] dark:bg-purple-700 p-4 rounded-2xl shadow-md mb-4 justify-center items-center"
            onPress={handleSummarize}
            disabled={isSummarizing}
          >
            {isSummarizing ? (
              <ActivityIndicator color="white" />
            ) : (
              <View className="flex-row items-center justify-center">
                <Icon name="sparkles" size={22} color="white" />
                <Text className="text-white font-bold ml-2 text-lg">
                  Summarize with AI
                </Text>
              </View>
            )}
          </TouchableOpacity>

          {aiSummary ? (
            <View className="bg-white dark:bg-gray-800 p-6 rounded-3xl border-2 border-[#D1C4E9] dark:border-purple-900">
              <Text className="font-bold text-[#5E35B1] dark:text-purple-400 mb-2 text-lg">
                AI Response:
              </Text>

              <RenderHtml
                contentWidth={width - 96}
                source={{ html: aiSummary }}
                tagsStyles={tagsStyles}
              />

              <View className="flex-row justify-end space-x-3 gap-3 mt-4">
                <TouchableOpacity
                  className="bg-[#EDE7F6] dark:bg-gray-700 px-4 py-3 rounded-xl"
                  onPress={() => handleSaveSummary(false)}
                >
                  <Text className="text-[#5E35B1] dark:text-purple-300 font-bold">
                    Save as New
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="bg-[#7E57C2] dark:bg-purple-700 px-4 py-3 rounded-xl"
                  onPress={() => handleSaveSummary(true)}
                >
                  <Text className="text-white font-bold">Append</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
