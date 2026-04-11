import Header from '@/src/components/Header';
import customAPI from '@/src/config/api';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useState } from "react";
import { ActivityIndicator, Alert, Image, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
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

  const handleCreateFeed = async () => {
    if (!caption || !image) {
      Alert.alert("Error", "Caption dan gambar harus diisi");
      return;
    }

    const formData = new FormData();
    formData.append("caption", caption);
    formData.append("image", {
      uri: image,
      name: `photo_${Date.now()}.jpg`,
      type: "image/jpeg",
    } as any);

    try {
      setLoading(true);
      await customAPI.post("/feed", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      
      setLoading(false);

      Alert.alert("Sukses", "Postingan berhasil dibuat");
      router.push("/(tabs)");

    } catch (error) {
      console.log("Errornya apa mas ? : ", error);
    }
  }
  
  return (
    <ScrollView className='flex-1 bg-gray-100'>
      <SafeAreaView>
        <Header/>
        {/* Image Upload */}
        <View className="p-5">
        <View className='bg-white rounded-2xl p-4 shadow mb-5'>
          {image ? (
            <Image source={{ uri: image }} 
              className='w-full h-64 rounded-lg mb-4' 
            />
          ): (
            <TouchableOpacity onPress={pickImage}>
              <View className='w-full h-64 rounded-xl bg-gray-200 justify-center items-center mb-4'>
                <Feather name='image' size={40} color={"gray"}/>
                <Text className='text-gray-500 mt-2'>Upload Gambar Postingan</Text>
              </View>
            </TouchableOpacity>
          )}
        </View>
        {/* caption */}
        <View className='bg-white rounded-2xl p-4 shadow mb-5'>
          <Text className='text-lg font-semibold mb-2'>Caption</Text>
          <TextInput 
            placeholder='Tulis sesuatu untuk postingan' 
            value={caption} 
            onChangeText={setCaption} 
            multiline 
            className='border border-gray-200 rounded-lg p-4 text-gray-700'
          />
        </View>
        <TouchableOpacity onPress={handleCreateFeed} disabled={loading} className="bg-active py-4 rounded-xl items-center">
          {loading ? (
            <ActivityIndicator color={"white"}/>
          ) : (
            <Text className="text-white text-lg font-semibold">Upload Post</Text>
          )}
        </TouchableOpacity>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};

export default CreateScreen;
