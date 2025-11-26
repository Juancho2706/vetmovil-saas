"use client";

import React, { useState } from 'react';
import { VetMovilApp } from '../../components/VetMovilApp';
import { INITIAL_PETS, INITIAL_APPOINTMENTS } from '../../data/mocks';

export default function DemoPage() {
    const [currentUser, setCurrentUser] = useState(null);

    // Estado global de la App (Mascotas y Citas) para que persista al cambiar de usuario
    const [pets, setPets] = useState(INITIAL_PETS);
    const [appointments, setAppointments] = useState(INITIAL_APPOINTMENTS);

    // Handlers Globales
    const handleBookingComplete = (data) => {
        // Al crear reserva, asociamos con el ID del usuario actual si es cliente
        const newAppt = { ...data, ownerId: currentUser?.id };
        setAppointments([...appointments, newAppt]);
    };

    const handleAdmit = (newPet, apptId) => {
        setPets([...pets, newPet]);
        setAppointments(appointments.filter(a => a.id !== apptId));
    };

    const handleConsultationFinish = (data) => {
        console.log("Consulta finalizada", data);
    };

    const handleUpdatePet = (updated) => {
        setPets(pets.map(p => p.id === updated.id ? updated : p));
    };

    // MOCK LOGIN SCREEN FOR DEMO
    if (!currentUser) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
                <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
                    <h1 className="text-2xl font-bold text-slate-900 mb-2">Modo Demo</h1>
                    <p className="text-slate-500 mb-8">Selecciona un rol para probar la experiencia.</p>

                    <div className="space-y-4">
                        <button onClick={() => setCurrentUser({ id: 'vet_1', name: 'Dr. Juan Pérez', role: 'vet' })} className="w-full bg-slate-900 text-white p-4 rounded-xl font-bold hover:bg-black transition-all shadow-lg">
                            Soy Veterinario
                        </button>
                        <button onClick={() => setCurrentUser({ id: 'client_1', name: 'Ana María', role: 'client', address: 'Av. Providencia 1234' })} className="w-full bg-teal-600 text-white p-4 rounded-xl font-bold hover:bg-teal-700 transition-all shadow-lg">
                            Soy Cliente
                        </button>
                    </div>
                    <p className="mt-6 text-xs text-slate-400">Los datos son simulados y no se guardan.</p>
                </div>
            </div>
        );
    }

    return (
        <VetMovilApp
            currentUser={currentUser}
            onLogout={() => setCurrentUser(null)}
            pets={pets}
            appointments={appointments}
            handleBookingComplete={handleBookingComplete}
            handleAdmit={handleAdmit}
            handleConsultationFinish={handleConsultationFinish}
            handleUpdatePet={handleUpdatePet}
        />
    );
}
