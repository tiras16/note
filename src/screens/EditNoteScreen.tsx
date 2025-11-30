import React, { useState, useLayoutEffect, useEffect, useRef } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context"; // Changed import
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNotes } from "../context/NotesContext";
import { RootStackParamList } from "../navigation/RootNavigator";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  RichEditor,
  RichToolbar,
  actions,
} from "react-native-pell-rich-editor";
import { useColorScheme } from "nativewind";

const Icon = Ionicons as any;
const RichEditorComponent = RichEditor as any;
const RichToolbarComponent = RichToolbar as any;

type EditNoteScreenRouteProp = RouteProp<RootStackParamList, "EditNote">;
type EditNoteScreenNavProp = StackNavigationProp<
  RootStackParamList,
  "EditNote"
>;

export const EditNoteScreen = () => {
  const navigation = useNavigation<EditNoteScreenNavProp>();
  const route = useRoute<EditNoteScreenRouteProp>();
  const { notes, addNote, updateNote } = useNotes();
  const richText = useRef<any>(null);
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  const isEditing = !!route.params?.noteId;
  const existingNote = isEditing
    ? notes.find((n) => n.id === route.params.noteId)
    : null;

  const [title, setTitle] = useState(existingNote?.title || "");
  const [content, setContent] = useState(existingNote?.content || "");

  useEffect(() => {
    if (existingNote) {
      setTitle(existingNote.title);
    }
  }, [existingNote]);

  const handleSave = async () => {
    const strippedContent = content.replace(/<[^>]+>/g, "").trim();
    if (!title.trim() && !strippedContent) {
      Alert.alert("Empty Note", "Please enter a title or content.");
      return;
    }

    if (isEditing && route.params.noteId) {
      await updateNote(route.params.noteId, title, content);
    } else {
      await addNote(title, content);
    }
    navigation.goBack();
  };

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
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View className="flex-row justify-between items-center px-6 pt-2 pb-6">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={28} color="#7E57C2" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-[#5E35B1] dark:text-purple-400">
            {isEditing ? "Edit Note" : "New Note"}
          </Text>
          <TouchableOpacity onPress={handleSave}>
            <Icon name="checkmark" size={28} color="#7E57C2" />
          </TouchableOpacity>
        </View>

        <View className="flex-1 px-6 pb-4">
          <View className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm flex-1 overflow-hidden">
            <RichToolbarComponent
              editor={richText}
              actions={[
                actions.undo,
                actions.redo,
                actions.setBold,
                actions.setItalic,
                actions.setUnderline,
                actions.insertBulletsList,
                actions.insertOrderedList,
                actions.heading1,
              ]}
              iconMap={{
                [actions.heading1]: () => (
                  <Text style={{ color: "#9FA8DA", fontWeight: "bold" }}>
                    H1
                  </Text>
                ),
              }}
              iconTint="#9FA8DA"
              selectedIconTint="#5E35B1"
              style={{
                backgroundColor: isDark ? "#1F2937" : "white", // Gray-800 : White
                borderBottomWidth: 1,
                borderBottomColor: isDark ? "#374151" : "#F3F0F7", // Gray-700 : Gray-50
              }}
            />

            <TextInput
              className="text-2xl font-bold text-[#5E35B1] dark:text-purple-400 p-4 border-b border-gray-100 dark:border-gray-700"
              placeholder="Title"
              placeholderTextColor={isDark ? "#6B7280" : "#9FA8DA"}
              value={title}
              onChangeText={setTitle}
            />

            <ScrollView className="flex-1">
              <RichEditorComponent
                ref={richText}
                initialContentHTML={content}
                onChange={setContent}
                placeholder="Start typing..."
                editorStyle={{
                  backgroundColor: isDark ? "#1F2937" : "white",
                  color: isDark ? "#E5E7EB" : "#4B5563",
                  placeholderColor: isDark ? "#6B7280" : "#B0BEC5",
                  contentCSSText: "font-size: 16px; line-height: 24px;",
                }}
                initialHeight={250}
                containerStyle={{ minHeight: 250 }}
              />
            </ScrollView>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
