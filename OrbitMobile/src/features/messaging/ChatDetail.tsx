import React, { useState, useRef } from "react";
import { 
  View, Text, TextInput, TouchableOpacity, 
  FlatList, Image, KeyboardAvoidingView, Platform 
} from "react-native";
import { ArrowLeft, Phone, Video, MoreHorizontal, Paperclip, Smile, Send } from "lucide-react-native";

export const ChatDetail = ({ chat, onBack }: any) => {
  const [message, setMessage] = useState('');
  const isGroup = chat.type === 'group';
  
  // Mock messages - Note: Inverted logic means last message is index 0
  const [chatMessages, setChatMessages] = useState([
    { id: 4, sender: 'Vikram', isMe: false, text: "Yes please! Lifesaver 🙏", time: "10:29 AM", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Vikram" },
    { id: 3, sender: 'Me', isMe: true, text: "I can share my notes from yesterday's tutorial if that helps?", time: "10:28 AM" },
    { id: 2, sender: 'Vikram', isMe: false, text: "I'm stuck on question 3. The equation doesn't balance.", time: "10:25 AM", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Vikram" },
    { id: 1, sender: 'Aditi', isMe: false, text: "Did anyone complete the assignment for tomorrow?", time: "10:23 AM", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aditi" },
  ]);

  const handleSend = () => {
    if (!message.trim()) return;
    const newMsg = {
      id: Date.now(),
      sender: 'Me',
      isMe: true,
      text: message.trim(),
      time: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
    };
    setChatMessages([newMsg, ...chatMessages]);
    setMessage('');
  };

  const renderMessage = ({ item, index }: any) => {
    const isMe = item.isMe;
    const isFirstInGroup = index === chatMessages.length - 1 || chatMessages[index + 1]?.sender !== item.sender;

    return (
      <View className={`flex-row mb-4 ${isMe ? 'justify-end' : 'justify-start'}`}>
        {!isMe && isGroup && (
          <View className="w-8 mr-2 justify-end">
            {isFirstInGroup && <Image source={{ uri: item.avatar }} className="w-8 h-8 rounded-full bg-slate-800" />}
          </View>
        )}
        
        <View className={`max-w-[75%] ${isMe ? 'items-end' : 'items-start'}`}>
          {!isMe && isGroup && isFirstInGroup && (
            <Text className="text-[10px] text-slate-500 font-bold mb-1 ml-1">{item.sender}</Text>
          )}
          <View className={`px-4 py-2.5 rounded-[20px] ${
            isMe ? 'bg-indigo-600 rounded-br-none' : 'bg-slate-900 border border-white/5 rounded-bl-none'
          }`}>
            <Text className="text-white text-[14px] leading-5">{item.text}</Text>
          </View>
          <Text className="text-[9px] text-slate-600 mt-1 px-1">{item.time}</Text>
        </View>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-slate-950">
      {/* Header */}
      <View className="pt-14 pb-4 px-4 bg-slate-900/90 border-b border-white/5 flex-row items-center justify-between">
        <View className="flex-row items-center gap-3">
          <TouchableOpacity onPress={onBack}>
            <ArrowLeft size={24} color="#94a3b8" />
          </TouchableOpacity>
          <View className="flex-row items-center gap-3">
            <Image source={{ uri: chat.data.avatar }} className="w-10 h-10 rounded-full bg-slate-800" />
            <View>
              <Text className="text-white font-bold text-sm">{isGroup ? chat.data.subject : chat.data.name}</Text>
              <Text className="text-[10px] text-emerald-400 font-bold uppercase tracking-tighter">Online</Text>
            </View>
          </View>
        </View>
        <View className="flex-row gap-4">
          {!isGroup && <Phone size={20} color="#64748b" />}
          <MoreHorizontal size={20} color="#64748b" />
        </View>
      </View>

      {/* Messages List */}
      <FlatList
        data={chatMessages}
        renderItem={renderMessage}
        keyExtractor={item => item.id.toString()}
        inverted // Key for chat apps!
        contentContainerStyle={{ padding: 16 }}
        className="flex-1"
      />

      {/* Input Area */}
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <View className="p-3 bg-slate-950 border-t border-white/5 flex-row items-end gap-2 pb-8">
          <TouchableOpacity className="p-3 bg-slate-900 rounded-full">
            <Paperclip size={20} color="#94a3b8" />
          </TouchableOpacity>
          
          <View className="flex-1 bg-slate-900 rounded-3xl px-4 py-1 flex-row items-center border border-white/5">
            <TextInput
              value={message}
              onChangeText={setMessage}
              placeholder="Message..."
              placeholderTextColor="#64748b"
              multiline
              className="flex-1 text-white text-sm py-2 max-h-24"
            />
            <Smile size={20} color="#64748b" />
          </View>

          <TouchableOpacity 
            onPress={handleSend}
            disabled={!message.trim()}
            className={`p-3 rounded-full ${message.trim() ? 'bg-indigo-600' : 'bg-slate-900'}`}
          >
            <Send size={20} color={message.trim() ? "white" : "#64748b"} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};