"use client"
import { CreateNewUser, SignInUser, SignOutUser } from "@/components/functions/auth"

export default function Test(){
    return(
        <div>
            <h1>test</h1>
            <button onClick={() => CreateNewUser('email@gmail.com', 'password123')}>yeee</button>
            <button onClick={() => SignOutUser()}>Sign Out</button>
        </div>
    )
}