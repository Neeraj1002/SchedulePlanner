import React, { useState, useEffect } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, 
  Modal, StyleSheet, KeyboardAvoidingView, Platform 
} from 'react-native';
import { X, Sparkles, ImageIcon, PenSquare, ChevronRight } from 'lucide-react-native';
import GlassCard from '../../components/ui/GlassCard';

interface CreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'event' | 'task' | 'post' | 'class' | 'mess';
  onSubmit: (data: any) => void;
}

const CreationModal: React.FC<CreationModalProps> = ({ isOpen, onClose, type, onSubmit }) => {
  const [isManualEntry, setIsManualEntry] = useState(false);
  const [postContent, setPostContent] = useState('');

  useEffect(() => {
    if (isOpen) setIsManualEntry(false);
  }, [isOpen]);

  const handlePostSubmit = () => {
    onSubmit({ content: postContent, type: 'post' });
    setPostContent('');
    onClose();
  };

  const renderContent = () => {
    switch (type) {
      case 'post':
        return (
          <KeyboardAvoidingView 
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            className="w-full"
          >
            <View className="bg-slate-900 p-6 rounded-[32px] border border-white/10 shadow-2xl">
              <View className="flex-row justify-between items-center mb-6">
                <Text className="text-xl font-black text-white">Create Post</Text>
                <TouchableOpacity onPress={onClose} hitSlop={15}>
                  <X size={24} color="#94a3b8" />
                </TouchableOpacity>
              </View>
              
              <TextInput 
                multiline
                numberOfLines={4}
                value={postContent}
                onChangeText={setPostContent}
                placeholder="What's on your mind?"
                placeholderTextColor="#64748b"
                textAlignVertical="top"
                className="w-full bg-slate-800/50 rounded-2xl p-4 text-white text-base min-h-[120px] mb-6 border border-white/5"
              />
              
              <TouchableOpacity 
                onPress={handlePostSubmit}
                activeOpacity={0.8}
                className="w-full bg-indigo-600 py-4 rounded-2xl shadow-lg shadow-indigo-500/20"
              >
                <Text className="text-center text-white font-bold text-base">Post to Feed</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        );
      case 'class':
        return (
          <ClassLanding onManual={() => setIsManualEntry(true)} onClose={onClose} />
        );
      default:
        return null;
    }
  };

  return (
    <Modal
      visible={isOpen}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end sm:justify-center bg-slate-950/80 px-4 pb-10 sm:pb-0">
        <View className="items-center">
          {renderContent()}
        </View>
      </View>
    </Modal>
  );
};

const ClassLanding = ({ onManual, onClose }: any) => (
  <View className="bg-slate-900 border border-white/10 w-full rounded-[32px] p-8 shadow-2xl relative items-center">
    <TouchableOpacity 
      onPress={onClose} 
      className="absolute top-6 right-6" 
      hitSlop={15}
    >
      <X size={24} color="#64748b" />
    </TouchableOpacity>

    <View className="flex-row items-center gap-2 mt-4">
      <Sparkles size={24} color="#facc15" />
      <Text className="text-2xl font-black text-white">Add Classes</Text>
    </View>
    <Text className="text-slate-400 text-sm mt-2 mb-8 text-center">
      Upload a screenshot of your portal or enter manually.
    </Text>

    <TouchableOpacity className="w-full py-5 bg-indigo-600 rounded-2xl mb-4 flex-row items-center justify-center gap-2">
      <ImageIcon size={20} color="white" />
      <Text className="text-white font-bold text-base">Upload Schedule</Text>
    </TouchableOpacity>

    <TouchableOpacity 
      onPress={onManual} 
      className="w-full p-5 rounded-2xl bg-slate-800 flex-row justify-between items-center"
    >
      <View className="flex-row items-center gap-3">
        <PenSquare size={18} color="#94a3b8" />
        <Text className="text-white text-sm font-bold">Add manually</Text>
      </View>
      <ChevronRight size={18} color="#475569" />
    </TouchableOpacity>
  </View>
);