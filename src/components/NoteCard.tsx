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

  const renderRightActions = (progress: any, dragX: any) => {
    const trans = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [0, 100], // Basit bir geçiş
      extrapolate: 'clamp',
    });

    return (
      <TouchableOpacity
        onPress={onDelete}
        className="bg-red-600 justify-center items-center w-24 rounded-r-3xl mb-4 ml-[-20px]" // ml negative to overlap rounded corner gap
        style={{ height: '100%' }}
      >
        <Icon name="trash-outline" size={30} color="white" />
      </TouchableOpacity>
    );
  };

  const renderLeftActions = (progress: any, dragX: any) => {
    const trans = dragX.interpolate({
      inputRange: [0, 100],
      outputRange: [-100, 0],
      extrapolate: 'clamp',
    });

    return (
      <TouchableOpacity
        onPress={onToggleFlag}
        className="bg-orange-500 justify-center items-center w-24 rounded-l-3xl mb-4 mr-[-20px]"
        style={{ height: '100%' }}
      >
        <Icon name="flag" size={30} color="white" />
      </TouchableOpacity>
    );
  };

  return (
    <Swipeable
      renderRightActions={renderRightActions}
      renderLeftActions={renderLeftActions}
      containerStyle={{ overflow: 'visible' }} // Gölgeler kesilmesin
    >
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.9} // Swipe ederken tıklamayı engellemek için
        className="bg-white p-5 rounded-3xl mb-4 shadow-sm border border-gray-50 relative"
      >
        <View className="flex-row justify-between items-start mb-2">
          <Text
            className="text-xl font-bold text-purple-800 flex-1 mr-4"
            numberOfLines={1}
          >
            {note.title}
          </Text>
          {/* Flag icon still visible on card as indicator */}
          {note.flagColor && (
            <Icon
              name="flag"
              size={24}
              color={note.flagColor}
            />
          )}
        </View>

        <Text className="text-gray-500 text-base leading-5" numberOfLines={4}>
          {strippedContent}
        </Text>
      </TouchableOpacity>
    </Swipeable>
  );
};
