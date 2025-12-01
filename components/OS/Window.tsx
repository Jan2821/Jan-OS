import React from 'react';
import { X, Minus, Square } from 'lucide-react';

interface WindowProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  onClose: () => void;
  isMaximized?: boolean;
}

export const Window: React.FC<WindowProps> = ({ title, icon, children, onClose, isMaximized = false }) => {
  return (
    <div className={`absolute flex flex-col bg-win-gray border-2 border-win-teal shadow-[4px_4px_10px_rgba(0,0,0,0.5)] ${isMaximized ? 'inset-0 m-0 z-10' : 'top-10 left-10 right-10 bottom-16 z-10'}`}>
      {/* Title Bar */}
      <div className="h-8 bg-gradient-to-r from-win-blue to-blue-700 flex items-center justify-between px-1 select-none">
        <div className="flex items-center gap-2 text-white font-bold text-sm">
            {icon}
            <span>{title}</span>
        </div>
        <div className="flex gap-1">
            <button className="w-5 h-5 bg-win-gray border border-white border-b-gray-600 border-r-gray-600 flex items-center justify-center active:border-gray-600 active:border-b-white active:border-r-white">
                <Minus size={10} color="black" />
            </button>
            <button className="w-5 h-5 bg-win-gray border border-white border-b-gray-600 border-r-gray-600 flex items-center justify-center active:border-gray-600 active:border-b-white active:border-r-white">
                <Square size={10} color="black" />
            </button>
            <button onClick={onClose} className="w-5 h-5 bg-win-gray border border-white border-b-gray-600 border-r-gray-600 flex items-center justify-center active:border-gray-600 active:border-b-white active:border-r-white">
                <X size={12} color="black" />
            </button>
        </div>
      </div>
      
      {/* Content */}
      <div className="flex-1 bg-black border-2 border-win-dark border-t-0 overflow-hidden relative">
        {children}
      </div>
    </div>
  );
};