import React, { useState } from 'react';
import { ArrowLeft, Calendar, Utensils, Clock, Star, ThumbsUp, ThumbsDown, ChevronRight } from 'lucide-react';
import GlassCard from '../components/ui/GlassCard';

// Using the mock data from our data file
import { FULL_MESS_MENU } from '../data/mockData';

interface MessMenuProps {
  isOpen: boolean;
  onBack: () => void;
}

export const MessMenu: React.FC<MessMenuProps> = ({ isOpen, onBack }) => {
  const [activeMeal, setActiveMeal] = useState('Lunch');
  
  if (!isOpen) return null;

  const currentMenu = FULL_MESS_MENU[activeMeal];

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950 overflow-y-auto animate-in slide-in-from-bottom duration-500">
      {/* Header with Warm Gradient */}
      <div className="relative h-64 bg-gradient-to-br from-orange-500 to-rose-600 rounded-b-[40px] p-6 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <button onClick={onBack} className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white active:scale-95 transition-transform">
            <ArrowLeft size={20} />
          </button>
          <div className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
             <Calendar size={12} /> Today
          </div>
        </div>

        <div className="flex flex-col items-center">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-lg rounded-2xl flex items-center justify-center text-white mb-4 border border-white/10 shadow-lg">
            <Utensils size={32} />
          </div>
          <h1 className="text-3xl font-black text-white text-center leading-tight">Mess Menu</h1>
          <p className="text-orange-100 text-sm mt-1 font-bold tracking-wide">Hostel 12 • North Indian</p>
        </div>
      </div>

      <div className="px-6 -mt-8 relative z-10 space-y-6 pb-32">
        {/* Meal Segmented Control */}
        <div className="bg-slate-900/90 backdrop-blur-xl border border-white/10 p-1.5 rounded-2xl flex shadow-xl">
           {Object.keys(FULL_MESS_MENU).map(meal => (
              <button 
                 key={meal}
                 onClick={() => setActiveMeal(meal)}
                 className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 ${
                   activeMeal === meal 
                    ? 'bg-gradient-to-tr from-orange-500 to-rose-500 text-white shadow-lg shadow-orange-500/20' 
                    : 'text-slate-500 hover:text-slate-300'
                 }`}
              >
                 {meal}
              </button>
           ))}
        </div>

        {/* Meal Metadata */}
        <div className="flex justify-between items-center px-2">
           <div className="flex items-center gap-1.5 text-slate-400 text-xs font-bold">
              <Clock size={14} className="text-orange-500" />
              <span>{currentMenu.time}</span>
           </div>
           <div className="flex items-center gap-1.5">
              <Star size={14} className="text-yellow-500 fill-yellow-500" />
              <span className="text-white font-black text-xs">{currentMenu.rating}</span>
              <span className="text-slate-500 text-[10px]">(142 reviews)</span>
           </div>
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-2 gap-3">
           {currentMenu.items.map((item: any, i: number) => (
              <GlassCard key={i} className="p-4 flex flex-col items-center text-center gap-2 hover:bg-slate-800/60 transition-colors group">
                 <div className="text-4xl mb-1 group-hover:scale-110 transition-transform duration-300">
                    {item.icon}
                 </div>
                 <h3 className="text-white font-bold text-sm leading-tight">{item.name}</h3>
                 <span className="text-[9px] font-black text-slate-500 bg-slate-950 px-2 py-0.5 rounded-full uppercase tracking-tighter">
                    {item.calories}
                 </span>
              </GlassCard>
           ))}
        </div>

        {/* Feedback Section */}
        <GlassCard className="p-5">
           <h3 className="text-white font-bold text-sm mb-4 text-center">How's the food today?</h3>
           <div className="flex gap-3">
              <button className="flex-1 py-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center gap-2 text-emerald-400 font-bold text-xs hover:bg-emerald-500 hover:text-white transition-all">
                 <ThumbsUp size={16} /> Good
              </button>
              <button className="flex-1 py-3 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center justify-center gap-2 text-rose-400 font-bold text-xs hover:bg-rose-500 hover:text-white transition-all">
                 <ThumbsDown size={16} /> Bad
              </button>
           </div>
        </GlassCard>
      </div>
    </div>
  );
};