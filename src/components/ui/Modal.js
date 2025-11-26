import React from 'react';
import { X, Save } from 'lucide-react';

export const Modal = ({ title, onClose, children, onSave }) => (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] animate-fade-in">
            <div className="flex justify-between items-center p-4 border-b border-slate-100">
                <h3 className="font-bold text-lg text-slate-800">{title}</h3>
                <button onClick={onClose} className="text-slate-400 hover:text-red-500"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 overflow-y-auto custom-scrollbar">{children}</div>
            {onSave && (
                <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-lg font-medium transition-colors">Cancelar</button>
                    <button onClick={onSave} className="px-4 py-2 bg-teal-600 text-white hover:bg-teal-700 rounded-lg font-medium flex items-center gap-2 shadow-lg shadow-teal-200/50"><Save className="w-4 h-4" /> Guardar</button>
                </div>
            )}
        </div>
    </div>
);
