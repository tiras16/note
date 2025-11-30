import React, { useState, useLayoutEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  Alert,
  Modal,
  Platform,
  StatusBar,
  useWindowDimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { aiClient } from "../services/aiClient";
import * as Clipboard from 'expo-clipboard';
import { useNotes } from "../context/NotesContext";
import RenderHtml from "react-native-render-html";

const Icon = Ionicons as any;

export const AiWriterScreen = () => {
  const navigation = useNavigation();
  const { addNote } = useNotes();
  const { width } = useWindowDimensions();

  const [prompt, setPrompt] = useState("");
  const [type, setType] = useState("Email");
  const [tone, setTone] = useState("Formal");
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  // Mock Premium Status (False = Free User)
  const isPremium = true; 

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      Alert.alert("Please enter a topic");
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
      Alert.alert("Error", "Could not generate text. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (result) {
        // Strip HTML for clipboard
        const stripped = result.replace(/<[^>]+>/g, '');
        await Clipboard.setStringAsync(stripped);
        Alert.alert("Copied to clipboard!");
    }
  };

  const handleSave = async () => {
    if (result) {
        await addNote(`AI Draft: ${prompt.substring(0, 20)}...`, result);
        Alert.alert("Saved", "Draft saved to your notes.");
        navigation.goBack();
    }
  };

  return (
    <SafeAreaView 
      className="flex-1 bg-[#F3F0F7] dark:bg-gray-900"
      style={{ paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0 }}
    >
      {/* Header */}
      <View className="flex-row items-center px-6 pt-2 pb-6">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={28} color="#7E57C2" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-[#5E35B1] dark:text-purple-400 ml-4">AI Writer</Text>
      </View>

      <ScrollView className="flex-1 px-6">
        
        {/* Input Section */}
        <View className="bg-white dark:bg-gray-800 p-5 rounded-3xl shadow-sm mb-6">
            <Text className="text-gray-500 dark:text-gray-400 mb-2 font-medium">What do you want to write?</Text>
            <TextInput 
                className="text-lg text-gray-800 dark:text-gray-200 min-h-[80px]" 
                placeholder="Ex: Job application email for QA position..." 
                placeholderTextColor="#B0BEC5"
                multiline
                value={prompt}
                onChangeText={setPrompt}
            />
        </View>

        {/* Options */}
        <View className="flex-row justify-between mb-6">
            <View className="flex-1 mr-2">
                <Text className="text-gray-500 dark:text-gray-400 mb-2 font-medium">Type</Text>
                <View className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden">
                    {['Email', 'Paragraph', 'Message'].map((t) => (
                        <TouchableOpacity 
                            key={t} 
                            onPress={() => setType(t)}
                            className={`p-3 ${type === t ? 'bg-[#EDE7F6] dark:bg-purple-900' : ''}`}
                        >
                            <Text className={`${type === t ? 'text-[#5E35B1] dark:text-purple-300 font-bold' : 'text-gray-600 dark:text-gray-400'}`}>{t}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            <View className="flex-1 ml-2">
                <Text className="text-gray-500 dark:text-gray-400 mb-2 font-medium">Tone</Text>
                <View className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden">
                    {['Formal', 'Neutral', 'Friendly'].map((t) => (
                        <TouchableOpacity 
                            key={t} 
                            onPress={() => setTone(t)}
                            className={`p-3 ${tone === t ? 'bg-[#EDE7F6] dark:bg-purple-900' : ''}`}
                        >
                            <Text className={`${tone === t ? 'text-[#5E35B1] dark:text-purple-300 font-bold' : 'text-gray-600 dark:text-gray-400'}`}>{t}</Text>
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
                    <Text className="text-white font-bold ml-2 text-lg">Generate Draft</Text>
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
                        body: { color: '#4B5563', fontSize: 16, lineHeight: 24 },
                        p: { marginBottom: 10 }
                    }}
                />
                
                <View className="flex-row justify-end gap-3 mt-4">
                    <TouchableOpacity onPress={handleCopy} className="bg-gray-100 dark:bg-gray-700 p-3 rounded-xl">
                        <Icon name="copy-outline" size={20} color="#5E35B1" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleSave} className="bg-[#EDE7F6] dark:bg-purple-900 px-4 py-3 rounded-xl">
                        <Text className="text-[#5E35B1] dark:text-purple-300 font-bold">Save as Note</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )}

      </ScrollView>

      {/* Premium Modal */}
      <Modal
        transparent
        visible={showPremiumModal}
        animationType="slide"
        onRequestClose={() => setShowPremiumModal(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
            <View className="bg-white dark:bg-gray-800 rounded-t-3xl p-8 items-center">
                <View className="w-16 h-16 bg-[#EDE7F6] rounded-full items-center justify-center mb-4">
                    <Icon name="diamond" size={32} color="#5E35B1" />
                </View>
                <Text className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Upgrade to Premium</Text>
                <Text className="text-gray-500 dark:text-gray-400 text-center mb-6 px-4">
                    Unlock unlimited AI writing, advanced tones, and more features to boost your productivity.
                </Text>
                
                <View className="w-full gap-3">
                    <TouchableOpacity 
                        className="bg-[#7E57C2] p-4 rounded-2xl items-center"
                        onPress={() => {
                            Alert.alert("Coming Soon!", "Payments are not integrated yet.");
                            setShowPremiumModal(false);
                        }}
                    >
                        <Text className="text-white font-bold text-lg">Get Premium - $4.99/mo</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                        className="p-4 items-center"
                        onPress={() => setShowPremiumModal(false)}
                    >
                        <Text className="text-gray-500 dark:text-gray-400 font-medium">Maybe Later</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
};

