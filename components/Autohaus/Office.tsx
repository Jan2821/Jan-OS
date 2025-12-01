import React, { useState } from 'react';
import { AutohausUser } from '../../types';
import { Mail, Users, Trash2, Send, Plus, ArrowLeft, UserPlus } from 'lucide-react';

interface Email {
    id: number;
    from: string;
    subject: string;
    content: string;
    time: string;
    unread: boolean;
}

export const Office: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'EMAIL' | 'USERS'>('EMAIL');
  const [viewState, setViewState] = useState<'LIST' | 'READ' | 'COMPOSE'>('LIST');
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);

  // Email State
  const [emails, setEmails] = useState<Email[]>([
    { id: 1, from: 'Opel Zentrale', subject: 'Neue Konditionen Astra K', content: 'Sehr geehrte Partner,\n\nab sofort gelten neue Einkaufskonditionen für den Astra K. Bitte beachten Sie die angehängte Preisliste.\n\nMit freundlichen Grüßen\nOpel Vertrieb', time: '09:15', unread: true },
    { id: 2, from: 'Müller, Klaus', subject: 'Anfrage Probefahrt Corsa', content: 'Guten Tag,\n\nich würde gerne den neuen Corsa-e am kommenden Samstag probefahren. Ist das möglich?\n\nLG Klaus Müller', time: 'Gestern', unread: false },
    { id: 3, from: 'Teile-Express', subject: 'Rechnung #9921', content: 'Ihre Bestellung wurde versandt. Anbei die Rechnung.', time: 'Gestern', unread: false },
  ]);

  // Compose State
  const [composeTo, setComposeTo] = useState('');
  const [composeSubject, setComposeSubject] = useState('');
  const [composeBody, setComposeBody] = useState('');

  const users: AutohausUser[] = [
    { id: '1', name: 'Hans Radtke', role: 'ADMIN' },
    { id: '2', name: 'Martina Muster', role: 'VERKÄUFER' },
    { id: '3', name: 'Peter Schrauber', role: 'WERKSTATT' },
  ];

  const handleReadEmail = (mail: Email) => {
    setSelectedEmail(mail);
    setViewState('READ');
    // Mark as read
    setEmails(emails.map(e => e.id === mail.id ? { ...e, unread: false } : e));
  };

  const handleSendEmail = () => {
    if(!composeTo || !composeSubject) return;
    
    alert(`E-Mail an ${composeTo} wurde gesendet!`);
    setComposeTo('');
    setComposeSubject('');
    setComposeBody('');
    setViewState('LIST');
  };

  return (
    <div className="h-full flex flex-col bg-gray-50 overflow-hidden">
        {/* Top Navigation */}
        <div className="bg-white border-b border-gray-200 flex p-4 gap-6 shrink-0 shadow-sm">
            <button 
                onClick={() => setActiveTab('EMAIL')}
                className={`flex items-center gap-2 pb-2 text-sm font-bold border-b-2 transition-colors ${activeTab === 'EMAIL' ? 'border-yellow-500 text-black' : 'border-transparent text-gray-500'}`}
            >
                <Mail size={18} /> E-Mail Postfach
            </button>
            <button 
                onClick={() => setActiveTab('USERS')}
                className={`flex items-center gap-2 pb-2 text-sm font-bold border-b-2 transition-colors ${activeTab === 'USERS' ? 'border-yellow-500 text-black' : 'border-transparent text-gray-500'}`}
            >
                <Users size={18} /> Personal
            </button>
        </div>

        <div className="flex-1 p-6 overflow-hidden flex flex-col min-h-0">
            {/* --- EMAIL TAB --- */}
            {activeTab === 'EMAIL' && (
                <div className="bg-white border border-gray-200 rounded shadow-sm flex flex-col h-full overflow-hidden">
                    
                    {/* View: LIST */}
                    {viewState === 'LIST' && (
                        <>
                            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 shrink-0">
                                <h3 className="font-bold text-gray-700">Posteingang ({emails.filter(e => e.unread).length})</h3>
                                <button 
                                    onClick={() => setViewState('COMPOSE')}
                                    className="bg-black text-white px-3 py-1.5 rounded text-xs font-bold hover:bg-gray-800 flex items-center gap-2"
                                >
                                    <Plus size={14}/> NEUE MAIL
                                </button>
                            </div>
                            <div className="flex-1 overflow-y-auto">
                                {emails.map(mail => (
                                    <div 
                                        key={mail.id} 
                                        onClick={() => handleReadEmail(mail)}
                                        className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-yellow-50 transition-colors flex justify-between items-start ${mail.unread ? 'bg-yellow-50/50' : ''}`}
                                    >
                                        <div className="flex-1 min-w-0 pr-4">
                                            <div className="flex items-center gap-2 mb-1">
                                                {mail.unread && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                                                <span className={`text-sm truncate ${mail.unread ? 'font-bold text-black' : 'text-gray-700'}`}>{mail.from}</span>
                                            </div>
                                            <div className={`text-sm truncate mb-1 ${mail.unread ? 'font-bold text-black' : 'text-gray-600'}`}>{mail.subject}</div>
                                            <div className="text-xs text-gray-400 truncate">{mail.content}</div>
                                        </div>
                                        <span className="text-xs text-gray-400 whitespace-nowrap">{mail.time}</span>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

                    {/* View: READ */}
                    {viewState === 'READ' && selectedEmail && (
                        <div className="flex flex-col h-full">
                            <div className="p-4 border-b border-gray-200 flex items-center gap-4 bg-gray-50 shrink-0">
                                <button onClick={() => setViewState('LIST')} className="text-gray-500 hover:text-black">
                                    <ArrowLeft size={20} />
                                </button>
                                <div className="flex-1">
                                    <h3 className="font-bold text-lg leading-tight">{selectedEmail.subject}</h3>
                                    <div className="text-xs text-gray-500 mt-1">Von: <strong>{selectedEmail.from}</strong> am {selectedEmail.time}</div>
                                </div>
                                <button className="text-gray-400 hover:text-red-500"><Trash2 size={18}/></button>
                            </div>
                            <div className="flex-1 p-6 overflow-y-auto whitespace-pre-wrap font-sans text-sm leading-relaxed text-gray-800">
                                {selectedEmail.content}
                            </div>
                        </div>
                    )}

                    {/* View: COMPOSE */}
                    {viewState === 'COMPOSE' && (
                        <div className="flex flex-col h-full">
                            <div className="p-4 border-b border-gray-200 flex items-center gap-4 bg-gray-50 shrink-0">
                                <button onClick={() => setViewState('LIST')} className="text-gray-500 hover:text-black">
                                    <ArrowLeft size={20} />
                                </button>
                                <h3 className="font-bold">Neue Nachricht verfassen</h3>
                            </div>
                            <div className="flex-1 p-6 overflow-y-auto space-y-4">
                                <input 
                                    className="w-full border border-gray-300 p-2 rounded text-sm focus:border-yellow-500 outline-none"
                                    placeholder="Empfänger"
                                    value={composeTo}
                                    onChange={e => setComposeTo(e.target.value)}
                                />
                                <input 
                                    className="w-full border border-gray-300 p-2 rounded text-sm focus:border-yellow-500 outline-none"
                                    placeholder="Betreff"
                                    value={composeSubject}
                                    onChange={e => setComposeSubject(e.target.value)}
                                />
                                <textarea 
                                    className="w-full border border-gray-300 p-2 rounded text-sm focus:border-yellow-500 outline-none h-64 resize-none"
                                    placeholder="Nachricht..."
                                    value={composeBody}
                                    onChange={e => setComposeBody(e.target.value)}
                                />
                            </div>
                            <div className="p-4 border-t border-gray-200 flex justify-end">
                                <button 
                                    onClick={handleSendEmail}
                                    className="bg-[#facc15] text-black px-6 py-2 rounded font-bold hover:bg-yellow-500 flex items-center gap-2"
                                >
                                    <Send size={16} /> SENDEN
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* --- USERS TAB --- */}
            {activeTab === 'USERS' && (
                <div className="h-full overflow-y-auto space-y-6 min-h-0">
                    <div className="bg-white border border-gray-200 rounded shadow-sm p-6">
                        <h3 className="font-bold text-lg mb-4">Mitarbeiterliste</h3>
                        <div className="space-y-2">
                            {users.map(u => (
                                <div key={u.id} className="flex items-center justify-between p-3 bg-gray-50 rounded border border-gray-100 hover:bg-gray-100 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-600 text-sm">
                                            {u.name.substring(0,2).toUpperCase()}
                                        </div>
                                        <div>
                                            <div className="font-bold text-sm text-gray-900">{u.name}</div>
                                            <div className="text-xs text-yellow-600 font-bold">{u.role}</div>
                                        </div>
                                    </div>
                                    <button className="text-gray-400 hover:text-red-500 p-2">
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-yellow-50 border border-yellow-200 rounded p-6 shadow-sm">
                        <h3 className="font-bold text-lg mb-4 text-yellow-900 flex items-center gap-2">
                            <UserPlus size={20} /> Neuen Mitarbeiter anlegen
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input className="border border-gray-300 p-2 rounded text-sm focus:border-yellow-500 outline-none" placeholder="Name" />
                            <select className="border border-gray-300 p-2 rounded text-sm bg-white focus:border-yellow-500 outline-none">
                                <option>VERKÄUFER</option>
                                <option>WERKSTATT</option>
                                <option>ADMIN</option>
                            </select>
                            <button className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 rounded text-sm md:col-span-2 shadow-sm transition-colors">
                                SPEICHERN
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    </div>
  );
};