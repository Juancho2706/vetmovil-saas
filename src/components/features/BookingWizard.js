import React, { useState, useMemo } from 'react';
import { MapPin, CreditCard, Calendar, Clock, Camera, AlertCircle, Plus, Dog, Cat } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { formatCurrency, formatRut } from '../../utils/format';
import { VET_AVAILABILITY } from '../../data/mocks';

const TriageLevel = ({ level, selected, onSelect }) => (
    <div
        onClick={() => onSelect(level)}
        className={`p-3 rounded-lg border-2 cursor-pointer transition-all flex flex-col items-center gap-2 text-center ${selected ? 'border-teal-600 bg-teal-50' : 'border-slate-100 hover:border-slate-300'}`}
    >
        <div className={`w-3 h-3 rounded-full ${level === 'low' ? 'bg-green-500' : level === 'medium' ? 'bg-yellow-500' : 'bg-red-500'}`} />
        <span className="text-xs font-bold text-slate-700">{level === 'low' ? 'Leve' : level === 'medium' ? 'Moderado' : 'Urgente'}</span>
    </div>
);

export const BookingWizard = ({ onClose, onComplete, defaultAddress }) => {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    // Form State
    const [patientmode, setPatientMode] = useState('new'); // 'new' or 'existing' (simplified for demo)
    const [formData, setFormData] = useState({
        // Client Info
        firstName: '', lastName: '', rut: '', address: defaultAddress || '',
        // Pet Info
        petName: '', petSpecies: 'dog', petAge: '', petWeight: '',
        // Clinical Info
        symptoms: '', severity: 'low', photo: null,
        // Schedule
        date: '', timeSlot: ''
    });

    // Smart Scheduling Logic
    const availableSlots = useMemo(() => {
        if (!formData.date) return [];

        const dateObj = new Date(formData.date);
        const day = dateObj.getDay(); // 0=Sun, 1=Mon...

        // Check if working day
        if (!VET_AVAILABILITY.workDays.includes(day)) return [];

        const slots = [];
        const { startHour, endHour, slotDuration, bufferTime } = VET_AVAILABILITY;
        const totalSlotTime = slotDuration + bufferTime; // 90 mins

        for (let hour = startHour; hour < endHour; hour++) {
            // Simplified slot generation
            const timeString = `${hour}:00`;
            slots.push(timeString);

            // Add half hour slot if applicable logic existed, for now just hourly chunks
            if (hour + 1 < endHour && totalSlotTime < 60) {
                // logic for granular slots could go here
            }
        }

        // Filter out "past" slots if today (simplified)
        return slots;
    }, [formData.date]);

    const handlePay = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            const newPetData = {
                id: `pet_${Date.now()}`,
                name: formData.petName,
                breed: 'Mestizo', // Default for new
                image: formData.petSpecies === 'dog' ? '🐕' : '🐈',
                ...formData
            };

            onComplete({
                ...formData,
                id: `new_${Date.now()}`,
                status: 'pending_admission',
                paid: true,
                newPet: newPetData // Pass new pet to add to system
            });
        }, 1500);
    };

    const handlePhotoUpload = () => {
        // Simulate upload
        setFormData({ ...formData, photo: 'uploaded_image_id' });
    };

    return (
        <Modal title="Agendar Visita Domiciliaria" onClose={onClose}>
            {/* PROGRESS BAR */}
            <div className="flex gap-2 mb-6">
                {[1, 2, 3].map(s => (
                    <div key={s} className={`h-1 flex-1 rounded-full transition-colors ${step >= s ? 'bg-teal-500' : 'bg-slate-200'}`} />
                ))}
            </div>

            {/* STEP 1: PACIENTE & TRIAJE */}
            {step === 1 && (
                <div className="space-y-4 animate-fade-in">
                    <div className="bg-teal-50 p-3 rounded-lg flex items-start gap-3 border border-teal-100">
                        <div className="bg-teal-100 p-2 rounded-full text-teal-700 mt-1"><Dog className="w-4 h-4" /></div>
                        <div>
                            <h4 className="font-bold text-teal-900 text-sm">¿A quién vamos a atender?</h4>
                            <p className="text-teal-700 text-xs mt-1">Completa los datos de tu mascota para preparar al veterinario.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase">Nombre</label>
                            <input className="w-full border p-2 rounded mt-1" value={formData.petName} onChange={e => setFormData({ ...formData, petName: e.target.value })} placeholder="Ej: Rocky" />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase">Especie</label>
                            <div className="flex gap-2 mt-1">
                                <button onClick={() => setFormData({ ...formData, petSpecies: 'dog' })} className={`flex-1 p-2 rounded border flex justify-center ${formData.petSpecies === 'dog' ? 'bg-slate-800 text-white border-slate-900' : 'bg-white'}`}><Dog className="w-4 h-4" /></button>
                                <button onClick={() => setFormData({ ...formData, petSpecies: 'cat' })} className={`flex-1 p-2 rounded border flex justify-center ${formData.petSpecies === 'cat' ? 'bg-slate-800 text-white border-slate-900' : 'bg-white'}`}><Cat className="w-4 h-4" /></button>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div><label className="text-xs font-bold text-slate-500 uppercase">Edad (Años)</label><input type="number" className="w-full border p-2 rounded mt-1" value={formData.petAge} onChange={e => setFormData({ ...formData, petAge: e.target.value })} /></div>
                        <div><label className="text-xs font-bold text-slate-500 uppercase">Peso Aprox (Kg)</label><input type="number" className="w-full border p-2 rounded mt-1" value={formData.petWeight} onChange={e => setFormData({ ...formData, petWeight: e.target.value })} /></div>
                    </div>

                    <div className="border-t pt-4">
                        <label className="text-sm font-bold text-slate-700 flex items-center gap-2 mb-2"><AlertCircle className="w-4 h-4 text-orange-500" /> Síntomas / Motivo</label>
                        <textarea className="w-full border p-2 rounded h-20 text-sm" placeholder="Describe qué le pasa a tu mascota..." value={formData.symptoms} onChange={e => setFormData({ ...formData, symptoms: e.target.value })} />

                        <div className="flex items-center gap-4 mt-3">
                            <div className="flex-1">
                                <span className="text-xs font-bold text-slate-500 uppercase block mb-1">Nivel de Urgencia</span>
                                <div className="grid grid-cols-3 gap-2">
                                    {['low', 'medium', 'high'].map(l => <TriageLevel key={l} level={l} selected={formData.severity === l} onSelect={v => setFormData({ ...formData, severity: v })} />)}
                                </div>
                            </div>
                            <div
                                onClick={handlePhotoUpload}
                                className={`w-24 h-24 rounded-lg border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-colors ${formData.photo ? 'bg-green-50 border-green-300 text-green-600' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'}`}
                            >
                                <Camera className="w-6 h-6 mb-1" />
                                <span className="text-[10px] font-bold">{formData.photo ? 'Foto OK' : 'Subir Foto'}</span>
                            </div>
                        </div>
                    </div>

                    <button disabled={!formData.petName || !formData.symptoms} onClick={() => setStep(2)} className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-black disabled:opacity-50 mt-4">Siguiente: Elegir Horario</button>
                </div>
            )}

            {/* STEP 2: AGENDAMIENTO INTELIGENTE */}
            {step === 2 && (
                <div className="space-y-4 animate-fade-in">
                    <div>
                        <label className="text-sm font-bold text-slate-700 mb-1 block">Dirección de Visita</label>
                        <div className="flex gap-2">
                            <input className="w-full border p-2 rounded focus:ring-2 focus:ring-teal-500" value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} />
                            <button className="bg-slate-100 p-2 rounded border hover:bg-slate-200"><MapPin className="w-5 h-5 text-teal-600" /></button>
                        </div>
                    </div>

                    <div>
                        <label className="text-sm font-bold text-slate-700 mb-2 block">Fecha Preferida</label>
                        <input type="date" className="w-full border p-2 rounded mb-4" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} min={new Date().toISOString().split('T')[0]} />

                        {formData.date && (
                            <div className="animate-fade-in">
                                <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Horarios Disponibles</label>
                                {availableSlots.length > 0 ? (
                                    <div className="grid grid-cols-4 gap-2">
                                        {availableSlots.map(slot => (
                                            <button
                                                key={slot}
                                                onClick={() => setFormData({ ...formData, timeSlot: slot })}
                                                className={`p-2 rounded text-sm font-bold border transition-all ${formData.timeSlot === slot ? 'bg-teal-600 text-white border-teal-700 shadow-md' : 'bg-white hover:border-teal-400 text-slate-600'}`}
                                            >
                                                {slot}
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-4 bg-orange-50 text-orange-600 text-sm rounded-lg flex items-center gap-2">
                                        <AlertCircle className="w-4 h-4" /> No hay horas disponibles para este día. Intenta otro.
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="flex gap-3 mt-6">
                        <button onClick={() => setStep(1)} className="flex-1 border border-slate-300 text-slate-600 py-3 rounded-xl font-bold hover:bg-slate-50">Volver</button>
                        <button disabled={!formData.timeSlot || !formData.address} onClick={() => setStep(3)} className="flex-[2] bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-black disabled:opacity-50">Ir al Pago</button>
                    </div>
                </div>
            )}

            {/* STEP 3: CONFIRMACIÓN Y PAGO */}
            {step === 3 && (
                <div className="space-y-4 animate-fade-in">
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                        <div className="flex justify-between items-center"><span className="text-slate-500 text-sm">Fecha y Hora</span><span className="font-bold text-slate-800">{formData.date} a las {formData.timeSlot}</span></div>
                        <div className="flex justify-between items-center"><span className="text-slate-500 text-sm">Dirección</span><span className="font-bold text-slate-800 text-right w-1/2 truncate">{formData.address}</span></div>
                        <div className="flex justify-between items-center"><span className="text-slate-500 text-sm">Veterinario</span><span className="font-bold text-slate-800">Dr. Alejandro (Asignado)</span></div>
                        <div className="border-t border-slate-200 my-2 pt-2 flex justify-between items-center text-lg"><span className="font-bold text-slate-700">Total a Pagar</span><span className="font-bold text-teal-600">{formatCurrency(20000)}</span></div>
                    </div>

                    <div className="bg-white border rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-4"><CreditCard className="w-5 h-5 text-slate-400" /><span className="font-bold text-slate-700">Método de Pago</span></div>
                        <input className="w-full border p-2 rounded mb-3 bg-slate-50" value="**** **** **** 4242" disabled />
                        <button onClick={handlePay} className="w-full bg-teal-600 text-white py-3 rounded-xl font-bold shadow-lg hover:bg-teal-700 transition-transform hover:scale-[1.02] flex justify-center items-center gap-2">
                            {loading ? 'Procesando...' : `Pagar y Confirmar Cita`}
                        </button>
                    </div>
                    <button onClick={() => setStep(2)} className="w-full text-slate-400 text-sm hover:text-slate-600">Volver a editar</button>
                </div>
            )}
        </Modal>
    );
};
