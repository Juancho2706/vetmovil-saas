import React, { useState } from 'react';
import { Badge } from './Badge';

export const TagInput = ({ tags = [], onChange, placeholder, color }) => {
    const [input, setInput] = useState('');
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && input.trim()) {
            e.preventDefault();
            if (!tags.includes(input.trim())) {
                onChange([...tags, input.trim()]);
            }
            setInput('');
        }
    };
    const removeTag = (index) => {
        onChange(tags.filter((_, i) => i !== index));
    };
    return (
        <div className="w-full p-2 border rounded-lg focus-within:ring-2 focus-within:ring-teal-500 bg-white">
            <div className="flex flex-wrap gap-2 mb-2">
                {tags.map((tag, idx) => (<Badge key={idx} color={color} onDelete={() => removeTag(idx)}>{tag}</Badge>))}
            </div>
            <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKeyDown} placeholder={placeholder} className="w-full outline-none text-sm" />
        </div>
    );
};
