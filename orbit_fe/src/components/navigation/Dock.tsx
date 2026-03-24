import { Home, Calendar, Plus, Sparkles, User } from "lucide-react";
import type { AppTab, ScheduleView } from "../../types";

interface DockProps {
  activeTab: string;
  setActiveTab: (tab: AppTab) => void;
  setScheduleView: (view: ScheduleView) => void;
  showFabMenu: boolean;
  setShowFabMenu: (value: boolean) => void;
}

const Dock = ({
  activeTab,
  setActiveTab,
  setScheduleView,
  showFabMenu,
  setShowFabMenu,
}: DockProps) => {
  
  const tabs = [
    { id: "home", icon: Home },
    { id: "schedule", icon: Calendar },
    { id: "social", icon: Sparkles },
    { id: "profile", icon: User },
  ];

  const handleTabClick = (id: AppTab) => {
    if (id === "schedule") {
      setScheduleView("my_schedule");
    }
    setActiveTab(id);
  };

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-sm z-[100]">
      
      <div className="bg-slate-900/80 backdrop-blur-2xl border border-white/10 p-2 rounded-[28px] flex justify-between items-center shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative">

        {/* TABS */}
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id as AppTab)}
            className={`p-4 rounded-2xl transition-all duration-300 ${
              activeTab === tab.id
                ? "bg-indigo-600 text-white shadow-[0_0_20px_rgba(79,70,229,0.4)]"
                : "text-slate-500 hover:text-slate-300"
            }`}
          >
            <tab.icon
              size={22}
              strokeWidth={activeTab === tab.id ? 2.5 : 2}
            />
          </button>
        ))}

        {/* FLOATING FAB (kept from your original code) */}
        <div className="absolute left-1/2 -translate-x-1/2 -top-6 group">
          <button
            onClick={() => setShowFabMenu(!showFabMenu)}
            className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${
              showFabMenu
                ? "bg-slate-800 text-slate-400 rotate-45 border border-white/10"
                : "bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 text-white shadow-purple-500/40 hover:scale-110 active:scale-95"
            }`}
          >
            <Plus size={28} strokeWidth={3} />
          </button>

          {/* Glow */}
          <div
            className={`absolute inset-0 rounded-full bg-purple-500 blur-md transition-opacity -z-10 ${
              showFabMenu ? "opacity-0" : "opacity-40 group-hover:opacity-60"
            }`}
          />
        </div>
      </div>
    </div>
  );
};

export default Dock;