import React from 'react';
import { ArrowLeft, MoreHorizontal, MessageCircle, MapPin, Calendar, BookOpen, UserMinus, ChevronRight } from 'lucide-react';
import GlassCard from '../components/ui/GlassCard';
import AvatarRing from '../components/ui/AvatarRing';

interface FriendProfileProps {
  friend: any; // Ideally use a Friend interface extending User
  isOpen: boolean;
  onBack: () => void;
  onOpenChat: (params: { type: string; data: any }) => void;
}

export const FriendProfile: React.FC<FriendProfileProps> = ({ friend, isOpen, onBack, onOpenChat }) => {
  if (!isOpen || !friend) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950 overflow-y-auto animate-in slide-in-from-right duration-300">
      {/* Header with Emerald Gradient */}
      <div className="relative h-64 bg-gradient-to-br from-emerald-600 to-teal-800 rounded-b-[40px] p-6 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <button onClick={onBack} className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white active:scale-95 transition-transform">
            <ArrowLeft size={20} />
          </button>
          <button className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white">
             <MoreHorizontal size={20} />
          </button>
        </div>

        <div className="flex gap-4 overflow-x-auto px-2">
           <div className="mb-3">
              <AvatarRing src={friend.avatar} status={friend.status} size="xl" />
           </div>
          <h1 className="text-2xl font-bold text-white leading-tight">{friend.name}</h1>
          <p className="text-emerald-100 text-sm mt-1 font-medium">
            Year {friend.year} • {friend.branch}
          </p>
        </div>
      </div>

      <div className="px-6 -mt-8 relative z-10 space-y-6 pb-32">
        {/* Quick Info Card */}
        <GlassCard className="p-4 flex items-center justify-between">
           <div>
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Current Status</p>
              <div className="text-white font-bold flex items-center gap-2">
                 <div className={`w-2 h-2 rounded-full ${friend.status === 'free' ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`}></div>
                 <span className="text-sm">Batch {friend.subBatch} • {friend.time}</span>
              </div>
           </div>
           <div className="flex gap-2">
              <button 
                 onClick={() => onOpenChat({ type: 'dm', data: friend })} 
                 className="p-3 bg-slate-800 rounded-full text-indigo-400 hover:bg-indigo-500 hover:text-white transition-all active:scale-90"
              >
                 <MessageCircle size={20} />
              </button>
           </div>
        </GlassCard>

        {/* Bio Section */}
        <div>
           <h3 className="text-white font-bold text-lg mb-2">About</h3>
           <p className="text-slate-400 text-sm leading-relaxed">
             {friend.bio || `Third year ${friend.branch} student residing in ${friend.hostel}. Let's collaborate on projects!`}
           </p>
        </div>

        {/* Action List */}
        <div className="space-y-2">
           <button className="w-full py-4 bg-slate-900 border border-white/5 rounded-2xl flex items-center justify-between px-4 text-white font-medium hover:bg-slate-800 transition-colors group">
              <div className="flex items-center gap-3">
                <Calendar size={18} className="text-indigo-400" />
                <span className="text-sm">Compare Schedule</span>
              </div>
              <ChevronRight size={18} className="text-slate-600 group-hover:text-white transition-colors" />
           </button>
           
           <button className="w-full py-4 bg-slate-900 border border-white/5 rounded-2xl flex items-center justify-between px-4 text-white font-medium hover:bg-slate-800 transition-colors group">
              <div className="flex items-center gap-3">
                <BookOpen size={18} className="text-emerald-400" />
                <span className="text-sm">Mutual Classes</span>
              </div>
              <ChevronRight size={18} className="text-slate-600 group-hover:text-white transition-colors" />
           </button>

           <button className="w-full py-4 bg-slate-900/50 border border-rose-500/10 rounded-2xl flex items-center justify-center px-4 text-rose-400 font-bold text-sm hover:bg-rose-500/10 transition-colors mt-4">
              <UserMinus size={18} className="mr-2"/> Remove Friend
           </button>
        </div>
      </div>
    </div>
  );
};