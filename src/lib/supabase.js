import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase credentials missing! Real-time features will not work.');
}

export const supabase = createClient(
    supabaseUrl || 'https://placeholder.supabase.co',
    supabaseAnonKey || 'placeholder'
);

export const checkSupabaseConfig = () => {
    if (!supabaseUrl || !supabaseAnonKey) {
        return {
            valid: false,
            message: 'Faltan las credenciales de Supabase en .env.local'
        };
    }
    return { valid: true };
};
