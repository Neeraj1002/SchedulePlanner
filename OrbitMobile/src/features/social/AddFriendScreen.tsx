import React from 'react';
import { View, Text, TouchableOpacity, Image, TextInput } from 'react-native';
import { Search, UserPlus } from 'lucide-react-native';

export const AddFriendScreen = ({ navigation }: any) => (
  <View className="flex-1 bg-[#050915] p-6">
    <View className="flex-row justify-between items-center mb-8">
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text className="text-slate-400 text-base">Cancel</Text>
      </TouchableOpacity>
      <Text className="text-white text-xl font-black">Add Friend</Text>
      <View className="w-10" /> {/* Spacer */}
    </View>

    <View className="bg-white/5 flex-row items-center p-4 rounded-2xl border border-white/10 mb-8">
      <Search size={20} color="#64748b" />
      <TextInput 
        placeholder="Search by name or roll no..." 
        placeholderTextColor="#64748b"
        className="ml-3 text-white flex-1"
      />
    </View>

    <Text className="text-slate-500 font-bold text-xs uppercase tracking-widest mb-4">Suggested For You</Text>
    {/* Suggested Friend Row */}
    <View className="bg-[#0F121E] p-4 rounded-3xl border border-white/5 flex-row justify-between items-center mb-3">
      <View className="flex-row items-center">
        <Image source={{ uri: 'avatar_url' }} className="w-12 h-12 rounded-full mr-4" />
        <View>
          <Text className="text-white font-bold text-base">Neha Sharma</Text>
          <Text className="text-slate-500 text-xs">Electrical Eng.</Text>
        </View>
      </View>
      <TouchableOpacity className="bg-white/5 w-10 h-10 rounded-full items-center justify-center border border-white/10">
        <UserPlus size={18} color="#818cf8" />
      </TouchableOpacity>
    </View>

    <TouchableOpacity className="mt-8 border border-indigo-500/30 p-5 rounded-3xl flex-row justify-center items-center">
      <Search size={20} color="#818cf8" />
      <Text className="text-indigo-400 font-bold ml-2 text-base">Scan QR Code</Text>
    </TouchableOpacity>
  </View>
);