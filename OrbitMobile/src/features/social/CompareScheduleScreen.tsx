import React, {useState} from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { ArrowLeft, Coffee, Users } from 'lucide-react-native';

export const CompareScheduleScreen = ({ navigation, route }: any) => {
  const friendName = route?.params?.friendName || 'Rohan';

  const MOCK_SCHEDULES: Record<string, any> = {
  'Mon': [
    { time: '09:00', endTime: '10:30', type: 'split', you: { title: 'Intro to CS', loc: 'LHC-101' }, friend: { title: 'Eng Drawing', loc: 'WS-2' } },
    { time: '10:30', endTime: '12:00', type: 'mutual_free', duration: '1.5 hrs' },
    { time: '12:00', endTime: '01:00', type: 'together', title: 'Economics', loc: 'LHC-202' }
  ],
  'Tue': [
    { time: '10:00', endTime: '11:00', type: 'together', title: 'Physics Lab', loc: 'Sci-Block' },
    { time: '11:00', endTime: '01:00', type: 'mutual_free', duration: '2 hrs' },
  ],
  // ... other days
};

  const weekDays = [
    { id: 'MON', date: '12' },
    { id: 'TUE', date: '13' },
    { id: 'WED', date: '14' },
    { id: 'THU', date: '15' },
    { id: 'FRI', date: '16' },
  ];

  const [selectedDay, setSelectedDay] = useState('Mon');

  const currentSchedule = MOCK_SCHEDULES[selectedDay] || [];

  return (
    <View className="flex-1 bg-[#050915]">
      {/* Header */}
      <View className="px-6 pt-14 pb-4 flex-row items-center border-b border-white/5">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4">
          <ArrowLeft size={24} color="#94a3b8" />
        </TouchableOpacity>
        <View className="flex-row items-center">
          {/* Overlapping Avatars */}
          <View className="flex-row mr-3">
            <View className="w-10 h-10 rounded-full bg-slate-700 items-center justify-center border-2 border-[#050915] z-10"><Text>😫</Text></View>
            <View className="w-10 h-10 rounded-full bg-slate-800 items-center justify-center border-2 border-[#050915] -ml-4"><Text>😍</Text></View>
          </View>
          <View>
            <Text className="text-white font-black text-lg">You & {friendName}</Text>
            <Text className="text-emerald-400 text-[10px] font-bold">● 3.5 hrs free today</Text>
          </View>
        </View>
      </View>

      {/* Horizontal Date Picker */}
      <View className="border-b border-white/5">
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 24, paddingVertical: 24 }}>
          {weekDays.map((day) => {
            const isActive = selectedDay === day.id;
            
            return (
              <TouchableOpacity
                key={day.id}
                onPress={() => setSelectedDay(day.id)}
                // Changed background to transparent when inactive to match Picture 2
                className={`w-16 h-20 rounded-2xl items-center justify-center mr-3 border ${
                  isActive 
                    ? 'bg-[#5E5CE6] border-transparent shadow-lg shadow-indigo-500/40' 
                    : 'bg-transparent border-white/10'
                }`}
              >
                <Text className={`text-xs font-bold uppercase mb-1 ${isActive ? 'text-indigo-200' : 'text-slate-500'}`}>
                  {day.id}
                </Text>
                <Text className={`text-xl font-black ${isActive ? 'text-white' : 'text-slate-400'}`}>
                  {day.date}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* --- TIMELINE LIST (Now dynamic based on selectedDay) --- */}
      <ScrollView className="flex-1 px-6 pt-6" contentContainerStyle={{ paddingBottom: 100 }}>
        
        {currentSchedule.length === 0 ? (
           <Text className="text-slate-500 text-center mt-10">No classes scheduled for {selectedDay}.</Text>
        ) : (
          currentSchedule.map((block: any, index: number) => (
            <View key={index} className="flex-row mb-8">
              {/* Timestamp Sidebar */}
              <View className="w-16 items-end pr-4 border-r border-slate-700 relative">
                <Text className={`${block.type === 'mutual_free' ? 'text-emerald-400' : block.type === 'together' ? 'text-purple-400' : 'text-white'} font-bold text-sm`}>{block.time}</Text>
                <Text className="text-slate-500 text-[10px]">{block.endTime}</Text>
                <View className={`absolute top-1 -right-[5px] w-2 h-2 rounded-full bg-[#050915] border-2 ${block.type === 'mutual_free' ? 'border-emerald-500' : block.type === 'together' ? 'border-purple-500' : 'border-slate-600'}`} />
              </View>

              {/* Dynamic Content Blocks */}
              <View className="flex-1 pl-4">
                
                {block.type === 'split' && (
                  <View className="flex-row gap-2">
                    <View className="flex-1 bg-[#0F121E] rounded-xl p-3 border border-indigo-500/20">
                      <Text className="text-indigo-400 text-[9px] font-black mb-1">YOU</Text>
                      <Text className="text-white font-bold text-sm mb-1">{block.you.title}</Text>
                      <Text className="text-slate-500 text-[10px]">📍 {block.you.loc}</Text>
                    </View>
                    <View className="flex-1 bg-[#0F121E] rounded-xl p-3 border border-white/5">
                      <Text className="text-slate-500 text-[9px] font-black mb-1 uppercase">{friendName}</Text>
                      <Text className="text-white font-bold text-sm mb-1">{block.friend.title}</Text>
                      <Text className="text-slate-500 text-[10px]">📍 {block.friend.loc}</Text>
                    </View>
                  </View>
                )}

                {block.type === 'mutual_free' && (
                  <View className="bg-[#064E3B]/30 border border-emerald-500/20 rounded-2xl p-4 flex-row items-center justify-between">
                    <View className="flex-row items-center">
                      <View className="w-10 h-10 rounded-xl bg-emerald-500/20 items-center justify-center mr-3 border border-emerald-500/30">
                        <Coffee size={18} color="#34D399" />
                      </View>
                      <View>
                        <Text className="text-emerald-400 font-bold text-base text-sm">Mutual Free Time</Text>
                        <Text className="text-emerald-600 text-xs font-bold">{block.duration}</Text>
                      </View>
                    </View>
                    <TouchableOpacity className="bg-emerald-500 px-3 py-1.5 rounded-lg shadow-lg shadow-emerald-500/30">
                      <Text className="text-emerald-950 font-black text-xs">Meet up</Text>
                    </TouchableOpacity>
                  </View>
                )}

                {block.type === 'together' && (
                  <View className="bg-[#4C1D95]/20 border border-purple-500/20 rounded-2xl p-4 flex-row items-center">
                    <View className="w-12 h-12 rounded-xl bg-purple-500/20 items-center justify-center mr-4 border border-purple-500/30">
                        <Users size={22} color="#A78BFA" />
                      </View>
                      <View>
                        <View className="bg-purple-500/20 self-start px-2 py-0.5 rounded text-[10px] mb-1"><Text className="text-purple-300 text-[9px] font-black">CLASS TOGETHER</Text></View>
                        <Text className="text-white font-bold text-base text-sm mb-0.5">{block.title}</Text>
                        <Text className="text-slate-500 text-xs">📍 {block.loc}</Text>
                      </View>
                  </View>
                )}

              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};