import { useState } from "react";
import { Calendar, Compass } from "lucide-react";
import TimelineItem from "./TimelineItem";
import type { ScheduleItem } from "../../types/schedule";
import {DiscoverView} from "./DiscoverView";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];

interface ScheduleProps {
  events: ScheduleItem[];
  onCourseSelect: (event: ScheduleItem) => void;
  view: "my_schedule" | "discover";
  onViewChange: (view: "my_schedule" | "discover") => void;
  onMarkAttendance: (id: number, status: "present" | "absent") => void;
}

export default function ScheduleTab ({ events, onCourseSelect, view, onViewChange, onMarkAttendance }: ScheduleProps) {
  const [activeDayIndex, setActiveDayIndex] = useState(0);

  return (
    <div className="pb-32 space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex flex-col gap-4 px-1">
         <div className="flex justify-between items-end">
            <div>
                <h1 className="text-3xl font-bold text-white tracking-tight">Schedule</h1>
                {view === 'discover' && (
                   <p className="text-slate-400 text-xs font-medium mt-1">
                      Explore campus events
                   </p>
                )}
            </div>
         </div>
         
         {/* Aesthetic Segmented Control */}
         <div className="flex bg-slate-900/80 p-1.5 rounded-2xl border border-white/10 relative backdrop-blur-md">
            <button 
               onClick={() => onViewChange('my_schedule')}
               className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all duration-300 relative z-10
               ${view === 'my_schedule' 
                  ? 'bg-gradient-to-tr from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/25' 
                  : 'text-slate-400 hover:text-slate-200'}`}
            >
               <Calendar size={16} /> My Schedule
            </button>
            <button 
               onClick={() => onViewChange('discover')}
               className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all duration-300 relative z-10
               ${view === 'discover' 
                  ? 'bg-gradient-to-tr from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/25' 
                  : 'text-slate-400 hover:text-slate-200'}`}
            >
               <Compass size={16} /> Discover
            </button>
         </div>
      </div>

      {view === 'my_schedule' ? (
         <>
            {/* Date Scroller */}
            <div className="flex justify-between px-1">
               {DAYS.map((day, idx) => (
               <button 
                  key={day} 
                  onClick={() => setActiveDayIndex(idx)}
                  className={`flex flex-col items-center gap-1 min-w-[50px] py-3 rounded-2xl border transition-all duration-300
                  ${idx === activeDayIndex 
                     ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-900/50 scale-110' 
                     : 'bg-slate-900/40 border-slate-800 text-slate-500 hover:bg-slate-800'}`}
               >
                  <span className="text-xs font-medium opacity-80">{day}</span>
                  <span className="text-lg font-bold">{12 + idx}</span>
                  {idx === activeDayIndex && <span className="w-1 h-1 rounded-full bg-white mt-1"></span>}
               </button>
               ))}
            </div>

            {/* Continuous Timeline */}
            <div className="pl-2 pr-1 pt-2">
               {events.map((event, index) => (
               <TimelineItem 
                  key={event.id} 
                  event={event} 
                  isLast={index === events.length - 1} 
                  onClick={() => onCourseSelect(event)}
                  onMarkAttendance={onMarkAttendance}
               />
               ))}
               
               {/* Empty State visual */}
               <div className="flex flex-col items-center justify-center py-10 opacity-30">
               <div className="w-1 h-12 bg-gradient-to-b from-slate-800 to-transparent"></div>
               <p className="text-xs text-slate-400 mt-2">End of scheduled events</p>
               </div>
            </div>
         </>
      ) : (
         <DiscoverView />
      )}
    </div>
  );
};