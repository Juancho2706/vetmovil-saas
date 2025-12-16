"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';
import { VetMovilApp } from '../../components/VetMovilApp';
import { Loader2 } from 'lucide-react';

export default function DashboardPage() {
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);
    const [pets, setPets] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const router = useRouter();

    useEffect(() => {
        checkUser();
    }, []);

    const checkUser = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
            router.push('/login');
            return;
        }

        // Fetch user profile from Supabase
        const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

        if (profile) {
            setCurrentUser({ ...profile, email: session.user.email });
            fetchData(session.user.id, profile.role);
        } else {
            // Si no tiene perfil, quizás redirigir a onboarding
            console.warn("Usuario sin perfil");
            setLoading(false);
        }
    };

    const fetchData = async (userId, role) => {
        // Cargar Mascotas
        // Si es vet, carga todas. Si es cliente, solo las suyas.
        let petsQuery = supabase.from('pets').select('*');
        if (role === 'client') {
            petsQuery = petsQuery.eq('owner_id', userId);
        }
        const { data: petsData } = await petsQuery;

        // Cargar Citas
        let apptsQuery = supabase.from('appointments').select('*');
        if (role === 'client') {
            apptsQuery = apptsQuery.eq('owner_id', userId);
        }
        const { data: apptsData } = await apptsQuery;

        // Transformar datos de snake_case (DB) a camelCase (App) si es necesario
        // O adaptar la App para usar snake_case. Por ahora, mapeo simple.
        const mappedPets = (petsData || []).map(p => ({
            ...p,
            ownerId: p.owner_id,
            ownerName: p.owner_name,
            lastCheckup: p.last_checkup,
            alerts: p.alerts || [],
            allergies: p.allergies || [],
            vaccines: p.vaccines || [],
            history: p.history || []
        }));

        const mappedAppts = (apptsData || []).map(a => ({
            ...a,
            ownerId: a.owner_id,
            petName: a.pet_name,
            ownerName: a.owner_name,
            ownerRut: a.owner_rut
        }));

        setPets(mappedPets);
        setAppointments(mappedAppts);
        setLoading(false);
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/');
    };

    // Handlers para crear datos en Supabase
    const handleBookingComplete = async (data) => {
        const newAppt = {
            owner_id: currentUser.id,
            owner_name: `${data.firstName} ${data.lastName}`,
            owner_rut: data.rut,
            pet_name: data.petName,
            description: data.description,
            address: data.address,
            status: 'pending',
            date: new Date().toISOString(),
            paid: true
        };

        const { data: inserted, error } = await supabase.from('appointments').insert(newAppt).select().single();

        if (!error && inserted) {
            setAppointments([...appointments, { ...inserted, ownerId: inserted.owner_id, petName: inserted.pet_name, ownerName: inserted.owner_name, ownerRut: inserted.owner_rut }]);
        }
    };

    const handleAdmit = async (newPet, apptId) => {
        // 1. Crear Mascota
        const petToInsert = {
            owner_id: newPet.ownerId,
            name: newPet.name,
            type: newPet.type,
            breed: newPet.breed,
            age: newPet.age,
            weight: newPet.weight,
            chip_id: newPet.chipId,
            owner_name: newPet.ownerName,
            image: newPet.image,
            last_checkup: new Date().toLocaleDateString()
        };

        const { data: insertedPet } = await supabase.from('pets').insert(petToInsert).select().single();

        // 2. Actualizar Cita (Marcar como atendida o eliminar)
        await supabase.from('appointments').delete().eq('id', apptId);

        if (insertedPet) {
            setPets([...pets, { ...insertedPet, ownerId: insertedPet.owner_id, ownerName: insertedPet.owner_name, lastCheckup: insertedPet.last_checkup }]);
            setAppointments(appointments.filter(a => a.id !== apptId));
        }
    };

    const handleConsultationFinish = (data) => {
        console.log("Guardar consulta en DB", data);
        // Implementar insert en tabla consultations
    };

    const handleUpdatePet = (updated) => {
        // Implementar update en DB
        console.log("Update pet", updated);
    };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-teal-600" /></div>;
    }

    if (!currentUser) return null;

    const viewMode = currentUser.role === 'vet' ? 'vet_dashboard' : 'client_dashboard';

    return (
        <VetMovilApp
            viewMode={viewMode}
            currentUser={currentUser}
            onLogout={handleLogout}
            pets={pets}
            appointments={appointments}
            handleBookingComplete={handleBookingComplete}
            handleAdmit={handleAdmit}
            handleConsultationFinish={handleConsultationFinish}
            handleUpdatePet={handleUpdatePet}
        />
    );
}
