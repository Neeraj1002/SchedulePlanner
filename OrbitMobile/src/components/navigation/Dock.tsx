import React from "react";
import { View, Text, TouchableOpacity, Dimensions } from "react-native";
// Updated imports to include the specific icons from your image
import { Home, Calendar, Plus, BarChart3, User, X, BookOpen, Utensils, CheckSquare, CalendarPlus } from "lucide-react-native";
import { type BottomTabBarProps } from "@react-navigation/bottom-tabs";

const { width } = Dimensions.get("window");

interface DockProps extends BottomTabBarProps {
  showFabMenu: boolean;
  setShowFabMenu: (value: boolean) => void;
}

const Dock = ({
  state,
  navigation,
  showFabMenu,
  setShowFabMenu,
}: DockProps) => {
  
  const getIcon = (name: string, isFocused: boolean) => {
    const iconColor = isFocused ? "white" : "#94a3b8";
    const size = 24;
    
    switch(name) {
      case 'home': return <Home size={size} color={iconColor} strokeWidth={2} />;
      case 'schedule': return <Calendar size={size} color={iconColor} strokeWidth={2} />;
      case 'bunk': return <BarChart3 size={size} color={iconColor} strokeWidth={2} />;
      case 'profile': return <User size={size} color={iconColor} strokeWidth={2} />;
      default: return <Home size={size} color={iconColor} strokeWidth={2} />;
    }
  };

  return (
    <View 
      className="absolute bottom-8 w-full items-center z-50"
      style={{ 
        pointerEvents: 'box-none' }} 
    >
      {/* --- THE SPEED DIAL MENU (Matches your new image) --- */}
      {showFabMenu && (
        <View className="absolute bottom-[115px] self-center items-center z-40">
          
          {/* Option 4: Class */}
          <View className="mb-4 relative justify-center items-center">
            {/* Label Pill */}
            <View className="absolute right-[70px] bg-[#1A1F2E] px-4 py-2 rounded-xl border border-white/5 shadow-lg w-[80px] items-center">
              <Text className="text-white font-bold text-sm">Class</Text>
            </View>
            {/* Circular Button */}
            <TouchableOpacity 
              onPress={()=>{setShowFabMenu(false) ; navigation.navigate('NewClass') ;}}
              className="w-[52px] h-[52px] rounded-full bg-[#7C3AED] items-center justify-center shadow-lg shadow-purple-500/40 border border-white/10">
              <BookOpen size={22} color="white" />
            </TouchableOpacity>
          </View>

          {/* Option 3: Mess */}
          <View className="mb-4 relative justify-center items-center">
            <View className="absolute right-[70px] bg-[#1A1F2E] px-4 py-2 rounded-xl border border-white/5 shadow-lg w-[80px] items-center">
              <Text className="text-white font-bold text-sm">Mess</Text>
            </View>
            <TouchableOpacity 
              onPress={()=>{setShowFabMenu(false) ; navigation.navigate('NewMess') ;}}
              className="w-[52px] h-[52px] rounded-full bg-[#F97316] items-center justify-center shadow-lg shadow-orange-500/40 border border-white/10">
              <Utensils size={22} color="white" />
            </TouchableOpacity>
          </View>

          {/* Option 2: To-Do */}
          <View className="mb-4 relative justify-center items-center">
            <View className="absolute right-[70px] bg-[#1A1F2E] px-4 py-2 rounded-xl border border-white/5 shadow-lg w-[80px] items-center">
              <Text className="text-white font-bold text-sm">To-Do</Text>
            </View>
            <TouchableOpacity 
              onPress={()=> {setShowFabMenu(false) ; navigation.navigate('NewTodo') ;}}
              className="w-[52px] h-[52px] rounded-full bg-[#10B981] items-center justify-center shadow-lg shadow-emerald-500/40 border border-white/10">
              <CheckSquare size={22} color="white" />
            </TouchableOpacity>
          </View>

          {/* Option 1: Event */}
          <View className="mb-2 relative justify-center items-center">
            <View className="absolute right-[70px] bg-[#1A1F2E] px-4 py-2 rounded-xl border border-white/5 shadow-lg w-[80px] items-center">
              <Text className="text-white font-bold text-sm">Event</Text>
            </View>
            <TouchableOpacity 
              onPress={()=> {setShowFabMenu(false) ; navigation.navigate('NewEvent') ;}}
              className="w-[52px] h-[52px] rounded-full bg-[#3B82F6] items-center justify-center shadow-lg shadow-blue-500/40 border border-white/10">
              <CalendarPlus size={22} color="white" />
            </TouchableOpacity>
          </View>

        </View>
      )}

      {/* --- THE MAIN DOCK BAR --- */}
      <View className="w-[90%] max-w-sm h-[72px] bg-[#0F121E]/95 rounded-[24px] border border-white/10 shadow-2xl flex-row items-center px-2 z-50">
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          const onPress = () => {
            const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
            if (!isFocused && !event.defaultPrevented) navigation.navigate(route.name);
          };

          return (
            <React.Fragment key={route.key}>
              <TouchableOpacity
                onPress={onPress}
                activeOpacity={0.7}
                className="flex-1 items-center justify-center h-full"
              >
                {isFocused && route.name === 'home' ? (
                  <View className="bg-[#5E5CE6] w-14 h-14 rounded-[20px] items-center justify-center shadow-lg shadow-indigo-500/40 border border-white/10">
                    {getIcon(route.name, true)}
                  </View>
                ) : (
                  getIcon(route.name, false)
                )}
              </TouchableOpacity>
              {index === 1 && <View className="w-16" />} 
            </React.Fragment>
          );
        })}
      </View>

      {/* --- THE DYNAMIC FAB (Transforms from Plus to X) --- */}
      <TouchableOpacity
        onPress={() => setShowFabMenu(!showFabMenu)}
        activeOpacity={0.9}
        className={`absolute bottom-[42px] z-50 w-16 h-16 rounded-full items-center justify-center ${
          showFabMenu 
            ? 'bg-[#1A1F2E] border-2 border-slate-700/50 shadow-2xl' // The Dark 'X' State
            : 'bg-gradient-to-tr from-[#A855F7] to-[#EC4899] shadow-xl shadow-pink-500/50' // The Glowing 'Plus' State
        }`}
      >
        {showFabMenu ? (
          <X size={32} color="#94a3b8" strokeWidth={3} />
        ) : (
          <Plus size={36} color="white" strokeWidth={3} />
        )}
      </TouchableOpacity>
      
    </View>
  );
};

export default Dock;