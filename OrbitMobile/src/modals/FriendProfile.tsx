import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { ArrowLeft, MoreHorizontal, MessageCircle, Calendar, BookOpen, UserMinus, ChevronRight, MapPin } from 'lucide-react-native';
import {LinearGradient} from 'expo-linear-gradient';
import AvatarRing from '../components/ui/AvatarRing';
import {useNavigation} from '@react-navigation/native' ;

interface FriendProfileProps {
  friend: any;
  isOpen: boolean;
  onBack: () => void;
  onOpenChat: (params: { type: string; data: any }) => void;
}

export const FriendProfile: React.FC<FriendProfileProps> = ({ friend, isOpen, onBack, onOpenChat }) => {
  const navigation = useNavigation<any>();
  
  if (!friend) return null;
  const friendName = friend.name || 'Rohan' ;

  return (
    <View className="flex-1 bg-[#050915]">
      {/* Green Curved Header Area */}
      <View className="bg-[#108A66] pt-14 pb-20 px-6 rounded-b-[40px] items-center relative z-0">
        <View className="absolute top-14 left-6 right-6 flex-row justify-between w-full">
          <TouchableOpacity onPress={() => navigation.goBack()} className="w-10 h-10 bg-white/20 rounded-full items-center justify-center">
            <ArrowLeft size={20} color="white" />
          </TouchableOpacity>
          <TouchableOpacity className="w-10 h-10 bg-white/20 rounded-full items-center justify-center">
            <MoreHorizontal size={20} color="white" />
          </TouchableOpacity>
        </View>

         <View className="items-center -mt-2">
              <AvatarRing src={friend.avatar} status={friend.status} size="xl" />
              <Text className="text-2xl font-black text-white mt-3">{friend.name}</Text>
              <Text className="text-emerald-100 font-bold text-xs uppercase tracking-widest mt-1">
                Year {friend.year} • {friend.branch}
              </Text>
          </View>
      </View>

      {/* Status Overlay Card */}
      <View className="mx-6 -mt-12 bg-[#0F121E] rounded-3xl p-5 border border-white/5 flex-row justify-between items-center shadow-2xl z-10">
        <View>
          <Text className="text-slate-500 text-[10px] font-black tracking-widest uppercase mb-1">Current Status</Text>
          <View className="flex-row items-center">
            <View className="w-2.5 h-2.5 rounded-full bg-emerald-500 mr-2" />
            <Text className="text-white font-bold text-base">Free until 2pm</Text>
          </View>
        </View>
        <View className="flex-row gap-2">
          <TouchableOpacity className="w-10 h-10 rounded-full bg-indigo-500/10 items-center justify-center border border-indigo-500/20">
            <MessageCircle size={18} color="#818cf8" />
          </TouchableOpacity>
          <TouchableOpacity className="w-10 h-10 rounded-full bg-emerald-500/10 items-center justify-center border border-emerald-500/20">
            <MapPin size={18} color="#34d399" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Content */}
      <View className="px-6 pt-8">
        <Text className="text-white text-xl font-black mb-3">About</Text>
        <Text className="text-slate-400 text-sm font-medium mb-8">Caffeine dependent life form ☕</Text>

        {/* --- THE FUNCTIONAL BUTTONS --- */}
        <TouchableOpacity 
          onPress={() => navigation.navigate('CompareSchedule', { friendName })}
          className="bg-[#0F121E] rounded-2xl p-5 flex-row items-center justify-between border border-white/5 mb-4 shadow-lg"
        >
          <View className="flex-row items-center">
            <Calendar size={20} color="#94a3b8" />
            <Text className="text-white font-bold text-base ml-4">Compare Schedule</Text>
          </View>
          <Text className="text-slate-600 font-bold">›</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={() => navigation.navigate('MutualClasses', { friendName })}
          className="bg-[#0F121E] rounded-2xl p-5 flex-row items-center justify-between border border-white/5 mb-4 shadow-lg"
        >
          <View className="flex-row items-center">
            <BookOpen size={20} color="#94a3b8" />
            <Text className="text-white font-bold text-base ml-4">Mutual Classes</Text>
          </View>
          <Text className="text-slate-600 font-bold">›</Text>
        </TouchableOpacity>

        <TouchableOpacity className="bg-[#F43F5E]/5 rounded-2xl p-5 flex-row items-center border border-[#F43F5E]/10">
          <UserMinus size={20} color="#F43F5E" />
          <Text className="text-[#F43F5E] font-bold text-base ml-4">Remove Friend</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
