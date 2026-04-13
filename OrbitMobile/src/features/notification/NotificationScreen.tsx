import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ArrowLeft, Clock } from 'lucide-react-native';

export const NotificationsScreen = ({ navigation }: any) => (
  <View className="flex-1 bg-[#050915] p-6">
    <View className="flex-row justify-between items-center mb-8">
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <ArrowLeft size={24} color="white" />
      </TouchableOpacity>
      <Text className="text-white text-xl font-black">Notifications</Text>
      <TouchableOpacity><Text className="text-indigo-400 font-bold">Mark all read</Text></TouchableOpacity>
    </View>

    {/* Reminder Notification */}
    <View className="bg-[#0F121E] p-5 rounded-3xl border border-white/5 mb-4">
      <View className="flex-row">
        <View className="w-12 h-12 rounded-2xl bg-rose-500/10 items-center justify-center mr-4">
          <Clock size={20} color="#f43f5e" />
        </View>
        <View className="flex-1">
          <View className="flex-row justify-between">
            <Text className="text-white font-bold text-base">Class Reminder</Text>
            <Text className="text-slate-500 text-[10px]">Just now</Text>
          </View>
          <Text className="text-slate-400 text-sm mt-1">Analog Circuits starts in 15 mins at EE-Block.</Text>
        </View>
      </View>
    </View>
  </View>
);