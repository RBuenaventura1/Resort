import { createClient } from '@supabase/supabase-js';

// Replace these with your actual Supabase Project URL and Anon/Public Key from your Supabase dashboard
const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY';

export const supabase = createClient(supabaseUrl, supabaseKey);