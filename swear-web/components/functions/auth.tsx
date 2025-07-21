import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ? process.env.NEXT_PUBLIC_SUPABASE_URL : '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY : '';

const supabase = createClient(supabaseUrl, supabaseAnonKey)

//Creates a new user with email and password
const CreateNewUser = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
    })
    console.log(data, error);
}

//Signs in a user with email and password
const SignInUser = async (email: string, password: string) => {
    const { data, error }  =  await supabase.auth.signInWithPassword({
        email: email,
        password: password,
    })
    console.log(data, error);   
}

//Signs out the current user
const SignOutUser = async () => {
    const { error } = await supabase.auth.signOut();
    console.log(error);
}

export { CreateNewUser, SignInUser, SignOutUser };