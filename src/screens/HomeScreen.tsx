import React, { useLayoutEffect, useState, useMemo } from "react";
import {
  View,
  FlatList,
  TouchableOpacity,
  Text,
  Alert,
  Platform,
  StatusBar,
  TextInput,
  ActivityIndicator,
  Switch,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNotes } from "../context/NotesContext";
import { NoteCard } from "../components/NoteCard";
import { RootStackParamList } from "../navigation/RootNavigator";
import { Note } from "../types/note";
import { FlagPicker } from "../components/FlagPicker";
import { aiClient } from "../services/aiClient";

type HomeScreenProp = StackNavigationProp<RootStackParamList, "Home">;

const Icon = Ionicons as any;

export const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenProp>();
  const { notes, updateFlag, deleteNote } = useNotes();
  const [selectedNoteForFlag, setSelectedNoteForFlag] = useState<Note | null>(
    null
  );

  // Search States
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAiSearch, setIsAiSearch] = useState(false); // Premium Toggle
  const [aiResults, setAiResults] = useState<string[]>([]);
  const [isSearchingAi, setIsSearchingAi] = useState(false);

  // Mock Premium Status
  const isPremium = true;

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

  // AI Search Function
  const performAiSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearchingAi(true);
    try {
      const results = await aiClient.searchNotes(searchQuery, notes);
      setAiResults(results);
    } catch (e) {
      Alert.alert("Search Error", "Could not perform AI search.");
    } finally {
      setIsSearchingAi(false);
    }
  };

  const filteredNotes = useMemo(() => {
    if (!searchQuery) return notes;

    if (isAiSearch) {
      // Filter by AI results (IDs)
      // If searching but no results yet, show nothing or all? Typically nothing until search completes.
      // But for better UX, if query changed and we haven't searched yet, maybe empty?
      // Let's just return matches. If empty, it shows "No matches".
      return notes.filter((n) => aiResults.includes(n.id));
    } else {
      // Standard text filter
      const lowerQ = searchQuery.toLowerCase();
      return notes.filter(
        (n) =>
          n.title.toLowerCase().includes(lowerQ) ||
          n.content
            .toLowerCase()
            .replace(/<[^>]+>/g, "")
            .includes(lowerQ)
      );
    }
  }, [notes, searchQuery, isAiSearch, aiResults]);

  return (
    <SafeAreaView
      className="flex-1 bg-[#F3F0F7] dark:bg-gray-900"
      style={{
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
      }}
    >
      {/* Header */}
      <View className="flex-row justify-between items-center px-6 pt-2 pb-2">
        {isSearchVisible ? (
          <View className="flex-1 flex-row items-center bg-white dark:bg-gray-800 rounded-full px-4 py-2 mr-2 shadow-sm">
            <Icon name="search" size={20} color="#9FA8DA" />
            <TextInput
              className="flex-1 ml-2 text-gray-800 dark:text-gray-200 text-base"
              placeholder={
                isAiSearch ? "Ask AI (e.g., travel ideas)..." : "Search..."
              }
              placeholderTextColor="#B0BEC5"
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={() => isAiSearch && performAiSearch()}
              returnKeyType="search"
              autoFocus
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity
                onPress={() => {
                  setSearchQuery("");
                  setAiResults([]);
                }}
              >
                <Icon name="close-circle" size={18} color="#B0BEC5" />
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <>
            <View className="w-8" />
            <Text className="text-3xl font-bold text-[#5E35B1] dark:text-purple-400">
              My Notes
            </Text>
          </>
        )}

        <View className="flex-row items-center gap-3">
          {!isSearchVisible && (
            <TouchableOpacity onPress={() => setIsSearchVisible(true)}>
              <View className="bg-white dark:bg-gray-800 p-2 rounded-full shadow-sm">
                <Icon name="search" size={24} color="#7E57C2" />
              </View>
            </TouchableOpacity>
          )}

          {isSearchVisible && (
            <TouchableOpacity
              onPress={() => {
                setIsSearchVisible(false);
                setSearchQuery("");
                setAiResults([]);
                setIsAiSearch(false);
              }}
            >
              <Text className="text-[#7E57C2] font-bold">Cancel</Text>
            </TouchableOpacity>
          )}

          {!isSearchVisible && (
            <>
              <TouchableOpacity onPress={() => navigation.navigate("AiWriter")}>
                <View className="bg-[#EDE7F6] dark:bg-purple-900 p-2 rounded-full">
                  <Icon name="sparkles" size={24} color="#7E57C2" />
                </View>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => navigation.navigate("Settings")}>
                <Icon name="settings-outline" size={28} color="#7E57C2" />
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>

      {/* Search Options (AI Toggle) */}
      {isSearchVisible && (
        <View className="px-6 pb-4 flex-row items-center justify-between">
          <View className="flex-row items-center">
            <Switch
              value={isAiSearch}
              onValueChange={(val) => {
                if (val && !isPremium) {
                  Alert.alert(
                    "Premium Feature",
                    "Upgrade to Premium to use AI Search."
                  );
                  return;
                }
                setIsAiSearch(val);
                if (!val) setAiResults([]);
              }}
              trackColor={{ false: "#D1C4E9", true: "#7E57C2" }}
            />
            <Text className="ml-2 text-gray-600 dark:text-gray-300 font-bold">
              {isAiSearch ? "✨ AI Search" : "Standard Search"}
            </Text>
          </View>

          {isAiSearch && (
            <TouchableOpacity
              onPress={performAiSearch}
              className="bg-[#7E57C2] px-3 py-1 rounded-lg"
            >
              <Text className="text-white font-bold text-xs">Search</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Loading Indicator */}
      {isSearchingAi && (
        <View className="py-4">
          <ActivityIndicator color="#7E57C2" />
          <Text className="text-center text-gray-400 text-xs mt-2">
            AI is reading your notes...
          </Text>
        </View>
      )}

      {notes.length === 0 ? (
        <View className="flex-1 justify-center items-center px-4">
          <Text className="text-gray-400 dark:text-gray-500 text-lg text-center">
            No notes yet. Tap + to create one!
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredNotes}
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
          ListEmptyComponent={
            searchQuery ? (
              <Text className="text-center text-gray-400 mt-10">
                No matches found.
              </Text>
            ) : null
          }
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
