import {BunkCard} from "./BunkCard";

interface BunkTabProps {
  stats: {
    id: number;
    code: string;
    subject: string;
    attended: number;
    total: number;
  }[];
  handleLogBunk: (id: number) => void;
}

export const BunkTab = ({ stats, handleLogBunk }: BunkTabProps) => {
  return (
    <div className="pb-32 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="px-1">
        <h1 className="text-2xl font-bold text-white mb-2">Bunk Manager</h1>
        <p className="text-sm text-slate-400">Strategic attendance tracking (75% Rule).</p>
      </div>

      <div className="space-y-4">
        {stats.map((stat) => (
          <BunkCard 
            key={stat.id} 
            stat={stat} 
            onLogBunk={handleLogBunk} 
          />
        ))}
      </div>
    </div>
  );
};