import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { 
  ArrowLeft, Share, Settings, 
  Camera, Briefcase, Globe 
} from 'lucide-react-native';
import type { User } from '../../types/user';

interface ProfileHeaderProps {
  user: User;
  onBack?: () => void;
  onShare?: () => void;
  onSettings?: () => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user, onBack, onShare, onSettings }) => {
  return (
    <View className="gap-6">
      {/* TOP NAVIGATION BAR */}
      <View className="flex-row justify-between items-center">
        <TouchableOpacity 
          onPress={onBack}
          className="p-3 bg-slate-800/80 rounded-full items-center justify-center border border-white/5"
          hitSlop={8}
        >
          <ArrowLeft size={20} color="white" />
        </TouchableOpacity>
        
        <View className="flex-row gap-3">
          <TouchableOpacity 
            onPress={onShare}
            className="p-3 bg-slate-800/80 rounded-full items-center justify-center border border-white/5"
            hitSlop={8}
          >
            <Share size={20} color="white" />
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={onSettings}
            className="p-3 bg-slate-800/80 rounded-full items-center justify-center border border-white/5"
            hitSlop={8}
          >
            <Settings size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* IDENTITY SECTION */}
      <View className="flex-row items-center gap-5">
        <View className="relative">
          <Image 
            source={{ uri: user.avatar }} 
            className="w-24 h-24 rounded-full border-2 border-indigo-500"
            style={{ resizeMode: 'cover' }}
          />
          {/* Status Dot */}
          <View className="absolute bottom-1 right-1 w-6 h-6 bg-emerald-500 border-4 border-slate-950 rounded-full" />
        </View>

        <View className="flex-1">
          <Text className="text-2xl font-bold text-white tracking-tight">{user.name}</Text>
          <Text className="text-indigo-300 text-sm font-semibold mt-0.5">
            Year {user.year} • {user.branch}
          </Text>
          
          <View className="flex-row items-center gap-2 mt-2">
            <View className="px-2 py-0.5 rounded bg-slate-800/80 border border-white/5">
              <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Batch {user.subBatch}
              </Text>
            </View>
            <Text className="text-slate-600">•</Text>
            <Text className="text-xs text-slate-500 font-medium">{user.hostel}</Text>
          </View>

          {/* SOCIAL LINKS */}
          <View className="flex-row gap-3 mt-4">
            {[Camera, Briefcase, Globe].map((Icon, i) => (
              <TouchableOpacity 
                key={i} 
                activeOpacity={0.6}
                className="w-9 h-9 rounded-full bg-slate-900 border border-white/5 items-center justify-center"
              >
                <Icon size={16} color="#94a3b8" />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      {/* BIO SECTION */}
      <View className="bg-white/5 p-4 rounded-2xl border border-white/5">
        <Text className="text-slate-300 text-sm leading-6">
          Computer Science undergrad. Building cool stuff. 🚀 {"\n"}
          Hostel 12 Core Team.
        </Text>
      </View>
    </View>
  );
};