import React, { useState } from 'react';
import { AutohausView } from '../../types';
import { CarInventory } from './CarInventory';
import { SalesDocs } from './SalesDocs';
import { Workshop } from './Workshop';
import { Office } from './Office';
import { LayoutGrid, FileText, Wrench, Briefcase, Car } from 'lucide-react';

export const AutohausOS: React.FC = () => {
  const [view, setView] = useState<AutohausView>(AutohausView.INVENTORY);

  const menu = [
    { id: AutohausView.INVENTORY, label: 'Fahrzeuge', icon: <Car size={20} /> },
    { id: AutohausView.SALES, label: 'Verkauf & Verträge', icon: <FileText size={20} /> },
    { id: AutohausView.WORKSHOP, label: 'Teile & Werkstatt', icon: <Wrench size={20} /> },
    { id: AutohausView.OFFICE, label: 'Büro / Personal', icon: <Briefcase size={20} /> },
  ];

  return (
    <div className="flex h-full w-full bg-white font-sans text-gray-800">
      {/* Sidebar - Opel/Corporate Style */}
      <div className="w-64 bg-[#facc15] flex flex-col shrink-0 border-r border-yellow-500">
        <div className="p-6 border-b border-yellow-500 bg-yellow-400">
            <h1 className="text-2xl font-extrabold italic tracking-tight">AUTOHAUS<br/>RADTKE</h1>
            <p className="text-xs font-bold mt-2 text-yellow-900">OPEL SERVICE PARTNER</p>
        </div>
        
        <nav className="flex-1 p-2 space-y-1">
            {menu.map(item => (
                <button
                    key={item.id}
                    onClick={() => setView(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-sm transition-colors ${view === item.id ? 'bg-white text-black shadow-sm' : 'text-yellow-900 hover:bg-yellow-400'}`}
                >
                    {item.icon}
                    {item.label}
                </button>
            ))}
        </nav>

        <div className="p-4 text-[10px] text-center text-yellow-800 font-bold">
            SYSTEM v4.0.1<br/>
            ONLINE
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-white">
        {view === AutohausView.INVENTORY && <CarInventory />}
        {view === AutohausView.SALES && <SalesDocs />}
        {view === AutohausView.WORKSHOP && <Workshop />}
        {view === AutohausView.OFFICE && <Office />}
      </div>
    </div>
  );
};