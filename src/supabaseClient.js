import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || import.meta.env.NEXT_PUBLIC_SUPABASE_URL || import.meta.env.SUPABASE_URL || 'https://qxpvturezwiccfliafed.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || import.meta.env.SUPABASE_ANON_KEY || 'sb_publishable_docJ6oFmMduDgsQYvoCQ0w_Fz9xecLI';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
