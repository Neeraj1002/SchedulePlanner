import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

type SubTab = 'classes' | 'friends' | 'subscribed';

interface ProfileSubTabsProps {
  activeTab: SubTab;
  setActiveTab: (tab: SubTab) => void;
}

export const ProfileSubTabs: React.FC<ProfileSubTabsProps> = ({ activeTab, setActiveTab }) => {
  const tabs: { id: SubTab; label: string }[] = [
    { id: 'classes', label: 'Classes' },
    { id: 'friends', label: 'Friends' },
    { id: 'subscribed', label: 'Subscribed' }
  ];

  return (
    <View className="flex-row border-b border-white/10">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        
        return (
          <TouchableOpacity 
            key={tab.id}
            onPress={() => setActiveTab(tab.id)}
            activeOpacity={0.7}
            className={`flex-1 py-4 items-center border-b-2 ${
              isActive ? 'border-indigo-500' : 'border-transparent'
            }`}
          >
            <Text className={`text-sm font-bold ${
              isActive ? 'text-white' : 'text-slate-500'
            }`}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};