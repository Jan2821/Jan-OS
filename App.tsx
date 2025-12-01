
import React, { useState } from 'react';
import { PoliceOS } from './components/PoliceOS';
import { AutohausOS } from './components/Autohaus/AutohausOS';
import { Window } from './components/OS/Window';
import { Taskbar } from './components/OS/Taskbar';
import { Shield, Power, Car } from 'lucide-react';

const App: React.FC = () => {
  const [isPoliceAppOpen, setIsPoliceAppOpen] = useState(false);
  const [isAutohausOpen, setIsAutohausOpen] = useState(false);
  const [showStartMenu, setShowStartMenu] = useState(false);

  const toggleStartMenu = () => setShowStartMenu(!showStartMenu);

  const openApps = [];
  if (isPoliceAppOpen) openApps.push('WACHE OS');
  if (isAutohausOpen) openApps.push('AUTOHAUS RADTKE');

  return (
    <div className="h-[100dvh] w-screen bg-[#008080] overflow-hidden relative font-sans text-black selection:bg-blue-700 selection:text-white">
      
      {/* Desktop Icons - Changed to onClick for better iPad support */}
      <div className="p-4 grid grid-cols-1 gap-8 w-32 content-start">
        <div 
            onClick={() => setIsPoliceAppOpen(true)}
            className="flex flex-col items-center gap-1 group cursor-pointer active:opacity-70"
        >
            <Shield size={48} className="text-white drop-shadow-md" />
            <span className="text-white text-xs drop-shadow-md bg-transparent group-hover:bg-blue-800 px-1 text-center">WACHE OS</span>
        </div>

        <div 
            onClick={() => setIsAutohausOpen(true)}
            className="flex flex-col items-center gap-1 group cursor-pointer active:opacity-70"
        >
            <div className="w-12 h-12 bg-[#facc15] border-2 border-white rounded-lg flex items-center justify-center shadow-md">
                <Car size={32} className="text-black" />
            </div>
            <span className="text-white text-xs drop-shadow-md bg-transparent group-hover:bg-blue-800 px-1 text-center">AUTOHAUS<br/>RADTKE</span>
        </div>

        <div className="flex flex-col items-center gap-1 opacity-50 cursor-not-allowed">
            <div className="w-12 h-12 bg-gray-300 border-2 border-gray-400 flex items-center justify-center">
                <span className="font-bold text-xl">M</span>
            </div>
            <span className="text-white text-xs drop-shadow-md bg-transparent px-1">Mail</span>
        </div>
      </div>

      {/* Windows */}
      {isPoliceAppOpen && (
        <Window 
            title="POLIZEI WACHE OS - v2.1" 
            icon={<Shield size={16} />}
            onClose={() => setIsPoliceAppOpen(false)}
            isMaximized={true}
        >
            <PoliceOS />
        </Window>
      )}

      {isAutohausOpen && (
        <div className="absolute inset-0 m-0 z-20 flex flex-col bg-win-gray border-2 border-win-teal shadow-[4px_4px_10px_rgba(0,0,0,0.5)]">
             <Window 
                title="Autohaus Manager v4.0" 
                icon={<Car size={16} />}
                onClose={() => setIsAutohausOpen(false)}
                isMaximized={true}
            >
                <AutohausOS />
            </Window>
        </div>
      )}

      {/* Start Menu */}
      {showStartMenu && (
        <div className="absolute bottom-10 left-0 w-48 bg-win-gray border-2 border-white border-b-black border-r-black z-[60] shadow-xl">
            <div className="bg-blue-900 text-white font-bold p-1 px-2 text-sm vertical-rl bg-gradient-to-b from-blue-900 to-blue-600">
                WINDOWS 98
            </div>
            <div className="p-1">
                <button 
                    onClick={() => { setIsPoliceAppOpen(true); setShowStartMenu(false); }}
                    className="w-full text-left px-2 py-2 hover:bg-blue-800 hover:text-white flex items-center gap-2 text-sm"
                >
                    <Shield size={16} /> Wache OS
                </button>
                <button 
                    onClick={() => { setIsAutohausOpen(true); setShowStartMenu(false); }}
                    className="w-full text-left px-2 py-2 hover:bg-blue-800 hover:text-white flex items-center gap-2 text-sm"
                >
                    <Car size={16} /> Autohaus
                </button>
                <div className="h-[1px] bg-gray-400 my-1"></div>
                <button className="w-full text-left px-2 py-2 hover:bg-blue-800 hover:text-white flex items-center gap-2 text-sm">
                    <Power size={16} /> Herunterfahren
                </button>
            </div>
        </div>
      )}

      {/* Taskbar */}
      <Taskbar 
        onStartClick={toggleStartMenu} 
        openApps={openApps} 
      />
    </div>
  );
};

export default App;
