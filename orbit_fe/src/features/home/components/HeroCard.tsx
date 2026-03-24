// src/features/home/components/HeroCard.tsx

import React from "react";
import { MapPin, CheckCircle2, Zap, LayoutGrid } from "lucide-react";
import type { AppTab } from "../../../types";

interface HeroCardProps {
  currentClass: any;
  upcomingEvents: any[];
  onCourseSelect: (event: any) => void;
  onMarkAttendance: (id: number, status: "present" | "absent") => void;
  onNavigate: (tab: AppTab) => void;
}

export const HeroCard: React.FC<HeroCardProps> = ({
  currentClass,
  upcomingEvents,
  onCourseSelect,
  onMarkAttendance,
  onNavigate,
}) => {
  if (!currentClass) return null;

  const nextEvent = upcomingEvents?.[0];

  return (
    <div
      className="bg-slate-900/40 backdrop-blur-md border border-white/5 rounded-[32px] overflow-hidden mb-6 shadow-2xl cursor-pointer"
      onClick={() => onCourseSelect(currentClass)}
    >
      <div className="p-6 pb-4">
        {/* TOP SECTION */}
        <div className="flex justify-between items-start mb-4">
          {/* LIVE STATUS */}
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              {currentClass.status === "live" ? "Live Now" : "Up Next"}
            </span>
          </div>

          {/* ATTENDANCE RING */}
          <div className="relative w-14 h-14">
            <svg className="w-full h-full -rotate-90">
              <circle
                cx="28"
                cy="28"
                r="24"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
                className="text-white/5"
              />
              <circle
                cx="28"
                cy="28"
                r="24"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
                strokeDasharray="150"
                strokeDashoffset="50"
                className="text-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]"
              />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-[10px] font-black text-white">66%</span>
              <span className="text-[6px] font-bold text-slate-500 uppercase">
                Attnd
              </span>
            </div>
          </div>
        </div>

        {/* SUBJECT */}
        <h2 className="text-3xl font-black text-white mb-4 tracking-tight">
          {currentClass.subject}
        </h2>

        {/* ROOM + ATTENDANCE BUTTONS */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center gap-1.5 text-slate-400 text-xs font-bold">
            <MapPin size={14} className="text-indigo-400" />
            {currentClass.room}
          </div>

          {!currentClass.attendanceStatus && (
            <div
              className="flex gap-2"
              onClick={(e) => e.stopPropagation()}
            >
              <div
                onClick={() =>
                  onMarkAttendance(currentClass.id, "present")
                }
                className="p-1.5 bg-emerald-500/20 rounded-lg text-emerald-400 border border-emerald-500/20 cursor-pointer"
              >
                <CheckCircle2 size={16} />
              </div>

              <div
                onClick={() =>
                  onMarkAttendance(currentClass.id, "absent")
                }
                className="p-1.5 bg-rose-500/20 rounded-lg text-rose-400 border border-rose-500/20 cursor-pointer"
              >
                <Zap size={16} fill="currentColor" />
              </div>
            </div>
          )}
        </div>

        {/* BUNK MANAGER BUTTON */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNavigate("bunk");
          }}
          className="w-full py-4 bg-indigo-600 rounded-2xl flex items-center justify-center gap-3 shadow-[0_10px_20px_rgba(79,70,229,0.3)] active:scale-95 transition-all"
        >
          <LayoutGrid size={18} className="text-white" />
          <span className="text-sm font-black text-white">
            Bunk Manager
          </span>
        </button>
      </div>

      {/* UP NEXT SECTION */}
      {nextEvent && (
        <div
          onClick={(e) => {
            e.stopPropagation();
            onCourseSelect(nextEvent);
          }}
          className="bg-white/5 p-5 flex justify-between items-center border-t border-white/5 hover:bg-white/10 transition"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-rose-500/10 rounded-2xl border border-rose-500/20">
              <div className="w-5 h-5 border-2 border-rose-500/40 rounded flex items-center justify-center">
                <div className="w-2 h-[1px] bg-rose-500/40" />
              </div>
            </div>

            <div>
              <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">
                Up Next
              </p>
              <h4 className="text-white font-bold">
                {nextEvent.subject}
              </h4>
              <p className="text-[10px] text-slate-500 font-medium">
                {nextEvent.time} — {nextEvent.endTime}
              </p>
            </div>
          </div>

          <div className="text-right">
            <p className="text-[8px] font-black text-emerald-500 uppercase">
              Starts
            </p>
            <p className="text-2xl font-black text-emerald-400 tracking-tighter">
              5:13
            </p>
          </div>
        </div>
      )}
    </div>
  );
};