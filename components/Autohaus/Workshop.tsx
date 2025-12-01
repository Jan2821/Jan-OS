import React, { useState } from 'react';
import { Part } from '../../types';
import { Wrench, Package, Search, Plus, ShoppingCart, Printer, Trash2, X, Save, Clock, FileText, RefreshCw, CheckCircle, FileDown } from 'lucide-react';
import { createPortal } from 'react-dom';
import { downloadPDF } from '../../services/pdfService';

interface InvoiceItem {
    id: string;
    description: string;
    quantity: number;
    unitPrice: number;
    type: 'PART' | 'LABOR';
}

export const Workshop: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'INVENTORY' | 'INVOICE'>('INVENTORY');
  
  // Inventory State
  const [parts, setParts] = useState<Part[]>([
    { id: '1', name: 'Ölfilter OP-2022', partNumber: 'OP-5592', stock: 45, price: 12.50, category: 'MOTOR' },
    { id: '2', name: 'Bremsbeläge Satz (Vorn)', partNumber: 'OP-1102', stock: 8, price: 89.90, category: 'RÄDER' },
    { id: '3', name: 'Zündkerze Iridium', partNumber: 'OP-3391', stock: 120, price: 18.00, category: 'MOTOR' },
    { id: '4', name: 'Stoßfänger Astra K', partNumber: 'OP-9921', stock: 2, price: 350.00, category: 'KAROSSERIE' },
    { id: '5', name: 'Fußmatten Velours', partNumber: 'OP-0012', stock: 15, price: 45.00, category: 'INNENRAUM' },
    { id: '6', name: 'Scheinwerfer LED Links', partNumber: 'OP-7721', stock: 1, price: 620.00, category: 'KAROSSERIE' },
    { id: '7', name: 'Luftfilter Sport', partNumber: 'OP-5511', stock: 22, price: 42.50, category: 'MOTOR' },
    { id: '8', name: 'Radkappe 16 Zoll', partNumber: 'OP-1661', stock: 40, price: 19.99, category: 'RÄDER' },
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newPart, setNewPart] = useState<Partial<Part>>({ name: '', partNumber: '', price: 0, stock: 0, category: 'MOTOR' });

  // Invoice State
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([]);
  const [customerName, setCustomerName] = useState('');
  const [vehicle, setVehicle] = useState('');
  const [laborDesc, setLaborDesc] = useState('');
  const [laborHours, setLaborHours] = useState(1);
  const [laborRate, setLaborRate] = useState(85); // Hourly rate
  
  // Feedback UI
  const [lastAddedId, setLastAddedId] = useState<string | null>(null);

  // --- Inventory Logic ---
  const handleAddPart = () => {
    if(newPart.name && newPart.price) {
        setParts([...parts, { ...newPart, id: Math.random().toString(), category: newPart.category as any } as Part]);
        setIsAddModalOpen(false);
        setNewPart({ name: '', partNumber: '', price: 0, stock: 0, category: 'MOTOR' });
    }
  };

  const handleRestock = () => {
    alert("Bestellung an Zentrallager wurde ausgelöst! Lieferung erfolgt morgen früh.");
  };

  // --- Invoice Logic ---
  const addToInvoice = (part: Part) => {
    const existing = invoiceItems.find(i => i.id === part.id && i.type === 'PART');
    if (existing) {
        setInvoiceItems(invoiceItems.map(i => i.id === part.id ? { ...i, quantity: i.quantity + 1 } : i));
    } else {
        setInvoiceItems([...invoiceItems, {
            id: part.id,
            description: `${part.name} (${part.partNumber})`,
            quantity: 1,
            unitPrice: part.price,
            type: 'PART'
        }]);
    }
    
    // Visual feedback
    setLastAddedId(part.id);
    setTimeout(() => setLastAddedId(null), 1000);
  };

  const addLabor = () => {
    if (!laborDesc) return;
    setInvoiceItems([...invoiceItems, {
        id: `L-${Math.random()}`,
        description: laborDesc,
        quantity: laborHours,
        unitPrice: laborRate,
        type: 'LABOR'
    }]);
    setLaborDesc('');
    setLaborHours(1);
  };

  const removeFromInvoice = (id: string) => {
    setInvoiceItems(invoiceItems.filter(i => i.id !== id));
  };

  const resetInvoice = () => {
      if(window.confirm("Möchten Sie die aktuelle Rechnung wirklich verwerfen und eine neue beginnen?")) {
          setInvoiceItems([]);
          setCustomerName('');
          setVehicle('');
      }
  }

  const calculateTotal = () => {
    return invoiceItems.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  };

  const filteredParts = parts.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.partNumber.toLowerCase().includes(searchTerm.toLowerCase()));

  const PrintPortal = () => {
    const portalDiv = document.getElementById('print-portal');
    if (!portalDiv || activeTab !== 'INVOICE') return null;
    
    const subtotal = calculateTotal();
    const tax = subtotal * 0.19;
    const total = subtotal + tax;

    return createPortal(
        <div id="pdf-workshop-invoice" className="p-10 font-sans text-black max-w-[210mm] mx-auto bg-white h-full">
            <div className="flex justify-between items-start border-b-4 border-[#facc15] pb-6 mb-8">
                <div>
                    <h1 className="text-3xl font-extrabold italic text-gray-900">Autohaus Radtke</h1>
                    <p className="font-bold text-gray-700 mt-1">Werkstatt & Service</p>
                </div>
                <div className="text-right text-xs text-gray-600 font-bold">
                    <p>Rechnungs-Nr: {Math.floor(Math.random() * 100000)}</p>
                    <p>Datum: {new Date().toLocaleDateString('de-DE')}</p>
                </div>
            </div>

            <div className="mb-8 border border-gray-300 p-4 bg-gray-50">
                <h2 className="font-extrabold text-xl mb-2 text-black">RECHNUNGSEMPFÄNGER</h2>
                <div className="text-sm text-black">
                    <p className="mb-1"><span className="font-bold w-24 inline-block">Kunde:</span> {customerName || '____________________'}</p>
                    <p><span className="font-bold w-24 inline-block">Fahrzeug:</span> {vehicle || '____________________'}</p>
                </div>
            </div>

            <table className="w-full text-sm mb-8 border-collapse">
                <thead className="border-b-2 border-black">
                    <tr>
                        <th className="text-left py-2 text-black font-extrabold">Pos.</th>
                        <th className="text-left py-2 text-black font-extrabold">Beschreibung</th>
                        <th className="text-right py-2 text-black font-extrabold">Menge/Std</th>
                        <th className="text-right py-2 text-black font-extrabold">Einzelpreis</th>
                        <th className="text-right py-2 text-black font-extrabold">Gesamt</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-300">
                    {invoiceItems.length === 0 ? (
                        <tr><td colSpan={5} className="py-4 text-center italic text-gray-500">Keine Positionen</td></tr>
                    ) : (
                        invoiceItems.map((item, idx) => (
                            <tr key={idx}>
                                <td className="py-2 text-black">{idx + 1}</td>
                                <td className="py-2 text-black font-bold">
                                    {item.type === 'LABOR' && <span className="mr-2 font-extrabold">[AW]</span>}
                                    {item.description}
                                </td>
                                <td className="py-2 text-right text-black">{item.quantity}</td>
                                <td className="py-2 text-right text-black">{item.unitPrice.toFixed(2)} €</td>
                                <td className="py-2 text-right text-black font-bold">{(item.quantity * item.unitPrice).toFixed(2)} €</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            <div className="flex justify-end">
                <div className="w-64">
                    <div className="flex justify-between py-1 border-b border-gray-300 text-black">
                        <span>Netto:</span>
                        <span className="font-bold">{subtotal.toFixed(2)} €</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-gray-300 text-black">
                        <span>MwSt (19%):</span>
                        <span className="font-bold">{tax.toFixed(2)} €</span>
                    </div>
                    <div className="flex justify-between py-2 font-extrabold text-xl border-b-4 border-black mt-2 bg-yellow-100 px-2 text-black">
                        <span>GESAMT:</span>
                        <span>{total.toFixed(2)} €</span>
                    </div>
                </div>
            </div>

            <div className="mt-16 text-xs text-center text-gray-600 font-bold">
                <p>Vielen Dank für Ihren Auftrag. Gute Fahrt!</p>
                <p>Zahlbar sofort ohne Abzug. Es gelten unsere AGB.</p>
            </div>
        </div>,
        portalDiv
    );
  };

  return (
    <div className="h-full flex flex-col bg-gray-50 relative text-gray-900 font-sans">
        <PrintPortal />

        {/* Tab Navigation */}
        <div className="bg-white px-6 pt-4 border-b-2 border-gray-300 flex gap-4 shrink-0 shadow-sm z-10 sticky top-0">
            <button 
                onClick={() => setActiveTab('INVENTORY')}
                className={`pb-3 px-4 font-extrabold text-sm flex items-center gap-2 border-b-4 transition-colors ${activeTab === 'INVENTORY' ? 'border-yellow-500 text-black' : 'border-transparent text-gray-500'}`}
            >
                <Package size={20} /> LAGERBESTAND
            </button>
            <button 
                onClick={() => setActiveTab('INVOICE')}
                className={`pb-3 px-4 font-extrabold text-sm flex items-center gap-2 border-b-4 transition-colors ${activeTab === 'INVOICE' ? 'border-yellow-500 text-black' : 'border-transparent text-gray-500'}`}
            >
                <FileText size={20} /> RECHNUNG ERSTELLEN
            </button>
        </div>

        {/* --- INVENTORY TAB --- */}
        {activeTab === 'INVENTORY' && (
             <div className="flex-1 flex flex-col overflow-hidden">
                <div className="p-4 bg-white border-b border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4 shrink-0">
                    <div className="relative w-full md:w-auto">
                        <input 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-3 rounded border-2 border-gray-400 text-sm focus:outline-none focus:border-yellow-500 w-full md:w-72 font-bold text-black shadow-sm"
                            placeholder="Teil suchen..."
                        />
                        <Search className="absolute left-3 top-3.5 text-gray-500" size={18} />
                    </div>
                    <div className="flex gap-2 w-full md:w-auto">
                         <button 
                            onClick={handleRestock}
                            className="flex-1 md:flex-none bg-gray-200 text-black border-2 border-gray-300 px-4 py-2 rounded hover:bg-gray-300 font-extrabold text-sm flex items-center justify-center gap-2"
                        >
                            <ShoppingCart size={18} /> BESTELLUNG
                         </button>
                         <button 
                            onClick={() => setIsAddModalOpen(true)}
                            className="flex-1 md:flex-none bg-[#facc15] text-black border-2 border-yellow-600 px-4 py-2 rounded hover:bg-yellow-500 font-extrabold text-sm flex items-center justify-center gap-2 shadow-sm"
                        >
                            <Plus size={18} /> NEUES TEIL
                         </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 min-h-0">
                    <div className="bg-white rounded border-2 border-gray-300 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm whitespace-nowrap">
                                <thead className="bg-gray-200 text-black uppercase text-xs sticky top-0 font-extrabold border-b-2 border-gray-400 z-10">
                                    <tr>
                                        <th className="p-4">Nr.</th>
                                        <th className="p-4">Name</th>
                                        <th className="p-4">Kategorie</th>
                                        <th className="p-4 text-right">Lager</th>
                                        <th className="p-4 text-right">Preis</th>
                                        <th className="p-4"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {filteredParts.map(part => (
                                        <tr key={part.id} className="hover:bg-yellow-50">
                                            <td className="p-4 font-mono font-bold text-gray-600">{part.partNumber}</td>
                                            <td className="p-4 font-extrabold text-black text-base">{part.name}</td>
                                            <td className="p-4"><span className="bg-gray-100 border border-gray-300 px-2 py-1 rounded text-xs font-bold text-gray-800 uppercase">{part.category}</span></td>
                                            <td className={`p-4 text-right font-extrabold text-base ${part.stock < 10 ? 'text-red-600' : 'text-green-700'}`}>{part.stock}</td>
                                            <td className="p-4 text-right font-extrabold text-black text-base">{part.price.toFixed(2)} €</td>
                                            <td className="p-4 text-right">
                                                <button 
                                                    onClick={() => { 
                                                        setActiveTab('INVOICE'); 
                                                        addToInvoice(part); 
                                                    }}
                                                    className="bg-white text-black font-bold text-xs border-2 border-yellow-500 hover:bg-yellow-400 px-3 py-1.5 rounded transition-colors uppercase shadow-sm whitespace-nowrap"
                                                >
                                                    + RECHNUNG
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
             </div>
        )}

        {/* --- INVOICE TAB --- */}
        {activeTab === 'INVOICE' && (
            // Layout Fix: Use overflow-y-auto on main wrapper for mobile/tablet, separate columns for desktop
            <div className="flex-1 flex flex-col xl:flex-row bg-gray-100 min-h-0 overflow-y-auto xl:overflow-hidden">
                
                {/* LEFT SIDE - TOOLS */}
                <div className="w-full xl:w-5/12 flex flex-col gap-4 bg-gray-50 border-r border-gray-300 xl:h-full p-4 shrink-0 overflow-y-visible xl:overflow-y-auto">
                    
                    <h2 className="font-extrabold text-xl mb-2 text-black border-b-2 border-black pb-1">1. Posten hinzufügen</h2>
                    
                    {/* Labor Form */}
                    <div className="bg-white p-4 rounded border-2 border-gray-400 shadow-sm">
                        <h3 className="font-extrabold text-black mb-3 flex items-center gap-2 border-b-2 border-gray-200 pb-2">
                            <Clock size={20} className="text-yellow-600"/> ARBEIT ERFASSEN
                        </h3>
                        <div className="flex flex-col gap-3">
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase">Beschreibung</label>
                                <input 
                                    className="border-2 border-gray-300 p-3 rounded text-sm w-full font-bold focus:border-yellow-500 outline-none text-black" 
                                    placeholder="z.B. Ölwechsel"
                                    value={laborDesc}
                                    onChange={e => setLaborDesc(e.target.value)}
                                />
                            </div>
                            <div className="flex gap-2">
                                <div className="flex-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Std.</label>
                                    <input 
                                        type="number" 
                                        className="border-2 border-gray-300 p-3 rounded text-sm w-full font-extrabold focus:border-yellow-500 outline-none text-black" 
                                        value={laborHours}
                                        onChange={e => setLaborHours(Number(e.target.value))}
                                    />
                                </div>
                                <div className="flex-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase">€/Std</label>
                                    <input 
                                        type="number" 
                                        className="border-2 border-gray-300 p-3 rounded text-sm w-full font-extrabold focus:border-yellow-500 outline-none text-black" 
                                        value={laborRate}
                                        onChange={e => setLaborRate(Number(e.target.value))}
                                    />
                                </div>
                                <button 
                                    onClick={addLabor}
                                    className="bg-black text-white px-4 rounded font-bold hover:bg-gray-800 border-2 border-black mt-4"
                                >
                                    <Plus size={24} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Parts Search & List */}
                    <div className="bg-white rounded border-2 border-gray-400 shadow-sm flex flex-col h-[400px] xl:h-auto xl:flex-1 min-h-[300px]">
                        <div className="p-3 border-b-2 border-gray-200 bg-gray-50 shrink-0">
                             <h3 className="font-extrabold text-black mb-2 flex items-center gap-2">
                                <Wrench size={20} className="text-yellow-600"/> ERSATZTEILE
                             </h3>
                             <div className="relative">
                                <Search className="absolute left-2 top-3 text-gray-500" size={18} />
                                <input 
                                    className="w-full pl-9 pr-2 py-2 border-2 border-gray-300 rounded text-sm focus:border-yellow-500 outline-none font-bold text-black" 
                                    placeholder="Teil suchen..."
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto p-0">
                             {filteredParts.map(part => (
                                <div key={part.id} className="p-3 border-b border-gray-100 flex justify-between items-center hover:bg-yellow-50 cursor-pointer group transition-colors" onClick={() => addToInvoice(part)}>
                                    <div className="flex-1">
                                        <div className="font-extrabold text-sm text-black group-hover:text-yellow-700">{part.name}</div>
                                        <div className="text-xs font-bold text-gray-500 mt-1">{part.partNumber} • <span className="text-black font-extrabold bg-gray-200 px-1 rounded">{part.price.toFixed(2)} €</span></div>
                                    </div>
                                    <button className={`p-2 rounded border-2 shadow-sm transition-all ${lastAddedId === part.id ? 'bg-green-500 border-green-600 text-white' : 'bg-white border-gray-200 group-hover:bg-yellow-400 group-hover:border-yellow-600 text-black'}`}>
                                         {lastAddedId === part.id ? <CheckCircle size={18}/> : <Plus size={18} className="font-bold" />}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* RIGHT SIDE - PREVIEW */}
                <div className="w-full xl:w-7/12 bg-white flex flex-col border-l-4 border-yellow-400 xl:h-full shrink-0 overflow-y-visible xl:overflow-y-hidden shadow-2xl">
                    <h2 className="font-extrabold text-xl p-4 bg-yellow-50 text-black border-b-2 border-yellow-200">2. Rechnungsvorschau</h2>
                    
                    {/* Header Controls */}
                    <div className="p-4 bg-white border-b-2 border-gray-200 shrink-0 space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-[10px] font-bold text-gray-500 uppercase">Kunde</label>
                                <input 
                                    className="w-full border-2 border-gray-300 p-2 rounded text-sm bg-white font-extrabold focus:border-yellow-500 outline-none text-black" 
                                    placeholder="Name eingeben"
                                    value={customerName}
                                    onChange={e => setCustomerName(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-gray-500 uppercase">Fahrzeug</label>
                                <input 
                                    className="w-full border-2 border-gray-300 p-2 rounded text-sm bg-white font-extrabold focus:border-yellow-500 outline-none text-black" 
                                    placeholder="Modell / Kennzeichen"
                                    value={vehicle}
                                    onChange={e => setVehicle(e.target.value)}
                                />
                            </div>
                        </div>
                        
                        <div className="flex gap-2 pt-2">
                             <button 
                                onClick={resetInvoice}
                                className="flex-1 bg-white text-gray-500 border-2 border-gray-300 py-2 rounded text-xs font-bold hover:text-red-500 hover:border-red-500 flex justify-center items-center gap-2"
                            >
                                <RefreshCw size={14} /> NEUE RECHNUNG
                            </button>
                            <button 
                                onClick={() => downloadPDF('pdf-workshop-invoice', 'Werkstatt-Rechnung.pdf')}
                                disabled={invoiceItems.length === 0}
                                className="flex-[2] bg-[#facc15] text-black border-2 border-yellow-600 py-2 rounded text-xs font-extrabold flex items-center justify-center gap-2 hover:bg-yellow-400 disabled:opacity-50 disabled:grayscale"
                            >
                                <FileDown size={16} /> DOWNLOAD PDF
                            </button>
                        </div>
                    </div>
                    
                    {/* Items List */}
                    <div className="flex-1 overflow-y-auto p-0 bg-white min-h-[300px]">
                        {invoiceItems.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-gray-400 p-8 text-center">
                                <div className="bg-gray-100 p-6 rounded-full mb-4">
                                    <ShoppingCart size={48} className="opacity-30 text-black" />
                                </div>
                                <p className="text-lg font-extrabold text-black">Rechnung ist leer</p>
                                <p className="text-sm font-bold text-gray-500 mt-2">
                                    1. Arbeitsschritt oder Teil links auswählen.<br/>
                                    2. Hier prüfen.<br/>
                                    3. Downloaden.
                                </p>
                            </div>
                        ) : (
                            <table className="w-full text-sm">
                                <thead className="bg-gray-100 text-black uppercase text-xs font-extrabold sticky top-0 border-b-2 border-gray-300 z-10 shadow-sm">
                                    <tr>
                                        <th className="text-left py-3 px-4">Pos</th>
                                        <th className="text-right py-3 px-4">Preis</th>
                                        <th className="w-10"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {invoiceItems.map(item => (
                                        <tr key={item.id} className="hover:bg-gray-50 group">
                                            <td className="py-3 px-4">
                                                <div className="font-extrabold text-black text-sm md:text-base">{item.description}</div>
                                                <div className="text-xs font-bold text-gray-500 mt-1 bg-gray-100 inline-block px-1 rounded">
                                                    {item.quantity} x {item.unitPrice.toFixed(2)} €
                                                    {item.type === 'LABOR' && ' (AW)'}
                                                </div>
                                            </td>
                                            <td className="py-3 px-4 text-right font-extrabold text-black text-base">{(item.quantity * item.unitPrice).toFixed(2)} €</td>
                                            <td className="py-3 px-4 text-right">
                                                <button onClick={() => removeFromInvoice(item.id)} className="text-gray-300 hover:text-red-600 p-2 rounded hover:bg-red-50 transition-colors"><Trash2 size={18}/></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="p-4 bg-black text-white shrink-0">
                        <div className="flex justify-between items-center mb-4">
                            <span className="font-bold text-sm md:text-lg text-gray-400 uppercase">Endbetrag:</span>
                            <span className="font-extrabold text-2xl md:text-3xl text-yellow-400">{(calculateTotal() * 1.19).toFixed(2)} €</span>
                        </div>
                        <button 
                            onClick={() => downloadPDF('pdf-workshop-invoice', 'Werkstatt-Rechnung.pdf')}
                            disabled={invoiceItems.length === 0}
                            className="w-full bg-yellow-400 text-black py-4 rounded font-extrabold text-lg flex items-center justify-center gap-3 hover:bg-yellow-300 shadow-lg active:translate-y-0.5 transition-all disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed"
                        >
                            <FileDown size={24} /> RECHNUNG DOWNLOADEN (PDF)
                        </button>
                    </div>
                </div>
            </div>
        )}

        {/* Modal: New Part */}
        {isAddModalOpen && (
            <div className="absolute inset-0 bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                <div className="bg-white w-full max-w-md shadow-2xl rounded p-6 border-t-8 border-yellow-400 animate-in zoom-in-95 duration-200">
                    <div className="flex justify-between items-center mb-6 border-b border-gray-200 pb-2">
                        <h3 className="font-extrabold text-xl text-black uppercase">Neues Teil anlegen</h3>
                        <button onClick={() => setIsAddModalOpen(false)} className="hover:bg-gray-100 p-1 rounded"><X size={24} className="text-black"/></button>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-extrabold text-gray-500 mb-1">TEILENUMMER</label>
                            <input className="w-full border-2 border-gray-300 p-3 rounded font-bold focus:border-yellow-500 outline-none text-black" placeholder="z.B. OP-1234" value={newPart.partNumber} onChange={e => setNewPart({...newPart, partNumber: e.target.value})} />
                        </div>
                        <div>
                             <label className="block text-xs font-extrabold text-gray-500 mb-1">BEZEICHNUNG</label>
                             <input className="w-full border-2 border-gray-300 p-3 rounded font-bold focus:border-yellow-500 outline-none text-black" placeholder="Produktname" value={newPart.name} onChange={e => setNewPart({...newPart, name: e.target.value})} />
                        </div>
                        <div className="flex gap-4">
                             <div className="flex-1">
                                <label className="block text-xs font-extrabold text-gray-500 mb-1">PREIS (€)</label>
                                <input type="number" className="w-full border-2 border-gray-300 p-3 rounded font-bold focus:border-yellow-500 outline-none text-black" placeholder="0.00" value={newPart.price || ''} onChange={e => setNewPart({...newPart, price: Number(e.target.value)})} />
                             </div>
                             <div className="flex-1">
                                <label className="block text-xs font-extrabold text-gray-500 mb-1">BESTAND</label>
                                <input type="number" className="w-full border-2 border-gray-300 p-3 rounded font-bold focus:border-yellow-500 outline-none text-black" placeholder="0" value={newPart.stock || ''} onChange={e => setNewPart({...newPart, stock: Number(e.target.value)})} />
                             </div>
                        </div>
                        <div>
                            <label className="block text-xs font-extrabold text-gray-500 mb-1">KATEGORIE</label>
                            <select className="w-full border-2 border-gray-300 p-3 rounded bg-white font-bold focus:border-yellow-500 outline-none text-black" value={newPart.category} onChange={e => setNewPart({...newPart, category: e.target.value as any})}>
                                <option>MOTOR</option>
                                <option>KAROSSERIE</option>
                                <option>RÄDER</option>
                                <option>INNENRAUM</option>
                            </select>
                        </div>
                        <button onClick={handleAddPart} className="w-full bg-[#facc15] text-black font-extrabold py-3 rounded mt-4 hover:bg-yellow-500 shadow-md text-lg border-2 border-yellow-600">
                            SPEICHERN
                        </button>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};