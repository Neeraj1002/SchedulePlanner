import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { X, Image, Edit3, ChevronRight } from 'lucide-react-native';

export const NewClassModal = ({ navigation }: any) => (
  <View className="flex-1 justify-center items-center bg-black/60 px-6">
    <View className="bg-[#0F121E] w-full rounded-[40px] p-8 border border-white/10 relative">
      <TouchableOpacity 
        onPress={() => navigation.goBack()}
        className="absolute top-6 right-6"
      ><X size={24} color="#64748b" /></TouchableOpacity>

      <Text className="text-white text-2xl font-black text-center mb-2">✨ Add your classes! ✨</Text>
      <Text className="text-slate-400 text-center mb-8">Easily add all your classes at once by uploading a screenshot!</Text>

      {/* Upload Button */}
      <TouchableOpacity className="bg-[#4B48FF] w-full py-5 rounded-3xl flex-row justify-center items-center mb-4 shadow-xl shadow-indigo-500/40">
        <Image size={20} color="white" />
        <Text className="text-white font-black text-lg ml-2">Upload your class schedule</Text>
      </TouchableOpacity>

      {/* Manual Button */}
      <TouchableOpacity className="bg-white/5 w-full p-6 rounded-3xl border border-white/5 flex-row justify-between items-center">
        <View className="flex-row items-center">
          <Edit3 size={24} color="#64748b" />
          <View className="ml-4">
            <Text className="text-white font-bold">Add classes manually</Text>
            <Text className="text-slate-500 text-xs">Type in details one-by-one.</Text>
          </View>
        </View>
        <ChevronRight size={20} color="#334155" />
      </TouchableOpacity>
    </View>
  </View>
);