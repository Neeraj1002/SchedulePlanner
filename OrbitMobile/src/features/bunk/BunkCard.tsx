import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Zap, ShieldCheck, ShieldAlert } from "lucide-react-native";
import Svg, { Circle } from "react-native-svg";
import GlassCard from "../../components/ui/GlassCard";

interface BunkCardProps {
  stat: {
    id: number;
    code: string;
    subject: string;
    attended: number;
    total: number;
  };
  onLogBunk: (id: number) => void;
}

export const BunkCard = ({ stat, onLogBunk }: BunkCardProps) => {
  // Logic remains exactly as your web version
  const percentage = Math.round((stat.attended / stat.total) * 100);
  const isSafe = percentage >= 75;
  const safeBunks = Math.floor(stat.attended / 0.75 - stat.total);
  const classesNeeded = !isSafe ? Math.ceil((0.75 * stat.total - stat.attended) / 0.25) : 0;

  // SVG Math
  const radius = 24;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <View className="bg-[#0F121E] rounded-[24px] p-5 border border-white/5 shadow-xl">
      <View className="flex-row justify-between items-start mb-4">
        <View className="flex-1 pr-2">
          
          <View className="flex-row items-center gap-2 mb-2">
            <View className="px-2 py-1 rounded-md bg-slate-800 border border-white/5">
              <Text className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{stat.code}</Text>
            </View>
            <View className={`flex-row items-center gap-1 px-2 py-1 rounded-md border ${isSafe ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-rose-500/10 border-rose-500/20'}`}>
              {isSafe ? <ShieldCheck size={12} color="#10B981" /> : <ShieldAlert size={12} color="#F43F5E" />}
              <Text className={`text-[10px] font-black uppercase tracking-wider ${isSafe ? 'text-emerald-400' : 'text-rose-400'}`}>
                {isSafe ? 'Safe' : 'Critical'}
              </Text>
            </View>
          </View>
          
          <Text className="font-black text-white text-xl mb-1 tracking-tight">{stat.subject}</Text>
          <Text className="text-xs text-slate-400 font-medium">Attended {stat.attended} out of {stat.total} classes</Text>
        </View>

        {/* CIRCULAR PROGRESS RING */}
        <View className="relative w-14 h-14 items-center justify-center">
          <Svg width="56" height="56" viewBox="0 0 56 56" style={{ transform: [{ rotate: '-90deg' }] }}>
            <Circle
              cx="28" cy="28" r={radius}
              stroke="#1E293B" 
              strokeWidth="4"
              fill="transparent"
            />
            <Circle
              cx="28" cy="28" r={radius}
              stroke={isSafe ? "#10B981" : "#F43F5E"}
              strokeWidth="4"
              fill="transparent"
              strokeDasharray={`${circumference} ${circumference}`}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
            />
          </Svg>
          <View className="absolute inset-0 items-center justify-center">
             <Text className="text-xs font-black text-white">{percentage}%</Text>
          </View>
        </View>
      </View>

      <View className="flex-row items-center justify-between pt-4 border-t border-white/5">
        
        {/* Dynamic Footer Sentence */}
        <View className="flex-row items-center">
          <Text className="text-xs font-bold text-slate-300">
            {isSafe ? "You can safely bunk " : "Attend "}
          </Text>
          <Text className={`text-xs font-black ${isSafe ? "text-emerald-400" : "text-rose-400"}`}>
            {isSafe ? safeBunks : classesNeeded}
          </Text>
          <Text className="text-xs font-bold text-slate-300">
            {isSafe ? " more" : " more to be safe"}
          </Text>
        </View>
        
        {/* Dynamic Button */}
        <TouchableOpacity
          onPress={() => onLogBunk(stat.id)}
          disabled={!isSafe && safeBunks <= 0}
          activeOpacity={0.7}
          className={`px-4 py-2.5 rounded-xl flex-row items-center gap-1.5 shadow-lg ${
            (!isSafe || safeBunks <= 0) 
              ? 'bg-white/5 border border-white/5' 
              : 'bg-[#5E5CE6] shadow-indigo-500/40'
          }`}
        >
          <Text className={`text-xs font-bold ${(!isSafe || safeBunks <= 0) ? 'text-slate-500' : 'text-white'}`}>
            Log Bunk
          </Text>
          <Zap size={14} color={(!isSafe || safeBunks <= 0) ? "#64748b" : "white"} fill={isSafe ? "white" : "transparent"} />
        </TouchableOpacity>

      </View>
    </View>
  );
};