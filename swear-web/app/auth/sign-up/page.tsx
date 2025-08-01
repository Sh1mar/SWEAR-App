"use client"

import { CreateNewUser } from "@/functions/auth";
import { setUserEmail, setUserPassword } from "@/redux/auth/auth";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useRouter } from "next/navigation";

export default function Page() {

  const router = useRouter();

  const dispatch = useAppDispatch();
  const userEmail = useAppSelector((state) => state.auth.userEmail);
  const userPassword = useAppSelector((state) => state.auth.userPassword);

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <h1>Sign Up</h1>
        <p>Email</p>
        <input onChange={(e) => dispatch(setUserEmail(e.target.value))} type="text" placeholder="Email" />
        <p>Password</p>
        <input onChange={(e) => dispatch(setUserPassword(e.target.value))} type="password" placeholder="Password" />
        <button onClick={() => CreateNewUser(userEmail, userPassword ).then(() => router.push("/auth/verify-email"))}>Sign up</button>
      </div>
    </div>
  );
}
