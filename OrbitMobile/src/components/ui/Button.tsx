import { View, Text, TouchableOpacity } from 'react-native';
// Note: No 'styled' import here!

interface ButtonProps {
  children: React.ReactNode;
  onPress?: () => void;
  className?: string;
  disabled?: boolean;
}

export const Button = ({
  children,
  onPress,
  className = "",
  disabled = false
}: ButtonProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
      // In v4, className works directly on TouchableOpacity 
      // as long as your babel.config.js is set up.
      className={`rounded-xl items-center justify-center p-4 ${className} ${
        disabled ? 'opacity-50' : ''
      }`}
    >
      {typeof children === 'string' ? (
        <Text className="text-white font-bold text-center">{children}</Text>
      ) : (
        children
      )}
    </TouchableOpacity>
  );
};