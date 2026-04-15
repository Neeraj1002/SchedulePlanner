import React from "react";
import { View, Image, StyleSheet } from "react-native";

interface AvatarRingProps {
  src: string;
  status?: "free" | "busy" | "away";
  size?: "md" | "lg" | "xl";
  className?: string; // Added to allow layout positioning from parents
}

export default function AvatarRing({ src, status, size = "md", className = "" }: AvatarRingProps) {
  // Mapping size classes to numeric values for React Native
  const dimensions = {
    md: 48, // w-12
    lg: 56, // w-14
    xl: 64, // w-16
  };

  const currentSize = dimensions[size];

  // Logic for the ring (border) color
  const getRingColor = () => {
    switch (status) {
      case "free": return "border-emerald-400";
      case "busy": return "border-rose-500";
      default: return "border-slate-600";
    }
  };

  return (
    <View className={`relative items-center justify-center ${className}`}>
      {/* The Outer Ring Container */}
      <View 
        style={{ 
          width: currentSize + 4, 
          height: currentSize + 4,
          borderRadius: 999 
        }}
        className={`border-2 p-[2px] items-center justify-center ${getRingColor()}`}
      >
        {/* The Avatar Image */}
        <Image
          source={{ uri: src }}
          style={{ width: currentSize, height: currentSize, borderRadius: 999 }}
          className="bg-slate-800"
          resizeMode="cover"
        />
      </View>

      {/* Status Dot */}
      {status === "free" && (
        <View 
          className="absolute bottom-1 right-1 w-3 h-3 bg-emerald-400 border-2 border-slate-950 rounded-full" 
          style={styles.statusShadow}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  statusShadow: {
    // Equivalent to your emerald shadow-blur on the status dot
    shadowColor: "#34d399",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 4,
    elevation: 2,
  },
});