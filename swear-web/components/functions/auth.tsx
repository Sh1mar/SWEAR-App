import supabaseClient from "../../supabase/client";

//Creates a new user with email and password
const CreateNewUser = async (email: string, password: string) => {
    const { data, error } = await supabaseClient.auth.signUp({
        email: email,
        password: password,
    })
    console.log(data, error);
}

//Signs in a user with email and password
const SignInUser = async (email: string, password: string) => {
    const { data, error }  =  await supabaseClient.auth.signInWithPassword({
        email: email,
        password: password,
    })
    console.log(data, error);   
}

//Signs out the current user
const SignOutUser = async () => {
    const { error } = await supabaseClient.auth.signOut();
    console.log(error);
}

export { CreateNewUser, SignInUser, SignOutUser };