import React, { useState } from 'react';
import { TrafficViolation } from '../types';
import { generateBlitzerImage } from '../services/geminiService';
import { Car, Camera, Printer, FileDown } from 'lucide-react';
import { createPortal } from 'react-dom';
import { downloadPDF } from '../services/pdfService';

export const TrafficViolations: React.FC = () => {
  const [violation, setViolation] = useState<TrafficViolation>({
    id: `OWI-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000)}`,
    driverName: '',
    licensePlate: '',
    vehicleModel: '',
    violationType: 'SPEEDING',
    location: 'Musterstraße / B1',
    speedLimit: 50,
    actualSpeed: 0,
    fineAmount: 0,
    date: new Date().toISOString().substring(0, 16),
  });

  const [isLoadingImage, setIsLoadingImage] = useState(false);

  const calculateFine = () => {
    let fine = 0;
    const diff = violation.actualSpeed - violation.speedLimit;
    
    if (violation.violationType === 'SPEEDING') {
      if (diff <= 10) fine = 30;
      else if (diff <= 15) fine = 50;
      else if (diff <= 20) fine = 70;
      else if (diff <= 25) fine = 115;
      else if (diff <= 30) fine = 180;
      else fine = 260; 
    } else if (violation.violationType === 'RED_LIGHT') {
      fine = 90;
    } else if (violation.violationType === 'DUI') {
        fine = 500;
    } else {
        fine = 25;
    }
    
    setViolation(prev => ({ ...prev, fineAmount: fine }));
  };

  const handleGenerateImage = async () => {
    setIsLoadingImage(true);
    const img = await generateBlitzerImage(violation);
    if (img) {
      setViolation(prev => ({ ...prev, evidenceImage: img }));
    }
    setIsLoadingImage(false);
  };

  const PrintPortal = () => {
    const portalDiv = document.getElementById('print-portal');
    if (!portalDiv) return null;

    return createPortal(
      <div id="pdf-traffic" className="p-12 font-serif text-black max-w-[210mm] mx-auto bg-white h-full">
        {/* Print Layout remains same as before for consistent output */}
        <div className="flex justify-between items-start border-b-2 border-black pb-4 mb-8">
            <div className="flex items-center gap-4">
                <div className="w-16 h-16 border-4 border-black rounded-full flex items-center justify-center">
                    <div className="w-10 h-10 border-2 border-black rounded-full"></div>
                </div>
                <div>
                    <h1 className="text-xl font-bold uppercase">Polizeipräsidium</h1>
                    <h2 className="text-lg">Bußgeldstelle</h2>
                    <p className="text-xs mt-1">Stadt Musterstadt • Verwaltungsbezirk I</p>
                </div>
            </div>
            <div className="text-right text-sm">
                <p>Datum: {new Date().toLocaleDateString('de-DE')}</p>
                <p>Aktenzeichen: <strong>{violation.id}</strong></p>
            </div>
        </div>

        <div className="mb-12 text-sm pl-2">
            <p className="underline mb-2 text-xs">Polizeipräsidium Musterstadt, 12345 Musterstadt</p>
            <p className="font-bold text-lg">{violation.driverName || "An den Fahrzeughalter"}</p>
            <p>Musterweg 12</p>
            <p>12345 Musterstadt</p>
        </div>

        <h3 className="font-bold text-xl mb-6 text-center border-y-2 border-black py-2 uppercase">
            Zeugenfragebogen / Bußgeldbescheid
        </h3>

        <p className="mb-4 text-justify leading-relaxed">
            Sehr geehrte(r) Verkehrsteilnehmer(in),<br/><br/>
            Ihnen wird zur Last gelegt, am {new Date(violation.date).toLocaleDateString('de-DE')} um {new Date(violation.date).toLocaleTimeString('de-DE')} Uhr in {violation.location} folgende Ordnungswidrigkeit begangen zu haben:
        </p>

        <div className="bg-gray-100 p-6 border border-gray-300 mb-6 font-mono text-sm">
            <div className="grid grid-cols-2 gap-y-2">
                <div className="font-bold">Tatbestand:</div>
                <div>
                    {violation.violationType === 'SPEEDING' ? `Geschwindigkeitsüberschreitung` : violation.violationType}
                    {violation.violationType === 'SPEEDING' && ` (${violation.actualSpeed - violation.speedLimit} km/h zu schnell)`}
                </div>
                
                <div className="font-bold">Fahrzeug:</div>
                <div>{violation.vehicleModel}</div>

                <div className="font-bold">Kennzeichen:</div>
                <div>{violation.licensePlate}</div>

                <div className="font-bold">Gemessene Geschwindigkeit:</div>
                <div>{violation.actualSpeed} km/h (abzgl. Toleranz)</div>

                <div className="font-bold">Erlaubte Geschwindigkeit:</div>
                <div>{violation.speedLimit} km/h</div>
            </div>
        </div>

        <p className="mb-8">
            Gemäß Bußgeldkatalog (§ 49 StVO) wurde gegen Sie ein Verwarnungsgeld / Bußgeld festgesetzt in Höhe von:
        </p>

        <div className="text-center text-3xl font-bold mb-10 border-2 border-black inline-block px-8 py-4 mx-auto w-full">
            {violation.fineAmount.toFixed(2).replace('.', ',')} EUR
        </div>

        {violation.evidenceImage ? (
            <div className="mb-8">
                <p className="font-bold mb-2 text-sm uppercase">Beweismittel: Fotoaufnahme</p>
                <div className="border border-black p-1">
                    <img src={violation.evidenceImage} alt="Beweisfoto" className="w-full grayscale contrast-125 brightness-90 filter" />
                </div>
            </div>
        ) : (
            <div className="border border-dashed border-gray-400 p-8 text-center text-gray-400 mb-8 uppercase text-xs">
                Kein Bildmaterial im Druck beigefügt
            </div>
        )}
      </div>,
      portalDiv
    );
  };

  return (
    <div className="flex flex-col h-full relative font-mono overflow-y-auto p-4">
      <PrintPortal />
      
      {/* Container split: Stacks on Tablet/Mobile, Grid on large Desktop */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 pb-20">
        
        {/* Left Col: Data Entry */}
        <div className="bg-police-900 border-2 border-police-700 p-4 flex flex-col gap-3">
            <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2 border-b border-police-700 pb-2">
                <Car className="text-yellow-500" size={18} /> ORDNUNGSWIDRIGKEIT
            </h2>

            <div className="grid grid-cols-2 gap-3 text-xs">
                 <div className="col-span-2">
                    <label className="text-police-accent">DATUM / UHRZEIT</label>
                    <input 
                        type="datetime-local"
                        className="w-full bg-police-800 border border-police-700 p-1.5 text-white"
                        value={violation.date}
                        onChange={e => setViolation({...violation, date: e.target.value})}
                    />
                 </div>
                 <div className="col-span-2">
                    <label className="text-gray-400 mb-1 block">ORT</label>
                    <input 
                        className="w-full bg-police-800 border border-police-700 p-1.5 text-white"
                        value={violation.location}
                        onChange={e => setViolation({...violation, location: e.target.value})}
                    />
                 </div>
                 
                 <div className="col-span-2 border-t border-police-700 my-1"></div>

                 <div className="col-span-2">
                    <label className="text-gray-400 mb-1 block">HALTER</label>
                    <input 
                        className="w-full bg-police-800 border border-police-700 p-1.5 text-white"
                        placeholder="Name"
                        value={violation.driverName}
                        onChange={e => setViolation({...violation, driverName: e.target.value})}
                    />
                 </div>
                 <div>
                    <label className="text-gray-400 mb-1 block">MODELL</label>
                    <input 
                        className="w-full bg-police-800 border border-police-700 p-1.5 text-white"
                        value={violation.vehicleModel}
                        onChange={e => setViolation({...violation, vehicleModel: e.target.value})}
                    />
                 </div>
                 <div>
                    <label className="text-gray-400 mb-1 block">KENNZEICHEN</label>
                    <input 
                        className="w-full bg-police-800 border border-police-700 p-1.5 text-white uppercase"
                        value={violation.licensePlate}
                        onChange={e => setViolation({...violation, licensePlate: e.target.value})}
                    />
                 </div>

                 <div className="col-span-2 border-t border-police-700 my-1"></div>

                 <div className="col-span-2">
                    <label className="text-gray-400 mb-1 block">VERSTOSS</label>
                    <select 
                        className="w-full bg-police-800 border border-police-700 p-1.5 text-white"
                        value={violation.violationType}
                        onChange={e => setViolation({...violation, violationType: e.target.value as any})}
                    >
                        <option value="SPEEDING">Geschwindigkeit</option>
                        <option value="RED_LIGHT">Rotlicht</option>
                        <option value="PARKING">Parken</option>
                        <option value="DUI">Alkohol</option>
                    </select>
                 </div>
                 
                 {violation.violationType === 'SPEEDING' && (
                     <>
                        <div>
                            <label className="text-gray-400 mb-1 block">ERLAUBT</label>
                            <input 
                                type="number"
                                className="w-full bg-police-800 border border-police-700 p-1.5 text-white"
                                value={violation.speedLimit}
                                onChange={e => setViolation({...violation, speedLimit: Number(e.target.value)})}
                                onBlur={calculateFine}
                            />
                        </div>
                        <div>
                            <label className="text-gray-400 mb-1 block">GEMESSEN</label>
                            <input 
                                type="number"
                                className="w-full bg-police-800 border border-police-700 p-1.5 text-white font-bold text-red-400"
                                value={violation.actualSpeed}
                                onChange={e => setViolation({...violation, actualSpeed: Number(e.target.value)})}
                                onBlur={calculateFine}
                            />
                        </div>
                     </>
                 )}
            </div>
        </div>

        {/* Right Col: Evidence & Actions */}
        <div className="flex flex-col gap-4">
            <div className="bg-police-900 border-2 border-police-700 p-4 flex flex-col h-auto min-h-[300px]">
                <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                    <Camera className="text-police-accent" size={18} /> BEWEIS
                </h2>
                
                <div className="flex-1 border-2 border-dashed border-police-700 bg-black relative overflow-hidden flex items-center justify-center min-h-[200px]">
                    {violation.evidenceImage ? (
                        <img src={violation.evidenceImage} alt="Blitzer" className="max-h-full max-w-full opacity-90 grayscale contrast-125" />
                    ) : (
                        <div className="text-gray-600 text-xs text-center">Kein Bild</div>
                    )}
                </div>

                <button 
                    onClick={handleGenerateImage}
                    disabled={isLoadingImage || !violation.vehicleModel}
                    className="mt-3 bg-police-800 border border-police-accent text-white p-2 text-xs hover:bg-police-700 disabled:opacity-50"
                >
                    {isLoadingImage ? 'LÄDT...' : 'FOTO GENERIEREN (KI)'}
                </button>
            </div>

            <div className="bg-police-100 p-4 rounded text-black flex flex-col gap-2 shrink-0">
                <div className="flex justify-between items-center">
                    <span className="font-bold text-sm">SUMME:</span>
                    <span className="text-xl font-bold font-mono">{violation.fineAmount} €</span>
                </div>
                <button 
                    onClick={() => downloadPDF('pdf-traffic', 'Bussgeld.pdf')}
                    className="bg-black text-white w-full py-2 font-bold text-xs flex items-center justify-center gap-2 hover:bg-gray-800"
                >
                    <FileDown size={14} /> PDF SPEICHERN
                </button>
            </div>
        </div>

      </div>
    </div>
  );
};