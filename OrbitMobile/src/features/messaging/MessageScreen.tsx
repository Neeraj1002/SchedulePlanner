import React from 'react';
import { View, Text, TouchableOpacity, Image, TextInput, ScrollView } from 'react-native';
import { ArrowLeft, Edit3, Search, Cpu } from 'lucide-react-native';

export const MessagesScreen = ({ navigation }: any) => {
  return (
    <View className="flex-1 bg-[#050915] p-6">
      {/* HEADER */}
      <View className="flex-row justify-between items-center mb-6">
        <View className="flex-row items-center gap-4">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ArrowLeft size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-white text-2xl font-black">Messages</Text>
        </View>
        <TouchableOpacity className="w-10 h-10 rounded-full bg-white/5 items-center justify-center border border-white/5">
          <Edit3 size={20} color="white" opacity={0.7} />
        </TouchableOpacity>
      </View>

      {/* SEARCH BAR */}
      <View className="bg-white/5 flex-row items-center p-4 rounded-2xl border border-white/10 mb-6">
        <Search size={20} color="#64748b" />
        <TextInput 
          placeholder="Search chats..." 
          placeholderTextColor="#64748b"
          className="ml-3 text-white flex-1"
        />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* GROUP CHAT ITEM */}
        <TouchableOpacity className="flex-row items-center justify-between mb-6">
          <View className="flex-row items-center flex-1">
            <View className="w-12 h-12 rounded-2xl bg-indigo-500/10 items-center justify-center border border-indigo-500/20">
              <Cpu size={22} color="#818cf8" />
            </View>
            <View className="ml-4 flex-1">
              <Text className="text-white font-bold text-base">Analog Circuits</Text>
              <Text className="text-slate-500 text-sm" numberOfLines={1}>
                Vikram: I'm stuck on question 3. The equation doesn't b...
              </Text>
            </View>
          </View>
          <View className="items-end">
            <Text className="text-indigo-400 text-[10px] font-bold mb-1">10:29 AM</Text>
            <View className="bg-[#4B48FF] rounded-full w-5 h-5 items-center justify-center">
              <Text className="text-white text-[10px] font-bold">2</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* INDIVIDUAL CHAT ITEM */}
        <TouchableOpacity className="flex-row items-center justify-between mb-6">
          <View className="flex-row items-center flex-1">
            <View className="relative">
              <Image source={{ uri: 'https://i.pravatar.cc/150?u=rohan' }} className="w-12 h-12 rounded-full" />
              <View className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#050915]" />
            </View>
            <View className="ml-4 flex-1">
              <Text className="text-white font-bold text-base">Rohan</Text>
              <Text className="text-slate-500 text-sm">Yeah, just left the hostel. Want me to grab a seat?</Text>
            </View>
          </View>
          <Text className="text-slate-600 text-[10px] font-bold">12:32 PM</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};