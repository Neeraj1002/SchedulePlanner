import React, { useState } from 'react';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Features & Modals
import { HomeTab } from './features/home/HomeTab';
import ScheduleTab from './features/schedule/ScheduleTab';
import { SocialTab } from './features/social/SocialTab';
import { BunkTab } from './features/bunk/BunkTab';
import { CourseDetail } from './modals/CourseDetail';
import { FriendProfile } from './modals/FriendProfile';
import { MessMenu } from './modals/MessMenu';
import { ChatDetail } from './features/messaging/ChatDetail';
import Dock from './components/navigation/Dock';

import {AddFriendScreen} from './features/social/AddFriendScreen';
import {NotificationsScreen} from './features/notification/NotificationScreen';
import {MessagesScreen} from './features/messaging/MessageScreen';

import { NewClassModal } from './features/schedule/NewClassModal';
import { NewMessModal } from './features/home/NewMessModal';
import { NewTodoScreen } from './features/tasks/NewTodoScreen';
import { NewEventScreen } from './features/events/NewEventScreen';

import { ProfileScreen } from './features/profile/ProfileScreen';

// Types & Data
import type { RootStackParamList, ScheduleItem, ScheduleView } from './types';
import { INITIAL_SCHEDULE_DATA, MOCK_USER, FRIENDS_ONLINE } from './data/mockData';
import { CompareScheduleScreen } from './features/social/CompareScheduleScreen';
import { MutualClassesScreen } from './features/social/MutualClassesScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator<RootStackParamList>();

// 1. MOVED OUTSIDE: MainTabs is now an independent component
const MainTabs = ({ 
  events, 
  handleMarkAttendance, 
  handleManualBunk, 
  showFabMenu, 
  setShowFabMenu, 
  scheduleView, 
  setScheduleView 
}: any) => (
  <Tab.Navigator 
    id="MainTab"
    tabBar={(props) => (
      <Dock 
        {...props} 
        showFabMenu={showFabMenu} 
        setShowFabMenu={setShowFabMenu} 
      />
    )}
    screenOptions={{ headerShown: false }}
  >
    <Tab.Screen name="home">
      {(props) => (
        <HomeTab 
          {...props}
          user={MOCK_USER}
          friends={FRIENDS_ONLINE}
          events={events}
          onMarkAttendance={handleMarkAttendance}
          onNavigate={(tab: any) => props.navigation.navigate(tab)}
          onNavigateToDiscover={() => {
            setScheduleView('discover');
            props.navigation.navigate('schedule');
          }}
          onCourseSelect={(course) => props.navigation.navigate('CourseDetail', { course })}
          onMenuSelect={() => props.navigation.navigate('MessMenu')}
          onFriendSelect={(friend) => props.navigation.navigate('FriendProfile', { friend })}
        />
      )}
    </Tab.Screen>

    <Tab.Screen name="schedule">
      {(props) => (
        <ScheduleTab 
          {...props}
          events={events}
          onMarkAttendance={handleMarkAttendance}
          onCourseSelect={(course) => props.navigation.navigate('CourseDetail', { course })}
          view={scheduleView}
          onViewChange={setScheduleView}
        />
      )}
    </Tab.Screen>
    
    <Tab.Screen name="bunk">
      {(props) => (
        <BunkTab 
          {...props} 
          stats={events} 
          handleLogBunk={handleManualBunk} 
        />
      )}
    </Tab.Screen>

    <Tab.Screen name="profile" component={ProfileScreen} />
  </Tab.Navigator>
);

export default function App() {
  const [events, setEvents] = useState<ScheduleItem[]>(INITIAL_SCHEDULE_DATA);
  const [showFabMenu, setShowFabMenu] = useState(false);
  const [scheduleView, setScheduleView] = useState<ScheduleView>('my_schedule');

  const handleMarkAttendance = (eventId: number, status: 'present' | 'absent') => {
    setEvents(prev => prev.map(e => 
      e.id === eventId ? { ...e, attendanceStatus: status } : e
    ));
  };

  const handleManualBunk = (statId: number) => {
    setEvents(prev => prev.map(s => s.id === statId ? { ...s, total: s.total + 1 } : s));
  };

  return (
    // 2. FIXED WEB HEIGHT: The wrapper must be on the outside with height: 100vh
    <View style={{ flex: 1, height: '100%', backgroundColor: '#020617' }}> 
      <NavigationContainer>
        <Stack.Navigator id="RootStack" screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
          {/* 3. PROP INJECTION: Feed the state to your newly independent MainTabs */}
          <Stack.Screen name="MainTabs">
            {(props) => (
              <MainTabs 
                {...props}
                events={events}
                handleMarkAttendance={handleMarkAttendance}
                handleManualBunk={handleManualBunk}
                showFabMenu={showFabMenu}
                setShowFabMenu={setShowFabMenu}
                scheduleView={scheduleView}
                setScheduleView={setScheduleView}
              />
            )}
          </Stack.Screen>
          
          <Stack.Screen name="CourseDetail">
            {(props: any) => (
              <CourseDetail 
                isOpen={true} 
                course={props.route.params?.course} 
                onBack={() => props.navigation.goBack()} 
                onOpenChat={(chat) => props.navigation.navigate('ChatRoom', { chat })} 
              />
            )}
          </Stack.Screen>

          <Stack.Screen name="FriendProfile">
            {(props: any) => (
              <FriendProfile 
                isOpen={true} 
                friend={props.route.params?.friend} 
                onBack={() => props.navigation.goBack()} 
                onOpenChat={(chat) => props.navigation.navigate('ChatRoom', { chat })} 
              />
            )}
          </Stack.Screen>

          <Stack.Screen name="MessMenu">
            {(props) => (
              <MessMenu 
                isOpen={true} 
                onBack={() => props.navigation.goBack()} 
              />
            )}
          </Stack.Screen>

          <Stack.Screen name="ChatRoom" component={ChatDetail} />
          <Stack.Screen name="AddFriend" component={AddFriendScreen} options={{ presentation: 'modal' }} />
          <Stack.Screen name="Notifications" component={NotificationsScreen} />
          <Stack.Screen name="Messages" component={MessagesScreen} />
          
          <Stack.Screen name="NewClass" component={NewClassModal} options={{ presentation: 'transparentModal', animation: "fade" }} />
          <Stack.Screen name="NewMess" component={NewMessModal} options={{ presentation: 'transparentModal', animation: "fade" }} />
          <Stack.Screen name="NewTodo" component={NewTodoScreen}/>
          <Stack.Screen name="NewEvent" component={NewEventScreen}/>

          <Stack.Screen name="CompareSchedule" component={CompareScheduleScreen} options={{ presentation: 'transparentModal', animation: "fade" }} />
          <Stack.Screen name="MutualClasses" component={MutualClassesScreen} options={{ presentation: 'transparentModal', animation: "fade" }} />
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
}