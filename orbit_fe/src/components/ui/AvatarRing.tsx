interface AvatarRingProps {
  src: string;
  status?: "free" | "busy" | "away";
  size?: "md" | "lg" | "xl" ;
}

export default function AvatarRing({ src, status, size = "md" }: AvatarRingProps) {
  const sizeClasses = size === "lg" ? "w-14 h-14" : size === "xl" ? "w-16 h-16" : "w-12 h-12";

  const ringColor =
    status === "free"? "ring-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.4)]": 
    status === "busy"? "ring-rose-500": "ring-slate-600";

  return (
    <div className={`relative rounded-full p-[2px] ring-2 transition-all duration-300 ${ringColor}`}>
      <img src={src} alt ="avatar" className={`${sizeClasses} rounded-full bg-slate-800 object-cover`} />
      {status === "free" && (
        <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-slate-950 rounded-full animate-pulse"></div>
      )}
    </div>
  );
}




