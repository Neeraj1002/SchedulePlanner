import { Code, Cpu, BookOpen, Users, Book } from "lucide-react-native";

export const getCourseStyle = (code: string) => {
  if (code.startsWith("CS")) {
    return {
      color: "text-violet-400",
      hexColor: "#a78bfa",
      border: "border-violet-500/20",
      bg: "bg-violet-500/5",
      activeGradient: ['rgba(124, 58, 237, 0.4)', 'rgba(192, 38, 211, 0.4)'],
      headerGradient: ['#7c3aed', '#c026d3'],
      icon: Code,
    };
  }

  if (code.startsWith('EE')) {
    return { 
      color: 'text-cyan-400', 
      hexColor: '#22d3ee',
      border: 'border-cyan-500/20', 
      bg: 'bg-cyan-500/5',
      activeGradient: ['rgba(8, 145, 178, 0.4)', 'rgba(37, 99, 235, 0.4)'],
      headerGradient: ['#0891b2', '#2563eb'],
      icon: Cpu
    };
  }

  if (code.startsWith('HS')) { 
    return { 
      color: 'text-rose-400', 
      hexColor: '#fb7185',
      border: 'border-rose-500/20', 
      bg: 'bg-rose-500/5',
      activeGradient: ['rgba(225, 29, 72, 0.4)', 'rgba(249, 115, 22, 0.4)'],
      headerGradient: ['#e11d48', '#f97316'],
      icon: BookOpen 
    };
  }  

  if (code === 'CLUB') {
    return {
      color: 'text-emerald-400',
      hexColor: '#34d399',
      border: 'border-emerald-500/20',
      bg: 'bg-emerald-500/5',
      activeGradient: ['rgba(5, 150, 105, 0.4)', 'rgba(13, 148, 136, 0.4)'],
      headerGradient: ['#059669', '#0d9488'],
      icon: Users
    };
  }

  return { 
    color: 'text-slate-400', 
    hexColor: '#94a3b8',
    border: 'border-white/5', 
    bg: 'bg-slate-900/40', 
    activeGradient: ['#1e293b', '#334155'],
    headerGradient: ['#1e293b', '#475569'],
    icon: Book 
  };
};