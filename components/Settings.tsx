import React, { useState } from 'react';
import { User } from '../types';
import { Trash2, UserPlus, Shield, Save } from 'lucide-react';

export const Settings: React.FC = () => {
  const [users, setUsers] = useState<User[]>([
    { id: '1', name: 'Max Müller', rank: 'Polizeikommissar', badgeNumber: 'PK-4421', role: 'ADMIN' },
    { id: '2', name: 'Sarah Schmidt', rank: 'Polizeimeisterin', badgeNumber: 'PM-9921', role: 'OFFICER' },
  ]);

  const [newUser, setNewUser] = useState<Partial<User>>({
    name: '', rank: '', badgeNumber: '', role: 'OFFICER'
  });

  const handleAddUser = () => {
    if (newUser.name && newUser.badgeNumber) {
        setUsers([...users, { ...newUser, id: Math.random().toString() } as User]);
        setNewUser({ name: '', rank: '', badgeNumber: '', role: 'OFFICER' });
    }
  };

  const handleDeleteUser = (id: string) => {
    setUsers(users.filter(u => u.id !== id));
  };

  return (
    <div className="flex flex-col h-full bg-police-900 text-police-100 p-4 overflow-y-auto">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2 border-b border-police-700 pb-2 shrink-0">
            <Shield className="text-police-accent" /> EINSTELLUNGEN
        </h2>

        {/* Responsive Grid: Stacks on small screens/tablets, 2 columns on large screens */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 pb-20">
            {/* User List */}
            <div className="bg-police-800 border border-police-700 p-4 flex flex-col h-auto min-h-[300px]">
                <h3 className="font-bold text-police-accent mb-4 text-sm uppercase">Benutzerverwaltung</h3>
                <div className="space-y-2">
                    {users.map(user => (
                        <div key={user.id} className="bg-police-900 p-3 border border-police-700 flex justify-between items-center">
                            <div>
                                <div className="font-bold text-white">{user.name}</div>
                                <div className="text-xs text-gray-400">{user.rank} | {user.badgeNumber}</div>
                            </div>
                            <button 
                                onClick={() => handleDeleteUser(user.id)}
                                className="text-red-500 hover:text-red-400 p-2"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Add User & General Settings */}
            <div className="flex flex-col gap-4">
                <div className="bg-police-800 border border-police-700 p-4">
                    <h3 className="font-bold text-police-accent mb-4 text-sm uppercase">Neuen Benutzer anlegen</h3>
                    <div className="space-y-3">
                        <div>
                            <label className="text-xs text-gray-400 block mb-1">NAME</label>
                            <input 
                                className="w-full bg-police-900 border border-police-700 p-2 text-white"
                                value={newUser.name}
                                onChange={e => setNewUser({...newUser, name: e.target.value})}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="text-xs text-gray-400 block mb-1">DIENSTGRAD</label>
                                <input 
                                    className="w-full bg-police-900 border border-police-700 p-2 text-white"
                                    value={newUser.rank}
                                    onChange={e => setNewUser({...newUser, rank: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="text-xs text-gray-400 block mb-1">DIENSTNUMMER</label>
                                <input 
                                    className="w-full bg-police-900 border border-police-700 p-2 text-white"
                                    value={newUser.badgeNumber}
                                    onChange={e => setNewUser({...newUser, badgeNumber: e.target.value})}
                                />
                            </div>
                        </div>
                        <button 
                            onClick={handleAddUser}
                            className="w-full bg-police-accent text-white py-2 font-bold flex items-center justify-center gap-2 hover:bg-blue-600 mt-2"
                        >
                            <UserPlus size={16} /> NUTZER SPEICHERN
                        </button>
                    </div>
                </div>

                <div className="bg-police-800 border border-police-700 p-4">
                     <h3 className="font-bold text-police-accent mb-4 text-sm uppercase">Drucker Konfiguration</h3>
                     <div className="text-xs text-gray-400 mb-4">
                        Standard-Drucker: <strong>SYSTEM-DEFAULT</strong><br/>
                        Treiber: GENERIC / TEXT ONLY<br/>
                        Status: <span className="text-green-500">BEREIT</span>
                     </div>
                     <button className="w-full border border-gray-600 text-gray-400 py-2 text-xs hover:border-white hover:text-white">
                        TESTSEITE DRUCKEN
                     </button>
                </div>
            </div>
        </div>
    </div>
  );
};