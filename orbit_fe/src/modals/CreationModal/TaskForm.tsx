import React, { useState } from 'react';
import { CheckSquare, Calendar, Flag, Shield } from 'lucide-react';

export const TaskForm = ({ onSubmit, onClose }: { onSubmit: (d: any) => void, onClose: () => void }) => {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('Medium 🟡');
  const [showSuccess, setShowSuccess] = useState(false);

  if (showSuccess) {
    return (
      <div className="absolute inset-0 z-[60] bg-[#0B0E25] flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-500">
        <CheckSquare size={64} className="text-emerald-500 mb-6 animate-bounce" />
        <h2 className="text-3xl font-black text-white mb-2">Task Saved!</h2>
        <p className="text-slate-400 mb-8">Added: <span className="text-white">{title}</span></p>
        <button onClick={() => onSubmit({ title, type: 'task' })} className="w-full bg-indigo-600 py-4 rounded-2xl font-bold text-white active:scale-95 transition-all">Done</button>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 bg-[#0B0E25] flex flex-col animate-in slide-in-from-bottom-10">
      <div className="flex justify-between items-center px-6 pt-12 pb-4 border-b border-white/5">
        <button onClick={onClose} className="text-slate-400 font-bold text-sm">Cancel</button>
        <h2 className="text-lg font-bold text-white">New To-Do</h2>
        <button onClick={() => setShowSuccess(true)} disabled={!title} className="text-indigo-400 font-bold disabled:opacity-30">Save</button>
      </div>

      <div className="p-6 space-y-8">
        <input 
          autoFocus placeholder="What needs to be done?" value={title} onChange={e => setTitle(e.target.value)}
          className="bg-transparent text-3xl font-black text-white outline-none w-full tracking-tight placeholder:text-slate-700"
        />

        <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Priority</h3>
            <div className="grid grid-cols-3 gap-2">
                {['Low 🟢', 'Medium 🟡', 'High 🔴'].map(p => (
                    <button key={p} onClick={() => setPriority(p)} className={`py-3 rounded-xl text-xs font-bold border transition-all ${priority === p ? 'bg-slate-800 border-white text-white' : 'bg-slate-800/40 border-white/5 text-slate-500'}`}>{p}</button>
                ))}
            </div>
        </div>

        <div className="bg-slate-800/40 rounded-2xl p-4 border border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <Calendar size={18} className="text-indigo-400" />
                <span className="text-white font-bold text-sm">Set Deadline</span>
            </div>
            <input type="date" className="bg-transparent text-white text-xs font-bold outline-none invert" />
        </div>
      </div>
    </div>
  );
};