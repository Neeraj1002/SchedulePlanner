import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Calendar, Compass } from "lucide-react-native";
import TimelineItem from "./TimelineItem";
import { DiscoverView } from "./DiscoverView";
import type { ScheduleItem } from "../../types/schedule";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];

interface ScheduleProps {
  events: ScheduleItem[];
  onCourseSelect: (event: ScheduleItem) => void;
  view: "my_schedule" | "discover";
  onViewChange: (view: "my_schedule" | "discover") => void;
  onMarkAttendance: (id: number, status: "present" | "absent") => void;
}

export default function ScheduleTab({ 
  events, 
  onCourseSelect, 
  view, 
  onViewChange, 
  onMarkAttendance 
}: ScheduleProps) {
  const [activeDayIndex, setActiveDayIndex] = useState(0);

  return (
    <ScrollView 
      className="flex-1 bg-slate-950 px-4 pt-12"
      contentContainerStyle={{ paddingBottom: 120 }}
      showsVerticalScrollIndicator={false}
    >
      <View className="flex-col gap-4 mb-6">
        <View>
          <Text className="text-3xl font-bold text-white tracking-tight">Schedule</Text>
          {view === 'discover' && (
            <Text className="text-slate-400 text-xs font-medium mt-1">
              Explore campus events
            </Text>
          )}
        </View>

        {/* Aesthetic Segmented Control */}
        <View className="flex-row bg-slate-900/80 p-1.5 rounded-2xl border border-white/10">
          <TouchableOpacity 
            onPress={() => onViewChange('my_schedule')}
            activeOpacity={0.7}
            className={`flex-1 flex-row items-center justify-center gap-2 py-3 rounded-xl ${
              view === 'my_schedule' ? 'bg-indigo-600' : ''
            }`}
          >
            <Calendar size={16} color={view === 'my_schedule' ? "white" : "#94a3b8"} />
            <Text className={`text-sm font-bold ${view === 'my_schedule' ? 'text-white' : 'text-slate-400'}`}>
              My Schedule
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => onViewChange('discover')}
            activeOpacity={0.7}
            className={`flex-1 flex-row items-center justify-center gap-2 py-3 rounded-xl ${
              view === 'discover' ? 'bg-indigo-600' : ''
            }`}
          >
            <Compass size={16} color={view === 'discover' ? "white" : "#94a3b8"} />
            <Text className={`text-sm font-bold ${view === 'discover' ? 'text-white' : 'text-slate-400'}`}>
              Discover
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {view === 'my_schedule' ? (
        <>
          {/* Date Scroller */}
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            className="flex-row mb-6"
            contentContainerStyle={{ gap: 12 }}
          >
            {DAYS.map((day, idx) => {
              const isActive = idx === activeDayIndex;
              return (
                <TouchableOpacity 
                  key={day} 
                  onPress={() => setActiveDayIndex(idx)}
                  activeOpacity={0.8}
                  className={`flex items-center justify-center w-[65px] py-4 rounded-2xl border ${
                    isActive 
                      ? 'bg-indigo-600 border-indigo-500' 
                      : 'bg-slate-900/40 border-slate-800'
                  }`}
                >
                  <Text className={`text-xs font-medium uppercase ${isActive ? 'text-white opacity-80' : 'text-slate-500'}`}>
                    {day}
                  </Text>
                  <Text className={`text-xl font-bold mt-1 ${isActive ? 'text-white' : 'text-slate-400'}`}>
                    {12 + idx}
                  </Text>
                  {isActive && <View className="w-1 h-1 rounded-full bg-white mt-1" />}
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Continuous Timeline */}
          <View className="gap-2">
            {events.map((event, index) => (
              <TimelineItem 
                key={event.id} 
                event={event} 
                isLast={index === events.length - 1} 
                onClick={() => onCourseSelect(event)}
                onMarkAttendance={onMarkAttendance}
              />
            ))}
            
            {/* Empty State visual */}
            <View className="items-center justify-center py-10 opacity-30">
              <View className="w-[1px] h-12 bg-slate-800" />
              <Text className="text-xs text-slate-400 mt-2 italic">End of scheduled events</Text>
            </View>
          </View>
        </>
      ) : (
        <DiscoverView />
      )}
    </ScrollView>
  );
}