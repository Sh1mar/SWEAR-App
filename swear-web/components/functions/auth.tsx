import { Sign } from "crypto";
import {supabaseClient, supabaseAdmin} from "../../supabase/client";
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
    return supabaseClient.auth.getUser().then(
        ({ data, error }) => {
            const userId = data.user?.id;
            if (userId && !error) {
                DeleteAllSessionsAndMessages().then((success) => {
                    if(success) {
                        supabaseAdmin.auth.admin.deleteUser(userId).then(
                        ({ error }) => {
                            if (error) {
                                console.log("Error deleting user:", error);
                                return false;
                            }
                            window.location.href = "/auth/login";
                            return true;
                        });
                    }else{
                        console.log("Failed to delete all sessions and messages.");
                        return false;
                    }
                });
                
            }
            return false;
        }
    );
}

export { CreateNewUser, SignInUser, SignOutUser, CheckIfAuthenticated, DeleteUser };