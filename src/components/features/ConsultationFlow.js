import React, { useState } from 'react';
import { X, Clipboard, DollarSign, CheckCircle, ChevronLeft, QrCode } from 'lucide-react';
import { SERVICES_CATALOG } from '../../data/mocks';
import { formatCurrency } from '../../utils/format';

export const ConsultationFlow = ({ pet, onFinish, onCancel }) => {
    const [step, setStep] = useState('medical');
    const [notes, setNotes] = useState({ subjective: '', objective: '', assessment: '', plan: '' });
    const [cart, setCart] = useState([SERVICES_CATALOG[0]]);

    const total = cart.reduce((acc, item) => acc + item.price, 0);
    const deposit = 20000;
    const toPay = total - deposit;
    const toggleService = (srv) => { if (cart.find(s => s.id === srv.id)) setCart(cart.filter(s => s.id !== srv.id)); else setCart([...cart, srv]); };

    if (step === 'medical') return (
        <div className="fixed inset-0 bg-slate-50 z-50 flex flex-col animate-fade-in">
            <div className="bg-slate-900 text-white p-4 flex justify-between items-center shadow-md">
                <div className="flex items-center gap-3"><button onClick={onCancel} className="text-slate-400 hover:text-white"><X /></button><h2 className="font-bold">Consulta: {pet.name}</h2></div>
                <div className="text-right"><p className="text-xs text-slate-400">Total</p><p className="font-bold text-teal-400">{formatCurrency(total)}</p></div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 grid lg:grid-cols-3 gap-6 max-w-7xl mx-auto w-full">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <div className="flex justify-between items-center mb-4 border-b pb-2">
                            <h3 className="font-bold flex items-center gap-2"><Clipboard className="w-5 h-5 text-teal-600" /> Notas Clínicas (SOAP)</h3>
                        </div>
                        <div className="space-y-4">
                            <div><label className="block font-bold text-sm mb-1 text-slate-700">Anamnesis (S)</label><textarea className="w-full p-3 border rounded-lg h-24" value={notes.subjective} onChange={e => setNotes({ ...notes, subjective: e.target.value })} /></div>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div><label className="block font-bold text-sm mb-1 text-slate-700">Examen (O)</label><textarea className="w-full p-3 border rounded-lg h-32" value={notes.objective} onChange={e => setNotes({ ...notes, objective: e.target.value })} /></div>
                                <div><label className="block font-bold text-sm mb-1 text-slate-700">Diagnóstico (A)</label><textarea className="w-full p-3 border rounded-lg h-32" value={notes.assessment} onChange={e => setNotes({ ...notes, assessment: e.target.value })} /></div>
                            </div>
                            <div><label className="block font-bold text-sm mb-1 text-slate-700">Plan (P)</label><textarea className="w-full p-3 border rounded-lg h-24" value={notes.plan} onChange={e => setNotes({ ...notes, plan: e.target.value })} /></div>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-fit sticky top-4">
                    <h3 className="font-bold mb-4 flex items-center gap-2 border-b pb-2"><DollarSign className="w-5 h-5 text-teal-600" /> Servicios</h3>
                    <div className="space-y-2 mb-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                        {SERVICES_CATALOG.map(srv => (
                            <button key={srv.id} onClick={() => toggleService(srv)} className={`w-full text-left p-3 rounded-lg border text-sm flex justify-between transition-all ${cart.find(c => c.id === srv.id) ? 'bg-teal-50 border-teal-500 text-teal-700 font-medium' : 'hover:bg-slate-50'}`}><span>{srv.name}</span><span>{formatCurrency(srv.price)}</span></button>
                        ))}
                    </div>
                    <div className="border-t pt-4 space-y-3">
                        <div className="flex justify-between font-bold text-lg text-slate-800"><span>Total</span><span>{formatCurrency(total)}</span></div>
                        <button onClick={() => setStep('checkout')} className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold flex justify-center items-center gap-2 hover:bg-black transition-all shadow-lg"><CheckCircle className="w-5 h-5" /> Finalizar y Cobrar</button>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0 bg-slate-900 z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl relative">
                <button onClick={() => setStep('medical')} className="absolute top-4 left-4 text-slate-400 hover:text-slate-800"><ChevronLeft /></button>
                <div className="text-center mb-6 mt-2"><h2 className="text-2xl font-bold text-slate-800">Cobro Final</h2><p className="text-slate-500">Muestra el código al cliente</p></div>
                <div className="bg-slate-100 p-6 rounded-2xl flex justify-center mb-6 border-2 border-dashed border-slate-300"><QrCode className="w-40 h-40 text-slate-800" /></div>
                <div className="space-y-3 mb-8">
                    <div className="flex justify-between text-slate-500"><span>Servicios</span><span>{formatCurrency(total)}</span></div>
                    <div className="flex justify-between text-green-600"><span>Reserva Pagada</span><span>- {formatCurrency(deposit)}</span></div>
                    <div className="flex justify-between text-3xl font-bold text-slate-900 pt-4 border-t"><span>A Pagar</span><span>{formatCurrency(toPay)}</span></div>
                </div>
                <button onClick={() => onFinish({ notes, cost: total, services: cart })} className="w-full bg-teal-600 text-white py-4 rounded-xl font-bold shadow-lg shadow-teal-200 hover:bg-teal-700">Confirmar Pago</button>
            </div>
        </div>
    );
};
