"use client";

import React, { useState } from 'react';
import { VetMovilApp } from '../../components/VetMovilApp';
import { INITIAL_PETS, INITIAL_APPOINTMENTS, MOCK_USERS } from '../../data/mocks';
import { Stethoscope, Globe, Link as LinkIcon, ArrowRight } from 'lucide-react';

export default function DemoPage() {
    // demoMode: 'landing' | 'vet_dashboard' | 'client_dash' | 'public_profile'
    const [demoMode, setDemoMode] = useState('landing');
    const [currentUser, setCurrentUser] = useState(null);

    // Global State (Persistent across mode switches for demo purposes)
    const [pets, setPets] = useState(INITIAL_PETS);
    const [appointments, setAppointments] = useState(INITIAL_APPOINTMENTS);

    // Handlers
    const handleBookingComplete = (data) => {
        const ownerId = currentUser ? currentUser.id : (`guest_${Date.now()}`); // If guest, create dummy ID
        const ownerName = currentUser ? currentUser.name : (data.firstName + ' ' + data.lastName);

        const newAppt = { ...data, ownerId, ownerName, ownerRut: data.rut };
        setAppointments([...appointments, newAppt]);

        if (data.newPet) {
            setPets([...pets, { ...data.newPet, ownerId, ownerName }]);
        }
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

    const startVetMode = () => {
        setCurrentUser(MOCK_USERS.vet);
        setDemoMode('vet_dashboard');
    };

    const startClientMagicLink = () => {
        setCurrentUser(MOCK_USERS.client);
        setDemoMode('client_dashboard');
    };

    const startPublicProfile = () => {
        setCurrentUser(null);
        setDemoMode('public_profile');
    };

    const resetDemo = () => {
        setDemoMode('landing');
        setCurrentUser(null);
    };

    if (demoMode === 'landing') {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
                <div className="max-w-4xl w-full grid md:grid-cols-2 gap-8 items-center">
                    <div className="text-white space-y-6">
                        <div className="inline-flex items-center gap-2 bg-teal-900/50 border border-teal-800 rounded-full px-4 py-1 text-sm font-medium text-teal-400">
                            <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span>
                            Nueva Arquitectura B2B2C
                        </div>
                        <h1 className="text-5xl font-bold tracking-tight">VetMovil <span className="text-teal-400">SaaS</span></h1>
                        <p className="text-slate-400 text-lg">
                            Simula los 3 flujos principales de la plataforma sin fricción.
                            El cliente nunca crea cuenta, solo accede.
                        </p>
                    </div>

                    <div className="space-y-4">
                        {/* CARD 1: PUBLIC PROFILE */}
                        <button onClick={startPublicProfile} className="w-full bg-white p-6 rounded-2xl flex items-center gap-4 hover:scale-[1.02] transition-transform group text-left">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                <Globe className="w-6 h-6" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-slate-800 text-lg">Perfil Público</h3>
                                <p className="text-slate-500 text-sm">Lo que ve un cliente nuevo. Agendamiento sin login.</p>
                            </div>
                            <ArrowRight className="text-slate-300 group-hover:text-blue-600" />
                        </button>

                        {/* CARD 2: VET LOGIN */}
                        <button onClick={startVetMode} className="w-full bg-slate-800 border border-slate-700 p-6 rounded-2xl flex items-center gap-4 hover:scale-[1.02] transition-transform group text-left">
                            <div className="w-12 h-12 bg-slate-700 rounded-full flex items-center justify-center text-white group-hover:bg-teal-500 transition-colors">
                                <Stethoscope className="w-6 h-6" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-white text-lg">Login Veterinario</h3>
                                <p className="text-slate-400 text-sm">Dashboard de gestión (Solo para el Dr.)</p>
                            </div>
                            <ArrowRight className="text-slate-500 group-hover:text-white" />
                        </button>

                        {/* CARD 3: MAGIC LINK */}
                        <button onClick={startClientMagicLink} className="w-full bg-slate-800 border border-slate-700 p-6 rounded-2xl flex items-center gap-4 hover:scale-[1.02] transition-transform group text-left">
                            <div className="w-12 h-12 bg-slate-700 rounded-full flex items-center justify-center text-white group-hover:bg-purple-500 transition-colors">
                                <LinkIcon className="w-6 h-6" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-white text-lg">Simular Magic Link</h3>
                                <p className="text-slate-400 text-sm">Cliente abre link desde WhatsApp/SMS.</p>
                            </div>
                            <ArrowRight className="text-slate-500 group-hover:text-white" />
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <VetMovilApp
            viewMode={demoMode}
            currentUser={currentUser}
            onLogout={resetDemo} // Returns to Demo Landing
            pets={pets}
            appointments={appointments}
            handleBookingComplete={handleBookingComplete}
            handleAdmit={handleAdmit}
            handleConsultationFinish={handleConsultationFinish}
            handleUpdatePet={handleUpdatePet}
        />
    );
}
