import { useState, useEffect, useRef } from "react";
import { ArrowLeft, Phone, Video, MoreHorizontal, Paperclip, Smile, Send} from "lucide-react";
import { getCourseStyle } from "../../utils/styleHelpers";

interface ChatData{
   name: string ;
   subject : string;
   status: string ;
   avatar: string ;
   classmates: string[];
   code: string ;
}

interface Chat{
   id: number;
   type: 'individual' | 'group';
   data: ChatData;
}

interface ChatDetailProps {
  chat: Chat;
  onBack: () => void;
}

const ChatDetail = ({ chat, onBack }: ChatDetailProps) => {
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const isGroup = chat.type === 'group';
  const title = isGroup ? chat.data.subject : chat.data.name;
  const subtitle = isGroup ? `${chat.data.classmates.length + 1} members` : chat.data.status === 'free' ? 'Online' : 'Last seen recently';
  const avatar = isGroup ? undefined : chat.data.avatar;
  const style = isGroup && chat.data.code ? getCourseStyle(chat.data.code) : null ;
  const IconComponent = style ?.icon ;

  // Mock messages tailored to chat type
  const [chatMessages, setChatMessages] = useState(() => {
      return isGroup ? [
         { id: 1, sender: chat.data.classmates[0] || 'Aditi', isMe: false, text: "Did anyone complete the assignment for tomorrow?", time: "10:23 AM", avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${chat.data.classmates[0] || 'Aditi'}` },
         { id: 2, sender: chat.data.classmates[1] || 'Vikram', isMe: false, text: "I'm stuck on question 3. The equation doesn't balance.", time: "10:25 AM", avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${chat.data.classmates[1] || 'Vikram'}` },
         { id: 3, sender: 'Me', isMe: true, text: "I can share my notes from yesterday's tutorial if that helps?", time: "10:28 AM" },
         { id: 4, sender: chat.data.classmates[1] || 'Vikram', isMe: false, text: "Yes please! Lifesaver 🙏", time: "10:29 AM", avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${chat.data.classmates[1] || 'Vikram'}` },
      ] : [
         { id: 1, sender: chat.data.name, isMe: false, text: "Hey! Are you heading to the mess?", time: "12:30 PM" },
         { id: 2, sender: 'Me', isMe: true, text: "Yeah, just left the hostel. Want me to grab a seat?", time: "12:32 PM" },
         { id: 3, sender: chat.data.name, isMe: false, text: "Yes please! It's Rajma Chawal today so it'll be crowded.", time: "12:33 PM" },
      ];
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const handleSend = () => {
      if (!message.trim()) return;
      const newMsg = {
         id: Date.now(),
         sender: 'Me',
         isMe: true,
         text: message.trim(),
         time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
      };
      setChatMessages([...chatMessages, newMsg]);
      setMessage('');
  };

  return (
     <div className="fixed inset-0 z-[100] flex justify-center bg-slate-950/80 backdrop-blur-sm">
        <div className="w-full max-w-md h-[100dvh] bg-[#0B0E25] flex flex-col animate-in slide-in-from-right duration-300 shadow-2xl overflow-hidden relative border-x border-white/5">
           
           {/* Chat Header */}
           <div className="bg-slate-900/90 backdrop-blur-xl border-b border-white/10 px-4 py-3 pt-12 sm:pt-6 flex items-center justify-between z-20 shadow-sm shrink-0">
              <div className="flex items-center gap-3">
                 <button onClick={onBack} className="text-slate-400 hover:text-white transition-colors active:scale-95">
                    <ArrowLeft size={24} />
                 </button>
                 <div className="flex items-center gap-3">
                    {isGroup && style && IconComponent ? (
                       <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${style.bg} border ${style.border} shadow-inner`}>
                          <IconComponent size={18} className={style.color} />
                       </div>
                    ) : (
                       <div className="relative">
                          <img src={avatar} className="w-10 h-10 rounded-full bg-slate-800" />
                          {chat.data.status === 'free' && <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-slate-900 rounded-full"></div>}
                       </div>
                    )}
                    <div>
                       <h2 className="text-white font-bold text-base leading-tight truncate max-w-[150px]">{title}</h2>
                       <p className={`text-[11px] font-medium ${isGroup ? 'text-slate-400' : chat.data.status === 'free' ? 'text-emerald-400' : 'text-slate-500'}`}>{subtitle}</p>
                    </div>
                 </div>
              </div>
              
              <div className="flex items-center gap-4 text-slate-400">
                 {!isGroup && <Phone size={20} className="hover:text-white transition-colors cursor-pointer" />}
                 {!isGroup && <Video size={20} className="hover:text-white transition-colors cursor-pointer" />}
                 <MoreHorizontal size={24} className="hover:text-white transition-colors cursor-pointer" />
              </div>
           </div>

           {/* Chat Messages */}
           <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#0B0E25] scrollbar-hide">
              <div className="text-center my-4">
                 <span className="text-[10px] bg-slate-800/80 px-3 py-1 rounded-full text-slate-400 font-bold border border-white/5 shadow-sm">Today</span>
              </div>
              
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                 {chatMessages.map((msg, i) => {
                    const isFirstInGroup = i === 0 || chatMessages[i-1].sender !== msg.sender;
                    return (
                       <div key={msg.id} className={`flex gap-2 ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
                          {/* Avatar for group chats if not me */}
                          {isGroup && !msg.isMe && (
                             <div className="w-8 shrink-0 flex flex-col justify-end">
                                {isFirstInGroup && <img src={msg.avatar} className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700" />}
                             </div>
                          )}
                          
                          <div className={`flex flex-col ${msg.isMe ? 'items-end' : 'items-start'} max-w-[75%]`}>
                             {isGroup && !msg.isMe && isFirstInGroup && (
                                <span className="text-[10px] text-slate-400 ml-1 mb-1 font-bold tracking-wide">{msg.sender}</span>
                             )}
                             <div className={`px-4 py-2.5 rounded-[20px] text-sm shadow-sm ${
                                msg.isMe 
                                   ? 'bg-indigo-600 text-white rounded-br-sm shadow-indigo-500/10' 
                                   : 'bg-[#1c1e3d] text-slate-200 rounded-bl-sm border border-white/5'
                             }`}>
                                {msg.text}
                             </div>
                             <span className="text-[9px] text-slate-500 mt-1 mx-1.5 font-medium">{msg.time}</span>
                          </div>
                       </div>
                    )
                 })}
                 <div ref={messagesEndRef} />
              </div>
           </div>

           {/* Input Field */}
           <div className="bg-[#0B0E25] border-t border-white/5 p-3 pb-8 sm:pb-4 flex items-end gap-2 shrink-0">
              <button className="p-2.5 text-slate-400 hover:text-white transition-colors shrink-0 bg-[#1c1e3d] rounded-full hover:bg-[#25284f]">
                 <Paperclip size={20} />
              </button>
              <div className="flex-1 bg-[#1c1e3d] border border-white/5 rounded-3xl flex items-center pr-1 pl-4 min-h-[44px] focus-within:border-indigo-500/50 transition-colors">
                 <input 
                    type="text" 
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSend()}
                    placeholder="Message..."
                    className="flex-1 bg-transparent text-white text-sm focus:outline-none py-3"
                 />
                 <button className="p-2 text-slate-400 hover:text-indigo-300 transition-colors shrink-0">
                    <Smile size={20} />
                 </button>
              </div>
              <button 
                 onClick={handleSend}
                 className={`p-3 rounded-full shrink-0 transition-all ${message.trim() ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 scale-105' : 'bg-[#1c1e3d] text-slate-400'}`}
              >
                 <Send size={18} className={message.trim() ? 'translate-x-[1px] -translate-y-[1px]' : ''} />
              </button>
           </div>
        </div>
     </div>
  );
}
export default ChatDetail;
