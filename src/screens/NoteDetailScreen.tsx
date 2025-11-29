import React, { useState, useLayoutEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  useWindowDimensions,
} from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNotes } from "../context/NotesContext";
import { RootStackParamList } from "../navigation/RootNavigator";
import { aiClient } from "../services/aiClient";
import Ionicons from "@expo/vector-icons/Ionicons";
// import RenderHtml from "react-native-render-html"; // Temporarily commented out

const Icon = Ionicons as any;

type NoteDetailRouteProp = RouteProp<RootStackParamList, "NoteDetail">;
type NoteDetailNavProp = StackNavigationProp<RootStackParamList, "NoteDetail">;

export const NoteDetailScreen = () => {
  const navigation = useNavigation<NoteDetailNavProp>();
  const route = useRoute<NoteDetailRouteProp>();
  const { notes, updateNote, addNote } = useNotes();
  const { width } = useWindowDimensions();

  const noteId = route.params.noteId;
  const note = notes.find((n) => n.id === noteId);

  const [isSummarizing, setIsSummarizing] = useState(false);
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

  const handleSaveSummary = async (appendToCurrent: boolean) => {
    if (!aiSummary) return;
    if (appendToCurrent) {
      const newContent = `${note.content}<br/><br/><h3>AI Summary</h3><p>${aiSummary}</p>`;
      await updateNote(note.id, note.title, newContent);
      setAiSummary(null);
    } else {
      await addNote(`Summary: ${note.title}`, `<p>${aiSummary}</p>`);
      setAiSummary(null);
      navigation.navigate("Home");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F3F0F7]">
      <View className="flex-row justify-between items-center px-6 pt-2 pb-6">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={28} color="#7E57C2" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-[#5E35B1]">Details</Text>
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
        <View className="bg-white rounded-3xl p-6 shadow-sm mb-6 min-h-[200px]">
          <Text className="text-2xl font-bold text-[#5E35B1] mb-2">
            {note.title}
          </Text>
          <Text className="text-[#9FA8DA] text-sm mb-6">
            {new Date(note.createdAt).toLocaleString()}
          </Text>

          {/* Debugging Text instead of RenderHtml */}
          <Text style={{ color: "#4B5563", fontSize: 16 }}>
            {note.content?.replace(/<[^>]+>/g, "") || "No content"}
          </Text>
        </View>

        <View className="mb-8">
          <TouchableOpacity
            className="bg-[#7E57C2] p-4 rounded-2xl shadow-md mb-4 justify-center items-center"
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
            <View className="bg-white p-6 rounded-3xl border-2 border-[#D1C4E9]">
              <Text className="font-bold text-[#5E35B1] mb-2 text-lg">
                AI Response:
              </Text>

              {/* Debugging Text instead of RenderHtml */}
              <Text
                style={{ color: "#4B5563", fontSize: 16, marginBottom: 10 }}
              >
                {aiSummary.replace(/<[^>]+>/g, "")}
              </Text>

              <View className="flex-row justify-end space-x-3 gap-3 mt-4">
                <TouchableOpacity
                  className="bg-[#EDE7F6] px-4 py-3 rounded-xl"
                  onPress={() => handleSaveSummary(false)}
                >
                  <Text className="text-[#5E35B1] font-bold">Save as New</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="bg-[#7E57C2] px-4 py-3 rounded-xl"
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
