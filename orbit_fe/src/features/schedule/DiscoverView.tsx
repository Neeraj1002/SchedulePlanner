// src/features/schedule/DiscoverView.tsx
import React from "react";
import { Users, Plus, Check } from "lucide-react";
import GlassCard from "../../components/ui/GlassCard";

interface DiscoverItem {
  id: number;
  title: string;
  category: string;
  subscribers: string;
  isSubscribed: boolean;
  color: string;
  bg: string;
}

interface DiscoverViewProps {
  schedules?: DiscoverItem[];
  onToggleSubscribe?: (id: number) => void;
}

const SUGGESTED_SCHEDULES: DiscoverItem[] = [
  {
    id: 1,
    title: "Azad Hostel Mess",
    category: "Food",
    subscribers: "1.2k",
    isSubscribed: true,
    color: "text-orange-400",
    bg: "bg-orange-500/20",
  },
  {
    id: 2,
    title: "Placement Deadlines",
    category: "Career",
    subscribers: "3.5k",
    isSubscribed: true,
    color: "text-blue-400",
    bg: "bg-blue-500/20",
  },
  {
    id: 3,
    title: "Inter-IIT Sports",
    category: "Sports",
    subscribers: "850",
    isSubscribed: false,
    color: "text-emerald-400",
    bg: "bg-emerald-500/20",
  },
  {
    id: 4,
    title: "CSE Dept Seminars",
    category: "Academic",
    subscribers: "2.1k",
    isSubscribed: false,
    color: "text-purple-400",
    bg: "bg-purple-500/20",
  },
];

export const DiscoverView: React.FC<DiscoverViewProps> = ({
  schedules = SUGGESTED_SCHEDULES,
  onToggleSubscribe
}) => {
  return (
    <div className="px-1 space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">
          Suggested for you
        </h3>
      </div>

      {schedules.map((item) => (
        <GlassCard 
          key={item.id} 
          className="p-4 flex justify-between items-center group hover:border-white/20 transition-all active:scale-[0.99]"
        >
          <div className="flex items-center gap-4">
            {/* Category Icon/Color Dot */}
            <div className={`w-10 h-10 rounded-xl ${item.bg} flex items-center justify-center border border-white/5`}>
              <div className={`w-2 h-2 rounded-full ${item.color.replace('text', 'bg')} animate-pulse`} />
            </div>

            <div>
              <p className="text-white font-bold text-sm group-hover:text-indigo-300 transition-colors">
                {item.title}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-white/5 ${item.color}`}>
                  {item.category}
                </span>
                <span className="text-[10px] text-slate-500 flex items-center gap-1">
                  <Users size={10} /> {item.subscribers}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onToggleSubscribe?.(item.id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all
            ${
              item.isSubscribed
                ? "bg-slate-800/80 text-slate-400 border border-white/5"
                : "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20 hover:bg-indigo-500"
            }`}
          >
            {item.isSubscribed ? (
              <><Check size={14} /> Subscribed</>
            ) : (
              <><Plus size={14} /> Subscribe</>
            )}
          </button>
        </GlassCard>
      ))}
      
      {/* Featured Banner */}
      <div className="mt-6 p-5 rounded-2xl bg-gradient-to-br from-indigo-600/20 to-purple-600/20 border border-indigo-500/20 relative overflow-hidden">
        <div className="relative z-10">
          <p className="text-white font-bold">Hostel 12 Mess Menu</p>
          <p className="text-xs text-slate-400 mt-1">Live updates for Breakfast & Dinner</p>
          <button className="mt-3 text-xs font-bold text-indigo-400 flex items-center gap-1">
            View details <Plus size={12} />
          </button>
        </div>
        <div className="absolute -right-4 -bottom-4 opacity-10">
            <Plus size={100} className="text-white" />
        </div>
      </div>
    </div>
  );
};