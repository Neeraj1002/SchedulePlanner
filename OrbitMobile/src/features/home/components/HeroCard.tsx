import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { MapPin, CheckCircle2, Zap, LayoutGrid, BarChart3 } from "lucide-react-native";
import Svg, { Circle } from "react-native-svg";
import type { AppTab } from "../../../types";

interface HeroCardProps {
  currentClass: any;
  upcomingEvents: any[];
  onCourseSelect: (event: any) => void;
  onMarkAttendance: (id: number, status: "present" | "absent") => void;
  onNavigate: (tab: AppTab) => void;
  formattedDate: string;
}

export const HeroCard: React.FC<HeroCardProps> = ({
  currentClass,
  upcomingEvents,
  onCourseSelect,
  onMarkAttendance,
  onNavigate,
  formattedDate
}) => {
  if (!currentClass) return null;

  const nextEvent = upcomingEvents?.[0];
  const attendancePercent = 66; // You can make this dynamic later
  const radius = 24;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (attendancePercent / 100) * circumference;

  return (
    <View className="px-4 space-y-4">
      {/* "Happening Now" Hero Card Container */}
      <View className="relative">
        {/* Glow Effect - Using a fixed background for stability on Web/Mobile */}
        <View 
          className="absolute inset-0 bg-indigo-600/20 rounded-[32px]" 
          style={{ transform: [{ scale: 1.05 }], filter: 'blur(20px)' } as any} 
        />

        <TouchableOpacity 
          activeOpacity={0.95}
          onPress={() => onCourseSelect(currentClass)}
          className="bg-[#0f172a]/90 border border-indigo-500/30 rounded-[32px] overflow-hidden shadow-2xl"
        >
          <View className="p-6">
            <View className="flex-row justify-between items-start mb-6">
              <View className="flex-1">
                <View className="flex-row items-center mb-2">
                  {/* Status Indicator Dot */}
                  <View className="w-2 h-2 rounded-full bg-rose-500 mr-2 shadow-[0_0_8px_rgba(244,63,94,0.5)]" />
                  <Text className="text-xs font-bold text-indigo-300 uppercase tracking-widest">
                    {currentClass.status === 'live' ? 'Live Now' : 'Up Next'} • 35m left
                  </Text>
                </View>

                <Text className="text-2xl font-bold text-white mb-2">
                  {currentClass.subject}
                </Text>

                <View className="flex-row items-center space-x-4">
                  <View className="flex-row items-center mr-4">
                    <MapPin size={14} color="#818cf8" />
                    <Text className="text-slate-300 text-sm ml-1.5">{currentClass.room}</Text>
                  </View>

                  {/* Quick Action Buttons */}
                  {!currentClass.attendanceStatus && (
                    <View className="flex-row space-x-2">
                      <TouchableOpacity 
                        onPress={() => onMarkAttendance(currentClass.id, 'present')}
                        className="w-8 h-8 rounded-full bg-emerald-500/20 items-center justify-center border border-emerald-500/30"
                      >
                        <CheckCircle2 size={14} color="#34d399" strokeWidth={3} />
                      </TouchableOpacity>
                      <TouchableOpacity 
                        onPress={() => onMarkAttendance(currentClass.id, 'absent')}
                        className="w-8 h-8 rounded-full bg-rose-500/20 items-center justify-center border border-rose-500/30"
                      >
                        <Zap size={14} color="#f43f5e" fill="#f43f5e" />
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </View>

              {/* Attendance Ring Graph */}
              <View className="relative w-16 h-16 items-center justify-center">
                <Svg width="64" height="64" viewBox="0 0 64 64" style={{ transform: [{ rotate: '-90deg' }] }}>
                  <Circle cx="32" cy="32" r="28" stroke="#1e293b" strokeWidth="4" fill="transparent" />
                  <Circle 
                    cx="32" cy="32" r="28" 
                    stroke="#f43f5e" 
                    strokeWidth="4" 
                    fill="transparent" 
                    strokeDasharray="175" 
                    strokeDashoffset="60" // Matches your 66% look
                    strokeLinecap="round"
                  />
                </Svg>
                <View className="absolute items-center justify-center">
                  <Text className="text-sm font-bold text-white">66%</Text>
                  <Text className="text-[8px] text-slate-400 uppercase font-bold">Attnd</Text>
                </View>
              </View>
            </View>

            {/* Bunk Manager Button */}
            <TouchableOpacity 
              onPress={() => onNavigate('bunk')}
              className="w-full bg-indigo-600 py-4 rounded-2xl flex-row items-center justify-center space-x-2 shadow-lg"
            >
              <BarChart3 size={18} color="white" />
              <Text className="text-white font-bold text-sm">Bunk Manager</Text>
            </TouchableOpacity>
          </View>

          {/* Integrated Up Next Section */}
          {nextEvent && (
            <TouchableOpacity 
              onPress={() => onCourseSelect(nextEvent)}
              className="bg-black/20 p-5 flex-row justify-between items-center border-t border-white/5"
            >
              <View className="flex-row items-center space-x-4">
                <View className="w-10 h-10 rounded-xl bg-slate-800/50 border border-white/10 items-center justify-center">
                  <LayoutGrid size={18} color="#94a3b8" />
                </View>
                <View className="ml-3">
                  <Text className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-0.5">Up Next</Text>
                  <Text className="text-white font-bold text-sm leading-tight">{nextEvent.subject}</Text>
                  <Text className="text-slate-400 text-xs font-medium">{nextEvent.time} – {nextEvent.endTime}</Text>
                </View>
              </View>
              
              <View className="items-end">
                <Text className="text-[10px] font-bold text-emerald-500 uppercase">Starts</Text>
                <Text className="text-2xl font-black text-emerald-400 tracking-tight">5:13</Text>
              </View>
            </TouchableOpacity>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  buttonShadow: {
    shadowColor: "#4f46e5",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },
});