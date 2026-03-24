// src/features/home/components/FriendsOrbit.tsx

import React from "react";
import { Plus } from "lucide-react";

interface FriendsOrbitProps {
  friends: any[];
  onFriendSelect: (friend: any) => void;
}

export const FriendsOrbit: React.FC<FriendsOrbitProps> = ({
  friends,
  onFriendSelect,
}) => {
  return (
    <div className="mb-10">
      <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4 opacity-80 px-1">
        Orbit • Friends Active
      </h3>

      <div className="flex flex-row gap-5 overflow-x-auto pb-4 scrollbar-hide px-2 snap-x">
        {friends.map((friend) => (
          <div
            key={friend.id}
            onClick={() => onFriendSelect(friend)}
            className="flex flex-col items-center gap-2 shrink-0 snap-center cursor-pointer"
          >
            {/* Avatar with gradient ring */}
            <div className="relative p-[2px] rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 shadow-[0_0_15px_rgba(99,102,241,0.3)]">
              
              <div className="bg-slate-950 p-[2px] rounded-full">
                <img
                  src={friend.avatar}
                  className="w-14 h-14 rounded-full bg-slate-800"
                  alt={friend.name}
                />
              </div>

              {/* Status dot */}
              <div
                className={`absolute bottom-0 right-1 w-3.5 h-3.5 rounded-full border-2 border-slate-950 ${
                  friend.status === "free"
                    ? "bg-emerald-400 shadow-[0_0_8px_#34d399]"
                    : "bg-rose-500 shadow-[0_0_8px_#f43f5e]"
                }`}
              />
            </div>

            {/* Name + time */}
            <div className="text-center">
              <p className="text-[11px] font-bold text-white tracking-tight">
                {friend.name}
              </p>
              <p className="text-[9px] text-slate-500 font-medium">
                {friend.time}
              </p>
            </div>
          </div>
        ))}

        {/* Add Button (kept from your original code) */}
        <div className="flex flex-col items-center gap-2 min-w-[64px] justify-start pt-1">
          <button className="w-12 h-12 rounded-full border-2 border-dashed border-slate-700 flex items-center justify-center text-slate-500 hover:text-white hover:border-slate-500 transition-colors">
            <Plus size={20} />
          </button>
          <span className="text-[10px] text-slate-500">Add</span>
        </div>
      </div>
    </div>
  );
};