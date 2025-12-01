import React, { useState } from 'react';
import { FaxMessage } from '../types';
import { Send, Printer, RotateCcw, CheckCircle, AlertTriangle, FilePlus, FileDown } from 'lucide-react';
import { createPortal } from 'react-dom';
import { downloadPDF } from '../services/pdfService';

export const FaxMachine: React.FC = () => {
  const [faxes, setFaxes] = useState<FaxMessage[]>([]);
  const [recipient, setRecipient] = useState('');
  const [content, setContent] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  const handleSend = () => {
    if (!recipient || !content) {
        setStatusMsg('FEHLER: Empfänger und Inhalt erforderlich.');
        return;
    }

    setIsSending(true);
    setStatusMsg('WÄHLE VERBINDUNG...');

    // Simulation of fax transmission process
    setTimeout(() => {
        setStatusMsg('ÜBERTRAGE DATEN...');
        
        setTimeout(() => {
            const newFax: FaxMessage = {
                id: Math.random().toString(36).substr(2, 9),
                recipient,
                sender: 'WACHE-OS-TERMINAL-01',
                content,
                timestamp: new Date().toLocaleString('de-DE'),
                status: 'SENT'
            };
            setFaxes([newFax, ...faxes]);
            setIsSending(false);
            setStatusMsg('ÜBERTRAGUNG ERFOLGREICH.');
            // Do not clear immediately so user sees result, use Reset button for that or manual clear
            setTimeout(() => setStatusMsg(''), 5000);
        }, 2000);
    }, 1500);
  };

  const handleReset = () => {
    setRecipient('');
    setContent('');
    setStatusMsg('');
  };

  const PrintPortal = () => {
    const portalDiv = document.getElementById('print-portal');
    if (!portalDiv) return null;

    return createPortal(
      <div id="pdf-fax-log" className="p-8 font-mono text-black text-sm max-w-[210mm] mx-auto bg-white h-full">
        <div className="border-b-2 border-black pb-4 mb-6">
            <h1 className="text-2xl font-bold">SENDEPROTOKOLL / FAX</h1>
            <p>Terminal: WACHE-OS-01</p>
            <p>Datum: {new Date().toLocaleDateString('de-DE')}</p>
        </div>
        
        <table className="w-full text-left border-collapse">
            <thead>
                <tr className="border-b border-black">
                    <th className="py-2">ZEIT</th>
                    <th className="py-2">EMPFÄNGER</th>
                    <th className="py-2">STATUS</th>
                    <th className="py-2">INHALT (AUSZUG)</th>
                </tr>
            </thead>
            <tbody>
                {faxes.map(fax => (
                    <tr key={fax.id} className="border-b border-gray-300">
                        <td className="py-2 pr-2">{fax.timestamp}</td>
                        <td className="py-2 pr-2">{fax.recipient}</td>
                        <td className="py-2 pr-2">{fax.status}</td>
                        <td className="py-2 truncate max-w-[200px]">{fax.content.substring(0, 50)}...</td>
                    </tr>
                ))}
                {faxes.length === 0 && (
                    <tr>
                        <td colSpan={4} className="py-4 text-center italic">Keine Einträge.</td>
                    </tr>
                )}
            </tbody>
        </table>

        <div className="mt-8 pt-4 border-t border-black text-xs">
            <p>Dieses Dokument wurde elektronisch erstellt und ist ohne Unterschrift gültig.</p>
        </div>
      </div>,
      portalDiv
    );
  };

  return (
    <div className="flex flex-col lg:flex-row h-full gap-6 font-mono overflow-y-auto p-4">
        <PrintPortal />

        {/* Send Interface */}
        <div className="flex-1 bg-police-800 border-2 border-police-700 p-6 shadow-lg rounded-sm flex flex-col min-h-[500px]">
            <div className="border-b-2 border-police-700 pb-2 mb-4 flex justify-between items-center shrink-0">
                <h2 className="text-xl font-bold text-police-100 flex items-center gap-2">
                    <Printer /> FAX-MODUL 3000
                </h2>
                <div className={`w-3 h-3 rounded-full ${isSending ? 'bg-yellow-400 animate-pulse' : 'bg-green-500'}`}></div>
            </div>

            <div className="space-y-4 flex-1 flex flex-col">
                <div className="shrink-0">
                    <label className="block text-xs text-police-accent mb-1">EMPFÄNGER (NUMMER/BEHÖRDE)</label>
                    <input 
                        value={recipient}
                        onChange={(e) => setRecipient(e.target.value)}
                        className="w-full bg-police-900 border border-police-700 p-3 text-lg tracking-widest text-white focus:border-green-500 outline-none font-mono"
                        placeholder="030-110-XXXX"
                        disabled={isSending}
                    />
                </div>
                <div className="flex-1 flex flex-col min-h-[200px]">
                    <label className="block text-xs text-police-accent mb-1">NACHRICHT</label>
                    <textarea 
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="flex-1 w-full bg-white text-black p-4 font-mono text-sm border-4 border-gray-300 shadow-inner resize-none focus:outline-none"
                        placeholder="Hier Text eingeben..."
                        disabled={isSending}
                        style={{ fontFamily: '"Courier Prime", monospace' }}
                    />
                </div>
            </div>

            <div className="mt-4 shrink-0">
                {statusMsg && (
                     <div className="bg-police-900 border border-yellow-500 text-yellow-500 p-2 mb-4 text-center font-bold animate-pulse text-sm">
                        {statusMsg}
                    </div>
                )}
                
                <div className="flex flex-col sm:flex-row gap-3 justify-end">
                    <button 
                        onClick={handleReset}
                        disabled={isSending}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-3 font-bold text-gray-400 border border-gray-600 hover:bg-police-700 hover:text-white transition-all disabled:opacity-50"
                    >
                        <FilePlus size={18} /> NEUES FAX
                    </button>
                    
                    <button 
                        onClick={handleSend}
                        disabled={isSending}
                        className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-8 py-3 font-bold text-white transition-all ${isSending ? 'bg-gray-600 cursor-not-allowed' : 'bg-green-700 hover:bg-green-600 shadow-[0_4px_0_rgb(20,83,45)] active:shadow-none active:translate-y-1'}`}
                    >
                        <Send size={18} /> SENDEN
                    </button>
                </div>
            </div>
        </div>

        {/* Log / History */}
        <div className="w-full lg:w-80 bg-police-900 border border-police-700 flex flex-col shrink-0 min-h-[300px] lg:min-h-0">
            <div className="p-4 border-b border-police-700 bg-police-800 flex justify-between items-center shrink-0">
                <h3 className="font-bold text-gray-300 flex items-center gap-2">
                    <RotateCcw size={16} /> PROTOKOLL
                </h3>
                <button 
                    onClick={() => downloadPDF('pdf-fax-log', 'Fax-Protokoll.pdf')}
                    className="text-xs bg-white text-black font-bold px-2 py-1 flex gap-1 items-center hover:bg-gray-200"
                >
                    <FileDown size={12} /> PDF SPEICHERN
                </button>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-2 max-h-[400px] lg:max-h-full">
                {faxes.length === 0 && (
                    <div className="text-center text-gray-600 text-xs py-10">Keine Übertragungen.</div>
                )}
                {faxes.map(fax => (
                    <div key={fax.id} className="bg-police-800 p-3 border border-police-700 text-xs">
                        <div className="flex justify-between mb-1">
                            <span className="font-bold text-police-accent truncate mr-2">AN: {fax.recipient}</span>
                            {fax.status === 'SENT' ? <CheckCircle size={12} className="text-green-500 shrink-0"/> : <AlertTriangle size={12} className="text-red-500 shrink-0"/>}
                        </div>
                        <div className="text-gray-400 mb-2">{fax.timestamp}</div>
                        <div className="bg-police-900 p-1 text-gray-500 truncate font-mono">
                            {fax.content}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
  );
};