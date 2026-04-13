import React from 'react';
import { TouchableOpacity, Text, Share, View, Platform } from 'react-native';
import { Share as ShareIcon } from 'lucide-react-native';

interface ShareButtonProps {
  message?: string;
}

export const ShareButton: React.FC<ShareButtonProps> = ({ 
  message = "Check out my class schedule on Orbit! 🚀" 
}) => {
  
  const handleShare = async () => {
    try {
      const result = await Share.share({
        message: message,
        // On iOS, you can also provide a URL
        url: 'https://getorbit.app', 
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error: any) {
      console.error("Sharing error:", error.message);
    }
  };

  return (
    <View className="px-4 mb-6">
      <TouchableOpacity 
        onPress={handleShare}
        activeOpacity={0.8}
        className={`w-full py-4 bg-indigo-600 rounded-2xl flex-row items-center justify-center gap-2 shadow-xl shadow-indigo-500/30 ${
          Platform.OS === 'ios' ? 'shadow-offset-[0px_4px] shadow-opacity-30 shadow-radius-10' : ''
        }`}
      >
        <ShareIcon size={18} color="white" /> 
        <Text className="text-white font-bold text-base">Share your schedule</Text>
      </TouchableOpacity>
    </View>
  );
};