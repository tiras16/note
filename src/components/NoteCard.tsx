import React from 'react';
import { TouchableOpacity, Text, View, Animated } from 'react-native';
import { Note } from '../types/note';
import Ionicons from '@expo/vector-icons/Ionicons';
import Swipeable from 'react-native-gesture-handler/Swipeable';

const Icon = Ionicons as any;

interface NoteCardProps {
  note: Note;
  onPress: () => void;
  onToggleFlag: () => void;
  onDelete: () => void;
}

export const NoteCard = ({ note, onPress, onToggleFlag, onDelete }: NoteCardProps) => {
  // HTML'i temizlerken blok elementlerin yerine boşluk/yeni satır koyuyoruz
  const strippedContent = note.content
    .replace(/<br\s*\/?>/gi, '\n') // <br> -> \n
    .replace(/<\/p>/gi, '\n\n')    // </p> -> \n\n (Paragraf sonu)
    .replace(/<\/li>/gi, '\n')     // </li> -> \n (Liste öğesi sonu)
    .replace(/<[^>]+>/g, '')       // Diğer tüm etiketleri sil
    .trim();                       // Baştaki/sondaki boşlukları al

  const renderRightActions = (progress: any, dragX: any) => {
    return (
      <TouchableOpacity
        onPress={onDelete}
        className="bg-red-600 justify-center items-center w-24 rounded-r-3xl mb-4 ml-[-20px]"
        style={{ height: '100%' }}
      >
        <Icon name="trash-outline" size={30} color="white" />
      </TouchableOpacity>
    );
  };

  return (
    <Swipeable
      renderRightActions={renderRightActions}
      containerStyle={{ overflow: 'visible' }}
    >
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.9}
        className="bg-white dark:bg-gray-800 p-5 rounded-3xl mb-4 shadow-sm border border-gray-50 dark:border-gray-700 relative"
      >
        <View className="flex-row justify-between items-start mb-2">
          <Text
            className="text-xl font-bold text-purple-800 dark:text-purple-300 flex-1 mr-4"
            numberOfLines={1}
          >
            {note.title}
          </Text>
          
          <TouchableOpacity 
            onPress={(e) => {
              e.stopPropagation();
              onToggleFlag();
            }}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Icon
              name={note.flagColor ? "flag" : "flag-outline"}
              size={24}
              color={note.flagColor || "#B0BEC5"}
            />
          </TouchableOpacity>
        </View>

        <Text className="text-gray-500 dark:text-gray-400 text-base leading-6" numberOfLines={3}>
          {strippedContent}
        </Text>
      </TouchableOpacity>
    </Swipeable>
  );
};
