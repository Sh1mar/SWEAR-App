import { retry } from "@reduxjs/toolkit/query";
import {supabaseClient} from "../../supabase/client";
import { DeleteAllSessionsAndMessages } from "./dashboard";
import { error } from "console";

//Verifies if the user is authenticated and email is confirmed
// Returns an object with error message if any, and success boolean
const VerifyValidUser = async () : Promise<{ error?: string; success?: boolean }> => {
    const { data, error } = await supabaseClient.auth.getUser();
    if (!error && data.user) {
        return { success: true, error : "None" };
    }
    return { error: "User not found", success: false };
}

//Creates a new user with email and password
// Returns an object with error message if any, and success boolean
const CreateNewUser = async (email: string, password: string) : Promise<{ error?: string; success?: boolean }> => {
    const { data, error } = await supabaseClient.auth.signUp({
        email: email,
        password: password,
    })
    if (!error && data.user) {
        if (data.user.email_confirmed_at) {
            return { success: true, error: "None" };
        }else{
            return { error: "Email not confirmed" , success: false };
        }
    }
    return { error: "Sign in failed", success: false };   
}

//Signs in a user with email and password
// Returns an object with error message if any, and success boolean
const SignInUser = async (email: string, password: string) : Promise<{ error?: string; success?: boolean }> => {
    const { data, error }  =  await supabaseClient.auth.signInWithPassword({
        email: email,
        password: password,
    })
    if (!error && data.user) {
        if (data.user.email_confirmed_at) {
            return { success: true, error: "None" };
        }else{
            return { error: "Email not confirmed" , success: false };
        }
    }
    return { error: "Sign in failed", success: false };
}

//Signs out the current user
// Returns an object with success status and message
const SignOutUser = async () : Promise<{success? : boolean, error? : string}> => {

    const {success} = await VerifyValidUser();

    if(success) {
        const { error } = await supabaseClient.auth.signOut();
        if (error) {
            return { success: false, error: error.message };
        }
        return { success: true, error : "None" };
    }
    return {success : false, error : "None"}
}

// const CheckIfAuthenticated = async () => {
//     const { data, error } = await supabaseClient.auth.getUser();
//     if (error) {
//         // console.log("Error fetching user:", error);
//         return false;
//     }else if (!data.user) {
//         // console.log("No user is authenticated.");
//         return false;
//     }
//     return true;
// }

// Delete user account and all associated data
// Returns an object with success status and message
const DeleteUser = async () : Promise<{error? : string, success? : boolean}> => {
    const {success} = await VerifyValidUser();
    if(success){
        const { data } = await supabaseClient.auth.getUser();
        const success = await DeleteAllSessionsAndMessages();
        if (!success) {
            return {success : false, error : "Failed to delete sessions/messages."};
        }
        const response = await fetch("/api/delete-user", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: data.user?.id }),
        });
        const result = await response.json();
        if (!result.success) {
            return {success : false, error : "User data deleted but failed to delete user"};
        }
        window.location.href = "/auth/login";
        return {success : true, error : "None"};
    }
    return {success : false, error : "No access to deleting user account"}
}

export { CreateNewUser, SignInUser, SignOutUser, DeleteUser, VerifyValidUser };