import React from "react";
import { View, Text, TouchableOpacity, ScrollView, TextInput } from "react-native"; 

export const NewTodoScreen = ({ navigation }: any) => (
  <ScrollView className="flex-1 bg-[#050915]">
    {/* Header */}
    <View className="flex-row justify-between items-center p-6 border-b border-white/5">
      <TouchableOpacity onPress={() => navigation.goBack()}><Text className="text-slate-400">Cancel</Text></TouchableOpacity>
      <Text className="text-white text-lg font-black">New To-Do</Text>
      <TouchableOpacity><Text className="text-indigo-400 font-bold">Save Task</Text></TouchableOpacity>
    </View>

    <View className="p-6">
      {/* Task Preview Card */}
      <View className="bg-[#1A1F2E] p-4 rounded-3xl border border-indigo-500/30 mb-8">
        <Text className="text-white font-bold text-lg">What needs to be done?</Text>
        <View className="flex-row gap-2 mt-2">
          <View className="bg-indigo-500/20 px-2 py-1 rounded-md"><Text className="text-indigo-300 text-[10px] font-bold">ACADEMIC</Text></View>
          <View className="bg-orange-500/20 px-2 py-1 rounded-md"><Text className="text-orange-300 text-[10px] font-bold">Medium 🟡</Text></View>
        </View>
      </View>

      {/* Input Field */}
      <TextInput 
        placeholder="Task Name" 
        placeholderTextColor="#334155" 
        className="text-4xl font-black text-white mb-8"
      />

      {/* Categories (Academic, Personal, etc.) */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-8">
        <TouchableOpacity className="bg-white px-6 py-3 rounded-2xl mr-3"><Text className="font-bold">Academic 📚</Text></TouchableOpacity>
        <TouchableOpacity className="bg-slate-800 px-6 py-3 rounded-2xl mr-3"><Text className="text-white font-bold">Personal 👤</Text></TouchableOpacity>
      </ScrollView>

      {/* Priority Selection */}
      <Text className="text-slate-500 font-bold text-xs mb-3 uppercase">Priority</Text>
      <View className="flex-row gap-3">
        <TouchableOpacity className="flex-1 bg-slate-800 p-4 rounded-2xl items-center border border-white/5"><Text className="text-white">Low 🟢</Text></TouchableOpacity>
        <TouchableOpacity className="flex-1 bg-slate-900 p-4 rounded-2xl items-center border-2 border-white/40"><Text className="text-white font-bold">Medium 🟡</Text></TouchableOpacity>
        <TouchableOpacity className="flex-1 bg-slate-800 p-4 rounded-2xl items-center border border-white/5"><Text className="text-white">High 🔴</Text></TouchableOpacity>
      </View>
    </View>
  </ScrollView>
);