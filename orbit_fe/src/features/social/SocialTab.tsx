import { PostCard } from "./PostCard";

interface SocialTabProps {
  posts: {
    id: number;
    author: string;
    type: "official" | "confession" | "general";
    content: string;
    time: string;
    likes: number;
    tags: string[];
  }[];
  handleLike: (id: number) => void;
}

export const SocialTab = ({ posts, handleLike }: SocialTabProps) => {
  const FILTERS = [
    { label: "🔥 Trending", active: true },
    { label: "📢 Official", active: false },
    { label: "🤫 Confessions", active: false },
    { label: "📅 Events", active: false }
  ];

  return (
    <div className="pb-32 space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="px-1 pt-2">
        <h1 className="text-2xl font-bold text-white tracking-tight">Campus Feed</h1>
      </div>

      {/* Filter Chips - Horizontal Scroller */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide px-1">
        {FILTERS.map((filter, i) => (
          <button 
            key={i} 
            className={`whitespace-nowrap px-4 py-2.5 rounded-2xl text-xs font-bold border transition-all duration-300
              ${filter.active 
                ? 'bg-white text-slate-950 border-white shadow-lg shadow-white/10' 
                : 'bg-slate-900/40 text-slate-400 border-white/5 hover:border-white/10'}`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Post List */}
      <div className="space-y-4 px-1">
        {posts.map(post => (
          <PostCard 
            key={post.id} 
            post={post} 
            onLike={handleLike} 
          />
        ))}
      </div>
    </div>
  );
};