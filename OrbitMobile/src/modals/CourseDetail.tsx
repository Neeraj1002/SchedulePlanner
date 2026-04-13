import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Modal } from 'react-native';
import { ArrowLeft, Settings, UserPlus, Circle, ChevronRight, MessageSquare } from 'lucide-react-native';
import { getCourseStyle } from '../utils/styleHelpers';
import { MOCK_USER } from '../data/mockData';
import {LinearGradient} from 'expo-linear-gradient';

interface CourseDetailProps {
  course: any;
  isOpen: boolean;
  onBack: () => void;
  onOpenChat: (params: { type: string; data: any }) => void;
}

export const CourseDetail: React.FC<CourseDetailProps> = ({ course, isOpen, onBack, onOpenChat }) => {
  if (!course) return null;

  const style = getCourseStyle(course.code);
  const Icon = style.icon;

  return (
    <Modal visible={isOpen} animationType="slide" presentationStyle="fullScreen">
      <View className="flex-1 bg-slate-950">
        <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
          
          {/* HEADER SECTION */}
          <LinearGradient
            colors={(style.headerGradient || ['#4f46e5', '#7c3aed']) as [string,string] }
            className="pt-14 pb-16 px-6 rounded-b-[40px] items-center relative"
          >
            <View className="flex-row justify-between w-full mb-4">
              <TouchableOpacity 
                onPress={onBack}
                className="p-3 bg-white/20 rounded-full items-center justify-center"
              >
                <ArrowLeft size={20} color="white" />
              </TouchableOpacity>
              <TouchableOpacity className="p-3 bg-white/20 rounded-full">
                <Settings size={20} color="white" />
              </TouchableOpacity>
            </View>

            <View className="w-20 h-20 bg-white/20 rounded-3xl items-center justify-center border border-white/20 shadow-lg mb-4">
              <Icon size={40} color="white" />
            </View>
            <Text className="text-2xl font-black text-white text-center px-4">{course.subject}</Text>
            <Text className="text-white/80 font-bold mt-1 uppercase tracking-widest text-xs">
              {course.code} • Room {course.room}
            </Text>
          </LinearGradient>

          {/* CONTENT SECTION */}
          <View className="px-6 -mt-10 pb-20">
            {/* Action Buttons */}
            <View className="flex-row gap-3 mb-8">
              <TouchableOpacity 
                onPress={() => onOpenChat({ type: 'group', data: course })}
                className="flex-1 bg-white h-14 rounded-2xl flex-row items-center justify-center shadow-xl shadow-black/20"
              >
                <MessageSquare size={18} color="#6366f1" fill="#6366f1" />
                <Text className="text-slate-900 font-black ml-2 text-sm">Class Chat</Text>
              </TouchableOpacity>
              
              <TouchableOpacity className="flex-1 bg-slate-900 h-14 rounded-2xl flex-row items-center justify-center border border-white/10">
                <UserPlus size={18} color="white" />
                <Text className="text-white font-black ml-2 text-sm">Invite</Text>
              </TouchableOpacity>
            </View>

            {/* Task Section */}
            <View className="mb-8">
              <Text className="text-white font-black text-lg mb-4">Course Tasks</Text>
              <View className="bg-slate-900 border border-white/5 p-5 rounded-3xl flex-row items-center gap-4">
                <Circle size={22} color="#64748b" />
                <View>
                  <Text className="text-white font-bold text-sm">Lab Report Submission</Text>
                  <Text className="text-slate-500 text-[10px] font-bold uppercase mt-0.5">Due in 2 days</Text>
                </View>
              </View>
            </View>

            {/* Classmates List */}
            <View>
              <Text className="text-white font-black text-lg mb-4">
                Classmates ({course.classmates?.length + 1})
              </Text>
              <View className="bg-slate-900 rounded-[32px] overflow-hidden border border-white/5">
                {/* Me */}
                <TouchableOpacity className="p-4 flex-row items-center justify-between border-b border-white/5">
                  <View className="flex-row items-center gap-3">
                    <Image source={{ uri: MOCK_USER.avatar }} className="w-10 h-10 rounded-full bg-slate-800" />
                    <Text className="text-white font-bold">Me</Text>
                  </View>
                  <ChevronRight size={16} color="#475569" />
                </TouchableOpacity>

                {/* Others */}
                {course.classmates?.map((name: string, i: number) => (
                  <TouchableOpacity key={i} className={`p-4 flex-row items-center justify-between ${i === course.classmates.length - 1 ? '' : 'border-b border-white/5'}`}>
                    <View className="flex-row items-center gap-3">
                      <View className={`w-10 h-10 rounded-full items-center justify-center ${i % 2 === 0 ? 'bg-indigo-500' : 'bg-rose-500'}`}>
                        <Text className="text-white font-bold">{name[0]}</Text>
                      </View>
                      <Text className="text-slate-300 font-medium">{name}</Text>
                    </View>
                    <ChevronRight size={16} color="#475569" />
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};