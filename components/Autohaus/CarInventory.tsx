import React, { useState } from 'react';
import { Car } from '../../types';
import { Search, Plus, CarFront, Trash2, X, Save } from 'lucide-react';

export const CarInventory: React.FC = () => {
  const [cars, setCars] = useState<Car[]>([
    { id: '1', model: 'Opel Astra', year: 2022, color: 'Silber', price: 24500, mileage: 15000, vin: 'W0Lxxxx', status: 'AVAILABLE' },
    { id: '2', model: 'Opel Corsa-e', year: 2023, color: 'Orange', price: 29900, mileage: 500, vin: 'W0Lxxxx', status: 'AVAILABLE' },
    { id: '3', model: 'Opel Mokka', year: 2021, color: 'Grün', price: 21000, mileage: 32000, vin: 'W0Lxxxx', status: 'SOLD' },
    { id: '4', model: 'Opel Insignia', year: 2020, color: 'Schwarz', price: 18500, mileage: 65000, vin: 'W0Lxxxx', status: 'MAINTENANCE' },
    { id: '5', model: 'Opel Zafira Life', year: 2022, color: 'Weiß', price: 45000, mileage: 12000, vin: 'W0Lxxxx', status: 'AVAILABLE' },
  ]);

  const [filter, setFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCar, setNewCar] = useState<Partial<Car>>({
    model: '', year: new Date().getFullYear(), color: '', price: 0, mileage: 0, vin: '', status: 'AVAILABLE'
  });

  const filteredCars = cars.filter(c => c.model.toLowerCase().includes(filter.toLowerCase()));

  const handleDelete = (id: string) => {
    setCars(cars.filter(c => c.id !== id));
  };

  const handleAddCar = () => {
    if (newCar.model && newCar.price) {
        const carToAdd: Car = {
            id: Math.random().toString(36).substr(2, 9),
            model: newCar.model || 'Unbekannt',
            year: newCar.year || 2024,
            color: newCar.color || 'Weiß',
            price: newCar.price || 0,
            mileage: newCar.mileage || 0,
            vin: newCar.vin || 'W0L...',
            status: newCar.status as any || 'AVAILABLE'
        };
        setCars([carToAdd, ...cars]);
        setIsModalOpen(false);
        setNewCar({ model: '', year: new Date().getFullYear(), color: '', price: 0, mileage: 0, vin: '', status: 'AVAILABLE' });
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
        case 'AVAILABLE': return 'bg-green-100 text-green-800 border-green-200';
        case 'SOLD': return 'bg-red-100 text-red-800 border-red-200';
        case 'MAINTENANCE': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        default: return 'bg-gray-100';
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-50 overflow-hidden relative">
        {/* Toolbar */}
        <div className="bg-white p-4 border-b border-gray-200 flex justify-between items-center shrink-0 shadow-sm z-10">
            <div className="flex items-center gap-2 text-gray-700">
                <CarFront size={20} />
                <h2 className="font-bold text-lg hidden sm:block">Fahrzeugbestand</h2>
            </div>
            <div className="flex gap-2">
                <div className="relative">
                    <Search className="absolute left-2 top-2.5 text-gray-400" size={16} />
                    <input 
                        className="pl-8 pr-4 py-2 border border-gray-300 rounded-sm text-sm focus:outline-none focus:border-yellow-500 w-32 sm:w-auto"
                        placeholder="Suchen..."
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    />
                </div>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="bg-[#facc15] text-black font-bold px-4 py-2 rounded-sm text-sm hover:bg-yellow-500 flex items-center gap-2"
                >
                    <Plus size={16} /> <span className="hidden sm:inline">NEUZUGANG</span>
                </button>
            </div>
        </div>

        {/* List - min-h-0 is crucial for nested flex scrolling */}
        <div className="flex-1 overflow-y-auto p-4 min-h-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-24">
                {filteredCars.map(car => (
                    <div key={car.id} className="bg-white border border-gray-200 rounded-sm shadow-sm hover:shadow-md transition-shadow p-4 flex flex-col h-full">
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="font-bold text-lg">{car.model}</h3>
                            <span className={`px-2 py-0.5 text-[10px] font-bold rounded border ${getStatusColor(car.status)}`}>
                                {car.status === 'AVAILABLE' ? 'VERFÜGBAR' : car.status === 'SOLD' ? 'VERKAUFT' : 'WERKSTATT'}
                            </span>
                        </div>
                        
                        <div className="text-sm text-gray-600 space-y-1 flex-1 mb-4">
                            <div className="flex justify-between border-b border-gray-100 py-1">
                                <span>Baujahr:</span>
                                <span className="font-medium">{car.year}</span>
                            </div>
                            <div className="flex justify-between border-b border-gray-100 py-1">
                                <span>Farbe:</span>
                                <span className="font-medium">{car.color}</span>
                            </div>
                            <div className="flex justify-between border-b border-gray-100 py-1">
                                <span>Kilometer:</span>
                                <span className="font-medium">{car.mileage.toLocaleString()} km</span>
                            </div>
                            <div className="flex justify-between border-b border-gray-100 py-1">
                                <span>VIN:</span>
                                <span className="font-mono text-xs">{car.vin}</span>
                            </div>
                        </div>

                        <div className="flex justify-between items-center mt-auto pt-2 border-t border-gray-100">
                            <div className="text-xl font-bold text-gray-800">{car.price.toLocaleString()} €</div>
                            <button 
                                onClick={() => handleDelete(car.id)}
                                className="text-gray-400 hover:text-red-500 p-2"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* Add Car Modal */}
        {isModalOpen && (
            <div className="absolute inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                <div className="bg-white w-full max-w-lg shadow-2xl rounded-sm flex flex-col max-h-[90%] overflow-hidden animate-in fade-in zoom-in duration-200">
                    <div className="bg-[#facc15] p-4 flex justify-between items-center shrink-0">
                        <h3 className="font-bold text-lg text-black flex items-center gap-2">
                            <Plus size={20} /> NEUES FAHRZEUG
                        </h3>
                        <button onClick={() => setIsModalOpen(false)} className="text-black hover:bg-yellow-500 rounded p-1">
                            <X size={20} />
                        </button>
                    </div>
                    
                    <div className="p-6 overflow-y-auto space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1">MODELL</label>
                            <input 
                                className="w-full border border-gray-300 p-2 rounded text-sm focus:border-yellow-500 outline-none"
                                value={newCar.model}
                                onChange={e => setNewCar({...newCar, model: e.target.value})}
                                placeholder="z.B. Opel Astra K"
                                autoFocus
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">BAUJAHR</label>
                                <input 
                                    type="number"
                                    className="w-full border border-gray-300 p-2 rounded text-sm focus:border-yellow-500 outline-none"
                                    value={newCar.year}
                                    onChange={e => setNewCar({...newCar, year: Number(e.target.value)})}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">FARBE</label>
                                <input 
                                    className="w-full border border-gray-300 p-2 rounded text-sm focus:border-yellow-500 outline-none"
                                    value={newCar.color}
                                    onChange={e => setNewCar({...newCar, color: e.target.value})}
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">PREIS (€)</label>
                                <input 
                                    type="number"
                                    className="w-full border border-gray-300 p-2 rounded text-sm focus:border-yellow-500 outline-none font-bold"
                                    value={newCar.price}
                                    onChange={e => setNewCar({...newCar, price: Number(e.target.value)})}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">LAUFLEISTUNG (KM)</label>
                                <input 
                                    type="number"
                                    className="w-full border border-gray-300 p-2 rounded text-sm focus:border-yellow-500 outline-none"
                                    value={newCar.mileage}
                                    onChange={e => setNewCar({...newCar, mileage: Number(e.target.value)})}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1">VIN (FAHRGESTELLNR.)</label>
                            <input 
                                className="w-full border border-gray-300 p-2 rounded text-sm focus:border-yellow-500 outline-none uppercase font-mono"
                                value={newCar.vin}
                                onChange={e => setNewCar({...newCar, vin: e.target.value})}
                                placeholder="W0L..."
                            />
                        </div>
                         <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1">STATUS</label>
                            <select 
                                className="w-full border border-gray-300 p-2 rounded text-sm focus:border-yellow-500 outline-none bg-white"
                                value={newCar.status}
                                onChange={e => setNewCar({...newCar, status: e.target.value as any})}
                            >
                                <option value="AVAILABLE">VERFÜGBAR</option>
                                <option value="SOLD">VERKAUFT</option>
                                <option value="MAINTENANCE">WERKSTATT</option>
                            </select>
                        </div>
                    </div>

                    <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-2 shrink-0">
                        <button 
                            onClick={() => setIsModalOpen(false)}
                            className="px-4 py-2 border border-gray-300 rounded text-sm font-bold text-gray-600 hover:bg-gray-100"
                        >
                            ABBRECHEN
                        </button>
                        <button 
                            onClick={handleAddCar}
                            className="px-6 py-2 bg-black text-white rounded text-sm font-bold hover:bg-gray-800 flex items-center gap-2"
                        >
                            <Save size={16} /> SPEICHERN
                        </button>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};