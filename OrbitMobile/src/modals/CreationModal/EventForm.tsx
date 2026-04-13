import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { Check, Calendar, Clock, MapPin, X } from 'lucide-react-native';

const EVENT_COLORS = [
  { id: 'indigo', hex: '#6366f1', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20', text: 'text-indigo-400' },
  { id: 'rose', hex: '#f43f5e', bg: 'bg-rose-500/10', border: 'border-rose-500/20', text: 'text-rose-400' },
  { id: 'amber', hex: '#f59e0b', bg: 'bg-amber-500/10', border: 'border-amber-500/20', text: 'text-amber-400' },
  { id: 'emerald', hex: '#10b981', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', text: 'text-emerald-400' },
];

export const EventForm = ({ onSubmit, onClose }: any) => {
  const [title, setTitle] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [eventCategory, setEventCategory] = useState('Personal 👤');
  const [eventColor, setEventColor] = useState('indigo');
  const [showSuccess, setShowSuccess] = useState(false);

  const activeTheme = EVENT_COLORS.find(c => c.id === eventColor) || EVENT_COLORS[0];

  const handleAddEvent = () => {
    setShowSuccess(true);
    // Logic for actual submission would go here
  };

  if (showSuccess) {
    return (
      <View className="flex-1 bg-slate-950 items-center justify-center p-6">
        <View className="w-24 h-24 rounded-full bg-emerald-500/20 items-center justify-center mb-6 border border-emerald-500/30">
          <Check size={48} color="#10b981" strokeWidth={3} />
        </View>
        <Text className="text-3xl font-black text-white mb-2 text-center">Event Created!</Text>
        <Text className="text-slate-400 mb-10 text-center">Added to your Orbit calendar</Text>
        <TouchableOpacity 
          onPress={() => onSubmit({ title, type: 'event' })}
          className="w-full bg-indigo-600 py-4 rounded-2xl items-center"
        >
          <Text className="text-white font-bold text-lg">Done</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-slate-950">
      {/* Header */}
      <View className="flex-row justify-between items-center px-6 pt-14 pb-4 border-b border-white/5 bg-slate-900/50">
        <TouchableOpacity onPress={onClose} hitSlop={15}>
          <Text className="text-slate-400 font-bold">Cancel</Text>
        </TouchableOpacity>
        <Text className="text-white font-bold text-base">New Event</Text>
        <TouchableOpacity onPress={handleAddEvent} disabled={!title}>
          <Text className={`font-bold ${!title ? 'text-slate-700' : 'text-indigo-400'}`}>Add</Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-5 pt-6" showsVerticalScrollIndicator={false}>
        {/* Live Preview Card */}
        <View className={`p-5 rounded-3xl border mb-8 ${activeTheme.bg} ${activeTheme.border}`}>
            <View className="flex-row mb-2">
                <View className="px-2 py-1 rounded bg-black/30">
                  <Text className={`text-[10px] font-bold uppercase tracking-wider ${activeTheme.text}`}>
                    {eventCategory}
                  </Text>
                </View>
            </View>
            <Text className="text-2xl font-black text-white mb-3">{title || 'Event Title...'}</Text>
            <View className="gap-1.5">
                <View className="flex-row items-center gap-2">
                    <Calendar size={14} color={activeTheme.hex}/> 
                    <Text className="text-xs text-slate-300">Mar 27, 2026</Text>
                </View>
                <View className="flex-row items-center gap-2">
                    <Clock size={14} color={activeTheme.hex}/> 
                    <Text className="text-xs text-slate-300">2:00 PM - 3:00 PM</Text>
                </View>
            </View>
        </View>

        {/* Form Inputs */}
        <TextInput 
          autoFocus 
          placeholder="Event Title" 
          placeholderTextColor="#334155"
          value={title} 
          onChangeText={setTitle}
          className="text-3xl font-black text-white mb-8 tracking-tight"
        />

        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-5 px-5 mb-8">
          {['Personal 👤', 'Exam 📝', 'Club 🎤', 'Sports ⚽'].map(cat => (
            <TouchableOpacity 
              key={cat} 
              onPress={() => setEventCategory(cat)} 
              className={`mr-2 px-5 py-2.5 rounded-full border ${
                eventCategory === cat ? 'bg-white border-white' : 'bg-slate-900 border-white/5'
              }`}
            >
              <Text className={`text-xs font-bold ${eventCategory === cat ? 'text-slate-950' : 'text-slate-400'}`}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View className="bg-slate-900/50 rounded-2xl border border-white/5 mb-4">
          <TouchableOpacity className="p-4 flex-row justify-between border-b border-white/5">
            <Text className="text-slate-400 font-bold">Date</Text>
            <Text className="text-white font-bold">Today, 27 Mar</Text>
          </TouchableOpacity>
          <TouchableOpacity className="p-4 flex-row justify-between">
            <Text className="text-slate-400 font-bold">Time</Text>
            <Text className="text-white font-bold">14:00 - 15:00</Text>
          </TouchableOpacity>
        </View>

        <View className="bg-slate-900/50 rounded-2xl p-4 flex-row items-center gap-3 border border-white/5 mb-8">
            <MapPin size={20} color="#64748b" />
            <TextInput 
              placeholder="Location" 
              placeholderTextColor="#64748b"
              value={eventLocation} 
              onChangeText={setEventLocation}
              className="text-white font-bold flex-1"
            />
        </View>

        <View className="mb-10">
            <Text className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Theme</Text>
            <View className="flex-row gap-4">
                {EVENT_COLORS.map(c => (
                    <TouchableOpacity 
                      key={c.id} 
                      onPress={() => setEventColor(c.id)} 
                      style={{ backgroundColor: c.hex }}
                      className={`w-11 h-11 rounded-full ${eventColor === c.id ? 'border-4 border-white' : ''}`}
                    />
                ))}
            </View>
        </View>
      </ScrollView>
    </View>
  );
};