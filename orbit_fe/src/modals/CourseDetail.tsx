import React from 'react';
import { ArrowLeft, Settings, MessageCircle, UserPlus, Circle, ChevronRight, MessageSquare } from 'lucide-react';
import { getCourseStyle } from '../utils/styleHelpers';
import { MOCK_USER } from '../data/mockData';

interface CourseDetailProps {
  course: any;
  isOpen: boolean;
  onBack: () => void;
  onOpenChat: (params: { type: string; data: any }) => void;
}

export const CourseDetail: React.FC<CourseDetailProps> = ({ course, isOpen, onBack, onOpenChat }) => {
  if (!isOpen || !course) return null;

  const style = getCourseStyle(course.code);
  const Icon = style.icon;

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950 overflow-y-auto animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className={`relative h-64 bg-gradient-to-br ${style.headerGradient} rounded-b-[40px] p-6 shadow-2xl`}>
        <div className="flex justify-between items-center mb-6">
          <button onClick={onBack} className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white active:scale-95">
            <ArrowLeft size={20} />
          </button>
          <button className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white">
            <Settings size={20} />
          </button>
        </div>

        <div className="flex flex-col items-center">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-lg rounded-2xl flex items-center justify-center text-white mb-4 border border-white/10 shadow-lg">
            <Icon size={32} />
          </div>
          <h1 className="text-2xl font-bold text-white text-center leading-tight">{course.subject}</h1>
          <p className="text-white/80 text-sm mt-1 font-medium">{course.code} • {course.room}</p>
        </div>
      </div>

      <div className="px-6 -mt-8 relative z-10 space-y-6 pb-32">
        {/* Actions */}
        <div className="flex gap-3">
          <button 
             onClick={() => onOpenChat({ type: 'group', data: course })} 
             className="flex-1 bg-white text-slate-900 py-3.5 rounded-2xl font-bold text-sm shadow-xl flex items-center justify-center gap-2 active:scale-95 transition-all"
          >
            <MessageSquare size={18} className="text-indigo-500 fill-indigo-500" /> Class Chat
          </button>
          <button className="flex-1 bg-slate-800/80 backdrop-blur-md text-white border border-white/10 py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2">
            <UserPlus size={18} /> Invite
          </button>
        </div>

        {/* Tasks */}
        <div>
          <h3 className="text-white font-bold text-lg mb-3">My Tasks (1)</h3>
          <div className="bg-slate-900 border border-white/10 p-4 rounded-2xl flex items-center gap-3">
            <Circle size={20} className="text-slate-500" />
            <p className="text-slate-200 text-sm font-medium">Lab Report Submission 🧠</p>
          </div>
        </div>

        {/* Classmates */}
        <div>
          <h3 className="text-white font-bold text-lg mb-3">Classmates ({course.classmates?.length + 1})</h3>
          <div className="bg-slate-900/50 border border-white/5 rounded-3xl divide-y divide-white/5 overflow-hidden">
            <div className="p-4 flex items-center justify-between hover:bg-white/5">
              <div className="flex items-center gap-3">
                <img src={MOCK_USER.avatar} className="w-10 h-10 rounded-full bg-slate-800" alt="Me" />
                <span className="text-white font-medium">Me</span>
              </div>
              <ChevronRight size={16} className="text-slate-600" />
            </div>
            {course.classmates?.map((name: string, i: number) => (
              <div key={i} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white ${i % 3 === 0 ? 'bg-indigo-500' : 'bg-rose-500'}`}>
                    {name[0]}
                  </div>
                  <span className="text-slate-300 font-medium">{name}</span>
                </div>
                <ChevronRight size={16} className="text-slate-600" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};