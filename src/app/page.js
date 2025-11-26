"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { LandingPage } from '../components/LandingPage';

export default function Page() {
  const router = useRouter();

  const handleLogin = (role) => {
    // En la Landing real, "Soy Cliente" o "Soy Veterinario" llevan al Login Real
    router.push('/login');
  };

  // Modificamos la LandingPage para que el botón "Probar Demo" redirija a /demo
  // Como LandingPage acepta onLogin, podemos interceptarlo o pasarle una prop extra si la modificamos.
  // Por ahora, usaremos onLogin para redirigir a /login, y agregaremos un botón manual o modificaremos el componente.

  // Para no modificar LandingPage.js demasiado, envolveremos la navegación.
  // Pero LandingPage.js usa MOCK_USERS. Vamos a modificar LandingPage.js ligeramente en el siguiente paso para que sea más flexible.
  // Por ahora, pasamos una función que redirige.

  return (
    <LandingPage onLogin={() => router.push('/login')} />
  );
}