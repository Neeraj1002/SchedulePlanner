// src/features/social/PostCard.tsx
import React from "react";
import { MessageCircle, Flame, CheckCircle2, MoreHorizontal } from "lucide-react";
import GlassCard from "../../components/ui/GlassCard";

interface PostCardProps {
  post: {
    id: number;
    author: string;
    type: "official" | "confession" | "general";
    content: string;
    time: string;
    likes: number;
    tags: string[];
  };
  onLike: (id: number) => void;
}

export const PostCard: React.FC<PostCardProps> = ({ post, onLike }) => {
  const isOfficial = post.type === "official";

  return (
    <GlassCard className="p-5 hover:border-white/10 transition-all">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-3">
          {/* Avatar with dynamic styling based on post type */}
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold border transition-colors
            ${isOfficial 
              ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.1)]' 
              : 'bg-slate-800 text-slate-300 border-slate-700'}`}>
            {post.author[0]}
          </div>
          
          <div>
            <p className="text-sm font-bold text-white flex items-center gap-1.5">
              {post.author}
              {isOfficial && (
                <CheckCircle2 size={13} className="text-blue-400 fill-blue-400/10" />
              )}
            </p>
            <p className="text-[10px] text-slate-500 font-medium uppercase tracking-tight">{post.time}</p>
          </div>
        </div>
        
        <button className="text-slate-600 hover:text-slate-400 p-1">
          <MoreHorizontal size={18} />
        </button>
      </div>

      <p className="text-slate-300 text-sm leading-relaxed mb-4">
        {post.content}
      </p>

      {/* Action Bar & Tags */}
      <div className="flex justify-between items-center pt-4 border-t border-white/5">
        <div className="flex gap-4">
          <button 
            onClick={() => onLike(post.id)}
            className="flex items-center gap-1.5 text-slate-400 hover:text-rose-500 text-xs font-bold transition-colors group"
          >
            <Flame size={16} className="group-hover:fill-rose-500/20" /> 
            {post.likes}
          </button>
          
          <button className="flex items-center gap-1.5 text-slate-400 hover:text-indigo-400 text-xs font-bold transition-colors group">
            <MessageCircle size={16} className="group-hover:fill-indigo-500/20"/> 
            Reply
          </button>
        </div>

        <div className="flex gap-1">
          {post.tags.map(tag => (
            <span key={tag} className="px-2 py-0.5 rounded-md bg-slate-900/60 text-[9px] font-bold text-slate-500 border border-white/5">
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </GlassCard>
  );
};