export const EVENT_COLORS = [
  { id: 'slate', hex: '#64748b', bg: 'bg-slate-500/20', border: 'border-slate-500/40', text: 'text-slate-400' },
  { id: 'red', hex: '#ef4444', bg: 'bg-red-500/20', border: 'border-red-500/40', text: 'text-red-400' },
  { id: 'orange', hex: '#f97316', bg: 'bg-orange-500/20', border: 'border-orange-500/40', text: 'text-orange-400' },
  { id: 'amber', hex: '#f59e0b', bg: 'bg-amber-500/20', border: 'border-amber-500/40', text: 'text-amber-400' },
  { id: 'emerald', hex: '#10b981', bg: 'bg-emerald-500/20', border: 'border-emerald-500/40', text: 'text-emerald-400' },
  { id: 'teal', hex: '#14b8a6', bg: 'bg-teal-500/20', border: 'border-teal-500/40', text: 'text-teal-400' },
  { id: 'cyan', hex: '#06b6d4', bg: 'bg-cyan-500/20', border: 'border-cyan-500/40', text: 'text-cyan-400' },
  { id: 'blue', hex: '#3b82f6', bg: 'bg-blue-500/20', border: 'border-blue-500/40', text: 'text-blue-400' },
  { id: 'indigo', hex: '#6366f1', bg: 'bg-indigo-500/20', border: 'border-indigo-500/40', text: 'text-indigo-400' },
  { id: 'violet', hex: '#8b5cf6', bg: 'bg-violet-500/20', border: 'border-violet-500/40', text: 'text-violet-400' },
  { id: 'fuchsia', hex: '#d946ef', bg: 'bg-fuchsia-500/20', border: 'border-fuchsia-500/40', text: 'text-fuchsia-400' },
  { id: 'rose', hex: '#f43f5e', bg: 'bg-rose-500/20', border: 'border-rose-500/40', text: 'text-rose-400' },
] as const;

export type EventColor = typeof EVENT_COLORS[number]['id'];

/**
 * Helper to get color object by ID
 */
export const getEventColor = (id: string) => {
  return EVENT_COLORS.find(c => c.id === id) || EVENT_COLORS[0];
};