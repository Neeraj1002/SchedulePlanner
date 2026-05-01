import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { MessageCircle, Flame, CheckCircle2, MoreHorizontal } from "lucide-react-native";
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
    <GlassCard className="p-5 mb-1">
      <View className="flex-row justify-between items-start mb-4">
        <View className="flex-row items-center gap-3">
          {/* Avatar with dynamic styling */}
          <View 
            className={`w-11 h-11 rounded-full items-center justify-center border ${
              isOfficial 
                ? 'bg-indigo-500/20 border-indigo-500/30' 
                : 'bg-slate-800 border-slate-700'
            }`}
          >
            <Text className={`text-lg font-bold ${isOfficial ? 'text-indigo-400' : 'text-slate-300'}`}>
              {post.author[0]}
            </Text>
          </View>
          
          <View>
            <View className="flex-row items-center gap-1.5">
              <Text className="text-sm font-bold text-white">{post.author}</Text>
              {isOfficial && (
                <CheckCircle2 size={13} color="#60a5fa" fill="rgba(96, 165, 250, 0.1)" />
              )}
            </View>
            <Text className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
              {post.time}
            </Text>
          </View>
        </View>
        
        <TouchableOpacity hitSlop={10}>
          <MoreHorizontal size={20} color="#475569" />
        </TouchableOpacity>
      </View>

      <Text className="text-slate-300 text-[14px] leading-6 mb-5">
        {post.content}
      </Text>

      {/* Action Bar & Tags */}
      <View className="flex-row justify-between items-center pt-4 border-t border-white/5">
        <View className="flex-row gap-5">
          <TouchableOpacity 
            onPress={() => onLike(post.id)}
            activeOpacity={0.6}
            className="flex-row items-center gap-1.5"
          >
            <Flame size={18} color="#94a3b8" /> 
            <Text className="text-slate-400 text-xs font-extrabold">{post.likes}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            activeOpacity={0.6}
            className="flex-row items-center gap-1.5"
          >
            <MessageCircle size={18} color="#94a3b8" /> 
            <Text className="text-slate-400 text-xs font-extrabold">Reply</Text>
          </TouchableOpacity>
        </View>

        <View className="flex-row gap-1">
          {post.tags.map(tag => (
            <View key={tag} className="px-2 py-1 rounded-md bg-slate-900/60 border border-white/5">
              <Text className="text-[9px] font-bold text-slate-500">#{tag}</Text>
            </View>
          ))}
        </View>
      </View>
    </GlassCard>
  );
};