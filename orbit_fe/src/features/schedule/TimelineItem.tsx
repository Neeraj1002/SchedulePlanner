import { MapPin, Check, Zap, CheckCircle2 } from "lucide-react";
import { getCourseStyle } from "../../utils/styleHelpers";
import type { ScheduleItem } from "../../types/schedule";

interface TimeLineProps {
  event: ScheduleItem;
  isLast: boolean;
  onClick: (event: ScheduleItem) => void;
  onMarkAttendance: (id: number, status: "present" | "absent") => void;
}

export default function TimelineItem ({ event, isLast, onClick, onMarkAttendance } : TimeLineProps) {
  const isLive = event.status === 'live';
  const isCompleted = event.status === 'completed';
  const style = getCourseStyle(event.code);
  const Icon = style.icon;
  
  return (
    <div className="flex gap-4 relative group cursor-pointer" onClick={() => onClick(event)}>

      {/* Time */}
      <div className="w-14 flex flex-col items-end pt-1">
        <span className={`text-sm font-bold ${isLive ? style.color : isCompleted ? 'text-slate-500' : 'text-slate-200'}`}>
          {event.time}
        </span>
        <span className="text-[10px] text-slate-500">{event.endTime}</span>
      </div>

      {/* Timeline Dot */}
      <div className="relative flex flex-col items-center">
        <div className={`w-3 h-3 rounded-full border-2 z-10 transition-all duration-300
          ${isLive 
            ? `bg-slate-950 ${style.border} ${style.color} shadow-[0_0_15px_currentColor] scale-110` 
            : isCompleted ? 'bg-slate-800 border-slate-600' : 'bg-slate-900 border-slate-400'}`} 
        />
        {!isLast && (
          <div className={`w-0.5 flex-1 mt-1 mb-1 
            ${isLive ? `bg-gradient-to-b ${style.color.replace('text-', 'from-')} via-slate-800 to-slate-800` : 'bg-slate-800'}`} 
          />
        )}
      </div>

      {/* Event Card */}
      <div className="flex-1 pb-8">
        <div className={`rounded-2xl p-4 border transition-all active:scale-95 duration-200 relative overflow-hidden
          ${isLive 
            ? `bg-gradient-to-r ${style.activeGradient} ${style.border} shadow-lg` 
            : isCompleted 
              ? 'bg-slate-900/20 border-white/5 opacity-60' 
              : `${style.bg} ${style.border}`
          }`}
        >
          {/* Background Icon Watermark */}
          <Icon className={`absolute -right-4 -bottom-4 w-24 h-24 opacity-5 ${style.color}`} />

          <div className="flex justify-between items-start mb-2 relative z-10">
            <div>
              <h3 className={`font-bold text-base ${isLive ? 'text-white' : 'text-slate-200'}`}>
                {event.subject}
              </h3>
              <p className={`text-xs flex items-center gap-1 mt-1 ${isLive ? 'text-indigo-100' : 'text-slate-400'}`}>
                <MapPin size={12} /> {event.room} • {event.type}
              </p>
            </div>
            {event.code !== 'CLUB' && (
               <div className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5
                 ${isLive ? 'bg-white/20 text-white backdrop-blur-sm' : `${style.bg} ${style.color} border ${style.border}`}
               `}>
                 <Icon size={10} />
                 {event.code}
               </div>
            )}
          </div>
          
          {/* Quick Attendance Actions */}
          {(isLive || isCompleted) && event.code !== 'CLUB' && !event.attendanceStatus && (
            <div className="flex gap-2 mt-3 relative z-20" onClick={e => e.stopPropagation()}>
               <button 
                  onClick={() => onMarkAttendance(event.id, 'present')}
                  className="flex-1 bg-emerald-500/20 hover:bg-emerald-500 border border-emerald-500/30 text-emerald-100 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1"
               >
                  <Check size={12} /> Present
               </button>
               <button 
                  onClick={() => onMarkAttendance(event.id, 'absent')}
                  className="flex-1 bg-rose-500/20 hover:bg-rose-500 border border-rose-500/30 text-rose-100 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1"
               >
                  <Zap size={12} /> Bunk
               </button>
            </div>
          )}

          {/* Attendance Status Indicator */}
          {event.attendanceStatus && (
             <div className={`mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold border
                ${event.attendanceStatus === 'present' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-rose-500/20 text-rose-300 border-rose-500/30'}
             `}>
                {event.attendanceStatus === 'present' ? <CheckCircle2 size={12}/> : <Zap size={12}/>}
                {event.attendanceStatus === 'present' ? 'Marked Present' : 'Bunk Logged'}
             </div>
          )}
          
          {/* Classmates Preview (Only show if not expanded with actions) */}
          {(!((isLive || isCompleted) && !event.attendanceStatus)) && event.classmates.length > 0 && (
            <div className="flex -space-x-2 mt-3 items-center relative z-10">
              {event.classmates.slice(0, 3).map((name, i) => (
                <div key={i} className="w-6 h-6 rounded-full bg-slate-700 border border-slate-900 flex items-center justify-center text-[8px] text-white font-bold" title={name}>
                  {name[0]}
                </div>
              ))}
              {event.classmates.length > 3 && (
                <span className={`text-[10px] ml-3 ${isLive ? 'text-indigo-100' : 'text-slate-500'}`}>
                  +{event.classmates.length - 3} others
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};