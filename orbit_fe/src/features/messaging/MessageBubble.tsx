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
    <div
      className={`flex w-full mb-1 animate-in fade-in slide-in-from-bottom-1 duration-300 ${
        isMe ? "justify-end pl-12" : "justify-start pr-12"
      }`}
    >
      <div
        className={`relative px-4 py-2.5 text-sm shadow-lg transition-all ${
          isMe
            ? "bg-gradient-to-tr from-indigo-600 to-violet-600 text-white rounded-2xl rounded-tr-none shadow-indigo-500/10"
            : "bg-slate-800/80 backdrop-blur-md border border-white/5 text-slate-100 rounded-2xl rounded-tl-none shadow-black/20"
        }`}
      >
        <p className="leading-relaxed select-text">{message.text}</p>
        
        <div className={`flex items-center gap-1.5 mt-1 ${isMe ? "justify-end" : "justify-start"}`}>
          <span className={`text-[9px] font-medium ${isMe ? "text-indigo-200" : "text-slate-500"}`}>
            {message.time}
          </span>
          {isMe && (
            <div className="w-2.5 h-2.5 flex items-center justify-center">
               {/* Subtle checkmark or status dot */}
               <div className="w-1 h-1 rounded-full bg-indigo-300" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};