import React, { useState, useEffect } from 'react';
import { X, Sparkles, ImageIcon, PenSquare, ChevronRight, Utensils, FileText, Globe, Users } from 'lucide-react';
import { EventForm } from "./EventForm" ;
import { TaskForm } from "./TaskForm";

interface CreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'event' | 'task' | 'post' | 'class' | 'mess';
  onSubmit: (data: any) => void;
}

const CreationModal: React.FC<CreationModalProps> = ({ isOpen, onClose, type, onSubmit }) => {
  const [isManualEntry, setIsManualEntry] = useState(false);
  const [postContent, setPostContent] = useState('');
  const [postVisibility, setPostVisibility] = useState('College');

  useEffect(() => {
    if (isOpen) setIsManualEntry(false);
  }, [isOpen]);

  if (!isOpen) return null;

  // Handle Post submission specifically here or in a separate file
  const handlePostSubmit = () => {
    onSubmit({ content: postContent, type: 'post', payload: { postVisibility } });
    setPostContent('');
  };

  const renderContent = () => {
    switch (type) {
      case 'event':
        return <EventForm onSubmit={onSubmit} onClose={onClose} />;
      case 'task':
        return <TaskForm onSubmit={onSubmit} onClose={onClose} />;
      case 'class':
        return isManualEntry ? (
          <div className="text-white p-6">Manual Class Form Logic...</div>
        ) : (
          <ClassLanding onManual={() => setIsManualEntry(true)} onClose={onClose} />
        );
      case 'post':
        return (
          <div className="space-y-4 p-6 bg-slate-900 rounded-3xl border border-white/10">
            <h2 className="text-xl font-bold text-white mb-4">Create Post</h2>
            <textarea 
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              className="w-full bg-slate-800 rounded-xl p-4 text-white outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="What's on your mind?"
              rows={4}
            />
            <button onClick={handlePostSubmit} className="w-full bg-indigo-600 py-3 rounded-xl font-bold text-white">Post</button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 bg-slate-950/90 backdrop-blur-sm animate-in fade-in duration-200">
      {renderContent()}
    </div>
  );
};

// Sub-component for Class Landing
const ClassLanding = ({ onManual, onClose }: { onManual: () => void, onClose: () => void }) => (
  <div className="bg-slate-900 border border-white/10 w-full max-w-sm rounded-[32px] p-6 shadow-2xl relative flex flex-col items-center text-center">
    <button onClick={onClose} className="absolute top-5 right-5 text-slate-400"><X size={24} /></button>
    <h2 className="text-2xl font-bold text-white flex gap-2 mt-4"><Sparkles className="text-yellow-400" /> Add your classes!</h2>
    <p className="text-slate-400 text-sm mt-2 mb-8">Upload a screenshot or enter manually.</p>
    <button className="w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl mb-4 flex items-center justify-center gap-2">
      <ImageIcon size={20} /> Upload Schedule
    </button>
    <button onClick={onManual} className="w-full p-4 rounded-2xl bg-slate-800 flex justify-between items-center group">
      <div className="flex items-center gap-3">
        <PenSquare size={18} className="text-slate-400 group-hover:text-indigo-400" />
        <span className="text-white text-sm font-bold">Add manually</span>
      </div>
      <ChevronRight size={18} className="text-slate-600" />
    </button>
  </div>
);

export default CreationModal;