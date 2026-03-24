import React from 'react';
import { Share } from 'lucide-react';

interface ShareButtonProps {
  onShare: () => void;
}

export const ShareButton: React.FC<ShareButtonProps> = ({ onShare }) => {
  return (
    <div className="absolute bottom-24 left-4 right-4 z-40 animate-in slide-in-from-bottom-4 duration-500">
      <button 
        onClick={onShare}
        className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl text-white font-bold shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all"
      >
        <Share size={18} /> Share your schedule
      </button>
    </div>
  );
};