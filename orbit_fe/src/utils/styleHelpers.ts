import { Code, Cpu, BookOpen, Users, Book } from "lucide-react";

export const getCourseStyle = (code: string) => {
    if (code.startsWith("CS")) {
        return {
            color: "text-violet-400",
            border: "border-violet-500/20",
            bg: "bg-violet-500/5",
            activeGradient: 'from-violet-600/40 to-fuchsia-600/40',
            headerGradient: 'from-violet-600 to-fuchsia-600',
            icon: Code,
        };
    }
    if (code.startsWith('EE')) {
        return { 
            color: 'text-cyan-400', 
            border: 'border-cyan-500/20', 
            bg: 'bg-cyan-500/5',
            activeGradient: 'from-cyan-600/40 to-blue-600/40',
            headerGradient: 'from-cyan-600 to-blue-600',
            icon: Cpu
    };
  }
    if (code.startsWith('HS')){ 
        return { 
            color: 'text-rose-400', 
            border: 'border-rose-500/20', 
            bg: 'bg-rose-500/5',
            activeGradient: 'from-rose-600/40 to-orange-600/40',
            headerGradient: 'from-rose-500 to-orange-500',
            icon: BookOpen 
        };
    }  
    if (code === 'CLUB'){
        return {
            color: 'text-emerald-400',
            border: 'border-emerald-500/20',
            bg: 'bg-emerald-500/5',
            activeGradient: 'from-emerald-600/40 to-teal-600/40',
            headerGradient: 'from-emerald-600 to-teal-600',
            icon: Users
        };
    }
    return { 
        color: 'text-slate-400', 
        border: 'border-white/5', 
        bg: 'bg-slate-900/40', 
        activeGradient: 'from-slate-800 to-slate-700',
        headerGradient: 'from-slate-800 to-slate-600',
        icon: Book 
    };
};