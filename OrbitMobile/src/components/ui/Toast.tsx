import React, { useEffect } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { CheckCircle2, ShieldAlert, AlertCircle } from "lucide-react-native";
import { APP_CONFIG } from "../../constants/config";

// Get screen width for perfect centering
const { width } = Dimensions.get("window");

interface ToastProps {
  message: string;
  type: "success" | "error" | "alert";
  onClose: () => void;
}

export default function Toast({ message, type, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  // Map icon based on type
  const Icon = type === "success" ? CheckCircle2 : type === "error" ? ShieldAlert : AlertCircle;
  
  // Map background color
  const bgColor = type === "success" ? "bg-emerald-600" : "bg-rose-600";
  const timer = setTimeout(onClose, APP_CONFIG.TOAST_DURATION);

  return (
    <View 
      style={styles.container}
      className={`flex-row items-center px-6 py-3 rounded-full shadow-2xl border border-white/10 ${bgColor}`}
    >
      <Icon size={18} color="white" />
      <Text className="text-white text-sm font-bold ml-2">
        {message}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60, // Adjust based on your Status Bar height
    alignSelf: 'center',
    zIndex: 1000,
    // Elevation for Android shadow
    elevation: 10,
    // iOS Shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
});