import React, { useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import { ChevronRight, Code, Cpu, Users, BookOpen } from 'lucide-react-native';
import { ProfileHeader } from './components/ProfileHeader';
import { ProfileSubTabs } from './components/ProfileSubTabs';
import { ShareButton } from '../../components/ui/ShareButton';

type SubTab = 'classes' | 'friends' | 'subscribed';

const ProfileTab = ({ user, scheduleData, friendsOnline, suggestedSchedules }: any) => {
  const [activeSubTab, setActiveSubTab] = useState<SubTab>('classes');

  // Course Icon Helper
  const getCourseIcon = (code: string) => {
    const iconSize = 24;
    if (code.startsWith('CS')) return <Code size={iconSize} color="#a78bfa" />; // violet-400
    if (code.startsWith('EE')) return <Cpu size={iconSize} color="#22d3ee" />; // cyan-400
    if (code.code === 'CLUB') return <Users size={iconSize} color="#34d399" />; // emerald-400
    return <BookOpen size={iconSize} color="#fb7185" />; // rose-400
  };

  return (
    <View className="flex-1 bg-slate-950">
      <ScrollView 
        className="flex-1 px-4 pt-12"
        contentContainerStyle={{ paddingBottom: 140 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Identity & Bio */}
        <ProfileHeader user={user} />
        
        {/* Navigation Tabs */}
        <View className="my-6">
          <ProfileSubTabs activeTab={activeSubTab} setActiveTab={setActiveSubTab} />
        </View>

        {/* Content List based on active tab */}
        <View className="gap-3">
          {activeSubTab === 'classes' && scheduleData.map((item: any) => (
             <TouchableOpacity 
               key={item.id} 
               className="flex-row items-center gap-4 p-4 bg-slate-900/40 border border-white/5 rounded-2xl"
             >
                <View className="w-12 h-12 rounded-xl items-center justify-center bg-slate-800">
                   {getCourseIcon(item.code)}
                </View>
                <View className="flex-1">
                   <Text className="text-white font-bold text-base">{item.subject}</Text>
                   <Text className="text-xs text-slate-500 mt-0.5">{item.code} • {item.room}</Text>
                </View>
                <ChevronRight size={18} color="#475569" />
             </TouchableOpacity>
          ))}

          {activeSubTab === 'friends' && friendsOnline.map((friend: any) => (
             <TouchableOpacity 
               key={friend.id} 
               className="flex-row items-center gap-4 p-3 bg-slate-900/40 border border-white/5 rounded-2xl"
             >
                <Image 
                  source={{ uri: friend.avatar }} 
                  className="w-12 h-12 rounded-full bg-slate-800" 
                />
                <View className="flex-1">
                   <Text className="text-white font-bold">{friend.name}</Text>
                   <Text className="text-xs text-slate-500">{friend.status}</Text>
                </View>
                <View className={`w-2.5 h-2.5 rounded-full ${friend.status === 'free' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
             </TouchableOpacity>
          ))}

          {activeSubTab === 'subscribed' && (
             <View className="py-20 items-center justify-center">
                <Text className="text-slate-600 font-medium italic">No active subscriptions</Text>
             </View>
          )}
        </View>
      </ScrollView>

      {/* Floating Share Button */}
      <View className="absolute bottom-28 left-0 right-0">
        <ShareButton message={`Check out ${user.name}'s schedule on Orbit! 🚀`} />
      </View>
    </View>
  );
};

export default ProfileTab;