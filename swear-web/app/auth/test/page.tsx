"use client"
import { CreateNewUser, SignInUser, SignOutUser } from "@/components/functions/auth"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { setUserEmail, setUserPassword } from "@/redux/auth/auth";

export default function Test(){
    const dispatch = useAppDispatch();
    const userEmail = useAppSelector((state) => state.auth.userEmail);
    const userPassword = useAppSelector((state) => state.auth.userPassword);

    return(
        <div>
            <h1>test</h1>
            <h2>User Email: {userEmail}</h2>
            <input type="text" placeholder="New Email" onChange={(e) => dispatch(setUserEmail(e.target.value))} />
            <h2>User Password: {userPassword}</h2>
            <input type="password" placeholder="New Password" onChange={(e) => dispatch(setUserPassword(e.target.value))} />
            {/* <button onClick={() => CreateNewUser('email@gmail.com', 'password123')}>yeee</button>
            <button onClick={() => SignOutUser()}>Sign Out</button> */}
        </div>
    )
}