"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { supabase, checkSupabaseConfig } from '../../lib/supabase';
import { useRouter, useSearchParams } from 'next/navigation';
import { Stethoscope, ArrowRight, Loader2, Lock, AlertTriangle } from 'lucide-react';


function LoginContent() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [mode, setMode] = useState('magic');
    const router = useRouter();

    useEffect(() => {
        const config = checkSupabaseConfig();
        if (!config.valid) {
            setMessage({ type: 'error', text: config.message });
        }
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        if (mode === 'magic') {
            const { error } = await supabase.auth.signInWithOtp({
                email,
                options: { emailRedirectTo: `${window.location.origin}/dashboard` },
            });
            if (error) setMessage({ type: 'error', text: error.message });
            else setMessage({ type: 'success', text: '¡Enlace enviado! Revisa tu correo.' });
        } else {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                let errorMsg = error.message;
                if (error.message === 'Failed to fetch') {
                    errorMsg = 'Error de conexión. Verifica tu internet o la configuración de Supabase.';
                } else if (error.message === 'Invalid login credentials') {
                    errorMsg = 'Credenciales incorrectas. Verifica tu correo y contraseña.';
                }
                setMessage({ type: 'error', text: errorMsg });
            } else {
                // En el modelo B2B, asumimos que quien se loguea aquí es un Vet.
                // Podríamos validar role 'vet' si es estricto, pero por ahora permitimos el paso a dashboard.
                router.push('/dashboard');
            }
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
            <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full">
                <div className="flex justify-center mb-6">
                    <div className="bg-teal-600 p-3 rounded-xl text-white shadow-lg shadow-teal-200"><Stethoscope className="w-8 h-8" /></div>
                </div>
                <h1 className="text-2xl font-bold text-center text-slate-900 mb-2">Acceso Profesionales</h1>
                <p className="text-center text-slate-500 mb-8">
                    Gestión clínica inteligente para veterinarios modernos.
                </p>

                <div className="flex bg-slate-100 p-1 rounded-lg mb-6">
                    <button onClick={() => setMode('magic')} className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${mode === 'magic' ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}>Magic Link</button>
                    <button onClick={() => setMode('password')} className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${mode === 'password' ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}>Contraseña</button>
                </div>

                {/* DEMO HINT */}
                <div className="mb-6 bg-blue-50 p-3 rounded-lg border border-blue-100 text-xs text-blue-800">
                    <p className="font-bold flex items-center gap-1 mb-1"><AlertTriangle className="w-3 h-3" /> Credenciales Demo:</p>
                    <div className="flex justify-between items-center bg-white p-2 rounded border border-blue-100 mb-1">
                        <code className="text-slate-600">dr.prueba@vetmovil.com</code>
                    </div>
                    <div className="flex justify-between items-center bg-white p-2 rounded border border-blue-100">
                        <code className="text-slate-600">password123</code>
                    </div>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Correo Profesional</label>
                        <input
                            type="email"
                            required
                            className="w-full border border-slate-300 p-3 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none transition-all"
                            placeholder="doctor@vetmovil.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    {mode === 'password' && (
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">Contraseña</label>
                            <input
                                type="password"
                                required
                                className="w-full border border-slate-300 p-3 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none transition-all"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-black transition-all shadow-lg flex justify-center items-center gap-2 disabled:opacity-70"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>{mode === 'magic' ? 'Enviar Enlace de Acceso' : 'Iniciar Sesión'} <ArrowRight className="w-4 h-4" /></>}
                    </button>
                </form>

                {message && (
                    <div className={`mt-6 p-4 rounded-xl text-sm font-medium text-center flex items-center gap-2 justify-center ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                        {message.type === 'error' && <AlertTriangle className="w-4 h-4" />}
                        {message.text}
                    </div>
                )}

                <div className="mt-8 text-center">
                    <a href="/" className="text-sm text-slate-400 hover:text-slate-600">Volver al inicio</a>
                </div>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-teal-600" /></div>}>
            <LoginContent />
        </Suspense>
    );
}
