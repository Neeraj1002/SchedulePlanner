import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { BunkCard } from "./BunkCard";

interface BunkTabProps {
  stats: {
    id: number;
    code: string;
    subject: string;
    attended: number;
    total: number;
  }[];
  handleLogBunk: (id: number) => void;
}

export const BunkTab = ({ stats, handleLogBunk }: BunkTabProps) => {
  return (
    <ScrollView 
      className="flex-1 bg-[#050915] px-6 pt-14"
      contentContainerStyle={{ paddingBottom: 140 }}
      showsVerticalScrollIndicator={false}
    >
      {/* HEADER SECTION */}
      <View className="mb-8">
        <Text className="text-white text-3xl font-black mb-1">
          Bunk Manager
        </Text>
        <Text className="text-slate-400 text-sm font-medium">
          Strategic attendance tracking (75% Rule).
        </Text>
      </View>

      {/* STATS LIST */}
      <View className="gap-4">
        {stats.map((stat) => (
          <BunkCard 
            key={stat.id} 
            stat={stat} 
            onLogBunk={handleLogBunk} 
          />
        ))}
      </View>
    </ScrollView>
  );
};