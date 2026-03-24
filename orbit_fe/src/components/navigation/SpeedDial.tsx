import {
  BookOpen,
  Utensils,
  CheckSquare,
  CalendarPlus,
  PenSquare,
} from "lucide-react";

interface SpeedDialProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  onAction: (type: string) => void;
}

const SpeedDial = ({ open, setOpen, onAction }: SpeedDialProps) => {
  if (!open) return null;

  return (
    <div
      className="absolute inset-0 z-40 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={() => setOpen(false)}
    >
      <div className="absolute bottom-24 left-0 right-0 flex flex-col items-center gap-3 z-50 pointer-events-none">

        {/* Item 5: Class */}
        <div className="flex items-center gap-2.5 pointer-events-auto transition-all duration-300 delay-[250ms] animate-in slide-in-from-bottom-5 fade-in">
          <span className="text-white text-[11px] font-bold bg-slate-900/80 px-2.5 py-1 rounded-lg border border-white/10 backdrop-blur-md shadow-lg">
            Class
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAction("class");
            }}
            className="w-10 h-10 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/30 hover:scale-110 transition-transform"
          >
            <BookOpen size={16} />
          </button>
        </div>

        {/* Item 4: Mess */}
        <div className="flex items-center gap-2.5 pointer-events-auto transition-all duration-300 delay-[200ms] animate-in slide-in-from-bottom-4 fade-in">
          <span className="text-white text-[11px] font-bold bg-slate-900/80 px-2.5 py-1 rounded-lg border border-white/10 backdrop-blur-md shadow-lg">
            Mess
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAction("mess");
            }}
            className="w-10 h-10 rounded-full bg-gradient-to-tr from-orange-500 to-red-500 text-white flex items-center justify-center shadow-lg shadow-orange-500/30 hover:scale-110 transition-transform"
          >
            <Utensils size={16} />
          </button>
        </div>

        {/* Item 3: To-Do */}
        <div className="flex items-center gap-2.5 pointer-events-auto transition-all duration-300 delay-[150ms] animate-in slide-in-from-bottom-3 fade-in">
          <span className="text-white text-[11px] font-bold bg-slate-900/80 px-2.5 py-1 rounded-lg border border-white/10 backdrop-blur-md shadow-lg">
            To-Do
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAction("task");
            }}
            className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30 hover:scale-110 transition-transform"
          >
            <CheckSquare size={16} />
          </button>
        </div>

        {/* Item 2: Event */}
        <div className="flex items-center gap-2.5 pointer-events-auto transition-all duration-300 delay-[100ms] animate-in slide-in-from-bottom-2 fade-in">
          <span className="text-white text-[11px] font-bold bg-slate-900/80 px-2.5 py-1 rounded-lg border border-white/10 backdrop-blur-md shadow-lg">
            Event
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAction("event");
            }}
            className="w-10 h-10 rounded-full bg-gradient-to-tr from-sky-500 to-blue-600 text-white flex items-center justify-center shadow-lg shadow-sky-500/30 hover:scale-110 transition-transform"
          >
            <CalendarPlus size={16} />
          </button>
        </div>

        {/* Item 1: Post */}
        <div className="flex items-center gap-2.5 pointer-events-auto transition-all duration-300 delay-[50ms] animate-in slide-in-from-bottom-1 fade-in">
          <span className="text-white text-[11px] font-bold bg-slate-900/80 px-2.5 py-1 rounded-lg border border-white/10 backdrop-blur-md shadow-lg">
            Post
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAction("post");
            }}
            className="w-10 h-10 rounded-full bg-gradient-to-tr from-rose-500 to-orange-500 text-white flex items-center justify-center shadow-lg shadow-rose-500/30 hover:scale-110 transition-transform"
          >
            <PenSquare size={16} />
          </button>
        </div>

      </div>
    </div>
  );
};

export default SpeedDial;