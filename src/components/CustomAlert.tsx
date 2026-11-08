import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Modal from "react-native-modal";

interface CustomAlertProps {
  isVisible: boolean;
  title: string;
  message: string;
  onCancel?: () => void; // Optional
  onConfirm: () => void;
  confirmText?: string;
  cancelText?: string;
  showCancel?: boolean; // New prop
}

const CustomAlert: React.FC<CustomAlertProps> = ({
  isVisible,
  title,
  message,
  onCancel,
  onConfirm,
  confirmText = "OK",
  cancelText = "Batal",
  showCancel = true, // Default true
}) => {
  return (
    <Modal isVisible={isVisible} onBackdropPress={showCancel ? onCancel : undefined} animationIn="zoomIn" animationOut="zoomOut">
      <View className="bg-white rounded-2xl p-6 items-center">
        <Text className="text-xl font-bold mb-2">{title}</Text>
        <Text className="text-gray-600 mb-6 text-center">{message}</Text>
        <View className="flex-row gap-4">
          {showCancel && (
            <TouchableOpacity onPress={onCancel} className="px-6 py-3 bg-gray-200 rounded-lg">
              <Text className="text-gray-700 font-semibold">{cancelText}</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={onConfirm} className="px-6 py-3 bg-active rounded-lg">
            <Text className="text-white font-semibold">{confirmText}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default CustomAlert;
