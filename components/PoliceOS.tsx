import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { CaseManager } from './CaseManager';
import { FaxMachine } from './FaxMachine';
import { Autopsy } from './AutopsyReport';
import { TrafficViolations } from './TrafficViolations';
import { Settings } from './Settings';
import { AppView } from '../types';
import { Bell } from 'lucide-react';

const Dashboard: React.FC = () => {
    return (
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-police-100 overflow-y-auto h-full">
            <div className="bg-police-800 border-2 border-police-700 p-6 rounded-sm shadow-lg">
                <h2 className="text-xl font-bold mb-4 border-b border-police-700 pb-2 text-police-accent">STATUSÜBERSICHT</h2>
                <div className="grid grid-cols-3 gap-2 text-center mb-6">
                    <div className="bg-police-900 p-2 border border-police-700">
                        <div className="text-2xl font-bold text-green-500">4</div>
                        <div className="text-[10px] uppercase mt-1 text-gray-400">Streifen</div>
                    </div>
                    <div className="bg-police-900 p-2 border border-police-700">
                        <div className="text-2xl font-bold text-red-500">2</div>
                        <div className="text-[10px] uppercase mt-1 text-gray-400">Notrufe</div>
                    </div>
                    <div className="bg-police-900 p-2 border border-police-700">
                        <div className="text-2xl font-bold text-yellow-500">12</div>
                        <div className="text-[10px] uppercase mt-1 text-gray-400">Faxe</div>
                    </div>
                </div>
                <div>
                    <h3 className="text-xs font-bold text-gray-400 mb-2">MELDUNGEN</h3>
                    <ul className="space-y-2 text-xs">
                        <li className="flex gap-2">
                            <span className="text-police-accent">[10:42]</span>
                            <span>Banküberfall Hauptstraße</span>
                        </li>
                        <li className="flex gap-2">
                            <span className="text-police-accent">[09:15]</span>
                            <span>Systemwartung 22:00</span>
                        </li>
                    </ul>
                </div>
            </div>
            
            <div className="bg-police-900 border-2 border-police-700 p-6 flex flex-col items-center justify-center shadow-lg">
                 <div className="text-5xl md:text-6xl font-bold font-mono text-white mb-2">
                    {new Date().toLocaleTimeString('de-DE', {hour: '2-digit', minute:'2-digit'})}
                 </div>
                 <div className="text-police-accent uppercase tracking-widest text-xs md:text-sm">
                    {new Date().toLocaleDateString('de-DE', {weekday: 'long', day:'numeric', month:'long'})}
                 </div>
                 <div className="mt-8 w-full border-t border-police-700 pt-4 text-center">
                     <span className="text-xl font-bold">12°C</span>
                     <span className="ml-2 text-gray-400">Regen</span>
                 </div>
            </div>
        </div>
    )
}

export const PoliceOS: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);

  const renderContent = () => {
    switch (currentView) {
      case AppView.CASES:
        return <CaseManager />;
      case AppView.FAX:
        return <FaxMachine />;
      case AppView.AUTOPSY:
        return <Autopsy />;
      case AppView.TRAFFIC:
        return <TrafficViolations />;
      case AppView.SETTINGS:
        return <Settings />;
      case AppView.DASHBOARD:
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-full w-full bg-black overflow-hidden crt text-police-100">
      <Sidebar currentView={currentView} onChangeView={setCurrentView} />
      
      <main className="flex-1 flex flex-col h-full bg-[#111] relative overflow-hidden min-w-0">
        {/* Header */}
        <header className="h-12 bg-police-800 border-b-2 border-police-700 flex items-center justify-between px-4 no-print shrink-0">
            <h2 className="text-police-100 font-mono text-base font-bold tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                {currentView}
            </h2>
            <div className="flex items-center gap-3">
                <button className="relative text-gray-400 hover:text-white">
                    <Bell size={18} />
                </button>
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-police-700 rounded-full flex items-center justify-center text-[10px] font-bold text-white border border-gray-500">
                        PK
                    </div>
                </div>
            </div>
        </header>

        {/* Content Area - Relative positioning allows children to handle scrolling */}
        <div className="flex-1 overflow-hidden relative">
            {renderContent()}
        </div>
      </main>
    </div>
  );
};