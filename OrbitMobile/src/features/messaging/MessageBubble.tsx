import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Check, CheckCheck } from 'lucide-react-native';

interface MessageBubbleProps {
  message: {
    id: number;
    text: string;
    sender: "me" | "other";
    time: string;
    status?: "sent" | "delivered" | "read";
  };
}

export const MessageBubble = ({ message }: MessageBubbleProps) => {
  const isMe = message.sender === "me";

  return (
    <View 
      className={`flex-row w-full mb-2 ${
        isMe ? "justify-end pl-12" : "justify-start pr-12"
      }`}
    >
      <View
        className={`px-4 py-2.5 shadow-sm ${
          isMe
            ? "bg-indigo-600 rounded-2xl rounded-tr-none"
            : "bg-slate-800 border border-white/5 rounded-2xl rounded-tl-none"
        }`}
      >
        <Text 
          selectable 
          className={`text-[14px] leading-5 ${
            isMe ? "text-white" : "text-slate-100"
          }`}
        >
          {message.text}
        </Text>
        
        <View className={`flex-row items-center gap-1.5 mt-1 ${isMe ? "justify-end" : "justify-start"}`}>
          <Text className={`text-[9px] font-bold ${isMe ? "text-indigo-200/70" : "text-slate-500"}`}>
            {message.time}
          </Text>
          
          {isMe && (
            <View className="flex-row items-center">
              {message.status === 'read' ? (
                <CheckCheck size={10} color="#818cf8" strokeWidth={3} />
              ) : (
                <Check size={10} color="#c7d2fe" strokeWidth={3} />
              )}
            </View>
          )}
        </View>
      </View>
    </View>
  );
};