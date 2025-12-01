import React from 'react';
import { Modal, View, Text, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { FLAG_COLORS } from '../context/NotesContext';
import { useTranslation } from 'react-i18next';

const Icon = Ionicons as any;

interface FlagPickerProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (color?: string) => void;
  currentColor?: string;
}

const LABEL_KEYS = ['high', 'medium', 'low', 'done', 'custom'];

export const FlagPicker = ({ visible, onClose, onSelect, currentColor }: FlagPickerProps) => {
  const { t } = useTranslation();

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
          <View className="bg-white dark:bg-gray-800 rounded-t-3xl p-6 shadow-2xl">
            <View className="items-center mb-6">
              <View className="w-12 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full mb-4" />
              <Text className="text-lg font-bold text-gray-700 dark:text-gray-200">{t("flags.selectPriority")}</Text>
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
                      borderColor: currentColor === color ? '#A78BFA' : 'transparent'
                    }}
                  >
                    {currentColor === color && (
                      <Icon name="checkmark" size={24} color="white" />
                    )}
                  </View>
                  <Text className="text-xs text-gray-500 dark:text-gray-400 font-medium text-center">
                    {t(`flags.${LABEL_KEYS[index]}`)}
                  </Text>
                </TouchableOpacity>
              ))}

              {/* Remove Flag Option */}
              <TouchableOpacity
                onPress={() => onSelect(undefined)}
                className="items-center mb-4 w-[18%]"
              >
                <View className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 items-center justify-center mb-2 border border-gray-200 dark:border-gray-600">
                  <Icon name="close" size={24} color="#757575" />
                </View>
                <Text className="text-xs text-gray-500 dark:text-gray-400 font-medium text-center">{t("flags.none")}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </TouchableOpacity>
    </Modal>
  );
};

