import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import { RootStackParamList } from "../../types";
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { Search, Bell, Send, Utensils, Compass, ChevronRight } from "lucide-react-native";

import GlassCard from "../../components/ui/GlassCard";
import { FriendsOrbit } from "./components/FriendsOrbit";
import { HeroCard } from "./components/HeroCard";
import { DiscoverView } from "../schedule/DiscoverView";
import type { AppTab } from "../../types";

interface HomeTabProps {
  user: any;
  friends: any[];
  events: any[];
  onNavigate: (tab: AppTab) => void;
  onCourseSelect: (event: any) => void;
  onMenuSelect: () => void;
  onNavigateToDiscover: () => void;
  onMarkAttendance: (id: number, status: "present" | "absent") => void;
  onFriendSelect: (friend: any) => void;
}

export const HomeTab: React.FC<HomeTabProps> = ({
  user,
  friends,
  events,
  onNavigate,
  onCourseSelect,
  onMenuSelect,
  onNavigateToDiscover,
  onMarkAttendance,
  onFriendSelect,
}) => {
  const currentClass =
    events.find((e) => e.status === "live") ||
    events.find((e) => e.status === "upcoming") ||
    events[0];
  
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const upcomingEvents = events.filter(
    (e) => e.status === "upcoming" && e.id !== currentClass?.id
  );

  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  const [showDiscover, setShowDiscover] = useState(false);

  if (showDiscover) {
    return <DiscoverView />;
  }

  return (
  <View className="flex-1 bg-[#050915]">
    {/* ATMOSPHERIC GLOWS */}
    <View className="absolute top-[-100] left-[-50] w-[300] h-[300] bg-[#5E5CE6]/10 rounded-full blur-[100px]" style={{filter: 'blur(80px)'} as any} />
    <View className="absolute bottom-[20%] right-[-50] w-[250] h-[250] bg-[#8B5CF6]/10 rounded-full blur-[80px]" style={{filter: 'blur(60px)'} as any} />

    <ScrollView 
      className="flex-1 px-5"
      contentContainerStyle={{ paddingBottom: 140 }}
      showsVerticalScrollIndicator={false}
    >
      {/* HEADER: HI ARJUN */}
      <View className="flex-row justify-between items-center pt-14 pb-4">
        <View className="flex-row items-center gap-3">
          <View className="relative">
            <Image source={{ uri: user.avatar }} className="w-12 h-12 rounded-full border border-white/10" />
            <View className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-[#050915]" />
          </View>
          <View>
            <Text className="text-xl font-bold text-white">Hi, {user.name.split(' ')[0]}</Text>
            <Text className="text-[10px] font-medium text-slate-500 uppercase tracking-tighter">IIT Roorkee • Sem 4</Text>
          </View>
        </View>
        <View className="flex-row gap-2">
          <TouchableOpacity onPress={() => navigation.navigate('AddFriend')} className="w-10 h-10 rounded-full bg-white/5 items-center justify-center border border-white/5">
            <Search size={18} color="white" opacity={0.6} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Notifications')} className="w-10 h-10 rounded-full bg-white/5 items-center justify-center border border-white/5">
            <Bell size={18} color="white" opacity={0.6} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Messages')} className="w-10 h-10 rounded-full bg-white/5 items-center justify-center border border-white/5">
            <Send size={18} color="white" opacity={0.6} />
          </TouchableOpacity>
        </View>
      </View>

      <FriendsOrbit friends={friends} onFriendSelect={onFriendSelect} />

      {/* HERO SECTION (Includes the Date Header now) */}
      <HeroCard
        currentClass={currentClass}
        upcomingEvents={upcomingEvents}
        onCourseSelect={onCourseSelect}
        onMarkAttendance={onMarkAttendance}
        onNavigate={onNavigate}
        formattedDate={formattedDate}
      />

      {/* FULL WIDTH LUNCH WIDGET */}
      <TouchableOpacity 
        activeOpacity={0.9}
        onPress={onMenuSelect}
        className="mx-4 mt-6 bg-[#0F121E] rounded-[32px] p-6 border border-white/5 shadow-2xl overflow-hidden"
      >
      {/* ORANGE GLOW EFFECT (Mimicking the blur-2xl from your web code) */}
        <View 
          className="absolute -right-10 -top-10 w-32 h-32 bg-orange-500/10 rounded-full" 
          style={{ filter: 'blur(40px)' } as any} 
        />

        <View className="flex-row justify-between items-start mb-6">
          <View className="flex-1">
            <View className="flex-row items-center mb-2">
              <Utensils size={14} color="#F97316" />
              <Text className="text-[10px] font-black text-orange-400 uppercase tracking-widest ml-2">
                Today's Lunch
              </Text>
            </View>
      
            <Text className="text-3xl font-bold text-white leading-tight">
              Rajma Chawal
            </Text>
      
            <Text className="text-slate-400 text-sm mt-1 font-medium">
              w/ Jeera Aloo, Roti & Curd
            </Text>
          </View >

          {/* RATING BADGE: Matched to your target image */}
          <View className="bg-orange-500/10 px-4 py-2 rounded-2xl border border-orange-500/20 items-center justify-center">
            <Text className="text-orange-500 text-xl font-black">4.2</Text>
            <Text className="text-[8px] font-bold text-orange-500/60 uppercase">Rating</Text>
          </View>
        </View>

        {/* FOOTER: Avatars and Action */}
        <View className="flex-row justify-between items-center pt-4 border-t border-white/5">
          <View className="flex-row items-center">
            {/* Voter Initials Circles */}
            <View className="flex-row -space-x-2">
              <View className="w-7 h-7 rounded-full bg-[#5E5CE6] border-2 border-[#0F121E] items-center justify-center">
                <Text className="text-[10px] font-bold text-white">V</Text>
              </View>
              <View className="w-7 h-7 rounded-full bg-[#F43F5E] border-2 border-[#0F121E] items-center justify-center">
                <Text className="text-[10px] font-bold text-white">S</Text>
              </View>
              <View className="w-7 h-7 rounded-full bg-[#10B981] border-2 border-[#0F121E] items-center justify-center">
                <Text className="text-[10px] font-bold text-white">A</Text>
              </View>
            </View>
          </View>
          <Text className="text-slate-500 text-[10px] font-bold ml-3">142 votes</Text>
        </View>

        <View className="flex-row items-center">
          <Text className="text-orange-400 font-bold text-xs mr-1">View Full Menu</Text>
          <ChevronRight size={14} color="#F97316" />
        </View>
    </TouchableOpacity>
  </ScrollView>
  </View>
)};