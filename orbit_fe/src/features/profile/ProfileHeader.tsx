import React from 'react';
import { 
  ArrowLeft, Share, Settings, BarChart3, 
  Instagram, Linkedin, Globe 
} from 'lucide-react';
import type { User } from '../../types/user';

interface ProfileHeaderProps {
  user: User;
  // In a real app, these would be functions passed from App.tsx or a router
  onBack?: () => void;
  onShare?: () => void;
  onSettings?: () => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user }) => {
  return (
    <div className="space-y-6">
      {/* Top Nav */}
      <div className="flex justify-between items-center">
        <button className="p-2 bg-slate-800/50 rounded-full text-white">
          <ArrowLeft size={20}/>
        </button>
        <div className="flex gap-2">
          <button className="p-2 bg-slate-800/50 rounded-full text-white">
            <Share size={20}/>
          </button>
          <button className="p-2 bg-slate-800/50 rounded-full text-white">
            <Settings size={20}/>
          </button>
        </div>
      </div>

      {/* Profile Info */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <img 
            src={user.avatar} 
            className="w-24 h-24 rounded-full border-2 border-indigo-500 object-cover" 
            alt={user.name}
          />
          <div className="absolute bottom-1 right-1 w-5 h-5 bg-emerald-500 border-2 border-slate-950 rounded-full"></div>
        </div>
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold text-white">{user.name}</h1>
          <p className="text-indigo-200 text-sm font-medium">
            Year {user.year} • {user.branch}
          </p>
          <div className="flex items-center gap-1.5 text-slate-400 text-xs mt-1">
            <span className="px-2 py-0.5 rounded bg-slate-800 border border-white/5">
              Batch {user.subBatch}
            </span>
            <span>•</span>
            <span>{user.hostel}</span>
          </div>
          {/* Socials */}
          <div className="flex gap-2 mt-2">
            {[Instagram, Linkedin, Globe].map((Icon, i) => (
              <div key={i} className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer">
                <Icon size={14}/>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bio */}
      <p className="text-slate-300 text-sm leading-relaxed">
        Computer Science undergrad. Building cool stuff. 🚀 <br/>
        Hostel 12 Core Team.
      </p>
    </div>
  );
};