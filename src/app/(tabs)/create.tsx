import Header from '@/src/components/Header';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const CreateScreen = () => {
  const [image, setImage] = useState<string | null>(null);
  const [caption, setCaption] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const router = useRouter();

  const pickImage = async () => {
    

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };
  
  return (
    <ScrollView className='flex-1 bg-gray-100'>
      <SafeAreaView>
        <Header/>
        {/* Image Upload */}
        <View className='bg-white rounded-2xl p-4 shadow mb-5'>
          {image ? (
            <Image source={{ uri: image }} 
              className='w-full h-64 rounded-lg mb-4' 
            />
          ): (
            <TouchableOpacity>
              <View className='w-full h-64 rounded-xl bg-gray-200 justify-center items-center mb-4'>
                <Feather name='image' size={40} color={"gray"}/>
                <Text className='text-gray-500 mt-2'>Upload Gambar Postingan</Text>
              </View>
            </TouchableOpacity>
          )}
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};

export default CreateScreen;
