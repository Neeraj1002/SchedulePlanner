import React from 'react';

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
    <div className="flex border-b border-white/10">
      {tabs.map((tab) => (
        <button 
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`flex-1 py-3 text-sm font-bold border-b-2 transition-all duration-300 ${
            activeTab === tab.id 
              ? 'border-indigo-500 text-white' 
              : 'border-transparent text-slate-500 hover:text-slate-300'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};