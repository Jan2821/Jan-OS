import React, { useState } from 'react';
import { AutopsyReport } from '../types';
import { generateAutopsySummary } from '../services/geminiService';
import { Save, Printer, RefreshCw, Activity, FileDown } from 'lucide-react';
import { createPortal } from 'react-dom';
import { downloadPDF } from '../services/pdfService';

export const Autopsy: React.FC = () => {
  const [report, setReport] = useState<AutopsyReport>({
    id: `OBD-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000)}`,
    deceasedName: '',
    dateOfDeath: '',
    causeOfDeath: '',
    examinerNotes: '',
    externalInjuries: '',
    internalFindings: '',
    toxicology: '',
    generatedSummary: ''
  });

  const [isLoadingAI, setIsLoadingAI] = useState(false);

  const handleGenerateSummary = async () => {
    setIsLoadingAI(true);
    const summary = await generateAutopsySummary(report);
    setReport(prev => ({ ...prev, generatedSummary: summary }));
    setIsLoadingAI(false);
  };

  const PrintPortal = () => {
    const portalDiv = document.getElementById('print-portal');
    if (!portalDiv) return null;

    return createPortal(
      <div id="pdf-autopsy" className="max-w-[210mm] mx-auto text-black font-serif pt-10 px-8 bg-white h-full">
            <div className="flex justify-between items-end border-b-4 border-black pb-4 mb-8">
                <div>
                    <h1 className="text-4xl font-bold uppercase tracking-tighter">Obduktionsbericht</h1>
                    <p className="text-sm mt-1 uppercase tracking-widest">Institut für Rechtsmedizin</p>
                </div>
                <div className="text-right">
                    <p className="font-bold text-xl">{report.id}</p>
                    <p className="text-sm">Datum: {new Date().toLocaleDateString('de-DE')}</p>
                </div>
            </div>

            <div className="bg-gray-100 p-4 mb-8 border border-gray-300">
                <table className="w-full">
                    <tbody>
                        <tr>
                            <td className="font-bold py-1 w-40">Verstorbene(r):</td>
                            <td>{report.deceasedName}</td>
                        </tr>
                        <tr>
                            <td className="font-bold py-1">Todeszeitpunkt:</td>
                            <td>{report.dateOfDeath.replace('T', ' ')} Uhr</td>
                        </tr>
                        <tr>
                            <td className="font-bold py-1">Todesursache:</td>
                            <td>{report.causeOfDeath}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div className="space-y-6">
                <section>
                    <h3 className="font-bold uppercase text-sm border-b border-black mb-2">1. Äußere Leichenschau</h3>
                    <p className="text-justify">{report.externalInjuries || "Keine besonderen Auffälligkeiten."}</p>
                </section>

                <section>
                    <h3 className="font-bold uppercase text-sm border-b border-black mb-2">2. Innere Leichenschau</h3>
                    <p className="text-justify">{report.internalFindings || "Ausstehend."}</p>
                </section>

                <section>
                    <h3 className="font-bold uppercase text-sm border-b border-black mb-2">3. Toxikologie</h3>
                    <p className="text-justify">{report.toxicology || "Proben im Labor."}</p>
                </section>

                <section>
                    <h3 className="font-bold uppercase text-sm border-b border-black mb-2">4. Zusammenfassung & Beurteilung</h3>
                    <p className="text-justify leading-relaxed">
                        {report.generatedSummary || report.examinerNotes || "Zusammenfassung folgt nach Abschluss aller Untersuchungen."}
                    </p>
                </section>
            </div>

            <div className="mt-20 flex justify-between items-end">
                <div className="text-center">
                    <div className="h-16 mb-2 flex items-end justify-center">
                        <span className="font-cursive text-2xl transform -rotate-6">Dr. M. Med</span>
                    </div>
                    <div className="border-t border-black w-64 pt-2 text-sm uppercase">Unterschrift Rechtsmediziner</div>
                </div>
                <div className="border-4 border-double border-black p-4 rounded-full w-32 h-32 flex items-center justify-center transform rotate-12 opacity-80">
                    <div className="text-center text-xs font-bold uppercase leading-tight">
                        Amtliches<br/>Siegel<br/>Stadt<br/>Polizei
                    </div>
                </div>
            </div>
        </div>,
        portalDiv
    );
  };

  return (
    <div className="flex flex-col h-full relative p-4 overflow-y-auto">
      <PrintPortal />

      <div className="flex justify-between items-center mb-4 border-b border-police-700 pb-2 shrink-0">
          <h2 className="text-xl font-mono font-bold text-white flex items-center gap-2">
              <Activity className="text-red-500" /> RECHTSMEDIZIN
          </h2>
          <div className="flex gap-2">
              <button 
                  onClick={handleGenerateSummary}
                  disabled={isLoadingAI}
                  className="flex items-center gap-2 bg-police-accent px-3 py-1.5 text-xs font-bold text-white hover:bg-blue-600 disabled:opacity-50"
              >
                  <RefreshCw size={14} className={isLoadingAI ? 'animate-spin' : ''} /> 
                  {isLoadingAI ? 'KI...' : 'KI ANALYSE'}
              </button>
              <button 
                  onClick={() => downloadPDF('pdf-autopsy', `Obduktion-${report.id}.pdf`)}
                  className="flex items-center gap-2 bg-white text-black px-3 py-1.5 text-xs font-bold hover:bg-gray-200"
              >
                  <FileDown size={14} /> PDF SPEICHERN
              </button>
          </div>
      </div>

      {/* Grid Layout: Stacks on iPad/Mobile */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 pb-20">
          
          {/* Left Column - Basics */}
          <div className="space-y-3">
               <div>
                    <label className="block text-xs text-gray-400 mb-1">NAME</label>
                    <input 
                        className="w-full bg-police-800 border border-police-700 p-2 text-white focus:border-red-500 outline-none"
                        value={report.deceasedName}
                        onChange={e => setReport({...report, deceasedName: e.target.value})}
                    />
                </div>
                <div>
                    <label className="block text-xs text-gray-400 mb-1">TODESZEITPUNKT</label>
                    <input 
                        type="datetime-local"
                        className="w-full bg-police-800 border border-police-700 p-2 text-white focus:border-red-500 outline-none"
                        value={report.dateOfDeath}
                        onChange={e => setReport({...report, dateOfDeath: e.target.value})}
                    />
                </div>
                <div>
                    <label className="block text-xs text-gray-400 mb-1">URSACHE</label>
                    <input 
                        className="w-full bg-police-800 border border-police-700 p-2 text-white focus:border-red-500 outline-none"
                        value={report.causeOfDeath}
                        onChange={e => setReport({...report, causeOfDeath: e.target.value})}
                    />
                </div>
                <div>
                    <label className="block text-xs text-gray-400 mb-1">TOXIKOLOGIE</label>
                    <textarea 
                        className="w-full bg-police-800 border border-police-700 p-2 text-white focus:border-red-500 outline-none h-20 text-xs"
                        value={report.toxicology}
                        onChange={e => setReport({...report, toxicology: e.target.value})}
                    />
                </div>
          </div>

          {/* Right Column - Details */}
          <div className="space-y-3 flex flex-col">
                <div className="h-40 xl:h-auto xl:flex-1">
                    <label className="block text-xs text-gray-400 mb-1">ÄUSSERE VERLETZUNGEN</label>
                    <textarea 
                        className="w-full h-full bg-police-800 border border-police-700 p-2 text-white text-xs focus:border-red-500 outline-none resize-none"
                        value={report.externalInjuries}
                        onChange={e => setReport({...report, externalInjuries: e.target.value})}
                    />
                </div>
                <div className="h-40 xl:h-auto xl:flex-1">
                    <label className="block text-xs text-gray-400 mb-1">INNERE BEFUNDE</label>
                    <textarea 
                        className="w-full h-full bg-police-800 border border-police-700 p-2 text-white text-xs focus:border-red-500 outline-none resize-none"
                        value={report.internalFindings}
                        onChange={e => setReport({...report, internalFindings: e.target.value})}
                    />
                </div>
                {report.generatedSummary && (
                    <div className="h-32 bg-black p-2 border border-gray-700 text-[10px] overflow-y-auto font-serif text-gray-300">
                        {report.generatedSummary}
                    </div>
                )}
          </div>
      </div>
    </div>
  );
};