"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '../../../lib/supabase';
import { VetMovilApp } from '../../../components/VetMovilApp';
import { Loader2 } from 'lucide-react';

export default function PublicProfilePage() {
    const { slug } = useParams();
    const [vetProfile, setVetProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchVet = async () => {
            // Try to find by ID first (because we seeded ID)
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', slug)
                .eq('role', 'vet')
                .single();

            if (data) {
                setVetProfile(data);
            } else {
                console.error("Vet not found", error);
                // Fallback: Mocked if DB fails or invalid ID
            }
            setLoading(false);
        };

        if (slug) fetchVet();
    }, [slug]);

    const handleBookingRequest = async (data) => {
        // En perfil público, al agendar, creamos la cita en Supabase vinculada a este VET (slug)
        const newAppt = {
            vet_id: vetProfile.id, // The vet from the URL
            owner_name: `${data.firstName} ${data.lastName}`,
            owner_rut: data.rut,
            pet_name: data.petName,
            description: data.description,
            address: data.address,
            status: 'pending',
            date: new Date().toISOString(),
            paid: false, // Public booking might require validation or payment link later
            owner_id: null // Guest booking (or use specific guest logic)
        };

        const { error } = await supabase.from('appointments').insert(newAppt);
        if (error) console.error("Error booking:", error);
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-teal-600" /></div>;

    if (!vetProfile) return <div className="min-h-screen flex items-center justify-center text-slate-500">Perfil de veterinario no encontrado.</div>;

    return (
        <VetMovilApp
            viewMode="public_profile"
            currentUser={{ name: 'Guest' }} // Dummy user for rendering layout if needed
            pets={[]} // Guests don't see pets
            appointments={[]} // Guests don't see appointments
            handleBookingComplete={handleBookingRequest}
        />
    );
}
