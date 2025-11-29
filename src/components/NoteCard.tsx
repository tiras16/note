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
  const strippedContent = note.content.replace(/<[^>]+>/g, '');

  // Sadece Silme Aksiyonu (Sağa kaydırınca)
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
        className="bg-white p-5 rounded-3xl mb-4 shadow-sm border border-gray-50 relative"
      >
        <View className="flex-row justify-between items-start mb-2">
          <Text
            className="text-xl font-bold text-purple-800 flex-1 mr-4"
            numberOfLines={1}
          >
            {note.title}
          </Text>
          
          {/* Flag Icon - Always Visible & Clickable */}
          <TouchableOpacity 
            onPress={(e) => {
              e.stopPropagation(); // Kartın açılmasını engelle
              onToggleFlag();
            }}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Icon
              name={note.flagColor ? "flag" : "flag-outline"} // Dolu veya Boş
              size={24}
              color={note.flagColor || "#B0BEC5"} // Renkli veya Gri
            />
          </TouchableOpacity>
        </View>

        <Text className="text-gray-500 text-base leading-5" numberOfLines={4}>
          {strippedContent}
        </Text>
      </TouchableOpacity>
    </Swipeable>
  );
};
