import React, { useState, useLayoutEffect, useEffect, useRef } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Alert,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
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
    <SafeAreaView className="flex-1 bg-[#F3F0F7]">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View className="flex-row justify-between items-center px-6 pt-2 pb-6">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={28} color="#7E57C2" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-[#5E35B1]">
            {isEditing ? "Edit Note" : "New Note"}
          </Text>
          <TouchableOpacity onPress={handleSave}>
            <Icon name="checkmark" size={28} color="#7E57C2" />
          </TouchableOpacity>
        </View>

        <View className="flex-1 px-6 pb-4">
          <View className="bg-white rounded-3xl shadow-sm flex-1 overflow-hidden">
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
                backgroundColor: "white",
                borderBottomWidth: 1,
                borderBottomColor: "#F3F0F7",
              }}
            />

            <TextInput
              className="text-2xl font-bold text-[#5E35B1] p-4 border-b border-gray-100"
              placeholder="Title"
              placeholderTextColor="#9FA8DA"
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
                  backgroundColor: "white",
                  color: "#4B5563",
                  placeholderColor: "#B0BEC5",
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
