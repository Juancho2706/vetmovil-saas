import React, { useState } from 'react';
import { MapPin, Sparkles, Loader2, CreditCard } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { callGeminiAPI } from '../../services/gemini';
import { formatCurrency } from '../../utils/format';

export const BookingWizard = ({ onClose, onComplete, defaultAddress }) => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({ ownerName: '', rut: '', petName: '', description: '', address: defaultAddress || '' });
    const [loading, setLoading] = useState(false);
    // AI State
    const [analyzing, setAnalyzing] = useState(false);
    const [aiAdvice, setAiAdvice] = useState(null);

    const handlePay = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            onComplete({ ...formData, id: `new_${Date.now()}`, date: new Date().toLocaleDateString(), status: 'pending_admission', paid: true });
        }, 1500);
    };

    const handleAnalyzeSymptoms = async () => {
        if (!formData.description || formData.description.length < 5) return;
        setAnalyzing(true);
        const prompt = `Eres un asistente de triaje veterinario virtual. El dueño de una mascota describe los siguientes síntomas: "${formData.description}".
    Por favor analiza esto y responde brevemente con este formato:
    1. Nivel de Urgencia estimado (Bajo, Medio, Alto).
    2. Recomendación inmediata de qué hacer mientras llega el veterinario.
    3. Una frase empática.
    No des diagnósticos médicos definitivos, solo orientación de primeros auxilios o manejo.`;

        const response = await callGeminiAPI(prompt);
        setAiAdvice(response);
        setAnalyzing(false);
    };

    return (
        <Modal title="Agendar Visita Domiciliaria" onClose={onClose}>
            {step === 1 && (
                <div className="space-y-4">
                    <div className="bg-teal-50 p-4 rounded-lg text-teal-800 text-sm mb-4 border border-teal-100"><strong>Paso 1/2:</strong> Ingresa la dirección exacta donde el veterinario debe ir.</div>
                    <div>
                        <label className="text-sm font-bold text-slate-700 mb-1 block">Dirección / Ubicación</label>
                        <div className="flex gap-2 mb-2">
                            <input className="w-full border p-2 rounded focus:ring-2 focus:ring-teal-500" placeholder="Ej: Av. Providencia 1234" value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} />
                            <button className="bg-slate-100 p-2 rounded border hover:bg-slate-200"><MapPin className="w-5 h-5 text-teal-600" /></button>
                        </div>
                        <div className="w-full h-32 bg-slate-100 rounded-lg border border-slate-200 flex items-center justify-center relative overflow-hidden group cursor-pointer">
                            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/map-marker.png')]"></div>
                            <div className="text-slate-400 text-xs flex flex-col items-center z-10"><MapPin className="w-8 h-8 text-red-500 mb-1 animate-bounce" /><span className="font-bold text-slate-600">Confirmar ubicación</span><span className="text-[10px] text-slate-400">(Simulación)</span></div>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div><label className="text-sm font-bold text-slate-700">Tu Nombre</label><input className="w-full border p-2 rounded" value={formData.ownerName} onChange={e => setFormData({ ...formData, ownerName: e.target.value })} /></div>
                        <div><label className="text-sm font-bold text-slate-700">RUT</label><input className="w-full border p-2 rounded" placeholder="12.345.678-9" value={formData.rut} onChange={e => setFormData({ ...formData, rut: e.target.value })} /></div>
                    </div>
                    <div><label className="text-sm font-bold text-slate-700">Nombre Mascota</label><input className="w-full border p-2 rounded" value={formData.petName} onChange={e => setFormData({ ...formData, petName: e.target.value })} /></div>

                    {/* AI Symptom Checker Section */}
                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <label className="text-sm font-bold text-slate-700">Motivo</label>
                            <button
                                onClick={handleAnalyzeSymptoms}
                                disabled={analyzing || !formData.description}
                                className="text-xs flex items-center gap-1 bg-purple-100 text-purple-700 px-2 py-1 rounded hover:bg-purple-200 transition-colors disabled:opacity-50"
                            >
                                {analyzing ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                                {analyzing ? "Analizando..." : "Analizar con IA"}
                            </button>
                        </div>
                        <textarea className="w-full border p-2 rounded h-20" placeholder="Síntomas..." value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />

                        {aiAdvice && (
                            <div className="mt-3 bg-purple-50 border border-purple-100 p-3 rounded-lg text-sm text-purple-800 animate-fade-in">
                                <div className="font-bold flex items-center gap-2 mb-1"><Sparkles className="w-4 h-4 text-purple-600" /> Asistente de Triaje (Gemini)</div>
                                <div className="whitespace-pre-wrap text-xs leading-relaxed">{aiAdvice}</div>
                            </div>
                        )}
                    </div>

                    <button disabled={!formData.address || !formData.petName} onClick={() => setStep(2)} className="w-full bg-slate-900 text-white py-3 rounded-lg font-bold hover:bg-black disabled:opacity-50">Continuar al Pago</button>
                </div>
            )}
            {step === 2 && (
                <div className="space-y-4">
                    <div className="flex justify-between py-2 border-b border-dashed border-slate-200"><span className="text-slate-600 font-medium">Reserva Visita</span><span className="font-bold text-lg">{formatCurrency(20000)}</span></div>
                    <div className="bg-slate-100 p-4 rounded-xl space-y-3 border border-slate-200">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase"><CreditCard className="w-3 h-3" /> Simulación Tarjeta</div>
                        <input disabled value="**** **** **** 4242" className="w-full p-2 bg-white border border-slate-300 rounded text-sm" />
                        <div className="grid grid-cols-2 gap-2"><input disabled value="12/28" className="w-full p-2 bg-white border rounded text-sm" /><input disabled value="***" className="w-full p-2 bg-white border rounded text-sm" /></div>
                    </div>
                    <button onClick={handlePay} className="w-full bg-teal-600 text-white py-3 rounded-xl font-bold hover:bg-teal-700 flex justify-center items-center gap-2 shadow-lg">{loading ? 'Procesando...' : `Pagar ${formatCurrency(20000)}`}</button>
                    <button onClick={() => setStep(1)} className="w-full text-slate-500 text-sm py-2 hover:text-slate-800">Volver</button>
                </div>
            )}
        </Modal>
    );
};
