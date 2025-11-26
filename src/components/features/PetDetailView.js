import React, { useState } from 'react';
import { ChevronLeft, Edit, Stethoscope, Activity, AlertTriangle, Calendar, ChevronUp, Eye, Trash2 } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { TagInput } from '../ui/TagInput';
import { Modal } from '../ui/Modal';
import { formatCurrency } from '../../utils/format';

export const PetDetailView = ({ pet, onBack, role, onStartConsultation, onUpdatePet }) => {
    const [activeTab, setActiveTab] = useState('overview');
    const [editMode, setEditMode] = useState(null);
    const [editingItem, setEditingItem] = useState(null);
    const [tempData, setTempData] = useState(null);
    const [expandedHistoryId, setExpandedHistoryId] = useState(null);

    const openEditBasic = () => { setTempData({ ...pet }); setEditMode('basic'); };
    const saveBasic = () => { onUpdatePet(tempData); setEditMode(null); };
    const openEditVaccine = (vac) => { setEditingItem(vac); setEditMode('vaccine'); };
    const saveVaccine = () => { onUpdatePet({ ...pet, vaccines: pet.vaccines.map(v => v.id === editingItem.id ? editingItem : v) }); setEditMode(null); };
    const deleteVaccine = (id) => { if (confirm('¿Borrar?')) onUpdatePet({ ...pet, vaccines: pet.vaccines.filter(v => v.id !== id) }); };
    const openEditHistory = (h) => { setEditingItem(h); setEditMode('history'); };
    const saveHistory = () => { onUpdatePet({ ...pet, history: pet.history.map(h => h.id === editingItem.id ? editingItem : h) }); setEditMode(null); };
    const deleteHistory = (id) => { if (confirm('¿Borrar?')) onUpdatePet({ ...pet, history: pet.history.filter(h => h.id !== id) }); };
    const toggleExpand = (id) => { setExpandedHistoryId(expandedHistoryId === id ? null : id); };

    return (
        <div className="bg-slate-50 min-h-full pb-20 animate-fade-in">
            {editMode === 'basic' && (
                <Modal title="Editar Ficha" onClose={() => setEditMode(null)} onSave={saveBasic}>
                    <div className="space-y-4">
                        <div><label className="text-sm font-bold">Nombre</label><input value={tempData.name} onChange={e => setTempData({ ...tempData, name: e.target.value })} className="w-full p-2 border rounded" /></div>
                        <div className="grid grid-cols-2 gap-4">
                            <div><label className="text-sm font-bold">Peso</label><input type="number" value={tempData.weight} onChange={e => setTempData({ ...tempData, weight: parseFloat(e.target.value) })} className="w-full p-2 border rounded" /></div>
                            <div><label className="text-sm font-bold">Chip</label><input value={tempData.chipId} onChange={e => setTempData({ ...tempData, chipId: e.target.value })} className="w-full p-2 border rounded" /></div>
                        </div>
                        <div><label className="text-sm font-bold">Dirección</label><input value={tempData.address} onChange={e => setTempData({ ...tempData, address: e.target.value })} className="w-full p-2 border rounded" /></div>
                        <div><label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Alertas (Enter)</label><TagInput tags={tempData.alerts} onChange={t => setTempData({ ...tempData, alerts: t })} placeholder="Ej: Muerde..." color="yellow" /></div>
                        <div><label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Alergias (Enter)</label><TagInput tags={tempData.allergies} onChange={t => setTempData({ ...tempData, allergies: t })} placeholder="Ej: Pollo..." color="red" /></div>
                        <div className="flex items-center gap-2 pt-2"><input type="checkbox" checked={tempData.sterilized} onChange={e => setTempData({ ...tempData, sterilized: e.target.checked })} id="ster" /><label htmlFor="ster" className="text-sm font-bold">Esterilizado</label></div>
                    </div>
                </Modal>
            )}
            {editMode === 'vaccine' && (
                <Modal title="Editar Vacuna" onClose={() => setEditMode(null)} onSave={saveVaccine}>
                    <div className="space-y-4">
                        <div><label className="text-sm font-bold">Vacuna</label><input value={editingItem.name} onChange={e => setEditingItem({ ...editingItem, name: e.target.value })} className="w-full p-2 border rounded" /></div>
                        <div className="grid grid-cols-2 gap-4">
                            <div><label className="text-sm font-bold">Fecha</label><input type="date" value={editingItem.date} onChange={e => setEditingItem({ ...editingItem, date: e.target.value })} className="w-full p-2 border rounded" /></div>
                            <div><label className="text-sm font-bold">Próxima</label><input type="date" value={editingItem.nextDue} onChange={e => setEditingItem({ ...editingItem, nextDue: e.target.value })} className="w-full p-2 border rounded" /></div>
                        </div>
                    </div>
                </Modal>
            )}
            {editMode === 'history' && (
                <Modal title="Editar Historial" onClose={() => setEditMode(null)} onSave={saveHistory}>
                    <div className="space-y-4">
                        <div><label className="text-sm font-bold">Motivo</label><input value={editingItem.reason} onChange={e => setEditingItem({ ...editingItem, reason: e.target.value })} className="w-full p-2 border rounded font-bold" /></div>
                        <div><label className="text-sm font-bold">Diagnóstico</label><textarea value={editingItem.diagnosis} onChange={e => setEditingItem({ ...editingItem, diagnosis: e.target.value })} className="w-full p-2 border rounded h-24" /></div>
                        <div><label className="text-sm font-bold">Tratamiento</label><textarea value={editingItem.treatment} onChange={e => setEditingItem({ ...editingItem, treatment: e.target.value })} className="w-full p-2 border rounded h-24" /></div>
                    </div>
                </Modal>
            )}

            <div className="bg-white shadow-sm border-b p-4 sticky top-0 z-10">
                <button onClick={onBack} className="flex items-center text-slate-500 mb-4 hover:text-slate-800 transition-colors"><ChevronLeft className="w-4 h-4" /> Volver</button>
                <div className="flex gap-4">
                    <div className="text-6xl bg-slate-100 p-4 rounded-2xl shadow-inner border border-slate-200">{pet.image}</div>
                    <div className="flex-1">
                        <div className="flex justify-between items-start">
                            <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-2">{pet.name} {role === 'vet' && <button onClick={openEditBasic} className="text-slate-300 hover:text-teal-600 transition-colors"><Edit className="w-4 h-4" /></button>}</h1>
                            {role === 'vet' && <button onClick={() => onStartConsultation(pet)} className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg text-sm font-bold flex gap-2 shadow-lg shadow-teal-200 transition-transform hover:scale-105"><Stethoscope className="w-5 h-5" /> Consulta</button>}
                        </div>
                        <p className="text-slate-500 font-medium">{pet.breed} • Dueño: {pet.ownerName}</p>
                        <div className="flex flex-wrap gap-2 mt-3">
                            {pet.sterilized && <Badge color="green">Esterilizado</Badge>}
                            {pet.allergies.map((a, i) => <Badge key={i} color="red">{a}</Badge>)}
                            {pet.alerts.map((a, i) => <Badge key={i} color="yellow">{a}</Badge>)}
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex border-b bg-white px-4 mt-2">
                {['overview', 'history', 'vaccines'].map(t => (
                    <button key={t} onClick={() => setActiveTab(t)} className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === t ? 'border-teal-600 text-teal-700' : 'border-transparent text-slate-400 hover:text-slate-600'}`}>
                        {t === 'overview' ? 'Resumen' : t === 'history' ? 'Historial' : 'Vacunas'}
                    </button>
                ))}
            </div>

            <div className="p-6 max-w-4xl mx-auto">
                {activeTab === 'overview' && (
                    <div className="grid md:grid-cols-2 gap-6 animate-fade-in">
                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                            <h3 className="font-bold mb-4 flex items-center gap-2 text-slate-700"><Activity className="w-5 h-5 text-teal-600" /> Signos Vitales</h3>
                            <div className="flex justify-between py-2 border-b border-slate-50"><span>Peso Actual</span><span className="font-bold">{pet.weight} kg</span></div>
                            <div className="flex justify-between py-2 border-b border-slate-50"><span>Chip ID</span><span className="font-mono text-slate-600">{pet.chipId || 'No registrado'}</span></div>
                            <div className="flex justify-between py-2 border-b border-slate-50"><span>Dirección</span><span className="font-bold text-right w-1/2 truncate">{pet.address || 'No registrada'}</span></div>
                            <div className="flex justify-between py-2"><span>Último Control</span><span>{pet.lastCheckup}</span></div>
                        </div>
                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                            <h3 className="font-bold mb-4 flex items-center gap-2 text-slate-700"><AlertTriangle className="w-5 h-5 text-amber-500" /> Notas Importantes</h3>
                            <ul className="list-disc pl-5 text-slate-600 text-sm space-y-2">
                                {pet.alerts.length > 0 ? pet.alerts.map(a => <li key={a}>{a}</li>) : <li>Sin alertas especiales.</li>}
                                {pet.allergies.length > 0 ? pet.allergies.map(a => <li key={a} className="text-red-600">Alérgico a: {a}</li>) : <li>Sin alergias conocidas.</li>}
                            </ul>
                        </div>
                    </div>
                )}

                {activeTab === 'history' && (
                    <div className="space-y-4 animate-fade-in">
                        {pet.history.length === 0 && <div className="text-center text-slate-400 py-10 border-2 border-dashed rounded-xl">No hay historial registrado.</div>}
                        {pet.history.map(h => {
                            const isExpanded = expandedHistoryId === h.id;
                            return (
                                <div key={h.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative group hover:border-teal-200 transition-colors">
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-teal-500 rounded-l-xl"></div>
                                    <div className="flex justify-between mb-2">
                                        <div><span className="font-bold text-lg text-slate-800">{h.reason}</span><p className="text-xs text-slate-400 mt-1">Dr. {h.vetName || 'N/A'}</p></div>
                                        <div className="flex flex-col items-end gap-2">
                                            <span className="text-xs text-slate-500 font-medium bg-slate-100 px-2 py-1 rounded flex items-center gap-1"><Calendar className="w-3 h-3" /> {h.date}</span>
                                            {role === 'vet' && (
                                                <button onClick={() => toggleExpand(h.id)} className="text-teal-600 text-xs flex items-center gap-1 hover:underline">{isExpanded ? <><ChevronUp className="w-3 h-3" /> Menos</> : <><Eye className="w-3 h-3" /> Ver Detalles</>}</button>
                                            )}
                                        </div>
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-4 mt-3">
                                        <div><span className="text-xs font-bold text-slate-500 uppercase">Diagnóstico</span><p className="text-sm text-slate-700 mt-1">{h.diagnosis}</p></div>
                                        <div><span className="text-xs font-bold text-slate-500 uppercase">Tratamiento</span><p className="text-sm text-slate-700 mt-1">{h.treatment}</p></div>
                                    </div>
                                    {isExpanded && (
                                        <div className="mt-4 pt-4 border-t border-slate-100 animate-fade-in bg-slate-50 p-3 rounded-lg">
                                            <h4 className="font-bold text-xs uppercase text-slate-500 mb-2">Detalles Completos</h4>
                                            <div className="grid grid-cols-1 gap-2 text-sm"><p><strong>Costo Total:</strong> {formatCurrency(h.cost)}</p></div>
                                        </div>
                                    )}
                                    {role === 'vet' && (
                                        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white pl-2">
                                            <button onClick={() => openEditHistory(h)} className="text-slate-400 hover:text-blue-500 p-1 hover:bg-blue-50 rounded"><Edit className="w-4 h-4" /></button>
                                            <button onClick={() => deleteHistory(h.id)} className="text-slate-400 hover:text-red-500 p-1 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                )}

                {activeTab === 'vaccines' && (
                    <div className="space-y-2 animate-fade-in">
                        {pet.vaccines.length === 0 && <div className="text-center text-slate-400 py-10 border-2 border-dashed rounded-xl">No hay vacunas registradas.</div>}
                        {pet.vaccines.map(v => (
                            <div key={v.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex justify-between items-center group hover:border-teal-200 transition-colors">
                                <div>
                                    <p className="font-bold text-slate-800">{v.name}</p>
                                    <div className="flex gap-4 text-xs text-slate-500 mt-1"><span>Puesta: {v.date}</span><span className={new Date(v.nextDue) < new Date() ? "text-red-500 font-bold" : "text-green-600 font-bold"}>Próxima: {v.nextDue}</span></div>
                                </div>
                                {role === 'vet' && (
                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => openEditVaccine(v)} className="text-slate-400 hover:text-blue-500 p-2 hover:bg-blue-50 rounded"><Edit className="w-4 h-4" /></button>
                                        <button onClick={() => deleteVaccine(v.id)} className="text-slate-400 hover:text-red-500 p-2 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
