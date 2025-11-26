import React from 'react';
import { X } from 'lucide-react';

export const Badge = ({ children, color = 'blue', onDelete }) => {
    const colors = {
        blue: 'bg-blue-100 text-blue-800',
        red: 'bg-red-100 text-red-800',
        yellow: 'bg-amber-100 text-amber-800',
        green: 'bg-green-100 text-green-800',
        gray: 'bg-slate-100 text-slate-600',
    };
    return (
        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold flex items-center gap-1 ${colors[color] || colors.gray}`}>
            {children}
            {onDelete && <button onClick={onDelete} className="hover:text-red-600 cursor-pointer"><X className="w-3 h-3" /></button>}
        </span>
    );
};
