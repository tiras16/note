import React, { useLayoutEffect, useState } from "react";
import {
  View,
  FlatList,
  TouchableOpacity,
  Text,
  Alert,
  Platform,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context"; // Changed import
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNotes } from "../context/NotesContext";
import { NoteCard } from "../components/NoteCard";
import { RootStackParamList } from "../navigation/RootNavigator";
import { Note } from "../types/note";
import { FlagPicker } from "../components/FlagPicker";

type HomeScreenProp = StackNavigationProp<RootStackParamList, "Home">;

const Icon = Ionicons as any;

export const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenProp>();
  const { notes, updateFlag, deleteNote } = useNotes();
  const [selectedNoteForFlag, setSelectedNoteForFlag] = useState<Note | null>(
    null
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const handleFlagPress = (note: Note) => {
    setSelectedNoteForFlag(note);
  };

  const handleDelete = (id: string) => {
    Alert.alert("Delete Note", "Are you sure you want to delete this note?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => deleteNote(id) },
    ]);
  };

  return (
    <SafeAreaView
      className="flex-1 bg-[#F3F0F7] dark:bg-gray-900"
      style={{
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
      }}
    >
      <View className="flex-row justify-between items-center px-6 pt-2 pb-6">
        <View className="w-8" />
        <Text className="text-3xl font-bold text-[#5E35B1] dark:text-purple-400">
          My Notes
        </Text>

        <View className="flex-row items-center gap-4">
          <TouchableOpacity onPress={() => navigation.navigate("AiWriter")}>
            <View className="bg-[#EDE7F6] dark:bg-purple-900 p-2 rounded-full">
              <Icon name="sparkles" size={24} color="#7E57C2" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate("Settings")}>
            <Icon name="settings-outline" size={28} color="#7E57C2" />
          </TouchableOpacity>
        </View>
      </View>

      {notes.length === 0 ? (
        <View className="flex-1 justify-center items-center px-4">
          <Text className="text-gray-400 dark:text-gray-500 text-lg text-center">
            No notes yet. Tap + to create one!
          </Text>
        </View>
      ) : (
        <FlatList
          data={notes}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <NoteCard
              note={item}
              onPress={() =>
                navigation.navigate("NoteDetail", { noteId: item.id })
              }
              onToggleFlag={() => handleFlagPress(item)}
              onDelete={() => handleDelete(item.id)}
            />
          )}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        />
      )}

      <View
        className="absolute bottom-10 left-0 right-0 items-center justify-center"
        pointerEvents="box-none"
      >
        <TouchableOpacity
          className="bg-[#9FA8DA] w-16 h-16 rounded-full justify-center items-center shadow-lg border-4 border-white dark:border-gray-800"
          onPress={() => navigation.navigate("EditNote", {})}
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 4.65,
            elevation: 8,
          }}
        >
          <Icon name="add" size={36} color="white" />
        </TouchableOpacity>
      </View>

      <FlagPicker
        visible={!!selectedNoteForFlag}
        onClose={() => setSelectedNoteForFlag(null)}
        currentColor={selectedNoteForFlag?.flagColor}
        onSelect={(color) => {
          if (selectedNoteForFlag) {
            updateFlag(selectedNoteForFlag.id, color);
          }
          setSelectedNoteForFlag(null);
        }}
      />
    </SafeAreaView>
  );
};
