import React from "react";
import { View, Text, TouchableOpacity, Pressable, StyleSheet } from "react-native";
import { BlurView } from "expo-blur";
import {
  BookOpen,
  Utensils,
  CheckSquare,
  CalendarPlus,
  PenSquare,
} from "lucide-react-native";

interface SpeedDialProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  onAction: (type: string) => void;
}

const SpeedDial = ({ open, setOpen, onAction }: SpeedDialProps) => {
  if (!open) return null;

  const actions = [
    { id: "class", label: "Class", icon: BookOpen, colors: "bg-indigo-600" },
    { id: "mess", label: "Mess", icon: Utensils, colors: "bg-orange-500" },
    { id: "task", label: "To-Do", icon: CheckSquare, colors: "bg-emerald-500" },
    { id: "event", label: "Event", icon: CalendarPlus, colors: "bg-sky-500" },
    { id: "post", label: "Post", icon: PenSquare, colors: "bg-rose-500" },
  ];

  return (
    // Backdrop: Pressable allows closing when tapping outside
    <Pressable 
      onPress={() => setOpen(false)}
      className="absolute inset-0 z-40 items-center justify-center"
    >
      {/* Semi-transparent Overlay */}
      <View className="absolute inset-0 bg-slate-950/60" />
      
      <View className="absolute bottom-24 items-center gap-4 w-full">
        {actions.map((action, index) => (
          <TouchableOpacity
            key={action.id}
            onPress={() => {
              onAction(action.id);
              setOpen(false);
            }}
            activeOpacity={0.8}
            className="flex-row items-center justify-end gap-3 px-4 w-full max-w-[200px]"
          >
            {/* Label */}
            <View className="bg-slate-900/90 px-3 py-1.5 rounded-lg border border-white/10 shadow-lg">
              <Text className="text-white text-[12px] font-bold">{action.label}</Text>
            </View>

            {/* Icon Button */}
            <View 
               className={`w-12 h-12 rounded-full items-center justify-center shadow-xl ${action.colors}`}
               style={styles.iconShadow}
            >
              <action.icon size={20} color="white" />
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  iconShadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  }
});

export default SpeedDial;