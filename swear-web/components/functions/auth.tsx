import {supabaseClient} from "../../supabase/client";
import { DeleteAllSessionsAndMessages } from "./dashboard";

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
        // console.log("Error fetching user:", error);
        return false;
    }else if (!data.user) {
        // console.log("No user is authenticated.");
        return false;
    }
    return true;
}

const DeleteUser = async () : Promise<boolean> => {
    const { data, error } = await supabaseClient.auth.getUser();

    if (!data.user || error) {
        console.log("User not found or error fetching user.");
        return false;
    }

    const success = await DeleteAllSessionsAndMessages();

    if (!success) {
        console.log("Failed to delete sessions/messages.");
        return false;
    }

    console.log(data.user.id)

    const response = await fetch("/api/delete-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: data.user.id }),
    });

    const result = await response.json();

    if (!result.success) {
        console.log("Failed to delete user:", result.message);
        return false;
    }

    window.location.href = "/auth/login";
    return true;
}

export { CreateNewUser, SignInUser, SignOutUser, CheckIfAuthenticated, DeleteUser };