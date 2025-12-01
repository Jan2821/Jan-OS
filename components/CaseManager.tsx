import React, { useState } from 'react';
import { CaseFile, CaseStatus } from '../types';
import { Plus, Search, FolderOpen, Save, FileDown } from 'lucide-react';
import { createPortal } from 'react-dom';
import { downloadPDF } from '../services/pdfService';

export const CaseManager: React.FC = () => {
  const [cases, setCases] = useState<CaseFile[]>([
    {
      id: 'AK-2023-992',
      title: 'Diebstahl Bäckerei Müller',
      description: 'Einbruch in der Nacht zum Sonntag. Kasse entwendet.',
      officerInCharge: 'PK Schmidt',
      dateCreated: '2023-10-24',
      status: CaseStatus.OPEN,
      suspects: ['Unbekannt'],
      evidence: ['Überwachunsgvideo', 'Fußabdruck']
    },
    {
      id: 'AK-2023-841',
      title: 'Verkehrsunfall B404',
      description: 'Auffahrunfall mit Personenschaden.',
      officerInCharge: 'KOK Weber',
      dateCreated: '2023-09-15',
      status: CaseStatus.CLOSED,
      suspects: [],
      evidence: ['Unfallbericht']
    }
  ]);

  const [selectedCase, setSelectedCase] = useState<CaseFile | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleCreate = () => {
    const newCase: CaseFile = {
      id: `AK-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)}`,
      title: 'Neue Akte',
      description: '',
      officerInCharge: '',
      dateCreated: new Date().toISOString().split('T')[0],
      status: CaseStatus.OPEN,
      suspects: [],
      evidence: []
    };
    setCases([newCase, ...cases]);
    setSelectedCase(newCase);
  };

  const handleUpdate = (updatedCase: CaseFile) => {
    setCases(cases.map(c => c.id === updatedCase.id ? updatedCase : c));
    setSelectedCase(updatedCase);
  };

  const filteredCases = cases.filter(c => 
    c.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const PrintPortal = () => {
    const portalDiv = document.getElementById('print-portal');
    if (!portalDiv || !selectedCase) return null;

    return createPortal(
      <div id="pdf-case-file" className="max-w-[210mm] mx-auto text-black font-serif p-8 bg-white h-full">
            <div className="text-center border-b-2 border-black pb-4 mb-8">
                <h1 className="text-3xl font-bold uppercase tracking-widest">Polizeibericht</h1>
                <p className="text-sm mt-2">Dienststelle 01 • Musterstadt</p>
            </div>
            <table className="w-full mb-8 text-sm">
                <tbody>
                    <tr>
                        <td className="font-bold py-2 w-32">Aktenzeichen:</td>
                        <td className="border-b border-black">{selectedCase.id}</td>
                        <td className="font-bold py-2 w-32 pl-4">Datum:</td>
                        <td className="border-b border-black">{selectedCase.dateCreated}</td>
                    </tr>
                    <tr>
                        <td className="font-bold py-2">Sachbearbeiter:</td>
                        <td className="border-b border-black">{selectedCase.officerInCharge}</td>
                        <td className="font-bold py-2 pl-4">Status:</td>
                        <td className="border-b border-black">{selectedCase.status}</td>
                    </tr>
                </tbody>
            </table>
            
            <h3 className="font-bold border-b border-black mb-2 mt-6">Sachverhalt</h3>
            <p className="text-justify leading-relaxed mb-6 whitespace-pre-wrap">{selectedCase.description}</p>

            <h3 className="font-bold border-b border-black mb-2 mt-6">Beteiligte / Verdächtige</h3>
            <p>{selectedCase.suspects.join(', ') || 'Keine Angaben'}</p>

            <h3 className="font-bold border-b border-black mb-2 mt-6">Beweismittel</h3>
            <p>{selectedCase.evidence.join(', ') || 'Keine Beweismittel gelistet'}</p>

            <div className="mt-16 pt-8 flex justify-between">
                <div className="text-center w-1/3">
                    <div className="border-t border-black pt-2">Unterschrift Beamter</div>
                </div>
                <div className="text-center w-1/3">
                    <div className="border-t border-black pt-2">Dienstsiegel</div>
                </div>
            </div>
        </div>,
        portalDiv
    );
  };

  return (
    <div className="flex flex-col md:flex-row h-full font-mono overflow-hidden">
      <PrintPortal />
      
      {/* List - Narrow sidebar on desktop, top bar on mobile */}
      <div className="w-full md:w-64 flex flex-col gap-2 border-b-2 md:border-b-0 md:border-r-2 border-police-700 bg-police-900 p-2 shrink-0 md:h-full max-h-48 md:max-h-full overflow-hidden">
        <div className="flex gap-2 mb-2">
            <div className="relative flex-1">
                <Search className="absolute left-2 top-2 text-gray-500" size={14} />
                <input 
                    type="text" 
                    placeholder="Suche..." 
                    className="w-full bg-police-900 border border-police-700 p-1.5 pl-7 text-xs focus:border-police-accent outline-none text-white rounded-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <button onClick={handleCreate} className="bg-police-accent text-white p-1.5 rounded-sm hover:bg-blue-700">
                <Plus size={16} />
            </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-2">
            {filteredCases.map(c => (
                <div 
                    key={c.id}
                    onClick={() => setSelectedCase(c)}
                    className={`p-2 border cursor-pointer hover:bg-police-800 transition-colors ${selectedCase?.id === c.id ? 'border-police-accent bg-police-800' : 'border-police-700'}`}
                >
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-[10px] text-police-accent font-bold">{c.id}</span>
                        <span className={`text-[9px] px-1 border ${c.status === CaseStatus.OPEN ? 'border-red-500 text-red-500' : 'border-green-500 text-green-500'}`}>
                            {c.status.substring(0, 1)}
                        </span>
                    </div>
                    <div className="font-bold truncate text-white text-xs">{c.title}</div>
                    <div className="text-[10px] text-gray-400">{c.dateCreated}</div>
                </div>
            ))}
        </div>
      </div>

      {/* Details - Compacted for iPad */}
      <div className="flex-1 bg-police-900 p-4 relative flex flex-col overflow-y-auto md:overflow-hidden min-h-0">
        {selectedCase ? (
            <div className="flex flex-col gap-4 pb-20 md:pb-0 md:h-full">
                {/* Header Row */}
                <div className="flex justify-between items-center border-b border-police-700 pb-2 shrink-0">
                    <div className="flex-1 mr-4">
                         <label className="text-[10px] text-police-accent">AKTEN-TITEL</label>
                        <input 
                            value={selectedCase.title}
                            onChange={(e) => handleUpdate({...selectedCase, title: e.target.value})}
                            className="bg-transparent w-full text-base font-bold focus:border-police-accent outline-none text-white placeholder-gray-600"
                        />
                    </div>
                    <button 
                        onClick={() => downloadPDF('pdf-case-file', `Akte-${selectedCase.id}.pdf`)}
                        className="flex items-center gap-1 text-xs bg-white text-black px-3 py-1.5 hover:bg-gray-200 rounded-sm font-bold"
                    >
                        <FileDown size={14} /> PDF SPEICHERN
                    </button>
                </div>

                {/* Form Grid - Minimized Scrolling */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 shrink-0">
                    <div>
                        <label className="block text-[10px] text-police-accent mb-1 uppercase">Sachbearbeiter</label>
                        <input 
                            value={selectedCase.officerInCharge}
                            onChange={(e) => handleUpdate({...selectedCase, officerInCharge: e.target.value})}
                            className="w-full bg-police-800 border border-police-700 p-1.5 text-xs text-white"
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] text-police-accent mb-1 uppercase">Status</label>
                        <select 
                            value={selectedCase.status}
                            onChange={(e) => handleUpdate({...selectedCase, status: e.target.value as CaseStatus})}
                            className="w-full bg-police-800 border border-police-700 p-1.5 text-xs text-white"
                        >
                            {Object.values(CaseStatus).map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                </div>

                {/* Main Content Areas - Flex to fill on desktop, auto height on mobile */}
                <div className="flex-1 flex flex-col gap-4 min-h-0">
                    <div className="flex-1 flex flex-col min-h-[150px]">
                        <label className="block text-[10px] text-police-accent mb-1 uppercase">Sachverhalt</label>
                        <textarea 
                            value={selectedCase.description}
                            onChange={(e) => handleUpdate({...selectedCase, description: e.target.value})}
                            className="flex-1 w-full bg-police-800 border border-police-700 p-2 text-xs font-mono text-white resize-none"
                        />
                    </div>
                     <div className="h-20 shrink-0">
                        <label className="block text-[10px] text-police-accent mb-1 uppercase">Verdächtige / Hinweise</label>
                        <input 
                            value={selectedCase.suspects.join(', ')}
                            onChange={(e) => handleUpdate({...selectedCase, suspects: e.target.value.split(',').map(s => s.trim())})}
                            className="w-full bg-police-800 border border-police-700 p-2 text-xs text-white"
                        />
                    </div>
                </div>
            </div>
        ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-600">
                <FolderOpen size={48} className="mb-4 opacity-50" />
                <p>Bitte Akte wählen.</p>
            </div>
        )}
      </div>
    </div>
  );
};