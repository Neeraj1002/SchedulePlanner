import { useEffect } from "react";
import { CheckCircle2, ShieldAlert } from "lucide-react";

interface ToastProps {
  message: string;
  type: "success" | "error"| "alert";
  onClose: () => void;
}

export default function Toast ({ message, type, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

return (
    <div className={`fixed top-20 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 rounded-full shadow-2xl flex items-center gap-2 animate-in slide-in-from-top-4 fade-in duration-300 border border-white/10
      ${type === 'success' ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'}`}>
      {type === 'success' ? <CheckCircle2 size={18} /> : <ShieldAlert size={18} />}
      <span className="text-sm font-bold">{message}</span>
    </div>
  );
}
