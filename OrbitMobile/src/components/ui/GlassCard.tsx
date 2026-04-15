import React from "react";
import { TouchableOpacity, View, StyleSheet } from "react-native";
import { BlurView } from "expo-blur";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export default function GlassCard({ children, className = "", onClick }: GlassCardProps) {
  // If onClick exists, wrap in TouchableOpacity, otherwise just a View
  if (onClick) {
    return (
      <TouchableOpacity
        onPress={onClick}
        activeOpacity={0.8}
        className={`rounded-[32px] overflow-hidden border border-white/10 ${className}`}
        style={styles.shadow}
      >
        <BlurView intensity={30} tint="dark" className="bg-slate-900/40 p-5">
          {children}
        </BlurView>
      </TouchableOpacity>
    );
  }

  return (
    <View 
      className={`rounded-[32px] overflow-hidden border border-white/10 ${className}`}
      style={styles.shadow}
    >
      <BlurView intensity={30} tint="dark" className="bg-slate-900/40 p-5">
        {children}
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  shadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
  },
});