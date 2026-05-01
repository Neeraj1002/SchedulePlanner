import { useState, useCallback } from "react";
import { BackHandler, Platform } from "react-native";

export const useModal = <T = any>() => {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<T | null>(null);

  const open = useCallback((modalData?: T) => {
    if (modalData) setData(modalData);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    // Delay clearing data slightly for smooth exit animations
    setTimeout(() => setData(null), 300);
  }, []);

  // Mobile optimization: Handle Android hardware back button
  const handleBackPress = useCallback(() => {
    if (isOpen) {
      close();
      return true; // Prevent app from closing
    }
    return false;
  }, [isOpen, close]);

  return { 
    isOpen, 
    data, 
    open, 
    close, 
    handleBackPress 
  };
};