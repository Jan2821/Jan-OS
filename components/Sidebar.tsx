import React from 'react';
import { AppView } from '../types';
import { LayoutDashboard, FileText, Printer, Skull, Settings, Shield, Car } from 'lucide-react';

interface SidebarProps {
  currentView: AppView;
  onChangeView: (view: AppView) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onChangeView }) => {
  const menuItems = [
    { id: AppView.DASHBOARD, label: 'Zentrale', icon: <LayoutDashboard size={20} /> },
    { id: AppView.CASES, label: 'Aktenverwaltung', icon: <FileText size={20} /> },
    { id: AppView.TRAFFIC, label: 'Verkehr / OWI', icon: <Car size={20} /> },
    { id: AppView.FAX, label: 'Fernschreiber / Fax', icon: <Printer size={20} /> },
    { id: AppView.AUTOPSY, label: 'Rechtsmedizin', icon: <Skull size={20} /> },
    { id: AppView.SETTINGS, label: 'Einstellungen', icon: <Settings size={20} /> },
  ];

  return (
    <aside className="w-64 bg-police-900 border-r-2 border-police-700 flex flex-col h-full no-print font-mono text-sm shrink-0">
      <div className="p-6 border-b-2 border-police-700 flex items-center gap-3 shrink-0">
        <Shield className="text-police-accent" size={32} />
        <div>
          <h1 className="font-bold text-police-100 tracking-wider">POLIZEI</h1>
          <span className="text-xs text-police-accent">WACHE OS v2.1</span>
        </div>
      </div>
      
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onChangeView(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-sm border transition-all duration-150 ${
              currentView === item.id
                ? 'bg-police-800 border-police-accent text-police-accent shadow-[0_0_10px_rgba(49,130,206,0.3)]'
                : 'border-transparent text-gray-400 hover:text-gray-200 hover:bg-police-800'
            }`}
          >
            {item.icon}
            <span className="uppercase tracking-widest">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t-2 border-police-700 text-xs text-gray-500 text-center shrink-0">
        SYSTEM ONLINE <br/>
        {new Date().toLocaleDateString('de-DE')}
      </div>
    </aside>
  );
};