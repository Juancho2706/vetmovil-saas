import React, { useState, useEffect, useRef } from 'react';
import {
    Stethoscope, LogOut, Clock, CheckCircle, MapPin, UserPlus, Users, ChevronRight, Dog, ArrowRight, X, Move, Calendar, Globe, Link as LinkIcon, Settings, Share
} from 'lucide-react';
import { PetDetailView } from './features/PetDetailView';
import { ConsultationFlow } from './features/ConsultationFlow';
import { BookingWizard } from './features/BookingWizard';
import { AdmissionModal } from './features/AdmissionModal';

// Separate components for better organization could be done, but keeping in one file for now as requested
const PublicProfile = ({ vetName, onBook }) => (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 animate-fade-in">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden">
            <div className="bg-slate-900 h-32 relative">
                <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
                    <div className="w-24 h-24 bg-white rounded-full p-2 shadow-lg">
                        <div className="w-full h-full bg-teal-100 rounded-full flex items-center justify-center text-3xl">👨‍⚕️</div>
                    </div>
                </div>
            </div>
            <div className="pt-16 pb-8 px-8 text-center">
                <h1 className="text-2xl font-bold text-slate-800">{vetName}</h1>
                <p className="text-teal-600 font-medium text-sm mb-4">Veterinario a Domicilio • Santiago</p>
                <div className="flex gap-2 justify-center mb-8">
                    <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-bold">🐶 Perros</span>
                    <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-bold">🐱 Gatos</span>
                    <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-bold">🐰 Exóticos</span>
                </div>

                <h3 className="font-bold text-slate-700 text-sm mb-2 text-left">Sobre mi</h3>
                <p className="text-slate-500 text-sm text-left mb-8 leading-relaxed">
                    Especialista en medicina preventiva y urgencias básicas. Llevo la clínica a la comodidad de tu hogar para reducir el estrés de tus mascotas.
                </p>

                <button onClick={onBook} className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold text-lg shadow-xl shadow-slate-300 hover:bg-black transition-transform hover:scale-[1.02] flex justify-center items-center gap-2">
                    <Calendar className="w-5 h-5" /> Agendar Visita
                </button>
            </div>
        </div>
        <p className="mt-8 text-xs text-slate-400 flex items-center gap-1">
            <Globe className="w-3 h-3" /> Powered by <span className="font-bold">VetMovil</span>
        </p>
    </div>
);

