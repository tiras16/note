import React from 'react';
import { Modal, View, Text, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { FLAG_COLORS } from '../context/NotesContext';

const Icon = Ionicons as any;

interface FlagPickerProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (color?: string) => void;
  currentColor?: string;
}

const LABELS = ['High', 'Medium', 'Low', 'Done', 'Custom'];

export const FlagPicker = ({ visible, onClose, onSelect, currentColor }: FlagPickerProps) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableOpacity 
        style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' }}
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableWithoutFeedback>
          <View className="bg-white rounded-t-3xl p-6 shadow-2xl">
            <View className="items-center mb-6">
              <View className="w-12 h-1.5 bg-gray-200 rounded-full mb-4" />
              <Text className="text-lg font-bold text-gray-700">Select Priority</Text>
            </View>

            <View className="flex-row flex-wrap justify-between mb-4">
              {FLAG_COLORS.map((color, index) => (
                <TouchableOpacity
                  key={color}
                  onPress={() => onSelect(color)}
                  className="items-center mb-4 w-[18%]"
                >
                  <View 
                    className={`w-12 h-12 rounded-full items-center justify-center mb-2 shadow-sm`}
                    style={{ 
                      backgroundColor: color,
                      borderWidth: currentColor === color ? 3 : 0,
                      borderColor: '#E0E0E0'
                    }}
                  >
                    {currentColor === color && (
                      <Icon name="checkmark" size={24} color="white" />
                    )}
                  </View>
                  <Text className="text-xs text-gray-500 font-medium text-center">
                    {LABELS[index]}
                  </Text>
                </TouchableOpacity>
              ))}

              {/* Remove Flag Option */}
              <TouchableOpacity
                onPress={() => onSelect(undefined)}
                className="items-center mb-4 w-[18%]"
              >
                <View className="w-12 h-12 rounded-full bg-gray-100 items-center justify-center mb-2 border border-gray-200">
                  <Icon name="close" size={24} color="#757575" />
                </View>
                <Text className="text-xs text-gray-500 font-medium text-center">None</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </TouchableOpacity>
    </Modal>
  );
};

