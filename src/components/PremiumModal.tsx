import React from 'react';
import { Modal, View, Text, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTranslation } from 'react-i18next';

const Icon = Ionicons as any;

import { useNavigation } from '@react-navigation/native';

interface PremiumModalProps {
  visible: boolean;
  onClose: () => void;
  featureName: string;
}

export const PremiumModal = ({ visible, onClose, featureName }: PremiumModalProps) => {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();

  return (
    <Modal
      transparent
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end bg-black/60">
        <View className="bg-white dark:bg-gray-800 rounded-t-3xl p-8 items-center shadow-2xl">
          <View className="w-20 h-20 bg-[#EDE7F6] dark:bg-purple-900 rounded-full items-center justify-center mb-6 shadow-md">
            <Icon name="diamond" size={40} color="#5E35B1" />
          </View>
          
          <Text className="text-3xl font-bold text-gray-900 dark:text-white mb-2 text-center">
            {t("premium.modalTitle")}
          </Text>
          
          <Text className="text-gray-500 dark:text-gray-300 text-center mb-8 px-4 text-base leading-6">
            {t("premium.modalUnlockPrefix")} <Text className="font-bold text-[#5E35B1] dark:text-purple-400">{featureName}</Text> {t("premium.modalUnlockSuffix")}
          </Text>
          
          <View className="w-full gap-4">
            <TouchableOpacity 
              className="bg-[#7E57C2] p-5 rounded-2xl items-center shadow-lg"
              onPress={() => {
                onClose();
                navigation.navigate('Premium');
              }}
            >
              <Text className="text-white font-bold text-xl">{t("premium.viewPlans")}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              className="p-4 items-center"
              onPress={onClose}
            >
              <Text className="text-gray-500 dark:text-gray-400 font-semibold text-base">{t("common.maybeLater")}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

