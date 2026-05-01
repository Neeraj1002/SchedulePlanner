import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Switch } from 'react-native';
import { Calendar, Clock, MapPin, ChevronRight, Check } from 'lucide-react-native';

const COLORS = ['#475569', '#EF4444', '#F97316', '#F59E0B', '#10B981', '#14B8A6', '#0891B2', '#3B82F6', '#6366F1', '#A855F7', '#D946EF', '#E11D48'];

export const NewEventScreen = ({ navigation }: any) => {
  const [selectedColor, setSelectedColor] = useState('#6366F1');
  const [isAllDay, setIsAllDay] = useState(false);

  return (
    <View className="flex-1 bg-[#050915]">
      {/* Header */}
      <View className="flex-row justify-between items-center px-6 pt-14 pb-4 border-b border-white/5">
        <TouchableOpacity onPress={() => navigation.goBack()}><Text className="text-slate-400 text-base">Cancel</Text></TouchableOpacity>
        <Text className="text-white text-lg font-black">New Event</Text>
        <TouchableOpacity><Text className="text-indigo-400 font-bold text-base">Add Event</Text></TouchableOpacity>
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ padding: 24, paddingBottom: 100 }}>
        {/* Preview Card */}
        <View className="bg-[#1A1F2E] p-6 rounded-[32px] border border-indigo-500/30 mb-8 relative overflow-hidden">
          <View className="flex-row gap-2 mb-4">
             <View className="bg-indigo-500/20 px-2 py-1 rounded-md"><Text className="text-indigo-300 text-[10px] font-bold">PERSONAL</Text></View>
             <View className="bg-slate-800 px-2 py-1 rounded-md"><Text className="text-slate-400 text-[10px] font-bold">Only Me</Text></View>
          </View>
          <Text className="text-white text-3xl font-black mb-4">Event Title...</Text>
          <View className="flex-row items-center mb-2 gap-2">
            <Calendar size={14} color="#6366F1" />
            <Text className="text-slate-400 text-xs font-bold">Tue, Mar 31</Text>
          </View>
          <View className="flex-row items-center gap-2">
            <Clock size={14} color="#6366F1" />
            <Text className="text-slate-400 text-xs font-bold">2:00 PM - 3:00 PM</Text>
          </View>
          <Calendar size={60} color="white" opacity={0.05} style={{ position: 'absolute', right: 20, top: 40 }} />
        </View>

        <TextInput placeholder="Event Title" placeholderTextColor="#1e293b" className="text-4xl font-black text-white mb-8" />

        {/* Date/Time Toggle */}
        <View className="bg-[#0F121E] rounded-3xl overflow-hidden border border-white/5 mb-8">
           <View className="flex-row justify-between items-center p-5 border-b border-white/5">
              <Text className="text-white font-bold">All-day</Text>
              <Switch value={isAllDay} onValueChange={setIsAllDay} trackColor={{ false: '#1e293b', true: '#6366F1' }} />
           </View>
           <TouchableOpacity className="flex-row justify-between p-5 border-b border-white/5">
              <Text className="text-slate-500 font-bold">Date</Text>
              <Text className="text-white font-bold">Tue, Mar 31</Text>
           </TouchableOpacity>
        </View>

        {/* Color Theme Selector */}
        <Text className="text-slate-500 font-bold text-xs mb-4 uppercase tracking-widest">Color Theme</Text>
        <View className="flex-row flex-wrap gap-4 mb-10">
          {COLORS.map(color => (
            <TouchableOpacity 
              key={color} 
              onPress={() => setSelectedColor(color)}
              className="w-10 h-10 rounded-full items-center justify-center"
              style={{ backgroundColor: color }}
            >
              {selectedColor === color && <Check size={16} color="white" strokeWidth={4} />}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};