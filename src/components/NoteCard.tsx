import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
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
  const strippedContent = note.content
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<\/li>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .trim();

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
          <View className="flex-1 flex-row items-center mr-4">
              {note.isLocked && (
                  <Icon name="lock-closed" size={20} color="#F59E0B" style={{ marginRight: 8 }} />
              )}
              <Text
                className="text-xl font-bold text-[#5E35B1] dark:text-purple-300 flex-1" // Updated color
                numberOfLines={1}
              >
                {note.title}
              </Text>
          </View>
          
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

        {note.isLocked ? (
            <View className="flex-row items-center mt-1 opacity-50">
                <Text className="text-gray-400 dark:text-gray-500 text-sm italic">Content is hidden</Text>
    </View>
        ) : (
            <Text className="text-gray-500 dark:text-gray-400 text-base leading-6" numberOfLines={3}>
              {strippedContent}
            </Text>
        )}
      </TouchableOpacity>
    </Swipeable>
  );
};
