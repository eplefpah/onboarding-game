import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  label: string;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ variant = 'primary', label, icon, className, ...props }) => {
  const baseStyles = "relative overflow-hidden font-arcade uppercase tracking-widest text-sm py-3 px-6 transition-all duration-300 clip-path-polygon group flex items-center justify-center gap-2";
  
  const variants = {
    primary: "bg-cyan-900/50 text-cyan-400 border border-cyan-500 hover:bg-cyan-800 hover:text-cyan-200 hover:shadow-[0_0_20px_rgba(34,211,238,0.4)]",
    secondary: "bg-slate-800/50 text-slate-400 border border-slate-600 hover:bg-slate-700 hover:text-white",
    danger: "bg-red-900/50 text-red-400 border border-red-500 hover:bg-red-800 hover:text-red-200 hover:shadow-[0_0_20px_rgba(248,113,113,0.4)]"
  };

  return (
    <button className={`${baseStyles} ${variants[variant]} ${className || ''}`} {...props}>
      <span className="relative z-10 flex items-center gap-2">
        {icon}
        {label}
      </span>
      {/* Glitch effect overlay */}
      <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
    </button>
  );
};