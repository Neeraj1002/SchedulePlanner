import { Zap, ShieldCheck, ShieldAlert, TrendingUp, TrendingDown } from "lucide-react";
import GlassCard from "../../components/ui/GlassCard";

interface BunkCardProps {
  stat: {
    id: number;
    code: string;
    subject: string;
    attended: number;
    total: number;
  };
  onLogBunk: (id: number) => void;
}

export const BunkCard = ({ stat, onLogBunk }: BunkCardProps) => {
  // Centralized Math Logic
  const percentage = Math.round((stat.attended / stat.total) * 100);
  const isSafe = percentage >= 75;
  const safeBunks = Math.floor(stat.attended / 0.75 - stat.total);
  const classesNeeded = !isSafe ? Math.ceil((0.75 * stat.total - stat.attended) / 0.25) : 0;

  return (
    <GlassCard className={`p-5 relative overflow-hidden transition-all ${!isSafe ? "border-rose-500/30" : "border-white/5"}`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-400">{stat.code}</span>
            <span className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded ${isSafe ? 'text-emerald-400 bg-emerald-400/10' : 'text-rose-400 bg-rose-400/10 animate-pulse'}`}>
              {isSafe ? <ShieldCheck size={12} /> : <ShieldAlert size={12} />} {isSafe ? 'Safe' : 'Critical'}
            </span>
          </div>
          <h3 className="font-bold text-white text-lg">{stat.subject}</h3>
          <p className="text-xs text-slate-400 mt-1">Attended {stat.attended}/{stat.total}</p>
        </div>

        {/* Ring Graphic */}
        <div className="relative w-14 h-14 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90">
            <circle cx="28" cy="28" r="24" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-slate-800" />
            <circle cx="28" cy="28" r="24" stroke="currentColor" strokeWidth="4" fill="transparent" strokeDasharray="150" strokeDashoffset={150 - (150 * percentage) / 100} className={isSafe ? "text-emerald-500" : "text-rose-500"} />
          </svg>
          <span className="absolute text-xs font-bold text-white">{percentage}%</span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-white/10">
        <div className="text-xs font-medium">
          <span className="text-slate-300">
            {isSafe ? "Safe bunks: " : "Need to attend: "}
            <strong className={isSafe ? "text-emerald-400" : "text-rose-400"}>{isSafe ? safeBunks : classesNeeded}</strong>
          </span>
        </div>
        
        <button
          onClick={() => onLogBunk(stat.id)}
          disabled={!isSafe && safeBunks <= 0}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${(!isSafe && safeBunks <= 0) ? 'bg-slate-800 text-slate-500 opacity-50' : 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'}`}
        >
          Log Bunk <Zap size={14} fill={isSafe ? "currentColor" : "none"} />
        </button>
      </div>
    </GlassCard>
  );
};