import React, { useState } from 'react';
import { ChevronRight, Code, Cpu, Users, BookOpen } from 'lucide-react';
import { ProfileHeader } from './ProfileHeader';
import { ProfileSubTabs } from './ProfileSubTabs';
import { ShareButton } from './components/ShareButton'; // Adjust path if you moved it up
import GlassCard from '../../components/ui/GlassCard';

type SubTab = 'classes' | 'friends' | 'subscribed';

const ProfileTab = ({ user, scheduleData, friendsOnline, suggestedSchedules, setToast }: any) => {
  const [activeSubTab, setActiveSubTab] = useState<SubTab>('classes');

  const handleShare = () => {
    // 1. Prepare the URL
    const shareUrl = `https://orbit.app/${user.name.toLowerCase()}/schedule`;
    
    // 2. Execute the Copy (Using your original logic for compatibility)
    const dummy = document.createElement("textarea");
    document.body.appendChild(dummy);
    dummy.value = shareUrl;
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy);
    
    // 3. Trigger the Toast (Passed down from App.tsx)
    setToast({ message: "Link copied to clipboard!", type: "success" });
  };

  return (
    <div className="relative h-full">
      <div className="pb-32 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pt-6 px-4 overflow-y-auto h-full">
        
        {/* Profile Identity & Bio */}
        <ProfileHeader user={user} />
        
        {/* Navigation between Classes, Friends, Subscribed */}
        <ProfileSubTabs activeTab={activeSubTab} setActiveTab={setActiveSubTab} />

        {/* Content List based on active tab */}
        <div className="space-y-3">
          {activeSubTab === 'classes' && scheduleData.map((item: any) => (
             <div key={item.id} className="flex items-center gap-4 p-3 bg-slate-900/50 border border-white/5 rounded-2xl">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-slate-800 text-2xl">
                   {item.code.startsWith('CS') ? <Code size={24} className="text-violet-400"/> : 
                    item.code.startsWith('EE') ? <Cpu size={24} className="text-cyan-400"/> :
                    item.code === 'CLUB' ? <Users size={24} className="text-emerald-400"/> :
                    <BookOpen size={24} className="text-rose-400"/>}
                </div>
                <div className="flex-1">
                   <h3 className="text-white font-bold">{item.subject}</h3>
                   <p className="text-xs text-slate-400">{item.code} • {item.room}</p>
                </div>
                <ChevronRight size={16} className="text-slate-600"/>
             </div>
          ))}

          {activeSubTab === 'friends' && friendsOnline.map((friend: any) => (
             <div key={friend.id} className="flex items-center gap-4 p-3 bg-slate-900/50 border border-white/5 rounded-2xl">
                <img src={friend.avatar} className="w-12 h-12 rounded-full bg-slate-800" alt={friend.name} />
                <div className="flex-1">
                   <h3 className="text-white font-bold">{friend.name}</h3>
                   <p className="text-xs text-slate-400">{friend.status}</p>
                </div>
                <div className={`w-3 h-3 rounded-full ${friend.status === 'free' ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
             </div>
          ))}

          {activeSubTab === 'subscribed' && (
             // ... logic for suggestedSchedules ...
             <div className="text-center py-8 text-slate-500 text-sm">List logic goes here</div>
          )}
        </div>
      </div>

      {/* Floating Share Button - Passing the function defined above */}
      <ShareButton onShare={handleShare} />
    </div>
  );
};

export default ProfileTab;