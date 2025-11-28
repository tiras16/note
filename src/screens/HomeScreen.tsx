import React, { useLayoutEffect } from "react";
import {
  View,
  FlatList,
  TouchableOpacity,
  Text,
  SafeAreaView,
  ActionSheetIOS,
  Platform,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNotes, FLAG_COLORS } from "../context/NotesContext";
import { NoteCard } from "../components/NoteCard";
import { RootStackParamList } from "../navigation/RootNavigator";
import { Note } from "../types/note";

type HomeScreenProp = StackNavigationProp<RootStackParamList, "Home">;

const Icon = Ionicons as any;

export const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenProp>();
  const { notes, updateFlag, deleteNote } = useNotes();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const handleFlagPress = (note: Note) => {
    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: [
            "Cancel",
            "Red (High)",
            "Orange (Medium)",
            "Blue (Low)",
            "Green (Done)",
            "Purple (Custom)",
            "Remove Flag",
          ],
          destructiveButtonIndex: 6,
          cancelButtonIndex: 0,
          title: "Select Flag Priority",
        },
        (buttonIndex) => {
          if (buttonIndex === 0) return;
          if (buttonIndex === 6) {
            updateFlag(note.id, undefined);
          } else {
            updateFlag(note.id, FLAG_COLORS[buttonIndex - 1]);
          }
        }
      );
    } else {
      Alert.alert("Select Flag Priority", "Choose a priority level", [
        {
          text: "Red (High)",
          onPress: () => updateFlag(note.id, FLAG_COLORS[0]),
        },
        {
          text: "Orange (Med)",
          onPress: () => updateFlag(note.id, FLAG_COLORS[1]),
        },
        {
          text: "Green (Done)",
          onPress: () => updateFlag(note.id, FLAG_COLORS[3]),
        },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => updateFlag(note.id, undefined),
        },
        { text: "Cancel", style: "cancel" },
      ]);
    }
  };

  const handleDelete = (id: string) => {
    Alert.alert("Delete Note", "Are you sure you want to delete this note?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => deleteNote(id) },
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F3F0F7]">
      {/* Custom Header */}
      <View className="flex-row justify-between items-center px-6 pt-2 pb-6">
        <View className="w-8" /> {/* Spacer */}
        <Text className="text-3xl font-bold text-[#5E35B1]">My Notes</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Settings")}>
          <Icon name="settings-outline" size={28} color="#7E57C2" />
        </TouchableOpacity>
      </View>

      {notes.length === 0 ? (
        <View className="flex-1 justify-center items-center px-4">
          <Text className="text-gray-400 text-lg text-center">
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
              onToggleFlag={() => handleFlagPress(item)} // Long press or swipe triggers this logic if modified
              onDelete={() => handleDelete(item.id)}
            />
          )}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* FAB */}
      <View
        className="absolute bottom-10 left-0 right-0 items-center justify-center"
        pointerEvents="box-none"
      >
        <TouchableOpacity
          className="bg-[#9FA8DA] w-16 h-16 rounded-full justify-center items-center shadow-lg border-4 border-white"
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
    </SafeAreaView>
  );
};
