"use client";

import React, { useState } from 'react';
import { VetMovilApp } from '../components/VetMovilApp';
import { LandingPage } from '../components/LandingPage';
import { INITIAL_PETS, INITIAL_APPOINTMENTS } from '../data/mocks';

export default function VetMovilLanding() {
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
    // Lógica dummy, en realidad se pasaría el petId para actualizar
    console.log("Consulta finalizada", data);
  };

  const handleUpdatePet = (updated) => {
    setPets(pets.map(p => p.id === updated.id ? updated : p));
  };

  // Si hay usuario logueado, mostrar la App
  if (currentUser) {
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

  // Si no, mostrar Landing Page
  return (
    <LandingPage onLogin={setCurrentUser} />
  );
}