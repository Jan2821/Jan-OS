import React, { useState } from 'react';
import { Car, Customer } from '../../types';
import { Printer, FileText, CheckCircle, FileDown } from 'lucide-react';
import { createPortal } from 'react-dom';
import { downloadPDF } from '../../services/pdfService';

export const SalesDocs: React.FC = () => {
  // Mock data for selection
  const availableCars: Car[] = [
    { id: '1', model: 'Opel Astra', year: 2022, color: 'Silber', price: 24500, mileage: 15000, vin: 'W0Lxxxx', status: 'AVAILABLE' },
    { id: '2', model: 'Opel Corsa-e', year: 2023, color: 'Orange', price: 29900, mileage: 500, vin: 'W0Lxxxx', status: 'AVAILABLE' },
    { id: '5', model: 'Opel Zafira Life', year: 2022, color: 'Weiß', price: 45000, mileage: 12000, vin: 'W0Lxxxx', status: 'AVAILABLE' },
  ];

  const [customer, setCustomer] = useState<Customer>({ id: '', name: '', address: '', phone: '', email: '' });
  const [selectedCarId, setSelectedCarId] = useState('');
  const [docType, setDocType] = useState<'CONTRACT' | 'INVOICE'>('CONTRACT');

  const selectedCar = availableCars.find(c => c.id === selectedCarId);

  const PrintPortal = () => {
    const portalDiv = document.getElementById('print-portal');
    if (!portalDiv || !selectedCar || !customer.name) return null;

    return createPortal(
      <div id="pdf-sales-doc" className="p-12 font-sans text-black max-w-[210mm] mx-auto bg-white h-full">
        {/* Header */}
        <div className="flex justify-between items-start border-b-4 border-[#facc15] pb-6 mb-8">
            <div>
                <h1 className="text-3xl font-extrabold italic text-gray-800">Autohaus Radtke</h1>
                <p className="font-bold text-gray-600 mt-1">Ihr Opel-Partner seit 1985</p>
            </div>
            <div className="text-right text-xs text-gray-500">
                <p>Hauptstraße 101</p>
                <p>12345 Musterstadt</p>
                <p>Tel: 01234 / 567890</p>
                <p>info@autohaus-radtke.de</p>
            </div>
        </div>

        {/* Title */}
        <div className="text-center mb-10">
            <h2 className="text-2xl font-bold uppercase tracking-wide border-b border-gray-300 inline-block pb-1">
                {docType === 'CONTRACT' ? 'Verbindliche Autobestellung' : 'Rechnung'}
            </h2>
            <p className="text-sm mt-2">Datum: {new Date().toLocaleDateString('de-DE')}</p>
        </div>

        {/* Customer & Car Info */}
        <div className="grid grid-cols-2 gap-10 mb-8">
            <div className="bg-gray-50 p-4 border border-gray-200">
                <h3 className="font-bold border-b border-gray-300 mb-2 pb-1 text-sm uppercase">Käufer</h3>
                <p className="font-bold text-lg">{customer.name}</p>
                <p className="whitespace-pre-wrap">{customer.address}</p>
                <p className="mt-2 text-sm">Tel: {customer.phone}</p>
            </div>
            <div className="bg-gray-50 p-4 border border-gray-200">
                 <h3 className="font-bold border-b border-gray-300 mb-2 pb-1 text-sm uppercase">Fahrzeugdaten</h3>
                 <table className="w-full text-sm">
                    <tbody>
                        <tr><td className="py-1 text-gray-600">Modell:</td><td className="font-bold">{selectedCar.model}</td></tr>
                        <tr><td className="py-1 text-gray-600">VIN:</td><td className="font-mono">{selectedCar.vin}</td></tr>
                        <tr><td className="py-1 text-gray-600">Farbe:</td><td>{selectedCar.color}</td></tr>
                        <tr><td className="py-1 text-gray-600">EZ/Baujahr:</td><td>{selectedCar.year}</td></tr>
                        <tr><td className="py-1 text-gray-600">Laufleistung:</td><td>{selectedCar.mileage.toLocaleString()} km</td></tr>
                    </tbody>
                 </table>
            </div>
        </div>

        {/* Financials */}
        <div className="mb-12">
            <table className="w-full border-collapse">
                <thead>
                    <tr className="bg-gray-800 text-white text-sm">
                        <th className="py-2 px-4 text-left">Beschreibung</th>
                        <th className="py-2 px-4 text-right">Betrag</th>
                    </tr>
                </thead>
                <tbody>
                    <tr className="border-b border-gray-200">
                        <td className="py-4 px-4 font-bold">{selectedCar.model} - Gebrauchtwagen</td>
                        <td className="py-4 px-4 text-right">{selectedCar.price.toFixed(2).replace('.', ',')} €</td>
                    </tr>
                    <tr className="border-b border-gray-200 text-sm text-gray-500">
                        <td className="py-2 px-4">Zulassungsservice (inklusive)</td>
                        <td className="py-2 px-4 text-right">0,00 €</td>
                    </tr>
                     <tr className="border-b border-gray-200 text-sm text-gray-500">
                        <td className="py-2 px-4">Fußmatten Set (Original Opel)</td>
                        <td className="py-2 px-4 text-right">0,00 €</td>
                    </tr>
                </tbody>
                <tfoot>
                    <tr className="bg-[#facc15]">
                        <td className="py-3 px-4 font-bold text-lg">GESAMTPREIS (Brutto)</td>
                        <td className="py-3 px-4 text-right font-bold text-lg">{selectedCar.price.toFixed(2).replace('.', ',')} €</td>
                    </tr>
                    <tr>
                         <td colSpan={2} className="py-1 px-4 text-right text-xs text-gray-600">Enthält 19% MwSt.</td>
                    </tr>
                </tfoot>
            </table>
        </div>

        {/* Footer / Signatures */}
        <div className="mt-16 text-sm">
             <p className="mb-8 text-justify text-xs text-gray-500">
                Das Fahrzeug bleibt bis zur vollständigen Bezahlung Eigentum des Autohaus Radtke. 
                Gerichtsstand ist Musterstadt. Es gelten unsere Allgemeinen Geschäftsbedingungen.
                Gebrauchtwagengarantie: 12 Monate gemäß Bedingungen.
             </p>
             
             <div className="flex justify-between mt-8 pt-8 border-t border-gray-300">
                <div className="w-1/3">
                    <div className="h-10 border-b border-black mb-2"></div>
                    <p className="text-center text-xs uppercase">Unterschrift Käufer</p>
                </div>
                <div className="w-1/3">
                    <div className="h-10 border-b border-black mb-2 relative">
                        {/* Stamp simulation */}
                         <div className="absolute -top-4 left-4 border-2 border-blue-800 text-blue-800 rounded-full w-24 h-24 flex items-center justify-center opacity-70 transform -rotate-12 pointer-events-none">
                            <span className="text-[10px] text-center font-bold leading-tight">Autohaus<br/>Radtke<br/>GmbH</span>
                         </div>
                    </div>
                    <p className="text-center text-xs uppercase">Unterschrift Verkäufer</p>
                </div>
             </div>
        </div>
      </div>,
      portalDiv
    );
  };

  return (
    <div className="h-full flex flex-col md:flex-row bg-white p-6 gap-6 overflow-y-auto">
        <PrintPortal />
        
        {/* Form */}
        <div className="flex-1 space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <FileText className="text-yellow-500" /> Vertragsassistent
            </h2>
            
            <div className="bg-gray-50 p-4 rounded border border-gray-200 shadow-sm">
                <h3 className="font-bold text-gray-700 mb-3 border-b pb-2">1. Fahrzeug wählen</h3>
                <div className="grid grid-cols-1 gap-2">
                    {availableCars.map(car => (
                        <div 
                            key={car.id}
                            onClick={() => setSelectedCarId(car.id)}
                            className={`p-3 border rounded cursor-pointer flex justify-between items-center transition-all ${selectedCarId === car.id ? 'border-yellow-500 bg-yellow-50 ring-1 ring-yellow-500' : 'border-gray-200 hover:bg-white'}`}
                        >
                            <span className="font-bold">{car.model}</span>
                            <span className="text-sm text-gray-500">{car.price.toLocaleString()} €</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-gray-50 p-4 rounded border border-gray-200 shadow-sm">
                <h3 className="font-bold text-gray-700 mb-3 border-b pb-2">2. Kundendaten</h3>
                <div className="space-y-3">
                    <input 
                        className="w-full border border-gray-300 p-2 rounded text-sm"
                        placeholder="Vollständiger Name"
                        value={customer.name}
                        onChange={e => setCustomer({...customer, name: e.target.value})}
                    />
                    <textarea 
                        className="w-full border border-gray-300 p-2 rounded text-sm h-20 resize-none"
                        placeholder="Adresse (Straße, PLZ, Ort)"
                        value={customer.address}
                        onChange={e => setCustomer({...customer, address: e.target.value})}
                    />
                    <input 
                        className="w-full border border-gray-300 p-2 rounded text-sm"
                        placeholder="Telefonnummer"
                        value={customer.phone}
                        onChange={e => setCustomer({...customer, phone: e.target.value})}
                    />
                </div>
            </div>
        </div>

        {/* Preview / Action */}
        <div className="w-full md:w-80 bg-gray-100 p-6 rounded border border-gray-200 flex flex-col h-auto">
            <h3 className="font-bold text-gray-700 mb-6">Aktionen</h3>
            
            <div className="flex-1 space-y-4">
                 <div className="bg-white p-4 rounded border border-gray-200 text-sm">
                    <div className="text-gray-500 text-xs mb-1">Gewähltes Fahrzeug:</div>
                    <div className="font-bold">{selectedCar ? selectedCar.model : '-'}</div>
                 </div>
                 <div className="bg-white p-4 rounded border border-gray-200 text-sm">
                    <div className="text-gray-500 text-xs mb-1">Kunde:</div>
                    <div className="font-bold">{customer.name || '-'}</div>
                 </div>

                 <div className="pt-4">
                     <label className="flex items-center gap-2 text-sm text-gray-700 mb-2 cursor-pointer">
                        <input type="radio" name="doctype" checked={docType === 'CONTRACT'} onChange={() => setDocType('CONTRACT')} />
                        Kaufvertrag
                     </label>
                     <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                        <input type="radio" name="doctype" checked={docType === 'INVOICE'} onChange={() => setDocType('INVOICE')} />
                        Rechnung
                     </label>
                 </div>
            </div>

            <button 
                onClick={() => downloadPDF('pdf-sales-doc', 'Verkaufsdokument.pdf')}
                disabled={!selectedCar || !customer.name}
                className="w-full bg-black text-white py-4 mt-6 rounded font-bold flex items-center justify-center gap-2 hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
                <FileDown size={20} /> PDF DOWNLOAD
            </button>
        </div>
    </div>
  );
};