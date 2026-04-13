import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal, FlatList } from 'react-native';
import { ArrowLeft, Utensils, Clock, Star, ThumbsUp, ThumbsDown, Calendar } from 'lucide-react-native';
import {LinearGradient} from 'expo-linear-gradient';
import { FULL_MESS_MENU } from '../data/mockData';
import type { MealType } from '../types';

export const MessMenu = ({ isOpen, onBack }: { isOpen: boolean; onBack: () => void }) => {
  const [activeMeal, setActiveMeal] = useState('Lunch');
  
  if (!isOpen) return null;
  const currentMenu = FULL_MESS_MENU[activeMeal as MealType];

  return (
    <Modal visible={isOpen} animationType="slide" presentationStyle="fullScreen">
      <View className="flex-1 bg-slate-950">
        <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
          
          {/* HEADER: Warm Appetizing Gradient */}
          <LinearGradient
            colors={['#f97316', '#EA580C','#E11D48']}
            start ={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            className="pt-14 pb-16 px-6 rounded-b-[40px] items-center relative"
          >
            <View className="flex-row justify-between w-full mb-6">
              <TouchableOpacity onPress={onBack} className="p-3 bg-white/20 rounded-full">
                <ArrowLeft size={20} color="white" />
              </TouchableOpacity>
              <View className="px-4 py-2 bg-white/20 rounded-full flex-row items-center gap-2">
                <Calendar size={12} color="white" />
                <Text className="text-white text-[10px] font-black uppercase tracking-widest">Today</Text>
              </View>
            </View>

            <View className="w-20 h-20 bg-white/20 rounded-3xl items-center justify-center border border-white/20 shadow-lg mb-4">
              <Utensils size={40} color="white" />
            </View>
            <Text className="text-3xl font-black text-white">Mess Menu</Text>
            <Text className="text-orange-100 font-bold mt-1 text-xs uppercase tracking-widest">
              Hostel 12 • North Indian
            </Text>
          </LinearGradient>

          {/* CONTENT SECTION */}
          <View className="px-6 -mt-10 pb-20">
            
            {/* Meal Selector (Segmented Control) */}
            <View className="bg-slate-900/95 p-1.5 rounded-2xl flex-row shadow-2xl border border-white/5 mb-6">
              {Object.keys(FULL_MESS_MENU).map((meal) => (
                <TouchableOpacity
                  key={meal}
                  onPress={() => setActiveMeal(meal)}
                  className={`flex-1 py-3.5 rounded-xl items-center ${
                    activeMeal === meal ? 'bg-orange-600' : ''
                  }`}
                >
                  <Text className={`text-xs font-black ${activeMeal === meal ? 'text-white' : 'text-slate-500'}`}>
                    {meal}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Meal Metadata */}
            <View className="flex-row justify-between items-center mb-6 px-1">
              <View className="flex-row items-center gap-2">
                <Clock size={16} color="#f97316" />
                <Text className="text-slate-300 font-bold text-xs">{currentMenu.time}</Text>
              </View>
              <View className="flex-row items-center gap-2">
                <Star size={16} color="#eab308" fill="#eab308" />
                <Text className="text-white font-black text-xs">{currentMenu.rating}</Text>
                <Text className="text-slate-500 text-[10px]">(142 reviews)</Text>
              </View>
            </View>

            {/* Menu Grid */}
            <View className="flex-row flex-wrap justify-between gap-y-3 mb-8">
              {currentMenu.items.map((item: any, i: number) => (
                <View 
                  key={i} 
                  className="w-[48%] bg-slate-900 border border-white/5 p-5 rounded-[32px] items-center"
                >
                  <Text className="text-4xl mb-3">{item.icon}</Text>
                  <Text className="text-white font-bold text-sm text-center mb-2">{item.name}</Text>
                  <View className="bg-slate-950 px-3 py-1 rounded-full">
                    <Text className="text-[9px] font-black text-slate-500 uppercase">{item.calories}</Text>
                  </View>
                </View>
              ))}
            </View>

            {/* Feedback Section */}
            <View className="bg-slate-900 p-6 rounded-[32px] border border-white/5 items-center">
              <Text className="text-white font-black text-sm mb-5">How's the food today?</Text>
              <View className="flex-row gap-3 w-full">
                <TouchableOpacity className="flex-1 py-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex-row items-center justify-center gap-2">
                  <ThumbsUp size={18} color="#10b981" />
                  <Text className="text-emerald-400 font-black text-xs">GOOD</Text>
                </TouchableOpacity>
                <TouchableOpacity className="flex-1 py-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex-row items-center justify-center gap-2">
                  <ThumbsDown size={18} color="#fb7185" />
                  <Text className="text-rose-400 font-black text-xs">BAD</Text>
                </TouchableOpacity>
              </View>
            </View>

          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};