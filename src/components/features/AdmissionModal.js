import React, { useState } from 'react';
import { MapPin } from 'lucide-react';
import { Modal } from '../ui/Modal';

export const AdmissionModal = ({ appointment, onClose, onAdmit }) => {
    const [petData, setPetData] = useState({ name: appointment.petName, type: 'Perro', breed: '', age: '', weight: '', chipId: '', ownerName: appointment.ownerName, ownerRut: appointment.ownerRut, address: appointment.address });
    const handleSave = () => {
        const newPet = { ...petData, id: Date.now(), ownerId: appointment.ownerId || `owner_${Date.now()}`, sterilized: false, allergies: [], alerts: [], lastCheckup: 'Recién Ingresado', image: petData.type === 'Perro' ? '🐕' : '🐈', vaccines: [], history: [] };
        onAdmit(newPet, appointment.id);
    };
    return (
        <Modal title="Registrar Paciente Nuevo" onClose={onClose} onSave={handleSave}>
            <div className="space-y-4">
                <div className="bg-blue-50 p-3 rounded text-sm text-blue-800 mb-4 border border-blue-100">
                    <div className="flex items-start gap-2 mb-2"><MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" /><p><strong>Dirección:</strong> {appointment.address || 'No especificada'}</p></div>
                    <p className="mb-1"><strong>Solicita:</strong> {appointment.ownerName}</p><p><strong>Motivo:</strong> {appointment.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div><label className="text-sm font-bold text-slate-700">Tipo</label><select className="w-full border p-2 rounded" value={petData.type} onChange={e => setPetData({ ...petData, type: e.target.value })}><option>Perro</option><option>Gato</option></select></div>
                    <div><label className="text-sm font-bold text-slate-700">Raza</label><input className="w-full border p-2 rounded" value={petData.breed} onChange={e => setPetData({ ...petData, breed: e.target.value })} /></div>
                    <div><label className="text-sm font-bold text-slate-700">Edad</label><input type="number" className="w-full border p-2 rounded" value={petData.age} onChange={e => setPetData({ ...petData, age: e.target.value })} /></div>
                    <div><label className="text-sm font-bold text-slate-700">Peso (kg)</label><input type="number" className="w-full border p-2 rounded" value={petData.weight} onChange={e => setPetData({ ...petData, weight: e.target.value })} /></div>
                </div>
                <div><label className="text-sm font-bold text-slate-700">Chip ID</label><input className="w-full border p-2 rounded" value={petData.chipId} onChange={e => setPetData({ ...petData, chipId: e.target.value })} /></div>
            </div>
        </Modal>
    );
};
