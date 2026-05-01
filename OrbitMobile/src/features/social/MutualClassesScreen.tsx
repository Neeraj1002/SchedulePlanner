import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ArrowLeft, Code, Cpu } from 'lucide-react-native';

export const MutualClassesScreen = ({ navigation, route }: any) => {
  const friendName = route?.params?.friendName || 'Rohan';

  return (
    <View className="flex-1 bg-[#050915]">
      {/* Header */}
      <View className="px-6 pt-14 pb-6 flex-row items-center border-b border-white/5 mb-4">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4">
          <ArrowLeft size={24} color="#94a3b8" />
        </TouchableOpacity>
        <View>
          <Text className="text-white font-black text-xl">Mutual Classes</Text>
          <Text className="text-slate-500 text-xs font-bold">You & {friendName}</Text>
        </View>
      </View>

      {/* Class List */}
      <View className="px-6">
        
        {/* Class 1 */}
        <TouchableOpacity className="bg-[#0F121E] rounded-3xl p-4 flex-row items-center border border-white/5 mb-4 shadow-lg">
          <View className="w-14 h-14 rounded-2xl bg-slate-800/80 items-center justify-center mr-4 border border-white/5">
            <Code size={22} color="#C4B5FD" />
          </View>
          <View className="flex-1">
            <Text className="text-white font-bold text-lg mb-0.5">Intro to CS</Text>
            <Text className="text-slate-500 text-xs font-medium">📍 LHC-101 • Lecture</Text>
          </View>
          <View className="bg-indigo-500/10 px-2 py-1 rounded-md border border-indigo-500/20">
             <Text className="text-indigo-400 text-[10px] font-black">CS101</Text>
          </View>
        </TouchableOpacity>

        {/* Class 2 */}
        <TouchableOpacity className="bg-[#0F121E] rounded-3xl p-4 flex-row items-center border border-white/5 mb-4 shadow-lg">
          <View className="w-14 h-14 rounded-2xl bg-slate-800/80 items-center justify-center mr-4 border border-white/5">
            <Cpu size={22} color="#38BDF8" />
          </View>
          <View className="flex-1">
            <Text className="text-white font-bold text-lg mb-0.5">Analog Circuits</Text>
            <Text className="text-slate-500 text-xs font-medium">📍 EE-Block • Lab</Text>
          </View>
          <View className="bg-[#38BDF8]/10 px-2 py-1 rounded-md border border-[#38BDF8]/20">
             <Text className="text-[#38BDF8] text-[10px] font-black">EE204</Text>
          </View>
        </TouchableOpacity>

      </View>
    </View>
  );
};