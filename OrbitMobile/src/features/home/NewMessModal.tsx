import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { X, Image as ImageIcon, FileText, Utensils } from 'lucide-react-native';

export const NewMessModal = ({ navigation }: any) => (
  <View className="flex-1 justify-center items-center bg-black/60 px-8">
    <View className="bg-[#0F121E] w-full rounded-[32px] p-6 border border-white/10 shadow-2xl relative">
      {/* Close Button */}
      <TouchableOpacity 
        onPress={() => navigation.goBack()}
        className="absolute top-5 right-5 z-10"
      >
        <X size={20} color="#64748b" />
      </TouchableOpacity>

      <Text className="text-white text-2xl font-black mb-6">Mess Menu</Text>

      <View className="bg-white/5 rounded-3xl p-5 border border-white/5 mb-6">
        <Text className="text-slate-500 text-[10px] font-bold text-center uppercase tracking-widest mb-4">
          Share today's menu with the campus
        </Text>
        
        <div className="flex-row gap-3">
          <TouchableOpacity className="flex-1 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl p-6 items-center justify-center">
            <ImageIcon size={28} color="#818cf8" />
            <Text className="text-indigo-300 font-bold text-xs mt-3">Add Photo</Text>
          </TouchableOpacity>

          <TouchableOpacity className="flex-1 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl p-6 items-center justify-center">
            <FileText size={28} color="#818cf8" />
            <Text className="text-indigo-300 font-bold text-xs mt-3">Upload PDF</Text>
          </TouchableOpacity>
        </div>
      </View>

      <TouchableOpacity className="bg-white/5 py-5 rounded-2xl border border-white/10 flex-row justify-center items-center">
        <Utensils size={18} color="#94a3b8" />
        <Text className="text-white font-bold ml-2">View Today's Menu</Text>
      </TouchableOpacity>
    </View>
  </View>
);