import React, { useState, useEffect } from 'react';
import { Check, Calendar, Clock, MapPin, Bell, X, Globe, Users } from 'lucide-react';

// Shared constants for consistency
const EVENT_COLORS = [
  { id: 'indigo', hex: '#6366f1', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20', text: 'text-indigo-400' },
  { id: 'rose', hex: '#f43f5e', bg: 'bg-rose-500/10', border: 'border-rose-500/20', text: 'text-rose-400' },
  { id: 'amber', hex: '#f59e0b', bg: 'bg-amber-500/10', border: 'border-amber-500/20', text: 'text-amber-400' },
  { id: 'emerald', hex: '#10b981', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', text: 'text-emerald-400' },
];

export const EventForm = ({ onSubmit, onClose }: { onSubmit: (d: any) => void, onClose: () => void }) => {
  const [title, setTitle] = useState('');
  const [eventDate, setEventDate] = useState(new Date().toISOString().split('T')[0]);
  const [eventStartTime, setEventStartTime] = useState('14:00');
  const [eventEndTime, setEventEndTime] = useState('15:00');
  const [eventLocation, setEventLocation] = useState('');
  const [eventCategory, setEventCategory] = useState('Personal 👤');
  const [eventColor, setEventColor] = useState('indigo');
  const [showSuccess, setShowSuccess] = useState(false);
  const [ringDraw, setRingDraw] = useState(377);

  const activeTheme = EVENT_COLORS.find(c => c.id === eventColor) || EVENT_COLORS[0];

  const handleAddEvent = () => {
    setShowSuccess(true);
    setTimeout(() => setRingDraw(0), 100);
  };

  if (showSuccess) {
    return (
      <div className="absolute inset-0 z-[60] bg-[#0B0E25] flex flex-col items-center justify-center p-6 text-center animate-in zoom-in-95 duration-500">
        <div className="relative w-32 h-32 mb-8">
          <svg className="w-full h-full -rotate-90">
            <circle cx="64" cy="64" r="60" stroke="#1c1e3d" strokeWidth="8" fill="none" />
            <circle cx="64" cy="64" r="60" stroke="#10b981" strokeWidth="8" fill="none" 
              strokeDasharray="377" strokeDashoffset={ringDraw} className="transition-all duration-1000" />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center animate-in zoom-in delay-300">
            <Check size={48} className="text-emerald-500" strokeWidth={4} />
          </div>
        </div>
        <h2 className="text-3xl font-black text-white mb-2">Event Created!</h2>
        <p className="text-slate-400 mb-8">Scheduled: <span className="text-white">{title}</span></p>
        <button onClick={() => onSubmit({ title, type: 'event' })} className="w-full max-w-sm bg-indigo-600 py-4 rounded-2xl font-bold text-white shadow-lg shadow-indigo-500/25 active:scale-95 transition-all">Done</button>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 bg-[#0B0E25] flex flex-col animate-in slide-in-from-bottom-10 duration-300 overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center px-6 pt-12 pb-4 border-b border-white/5">
        <button onClick={onClose} className="text-slate-400 font-bold text-sm">Cancel</button>
        <h2 className="text-lg font-bold text-white tracking-tight">New Event</h2>
        <button onClick={handleAddEvent} disabled={!title} className="text-indigo-400 font-bold disabled:opacity-30">Add</button>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pt-6 pb-10 space-y-8">
        {/* Live Preview Card */}
        <div className={`p-5 rounded-3xl border transition-colors duration-300 shadow-xl ${activeTheme.bg} ${activeTheme.border}`}>
            <div className="flex gap-2 items-center mb-2">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-black/20 ${activeTheme.text}`}>
                    {eventCategory}
                </span>
            </div>
            <h3 className="text-2xl font-black text-white mb-3 leading-tight">{title || 'Event Title...'}</h3>
            <div className="space-y-1.5">
                <p className="text-xs text-slate-300 flex items-center gap-2">
                    <Calendar size={12} className={activeTheme.text}/> {eventDate}
                </p>
                <p className="text-xs text-slate-300 flex items-center gap-2">
                    <Clock size={12} className={activeTheme.text}/> {eventStartTime} - {eventEndTime}
                </p>
            </div>
        </div>

        {/* Inputs */}
        <input 
          autoFocus placeholder="Event Title" value={title} onChange={e => setTitle(e.target.value)}
          className="bg-transparent text-3xl font-black text-white outline-none w-full tracking-tight placeholder:text-slate-700"
        />

        <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-5 px-5">
          {['Personal 👤', 'Exam 📝', 'Club 🎤', 'Sports ⚽'].map(cat => (
            <button key={cat} onClick={() => setEventCategory(cat)} className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold border transition-all ${eventCategory === cat ? 'bg-white text-slate-900' : 'bg-slate-800/40 text-slate-400 border-white/5'}`}>{cat}</button>
          ))}
        </div>

        <div className="bg-slate-800/40 rounded-2xl divide-y divide-white/5 border border-white/5">
          <div className="p-4 flex justify-between items-center">
            <span className="text-slate-400 text-sm font-bold">Date</span>
            <input type="date" value={eventDate} onChange={e => setEventDate(e.target.value)} className="bg-transparent text-white font-bold outline-none invert" />
          </div>
          <div className="p-4 flex justify-between items-center">
            <span className="text-slate-400 text-sm font-bold">Start</span>
            <input type="time" value={eventStartTime} onChange={e => setEventStartTime(e.target.value)} className="bg-transparent text-white font-bold outline-none" />
          </div>
        </div>

        <div className="bg-slate-800/40 rounded-2xl p-4 flex items-center gap-3 border border-white/5">
            <MapPin size={20} className="text-slate-500" />
            <input placeholder="Location" value={eventLocation} onChange={e => setEventLocation(e.target.value)} className="bg-transparent text-white font-bold outline-none w-full" />
        </div>

        <div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Color Theme</h3>
            <div className="flex gap-3">
                {EVENT_COLORS.map(c => (
                    <button key={c.id} onClick={() => setEventColor(c.id)} className={`w-10 h-10 rounded-full transition-all ${eventColor === c.id ? 'ring-2 ring-white ring-offset-4 ring-offset-[#0B0E25] scale-110' : ''}`} style={{ backgroundColor: c.hex }} />
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};