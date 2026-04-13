import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { MapPin, Check, Zap, CheckCircle2 } from "lucide-react-native";
import { getCourseStyle } from "../../utils/styleHelpers";
import type { ScheduleItem } from "../../types/schedule";

interface TimeLineProps {
  event: ScheduleItem;
  isLast: boolean;
  onClick: (event: ScheduleItem) => void;
  onMarkAttendance: (id: number, status: "present" | "absent") => void;
}

export default function TimelineItem({ event, isLast, onClick, onMarkAttendance }: TimeLineProps) {
  const isLive = event.status === 'live';
  const isCompleted = event.status === 'completed';
  const style = getCourseStyle(event.code);
  const Icon = style.icon;

  return (
    <TouchableOpacity 
      activeOpacity={0.9} 
      onPress={() => onClick(event)}
      className="flex-row gap-4"
    >
      {/* TIME COLUMN */}
      <View className="w-14 items-end pt-1">
        <Text className={`text-sm font-bold ${isLive ? style.color : isCompleted ? 'text-slate-500' : 'text-slate-200'}`}>
          {event.time}
        </Text>
        <Text className="text-[10px] text-slate-500">{event.endTime}</Text>
      </View>

      {/* TIMELINE DOT & LINE COLUMN */}
      <View className="items-center">
        <View 
          className={`w-3 h-3 rounded-full border-2 z-10 ${
            isLive 
              ? `bg-slate-950 ${style.border} scale-110 shadow-lg` 
              : isCompleted ? 'bg-slate-800 border-slate-600' : 'bg-slate-900 border-slate-400'
          }`}
          style={isLive ? { shadowColor: style.hexColor, shadowOpacity: 0.5, shadowRadius: 10 } : {}}
        />
        {!isLast && (
          <View 
            className={`w-[2px] flex-1 mt-1 mb-1 ${
              isLive ? 'bg-indigo-500' : 'bg-slate-800'
            }`} 
          />
        )}
      </View>

      {/* EVENT CARD */}
      <View className="flex-1 pb-8">
        <View 
          className={`rounded-2xl p-4 border overflow-hidden ${
            isLive 
              ? 'bg-slate-900 border-indigo-500/50 shadow-xl' 
              : isCompleted 
                ? 'bg-slate-900/20 border-white/5 opacity-60' 
                : `${style.bg} ${style.border}`
          }`}
        >
          {/* Watermark Icon (Absolute Positioned) */}
          <View className="absolute -right-4 -bottom-4 opacity-10">
            <Icon size={80} color={isLive ? "#6366f1" : style.hexColor} />
          </View>

          <View className="flex-row justify-between items-start mb-2">
            <View className="flex-1">
              <Text className={`font-bold text-base ${isLive ? 'text-white' : 'text-slate-200'}`}>
                {event.subject}
              </Text>
              <View className="flex-row items-center gap-1 mt-1">
                <MapPin size={12} color={isLive ? "#818cf8" : "#94a3b8"} />
                <Text className={`text-xs ${isLive ? 'text-indigo-100' : 'text-slate-400'}`}>
                   {event.room} • {event.type}
                </Text>
              </View>
            </View>

            {event.code !== 'CLUB' && (
              <View className={`px-2 py-1 rounded-lg border flex-row items-center gap-1.5 ${
                isLive ? 'bg-indigo-500/20 border-indigo-400' : `${style.bg} ${style.border}`
              }`}>
                <Icon size={10} color={isLive ? "white" : style.hexColor} />
                <Text className={`text-[9px] font-bold uppercase ${isLive ? 'text-white' : style.color}`}>
                  {event.code}
                </Text>
              </View>
            )}
          </View>

          {/* ATTENDANCE ACTIONS */}
          {(isLive || isCompleted) && event.code !== 'CLUB' && !event.attendanceStatus && (
            <View className="flex-row gap-2 mt-3">
              <TouchableOpacity 
                onPress={() => onMarkAttendance(event.id, 'present')}
                className="flex-1 flex-row bg-emerald-500/20 border border-emerald-500/30 py-2 rounded-lg items-center justify-center gap-1"
              >
                <Check size={12} color="#10b981" />
                <Text className="text-emerald-100 text-xs font-bold">Present</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => onMarkAttendance(event.id, 'absent')}
                className="flex-1 flex-row bg-rose-500/20 border border-rose-500/30 py-2 rounded-lg items-center justify-center gap-1"
              >
                <Zap size={12} color="#f43f5e" />
                <Text className="text-rose-100 text-xs font-bold">Bunk</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* ATTENDANCE STATUS INDICATOR */}
          {event.attendanceStatus && (
            <View className={`mt-3 flex-row items-center gap-1.5 px-3 py-1.5 rounded-lg border self-start ${
              event.attendanceStatus === 'present' ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-rose-500/10 border-rose-500/30'
            }`}>
              {event.attendanceStatus === 'present' ? <CheckCircle2 size={12} color="#34d399"/> : <Zap size={12} color="#f43f5e"/>}
              <Text className={`text-xs font-bold ${event.attendanceStatus === 'present' ? 'text-emerald-300' : 'text-rose-300'}`}>
                {event.attendanceStatus === 'present' ? 'Marked Present' : 'Bunk Logged'}
              </Text>
            </View>
          )}

          {/* CLASSMATES PREVIEW */}
          {(!((isLive || isCompleted) && !event.attendanceStatus)) && event.classmates?.length > 0 && (
            <View className="flex-row mt-3 items-center">
              <View className="flex-row -space-x-2">
                {event.classmates.slice(0, 3).map((name, i) => (
                  <View key={i} className="w-6 h-6 rounded-full bg-slate-700 border border-slate-950 items-center justify-center">
                    <Text className="text-[8px] text-white font-bold">{name[0]}</Text>
                  </View>
                ))}
              </View>
              {event.classmates.length > 3 && (
                <Text className={`text-[10px] ml-2 ${isLive ? 'text-indigo-100' : 'text-slate-500'}`}>
                  +{event.classmates.length - 3} others
                </Text>
              )}
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}