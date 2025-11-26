
import React, { useState, useEffect, useRef } from 'react';
import {
    Stethoscope, LogOut, Clock, CheckCircle, MapPin, UserPlus, Users, ChevronRight, Dog, ArrowRight, X, Move, Calendar
} from 'lucide-react';
import { PetDetailView } from './features/PetDetailView';
import { ConsultationFlow } from './features/ConsultationFlow';
import { BookingWizard } from './features/BookingWizard';
import { AdmissionModal } from './features/AdmissionModal';

export const VetMovilApp = ({ currentUser, onLogout, pets, appointments, handleBookingComplete, handleAdmit, handleConsultationFinish, handleUpdatePet }) => {
    const [view, setView] = useState('list');
    const [selectedPet, setSelectedPet] = useState(null);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [showBookingWizard, setShowBookingWizard] = useState(false);
    const [showAdmissionModal, setShowAdmissionModal] = useState(false);

    // Handlers para navegación interna
    const goToDetail = (pet) => { setSelectedPet(pet); setView('detail'); };
    const goToConsultation = () => { setView('consultation'); };
    const goBack = () => { setView('list'); setSelectedPet(null); };

    // ANTIGRAVITY EFFECT LOGIC
    const [antigravityEnabled, setAntigravityEnabled] = useState(false);
    const [engine, setEngine] = useState(null);
    const [render, setRender] = useState(null);
    const [runner, setRunner] = useState(null);

    // Referencia al contenedor principal para clonar
    const containerRef = useRef(null);

    // Función para activar la antigravedad
    const toggleAntigravity = () => {
        if (antigravityEnabled) {
            // Desactivar y recargar (simple reload para limpiar)
            window.location.reload();
            return;
        }

        setAntigravityEnabled(true);

        // Cargar Matter.js dinámicamente si no existe
        if (!window.Matter) {
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/matter-js/0.19.0/matter.min.js';
            script.onload = initPhysics;
            document.body.appendChild(script);
        } else {
            initPhysics();
        }
    };

    const initPhysics = () => {
        const Matter = window.Matter;
        if (!Matter) return;

        const Engine = Matter.Engine,
            Render = Matter.Render,
            Runner = Matter.Runner,
            Bodies = Matter.Bodies,
            Composite = Matter.Composite,
            Mouse = Matter.Mouse,
            MouseConstraint = Matter.MouseConstraint,
            Common = Matter.Common;

        // Crear motor
        const newEngine = Engine.create();
        setEngine(newEngine);

        // Crear renderer
        const newRender = Render.create({
            element: document.body,
            engine: newEngine,
            options: {
                width: window.innerWidth,
                height: window.innerHeight,
                wireframes: false,
                background: '#f1f5f9' // Slate-100
            }
        });
        setRender(newRender);

        // Recolectar elementos del DOM para "físicalizarlos"
        const elementsToPhysics = document.querySelectorAll('button, .bg-white, h1, h2, p, nav, .rounded-xl');
        const bodies = [];

        elementsToPhysics.forEach(el => {
            const rect = el.getBoundingClientRect();
            // Evitar elementos muy grandes o fuera de pantalla
            if (rect.width > 0 && rect.height > 0 && rect.top >= 0) {

                // Crear textura visual (canvas screenshot simple o color plano)
                // Para simplificar en este demo, usaremos rectangulos de colores
                // En una implementación real usaríamos html2canvas

                const color = window.getComputedStyle(el).backgroundColor;
                const isTransparent = color === 'rgba(0, 0, 0, 0)' || color === 'transparent';

                const body = Bodies.rectangle(
                    rect.left + rect.width / 2,
                    rect.top + rect.height / 2,
                    rect.width,
                    rect.height,
                    {
                        render: {
                            fillStyle: isTransparent ? '#334155' : color, // Color fallback
                            strokeStyle: '#cbd5e1',
                            lineWidth: 1
                        },
                        restitution: 0.5 // Rebote
                    }
                );
                bodies.push(body);

                // Ocultar elemento original
                el.style.visibility = 'hidden';
            }
        });

        // Agregar paredes (Suelo, techo, lados)
        const wallOptions = { isStatic: true, render: { fillStyle: '#cbd5e1' } };
        const ground = Bodies.rectangle(window.innerWidth / 2, window.innerHeight + 50, window.innerWidth, 100, wallOptions);
        const ceiling = Bodies.rectangle(window.innerWidth / 2, -50, window.innerWidth, 100, wallOptions);
        const leftWall = Bodies.rectangle(-50, window.innerHeight / 2, 100, window.innerHeight, wallOptions);
        const rightWall = Bodies.rectangle(window.innerWidth + 50, window.innerHeight / 2, 100, window.innerHeight, wallOptions);

        Composite.add(newEngine.world, [...bodies, ground, ceiling, leftWall, rightWall]);

        // Agregar control con mouse
        const mouse = Mouse.create(newRender.canvas);
        const mouseConstraint = MouseConstraint.create(newEngine, {
            mouse: mouse,
            constraint: {
                stiffness: 0.2,
                render: {
                    visible: false
                }
            }
        });
        Composite.add(newEngine.world, mouseConstraint);
        newRender.mouse = mouse;

        // Iniciar
        Render.run(newRender);
        const newRunner = Runner.create();
        setRunner(newRunner);
        Runner.run(newRunner, newEngine);
    };

    // Limpieza al desmontar
    useEffect(() => {
        return () => {
            if (render) {
                const Matter = window.Matter;
                if (Matter) {
                    Matter.Render.stop(render);
                    if (runner) Matter.Runner.stop(runner);
                    if (render.canvas) render.canvas.remove();
                }
            }
        };
    }, []);


    return (
        <div ref={containerRef} className="min-h-screen bg-slate-50 font-sans text-slate-800">
            <nav className="bg-white px-6 h-16 flex items-center justify-between border-b border-slate-200 sticky top-0 z-20 shadow-sm">
                <div className="font-bold flex items-center gap-2 text-lg"><div className="bg-teal-600 p-1.5 rounded-lg text-white"><Stethoscope className="w-4 h-4" /></div>VetMovil {currentUser.role === 'vet' && <span className="bg-slate-900 text-white text-[10px] px-2 py-0.5 rounded uppercase tracking-wider">PRO</span>}</div>
                <div className="flex items-center gap-4"><span className="text-sm font-medium hidden md:block">{currentUser.name}</span><button onClick={onLogout} className="p-2 hover:bg-red-50 hover:text-red-500 rounded-full transition-colors"><LogOut className="w-5 h-5" /></button></div>
            </nav>

            <main className="max-w-5xl mx-auto p-4 md:p-6">

                {/* VISTA VETERINARIO: DASHBOARD */}
                {currentUser.role === 'vet' && view === 'list' && (
                    <div className="space-y-8 animate-fade-in">
                        <div>
                            <h2 className="font-bold text-lg mb-4 flex items-center gap-2 text-slate-700"><div className="bg-orange-100 p-1.5 rounded text-orange-600"><Clock className="w-4 h-4" /></div> Solicitudes Pendientes ({appointments.length})</h2>
                            {appointments.length === 0 ? <div className="text-slate-400 text-sm italic border-l-4 border-slate-200 pl-3">No hay solicitudes nuevas por ahora.</div> : (
                                <div className="grid gap-4">
                                    {appointments.map(appt => (
                                        <div key={appt.id} className="bg-white p-5 rounded-xl border border-orange-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:shadow-md transition-shadow">
                                            <div>
                                                <div className="flex items-center gap-3 mb-1"><span className="font-bold text-lg text-slate-800">{appt.ownerName}</span><span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold flex items-center gap-1"><CheckCircle className="w-3 h-3" /> RESERVA PAGADA</span></div>
                                                <p className="text-sm text-slate-600">Paciente: <strong>{appt.petName}</strong> • RUT: {appt.ownerRut}</p>
                                                {appt.address && <p className="text-xs text-slate-500 mt-1 flex items-center gap-1"><MapPin className="w-3 h-3" /> {appt.address}</p>}
                                                <p className="text-sm text-slate-500 mt-2 bg-slate-50 p-2 rounded italic">"{appt.description}"</p>
                                            </div>
                                            <button onClick={() => { setSelectedAppointment(appt); setShowAdmissionModal(true); }} className="bg-slate-900 text-white px-5 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-black whitespace-nowrap shadow-lg shadow-slate-300"><UserPlus className="w-4 h-4" /> Registrar Paciente</button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div>
                            <h2 className="font-bold text-lg mb-4 flex items-center gap-2 text-slate-700"><div className="bg-teal-100 p-1.5 rounded text-teal-600"><Users className="w-4 h-4" /></div> Base de Pacientes ({pets.length})</h2>
                            <div className="grid md:grid-cols-2 gap-4">
                                {pets.map(p => (
                                    <div key={p.id} onClick={() => goToDetail(p)} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between hover:border-teal-500 hover:shadow-md cursor-pointer transition-all group">
                                        <div className="flex gap-4 items-center"><div className="text-4xl bg-slate-50 p-3 rounded-full border border-slate-100 group-hover:bg-teal-50 transition-colors">{p.image}</div><div><h3 className="font-bold text-slate-800 group-hover:text-teal-700 transition-colors">{p.name}</h3><p className="text-xs text-slate-500 font-medium">{p.breed} • {p.ownerName}</p></div></div>
                                        <div className="bg-slate-50 p-2 rounded-full group-hover:bg-teal-600 group-hover:text-white transition-all"><ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-white" /></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* VISTA CLIENTE: HOME */}
                {currentUser.role === 'client' && view === 'list' && (
                    <div className="animate-fade-in">
                        <div className="bg-gradient-to-br from-teal-600 to-teal-800 text-white p-8 rounded-3xl mb-8 shadow-xl text-center relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                            <h2 className="text-3xl font-bold mb-2 relative z-10">Hola, {currentUser.name.split(' ')[0]}</h2>
                            <p className="opacity-90 text-sm mb-8 relative z-10 max-w-md mx-auto">Tus mascotas merecen la mejor atención sin salir de casa. Agenda tu visita ahora.</p>
                            <button onClick={() => setShowBookingWizard(true)} className="bg-white text-teal-900 px-8 py-3 rounded-xl font-bold text-sm shadow-lg hover:bg-teal-50 transition-transform hover:scale-105 flex items-center gap-2 mx-auto relative z-10"><Calendar className="w-4 h-4" /> Agendar Nueva Cita</button>
                        </div>

                        {/* SOLICITUDES PENDIENTES (CLIENTE) */}
                        {appointments.filter(a => a.ownerId === currentUser.id).length > 0 && (
                            <div className="mb-6 animate-fade-in">
                                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2 text-orange-600"><Clock className="w-5 h-5" /> Solicitudes Enviadas</h3>
                                <div className="grid gap-3">
                                    {appointments.filter(a => a.ownerId === currentUser.id).map(a => (
                                        <div key={a.id} className="bg-orange-50 border border-orange-200 p-4 rounded-xl flex gap-4 items-center">
                                            <div className="bg-white p-2 rounded-full border border-orange-100"><Clock className="w-6 h-6 text-orange-500 animate-pulse" /></div>
                                            <div><p className="font-bold text-slate-800">Cita para {a.petName}</p><p className="text-xs text-slate-500">Estado: Esperando confirmación del veterinario</p></div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="mb-4">
                            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Dog className="w-5 h-5" /> Mis Mascotas Registradas</h3>
                            {pets.filter(p => p.ownerId === currentUser.id).length === 0 ? (
                                <p className="text-slate-400 text-sm">Aún no tienes mascotas registradas.</p>
                            ) : (
                                <div className="grid gap-3">
                                    {pets.filter(p => p.ownerId === currentUser.id).map(p => (
                                        <div key={p.id} onClick={() => goToDetail(p)} className="bg-white p-4 border rounded-xl flex gap-4 cursor-pointer hover:shadow-md transition-shadow">
                                            <span className="text-3xl bg-slate-50 p-2 rounded-full">{p.image}</span>
                                            <div className="flex-1"><p className="font-bold text-slate-800">{p.name}</p><p className="text-xs text-slate-500">Última visita: {p.lastCheckup}</p></div>
                                            <ArrowRight className="text-slate-300 self-center" />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {view === 'detail' && (
                    <PetDetailView
                        pet={selectedPet}
                        role={currentUser.role}
                        onBack={goBack}
                        onStartConsultation={goToConsultation}
                        onUpdatePet={handleUpdatePet}
                    />
                )}

                {view === 'consultation' && currentUser.role === 'vet' && (
                    <ConsultationFlow
                        pet={selectedPet}
                        onFinish={(data) => { handleConsultationFinish(data); goBack(); }}
                        onCancel={goBack}
                    />
                )}

                {showBookingWizard && <BookingWizard defaultAddress={currentUser.role === 'client' ? currentUser.address : ''} onClose={() => setShowBookingWizard(false)} onComplete={handleBookingComplete} />}
                {showAdmissionModal && selectedAppointment && <AdmissionModal appointment={selectedAppointment} onClose={() => setShowAdmissionModal(false)} onAdmit={handleAdmit} />}

            </main>

            {/* Botón de Antigravedad Secreto (Pie de página) */}
            <footer className="fixed bottom-2 right-2 opacity-50 hover:opacity-100 transition-opacity">
                <button
                    onClick={toggleAntigravity}
                    className={`p-2 rounded-full shadow-lg border ${antigravityEnabled ? 'bg-red-500 text-white border-red-600' : 'bg-slate-800 text-white border-slate-900'}`}
                    title="Activar Modo Gravedad Cero"
                >
                    {antigravityEnabled ? <X className="w-4 h-4" /> : <Move className="w-4 h-4" />}
                </button>
            </footer>
        </div>
    );
};