export const VetMovilApp = ({ viewMode, currentUser, onLogout, pets, appointments, handleBookingComplete, handleAdmit, handleConsultationFinish, handleUpdatePet, onUpdateProfile }) => {
    // viewMode: 'vet_dashboard' | 'client_dashboard' | 'public_profile'

    const [view, setView] = useState('list');
    const [selectedPet, setSelectedPet] = useState(null);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [showBookingWizard, setShowBookingWizard] = useState(false);
    const [showAdmissionModal, setShowAdmissionModal] = useState(false);

    // Settings State
    const [profileForm, setProfileForm] = useState({ name: '', address: '', slug: '' });

    useEffect(() => {
        if (currentUser) {
            setProfileForm({
                name: currentUser.name || '',
                address: currentUser.address || '',
                slug: currentUser.id || '' // Default slug to ID for now if not present
            });
        }
    }, [currentUser]);

    // Handlers para navegación interna
    const goToDetail = (pet) => { setSelectedPet(pet); setView('detail'); };
    const goToConsultation = () => { setView('consultation'); };
    const goBack = () => { setView('list'); setSelectedPet(null); };

    const saveProfile = () => {
        if (onUpdateProfile) {
            onUpdateProfile({ ...currentUser, ...profileForm });
        }
        alert('Perfil actualizado (Simulado)');
        setView('list');
    };

    // Common Layout or Specific Layout based on mode
    if (viewMode === 'public_profile') {
        return (
            <>
                <PublicProfile vetName="Dr. Alejandro Martínez" onBook={() => setShowBookingWizard(true)} />
                {showBookingWizard && <BookingWizard onClose={() => setShowBookingWizard(false)} onComplete={(data) => { setShowBookingWizard(false); handleBookingComplete(data); alert('✅ Cita solicitada con éxito. Te hemos enviado un link de seguimiento a tu correo.'); }} />}
            </>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
            {/* NAV BAR */}
            <nav className="bg-white px-6 h-16 flex items-center justify-between border-b border-slate-200 sticky top-0 z-20 shadow-sm">
                <div className="font-bold flex items-center gap-2 text-lg">
                    <div className="bg-teal-600 p-1.5 rounded-lg text-white"><Stethoscope className="w-4 h-4" /></div>
                    VetMovil
                    {viewMode === 'vet_dashboard' && <span className="bg-slate-900 text-white text-[10px] px-2 py-0.5 rounded uppercase tracking-wider">PRO</span>}
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-sm font-medium hidden md:block">{currentUser?.name}</span>

                    {viewMode === 'vet_dashboard' && (
                        <button onClick={() => setView('settings')} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600" title="Configuración">
                            <Settings className="w-5 h-5" />
                        </button>
                    )}

                    <button onClick={onLogout} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600">
                        {viewMode === 'client_dashboard' ? 'Salir' : <LogOut className="w-5 h-5" />}
                    </button>
                </div>
            </nav>

            <main className="max-w-5xl mx-auto p-4 md:p-6">

                {/* --- SETTINGS VIEW --- */}
                {view === 'settings' && viewMode === 'vet_dashboard' && (
                    <div className="max-w-xl mx-auto animate-fade-in">
                        <div className="flex items-center gap-2 mb-6">
                            <button onClick={goBack} className="p-2 hover:bg-slate-100 rounded-full"><ArrowRight className="w-5 h-5 rotate-180" /></button>
                            <h2 className="text-2xl font-bold text-slate-800">Configuración de Perfil</h2>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Nombre Público</label>
                                <input
                                    value={profileForm.name}
                                    onChange={e => setProfileForm({ ...profileForm, name: e.target.value })}
                                    className="w-full border border-slate-300 p-3 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                                />
                                <p className="text-xs text-slate-400 mt-1">Así te verán tus clientes.</p>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Dirección / Consulta</label>
                                <input
                                    value={profileForm.address}
                                    onChange={e => setProfileForm({ ...profileForm, address: e.target.value })}
                                    className="w-full border border-slate-300 p-3 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Tu Enlace Público</label>
                                <div className="flex items-center gap-2 bg-slate-50 p-3 rounded-lg border border-slate-200 text-slate-500">
                                    <Globe className="w-4 h-4" />
                                    <span className="text-sm">vetmovil.com/u/</span>
                                    <span className="font-bold text-slate-700 truncate">{profileForm.slug}</span>
                                </div>
                                <p className="text-xs text-slate-400 mt-1">Comparte este link para que agenden contigo.</p>
                            </div>

                            <hr className="border-slate-100" />

                            <button onClick={saveProfile} className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-black transition-colors">
                                Guardar Cambios
                            </button>
                        </div>
                    </div>
                )}

                {/* --- VET DASHBOARD --- */}
                {viewMode === 'vet_dashboard' && view === 'list' && (
                    <div className="space-y-8 animate-fade-in">

                        {/* SHARE CARD BANNER */}
                        <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-6 rounded-2xl shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="flex-1">
                                <h2 className="text-xl font-bold mb-2 flex items-center gap-2">🚀 Tu Consultorio Online está activo</h2>
                                <p className="text-slate-300 text-sm mb-4">Comparte este enlace para que tus clientes agenden contigo automáticamente.</p>

                                <div className="flex items-center gap-2 bg-slate-900/50 p-1.5 pl-4 rounded-xl border border-slate-700 max-w-md">
                                    <Globe className="w-4 h-4 text-teal-400 flex-shrink-0" />
                                    <span className="text-sm font-mono text-teal-100 truncate flex-1">{window.location.host}/u/{currentUser?.id}</span>
                                    <button
                                        onClick={() => {
                                            navigator.clipboard.writeText(`${window.location.host}/u/${currentUser?.id}`);
                                            alert('Enlace copiado al portapapeles 📋');
                                        }}
                                        className="bg-white text-slate-900 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-teal-50 transition-colors flex items-center gap-1"
                                    >
                                        <LinkIcon className="w-3 h-3" /> Copiar
                                    </button>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => window.open(`https://wa.me/?text=Hola!%20Agenda%20tu%20hora%20conmigo%20aquí:%20${window.location.host}/u/${currentUser?.id}`, '_blank')}
                                    className="bg-green-500 hover:bg-green-600 text-white p-3 rounded-xl transition-colors flex items-center gap-2 font-bold text-sm shadow-lg shadow-green-900/20"
                                >
                                    <span className="text-lg">💬</span> WhatsApp
                                </button>
                                <button className="bg-white/10 hover:bg-white/20 text-white p-3 rounded-xl transition-colors flex items-center justify-center">
                                    <Share className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

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

                {/* --- CLIENT DASHBOARD (MAGIC LINK VIEW) --- */}
                {viewMode === 'client_dashboard' && view === 'list' && (
                    <div className="animate-fade-in">
                        <div className="bg-teal-900 text-white p-6 rounded-3xl mb-8 shadow-xl flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-bold mb-1">Tu Portal de Mascotas</h2>
                                <p className="text-teal-200 text-sm">Acceso seguro vía Magic Link</p>
                            </div>
                            <div className="bg-white/10 p-3 rounded-full"><LinkIcon className="w-6 h-6 text-teal-200" /></div>
                        </div>

                        {/* SOLICITUDES PENDIENTES */}
                        {appointments.filter(a => a.ownerId === currentUser.id).length > 0 && (
                            <div className="mb-6 animate-fade-in">
                                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2 text-orange-600"><Clock className="w-5 h-5" /> Tus Próximas Visitas</h3>
                                <div className="grid gap-3">
                                    {appointments.filter(a => a.ownerId === currentUser.id).map(a => (
                                        <div key={a.id} className="bg-white border border-orange-200 p-4 rounded-xl flex gap-4 items-center shadow-sm">
                                            <div className="bg-orange-50 p-3 rounded-full text-orange-500 font-bold flex-col flex items-center leading-none text-xs w-14 h-14 justify-center">
                                                <span>25</span><span>MAY</span>
                                            </div>
                                            <div><p className="font-bold text-slate-800">Visita para {a.petName}</p><p className="text-xs text-slate-500">Estado: Esperando confirmación</p></div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="mb-4">
                            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Dog className="w-5 h-5" /> Tus Mascotas</h3>
                            {pets.filter(p => p.ownerId === currentUser.id).length === 0 ? (
                                <p className="text-slate-400 text-sm">Aún no tienes mascotas registradas.</p>
                            ) : (
                                <div className="grid gap-3">
                                    {pets.filter(p => p.ownerId === currentUser.id).map(p => (
                                        <div key={p.id} onClick={() => goToDetail(p)} className="bg-white p-4 border rounded-xl flex gap-4 cursor-pointer hover:shadow-md transition-shadow items-center">
                                            <span className="text-4xl bg-slate-50 p-2 rounded-2xl">{p.image}</span>
                                            <div className="flex-1"><p className="font-bold text-slate-800">{p.name}</p><p className="text-xs text-slate-500">{p.breed}</p></div>
                                            <div className="text-xs bg-slate-100 text-slate-600 px-3 py-1 rounded-full font-bold">Ver Ficha</div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* SHARED DETAIL VIEWS */}
                {view === 'detail' && (
                    <PetDetailView
                        pet={selectedPet}
                        role={viewMode === 'vet_dashboard' ? 'vet' : 'client'}
                        onBack={goBack}
                        onStartConsultation={goToConsultation}
                        onUpdatePet={handleUpdatePet}
                    />
                )}

                {view === 'consultation' && viewMode === 'vet_dashboard' && (
                    <ConsultationFlow
                        pet={selectedPet}
                        onFinish={(data) => { handleConsultationFinish(data); goBack(); }}
                        onCancel={goBack}
                    />
                )}

                {showAdmissionModal && selectedAppointment && <AdmissionModal appointment={selectedAppointment} onClose={() => setShowAdmissionModal(false)} onAdmit={handleAdmit} />}

            </main>
        </div>
    );
};
