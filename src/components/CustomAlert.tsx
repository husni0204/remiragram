import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Modal from "react-native-modal";

interface CustomAlertProps {
  isVisible: boolean;
  title: string;
  message: string;
  onCancel: () => void;
  onConfirm: () => void;
  confirmText?: string;
  cancelText?: string;
}

const CustomAlert: React.FC<CustomAlertProps> = ({
  isVisible,
  title,
  message,
  onCancel,
  onConfirm,
  confirmText = "Hapus",
  cancelText = "Batal",
}) => {
  return (
    <Modal isVisible={isVisible} onBackdropPress={onCancel} animationIn="zoomIn" animationOut="zoomOut">
      <View className="bg-white rounded-2xl p-6 items-center">
        <Text className="text-xl font-bold mb-2">{title}</Text>
        <Text className="text-gray-600 mb-6 text-center">{message}</Text>
        <View className="flex-row gap-4">
          <TouchableOpacity onPress={onCancel} className="px-6 py-3 bg-gray-200 rounded-lg">
            <Text className="text-gray-700 font-semibold">{cancelText}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onConfirm} className="px-6 py-3 bg-red-500 rounded-lg">
            <Text className="text-white font-semibold">{confirmText}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default CustomAlert;
