import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Users, Plus, Check } from "lucide-react-native";
import GlassCard from "../../components/ui/GlassCard";

interface DiscoverItem {
  id: number;
  title: string;
  category: string;
  subscribers: string;
  isSubscribed: boolean;
  hexColor: string; // Added for Lucide and specific styling
  tailwindBg: string;
}

interface DiscoverViewProps {
  schedules?: DiscoverItem[];
  onToggleSubscribe?: (id: number) => void;
}

const SUGGESTED_SCHEDULES: DiscoverItem[] = [
  {
    id: 1,
    title: "Azad Hostel Mess",
    category: "Food",
    subscribers: "1.2k",
    isSubscribed: true,
    hexColor: "#fb923c", // orange-400
    tailwindBg: "bg-orange-500/20",
  },
  {
    id: 2,
    title: "Placement Deadlines",
    category: "Career",
    subscribers: "3.5k",
    isSubscribed: true,
    hexColor: "#60a5fa", // blue-400
    tailwindBg: "bg-blue-500/20",
  },
  {
    id: 3,
    title: "Inter-IIT Sports",
    category: "Sports",
    subscribers: "850",
    isSubscribed: false,
    hexColor: "#34d399", // emerald-400
    tailwindBg: "bg-emerald-500/20",
  },
  {
    id: 4,
    title: "CSE Dept Seminars",
    category: "Academic",
    subscribers: "2.1k",
    isSubscribed: false,
    hexColor: "#c084fc", // purple-400
    tailwindBg: "bg-purple-500/20",
  },
];

export const DiscoverView: React.FC<DiscoverViewProps> = ({
  schedules = SUGGESTED_SCHEDULES,
  onToggleSubscribe
}) => {
  return (
    <View className="px-1 gap-4">
      <View className="px-1 mb-2">
        <Text className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">
          Suggested for you
        </Text>
      </View>

      {schedules.map((item) => (
        <GlassCard 
          key={item.id} 
          className="p-4 flex-row justify-between items-center"
        >
          <View className="flex-row items-center gap-4 flex-1">
            {/* Category Icon/Color Dot */}
            <View className={`w-10 h-10 rounded-xl ${item.tailwindBg} items-center justify-center border border-white/5`}>
              <View 
                className="w-2 h-2 rounded-full" 
                style={{ backgroundColor: item.hexColor }}
              />
            </View>

            <View className="flex-1">
              <Text className="text-white font-bold text-sm">
                {item.title}
              </Text>
              <View className="flex-row items-center gap-2 mt-1">
                <View className="px-1.5 py-0.5 rounded-md bg-white/5">
                  <Text className="text-[10px] font-bold" style={{ color: item.hexColor }}>
                    {item.category}
                  </Text>
                </View>
                <View className="flex-row items-center gap-1">
                  <Users size={10} color="#64748b" />
                  <Text className="text-[10px] text-slate-500">
                    {item.subscribers}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <TouchableOpacity
            onPress={() => onToggleSubscribe?.(item.id)}
            activeOpacity={0.7}
            className={`flex-row items-center gap-1.5 px-4 py-2 rounded-xl border ${
              item.isSubscribed
                ? "bg-slate-800/80 border-white/5"
                : "bg-indigo-600 border-indigo-500"
            }`}
          >
            {item.isSubscribed ? (
              <>
                <Check size={14} color="#94a3b8" />
                <Text className="text-slate-400 text-xs font-bold">Subscribed</Text>
              </>
            ) : (
              <>
                <Plus size={14} color="white" />
                <Text className="text-white text-xs font-bold">Subscribe</Text>
              </>
            )}
          </TouchableOpacity>
        </GlassCard>
      ))}
      
      {/* Featured Banner */}
      <View className="mt-6 p-5 rounded-3xl bg-indigo-600/20 border border-indigo-500/20 relative overflow-hidden">
        <View className="relative z-10">
          <Text className="text-white font-bold text-base">Hostel 12 Mess Menu</Text>
          <Text className="text-xs text-slate-400 mt-1">Live updates for Breakfast & Dinner</Text>
          
          <TouchableOpacity className="mt-4 flex-row items-center gap-1">
            <Text className="text-xs font-bold text-indigo-400">View details</Text>
            <Plus size={12} color="#818cf8" />
          </TouchableOpacity>
        </View>

        {/* Decorative Watermark */}
        <View className="absolute -right-6 -bottom-6 opacity-10">
          <Plus size={120} color="white" />
        </View>
      </View>
    </View>
  );
};