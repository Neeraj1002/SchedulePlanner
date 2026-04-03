import React from "react";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export default function GlassCard({ children, className = "", onClick }: GlassCardProps) {
  return (
    <div
      onClick={onClick}
      className={`bg-slate-900/40 backdrop-blur-md border border-white/5 rounded-3xl p-5 shadow-xl ${className}`}
    >
      {children}
    </div>
  );
}