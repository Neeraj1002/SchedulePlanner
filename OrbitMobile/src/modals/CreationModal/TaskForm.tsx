import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Platform } from 'react-native';
import { CheckSquare, Calendar, Flag } from 'lucide-react-native';

export const TaskForm = ({ onSubmit, onClose }: any) => {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('Medium 🟡');
  const [showSuccess, setShowSuccess] = useState(false);

  const priorities = ['Low 🟢', 'Medium 🟡', 'High 🔴'];

  if (showSuccess) {
    return (
      <View className="flex-1 bg-slate-950 items-center justify-center p-6">
        <View className="mb-6 items-center">
          <CheckSquare size={80} color="#10b981" />
        </View>
        <Text className="text-3xl font-black text-white mb-2">Task Saved!</Text>
        <Text className="text-slate-400 mb-10 text-center">
          Added: <Text className="text-white font-bold">{title}</Text>
        </Text>
        <TouchableOpacity 
          onPress={() => onSubmit({ title, type: 'task' })}
          className="w-full bg-indigo-600 py-4 rounded-2xl items-center shadow-lg shadow-indigo-500/20"
        >
          <Text className="text-white font-bold text-lg">Done</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-slate-950">
      {/* Navigation Header */}
      <View className="flex-row justify-between items-center px-6 pt-14 pb-4 border-b border-white/5 bg-slate-900/50">
        <TouchableOpacity onPress={onClose} hitSlop={15}>
          <Text className="text-slate-400 font-bold">Cancel</Text>
        </TouchableOpacity>
        <Text className="text-white font-bold text-base">New To-Do</Text>
        <TouchableOpacity 
          onPress={() => setShowSuccess(true)} 
          disabled={!title}
        >
          <Text className={`font-bold ${!title ? 'text-slate-700' : 'text-indigo-400'}`}>
            Save
          </Text>
        </TouchableOpacity>
      </View>

      <View className="p-6 gap-y-10">
        {/* Main Input */}
        <TextInput 
          autoFocus 
          placeholder="What needs to be done?" 
          placeholderTextColor="#334155"
          value={title} 
          onChangeText={setTitle}
          multiline
          className="text-3xl font-black text-white tracking-tight leading-tight min-h-[100px]"
          textAlignVertical="top"
        />

        {/* Priority Selector */}
        <View className="gap-y-4">
          <Text className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">
            Priority Level
          </Text>
          <View className="flex-row gap-2">
            {priorities.map(p => {
              const isActive = priority === p;
              return (
                <TouchableOpacity 
                  key={p} 
                  onPress={() => setPriority(p)} 
                  className={`flex-1 py-4 rounded-2xl items-center border transition-all ${
                    isActive ? 'bg-slate-800 border-indigo-500' : 'bg-slate-900 border-white/5'
                  }`}
                >
                  <Text className={`text-[11px] font-black ${isActive ? 'text-white' : 'text-slate-500'}`}>
                    {p}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Deadline Toggle (Placeholder for DatePicker) */}
        <TouchableOpacity className="bg-slate-900/50 rounded-2xl p-5 border border-white/5 flex-row items-center justify-between">
          <View className="flex-row items-center gap-3">
            <Calendar size={20} color="#818cf8" />
            <Text className="text-white font-bold text-sm">Set Deadline</Text>
          </View>
          <View className="bg-slate-800 px-3 py-1.5 rounded-lg border border-white/5">
            <Text className="text-slate-400 text-xs font-bold">No date set</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};