import React, { useState } from "react";

// Types
import type {AppTab, ModalType, ScheduleItem, ScheduleView} from "./types";

// Features
import { HomeTab } from "./features/home/HomeTab";
import ScheduleTab from "./features/schedule/ScheduleTab";
import { SocialTab } from "./features/social/SocialTab";
import { BunkTab } from "./features/bunk/BunkTab";

// Messaging
import ChatDetail from "./features/messaging/ChatDetail";

// Modals
import CreationModal from "./modals/CreationModal/index";
import { CourseDetail } from "./modals/CourseDetail";
import { FriendProfile } from "./modals/FriendProfile";
import { MessMenu } from "./modals/MessMenu";

// UI
import Toast from "./components/ui/Toast";

// Navigation
import Dock from "./components/navigation/Dock";
import SpeedDial from "./components/navigation/SpeedDial";

// Mock Data
import {
  INITIAL_SCHEDULE_DATA,
  FRIENDS_ONLINE,
  MOCK_USER,
} from "./data/mockData";

const App = () => {
  const [activeTab, setActiveTab] = useState<AppTab>('home');
  const [showFabMenu, setShowFabMenu] = useState(false);
  
  // Data State
  const [events, setEvents] = useState<ScheduleItem[]>(INITIAL_SCHEDULE_DATA);
  const [posts, setPosts] = useState<any[]>([]); // Initialize with your feed data
  const [stats, setStats] = useState<any[]>(INITIAL_SCHEDULE_DATA); 
  
  // Navigation/Detail State
  const [activeChat, setActiveChat] = useState<any>(null);
  const [selectedCourse, setSelectedCourse] = useState<ScheduleItem | null>(null);
  const [viewMessMenu, setViewMessMenu] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState<any>(null);
  const [scheduleView, setScheduleView] = useState<ScheduleView>('my_schedule');

  // UI State
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'alert' } | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<ModalType>(null);

  // FIX 1: Corrected parameter syntax (type: string) instead of (type; string)
  const handleOpenModal = (type: any) => {
      setModalType(type);
      setModalOpen(true);
      setShowFabMenu(false);
  };

  const handleCreationSubmit = (data: any) => {
      const { title, content, type, payload } = data;
      
      if (type === 'post') {
          const newPost = {
            id: posts.length + 1,
            author: "You",
            time: "Just now",
            content: content,
            tags: [payload?.postVisibility === 'Friends' ? "Friends Only" : "Campus"],
            type: "confession",
            likes: 0
          };
          setPosts([newPost, ...posts]);
          setActiveTab('social');
      } else if (type === 'event' || type === 'class') {
          const newEvent: any = {
            id: events.length + 1,
            time: payload?.eventStartTime || "18:00",
            endTime: payload?.eventEndTime || "19:00",
            subject: title,
            code: payload?.courseCode || (type === 'class' ? "CS101" : "CUSTOM"),
            room: payload?.eventLocation || "TBD",
            type: payload?.eventCategory?.split(' ')[0] || (type === 'class' ? "Lecture" : "Personal"),
            status: "upcoming",
            classmates: [],
            attendanceStatus: null,
            attended: 0,
            total: 0
          };
          setEvents([...events, newEvent]);
          setActiveTab('schedule');
          setScheduleView('my_schedule');
      } else if (type === 'task' || type === 'goal') {
          setToast({ message: `${type === 'goal' ? 'Goal' : 'Task'} saved: ${title}`, type: 'success' });
      }
      setModalOpen(false);
  };

  const handleMarkAttendance = (eventId: number, status: any) => {
    setEvents(prev => prev.map(e => 
      e.id === eventId ? { ...e, attendanceStatus: status } : e
    ));

    const event = events.find(e => e.id === eventId);
    if (!event) return;

    setStats(prev => prev.map(s => {
      if (s.code === event.code) {
        return {
          ...s,
          total: s.total + 1,
          attended: status === 'present' ? s.attended + 1 : s.attended
        };
      }
      return s;
    }));

    setToast({
      message: status === 'present' ? "Checked In! Keep it up." : "Bunk Logged. Stay safe.",
      type: status === 'present' ? 'success' : 'alert'
    });
  };

  const handleManualBunk = (statId: number) => {
      setStats(prev => prev.map(s => s.id === statId ? { ...s, total: s.total + 1 } : s));
      setToast({ message: "Manual Bunk Logged", type: 'alert' });
  };

  return (
    <div className="bg-slate-950 min-h-screen font-sans text-slate-200 selection:bg-indigo-500/30">
      <div className="max-w-md mx-auto min-h-screen flex flex-col bg-slate-950 relative overflow-hidden shadow-2xl">
        
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

        <CreationModal 
            isOpen={modalOpen} 
            onClose={() => setModalOpen(false)} 
            type={modalType as any} 
            onSubmit={handleCreationSubmit}
        />

        <SpeedDial
          open={showFabMenu}
          setOpen={setShowFabMenu}
          onAction={handleOpenModal}
        />

        <main className="flex-1 overflow-y-auto pb-24 relative z-10">
          {activeChat ? (
             <ChatDetail chat={activeChat} onBack={() => setActiveChat(null)} />
          ) : viewMessMenu ? (
             <MessMenu isOpen={viewMessMenu} onBack={() => setViewMessMenu(false)} />
          ) : selectedCourse ? (
             <CourseDetail 
              isOpen={!!selectedCourse} 
              course={selectedCourse} 
              onBack={() => setSelectedCourse(null)} 
              onOpenChat={setActiveChat} 
             />
          ) : selectedFriend ? (
              <FriendProfile 
                isOpen={!!selectedFriend} 
                friend={selectedFriend} 
                onBack={() => setSelectedFriend(null)} 
                onOpenChat={setActiveChat} 
              />
          ) : (
             <>
               {activeTab === 'home' && (
                  <HomeTab 
                     user={MOCK_USER}
                     friends={FRIENDS_ONLINE}
                      onNavigate={setActiveTab} 
                      onCourseSelect={setSelectedCourse} 
                      onMenuSelect={() => setViewMessMenu(true)}
                      onNavigateToDiscover={() => {
                        setScheduleView('discover');
                        setActiveTab('schedule');
                      }}
                      events={events}
                      onMarkAttendance={handleMarkAttendance}
                      onFriendSelect={setSelectedFriend}
                  />
               )}
               {activeTab === 'schedule' && (
                  <ScheduleTab 
                      events={events} 
                      onCourseSelect={setSelectedCourse} 
                      view={scheduleView}
                      onViewChange={setScheduleView}
                      onMarkAttendance={handleMarkAttendance}
                  />
               )}
               {activeTab === 'social' && <SocialTab posts={posts} handleLike={() => {}} />}
               {activeTab === 'bunk' && <BunkTab stats={stats} handleLogBunk={handleManualBunk} />} 
               {activeTab === 'profile' && <div className="text-white p-10">Profile Feature Coming Soon</div>}
             </>
          )}
        </main>

        <Dock
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          setScheduleView={setScheduleView}
          showFabMenu={showFabMenu}
          setShowFabMenu={setShowFabMenu}
        />
      </div>
    </div>
  );
};

export default App;