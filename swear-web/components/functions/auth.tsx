import supabaseClient from "../../supabase/client";

//Creates a new user with email and password
const CreateNewUser = async (email: string, password: string) => {
    const { data, error } = await supabaseClient.auth.signUp({
        email: email,
        password: password,
    })
    // console.log(data, error);
}

//Signs in a user with email and password
const SignInUser = async (email: string, password: string) => {
    const { data, error }  =  await supabaseClient.auth.signInWithPassword({
        email: email,
        password: password,
    })
    // console.log(data, error);   
}

//Signs out the current user
const SignOutUser = async () => {
    const { error } = await supabaseClient.auth.signOut();
    // console.log(error);
}

const CheckIfAuthenticated = async () => {
    const { data, error } = await supabaseClient.auth.getUser();
    if (error) {
        // console.error("Error fetching user:", error);
        return false;
    }else if (!data.user) {
        // console.log("No user is authenticated.");
        return false;
    }
    return true;
}

export { CreateNewUser, SignInUser, SignOutUser, CheckIfAuthenticated };