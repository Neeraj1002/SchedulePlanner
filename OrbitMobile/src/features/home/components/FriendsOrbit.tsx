import React from "react";
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Plus } from "lucide-react-native";

interface FriendsOrbitProps {
  friends: any[];
  onFriendSelect: (friend: any) => void;
}

export const FriendsOrbit: React.FC<FriendsOrbitProps> = ({
  friends,
  onFriendSelect,
}) => {
  return (
    <View className="mb-6">
      {/* SECTION HEADER */}
      <Text className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4 opacity-80 px-1">
        Orbit • Friends Active
      </Text>

      {/* HORIZONTAL SCROLL RAIL */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        className="flex-row"
        contentContainerStyle={{ paddingHorizontal: 8, gap: 20 }}
        snapToInterval={80} // Approx width of one item for 'snap-center' feel
        decelerationRate="fast"
      >
        {friends.map((friend) => (
          <TouchableOpacity
            key={friend.id}
            onPress={() => onFriendSelect(friend)}
            activeOpacity={0.8}
            className="items-center gap-2"
          >
            {/* Avatar with Ring */}
            <View className="relative p-[2px] rounded-full bg-indigo-500 shadow-lg">
              <View className="bg-slate-950 p-[2px] rounded-full">
                <Image
                  source={{ uri: friend.avatar }}
                  className="w-14 h-14 rounded-full bg-slate-800"
                />
              </View>

              {/* Status dot */}
              <View
                className={`absolute bottom-0 right-1 w-4 h-4 rounded-full border-2 border-slate-950 ${
                  friend.status === "free" ? "bg-emerald-400" : "bg-rose-500"
                }`}
                style={friend.status === "free" ? styles.glowEmerald : styles.glowRose}
              />
            </View>

            {/* Name + time */}
            <View className="items-center">
              <Text className="text-[11px] font-bold text-white tracking-tight">
                {friend.name}
              </Text>
              <Text className="text-[9px] text-slate-500 font-medium">
                {friend.time}
              </Text>
            </View>
          </TouchableOpacity>
        ))}

        {/* Add Button */}
        <TouchableOpacity 
          activeOpacity={0.7}
          className="items-center gap-2 pt-1"
        >
          <View className="w-14 h-14 rounded-full border-2 border-dashed border-slate-700 items-center justify-center">
            <Plus size={20} color="#64748b" />
          </View>
          <Text className="text-[10px] text-slate-500">Add</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  glowEmerald: {
    shadowColor: "#34d399",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 5,
  },
  glowRose: {
    shadowColor: "#f43f5e",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 5,
  }
});