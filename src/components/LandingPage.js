import React from 'react';
import { Stethoscope, Zap, ArrowRight, Smartphone, QrCode, Calendar } from 'lucide-react';
import { MOCK_USERS } from '../data/mocks';

export const LandingPage = ({ onLogin }) => {
    return (
        <div className="min-h-screen bg-white font-sans text-slate-900">
            {/* Navbar Landing */}
            <nav className="flex justify-between items-center p-6 max-w-6xl mx-auto">
                <div className="flex items-center gap-2 font-bold text-xl tracking-tight text-teal-900">
                    <div className="bg-teal-600 p-2 rounded-xl text-white shadow-lg shadow-teal-200"><Stethoscope className="w-6 h-6" /></div>
                    VetMovil
                </div>
                <div className="hidden md:flex gap-8 text-sm font-medium text-slate-500">
                    <a href="#" className="hover:text-teal-600 transition-colors">Características</a>
                    <a href="#" className="hover:text-teal-600 transition-colors">Precios</a>
                    <a href="#" className="hover:text-teal-600 transition-colors">Testimonios</a>
                </div>
                <div className="flex gap-3">
                    <button onClick={() => onLogin('vet')} className="bg-slate-900 text-white px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-black transition-all shadow-lg shadow-slate-200">Iniciar Sesión</button>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="max-w-6xl mx-auto px-6 py-20 md:py-32 grid md:grid-cols-2 gap-12 items-center">
                <div>
                    <div className="inline-flex items-center gap-2 bg-teal-50 text-teal-800 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide mb-6"><Zap className="w-4 h-4" /> Nuevo: Pagos QR Integrados</div>
                    <h1 className="text-5xl md:text-6xl font-extrabold leading-tight text-slate-900 mb-6">
                        Tu veterinaria,<br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-500">donde vayas.</span>
                    </h1>
                    <p className="text-lg text-slate-500 mb-8 leading-relaxed max-w-lg">
                        La plataforma todo en uno para veterinarios a domicilio. Historias clínicas, agenda inteligente y cobros automáticos en una sola app.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <button onClick={() => window.location.href = '/demo'} className="bg-teal-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-teal-700 transition-all shadow-xl shadow-teal-200 flex items-center justify-center gap-2">
                            Probar Demo Gratis <ArrowRight className="w-5 h-5" />
                        </button>
                        <button className="px-8 py-4 rounded-xl font-bold text-lg border-2 border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-800 transition-all">
                            Ver Video
                        </button>
                    </div>
                    <div className="mt-10 flex items-center gap-4 text-sm text-slate-400 font-medium">
                        <div className="flex -space-x-2">
                            {[1, 2, 3, 4].map(i => <div key={i} className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white"></div>)}
                        </div>
                        +500 Veterinarios confían en nosotros
                    </div>
                </div>
                <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-tr from-teal-200 to-purple-200 rounded-full filter blur-3xl opacity-30 animate-pulse"></div>
                    <div className="relative bg-white p-6 rounded-3xl shadow-2xl border border-slate-100 transform rotate-3 hover:rotate-0 transition-transform duration-500">
                        {/* Mockup UI */}
                        <div className="flex items-center gap-4 mb-6 border-b pb-4">
                            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-2xl">🐕</div>
                            <div>
                                <div className="h-4 w-32 bg-slate-800 rounded mb-2"></div>
                                <div className="h-3 w-20 bg-slate-200 rounded"></div>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div className="h-12 w-full bg-slate-50 rounded-lg border border-slate-100 flex items-center px-4 gap-3">
                                <div className="w-4 h-4 bg-teal-500 rounded-full"></div>
                                <div className="h-2 w-24 bg-slate-200 rounded"></div>
                            </div>
                            <div className="h-12 w-full bg-slate-50 rounded-lg border border-slate-100 flex items-center px-4 gap-3">
                                <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
                                <div className="h-2 w-32 bg-slate-200 rounded"></div>
                            </div>
                        </div>
                        <div className="mt-6 bg-slate-900 text-white p-4 rounded-xl text-center font-bold text-sm">Confirmar Consulta</div>
                    </div>
                </div>
            </header>

            {/* Features Grid */}
            <section className="bg-slate-50 py-20">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">Todo lo que necesitas para crecer</h2>
                        <p className="text-slate-500 max-w-2xl mx-auto">Deja el papel y el lápiz. VetMovil automatiza tu negocio para que te concentres en tus pacientes.</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { icon: Smartphone, title: "Ficha Clínica Digital", desc: "Accede al historial completo de tus pacientes desde tu celular, incluso sin internet." },
                            { icon: QrCode, title: "Pagos Integrados", desc: "Genera códigos QR de cobro al instante y recibe el dinero en tu cuenta automáticamente." },
                            { icon: Calendar, title: "Agenda Inteligente", desc: "Tus clientes reservan y pagan online. Reduce el ausentismo a cero." }
                        ].map((feat, idx) => (
                            <div key={idx} className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-shadow border border-slate-100">
                                <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center text-teal-600 mb-6"><feat.icon className="w-6 h-6" /></div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">{feat.title}</h3>
                                <p className="text-slate-500 leading-relaxed">{feat.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Final */}
            <section className="py-20 text-center px-6">
                <div className="max-w-4xl mx-auto bg-slate-900 rounded-3xl p-12 md:p-20 text-white relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                    <h2 className="text-3xl md:text-5xl font-bold mb-6 relative z-10">¿Listo para modernizar tu consulta?</h2>
                    <p className="text-slate-400 mb-10 max-w-xl mx-auto relative z-10">Únete a la red de veterinarios más moderna de Latinoamérica.</p>
                    <button onClick={() => onLogin('vet')} className="bg-teal-500 text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-teal-400 transition-all shadow-lg shadow-teal-500/30 relative z-10">
                        Comenzar Ahora
                    </button>
                </div>
            </section>

            <footer className="bg-white py-12 border-t border-slate-100 text-center text-slate-400 text-sm">
                <p>© 2024 VetMovil SaaS. Hecho con ❤️ para los animales.</p>
            </footer>
        </div>
    );
};
