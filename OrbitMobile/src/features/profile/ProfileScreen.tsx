import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Share as RNShare } from 'react-native';
import { 
  ArrowLeft, Share, Settings, Camera, Briefcase, Globe, 
  Code, Cpu, BookOpen, Users, Upload, ChevronRight, BarChart3, Utensils 
} from 'lucide-react-native';

export const ProfileScreen = ({ navigation }: any) => {
  const [activeTab, setActiveTab] = useState('Classes');
  
  const handleShareProfile = async () => {
    try {
      await RNShare.share({
        message: 'Check out my schedule on Orbit! [Link to profile]',
      });
    } catch (error) {
      console.error('Error sharing profile:', error);
    }
  };

  return (
    <View className="flex-1 bg-[#050915]">
      {/* Header */}
      <View className="flex-row justify-between items-center px-6 pt-14 pb-4">
        {/* If this is a main tab, you might not want the back button, but we include it per your design */}
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} color="white" />
        </TouchableOpacity>
        
        <View className="flex-row gap-4">
          <TouchableOpacity onPress = {handleShareProfile} className="w-10 h-10 rounded-full bg-white/5 items-center justify-center border border-white/5">
            <Share size={18} color="white" opacity={0.8} />
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={()=>navigation.navigate('Settings')} 
            className="w-10 h-10 rounded-full bg-white/5 items-center justify-center border border-white/5">
            <Settings size={18} color="white" opacity={0.8} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 160 }}>
        {/* Profile Info Row */}
        <View className="px-6 flex-row items-center mb-6 mt-2">
          <View className="relative mr-5">
            {/* Replace with your actual Image component later */}
            <View className="w-24 h-24 rounded-full bg-[#C4B5FD] items-center justify-center border-2 border-white/10 overflow-hidden">
                <Text className="text-5xl">😫</Text>
            </View>
            <View className="absolute bottom-1 right-1 w-5 h-5 bg-emerald-500 rounded-full border-[3px] border-[#050915]" />
          </View>

          <View className="flex-1">
            <Text className="text-white text-2xl font-black tracking-tight">Arjun</Text>
            <Text className="text-slate-400 text-xs font-bold mb-1">IIT Roorkee • Sem 4</Text>
            <View className="flex-row items-center mb-3">
              <BarChart3 size={12} color="#818cf8" />
              <Text className="text-indigo-400 text-xs font-bold ml-1">Computer Science</Text>
            </View>

            {/* Social Icons */}
            <View className="flex-row gap-2">
              <TouchableOpacity className="w-8 h-8 rounded-full bg-white/5 items-center justify-center border border-white/10">
                <Camera size={14} color="#94a3b8" />
              </TouchableOpacity>
              <TouchableOpacity className="w-8 h-8 rounded-full bg-white/5 items-center justify-center border border-white/10">
                <Briefcase size={14} color="#94a3b8" />
              </TouchableOpacity>
              <TouchableOpacity className="w-8 h-8 rounded-full bg-white/5 items-center justify-center border border-white/10">
                <Globe size={14} color="#94a3b8" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Bio */}
        <Text className="text-slate-300 px-6 text-sm mb-8 leading-relaxed font-medium">
          Computer Science undergrad. Building cool stuff. 🚀{'\n'}Azad Bhawan Core Team.
        </Text>

        {/* Tab Selector */}
        <View className="flex-row px-6 border-b border-white/10 mb-6">
          {['Classes', 'Friends', 'Subscribed'].map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              className={`flex-1 pb-4 items-center border-b-2 ${activeTab === tab ? 'border-[#8B5CF6]' : 'border-transparent'}`}
            >
              <Text className={`font-bold ${activeTab === tab ? 'text-white' : 'text-slate-500'}`}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* List Content */}
        <View className="px-6">
          
          {/* --- CLASSES TAB CONTENT --- */}
          {activeTab === 'Classes' && (
            <View>
              {/* Card 1 */}
              <TouchableOpacity className="bg-[#0F121E] rounded-3xl p-4 flex-row items-center border border-white/5 mb-4 shadow-lg">
                <View className="w-14 h-14 rounded-2xl bg-slate-800/80 items-center justify-center mr-4 border border-white/5">
                  <Code size={22} color="#C4B5FD" />
                </View>
                <View className="flex-1">
                  <Text className="text-white font-bold text-sm mb-0.5">Intro to CS</Text>
                  <Text className="text-slate-500 text-xs font-medium">CS101 • LHC-101</Text>
                </View>
                <ChevronRight size={20} color="#334155" />
              </TouchableOpacity>

              {/* Card 2 */}
              <TouchableOpacity className="bg-[#0F121E] rounded-3xl p-4 flex-row items-center border border-white/5 mb-4 shadow-lg">
                <View className="w-14 h-14 rounded-2xl bg-slate-800/80 items-center justify-center mr-4 border border-white/5">
                  <Cpu size={22} color="#38BDF8" />
                </View>
                <View className="flex-1">
                  <Text className="text-white font-bold text-sm mb-0.5">Analog Circuits</Text>
                  <Text className="text-slate-500 text-xs font-medium">EE204 • EE-Block</Text>
                </View>
                <ChevronRight size={20} color="#334155" />
              </TouchableOpacity>

              {/* Card 3 */}
              <TouchableOpacity className="bg-[#0F121E] rounded-3xl p-4 flex-row items-center border border-white/5 mb-4 shadow-lg">
                <View className="w-14 h-14 rounded-2xl bg-slate-800/80 items-center justify-center mr-4 border border-white/5">
                  <BookOpen size={22} color="#F43F5E" />
                </View>
                <View className="flex-1">
                  <Text className="text-white font-bold text-sm mb-0.5">Economics</Text>
                  <Text className="text-slate-500 text-xs font-medium">HS301 • LHC-202</Text>
                </View>
                <ChevronRight size={20} color="#334155" />
              </TouchableOpacity>

              {/* Card 4 */}
              <TouchableOpacity className="bg-[#0F121E] rounded-3xl p-4 flex-row items-center border border-white/5 mb-4 shadow-lg">
                <View className="w-14 h-14 rounded-2xl bg-slate-800/80 items-center justify-center mr-4 border border-white/5">
                  <Users size={22} color="#10B981" />
                </View>
                <View className="flex-1">
                  <Text className="text-white font-bold text-sm mb-0.5">Robotics Club</Text>
                  <Text className="text-slate-500 text-xs font-medium">CLUB • Innovation Lab</Text>
                </View>
                <ChevronRight size={20} color="#334155" />
              </TouchableOpacity>
            </View>
          )}

          {/* --- FRIENDS TAB CONTENT --- */}
          {activeTab === 'Friends' && (
            <View>
              {[
                { name: 'Rohan', status: 'free', color: '#10B981', avatar: '😍' },
                { name: 'Aditi', status: 'busy', color: '#F43F5E', avatar: '😭' },
                { name: 'Vikram', status: 'busy', color: '#F43F5E', avatar: '🤯' },
                { name: 'Sana', status: 'free', color: '#10B981', avatar: '🦸‍♀️' },
                { name: 'Dev', status: 'away', color: '#F43F5E', avatar: '👱‍♀️' },
              ].map((friend, index) => (
                <TouchableOpacity key={index} className="bg-[#0F121E] rounded-[24px] p-4 flex-row items-center border border-white/5 mb-4 shadow-lg">
                  <View className="w-12 h-12 rounded-full bg-slate-800 items-center justify-center mr-4 border border-white/5">
                    <Text className="text-2xl">{friend.avatar}</Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-white font-bold text-sm mb-0.5">{friend.name}</Text>
                    <Text className="text-slate-500 text-xs font-medium">{friend.status}</Text>
                  </View>
                  <View className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: friend.color }} />
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* --- SUBSCRIBED TAB CONTENT --- */}
          {activeTab === 'Subscribed' && (
            <View>
              {/* Mess Card */}
              <TouchableOpacity className="bg-[#0F121E] rounded-[24px] p-4 flex-row items-center border border-white/5 mb-4 shadow-lg">
                <View className="w-14 h-14 rounded-2xl bg-[#451A03] items-center justify-center mr-4 border border-white/5">
                  <Utensils size={22} color="#FDBA74" />
                </View>
                <View className="flex-1">
                  <Text className="text-white font-bold text-sm mb-0.5">Azad Bhawan Mess</Text>
                  <Text className="text-slate-500 text-xs font-medium">Food • 1.2k subs</Text>
                </View>
                <TouchableOpacity className="bg-slate-800/80 px-4 py-2 rounded-xl border border-white/10">
                  <Text className="text-slate-300 font-bold text-xs">Unsubscribe</Text>
                </TouchableOpacity>
              </TouchableOpacity>

              {/* Placement Card */}
              <TouchableOpacity className="bg-[#0F121E] rounded-[24px] p-4 flex-row items-center border border-white/5 mb-4 shadow-lg">
                <View className="w-14 h-14 rounded-2xl bg-[#1E3A8A] items-center justify-center mr-4 border border-white/5">
                  <Briefcase size={22} color="#93C5FD" />
                </View>
                <View className="flex-1">
                  <Text className="text-white font-bold text-sm mb-0.5">Placement Deadlines</Text>
                  <Text className="text-slate-500 text-xs font-medium">Career • 3.5k subs</Text>
                </View>
                <TouchableOpacity className="bg-slate-800/80 px-4 py-2 rounded-xl border border-white/10">
                  <Text className="text-slate-300 font-bold text-xs">Unsubscribe</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            </View>
          )}

        </View>
      </ScrollView>
      
      {/* Floating Share Button (Positioned exactly above the Dock) */}
      <View className="absolute bottom-[105px] w-full px-6 z-40" pointerEvents="box-none">
        <TouchableOpacity 
          onPress={handleShareProfile}
          activeOpacity={0.9}
          className="bg-[#7C3AED] w-full py-4 rounded-2xl flex-row justify-center items-center shadow-xl shadow-purple-500/40"
        >
          <Upload size={18} color="white" strokeWidth={2.5} />
          <Text className="text-white font-bold ml-2 text-base">Share your schedule</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};