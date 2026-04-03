import React, { useState } from "react";
import {
  Search,
  Bell,
  Send,
  Utensils,
  Compass,
} from "lucide-react";

import GlassCard from "../../components/ui/GlassCard";
import { FriendsOrbit } from "./components/FriendsOrbit";
import { HeroCard } from "./components/HeroCard";
import type { AppTab } from "../../types";
import { Star, BellRing, ChevronRight } from 'lucide-react';
import { DiscoverView } from "../schedule/DiscoverView";

interface HomeTabProps {
  user: any;
  friends: any[];
  events: any[];
  onNavigate: (tab: AppTab) => void;
  onCourseSelect: (event: any) => void;
  onMenuSelect: () => void;
  onNavigateToDiscover: () => void;
  onMarkAttendance: (id: number, status: "present" | "absent") => void;
  onFriendSelect: (friend: any) => void;
}

export const HomeTab: React.FC<HomeTabProps> = ({
  user,
  friends,
  events,
  onNavigate,
  onCourseSelect,
  onMenuSelect,
  onNavigateToDiscover,
  onMarkAttendance,
  onFriendSelect,
}) => {
  const currentClass =
    events.find((e) => e.status === "live") ||
    events.find((e) => e.status === "upcoming") ||
    events[0];

  const upcomingEvents = events.filter(
    (e) => e.status === "upcoming" && e.id !== currentClass?.id
  );

  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  const [showDiscover, setShowDiscover] = useState(false);

  if (showDiscover) {
  return <DiscoverView />;
  }
  return (
    <div className="flex flex-col gap-4 pb-32 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* HEADER */}
      {/* Header & Friends Rail */}
      <div className="space-y-6">
        <div className="flex justify-between items-center px-1">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => onNavigate('profile')}
              className="relative group transition-transform active:scale-95"
            >
              <img src={user.avatar} className="w-10 h-10 rounded-full bg-indigo-500/20 border border-white/10 group-hover:border-indigo-400 transition-colors" alt="Profile"/>
              <div className="absolute -bottom-1 -right-1 bg-slate-950 rounded-full p-0.5">
                <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
              </div>
            </button>
            <div>
              <h1 className="text-lg font-bold text-white leading-none">Hi, {user.name}</h1>
              <p className="text-xs text-slate-400 mt-1">IIT Bombay • Sem 4</p>
            </div>
            {/* Search moved closer to Arjun */}
            <button className="w-8 h-8 rounded-full bg-slate-800/50 flex items-center justify-center text-slate-300 border border-white/5 hover:bg-slate-700 transition-colors ml-1">
              <Search size={16} />
            </button>
          </div>
          <div className="flex gap-3">
            <button className="w-10 h-10 rounded-full bg-slate-800/50 flex items-center justify-center text-slate-300 border border-white/5 hover:bg-slate-700 transition-colors relative">
              <Bell size={18} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border border-slate-900"></span>
            </button>
            {/* Added Send (Chat) icon here */}
            <button className="w-10 h-10 rounded-full bg-slate-800/50 flex items-center justify-center text-slate-300 border border-white/5 hover:bg-slate-700 transition-colors">
              <Send size={18} />
            </button>
          </div>
        </div>

        <FriendsOrbit 
          friends={friends} 
          onFriendSelect={onFriendSelect} 
        />

      {/* DATE */}
      <div className="flex justify-between items-center px-1 pt-2 pb-1">
            <h2 className="text-2xl font-bold text-white tracking-tight">{formattedDate}</h2>
      </div>

      <HeroCard
        currentClass={currentClass}
        upcomingEvents={upcomingEvents}
        onCourseSelect={onCourseSelect}
        onMarkAttendance={onMarkAttendance}
        onNavigate={onNavigate}
      />

      <div className="grid grid-cols-2 gap-4 mt-8">
        {/* MESS SECTION - CLICKABLE CARD */}
        <div className="flex flex-col gap-3">
          {/* Mess Menu Widget */}
          <GlassCard 
            onClick={onMenuSelect}
            className="p-4 flex flex-col justify-between h-44 relative overflow-hidden group hover:bg-slate-800/50 transition-colors cursor-pointer"
          >
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-orange-500/20 rounded-full blur-2xl group-hover:bg-orange-500/30 transition-all"></div>
                      
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-3">
                  <Utensils size={14} className="text-orange-400"/>
                  <span className="text-xs font-bold text-orange-200 uppercase">Lunch</span>
                </div>
                <p className="text-white font-bold text-xl leading-tight mb-1">Rajma Chawal</p>
                <p className="text-slate-400 text-xs">w/ Jeera Aloo, Roti & Curd</p>
              </div>
                      
              <div className="relative z-10 mt-2">
                <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                  <span>Rating</span>
                  <span className="text-orange-400 font-bold">4.2 ★</span>
                </div>
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-orange-500 w-[84%] rounded-full"></div>
                </div>
              </div>
          </GlassCard>
        </div>
        {/* DISCOVER SECTION - EVENTS & SUBSCRIPTION */}
        <div className="flex flex-col gap-3">
          {/* Discover Schedule Widget (Replaces Stats) */}
          <GlassCard 
            onClick={onNavigateToDiscover} // Use the specific handler
            className="p-4 flex flex-col justify-between h-44 bg-slate-900/40 relative overflow-hidden group cursor-pointer"
          >
            <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition-all"></div>
            
            <div>
               <div className="flex items-center gap-2 mb-3">
                  <Compass size={14} className="text-purple-400"/>
                  <span className="text-xs font-bold text-purple-200 uppercase">Discover</span>
               </div>
               <h3 className="text-white font-bold text-lg leading-tight mb-1">Public Calendars</h3>
               <p className="text-slate-400 text-xs">Find clubs, exams & events</p>
            </div>

            <div className="flex flex-wrap gap-2 mt-2">
               <span className="text-[10px] bg-slate-800 border border-white/5 px-2 py-1 rounded-md text-slate-300">⚽ Sports</span>
               <span className="text-[10px] bg-slate-800 border border-white/5 px-2 py-1 rounded-md text-slate-300">🎭 Cult</span>
               <span className="text-[10px] bg-slate-800 border border-white/5 px-2 py-1 rounded-md text-slate-300">🚀 Tech</span>
               <span className="text-[10px] bg-slate-800 border border-white/5 px-2 py-1 rounded-md text-slate-300">📝 Exams</span>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  </div>
  );
};
