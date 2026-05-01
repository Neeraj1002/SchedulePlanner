import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
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

const FILTERS = [
  { label: "🔥 Trending", active: true },
  { label: "📢 Official", active: false },
  { label: "🤫 Confessions", active: false },
  { label: "📅 Events", active: false }
];

export const SocialTab = ({ posts, handleLike }: SocialTabProps) => {
  return (
    <ScrollView 
      className="flex-1 bg-slate-950 px-4 pt-12"
      contentContainerStyle={{ paddingBottom: 120 }}
      showsVerticalScrollIndicator={false}
    >
      {/* HEADER */}
      <View className="px-1 mb-6">
        <Text className="text-3xl font-bold text-white tracking-tight">
          Campus Feed
        </Text>
      </View>

      {/* FILTER CHIPS - Horizontal Scroller */}
      <View className="mb-6">
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 8, paddingHorizontal: 4 }}
        >
          {FILTERS.map((filter, i) => (
            <TouchableOpacity 
              key={i} 
              activeOpacity={0.8}
              className={`px-5 py-3 rounded-2xl border ${
                filter.active 
                  ? 'bg-white border-white shadow-lg' 
                  : 'bg-slate-900/40 border-white/5'
              }`}
            >
              <Text className={`text-xs font-bold ${
                filter.active ? 'text-slate-950' : 'text-slate-400'
              }`}>
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* POST LIST */}
      <View className="gap-4">
        {posts.map(post => (
          <PostCard 
            key={post.id} 
            post={post} 
            onLike={handleLike} 
          />
        ))}
      </View>
    </ScrollView>
  );
};