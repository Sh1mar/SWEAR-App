import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ? process.env.NEXT_PUBLIC_SUPABASE_URL : '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY : '';
const supabaseServiceRoleKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY ? process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY : '';

const supabaseClient = createClient(supabaseUrl, supabaseAnonKey)

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);

export { supabaseClient, supabaseAdmin };