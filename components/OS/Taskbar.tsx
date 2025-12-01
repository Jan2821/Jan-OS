import React, { useState, useEffect } from 'react';
import { Shield } from 'lucide-react';

interface TaskbarProps {
  onStartClick: () => void;
  openApps: string[];
}

export const Taskbar: React.FC<TaskbarProps> = ({ onStartClick, openApps }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="h-10 bg-win-gray border-t-2 border-white flex items-center justify-between px-1 fixed bottom-0 w-full z-50 select-none">
      <div className="flex gap-2 h-full items-center py-1">
        <button 
            onClick={onStartClick}
            className="h-full px-2 flex items-center gap-1 font-bold italic border-2 border-white border-b-black border-r-black bg-win-gray active:border-black active:border-b-white active:border-r-white transition-all shadow-sm"
        >
            <div className="w-4 h-4 bg-gradient-to-br from-red-500 via-green-500 to-blue-500 rounded-sm"></div>
            Start
        </button>
        
        <div className="w-[2px] h-full bg-gray-400 mx-1"></div>

        {openApps.map(app => (
            <div key={app} className="h-full px-4 flex items-center gap-2 bg-gray-300 border-2 border-black border-t-gray-400 border-l-gray-400 font-bold text-xs w-40 truncate">
                <Shield size={14} className="text-blue-800" /> {app}
            </div>
        ))}
      </div>

      <div className="h-full py-1">
        <div className="h-full px-3 bg-gray-300 border-2 border-gray-400 border-b-white border-r-white flex items-center justify-center text-xs font-mono shadow-inner inset-shadow">
            {time.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
        </div>
      </div>
    </div>
  );
};